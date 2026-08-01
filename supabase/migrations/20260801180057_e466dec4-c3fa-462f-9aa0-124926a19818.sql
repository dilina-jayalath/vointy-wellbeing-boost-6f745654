-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can grant roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can revoke roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND NOT (user_id = auth.uid() AND role = 'admin'));

GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Admin helper: list users with roles (email lookup)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(user_id uuid, email text, display_name text, is_admin boolean, created_at timestamptz)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT u.id, u.email::text, p.display_name,
         public.has_role(u.id, 'admin'),
         u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

-- Grant admin by email
CREATE OR REPLACE FUNCTION public.admin_set_admin_role(_email text, _grant boolean)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email);
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF _grant THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    IF _uid = auth.uid() THEN
      RAISE EXCEPTION 'You cannot remove your own admin role';
    END IF;
    DELETE FROM public.user_roles WHERE user_id = _uid AND role = 'admin';
  END IF;

  RETURN _uid;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_admin_role(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_admin_role(text, boolean) TO authenticated;