// DMARC DNS record to add in registro.br:
// Type: TXT  |  Name: _dmarc  |  Value: v=DMARC1; p=none; rua=mailto:contato@weprompt.app.br

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBoasVindas } from "../../../lib/email";

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

    const { nome, role } = await request.json();
    await sendBoasVindas({ to: user.email, nome, role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("boas-vindas email error:", err);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
