import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profile, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw error;
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return { profile, roles: (roles ?? []).map((r) => r.role) };
  });

export const getMyProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("progress")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return { progress: data };
  });

export const getLinkedStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: links, error } = await context.supabase
      .from("links")
      .select("student_id, kind")
      .eq("guardian_id", context.userId);
    if (error) throw error;
    const ids = (links ?? []).map((l) => l.student_id);
    if (ids.length === 0) return { students: [] as Array<{ student_id: string; kind: string; profile: { id: string; name: string | null; level: number; daily_goal: number } | null; progress: { xp: number; level: number; streak_days: unknown } | null }> };
    const [{ data: profs }, { data: progs }] = await Promise.all([
      context.supabase.from("profiles").select("id, name, level, daily_goal").in("id", ids),
      context.supabase.from("progress").select("user_id, xp, level, streak_days").in("user_id", ids),
    ]);
    return {
      students: (links ?? []).map((l) => ({
        student_id: l.student_id,
        kind: l.kind,
        profile: profs?.find((p) => p.id === l.student_id) ?? null,
        progress: progs?.find((p) => p.user_id === l.student_id) ?? null,
      })),
    };
  });

