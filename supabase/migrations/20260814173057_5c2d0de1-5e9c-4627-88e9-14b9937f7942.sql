UPDATE public.demos
SET config = jsonb_set(
  config,
  '{copy,groupNoun}',
  '"ciclo"',
  true
)
WHERE slug = 'democip'
  AND (config->'copy'->>'groupNoun') IS NULL;