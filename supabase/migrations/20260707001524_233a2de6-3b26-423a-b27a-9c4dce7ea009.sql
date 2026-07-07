
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.apply_referral_code(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.enroll_course(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.record_ad_event(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.purchase_mining_upgrade(text, integer, numeric, integer, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_matured_stake(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_stake(text, integer, text, integer, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.record_ndc_transaction(integer, text, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enroll_course(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_ad_event(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_mining_upgrade(text, integer, numeric, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_matured_stake(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_stake(text, integer, text, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_ndc_transaction(integer, text, text, text) TO authenticated;
