import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendConfirmacaoCompra } from "../../lib/email";

// -- ALTER TABLE subscriptions
// -- ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, { status: 405 });
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

      // ── BUG 1 + BUG 3 ──────────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;
        const { user_id, solution_id, payment_type } = session.metadata || {};

        if (!user_id || !solution_id) break;

        // BUG 3: idempotency — skip if we already processed this session
        const { data: existing } = await supabaseAdmin
          .from("subscriptions")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existing) {
          console.log("Duplicate webhook for session", session.id, "— skipping insert");
          break;
        }

        // BUG 1: capture stripe_subscription_id from the session
        const stripeSubscriptionId = session.subscription || null;

        const { error: insertError } = await supabaseAdmin.from("subscriptions").insert({
          business_id: user_id,
          solution_id,
          status: "active",
          payment_type: payment_type || "subscription",
          stripe_session_id: session.id,
          stripe_subscription_id: stripeSubscriptionId,
        });

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          break;
        }

        // Send confirmation email + in-app notifications
        const buyerEmail = session.customer_details?.email;
        const [{ data: sol }, { data: prof }] = await Promise.all([
          supabaseAdmin.from("solutions").select("titulo, categoria, preco, creator_id").eq("id", solution_id).single(),
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

        const notificationsToInsert = [
          {
            user_id,
            type: "nova_compra",
            title: "Compra confirmada!",
            message: `Você adquiriu "${sol?.titulo || "a solução"}". Acesse seu dashboard para começar.`,
            link: "/dashboard/empresa",
          },
        ];
        if (sol?.creator_id && sol.creator_id !== user_id) {
          notificationsToInsert.push({
            user_id: sol.creator_id,
            type: "nova_venda",
            title: "Nova venda!",
            message: `${prof?.nome || "Um usuário"} adquiriu "${sol.titulo}".`,
            link: "/dashboard/criador",
          });
        }
        supabaseAdmin.from("notifications").insert(notificationsToInsert)
          .then(({ error }) => { if (error) console.error("Notification insert error:", error); })
          .catch(err => console.error("Notification error:", err));

        break;
      }

      // ── Backfill stripe_subscription_id if checkout fired first ────────────
      case "customer.subscription.created": {
        const subscription = event.data.object;
        // Stripe puts the checkout session ID in subscription.metadata when
        // the subscription originated from a Checkout Session.
        const sessionId = subscription.metadata?.session_id || null;

        if (sessionId) {
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({ stripe_subscription_id: subscription.id })
            .eq("stripe_session_id", sessionId)
            .is("stripe_subscription_id", null); // only patch if not already set
          if (error) console.error("subscription.created update error:", error);
          else console.log("Backfilled stripe_subscription_id for session", sessionId);
        } else {
          console.log("customer.subscription.created — no session_id in metadata, skipping backfill");
        }
        break;
      }

      // ── BUG 2: invoice.payment_succeeded — now matches correctly ───────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("invoice.payment_succeeded update error:", error);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("invoice.payment_failed update error:", error);
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
