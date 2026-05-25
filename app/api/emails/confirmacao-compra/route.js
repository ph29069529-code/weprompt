import { NextResponse } from "next/server";
import { sendConfirmacaoCompra } from "../../../lib/email";

export async function POST(request) {
  try {
    const { userEmail, userName, solutionName, solutionCategory, price } = await request.json();
    if (!userEmail || !solutionName) {
      return NextResponse.json({ error: "userEmail e solutionName são obrigatórios." }, { status: 400 });
    }
    await sendConfirmacaoCompra({ to: userEmail, nome: userName || "", solutionName, solutionCategory: solutionCategory || "", price });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("confirmacao-compra email error:", err);
    return NextResponse.json({ error: err.message || "Erro interno." }, { status: 500 });
  }
}
