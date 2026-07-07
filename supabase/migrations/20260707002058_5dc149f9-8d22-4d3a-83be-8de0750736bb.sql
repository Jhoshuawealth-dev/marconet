
CREATE POLICY "Users delete own comments"
  ON public.community_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins delete any comment"
  ON public.community_comments
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));
