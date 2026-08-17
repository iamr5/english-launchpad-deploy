UPDATE public.orgs o
SET brand_slug = 'apavit'
WHERE o.slug = 'apavit'
  AND o.brand_slug IS DISTINCT FROM 'apavit'
  AND EXISTS (SELECT 1 FROM public.demos d WHERE d.slug = 'apavit');

UPDATE public.orgs
SET name = 'Asociación Peruana de Agencias de Viajes y Turismo'
WHERE slug = 'apavit' AND name = 'APAVIT';