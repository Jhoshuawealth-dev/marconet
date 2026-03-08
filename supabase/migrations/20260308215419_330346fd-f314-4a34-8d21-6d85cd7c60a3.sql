
-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.ndc_transactions FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can view all community posts (including pending)
CREATE POLICY "Admins can view all posts"
ON public.community_posts FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can update community posts (for moderation)
CREATE POLICY "Admins can update posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can delete community posts
CREATE POLICY "Admins can delete posts"
ON public.community_posts FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can view all staked projects
CREATE POLICY "Admins can view all stakes"
ON public.staked_projects FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));
