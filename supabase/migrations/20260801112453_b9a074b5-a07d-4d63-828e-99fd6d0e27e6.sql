ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS cost_per_sick_day numeric NOT NULL DEFAULT 350,
  ADD COLUMN IF NOT EXISTS roi_monthly_cost numeric NOT NULL DEFAULT 149;

CREATE TABLE IF NOT EXISTS public.sick_leave_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  period date NOT NULL,
  team_name text NOT NULL DEFAULT '',
  sick_days numeric NOT NULL DEFAULT 0,
  absent_employees integer,
  headcount integer,
  source_file text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (organization_id, period, team_name)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sick_leave_records TO authenticated;
GRANT ALL ON public.sick_leave_records TO service_role;

ALTER TABLE public.sick_leave_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view own org sick leave"
ON public.sick_leave_records FOR SELECT TO authenticated
USING (organization_id = public.current_org_id() AND public.is_org_manager());

CREATE POLICY "Managers can insert own org sick leave"
ON public.sick_leave_records FOR INSERT TO authenticated
WITH CHECK (organization_id = public.current_org_id() AND public.is_org_manager());

CREATE POLICY "Managers can update own org sick leave"
ON public.sick_leave_records FOR UPDATE TO authenticated
USING (organization_id = public.current_org_id() AND public.is_org_manager())
WITH CHECK (organization_id = public.current_org_id() AND public.is_org_manager());

CREATE POLICY "Managers can delete own org sick leave"
ON public.sick_leave_records FOR DELETE TO authenticated
USING (organization_id = public.current_org_id() AND public.is_org_manager());

CREATE TRIGGER update_sick_leave_records_updated_at
BEFORE UPDATE ON public.sick_leave_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.org_roi_monthly()
RETURNS TABLE(
  month date,
  sick_days numeric,
  absent_employees bigint,
  headcount bigint,
  sick_day_cost numeric,
  points bigint,
  exercises bigint,
  active_employees bigint,
  index_per_employee numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid; _emp bigint; _cost numeric;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();
  SELECT count(*) INTO _emp FROM public.profiles p WHERE p.organization_id = _org;
  SELECT COALESCE(o.cost_per_sick_day, 0) INTO _cost FROM public.organizations o WHERE o.id = _org;

  RETURN QUERY
  WITH months AS (
    SELECT generate_series(date_trunc('month', now()) - interval '23 months', date_trunc('month', now()), interval '1 month')::date AS m
  ), sl AS (
    SELECT date_trunc('month', s.period)::date AS m,
           sum(s.sick_days) AS days,
           sum(COALESCE(s.absent_employees, 0)) AS absent,
           sum(COALESCE(s.headcount, 0)) AS heads
    FROM public.sick_leave_records s
    WHERE s.organization_id = _org
    GROUP BY 1
  ), ex AS (
    SELECT date_trunc('month', pe.performed_at)::date AS m,
           sum(pe.points) AS pts,
           count(*) AS cnt,
           count(DISTINCT pe.user_id) AS act
    FROM public.performed_exercises pe
    JOIN public.profiles p ON p.user_id = pe.user_id AND p.organization_id = _org
    GROUP BY 1
  )
  SELECT months.m,
         COALESCE(sl.days, 0),
         COALESCE(sl.absent, 0)::bigint,
         COALESCE(sl.heads, 0)::bigint,
         round(COALESCE(sl.days, 0) * COALESCE(_cost, 0), 0),
         COALESCE(ex.pts, 0)::bigint,
         COALESCE(ex.cnt, 0)::bigint,
         COALESCE(ex.act, 0)::bigint,
         CASE WHEN _emp = 0 THEN 0 ELSE round(COALESCE(ex.pts, 0)::numeric / _emp, 1) END
  FROM months
  LEFT JOIN sl ON sl.m = months.m
  LEFT JOIN ex ON ex.m = months.m
  ORDER BY months.m;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_roi_summary()
RETURNS TABLE(
  cost_per_sick_day numeric,
  monthly_cost numeric,
  months_with_data bigint,
  sick_days_12m numeric,
  sick_days_prev_12m numeric,
  sick_days_change_pct numeric,
  savings_12m numeric,
  subscription_cost_12m numeric,
  roi_pct numeric,
  total_employees bigint,
  sick_days_per_employee_12m numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _org uuid; _emp bigint; _cost numeric; _mcost numeric;
BEGIN
  IF NOT public.is_org_manager() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  _org := public.current_org_id();
  SELECT count(*) INTO _emp FROM public.profiles p WHERE p.organization_id = _org;
  SELECT COALESCE(o.cost_per_sick_day, 0), COALESCE(o.roi_monthly_cost, 0)
    INTO _cost, _mcost FROM public.organizations o WHERE o.id = _org;

  RETURN QUERY
  WITH sl AS (
    SELECT s.period, s.sick_days FROM public.sick_leave_records s WHERE s.organization_id = _org
  ), agg AS (
    SELECT
      (SELECT count(DISTINCT date_trunc('month', period)) FROM sl) AS months_with_data,
      COALESCE((SELECT sum(sick_days) FROM sl WHERE period > (now() - interval '12 months')::date), 0) AS cur,
      COALESCE((SELECT sum(sick_days) FROM sl
                WHERE period > (now() - interval '24 months')::date
                  AND period <= (now() - interval '12 months')::date), 0) AS prev
  )
  SELECT
    _cost,
    _mcost,
    agg.months_with_data,
    agg.cur,
    agg.prev,
    CASE WHEN agg.prev = 0 THEN 0 ELSE round((agg.cur - agg.prev) * 100 / agg.prev, 1) END,
    round((agg.prev - agg.cur) * _cost, 0),
    round(_mcost * 12, 0),
    CASE WHEN _mcost = 0 THEN 0
         ELSE round(((agg.prev - agg.cur) * _cost - _mcost * 12) * 100 / (_mcost * 12), 0) END,
    _emp,
    CASE WHEN _emp = 0 THEN 0 ELSE round(agg.cur / _emp, 2) END
  FROM agg;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.org_roi_monthly() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.org_roi_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_roi_monthly() TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_roi_summary() TO authenticated;