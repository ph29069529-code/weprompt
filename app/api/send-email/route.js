import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendConfirmacaoCompra,
  sendSolutionApproved,
  sendSolutionRejected,
} from '../../lib/email';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  const { type, to, user_id, solution_titulo, rejection_reason } = await request.json();

  let recipientEmail = to;
  if (!recipientEmail && user_id) {
    const { data: { user: targetUser } } = await supabaseAdmin.auth.admin.getUserById(user_id);
    recipientEmail = targetUser?.email;
  }

  if (!recipientEmail) {
    return NextResponse.json({ error: 'No recipient email' }, { status: 400 });
  }
  if (!solution_titulo) {
    return NextResponse.json({ error: 'solution_titulo is required' }, { status: 400 });
  }

  try {
    switch (type) {
      case 'purchase_confirmation':
        await sendConfirmacaoCompra({ to: recipientEmail, solutionName: solution_titulo });
        break;
      case 'solution_approved':
        await sendSolutionApproved({ to: recipientEmail, solutionTitulo: solution_titulo });
        break;
      case 'solution_rejected':
        await sendSolutionRejected({ to: recipientEmail, solutionTitulo: solution_titulo, reason: rejection_reason });
        break;
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('[send-email] error:', err);
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 });
  }
}
