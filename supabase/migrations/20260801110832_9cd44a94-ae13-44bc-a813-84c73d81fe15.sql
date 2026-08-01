-- Aggregated, privacy-preserving activity summary for employers (org owner or admin)

CREATE OR REPLACE FUNCTION public.is_org_manager()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.organizations o
        WHERE o.id = public.current_org_id() AND o.created_by = auth.uid()
      );
$$;

REVOKE ALL ON FUNCTION public.is_org_manager() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_manager() TO authenticated;

-- Headline numbers
CREATE OR REPLACE FUNCTION public.org_activity_overview()
RETURNS TABLE(
  total_employees bigint,
  active_employees bigint,
  total_exercises bigint,
  total_points bigint,
  exercises_30d bigint,
  points_30d bigint,
  avg_points_per_employee numeric
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
  ), ex AS (
    SELECT pe.* FROM public.performed_exercises pe JOIN emp ON emp.user_id = pe.user_id
  )
  SELECT
    (SELECT count(*) FROM emp),
    (SELECT count(DISTINCT user_id) FROM ex WHERE performed_at > now() - interval '30 days'),
    (SELECT count(*) FROM ex),
    (SELECT COALESCE(sum(points),0)::bigint FROM ex),
    (SELECT count(*) FROM ex WHERE performed_at > now() - interval '30 days'),
    (SELECT COALESCE(sum(points),0)::bigint FROM ex WHERE performed_at > now() - interval '30 days'),
    CASE WHEN (SELECT count(*) FROM emp) = 0 THEN 0
         ELSE round((SELECT COALESCE(sum(points),0) FROM ex)::numeric / (SELECT count(*) FROM emp), 1) END;
END;
$$;

REVOKE ALL ON FUNCTION public.org_activity_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_activity_overview() TO authenticated;

-- Monthly trend (last 12 months)
CREATE OR REPLACE FUNCTION public.org_activity_monthly()
RETURNS TABLE(month date, exercises bigint, points bigint, active_employees bigint)
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
  ), ex AS (
    SELECT pe.* FROM public.performed_exercises pe
    JOIN public.profiles p ON p.user_id = pe.user_id
    WHERE p.organization_id = _org
  )
  SELECT months.m,
         count(ex.id),
         COALESCE(sum(ex.points),0)::bigint,
         count(DISTINCT ex.user_id)
  FROM months
  LEFT JOIN ex ON date_trunc('month', ex.performed_at)::date = months.m
  GROUP BY months.m
  ORDER BY months.m;
END;
$$;

REVOKE ALL ON FUNCTION public.org_activity_monthly() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_activity_monthly() TO authenticated;

-- Most popular activities
CREATE OR REPLACE FUNCTION public.org_top_activities(_limit integer DEFAULT 10)
RETURNS TABLE(activity_id uuid, title text, category text, times_performed bigint, points bigint)
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
  SELECT a.id, COALESCE(a.title, 'Unknown'), a.category, count(pe.id), COALESCE(sum(pe.points),0)::bigint
  FROM public.performed_exercises pe
  JOIN public.profiles p ON p.user_id = pe.user_id AND p.organization_id = _org
  LEFT JOIN public.activities a ON a.id = pe.activity_id
  GROUP BY a.id, a.title, a.category
  ORDER BY count(pe.id) DESC
  LIMIT GREATEST(_limit, 1);
END;
$$;

REVOKE ALL ON FUNCTION public.org_top_activities(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_top_activities(integer) TO authenticated;

-- Team comparison (aggregated only)
CREATE OR REPLACE FUNCTION public.org_team_activity()
RETURNS TABLE(team_id uuid, team_name text, members bigint, exercises bigint, points bigint, avg_points_per_member numeric)
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
  SELECT t.id, t.name,
         count(DISTINCT tm.user_id),
         count(pe.id),
         COALESCE(sum(pe.points),0)::bigint,
         CASE WHEN count(DISTINCT tm.user_id) = 0 THEN 0
              ELSE round(COALESCE(sum(pe.points),0)::numeric / count(DISTINCT tm.user_id), 1) END
  FROM public.teams t
  LEFT JOIN public.team_members tm ON tm.team_id = t.id
  LEFT JOIN public.performed_exercises pe ON pe.user_id = tm.user_id
  WHERE t.organization_id = _org
  GROUP BY t.id, t.name
  ORDER BY 5 DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.org_team_activity() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_team_activity() TO authenticated;

-- Employee level summary (no exercise details, only totals)
CREATE OR REPLACE FUNCTION public.org_employee_activity()
RETURNS TABLE(user_id uuid, display_name text, exercises bigint, points bigint, last_active timestamptz)
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
  SELECT p.user_id, COALESCE(p.display_name, 'Employee'),
         count(pe.id), COALESCE(sum(pe.points),0)::bigint, max(pe.performed_at)
  FROM public.profiles p
  LEFT JOIN public.performed_exercises pe ON pe.user_id = p.user_id
  WHERE p.organization_id = _org
  GROUP BY p.user_id, p.display_name
  ORDER BY 4 DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.org_employee_activity() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_employee_activity() TO authenticated;