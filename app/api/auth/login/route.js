/**
 * POST /api/auth/login
 *
 * Server-side login proxy with IP-based rate limiting.
 * Rate limit: 5 attempts per IP per 15 minutes.
 *
 * Usage: the login page should POST { email, password } here instead of
 * calling supabase.auth.signInWithPassword() directly from the client.
 * This prevents brute-force attacks by enforcing limits at the server layer.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, LIMITS } from "../../../lib/rateLimiter";

export async function POST(request) {
  // Extract real IP (Vercel sets x-forwarded-for)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit: 5 login attempts per IP per 15 minutes
  const rl = checkRateLimit(`login:${ip}`, LIMITS.LOGIN.limit, LIMITS.LOGIN.windowMs);

  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterSec / 60);
    return NextResponse.json(
      {
        error: `Muitas tentativas de login. Aguarde ${minutes} ${minutes === 1 ? "minuto" : "minutos"} antes de tentar novamente.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSec),
          "X-RateLimit-Limit": String(LIMITS.LOGIN.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
  }

  // Call Supabase signInWithPassword server-side
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    // Return a generic message — never leak whether email exists
    return NextResponse.json(
      { error: "Email ou senha incorretos." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}
