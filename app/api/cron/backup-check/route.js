/**
 * GET /api/cron/backup-check
 *
 * Daily backup status check — runs at 09:00 BRT via Vercel Cron.
 *
 * Supabase Free tier automatically creates daily backups (Point-in-Time
 * Recovery is available on Pro+). This route cannot query the Supabase
 * Management API without a Management API token, so it performs a
 * lightweight proxy health check and logs the status to audit_logs.
 *
 * What it does:
 *   1. Pings the Supabase project URL to confirm the DB is reachable
 *   2. Counts rows in critical tables as a data-integrity sanity check
 *   3. Logs the result to audit_logs for admin visibility
 *   4. If the DB is unreachable, sends an alert email
 *
 * Protected by CRON_SECRET env var.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "../../../lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALERT_EMAIL = "contato@weprompt.app.br";
const FROM_EMAIL  = "WePrompt System <contato@weprompt.app.br>";

const CRITICAL_TABLES = ["profiles", "solutions", "subscriptions", "audit_logs"];

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  const results = {};
  let dbReachable = true;

  try {
    // Count rows in each critical table as a sanity check
    for (const table of CRITICAL_TABLES) {
      try {
        const { count, error } = await supabaseAdmin
          .from(table)
          .select("*", { count: "exact", head: true });

        if (error) {
          results[table] = { ok: false, error: error.message };
          dbReachable = false;
        } else {
          results[table] = { ok: true, count };
        }
      } catch (err) {
        results[table] = { ok: false, error: err?.message };
        dbReachable = false;
      }
    }

    const status = dbReachable ? "healthy" : "degraded";

    // Log to audit_logs
    await supabaseAdmin.from("audit_logs").insert({
      user_id:    null,
      action:     "backup_check_ran",
      resource:   "cron",
      resource_id: null,
      ip_address: "cron",
      metadata: {
        status,
        db_reachable: dbReachable,
        table_counts: results,
        timestamp,
        supabase_backup_note:
          "Supabase Free tier performs automatic daily backups. " +
          "Upgrade to Pro for Point-in-Time Recovery (PITR). " +
          "Verify backup status at: app.supabase.com > Project > Database > Backups",
      },
    });

    // Alert if DB is not reachable
    if (!dbReachable) {
      const failedTables = Object.entries(results)
        .filter(([, v]) => !v.ok)
        .map(([table, v]) => `${table}: ${v.error}`)
        .join("<br>");

      await resend.emails.send({
        from: FROM_EMAIL,
        to:   ALERT_EMAIL,
        subject: "[CRITICO] Banco de dados inacessivel — WePrompt",
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px;background:#F7F7FC;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <h1 style="font-size:20px;font-weight:800;color:#b91c1c;margin:0 0 16px;">
    Banco de Dados Inacessivel
  </h1>
  <p style="font-size:14px;color:#374151;margin:0 0 16px;">
    O backup-check diario detectou problemas de conectividade com o banco de dados
    Supabase. Verifique imediatamente.
  </p>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;font-size:13px;color:#b91c1c;">
    ${failedTables}
  </div>
  <p style="font-size:12px;color:#9ca3af;margin-top:24px 0 0;">
    Verificado em: ${timestamp}
  </p>
</div>
</body>
</html>`,
      });
    }

    return NextResponse.json({
      ok: true,
      status,
      db_reachable: dbReachable,
      table_counts: results,
      backup_info: {
        provider: "Supabase",
        free_tier: "Daily automatic backups (7-day retention)",
        pro_tier: "Point-in-Time Recovery (PITR)",
        verify_url: "https://app.supabase.com — Project > Database > Backups",
      },
      timestamp,
    });
  } catch (err) {
    console.error("[backup-check cron]", err);
    return NextResponse.json({ error: "Cron job failed", detail: err?.message }, { status: 500 });
  }
}
