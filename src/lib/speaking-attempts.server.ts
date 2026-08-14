import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const SPEAKING_AUDIO_BUCKET = "speaking-audio";
export const SPEAKING_AUDIO_RETENTION_DAYS = 30;

export async function speakingUserClient(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return null;
  const token = authorization.slice(7);
  if (token.split(".").length !== 3) return null;
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("backend_unavailable");
  const client = createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getClaims(token);
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string") return null;
  return { client, userId };
}

export function speakingAudioExpiry() {
  return new Date(Date.now() + SPEAKING_AUDIO_RETENTION_DAYS * 86_400_000).toISOString();
}
