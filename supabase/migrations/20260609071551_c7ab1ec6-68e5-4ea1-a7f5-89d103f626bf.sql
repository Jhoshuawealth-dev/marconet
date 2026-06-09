
ALTER TABLE public.ad_campaigns
  ADD COLUMN IF NOT EXISTS conversions integer NOT NULL DEFAULT 0;

-- Allow 'conversion' event type
DROP POLICY IF EXISTS "Authenticated can insert events" ON public.ad_events;
CREATE POLICY "Authenticated can insert events" ON public.ad_events
  FOR INSERT TO authenticated
  WITH CHECK (
    (viewer_id IS NULL OR viewer_id = auth.uid())
    AND event_type IN ('impression','click','conversion')
    AND EXISTS (SELECT 1 FROM public.ad_campaigns c WHERE c.id = campaign_id)
  );

-- Replace record_ad_event: deduct owner wallet, cap by total budget, support conversions, auto-deplete
CREATE OR REPLACE FUNCTION public.record_ad_event(_campaign_id uuid, _event_type text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  c public.ad_campaigns%ROWTYPE;
  cost_per integer;
  owner_bal integer;
  today_spend integer;
BEGIN
  SELECT * INTO c FROM public.ad_campaigns WHERE id = _campaign_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'Campaign not found'); END IF;
  IF c.status <> 'active' THEN RETURN jsonb_build_object('ok', false, 'error', 'Campaign not active'); END IF;
  IF _event_type NOT IN ('impression','click','conversion') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bad type');
  END IF;

  cost_per := CASE _event_type
    WHEN 'click' THEN 5
    WHEN 'conversion' THEN 10
    ELSE 1
  END;

  -- Total budget cap
  IF c.total_budget > 0 AND c.spend + cost_per > c.total_budget THEN
    UPDATE public.ad_campaigns SET status = 'depleted' WHERE id = _campaign_id;
    RETURN jsonb_build_object('ok', false, 'error', 'Total budget reached');
  END IF;

  -- Daily budget cap
  IF c.daily_budget > 0 THEN
    SELECT COALESCE(SUM(CASE event_type WHEN 'click' THEN 5 WHEN 'conversion' THEN 10 ELSE 1 END),0)
      INTO today_spend
      FROM public.ad_events
     WHERE campaign_id = _campaign_id AND created_at::date = current_date;
    IF today_spend + cost_per > c.daily_budget THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Daily budget reached');
    END IF;
  END IF;

  -- Owner wallet check + deduct
  SELECT ndc_balance INTO owner_bal FROM public.profiles WHERE user_id = c.user_id FOR UPDATE;
  IF COALESCE(owner_bal,0) < cost_per THEN
    UPDATE public.ad_campaigns SET status = 'depleted' WHERE id = _campaign_id;
    RETURN jsonb_build_object('ok', false, 'error', 'Owner balance exhausted');
  END IF;
  UPDATE public.profiles SET ndc_balance = ndc_balance - cost_per WHERE user_id = c.user_id;

  INSERT INTO public.ad_events(campaign_id, viewer_id, event_type)
    VALUES (_campaign_id, auth.uid(), _event_type);

  IF _event_type = 'click' THEN
    UPDATE public.ad_campaigns SET clicks = clicks + 1, spend = spend + cost_per WHERE id = _campaign_id;
  ELSIF _event_type = 'conversion' THEN
    UPDATE public.ad_campaigns SET conversions = conversions + 1, spend = spend + cost_per WHERE id = _campaign_id;
  ELSE
    UPDATE public.ad_campaigns SET impressions = impressions + 1, spend = spend + cost_per WHERE id = _campaign_id;
  END IF;

  -- If this event exactly hit the total budget, deplete
  IF c.total_budget > 0 AND c.spend + cost_per >= c.total_budget THEN
    UPDATE public.ad_campaigns SET status = 'depleted' WHERE id = _campaign_id;
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.record_ad_event(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_ad_event(uuid, text) TO authenticated;

-- Tighten delivery: exclude depleted, exhausted budget, or where owner can't afford min impression cost
CREATE OR REPLACE FUNCTION public.get_ad_for_delivery()
RETURNS TABLE(id uuid, headline text, primary_text text)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT c.id, c.headline, c.primary_text
  FROM public.ad_campaigns c
  JOIN public.profiles p ON p.user_id = c.user_id
  WHERE c.status = 'active'
    AND c.headline <> ''
    AND (c.total_budget = 0 OR c.spend < c.total_budget)
    AND p.ndc_balance >= 1
    AND (auth.uid() IS NULL OR c.user_id <> auth.uid())
  ORDER BY random()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_ad_for_delivery() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_ad_for_delivery() TO authenticated;

-- avatars bucket policies (bucket itself created via storage_create_bucket)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
END $$;

CREATE POLICY "Avatars are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
