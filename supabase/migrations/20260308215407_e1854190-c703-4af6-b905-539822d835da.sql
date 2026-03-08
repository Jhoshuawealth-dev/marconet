
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create is_admin helper (admin OR super_admin)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'super_admin')
  )
$$;

-- 5. RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- 6. Create admin_requests table
CREATE TABLE public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id)
);

ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- 7. RLS for admin_requests
CREATE POLICY "Users can insert own request"
ON public.admin_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own request"
ON public.admin_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Super admins can update requests"
ON public.admin_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));
