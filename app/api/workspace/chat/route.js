// Add to .env.local:  ANTHROPIC_API_KEY=your_key_here
// Add to Vercel environment variables: ANTHROPIC_API_KEY

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { messages, systemPrompt, solutionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const system =
      systemPrompt ||
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
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
