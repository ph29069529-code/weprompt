import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logAction } from "../../../lib/auditLog";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function requireAdmin(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

/* PATCH /api/admin/solutions — approve or reject a solution */
export async function PATCH(request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { solution_id, action, rejection_reason } = await request.json();

  if (!solution_id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (action === "reject" && !rejection_reason?.trim()) {
    return NextResponse.json({ error: "Motivo de reprovação é obrigatório." }, { status: 400 });
  }

  const patch =
    action === "approve"
      ? { status: "approved" }
      : { status: "rejected", rejection_reason: rejection_reason.trim() };

  const { data: solution, error } = await supabaseAdmin
    .from("solutions")
    .update(patch)
    .eq("id", solution_id)
    .select("id, titulo, creator_id, status")
    .single();

  if (error) {
    console.error("[admin/solutions PATCH]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }

  // Audit log — fire and forget
  const auditAction = action === "approve" ? "solution_approved" : "solution_rejected";
  logAction(admin.id, auditAction, "solutions", solution_id, request, {
    solution_titulo: solution.titulo,
    creator_id: solution.creator_id,
    rejection_reason: rejection_reason ?? null,
  });

  return NextResponse.json({ success: true, solution });
}
