ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS link text,
  ADD COLUMN IF NOT EXISTS legacy_id integer,
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS activities_legacy_id_key ON public.activities (legacy_id) WHERE legacy_id IS NOT NULL;