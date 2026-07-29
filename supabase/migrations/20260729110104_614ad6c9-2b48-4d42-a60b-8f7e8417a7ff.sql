-- Use a lightweight format check instead of length() on required columns
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(message) > 0);