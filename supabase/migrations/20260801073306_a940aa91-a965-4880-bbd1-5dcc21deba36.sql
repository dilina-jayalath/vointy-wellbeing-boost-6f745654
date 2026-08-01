ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other';

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_category_check;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_category_check
  CHECK (category IN ('contact', 'license', 'other'));

UPDATE public.contact_submissions SET category = 'license' WHERE category = 'other';