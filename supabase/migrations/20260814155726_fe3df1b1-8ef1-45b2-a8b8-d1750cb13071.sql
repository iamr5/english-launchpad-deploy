UPDATE public.demos
SET config = jsonb_set(coalesce(config,'{}'::jsonb), '{icons,streak}', '"/demo-assets/streak.svg"'::jsonb, true)
WHERE coalesce(config->'icons'->>'streak','') IN ('', '🔥', '⚡');