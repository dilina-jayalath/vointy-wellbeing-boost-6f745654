-- Engagement & community analytics (aggregated, org owner/admin only)

CREATE OR REPLACE FUNCTION public.org_engagement_overview()
RETURNS TABLE(
  total_employees bigint,
  posts bigint,
  comments bigint,
  likes bigint,
  posters_30d bigint,
  engaged_employees_30d bigint,
  posts_30d bigint,
  comments_30d bigint,
  likes_30d bigint,
  challenge_participants bigint,
  challenge_completions bigint,
  survey_respondents bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  WITH emp AS (
    SELECT p.user_id FROM public.profiles p WHERE p.organization_id = _org
  ), po AS (
    SELECT cp.* FROM public.community_posts cp JOIN emp ON emp.user_id = cp.user_id
  ), co AS (
    SELECT pc.* FROM public.post_comments pc JOIN emp ON emp.user_id = pc.user_id
  ), li AS (
    SELECT pl.* FROM public.post_likes pl JOIN emp ON emp.user_id = pl.user_id
  ), ch AS (
    SELECT cpa.* FROM public.challenge_participants cpa JOIN emp ON emp.user_id = cpa.user_id
  ), sa AS (
    SELECT sa.* FROM public.survey_answers sa JOIN emp ON emp.user_id = sa.user_id
  )
  SELECT
    (SELECT count(*) FROM emp),
    (SELECT count(*) FROM po),
    (SELECT count(*) FROM co),
    (SELECT count(*) FROM li),
    (SELECT count(DISTINCT user_id) FROM po WHERE created_at > now() - interval '30 days'),
    (SELECT count(DISTINCT u) FROM (
        SELECT user_id AS u FROM po WHERE created_at > now() - interval '30 days'
        UNION SELECT user_id FROM co WHERE created_at > now() - interval '30 days'
        UNION SELECT user_id FROM li WHERE created_at > now() - interval '30 days'
      ) x),
    (SELECT count(*) FROM po WHERE created_at > now() - interval '30 days'),
    (SELECT count(*) FROM co WHERE created_at > now() - interval '30 days'),
    (SELECT count(*) FROM li WHERE created_at > now() - interval '30 days'),
    (SELECT count(DISTINCT user_id) FROM ch),
    (SELECT count(*) FROM ch WHERE completed_at IS NOT NULL),
    (SELECT count(DISTINCT user_id) FROM sa);
END;
$$;

REVOKE ALL ON FUNCTION public.org_engagement_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_engagement_overview() TO authenticated;

-- Monthly engagement trend (last 12 months)
CREATE OR REPLACE FUNCTION public.org_engagement_monthly()
RETURNS TABLE(month date, posts bigint, comments bigint, likes bigint, contributors bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  WITH months AS (
    SELECT generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month')::date AS m
  ), ev AS (
    SELECT 'post'::text AS kind, cp.user_id, cp.created_at FROM public.community_posts cp
      JOIN public.profiles p ON p.user_id = cp.user_id AND p.organization_id = _org
    UNION ALL
    SELECT 'comment', pc.user_id, pc.created_at FROM public.post_comments pc
      JOIN public.profiles p ON p.user_id = pc.user_id AND p.organization_id = _org
    UNION ALL
    SELECT 'like', pl.user_id, pl.created_at FROM public.post_likes pl
      JOIN public.profiles p ON p.user_id = pl.user_id AND p.organization_id = _org
  )
  SELECT months.m,
         count(*) FILTER (WHERE ev.kind = 'post'),
         count(*) FILTER (WHERE ev.kind = 'comment'),
         count(*) FILTER (WHERE ev.kind = 'like'),
         count(DISTINCT ev.user_id)
  FROM months
  LEFT JOIN ev ON date_trunc('month', ev.created_at)::date = months.m
  GROUP BY months.m
  ORDER BY months.m;
END;
$$;

REVOKE ALL ON FUNCTION public.org_engagement_monthly() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_engagement_monthly() TO authenticated;

-- Most engaged employees (counts only, no content)
CREATE OR REPLACE FUNCTION public.org_top_contributors(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, posts bigint, comments bigint, likes bigint, engagement_score bigint, last_activity timestamptz)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  WITH emp AS (
    SELECT p.user_id, COALESCE(p.display_name, 'Employee') AS display_name
    FROM public.profiles p WHERE p.organization_id = _org
  ), ev AS (
    SELECT cp.user_id, 'post'::text AS kind, cp.created_at FROM public.community_posts cp
    UNION ALL SELECT pc.user_id, 'comment', pc.created_at FROM public.post_comments pc
    UNION ALL SELECT pl.user_id, 'like', pl.created_at FROM public.post_likes pl
  )
  SELECT emp.user_id, emp.display_name,
         count(*) FILTER (WHERE ev.kind = 'post'),
         count(*) FILTER (WHERE ev.kind = 'comment'),
         count(*) FILTER (WHERE ev.kind = 'like'),
         (count(*) FILTER (WHERE ev.kind = 'post') * 3
          + count(*) FILTER (WHERE ev.kind = 'comment') * 2
          + count(*) FILTER (WHERE ev.kind = 'like'))::bigint,
         max(ev.created_at)
  FROM emp
  LEFT JOIN ev ON ev.user_id = emp.user_id
  GROUP BY emp.user_id, emp.display_name
  ORDER BY 6 DESC
  LIMIT GREATEST(_limit, 1);
END;
$$;

REVOKE ALL ON FUNCTION public.org_top_contributors(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_top_contributors(integer) TO authenticated;

-- Team level engagement
CREATE OR REPLACE FUNCTION public.org_team_engagement()
RETURNS TABLE(team_id uuid, team_name text, members bigint, posts bigint, comments bigint, likes bigint, active_members bigint, engagement_per_member numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  WITH ev AS (
    SELECT cp.user_id, 'post'::text AS kind, cp.created_at FROM public.community_posts cp
    UNION ALL SELECT pc.user_id, 'comment', pc.created_at FROM public.post_comments pc
    UNION ALL SELECT pl.user_id, 'like', pl.created_at FROM public.post_likes pl
  )
  SELECT t.id, t.name,
         count(DISTINCT tm.user_id),
         count(*) FILTER (WHERE ev.kind = 'post'),
         count(*) FILTER (WHERE ev.kind = 'comment'),
         count(*) FILTER (WHERE ev.kind = 'like'),
         count(DISTINCT ev.user_id),
         CASE WHEN count(DISTINCT tm.user_id) = 0 THEN 0
              ELSE round(count(ev.kind)::numeric / count(DISTINCT tm.user_id), 1) END
  FROM public.teams t
  LEFT JOIN public.team_members tm ON tm.team_id = t.id
  LEFT JOIN ev ON ev.user_id = tm.user_id
  WHERE t.organization_id = _org
  GROUP BY t.id, t.name
  ORDER BY 8 DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.org_team_engagement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_team_engagement() TO authenticated;

-- Challenge participation summary
CREATE OR REPLACE FUNCTION public.org_challenge_engagement()
RETURNS TABLE(challenge_id uuid, title text, status text, participants bigint, completed bigint, completion_rate numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  SELECT c.id, c.title, c.status,
         count(cp.id),
         count(cp.completed_at),
         CASE WHEN count(cp.id) = 0 THEN 0
              ELSE round(count(cp.completed_at)::numeric * 100 / count(cp.id), 0) END
  FROM public.challenges c
  LEFT JOIN public.challenge_participants cp ON cp.challenge_id = c.id
  WHERE c.organization_id = _org
  GROUP BY c.id, c.title, c.status
  ORDER BY 4 DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.org_challenge_engagement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_challenge_engagement() TO authenticated;