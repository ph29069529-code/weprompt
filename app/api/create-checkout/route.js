import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";

export async function POST(request) {
  try {
    const { solution_id, solution_titulo, solution_preco, user_id, payment_type = "subscription" } = await request.json();

    if (!solution_id || !solution_titulo || solution_preco == null || !user_id) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const unitAmount = Math.round(Number(solution_preco) * 100);
    const isSubscription = payment_type === "subscription";

    const priceData = isSubscription
      ? {
          currency: "brl",
          unit_amount: unitAmount,
          recurring: { interval: "month" },
          product_data: { name: solution_titulo },
        }
      : {
          currency: "brl",
          unit_amount: unitAmount,
          product_data: { name: solution_titulo },
        };

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price_data: priceData, quantity: 1 }],
      success_url: `${origin}/dashboard/empresa/success?solution_id=${solution_id}`,
      cancel_url: `${origin}/solucoes`,
      metadata: {
        solution_id: String(solution_id),
        user_id: String(user_id),
        payment_type,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Erro interno." }, { status: 500 });
  }
}
