import { NextResponse } from "next/server";
import { sendBoasVindas } from "../../../lib/email";

export async function POST(request) {
  try {
    const { email, nome, role } = await request.json();
    if (!email || !nome) {
      return NextResponse.json({ error: "email e nome são obrigatórios." }, { status: 400 });
    }
    await sendBoasVindas({ to: email, nome, role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("boas-vindas email error:", err);
    return NextResponse.json({ error: err.message || "Erro interno." }, { status: 500 });
  }
}
