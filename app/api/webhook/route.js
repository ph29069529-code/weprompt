import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendConfirmacaoCompra } from "../../lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { user_id, solution_id, payment_type } = session.metadata || {};

        if (user_id && solution_id) {
          const { error } = await supabaseAdmin.from("subscriptions").insert({
            business_id: user_id,
            solution_id,
            status: "active",
            payment_type: payment_type || "subscription",
            stripe_session_id: session.id,
          });
          if (error) {
            console.error("Supabase insert error:", error);
          } else {
            const buyerEmail = session.customer_details?.email;
            const [{ data: sol }, { data: prof }] = await Promise.all([
              supabaseAdmin.from("solutions").select("titulo, categoria, preco").eq("id", solution_id).single(),
              supabaseAdmin.from("profiles").select("nome").eq("id", user_id).single(),
            ]);
            if (buyerEmail && sol) {
              sendConfirmacaoCompra({
                to: buyerEmail,
                nome: prof?.nome || "",
                solutionName: sol.titulo,
                solutionCategory: sol.categoria || "",
                price: sol.preco,
              }).catch(err => console.error("Email send error:", err));
            }
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({ status: "active" })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("Supabase update error:", error);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("Supabase update error:", error);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
