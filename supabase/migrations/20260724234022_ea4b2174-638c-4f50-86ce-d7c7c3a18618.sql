
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('student', 'parent', 'teacher');

-- profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  role public.app_role NOT NULL DEFAULT 'student',
  level int NOT NULL DEFAULT 1,
  daily_goal int NOT NULL DEFAULT 15,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security-definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- progress table
CREATE TABLE public.progress (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp int NOT NULL DEFAULT 0,
  level int NOT NULL DEFAULT 1,
  streak_days jsonb NOT NULL DEFAULT '[]'::jsonb,
  lessons jsonb NOT NULL DEFAULT '{}'::jsonb,
  skill_errors jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- links table (guardian <-> student)
CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('parent','teacher')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guardian_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO authenticated;
GRANT ALL ON public.links TO service_role;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Helper: is guardian of student
CREATE OR REPLACE FUNCTION public.is_guardian_of(_guardian uuid, _student uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.links WHERE guardian_id = _guardian AND student_id = _student
  )
$$;

-- Policies: profiles
CREATE POLICY "select own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "select linked student profile" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_guardian_of(auth.uid(), id));
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Policies: user_roles (read only)
CREATE POLICY "select own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Policies: progress
CREATE POLICY "select own progress" ON public.progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "select linked progress" ON public.progress
  FOR SELECT TO authenticated USING (public.is_guardian_of(auth.uid(), user_id));
CREATE POLICY "update own progress" ON public.progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "insert own progress" ON public.progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policies: links
CREATE POLICY "guardian selects own links" ON public.links
  FOR SELECT TO authenticated USING (auth.uid() = guardian_id);
CREATE POLICY "student sees own links" ON public.links
  FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "guardian inserts own links" ON public.links
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = guardian_id
    AND (public.has_role(auth.uid(), 'parent') OR public.has_role(auth.uid(), 'teacher'))
  );
CREATE POLICY "guardian deletes own links" ON public.links
  FOR DELETE TO authenticated USING (auth.uid() = guardian_id);

-- Signup trigger: create profile, role, progress
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _name text;
BEGIN
  _role := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'role','')::public.app_role,
    'student'::public.app_role
  );
  _name := COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, name, role) VALUES (NEW.id, _name, _role);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  INSERT INTO public.progress (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
