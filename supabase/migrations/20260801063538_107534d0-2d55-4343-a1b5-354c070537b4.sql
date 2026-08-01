DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Update own posts" ON public.community_posts;
CREATE POLICY "Update own posts"
ON public.community_posts FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Update own comments" ON public.post_comments;
CREATE POLICY "Update own comments"
ON public.post_comments FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own participation" ON public.challenge_participants;
CREATE POLICY "Users update own participation"
ON public.challenge_participants FOR UPDATE TO authenticated
USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Update own surveys" ON public.wellbeing_surveys;
CREATE POLICY "Update own surveys"
ON public.wellbeing_surveys FOR UPDATE TO authenticated
USING ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update memberships" ON public.team_members;
CREATE POLICY "Admins can update memberships"
ON public.team_members FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Creators and admins can update teams" ON public.teams;
CREATE POLICY "Creators and admins can update teams"
ON public.teams FOR UPDATE TO authenticated
USING ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));