import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const MAX_NOME   = 100;
const MAX_BIO    = 500;
const MAX_CIDADE = 100;

function isValidHttpsUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { nome, bio, cidade, avatar_url } = body;

  // Validate types and lengths
  if (nome !== undefined && (typeof nome !== "string" || nome.length > MAX_NOME)) {
    return NextResponse.json({ error: "Nome inválido (máximo 100 caracteres)." }, { status: 400 });
  }
  if (bio !== undefined && (typeof bio !== "string" || bio.length > MAX_BIO)) {
    return NextResponse.json({ error: "Bio inválida (máximo 500 caracteres)." }, { status: 400 });
  }
  if (cidade !== undefined && (typeof cidade !== "string" || cidade.length > MAX_CIDADE)) {
    return NextResponse.json({ error: "Cidade inválida (máximo 100 caracteres)." }, { status: 400 });
  }
  if (avatar_url !== undefined && avatar_url !== null && avatar_url !== "") {
    if (!isValidHttpsUrl(avatar_url)) {
      return NextResponse.json({ error: "URL de avatar inválida." }, { status: 400 });
    }
  }

  const patch = {};
  if (nome    !== undefined) patch.nome    = nome?.trim()    ?? null;
  if (bio     !== undefined) patch.bio     = bio?.trim()     ?? null;
  if (cidade  !== undefined) patch.cidade  = cidade?.trim()  ?? null;
  if (avatar_url !== undefined) patch.avatar_url = avatar_url || null;

  const { error: updateErr } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (updateErr) {
    console.error("[profile/update]", updateErr);
    return NextResponse.json({ error: "Erro ao atualizar perfil. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
