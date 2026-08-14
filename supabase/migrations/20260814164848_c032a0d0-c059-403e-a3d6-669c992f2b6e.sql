UPDATE public.demos
SET config = jsonb_set(config, '{icons,dashboard}', '"/demo-assets/stats.svg"')
WHERE config->'icons'->>'dashboard' IN ('📊','📈');