DROP POLICY IF EXISTS "Members can view their organization" ON public.organizations;
CREATE POLICY "Members and creators can view their organization"
ON public.organizations FOR SELECT TO authenticated
USING (id = public.current_org_id() OR created_by = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Org members can create invitations" ON public.organization_invitations;
CREATE POLICY "Org members can create invitations"
ON public.organization_invitations FOR INSERT TO authenticated
WITH CHECK (invited_by = auth.uid() AND (organization_id = public.current_org_id() OR EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.created_by = auth.uid())));

DROP POLICY IF EXISTS "Org members can view invitations" ON public.organization_invitations;
CREATE POLICY "Org members can view invitations"
ON public.organization_invitations FOR SELECT TO authenticated
USING (organization_id = public.current_org_id() OR EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.created_by = auth.uid()) OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Org members can update invitations" ON public.organization_invitations;
CREATE POLICY "Org members can update invitations"
ON public.organization_invitations FOR UPDATE TO authenticated
USING (organization_id = public.current_org_id() OR EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.created_by = auth.uid()))
WITH CHECK (organization_id = public.current_org_id() OR EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.created_by = auth.uid()));

DROP POLICY IF EXISTS "Org members can delete invitations" ON public.organization_invitations;
CREATE POLICY "Org members can delete invitations"
ON public.organization_invitations FOR DELETE TO authenticated
USING (organization_id = public.current_org_id() OR EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.created_by = auth.uid()));