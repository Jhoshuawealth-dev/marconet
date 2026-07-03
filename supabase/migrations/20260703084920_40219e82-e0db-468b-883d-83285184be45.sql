
-- Referral system
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_bonus_claimed boolean NOT NULL DEFAULT false;

-- Backfill referral codes for existing profiles
UPDATE public.profiles
   SET referral_code = 'MN' || UPPER(SUBSTRING(REPLACE(user_id::text,'-','') FROM 1 FOR 6))
 WHERE referral_code IS NULL;

-- Referrals ledger
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bonus_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);
GRANT SELECT, INSERT, UPDATE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own referrals" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Update handle_new_user to assign referral code from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ref_code text;
BEGIN
  ref_code := 'MN' || UPPER(SUBSTRING(REPLACE(NEW.id::text,'-','') FROM 1 FOR 6));
  INSERT INTO public.profiles (user_id, full_name, phone, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    ref_code
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Apply a referral code: called after signup. Pays referrer 200 NDC, referee 100 NDC.
CREATE OR REPLACE FUNCTION public.apply_referral_code(_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  ref_user uuid;
  already boolean;
  REFERRER_BONUS constant integer := 200;
  REFEREE_BONUS  constant integer := 100;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated'); END IF;
  IF _code IS NULL OR length(trim(_code)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Empty code');
  END IF;

  SELECT referral_bonus_claimed INTO already FROM public.profiles WHERE user_id = uid;
  IF already THEN RETURN jsonb_build_object('ok', false, 'error', 'Referral already applied'); END IF;

  SELECT user_id INTO ref_user FROM public.profiles WHERE referral_code = UPPER(trim(_code));
  IF ref_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Invalid code'); END IF;
  IF ref_user = uid THEN RETURN jsonb_build_object('ok', false, 'error', 'Cannot use your own code'); END IF;

  UPDATE public.profiles SET referred_by = ref_user, referral_bonus_claimed = true,
    ndc_balance = COALESCE(ndc_balance,0) + REFEREE_BONUS
  WHERE user_id = uid;

  UPDATE public.profiles SET ndc_balance = COALESCE(ndc_balance,0) + REFERRER_BONUS
  WHERE user_id = ref_user;

  INSERT INTO public.referrals(referrer_id, referred_id, bonus_amount) VALUES (ref_user, uid, REFERRER_BONUS)
  ON CONFLICT (referred_id) DO NOTHING;

  INSERT INTO public.ndc_transactions(user_id, title, description, amount, type)
  VALUES
    (uid, 'Referral Bonus', 'Welcome bonus for using a referral code', REFEREE_BONUS, 'earn'),
    (ref_user, 'Referral Reward', 'A new user signed up with your code', REFERRER_BONUS, 'earn');

  INSERT INTO public.notifications(user_id, type, title, body) VALUES
    (uid, 'system', 'Referral bonus 🎁', 'You received ' || REFEREE_BONUS || ' NDC for using a referral code.'),
    (ref_user, 'system', 'New referral 🎉', 'A new user joined with your code. You earned ' || REFERRER_BONUS || ' NDC.');

  RETURN jsonb_build_object('ok', true, 'referee_bonus', REFEREE_BONUS, 'referrer_bonus', REFERRER_BONUS);
END;
$$;
REVOKE ALL ON FUNCTION public.apply_referral_code(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
