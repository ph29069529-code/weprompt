/**
 * Audit logging utility for WePrompt.
 *
 * Writes security-relevant events to the audit_logs table using the
 * service-role client so RLS doesn't block inserts.
 *
 * NEVER throws — a failed log must not break the calling operation.
 *
 * Actions tracked:
 *   login, logout, purchase_initiated, workspace_access,
 *   solution_approved, solution_rejected, profile_updated, rate_limit_hit
 */

import { createClient } from "@supabase/supabase-js";

/** Single service-role client shared across invocations (module singleton). */
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * logAction — write one audit event.
 *
 * @param {string|null} userId      Auth user UUID (null for unauthenticated events)
 * @param {string}      action      Event name, e.g. 'workspace_access'
 * @param {string|null} resource    Table or entity type, e.g. 'solutions'
 * @param {string|null} resourceId  UUID of the affected resource
 * @param {Request}     req         Next.js Request object (used to extract IP + UA)
 * @param {object|null} metadata    Extra context (never include secrets)
 */
export async function logAction(userId, action, resource, resourceId, req, metadata) {
  try {
    const ip =
      req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req?.headers?.get("x-real-ip") ??
      "unknown";

    const userAgent = req?.headers?.get("user-agent") ?? null;

    const supabaseAdmin = getAdminClient();

    const { error } = await supabaseAdmin.from("audit_logs").insert({
      user_id:     userId     ?? null,
      action,
      resource:    resource   ?? null,
      resource_id: resourceId ? String(resourceId) : null,
      ip_address:  ip,
      user_agent:  userAgent,
      metadata:    metadata   ?? null,
    });

    if (error) {
      console.error("[audit_log] Insert error:", error.message);
    }
  } catch (err) {
    // Swallow — logging must never break the main operation
    console.error("[audit_log] Unexpected error:", err?.message);
  }
}
