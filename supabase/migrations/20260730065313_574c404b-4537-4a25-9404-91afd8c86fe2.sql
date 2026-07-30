-- ============ helper: role check ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- ============ organizations ============
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  logo_url text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE POLICY "Members can view their organization" ON public.organizations
  FOR SELECT TO authenticated
  USING (id = public.current_org_id() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can create organizations" ON public.organizations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins can update organizations" ON public.organizations
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR created_by = auth.uid());
CREATE POLICY "Admins can delete organizations" ON public.organizations
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR created_by = auth.uid());

-- ============ teams ============
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view teams" ON public.teams
  FOR SELECT TO authenticated
  USING (organization_id = public.current_org_id() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Org members can create teams" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND (organization_id = public.current_org_id() OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Creators and admins can update teams" ON public.teams
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators and admins can delete teams" ON public.teams
  FOR DELETE TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view team memberships" ON public.team_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.organization_id = public.current_org_id())
  );
CREATE POLICY "Users can join teams" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can leave teams" ON public.team_members
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update memberships" ON public.team_members
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ activities ============
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  icon text,
  unit text NOT NULL DEFAULT 'minutes',
  points integer NOT NULL DEFAULT 10,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view activities" ON public.activities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage activities" ON public.activities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.performed_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
  challenge_id uuid,
  amount numeric NOT NULL DEFAULT 0,
  unit text,
  duration_minutes integer,
  points integer NOT NULL DEFAULT 0,
  note text,
  performed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performed_exercises TO authenticated;
GRANT ALL ON public.performed_exercises TO service_role;
ALTER TABLE public.performed_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exercises" ON public.performed_exercises
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid());

-- ============ challenges ============
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  created_by uuid,
  title text NOT NULL,
  description text,
  challenge_type text NOT NULL DEFAULT 'individual',
  activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
  target_value numeric,
  unit text,
  cover_image_url text,
  visibility text NOT NULL DEFAULT 'organization',
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View challenges in scope" ON public.challenges
  FOR SELECT TO authenticated
  USING (visibility = 'public' OR organization_id = public.current_org_id() OR created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Create challenges" ON public.challenges
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Update own challenges" ON public.challenges
  FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Delete own challenges" ON public.challenges
  FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'joined',
  progress numeric NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_participants TO authenticated;
GRANT ALL ON public.challenge_participants TO service_role;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View participants of visible challenges" ON public.challenge_participants
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND (c.visibility = 'public' OR c.organization_id = public.current_org_id()))
  );
CREATE POLICY "Users join challenges" ON public.challenge_participants
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own participation" ON public.challenge_participants
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users leave challenges" ON public.challenge_participants
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ============ community ============
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
  challenge_id uuid REFERENCES public.challenges(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View posts in org" ON public.community_posts
  FOR SELECT TO authenticated
  USING (organization_id IS NOT DISTINCT FROM public.current_org_id() OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Create own posts" ON public.community_posts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own posts" ON public.community_posts
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Delete own posts" ON public.community_posts
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View comments on visible posts" ON public.post_comments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.community_posts p WHERE p.id = post_id));
CREATE POLICY "Create own comments" ON public.post_comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own comments" ON public.post_comments
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Delete own comments" ON public.post_comments
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View likes" ON public.post_likes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Like as self" ON public.post_likes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Unlike own" ON public.post_likes
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============ wellbeing ============
CREATE TABLE public.wellbeing_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid,
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wellbeing_surveys TO authenticated;
GRANT ALL ON public.wellbeing_surveys TO service_role;
ALTER TABLE public.wellbeing_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View surveys in org" ON public.wellbeing_surveys
  FOR SELECT TO authenticated
  USING (organization_id IS NOT DISTINCT FROM public.current_org_id() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Create surveys" ON public.wellbeing_surveys
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Update own surveys" ON public.wellbeing_surveys
  FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Delete own surveys" ON public.wellbeing_surveys
  FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.survey_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.wellbeing_surveys(id) ON DELETE CASCADE,
  question jsonb NOT NULL DEFAULT '{}'::jsonb,
  question_type text NOT NULL DEFAULT 'scale',
  options jsonb,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.survey_questions TO authenticated;
GRANT ALL ON public.survey_questions TO service_role;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View questions of visible surveys" ON public.survey_questions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wellbeing_surveys s WHERE s.id = survey_id AND (s.organization_id IS NOT DISTINCT FROM public.current_org_id() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Survey owners manage questions" ON public.survey_questions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wellbeing_surveys s WHERE s.id = survey_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.wellbeing_surveys s WHERE s.id = survey_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE TABLE public.survey_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.wellbeing_surveys(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.survey_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  answer_value numeric,
  answer_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.survey_answers TO authenticated;
GRANT ALL ON public.survey_answers TO service_role;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own answers" ON public.survey_answers
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid());

CREATE TABLE public.wellbeing_index_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  survey_id uuid REFERENCES public.wellbeing_surveys(id) ON DELETE SET NULL,
  score numeric NOT NULL,
  category_scores jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wellbeing_index_scores TO authenticated;
GRANT ALL ON public.wellbeing_index_scores TO service_role;
ALTER TABLE public.wellbeing_index_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scores" ON public.wellbeing_index_scores
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid());

-- ============ updated_at triggers ============
CREATE TRIGGER trg_org_updated BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_teams_updated BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_activities_updated BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_challenges_updated BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cp_updated BEFORE UPDATE ON public.challenge_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_comments_updated BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_surveys_updated BEFORE UPDATE ON public.wellbeing_surveys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ensure profile trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();