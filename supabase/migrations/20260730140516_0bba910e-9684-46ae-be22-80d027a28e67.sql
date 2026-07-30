CREATE TABLE public.organization_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending',
  invited_by UUID,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_invitations TO authenticated;
GRANT ALL ON public.organization_invitations TO service_role;

ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view invitations"
ON public.organization_invitations FOR SELECT TO authenticated
USING (organization_id = public.current_org_id() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Org members can create invitations"
ON public.organization_invitations FOR INSERT TO authenticated
WITH CHECK (invited_by = auth.uid() AND organization_id = public.current_org_id());

CREATE POLICY "Org members can update invitations"
ON public.organization_invitations FOR UPDATE TO authenticated
USING (organization_id = public.current_org_id())
WITH CHECK (organization_id = public.current_org_id());

CREATE POLICY "Org members can delete invitations"
ON public.organization_invitations FOR DELETE TO authenticated
USING (organization_id = public.current_org_id());

CREATE TRIGGER update_organization_invitations_updated_at
BEFORE UPDATE ON public.organization_invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.invitation_info(_token TEXT)
RETURNS TABLE (organization_name TEXT, email TEXT, name TEXT, status TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.name, i.email, i.name, i.status
  FROM public.organization_invitations i
  JOIN public.organizations o ON o.id = i.organization_id
  WHERE i.token = _token;
$$;

GRANT EXECUTE ON FUNCTION public.invitation_info(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.accept_invitation(_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.organization_invitations%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO inv FROM public.organization_invitations
  WHERE token = _token AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found or already used';
  END IF;

  UPDATE public.profiles SET organization_id = inv.organization_id
  WHERE user_id = auth.uid();

  IF inv.team_id IS NOT NULL THEN
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (inv.team_id, auth.uid(), 'member')
    ON CONFLICT DO NOTHING;
  END IF;

  UPDATE public.organization_invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = inv.id;

  RETURN inv.organization_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(TEXT) TO authenticated;