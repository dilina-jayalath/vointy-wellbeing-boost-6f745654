-- 1. Fix mutable search_path on remaining functions
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';

-- 2. Revoke client access to internal SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_wake() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;

-- accept_invitation requires an authenticated user; anon can never succeed
REVOKE ALL ON FUNCTION public.accept_invitation(text) FROM anon;

-- 3. page_views: no longer allow logging under another user's id
DROP POLICY IF EXISTS "Anyone can log a page view" ON public.page_views;
CREATE POLICY "Anyone can log a page view"
ON public.page_views FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 4. post_comments: only comments on posts the user can see
DROP POLICY IF EXISTS "View comments on visible posts" ON public.post_comments;
CREATE POLICY "View comments on visible posts"
ON public.post_comments FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.community_posts p
  WHERE p.id = post_comments.post_id
    AND (
      NOT (p.organization_id IS DISTINCT FROM public.current_org_id())
      OR p.user_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
));

-- 5. post_likes: only likes on posts the user can see
DROP POLICY IF EXISTS "View likes" ON public.post_likes;
CREATE POLICY "View likes"
ON public.post_likes FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.community_posts p
  WHERE p.id = post_likes.post_id
    AND (
      NOT (p.organization_id IS DISTINCT FROM public.current_org_id())
      OR p.user_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
));

-- 6. Storage: activity images readable only by owner or those allowed to see the activity
DROP POLICY IF EXISTS "Authenticated can read activity images" ON storage.objects;
CREATE POLICY "Authenticated can read activity images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'activity-images'
  AND (
    (storage.foldername(name))[1] = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.image_url LIKE '%' || name || '%'
        AND (
          a.visibility = 'public'
          OR (a.visibility = 'organization'
              AND a.organization_id IS NOT NULL
              AND a.organization_id = public.current_org_id())
        )
    )
  )
);