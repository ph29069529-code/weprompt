/*
 * Run once in Supabase SQL editor:
 *
 * CREATE TABLE IF NOT EXISTS reviews (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   solution_id uuid REFERENCES solutions(id) ON DELETE CASCADE,
 *   user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
 *   rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
 *   comment text,
 *   created_at timestamptz DEFAULT now(),
 *   UNIQUE(solution_id, user_id)
 * );
 * ALTER TABLE solutions ADD COLUMN IF NOT EXISTS avg_rating decimal(3,2) DEFAULT 0;
 * ALTER TABLE solutions ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ── GET /api/reviews?solution_id=xxx ── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const solution_id = searchParams.get("solution_id");

  if (!solution_id) {
    return NextResponse.json({ error: "solution_id é obrigatório." }, { status: 400 });
  }

  const { data: reviews, error } = await supabaseAdmin
    .from("reviews")
    .select("id, rating, comment, created_at, user_id")
    .eq("solution_id", solution_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!reviews || reviews.length === 0) {
    return NextResponse.json([]);
  }

  const userIds = [...new Set(reviews.map(r => r.user_id))];
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, nome")
    .in("id", userIds);

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  return NextResponse.json(
    reviews.map(r => ({
      ...r,
      reviewer_name: profileMap[r.user_id]?.nome || "Usuário verificado",
    }))
  );
}

/* ── POST /api/reviews ── */
export async function POST(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const { solution_id, rating, comment } = await request.json();

  if (!solution_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  // Verify purchase
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("solution_id", solution_id)
    .eq("business_id", user.id)
    .limit(1);

  if (!subscription || subscription.length === 0) {
    return NextResponse.json(
      { error: "Você precisa adquirir esta solução para avaliá-la." },
      { status: 403 }
    );
  }

  // Prevent duplicate
  const { data: existing } = await supabaseAdmin
    .from("reviews")
    .select("id")
    .eq("solution_id", solution_id)
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Você já avaliou esta solução." }, { status: 409 });
  }

  // Insert
  const { data: review, error: insertError } = await supabaseAdmin
    .from("reviews")
    .insert({
      solution_id,
      user_id: user.id,
      rating: Number(rating),
      comment: comment?.trim() || null,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Review insert error:", insertError);
    return NextResponse.json({ error: "Erro ao salvar avaliação." }, { status: 500 });
  }

  // Recalculate avg_rating and review_count on the solution
  const { data: allReviews } = await supabaseAdmin
    .from("reviews")
    .select("rating")
    .eq("solution_id", solution_id);

  let creatorId = null;
  if (allReviews) {
    const count = allReviews.length;
    const avg   = allReviews.reduce((a, r) => a + r.rating, 0) / count;
    const { data: updatedSol } = await supabaseAdmin
      .from("solutions")
      .update({ avg_rating: Math.round(avg * 100) / 100, review_count: count })
      .eq("id", solution_id)
      .select("creator_id, titulo")
      .single();
    creatorId = updatedSol?.creator_id;

    // Notify creator
    if (creatorId && creatorId !== user.id) {
      supabaseAdmin.from("notifications").insert({
        user_id: creatorId,
        type: "nova_avaliacao",
        title: "Nova avaliação recebida!",
        message: `Sua solução "${updatedSol?.titulo || ""}" recebeu uma avaliação de ${rating} estrela${rating === 1 ? "" : "s"}.`,
        link: "/dashboard/criador",
      }).then(({ error }) => { if (error) console.error("Notification insert error:", error); })
        .catch(err => console.error("Notification error:", err));
    }
  }

  // Return review with reviewer name
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    review: { ...review, reviewer_name: profile?.nome || "Usuário verificado" },
  });
}
