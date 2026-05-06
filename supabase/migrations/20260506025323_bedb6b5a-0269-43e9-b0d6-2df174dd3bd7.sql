
ALTER TABLE public.staked_projects
  ADD COLUMN IF NOT EXISTS matured_at timestamptz,
  ADD COLUMN IF NOT EXISTS roi_percent numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS project_name text;

CREATE OR REPLACE FUNCTION public.claim_matured_stake(_stake_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.staked_projects%ROWTYPE;
  payout integer;
  new_balance integer;
BEGIN
  SELECT * INTO s FROM public.staked_projects WHERE id = _stake_id AND user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Stake not found');
  END IF;
  IF s.status <> 'active' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Stake already claimed');
  END IF;
  IF s.matured_at IS NULL OR s.matured_at > now() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Stake not yet matured');
  END IF;

  payout := s.amount + ROUND(s.amount * s.roi_percent / 100.0)::int;

  UPDATE public.staked_projects SET status = 'claimed', updated_at = now() WHERE id = _stake_id;

  UPDATE public.profiles SET ndc_balance = ndc_balance + payout WHERE user_id = auth.uid()
  RETURNING ndc_balance INTO new_balance;

  INSERT INTO public.ndc_transactions(user_id, title, description, amount, type)
  VALUES (auth.uid(), 'Stake Matured', COALESCE('Harvest from ' || s.project_name, 'Stake harvest') || ' (+' || (payout - s.amount) || ' NDC ROI)', payout, 'earn');

  INSERT INTO public.notifications(user_id, type, title, body)
  VALUES (auth.uid(), 'stake_maturity', 'Stake Matured 🌾', 'Your stake in ' || COALESCE(s.project_name, 'a project') || ' has matured. You received ' || payout || ' NDC.');

  RETURN jsonb_build_object('ok', true, 'payout', payout, 'balance', new_balance);
END;
$$;
