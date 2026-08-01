CREATE TABLE public.contact_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.contact_replies TO authenticated;
GRANT ALL ON public.contact_replies TO service_role;

ALTER TABLE public.contact_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contact replies"
ON public.contact_replies FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create contact replies"
ON public.contact_replies FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND admin_user_id = auth.uid());

CREATE INDEX idx_contact_replies_submission ON public.contact_replies(submission_id);