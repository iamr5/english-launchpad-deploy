-- Rol de administrador: quien puede crear y editar demos.
--
-- Va en su propia migración a propósito: PostgreSQL no permite USAR un valor de
-- enum nuevo en la misma transacción en que se añade. Las políticas que comparan
-- contra 'admin' viven en la migración siguiente.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
