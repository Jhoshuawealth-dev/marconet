
-- 1. Remove overly-permissive direct INSERT policies
DROP POLICY IF EXISTS "Authenticated can insert events" ON public.ad_events;
DROP POLICY IF EXISTS "Users can enroll in courses" ON public.enrolled_courses;
DROP POLICY IF EXISTS "Users can insert own stakes" ON public.staked_projects;

-- 2. Enrollment RPC (validates balance, deducts NDC, prevents duplicates)
CREATE OR REPLACE FUNCTION public.enroll_course(_course_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  cost constant integer := 200;
  bal integer;
  already boolean;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated'); END IF;
  IF _course_id IS NULL OR length(trim(_course_id)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid course');
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.enrolled_courses WHERE user_id = uid AND course_id = _course_id) INTO already;
  IF already THEN RETURN jsonb_build_object('ok', true, 'already', true); END IF;

  SELECT ndc_balance INTO bal FROM public.profiles WHERE user_id = uid FOR UPDATE;
  IF COALESCE(bal, 0) < cost THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Insufficient NDC');
  END IF;

  UPDATE public.profiles SET ndc_balance = ndc_balance - cost, updated_at = now() WHERE user_id = uid
    RETURNING ndc_balance INTO bal;

  INSERT INTO public.enrolled_courses(user_id, course_id) VALUES (uid, _course_id);
  INSERT INTO public.ndc_transactions(user_id, title, description, amount, type)
    VALUES (uid, 'Course Enrollment', 'Enrolled in course ' || _course_id, cost, 'spend');

  RETURN jsonb_build_object('ok', true, 'balance', bal);
END;
$$;

-- 3. Stake creation RPC (validates balance, sets safe defaults)
CREATE OR REPLACE FUNCTION public.create_stake(
  _project_id text,
  _amount integer,
  _project_name text DEFAULT NULL,
  _roi_percent integer DEFAULT 15,
  _duration_months integer DEFAULT 6
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  bal integer;
  stake_id uuid;
  matured timestamptz;
  safe_roi integer;
  safe_months integer;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated'); END IF;
  IF _amount IS NULL OR _amount <= 0 THEN RETURN jsonb_build_object('ok', false, 'error', 'Invalid amount'); END IF;
  IF _project_id IS NULL OR length(trim(_project_id)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid project');
  END IF;

  -- Clamp ROI (0..40%) and duration (1..24 months) so callers cannot invent values.
  safe_roi := LEAST(GREATEST(COALESCE(_roi_percent, 15), 0), 40);
  safe_months := LEAST(GREATEST(COALESCE(_duration_months, 6), 1), 24);
  matured := now() + (safe_months || ' months')::interval;

  SELECT ndc_balance INTO bal FROM public.profiles WHERE user_id = uid FOR UPDATE;
  IF COALESCE(bal, 0) < _amount THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Insufficient NDC');
  END IF;

  UPDATE public.profiles SET ndc_balance = ndc_balance - _amount, updated_at = now() WHERE user_id = uid
    RETURNING ndc_balance INTO bal;

  INSERT INTO public.staked_projects(user_id, project_id, amount, project_name, roi_percent, matured_at, status)
    VALUES (uid, _project_id, _amount, _project_name, safe_roi, matured, 'active')
    RETURNING id INTO stake_id;

  INSERT INTO public.ndc_transactions(user_id, title, description, amount, type)
    VALUES (uid, 'Stake Investment', 'Staked in ' || COALESCE(_project_name, _project_id), _amount, 'spend');

  RETURN jsonb_build_object('ok', true, 'balance', bal, 'stake_id', stake_id);
END;
$$;

-- 4. Lock down SECURITY DEFINER surface: revoke from anon/public for sensitive RPCs.
REVOKE EXECUTE ON FUNCTION public.record_ad_event(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.apply_referral_code(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.purchase_mining_upgrade(text, integer, numeric, integer, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_matured_stake(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.record_ndc_transaction(integer, text, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.enroll_course(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_stake(text, integer, text, integer, integer) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.record_ad_event(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_mining_upgrade(text, integer, numeric, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_matured_stake(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_ndc_transaction(integer, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enroll_course(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_stake(text, integer, text, integer, integer) TO authenticated;

-- get_ad_for_delivery is intentionally callable by signed-out visitors (public ad slot).
GRANT EXECUTE ON FUNCTION public.get_ad_for_delivery() TO anon, authenticated;

-- 5. Document intent for platform_settings so future contributors do not store secrets here.
COMMENT ON TABLE public.platform_settings IS
  'Non-sensitive platform configuration only. NEVER store API keys, tokens, provider secrets, or credentials in this table — use Supabase secrets or edge-function env vars instead. Admin clients can read every row via PostgREST.';
