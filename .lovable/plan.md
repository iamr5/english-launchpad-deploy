## Goal

Wire real auth + backend for the Instant English deploy: `/login` (email/password + role selector), `/app` (student home, guarded), `/dashboard` (family/teacher home, guarded), keep the existing static HTML routes (`/`, `/presentacion`, `/presentation`, `/cip`, `/demo`, `/democip`, `/demo-dashboard`) untouched.

## Steps

### 1. Enable Lovable Cloud
Call `supabase--enable`. This provisions the backend and gives us the auth-middleware, managed `_authenticated` layout, and env vars (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, etc.) automatically.

### 2. Database schema (single migration)
```text
enum app_role: 'student' | 'parent' | 'teacher'

profiles           (id uuid PK → auth.users, role app_role, name text,
                    level int default 1, daily_goal int default 15,
                    created_at timestamptz default now())

user_roles         (id uuid PK, user_id uuid → auth.users, role app_role,
                    unique(user_id, role))    -- separate table per security rules

progress           (user_id uuid PK → profiles, xp int default 0,
                    level int default 1, streak_days jsonb default '[]',
                    lessons jsonb default '{}', skill_errors jsonb default '{}',
                    updated_at timestamptz default now())

links              (id uuid PK, guardian_id uuid → profiles,
                    student_id uuid → profiles,
                    kind text check in ('parent','teacher'),
                    unique(guardian_id, student_id))
```
- GRANTs for `authenticated` + `service_role` on every table.
- RLS ON everywhere.
- `has_role(_user_id, _role)` SECURITY DEFINER function (per user-roles rules).
- Trigger `on_auth_user_created` → inserts `profiles` row (role from `raw_user_meta_data.role`), a `user_roles` row, and empty `progress` row.
- RLS policies:
  - `profiles`, `progress`: user selects/updates own row; guardians (parents/teachers) select linked students' rows via `EXISTS (select 1 from links where guardian_id = auth.uid() and student_id = profiles.id)`.
  - `user_roles`: user selects own; no client writes.
  - `links`: guardian selects rows where `guardian_id = auth.uid()`; student selects rows where `student_id = auth.uid()`.

### 3. Auth & role helpers
- `src/lib/auth.ts` — thin wrapper around `supabase.auth` (`signIn`, `signUp(email, pw, role, name)`, `signOut`, `getSession`) matching the signatures the external Lovable integration expects.
- Root route: `onAuthStateChange` listener (filtered to SIGNED_IN/OUT/USER_UPDATED) → `router.invalidate()` + `queryClient.invalidateQueries()` per integration rules.
- Register `attachSupabaseAuth` in `src/start.ts` `functionMiddleware`.

### 4. Routes
Managed by integration: `src/routes/_authenticated/route.tsx` (do not author).

New files:
- `src/routes/login.tsx` — public. Tabs: Sign in / Sign up. Sign up includes role radio (Alumno / Familia / Profesor) → passes role via `options.data.role`. After sign-in, look up role and `navigate({ to: role === 'student' ? '/app' : '/dashboard', replace: true })`. Honors `?redirect=` search param.
- `src/routes/_authenticated/app.tsx` — student home. Loader calls `getMyProgress` server fn (requires `student` role, else redirect to `/dashboard`). Shows XP, level, streak, daily goal.
- `src/routes/_authenticated/dashboard.tsx` — parent/teacher home. Loader calls `getLinkedStudents` server fn. Lists linked students + their progress snapshots. If caller is `student` role, redirect to `/app`.

Keep `src/routes/index.tsx` serving `landing.html` unchanged (public landing).

### 5. Server functions (`src/lib/*.functions.ts`)
All use `.middleware([requireSupabaseAuth])`; RLS enforces access.
- `getMyProfile` — returns `profiles` row + role from `user_roles`.
- `getMyProgress` — returns `progress` row for `context.userId`.
- `getLinkedStudents` — joins `links` + `profiles` + `progress` for guardian.
- `updateMyProgress({ xp, level, streak_days, lessons, skill_errors })` — upsert own progress row.
- `linkStudent({ studentEmail, kind })` — parent/teacher inserts row in `links` after resolving student by email (via a SECURITY DEFINER lookup limited to id/email match).

### 6. Verify
- Build passes.
- `curl` `/login`, `/app` (should redirect to `/auth` via managed gate), `/dashboard` (same).
- Sign up as each role in the preview → confirm correct redirect target.

## Technical notes

- Roles live in `user_roles` per security rules — NOT on `profiles` — to avoid privilege escalation and RLS recursion. The `role` column on `profiles` is just a display convenience mirrored by the signup trigger; all authorization checks use `has_role()`.
- The managed `_authenticated/route.tsx` uses `ssr: false` and redirects unauthenticated users to `/auth` (the integration's built-in auth page). `/login` in this plan is our own signup/role-selection flow that lives alongside it; if the user prefers using the integration's `/auth` page exclusively, we can drop `/login` and add the role selector there instead.
- Static HTML routes are untouched.

## What I need from you before building

1. Confirm enabling Lovable Cloud is OK (it provisions Supabase-backed infra behind the scenes).
2. Confirm you want a custom `/login` with the 3-role selector, OR use the integration's default `/auth` page (simpler, less UI to maintain).