REVOKE EXECUTE ON FUNCTION public.get_ad_for_delivery() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_ad_for_delivery() TO authenticated;