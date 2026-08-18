update public.demos
set config = jsonb_set(
  config,
  '{mascot}',
  jsonb_build_object(
    'pack', 'tomito',
    'fullName', 'Tomito de la Autónoma',
    'name', 'Tomito',
    'kind', 'compañero guía',
    'emoji', '🎒'
  )
)
where slug = 'demoautonoma';