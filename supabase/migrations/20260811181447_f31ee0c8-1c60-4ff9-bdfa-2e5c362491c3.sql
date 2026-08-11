CREATE OR REPLACE FUNCTION public.user_activity_index(_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  index_score numeric,
  consistency numeric,
  variety numeric,
  community numeric,
  wellbeing numeric,
  active_days_30d integer,
  categories_30d integer,
  community_events_30d integer,
  survey_avg numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := COALESCE(_user_id, auth.uid());
  _days int := 0; _cats int := 0; _ev int := 0; _survey numeric;
  _c numeric; _v numeric; _co numeric; _w numeric;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _uid <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT count(DISTINCT date_trunc('day', pe.performed_at))
    INTO _days
  FROM public.performed_exercises pe
  WHERE pe.user_id = _uid AND pe.performed_at > now() - interval '30 days';

  SELECT count(DISTINCT COALESCE(a.category, 'other'))
    INTO _cats
  FROM public.performed_exercises pe
  LEFT JOIN public.activities a ON a.id = pe.activity_id
  WHERE pe.user_id = _uid AND pe.performed_at > now() - interval '30 days';

  SELECT
    (SELECT count(*) FROM public.community_posts x WHERE x.user_id = _uid AND x.created_at > now() - interval '30 days')
  + (SELECT count(*) FROM public.post_comments x WHERE x.user_id = _uid AND x.created_at > now() - interval '30 days')
  + (SELECT count(*) FROM public.post_likes x WHERE x.user_id = _uid AND x.created_at > now() - interval '30 days')
  + (SELECT count(*) FROM public.challenge_participants x WHERE x.user_id = _uid AND x.created_at > now() - interval '30 days')
    INTO _ev;

  SELECT round(avg(sa.answer_value), 2) INTO _survey
  FROM public.survey_answers sa
  WHERE sa.user_id = _uid
    AND sa.answer_value IS NOT NULL
    AND sa.created_at > now() - interval '90 days';

  -- Consistency: 40 pts, full score at 20 active days in 30 days
  _c := round(LEAST(_days::numeric / 20, 1) * 40, 1);
  -- Variety: 20 pts, full score at 4 distinct categories
  _v := round(LEAST(_cats::numeric / 4, 1) * 20, 1);
  -- Community: 20 pts, full score at 10 social/challenge events
  _co := round(LEAST(_ev::numeric / 10, 1) * 20, 1);
  -- Perceived wellbeing: 20 pts from survey answers (1-10); neutral 60% when no answers
  _w := round(CASE WHEN _survey IS NULL THEN 0.6 ELSE LEAST(GREATEST((_survey - 1) / 9, 0), 1) END * 20, 1);

  RETURN QUERY SELECT round(_c + _v + _co + _w, 1), _c, _v, _co, _w, _days, _cats, _ev, _survey;
END;
$$;

REVOKE ALL ON FUNCTION public.user_activity_index(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_activity_index(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.org_wellbeing_index()
RETURNS TABLE(
  employees_with_data bigint,
  avg_index numeric,
  avg_consistency numeric,
  avg_variety numeric,
  avg_community numeric,
  avg_wellbeing numeric,
  high_index_share numeric,
  low_index_share numeric
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
    SELECT p.user_id AS uid FROM public.profiles p WHERE p.organization_id = _org
  ), act AS (
    SELECT emp.uid,
      (SELECT count(DISTINCT date_trunc('day', pe.performed_at)) FROM public.performed_exercises pe
        WHERE pe.user_id = emp.uid AND pe.performed_at > now() - interval '30 days') AS days,
      (SELECT count(DISTINCT COALESCE(a.category,'other')) FROM public.performed_exercises pe
        LEFT JOIN public.activities a ON a.id = pe.activity_id
        WHERE pe.user_id = emp.uid AND pe.performed_at > now() - interval '30 days') AS cats,
      (SELECT count(*) FROM public.community_posts x WHERE x.user_id = emp.uid AND x.created_at > now() - interval '30 days')
      + (SELECT count(*) FROM public.post_comments x WHERE x.user_id = emp.uid AND x.created_at > now() - interval '30 days')
      + (SELECT count(*) FROM public.post_likes x WHERE x.user_id = emp.uid AND x.created_at > now() - interval '30 days')
      + (SELECT count(*) FROM public.challenge_participants x WHERE x.user_id = emp.uid AND x.created_at > now() - interval '30 days') AS ev,
      (SELECT avg(sa.answer_value) FROM public.survey_answers sa
        WHERE sa.user_id = emp.uid AND sa.answer_value IS NOT NULL AND sa.created_at > now() - interval '90 days') AS survey
    FROM emp
  ), sc AS (
    SELECT act.uid,
      LEAST(act.days::numeric / 20, 1) * 40 AS c,
      LEAST(act.cats::numeric / 4, 1) * 20 AS v,
      LEAST(act.ev::numeric / 10, 1) * 20 AS co,
      CASE WHEN act.survey IS NULL THEN 0.6 ELSE LEAST(GREATEST((act.survey - 1) / 9, 0), 1) END * 20 AS w
    FROM act
  ), tot AS (
    SELECT sc.*, (sc.c + sc.v + sc.co + sc.w) AS idx FROM sc
  )
  SELECT count(*),
         round(COALESCE(avg(tot.idx),0), 1),
         round(COALESCE(avg(tot.c),0), 1),
         round(COALESCE(avg(tot.v),0), 1),
         round(COALESCE(avg(tot.co),0), 1),
         round(COALESCE(avg(tot.w),0), 1),
         CASE WHEN count(*) = 0 THEN 0 ELSE round(count(*) FILTER (WHERE tot.idx >= 70)::numeric * 100 / count(*), 0) END,
         CASE WHEN count(*) = 0 THEN 0 ELSE round(count(*) FILTER (WHERE tot.idx < 40)::numeric * 100 / count(*), 0) END
  FROM tot;
END;
$$;

REVOKE ALL ON FUNCTION public.org_wellbeing_index() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_wellbeing_index() TO authenticated;