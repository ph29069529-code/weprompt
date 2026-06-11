import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, LIMITS } from "../../../lib/rateLimiter";
import { logAction } from "../../../lib/auditLog";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    // Rate limit: 20 messages per user per hour
    const rl = checkRateLimit(user.id, LIMITS.WORKSPACE_CHAT.limit, LIMITS.WORKSPACE_CHAT.windowMs);
    if (!rl.allowed) {
      logAction(user.id, "rate_limit_hit", "workspace_chat", null, request, {
        limit: LIMITS.WORKSPACE_CHAT.limit,
        windowMs: LIMITS.WORKSPACE_CHAT.windowMs,
      });
      return NextResponse.json(
        { error: "Limite de mensagens atingido. Tente novamente em breve." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfterSec),
            "X-RateLimit-Limit": String(LIMITS.WORKSPACE_CHAT.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
          },
        }
      );
    }

    const { messages, solutionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    if (!solutionId) {
      return NextResponse.json({ error: "solutionId required" }, { status: 400 });
    }

    if (messages.length > 50) {
      return NextResponse.json({ error: "Limite de mensagens excedido." }, { status: 400 });
    }

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("solution_id", solutionId)
      .eq("business_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ error: "Assinatura ativa necessária." }, { status: 403 });
    }

    // Log workspace access (fire-and-forget — must not block the response)
    logAction(user.id, "workspace_access", "solutions", solutionId, request, {
      message_count: messages.length,
    });

    const { data: sol } = await supabaseAdmin
      .from("solutions")
      .select("agent_system_prompt")
      .eq("id", solutionId)
      .single();

    const system =
      sol?.agent_system_prompt ||
      "Você é um assistente de IA útil e amigável. Responda sempre em português brasileiro de forma clara e concisa.";

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content),
      })),
    });

    return NextResponse.json({
      content: response.content[0].text,
      usage: response.usage,
    });
  } catch (err) {
    console.error("[workspace/chat]", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
