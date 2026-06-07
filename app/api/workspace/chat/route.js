import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
