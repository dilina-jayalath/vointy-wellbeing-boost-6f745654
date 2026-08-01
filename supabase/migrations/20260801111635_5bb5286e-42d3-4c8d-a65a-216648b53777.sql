-- Wellbeing analytics for employers (aggregated only)

CREATE OR REPLACE FUNCTION public.org_wellbeing_overview()
RETURNS TABLE(
  total_employees bigint,
  respondents bigint,
  respondents_30d bigint,
  response_rate numeric,
  total_answers bigint,
  avg_score numeric,
  avg_score_30d numeric,
  avg_score_prev_30d numeric,
  score_change numeric,
  active_surveys bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
  ), ans AS (
    SELECT sa.* FROM public.survey_answers sa
    JOIN emp ON emp.user_id = sa.user_id
    WHERE sa.answer_value IS NOT NULL
  )
  SELECT
    (SELECT count(*) FROM emp),
    (SELECT count(DISTINCT user_id) FROM ans),
    (SELECT count(DISTINCT user_id) FROM ans WHERE created_at > now() - interval '30 days'),
    CASE WHEN (SELECT count(*) FROM emp) = 0 THEN 0
         ELSE round((SELECT count(DISTINCT user_id) FROM ans)::numeric * 100 / (SELECT count(*) FROM emp), 0) END,
    (SELECT count(*) FROM ans),
    COALESCE((SELECT round(avg(answer_value), 2) FROM ans), 0),
    COALESCE((SELECT round(avg(answer_value), 2) FROM ans WHERE created_at > now() - interval '30 days'), 0),
    COALESCE((SELECT round(avg(answer_value), 2) FROM ans
              WHERE created_at > now() - interval '60 days'
                AND created_at <= now() - interval '30 days'), 0),
    COALESCE((SELECT round(avg(answer_value), 2) FROM ans WHERE created_at > now() - interval '30 days'), 0)
      - COALESCE((SELECT round(avg(answer_value), 2) FROM ans
                  WHERE created_at > now() - interval '60 days'
                    AND created_at <= now() - interval '30 days'), 0),
    (SELECT count(*) FROM public.wellbeing_surveys ws
       WHERE ws.organization_id = _org AND ws.status = 'active');
END;
$$;

CREATE OR REPLACE FUNCTION public.org_wellbeing_monthly()
RETURNS TABLE(month date, avg_score numeric, respondents bigint, answers bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
  ), ans AS (
    SELECT sa.* FROM public.survey_answers sa
    JOIN public.profiles p ON p.user_id = sa.user_id AND p.organization_id = _org
    WHERE sa.answer_value IS NOT NULL
  )
  SELECT months.m,
         COALESCE(round(avg(ans.answer_value), 2), 0),
         count(DISTINCT ans.user_id),
         count(ans.id)
  FROM months
  LEFT JOIN ans ON date_trunc('month', ans.created_at)::date = months.m
  GROUP BY months.m
  ORDER BY months.m;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_wellbeing_questions()
RETURNS TABLE(question_id uuid, question jsonb, question_type text, responses bigint, respondents bigint, avg_score numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  SELECT q.id, q.question, q.question_type,
         count(sa.id),
         count(DISTINCT sa.user_id),
         COALESCE(round(avg(sa.answer_value), 2), 0)
  FROM public.survey_questions q
  JOIN public.survey_answers sa ON sa.question_id = q.id AND sa.answer_value IS NOT NULL
  JOIN public.profiles p ON p.user_id = sa.user_id AND p.organization_id = _org
  GROUP BY q.id, q.question, q.question_type
  ORDER BY 6 ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_team_wellbeing()
RETURNS TABLE(team_id uuid, team_name text, members bigint, respondents bigint, avg_score numeric, response_rate numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  SELECT t.id, t.name,
         count(DISTINCT tm.user_id),
         count(DISTINCT sa.user_id),
         COALESCE(round(avg(sa.answer_value), 2), 0),
         CASE WHEN count(DISTINCT tm.user_id) = 0 THEN 0
              ELSE round(count(DISTINCT sa.user_id)::numeric * 100 / count(DISTINCT tm.user_id), 0) END
  FROM public.teams t
  LEFT JOIN public.team_members tm ON tm.team_id = t.id
  LEFT JOIN public.survey_answers sa ON sa.user_id = tm.user_id AND sa.answer_value IS NOT NULL
  WHERE t.organization_id = _org
  GROUP BY t.id, t.name
  ORDER BY 5 DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_wellbeing_distribution()
RETURNS TABLE(bucket text, employees bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();

  RETURN QUERY
  WITH per_user AS (
    SELECT sa.user_id, avg(sa.answer_value) AS score
    FROM public.survey_answers sa
    JOIN public.profiles p ON p.user_id = sa.user_id AND p.organization_id = _org
    WHERE sa.answer_value IS NOT NULL
    GROUP BY sa.user_id
  ), maxv AS (
    SELECT GREATEST(COALESCE(max(score), 5), 1) AS m FROM per_user
  )
  SELECT b.bucket,
         count(per_user.user_id)
  FROM (VALUES ('low'), ('medium'), ('high')) AS b(bucket)
  LEFT JOIN maxv ON true
  LEFT JOIN per_user ON
    (b.bucket = 'low' AND per_user.score < maxv.m * 0.4)
    OR (b.bucket = 'medium' AND per_user.score >= maxv.m * 0.4 AND per_user.score < maxv.m * 0.7)
    OR (b.bucket = 'high' AND per_user.score >= maxv.m * 0.7)
  GROUP BY b.bucket;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.org_wellbeing_overview() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_wellbeing_monthly() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_wellbeing_questions() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_team_wellbeing() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_wellbeing_distribution() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.org_wellbeing_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_wellbeing_monthly() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_wellbeing_questions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_team_wellbeing() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_wellbeing_distribution() TO authenticated;