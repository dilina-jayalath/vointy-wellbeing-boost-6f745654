CREATE OR REPLACE FUNCTION public.org_activity_index_overview()
RETURNS TABLE(
  total_employees bigint,
  active_employees_30d bigint,
  participation_rate numeric,
  points_total bigint,
  points_12m bigint,
  points_this_month bigint,
  points_prev_month bigint,
  index_per_employee numeric,
  index_this_month numeric,
  index_prev_month numeric,
  index_change numeric
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
  ), ex AS (
    SELECT pe.* FROM public.performed_exercises pe JOIN emp ON emp.user_id = pe.user_id
  ), agg AS (
    SELECT
      (SELECT count(*) FROM emp) AS employees,
      (SELECT count(DISTINCT user_id) FROM ex WHERE performed_at > now() - interval '30 days') AS active30,
      (SELECT COALESCE(sum(points),0) FROM ex) AS ptotal,
      (SELECT COALESCE(sum(points),0) FROM ex WHERE performed_at > now() - interval '12 months') AS p12,
      (SELECT COALESCE(sum(points),0) FROM ex WHERE performed_at >= date_trunc('month', now())) AS pcur,
      (SELECT COALESCE(sum(points),0) FROM ex
         WHERE performed_at >= date_trunc('month', now()) - interval '1 month'
           AND performed_at < date_trunc('month', now())) AS pprev
  )
  SELECT
    agg.employees,
    agg.active30,
    CASE WHEN agg.employees = 0 THEN 0 ELSE round(agg.active30::numeric * 100 / agg.employees, 0) END,
    agg.ptotal::bigint,
    agg.p12::bigint,
    agg.pcur::bigint,
    agg.pprev::bigint,
    CASE WHEN agg.employees = 0 THEN 0 ELSE round(agg.ptotal::numeric / agg.employees, 1) END,
    CASE WHEN agg.employees = 0 THEN 0 ELSE round(agg.pcur::numeric / agg.employees, 1) END,
    CASE WHEN agg.employees = 0 THEN 0 ELSE round(agg.pprev::numeric / agg.employees, 1) END,
    CASE WHEN agg.employees = 0 THEN 0
         ELSE round(agg.pcur::numeric / agg.employees, 1) - round(agg.pprev::numeric / agg.employees, 1) END
  FROM agg;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_activity_index_monthly()
RETURNS TABLE(month date, points bigint, exercises bigint, active_employees bigint, index_per_employee numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid; _emp bigint;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();
  SELECT count(*) INTO _emp FROM public.profiles p WHERE p.organization_id = _org;

  RETURN QUERY
  WITH months AS (
    SELECT generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month')::date AS m
  ), ex AS (
    SELECT pe.* FROM public.performed_exercises pe
    JOIN public.profiles p ON p.user_id = pe.user_id AND p.organization_id = _org
  )
  SELECT months.m,
         COALESCE(sum(ex.points),0)::bigint,
         count(ex.id),
         count(DISTINCT ex.user_id),
         CASE WHEN _emp = 0 THEN 0 ELSE round(COALESCE(sum(ex.points),0)::numeric / _emp, 1) END
  FROM months
  LEFT JOIN ex ON date_trunc('month', ex.performed_at)::date = months.m
  GROUP BY months.m
  ORDER BY months.m;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_activity_index_teams()
RETURNS TABLE(team_id uuid, team_name text, members bigint, active_members bigint, points bigint, index_per_member numeric)
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
         count(DISTINCT pe.user_id),
         COALESCE(sum(pe.points),0)::bigint,
         CASE WHEN count(DISTINCT tm.user_id) = 0 THEN 0
              ELSE round(COALESCE(sum(pe.points),0)::numeric / count(DISTINCT tm.user_id), 1) END
  FROM public.teams t
  LEFT JOIN public.team_members tm ON tm.team_id = t.id
  LEFT JOIN public.performed_exercises pe ON pe.user_id = tm.user_id
  WHERE t.organization_id = _org
  GROUP BY t.id, t.name
  ORDER BY 6 DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.org_activity_index_overview() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_activity_index_monthly() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_activity_index_teams() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.org_activity_index_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_activity_index_monthly() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_activity_index_teams() TO authenticated;

-- The wellbeing index is the activity index; survey-based wellbeing reports are removed.
DROP FUNCTION IF EXISTS public.org_wellbeing_overview();
DROP FUNCTION IF EXISTS public.org_wellbeing_monthly();
DROP FUNCTION IF EXISTS public.org_wellbeing_questions();
DROP FUNCTION IF EXISTS public.org_team_wellbeing();
DROP FUNCTION IF EXISTS public.org_wellbeing_distribution();