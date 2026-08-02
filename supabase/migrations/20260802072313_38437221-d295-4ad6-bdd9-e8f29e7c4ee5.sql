DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid())
  AND organization_id IS NOT DISTINCT FROM (SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create invitations for visible activities" ON public.activity_invitations;

CREATE POLICY "Users can create invitations for visible activities"
ON public.activity_invitations
FOR INSERT
TO authenticated
WITH CHECK (
  invited_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.activities a
    WHERE a.id = activity_invitations.activity_id
      AND (
        a.created_by = auth.uid()
        OR a.organization_id IS NULL
        OR a.organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid())
      )
  )
);