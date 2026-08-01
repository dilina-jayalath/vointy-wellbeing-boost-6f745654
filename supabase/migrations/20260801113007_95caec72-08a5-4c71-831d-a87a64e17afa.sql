-- Predictive analytics RPCs for employer panel

CREATE OR REPLACE FUNCTION public.org_activity_forecast()
RETURNS TABLE(month date, index_per_employee numeric, forecast numeric, is_forecast boolean)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org uuid; _emp bigint;
  _slope numeric := 0; _intercept numeric := 0; _n int := 0;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();
  SELECT count(*) INTO _emp FROM public.profiles p WHERE p.organization_id = _org;

  CREATE TEMP TABLE IF NOT EXISTS _hist(i int, m date, v numeric) ON COMMIT DROP;
  DELETE FROM _hist;

  INSERT INTO _hist(i, m, v)
  WITH months AS (
    SELECT generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month')::date AS m
  ), ex AS (
    SELECT date_trunc('month', pe.performed_at)::date AS m, sum(pe.points) AS pts
    FROM public.performed_exercises pe
    JOIN public.profiles p ON p.user_id = pe.user_id AND p.organization_id = _org
    GROUP BY 1
  )
  SELECT row_number() OVER (ORDER BY months.m)::int,
         months.m,
         CASE WHEN _emp = 0 THEN 0 ELSE round(COALESCE(ex.pts,0)::numeric / _emp, 2) END
  FROM months LEFT JOIN ex ON ex.m = months.m;

  SELECT count(*) INTO _n FROM _hist;

  SELECT COALESCE(regr_slope(v, i), 0), COALESCE(regr_intercept(v, i), 0)
    INTO _slope, _intercept
  FROM _hist;

  RETURN QUERY
  SELECT h.m, h.v, NULL::numeric, false FROM _hist h
  UNION ALL
  SELECT (date_trunc('month', now()) + (k || ' months')::interval)::date,
         NULL::numeric,
         GREATEST(round(_intercept + _slope * (_n + k), 2), 0),
         true
  FROM generate_series(1, 3) AS k
  ORDER BY 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_employee_risk()
RETURNS TABLE(
  user_id uuid, display_name text, last_active timestamp with time zone,
  days_since_active integer, points_30d bigint, points_prev_30d bigint,
  change_pct numeric, risk_score integer, risk_level text
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
    SELECT p.user_id AS uid, COALESCE(p.display_name, 'Employee') AS dname
    FROM public.profiles p WHERE p.organization_id = _org
  ), agg AS (
    SELECT emp.uid, emp.dname,
      max(pe.performed_at) AS last_at,
      COALESCE(sum(pe.points) FILTER (WHERE pe.performed_at > now() - interval '30 days'), 0)::bigint AS p30,
      COALESCE(sum(pe.points) FILTER (WHERE pe.performed_at > now() - interval '60 days'
                                        AND pe.performed_at <= now() - interval '30 days'), 0)::bigint AS pprev
    FROM emp
    LEFT JOIN public.performed_exercises pe ON pe.user_id = emp.uid
    GROUP BY emp.uid, emp.dname
  ), sc AS (
    SELECT agg.*,
      CASE WHEN agg.last_at IS NULL THEN 999
           ELSE EXTRACT(day FROM now() - agg.last_at)::int END AS dsa,
      CASE WHEN agg.pprev = 0 THEN NULL
           ELSE round((agg.p30 - agg.pprev)::numeric * 100 / agg.pprev, 0) END AS chg
    FROM agg
  ), risk AS (
    SELECT sc.*,
      LEAST(100,
        (CASE WHEN sc.dsa >= 60 THEN 60 WHEN sc.dsa >= 30 THEN 45 WHEN sc.dsa >= 14 THEN 25 WHEN sc.dsa >= 7 THEN 10 ELSE 0 END)
        + (CASE WHEN sc.p30 = 0 THEN 25 WHEN sc.chg IS NOT NULL AND sc.chg <= -50 THEN 20
                WHEN sc.chg IS NOT NULL AND sc.chg < 0 THEN 10 ELSE 0 END)
        + (CASE WHEN sc.p30 < 3 THEN 15 WHEN sc.p30 < 8 THEN 5 ELSE 0 END)
      )::int AS score
    FROM sc
  )
  SELECT risk.uid, risk.dname, risk.last_at, risk.dsa, risk.p30, risk.pprev, risk.chg, risk.score,
         CASE WHEN risk.score >= 60 THEN 'high' WHEN risk.score >= 30 THEN 'medium' ELSE 'low' END
  FROM risk
  ORDER BY risk.score DESC, risk.dsa DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_team_risk()
RETURNS TABLE(
  team_id uuid, team_name text, members bigint, active_members_30d bigint,
  points_30d bigint, points_prev_30d bigint, change_pct numeric,
  participation_rate numeric, risk_level text
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
  WITH base AS (
    SELECT t.id AS tid, t.name AS tname,
      count(DISTINCT tm.user_id) AS mem,
      count(DISTINCT pe.user_id) FILTER (WHERE pe.performed_at > now() - interval '30 days') AS act,
      COALESCE(sum(pe.points) FILTER (WHERE pe.performed_at > now() - interval '30 days'),0)::bigint AS p30,
      COALESCE(sum(pe.points) FILTER (WHERE pe.performed_at > now() - interval '60 days'
                                        AND pe.performed_at <= now() - interval '30 days'),0)::bigint AS pprev
    FROM public.teams t
    LEFT JOIN public.team_members tm ON tm.team_id = t.id
    LEFT JOIN public.performed_exercises pe ON pe.user_id = tm.user_id
    WHERE t.organization_id = _org
    GROUP BY t.id, t.name
  ), calc AS (
    SELECT base.*,
      CASE WHEN base.pprev = 0 THEN NULL ELSE round((base.p30 - base.pprev)::numeric * 100 / base.pprev, 0) END AS chg,
      CASE WHEN base.mem = 0 THEN 0 ELSE round(base.act::numeric * 100 / base.mem, 0) END AS prate
    FROM base
  )
  SELECT calc.tid, calc.tname, calc.mem, calc.act, calc.p30, calc.pprev, calc.chg, calc.prate,
    CASE
      WHEN calc.mem = 0 THEN 'medium'
      WHEN calc.prate < 30 OR (calc.chg IS NOT NULL AND calc.chg <= -40) THEN 'high'
      WHEN calc.prate < 60 OR (calc.chg IS NOT NULL AND calc.chg < 0) THEN 'medium'
      ELSE 'low'
    END
  FROM calc
  ORDER BY calc.prate ASC, calc.p30 ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_predictive_overview()
RETURNS TABLE(
  total_employees bigint, index_this_month numeric, index_prev_month numeric,
  forecast_next_month numeric, trend_slope numeric, trend_direction text,
  high_risk_employees bigint, medium_risk_employees bigint,
  high_risk_teams bigint, projected_sick_days_next_12m numeric,
  projected_savings_next_12m numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org uuid; _emp bigint; _cost numeric;
  _slope numeric := 0; _intercept numeric := 0; _n int := 0;
  _cur numeric := 0; _prev numeric := 0;
  _sick_cur numeric := 0; _sick_prev numeric := 0; _proj numeric := 0;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();
  SELECT count(*) INTO _emp FROM public.profiles p WHERE p.organization_id = _org;
  SELECT COALESCE(o.cost_per_sick_day, 0) INTO _cost FROM public.organizations o WHERE o.id = _org;

  CREATE TEMP TABLE IF NOT EXISTS _ph(i int, m date, v numeric) ON COMMIT DROP;
  DELETE FROM _ph;

  INSERT INTO _ph(i, m, v)
  WITH months AS (
    SELECT generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month')::date AS m
  ), ex AS (
    SELECT date_trunc('month', pe.performed_at)::date AS m, sum(pe.points) AS pts
    FROM public.performed_exercises pe
    JOIN public.profiles p ON p.user_id = pe.user_id AND p.organization_id = _org
    GROUP BY 1
  )
  SELECT row_number() OVER (ORDER BY months.m)::int, months.m,
         CASE WHEN _emp = 0 THEN 0 ELSE round(COALESCE(ex.pts,0)::numeric / _emp, 2) END
  FROM months LEFT JOIN ex ON ex.m = months.m;

  SELECT count(*) INTO _n FROM _ph;
  SELECT COALESCE(regr_slope(v, i),0), COALESCE(regr_intercept(v, i),0) INTO _slope, _intercept FROM _ph;
  SELECT COALESCE(v,0) INTO _cur FROM _ph WHERE i = _n;
  SELECT COALESCE(v,0) INTO _prev FROM _ph WHERE i = _n - 1;

  SELECT COALESCE(sum(s.sick_days),0) INTO _sick_cur FROM public.sick_leave_records s
    WHERE s.organization_id = _org AND s.period > (now() - interval '12 months')::date;
  SELECT COALESCE(sum(s.sick_days),0) INTO _sick_prev FROM public.sick_leave_records s
    WHERE s.organization_id = _org
      AND s.period > (now() - interval '24 months')::date
      AND s.period <= (now() - interval '12 months')::date;

  IF _sick_prev > 0 THEN
    _proj := GREATEST(round(_sick_cur * (_sick_cur / _sick_prev), 1), 0);
  ELSE
    _proj := _sick_cur;
  END IF;

  RETURN QUERY
  SELECT
    _emp,
    _cur,
    _prev,
    GREATEST(round(_intercept + _slope * (_n + 1), 2), 0),
    round(_slope, 3),
    CASE WHEN _slope > 0.05 THEN 'up' WHEN _slope < -0.05 THEN 'down' ELSE 'flat' END,
    (SELECT count(*) FROM public.org_employee_risk() r WHERE r.risk_level = 'high'),
    (SELECT count(*) FROM public.org_employee_risk() r WHERE r.risk_level = 'medium'),
    (SELECT count(*) FROM public.org_team_risk() tr WHERE tr.risk_level = 'high'),
    _proj,
    round(GREATEST(_sick_cur - _proj, 0) * COALESCE(_cost,0), 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.org_activity_forecast() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_employee_risk() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_team_risk() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_predictive_overview() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.org_activity_forecast() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_employee_risk() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_team_risk() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_predictive_overview() TO authenticated;