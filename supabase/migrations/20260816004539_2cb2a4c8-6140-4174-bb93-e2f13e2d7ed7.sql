CREATE TABLE public.circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  level text NOT NULL DEFAULT 'A1',
  topic text NOT NULL DEFAULT 'general',
  bots_enabled boolean NOT NULL DEFAULT false,
  task_idx integer NOT NULL DEFAULT 0,
  task_started_at timestamptz NOT NULL DEFAULT now(),
  bot_busy_until timestamptz,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.circles TO service_role;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  color text NOT NULL DEFAULT '#1CB0F6',
  is_bot boolean NOT NULL DEFAULT false,
  token text NOT NULL,
  persona text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX circle_members_circle_idx ON public.circle_members(circle_id);
GRANT ALL ON public.circle_members TO service_role;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.circle_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  idx integer NOT NULL,
  prompt_en text NOT NULL,
  prompt_es text NOT NULL DEFAULT '',
  model_en text NOT NULL DEFAULT '',
  functions text[] NOT NULL DEFAULT '{}',
  audio_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (circle_id, idx)
);
GRANT ALL ON public.circle_tasks TO service_role;
ALTER TABLE public.circle_tasks ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.circle_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.circle_members(id) ON DELETE CASCADE,
  task_idx integer NOT NULL DEFAULT 0,
  kind text NOT NULL DEFAULT 'text',
  body text NOT NULL DEFAULT '',
  audio_path text,
  duration_ms integer NOT NULL DEFAULT 0,
  reply_to uuid REFERENCES public.circle_messages(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX circle_messages_circle_created_idx ON public.circle_messages(circle_id, created_at);
GRANT ALL ON public.circle_messages TO service_role;
ALTER TABLE public.circle_messages ENABLE ROW LEVEL SECURITY;