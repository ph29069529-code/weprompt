/**
 * GET /api/cron/security-check
 *
 * Anomaly detection cron job — runs daily at 08:00 BRT via Vercel Cron.
 * Scans the last 24 hours of audit_logs and sends an alert email if it
 * finds suspicious patterns.
 *
 * Alerts triggered:
 *   1. Same IP hit rate_limit_hit more than 50 times in 24h
 *   2. Same user accessed workspace more than 100 times in 1 hour
 *   3. Any action on admin routes by non-admin users (data anomaly)
 *
 * Protected by CRON_SECRET to prevent unauthorized invocation.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "../../../lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALERT_EMAIL = "contato@weprompt.app.br";
const FROM_EMAIL  = "WePrompt Security <contato@weprompt.app.br>";

export async function GET(request) {
  // Protect the cron endpoint — Vercel sets this automatically; also accept manual calls with the secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const alerts = [];

  try {
    // ── Check 1: IPs that hit rate limits more than 50 times in 24h ──────
    const { data: rateLimitLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("ip_address")
      .eq("action", "rate_limit_hit")
      .gte("created_at", since);

    if (rateLimitLogs?.length) {
      const ipCounts = {};
      for (const row of rateLimitLogs) {
        const ip = row.ip_address || "unknown";
        ipCounts[ip] = (ipCounts[ip] || 0) + 1;
      }
      for (const [ip, count] of Object.entries(ipCounts)) {
        if (count >= 50) {
          alerts.push({
            severity: "HIGH",
            type: "rate_limit_abuse",
            description: `IP ${ip} hit rate limits ${count} times in the last 24h`,
          });
        }
      }
    }

    // ── Check 2: Users accessing workspace more than 100 times in 1 hour ─
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: workspaceLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("user_id")
      .eq("action", "workspace_access")
      .gte("created_at", oneHourAgo);

    if (workspaceLogs?.length) {
      const userCounts = {};
      for (const row of workspaceLogs) {
        const uid = row.user_id || "unknown";
        userCounts[uid] = (userCounts[uid] || 0) + 1;
      }
      for (const [uid, count] of Object.entries(userCounts)) {
        if (count >= 100) {
          alerts.push({
            severity: "HIGH",
            type: "workspace_abuse",
            description: `User ${uid} accessed workspace ${count} times in the last hour`,
          });
        }
      }
    }

    // ── Check 3: solution_approved/rejected logs with no matching admin ───
    // These actions should ONLY exist when done by an admin. If they appear
    // from non-admin user_ids it signals a policy bypass.
    const { data: adminActionLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("user_id, action, created_at")
      .in("action", ["solution_approved", "solution_rejected"])
      .gte("created_at", since);

    if (adminActionLogs?.length) {
      const userIds = [...new Set(adminActionLogs.map(r => r.user_id).filter(Boolean))];

      if (userIds.length > 0) {
        const { data: adminProfiles } = await supabaseAdmin
          .from("profiles")
          .select("id, role")
          .in("id", userIds);

        const adminSet = new Set(
          (adminProfiles || []).filter(p => p.role === "admin").map(p => p.id)
        );

        for (const log of adminActionLogs) {
          if (log.user_id && !adminSet.has(log.user_id)) {
            alerts.push({
              severity: "CRITICAL",
              type: "unauthorized_admin_action",
              description: `Non-admin user ${log.user_id} performed ${log.action} at ${log.created_at}`,
            });
          }
        }
      }
    }

    // ── Send alert email if there are findings ───────────────────────────
    if (alerts.length > 0) {
      const critical = alerts.filter(a => a.severity === "CRITICAL");
      const high     = alerts.filter(a => a.severity === "HIGH");

      const subject = critical.length > 0
        ? `[CRITICO] ${critical.length} alerta(s) de segurança — WePrompt`
        : `[ALERTA] ${high.length} anomalia(s) detectada(s) — WePrompt`;

      const alertRows = alerts.map(a => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;">
            <span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;background:${a.severity === "CRITICAL" ? "#fee2e2" : "#fef3c7"};color:${a.severity === "CRITICAL" ? "#b91c1c" : "#b45309"};">
              ${a.severity}
            </span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${a.type}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;">${a.description}</td>
        </tr>
      `).join("");

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F7FC;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7FC;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

  <tr><td style="padding:0 0 20px;text-align:center;">
    <span style="font-size:22px;font-weight:900;color:#0A0A1A;">We<span style="color:#6366F1;">Prompt</span></span>
    <span style="display:block;font-size:12px;color:#6b7280;margin-top:4px;">Security Alert</span>
  </td></tr>

  <tr><td style="background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <h1 style="font-size:20px;font-weight:800;color:#111827;margin:0 0 8px;">
      ${critical.length > 0 ? "Alertas Criticos Detectados" : "Anomalias Detectadas"}
    </h1>
    <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
      Periodo: ultimas 24 horas. Total: ${alerts.length} alerta(s).
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;width:90px;">Nivel</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Tipo</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Descricao</th>
        </tr>
      </thead>
      <tbody>${alertRows}</tbody>
    </table>

    <div style="margin-top:24px;padding:16px;background:#f3f4f6;border-radius:10px;font-size:13px;color:#374151;">
      <strong>Proximos passos:</strong> verifique os logs completos no painel admin do Supabase
      (tabela <code>audit_logs</code>) e tome as acoes necessarias.
    </div>
  </td></tr>

  <tr><td style="padding:20px 0 0;text-align:center;">
    <p style="font-size:12px;color:#9ca3af;margin:0;">
      Este email foi gerado automaticamente pelo sistema de seguranca WePrompt.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to:   ALERT_EMAIL,
        subject,
        html,
      });
    }

    // Log this cron run in audit_logs
    await supabaseAdmin.from("audit_logs").insert({
      user_id:    null,
      action:     "security_check_ran",
      resource:   "cron",
      resource_id: null,
      ip_address: "cron",
      metadata: {
        alerts_found: alerts.length,
        since,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      ok: true,
      alerts_found: alerts.length,
      alerts,
      email_sent: alerts.length > 0,
    });
  } catch (err) {
    console.error("[security-check cron]", err);
    return NextResponse.json({ error: "Cron job failed", detail: err?.message }, { status: 500 });
  }
}
