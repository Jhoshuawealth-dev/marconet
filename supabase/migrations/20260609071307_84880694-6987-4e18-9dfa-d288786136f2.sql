
-- 1. ndc_transactions: remove direct INSERT, add SECURITY DEFINER RPC
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.ndc_transactions;

CREATE OR REPLACE FUNCTION public.record_ndc_transaction(
  _amount integer, _title text, _description text, _type text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  current_bal integer;
  new_bal integer;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;
  IF _type NOT IN ('earn','spend') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid type');
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid amount');
  END IF;

  SELECT ndc_balance INTO current_bal FROM public.profiles WHERE user_id = uid FOR UPDATE;
  IF current_bal IS NULL THEN
    INSERT INTO public.profiles (user_id, ndc_balance) VALUES (uid, 0)
      ON CONFLICT (user_id) DO NOTHING;
    current_bal := 0;
  END IF;

  IF _type = 'spend' AND current_bal < _amount THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Insufficient balance');
  END IF;

  new_bal := CASE WHEN _type = 'earn' THEN current_bal + _amount ELSE current_bal - _amount END;
  UPDATE public.profiles SET ndc_balance = new_bal, updated_at = now() WHERE user_id = uid;
  INSERT INTO public.ndc_transactions (user_id, title, description, amount, type)
    VALUES (uid, _title, _description, _amount, _type);

  RETURN jsonb_build_object('ok', true, 'balance', new_bal);
END;
$$;

REVOKE ALL ON FUNCTION public.record_ndc_transaction(integer, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_ndc_transaction(integer, text, text, text) TO authenticated;

-- 2. staked_projects: remove user UPDATE policy (state changes via RPC only)
DROP POLICY IF EXISTS "Users can update own stakes" ON public.staked_projects;

-- 3. ad_campaigns: remove public-active SELECT; add delivery RPC
DROP POLICY IF EXISTS "Active campaigns are public for delivery" ON public.ad_campaigns;

CREATE OR REPLACE FUNCTION public.get_ad_for_delivery()
RETURNS TABLE(id uuid, headline text, primary_text text)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT c.id, c.headline, c.primary_text
  FROM public.ad_campaigns c
  WHERE c.status = 'active'
    AND c.headline <> ''
    AND (auth.uid() IS NULL OR c.user_id <> auth.uid())
  ORDER BY random()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_ad_for_delivery() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_ad_for_delivery() TO authenticated;

-- 4. ad_events: tighten INSERT (no longer always-true)
DROP POLICY IF EXISTS "Authenticated can insert events" ON public.ad_events;
CREATE POLICY "Authenticated can insert events" ON public.ad_events
  FOR INSERT TO authenticated
  WITH CHECK (
    (viewer_id IS NULL OR viewer_id = auth.uid())
    AND event_type IN ('impression','click')
    AND EXISTS (SELECT 1 FROM public.ad_campaigns c WHERE c.id = campaign_id)
  );

-- 5. platform_settings: restrict role from public to authenticated
DROP POLICY IF EXISTS "Admins can delete platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can insert platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can update platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can view all platform settings" ON public.platform_settings;

CREATE POLICY "Admins can delete platform settings" ON public.platform_settings
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert platform settings" ON public.platform_settings
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update platform settings" ON public.platform_settings
  FOR UPDATE TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can view all platform settings" ON public.platform_settings
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- 6. Revoke EXECUTE from anon on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM anon, PUBLIC', r.nspname, r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO authenticated', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- 7. Realtime: drop sensitive tables from broadcast publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.ndc_transactions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.staked_projects;
ALTER PUBLICATION supabase_realtime DROP TABLE public.enrolled_courses;
