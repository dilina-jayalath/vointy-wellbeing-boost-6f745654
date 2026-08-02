CREATE TABLE public.team_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_messages_team_created ON public.team_messages(team_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_messages TO authenticated;
GRANT ALL ON public.team_messages TO service_role;

ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_team_member(_team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = _team_id AND tm.user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid) TO authenticated, service_role;

CREATE POLICY "Team members can read team messages"
ON public.team_messages FOR SELECT TO authenticated
USING (public.is_team_member(team_id));

CREATE POLICY "Team members can send messages"
ON public.team_messages FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_team_member(team_id));

CREATE POLICY "Authors can update their messages"
ON public.team_messages FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authors can delete their messages"
ON public.team_messages FOR DELETE TO authenticated
USING (user_id = auth.uid());

ALTER TABLE public.team_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;