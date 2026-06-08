
-- Mining upgrades
CREATE TABLE public.user_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  upgrade_id text NOT NULL,
  cost integer NOT NULL DEFAULT 0,
  multiplier numeric NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_upgrades TO authenticated;
GRANT ALL ON public.user_upgrades TO service_role;
ALTER TABLE public.user_upgrades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own upgrades" ON public.user_upgrades FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all upgrades" ON public.user_upgrades FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE INDEX idx_user_upgrades_user ON public.user_upgrades(user_id, expires_at);

-- Atomic purchase RPC
CREATE OR REPLACE FUNCTION public.purchase_mining_upgrade(
  _upgrade_id text, _cost integer, _multiplier numeric, _duration_hours integer, _label text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  current_balance integer;
  new_balance integer;
  expires timestamptz;
BEGIN
  SELECT ndc_balance INTO current_balance FROM public.profiles WHERE user_id = auth.uid();
  IF current_balance IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Profile missing'); END IF;
  IF current_balance < _cost THEN RETURN jsonb_build_object('ok', false, 'error', 'Insufficient NDC'); END IF;

  expires := now() + (_duration_hours || ' hours')::interval;

  UPDATE public.profiles SET ndc_balance = ndc_balance - _cost
  WHERE user_id = auth.uid() RETURNING ndc_balance INTO new_balance;

  INSERT INTO public.user_upgrades(user_id, upgrade_id, cost, multiplier, expires_at)
  VALUES (auth.uid(), _upgrade_id, _cost, _multiplier, expires);

  INSERT INTO public.ndc_transactions(user_id, title, description, amount, type)
  VALUES (auth.uid(), 'Mining Upgrade', _label || ' (' || _duration_hours || 'h)', _cost, 'spend');

  RETURN jsonb_build_object('ok', true, 'balance', new_balance, 'expires_at', expires);
END;
$$;

-- Ad campaigns
CREATE TABLE public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  goal text NOT NULL DEFAULT 'awareness',
  audience_interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  daily_budget integer NOT NULL DEFAULT 0,
  total_budget integer NOT NULL DEFAULT 0,
  spend integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  headline text NOT NULL DEFAULT '',
  primary_text text NOT NULL DEFAULT '',
  duration_label text NOT NULL DEFAULT '7 Days',
  start_date date NOT NULL DEFAULT current_date,
  end_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_campaigns TO authenticated;
GRANT ALL ON public.ad_campaigns TO service_role;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own campaigns" ON public.ad_campaigns FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Active campaigns are public for delivery" ON public.ad_campaigns FOR SELECT TO authenticated
  USING (status = 'active');
CREATE POLICY "Admins view all campaigns" ON public.ad_campaigns FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE TRIGGER trg_ad_campaigns_updated BEFORE UPDATE ON public.ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ad events
CREATE TABLE public.ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL,
  viewer_id uuid,
  event_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ad_events TO authenticated;
GRANT ALL ON public.ad_events TO service_role;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can insert events" ON public.ad_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Owners view own campaign events" ON public.ad_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ad_campaigns c WHERE c.id = ad_events.campaign_id AND c.user_id = auth.uid()));
CREATE INDEX idx_ad_events_campaign ON public.ad_events(campaign_id, created_at);

-- Record event RPC: increments counters + accrues spend (1 NDC per impression cost approximation, click costs more)
CREATE OR REPLACE FUNCTION public.record_ad_event(_campaign_id uuid, _event_type text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c public.ad_campaigns%ROWTYPE;
  cost_per integer;
BEGIN
  SELECT * INTO c FROM public.ad_campaigns WHERE id = _campaign_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'Campaign not found'); END IF;
  IF c.status <> 'active' THEN RETURN jsonb_build_object('ok', false, 'error', 'Campaign not active'); END IF;
  IF _event_type NOT IN ('impression','click') THEN RETURN jsonb_build_object('ok', false, 'error', 'Bad type'); END IF;

  cost_per := CASE WHEN _event_type = 'click' THEN 5 ELSE 1 END;

  -- Stop delivery if daily budget exhausted today
  IF c.daily_budget > 0 THEN
    DECLARE today_spend integer;
    BEGIN
      SELECT COALESCE(SUM(CASE WHEN event_type='click' THEN 5 ELSE 1 END),0) INTO today_spend
      FROM public.ad_events WHERE campaign_id = _campaign_id AND created_at::date = current_date;
      IF today_spend + cost_per > c.daily_budget THEN
        RETURN jsonb_build_object('ok', false, 'error', 'Daily budget reached');
      END IF;
    END;
  END IF;

  INSERT INTO public.ad_events(campaign_id, viewer_id, event_type)
  VALUES (_campaign_id, auth.uid(), _event_type);

  IF _event_type = 'click' THEN
    UPDATE public.ad_campaigns SET clicks = clicks + 1, spend = spend + cost_per WHERE id = _campaign_id;
  ELSE
    UPDATE public.ad_campaigns SET impressions = impressions + 1, spend = spend + cost_per WHERE id = _campaign_id;
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;
