import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { solution_id, payment_type = "subscription" } = await request.json();

    if (!solution_id) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { data: solution, error: solError } = await supabaseAdmin
      .from("solutions")
      .select("id, titulo, preco, payment_type, status")
      .eq("id", solution_id)
      .single();

    if (solError || !solution) {
      return NextResponse.json({ error: "Solução não encontrada." }, { status: 404 });
    }

    if (solution.status !== "approved") {
      return NextResponse.json({ error: "Solução não disponível." }, { status: 400 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const unitAmount = Math.round(Number(solution.preco) * 100);
    const isSubscription = solution.payment_type !== "one_time" && payment_type !== "one_time";

    const priceData = isSubscription
      ? {
          currency: "brl",
          unit_amount: unitAmount,
          recurring: { interval: "month" },
          product_data: { name: solution.titulo },
        }
      : {
          currency: "brl",
          unit_amount: unitAmount,
          product_data: { name: solution.titulo },
        };

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price_data: priceData, quantity: 1 }],
      success_url: `${origin}/obrigado?session_id={CHECKOUT_SESSION_ID}&solution_id=${solution_id}`,
      cancel_url: `${origin}/checkout/${solution_id}`,
      metadata: {
        solution_id: String(solution_id),
        user_id: String(user.id),
        payment_type: isSubscription ? "subscription" : "one_time",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
