ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';

ALTER TABLE public.activities ALTER COLUMN unit SET DEFAULT 'minutes';
ALTER TABLE public.activities ALTER COLUMN points SET DEFAULT 1;
ALTER TABLE public.activities ALTER COLUMN translations SET DEFAULT '{}'::jsonb;

DROP POLICY IF EXISTS "Authenticated can view activities" ON public.activities;

CREATE POLICY "View catalogue and permitted custom activities"
ON public.activities FOR SELECT TO authenticated
USING (
  created_by IS NULL
  OR created_by = auth.uid()
  OR visibility = 'public'
  OR (visibility = 'organization' AND organization_id IS NOT NULL AND organization_id = public.current_org_id())
);

CREATE POLICY "Users can create their own activities"
ON public.activities FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own activities"
ON public.activities FOR UPDATE TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own activities"
ON public.activities FOR DELETE TO authenticated
USING (created_by = auth.uid());

CREATE TABLE IF NOT EXISTS public.activity_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL,
  email text NOT NULL,
  name text,
  token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (activity_id, email)
);

CREATE UNIQUE INDEX IF NOT EXISTS activity_invitations_token_idx ON public.activity_invitations(token);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_invitations TO authenticated;
GRANT ALL ON public.activity_invitations TO service_role;

ALTER TABLE public.activity_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inviters and activity owners can view invitations"
ON public.activity_invitations FOR SELECT TO authenticated
USING (
  invited_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.activities a WHERE a.id = activity_id AND a.created_by = auth.uid())
);

CREATE POLICY "Users can create invitations for visible activities"
ON public.activity_invitations FOR INSERT TO authenticated
WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Inviters can update their invitations"
ON public.activity_invitations FOR UPDATE TO authenticated
USING (invited_by = auth.uid())
WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Inviters can delete their invitations"
ON public.activity_invitations FOR DELETE TO authenticated
USING (invited_by = auth.uid());

CREATE TRIGGER update_activity_invitations_updated_at
BEFORE UPDATE ON public.activity_invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();