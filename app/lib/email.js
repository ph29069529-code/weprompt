import { resend } from './resend';

const FROM = 'WePrompt <noreply@weprompt.com.br>';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://weprompt.com.br';
const PURPLE = '#6B5CE7';

function base(content) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F7FC;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7FC;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <tr><td style="padding:0 0 24px;text-align:center;">
    <span style="font-size:24px;font-weight:900;color:#0A0A1A;letter-spacing:-0.5px;">We<span style="color:${PURPLE}">Prompt</span></span>
  </td></tr>

  <tr><td style="background:#ffffff;border-radius:20px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    ${content}
  </td></tr>

  <tr><td style="padding:24px 0 0;text-align:center;">
    <p style="font-size:12px;color:#9CA3AF;margin:0;">
      © ${new Date().getFullYear()} WePrompt · O marketplace de IA da América Latina
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function solutionBox(titulo) {
  return `
<div style="background:#F7F7FC;border-radius:12px;padding:20px;margin-bottom:28px;border-left:4px solid ${PURPLE};">
  <p style="font-size:11px;font-weight:700;color:#6B7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.6px;">Solução</p>
  <p style="font-size:16px;font-weight:700;color:#0A0A1A;margin:0;">${titulo}</p>
</div>`;
}

function ctaButton(text, href) {
  return `
<div style="text-align:center;margin-top:28px;">
  <a href="${href}" style="display:inline-block;background:${PURPLE};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;">
    ${text}
  </a>
</div>`;
}

export async function sendPurchaseConfirmation({ to, solutionTitulo }) {
  const html = base(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:50%;background:#DCFCE7;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:26px;color:#16A34A;">✓</span>
      </div>
      <h1 style="font-size:22px;font-weight:800;color:#0A0A1A;margin:0 0 8px;letter-spacing:-0.4px;">Compra confirmada!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;line-height:1.6;">Sua solução já está disponível no dashboard.</p>
    </div>
    ${solutionBox(solutionTitulo)}
    <p style="font-size:14px;color:#6B7280;line-height:1.75;margin:0;">
      Obrigado por escolher a WePrompt! Acesse seu dashboard para começar a usar sua solução de IA imediatamente.
    </p>
    ${ctaButton('Acessar minha solução →', `${SITE}/dashboard/empresa`)}
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Compra confirmada! Acesse sua solução na WePrompt',
    html,
  });
}

export async function sendSolutionApproved({ to, solutionTitulo }) {
  const html = base(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(107,92,231,0.1);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:26px;color:${PURPLE};">✦</span>
      </div>
      <h1 style="font-size:22px;font-weight:800;color:#0A0A1A;margin:0 0 8px;letter-spacing:-0.4px;">Sua solução foi aprovada!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;line-height:1.6;">Ela já está ao vivo no marketplace WePrompt.</p>
    </div>
    ${solutionBox(solutionTitulo)}
    <p style="font-size:14px;color:#6B7280;line-height:1.75;margin:0;">
      Parabéns! Nossa equipe de curadoria analisou sua solução e ela está pronta para receber compradores.
      Acompanhe seu desempenho e vendas diretamente pelo dashboard de criador.
    </p>
    ${ctaButton('Ver meu dashboard →', `${SITE}/dashboard/criador`)}
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Sua solução foi aprovada na WePrompt! 🎉',
    html,
  });
}

export async function sendSolutionRejected({ to, solutionTitulo, reason }) {
  const html = base(`
    <div style="text-align:center;margin-bottom:28px;">
      <h1 style="font-size:22px;font-weight:800;color:#0A0A1A;margin:0 0 8px;letter-spacing:-0.4px;">Atualização sobre sua solução</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;line-height:1.6;">Nossa equipe de curadoria analisou sua submissão.</p>
    </div>
    <div style="background:#F7F7FC;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #E5E7EB;">
      <p style="font-size:11px;font-weight:700;color:#6B7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.6px;">Solução</p>
      <p style="font-size:16px;font-weight:700;color:#0A0A1A;margin:0;">${solutionTitulo}</p>
    </div>
    ${reason ? `
    <div style="background:#FEF2F2;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #FECACA;">
      <p style="font-size:11px;font-weight:700;color:#DC2626;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.6px;">Motivo do retorno</p>
      <p style="font-size:14px;color:#0A0A1A;margin:0;line-height:1.75;">${reason}</p>
    </div>
    ` : ''}
    <p style="font-size:14px;color:#6B7280;line-height:1.75;margin:0;">
      Não desanime! Você pode ajustar sua solução com base no feedback acima e reenviá-la para curadoria.
      Estamos aqui para ajudar você a publicar a melhor versão possível.
    </p>
    ${ctaButton('Editar e reenviar →', `${SITE}/dashboard/criador`)}
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Atualização sobre sua solução na WePrompt',
    html,
  });
}
