CREATE TABLE public.speaking_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  demo_slug text NOT NULL,
  exercise_id text NOT NULL,
  level text NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1')),
  mode text NOT NULL CHECK (mode IN ('repeat','read','guided','dialogue','free')),
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  duration_ms integer NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  audio_path text,
  audio_expires_at timestamptz,
  local_transcript text NOT NULL DEFAULT '',
  ai_transcript text NOT NULL DEFAULT '',
  local_score integer CHECK (local_score BETWEEN 0 AND 100),
  pronunciation_score integer CHECK (pronunciation_score BETWEEN 0 AND 100),
  fluency_score integer CHECK (fluency_score BETWEEN 0 AND 100),
  grammar_score integer CHECK (grammar_score BETWEEN 0 AND 100),
  passed boolean NOT NULL DEFAULT false,
  problem_words jsonb NOT NULL DEFAULT '[]'::jsonb,
  word_differences jsonb NOT NULL DEFAULT '[]'::jsonb,
  feedback jsonb NOT NULL DEFAULT '{}'::jsonb,
  local_latency_ms integer CHECK (local_latency_ms IS NULL OR local_latency_ms >= 0),
  ai_latency_ms integer CHECK (ai_latency_ms IS NULL OR ai_latency_ms >= 0),
  audio_bytes integer CHECK (audio_bytes IS NULL OR audio_bytes >= 0),
  usage jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.speaking_attempts TO authenticated;
GRANT ALL ON public.speaking_attempts TO service_role;

ALTER TABLE public.speaking_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own speaking attempts"
ON public.speaking_attempts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can create own speaking attempts"
ON public.speaking_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own speaking attempts"
ON public.speaking_attempts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can delete own speaking attempts"
ON public.speaking_attempts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX speaking_attempts_user_created_idx ON public.speaking_attempts(user_id, created_at DESC);
CREATE INDEX speaking_attempts_user_exercise_idx ON public.speaking_attempts(user_id, exercise_id, attempt_number DESC);
CREATE INDEX speaking_attempts_audio_expiry_idx ON public.speaking_attempts(audio_expires_at) WHERE audio_path IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_speaking_attempt_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER speaking_attempts_set_updated_at
BEFORE UPDATE ON public.speaking_attempts
FOR EACH ROW EXECUTE FUNCTION public.set_speaking_attempt_updated_at();

CREATE POLICY "Students can upload own speaking audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'speaking-audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Students can read own speaking audio"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'speaking-audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Students can delete own speaking audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'speaking-audio' AND (storage.foldername(name))[1] = auth.uid()::text);