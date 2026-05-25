import { resend } from './resend';

const FROM = 'WePrompt <noreply@weprompt.com.br>';
const FROM_NEW = 'WePrompt <contato@weprompt.app.br>';
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

/* ─────────────────────────────────────────────────────────────
   New branded templates (navy header, #0369A1 blue accent)
───────────────────────────────────────────────────────────── */

const YEAR = new Date().getFullYear();

function newBase(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background:#F5F5F7;font-family:-apple-system,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F7;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

  <tr>
    <td style="background:#0A0F1E;border-radius:20px 20px 0 0;padding:32px 40px;text-align:center;">
      <p style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-family:-apple-system,Arial,sans-serif;">WePrompt</p>
      <p style="margin:8px 0 0;font-size:13px;color:#38BDF8;font-weight:500;font-family:-apple-system,Arial,sans-serif;">O 1º Marketplace de IA da América Latina</p>
    </td>
  </tr>

  <tr>
    <td style="background:#ffffff;padding:40px;">
      ${bodyHtml}
    </td>
  </tr>

  <tr>
    <td style="background:#F5F5F7;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;color:#6E6E73;font-family:-apple-system,Arial,sans-serif;">
        © ${YEAR} WePrompt. O 1º marketplace de soluções de IA da América Latina.
      </p>
      <p style="margin:0;font-size:12px;font-family:-apple-system,Arial,sans-serif;">
        <a href="https://weprompt.app.br/para-empresas/termos" style="color:#0369A1;text-decoration:none;">Termos</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://weprompt.app.br/privacidade" style="color:#0369A1;text-decoration:none;">Privacidade</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:contato@weprompt.app.br" style="color:#0369A1;text-decoration:none;">Contato</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendBoasVindas({ to, nome, role }) {
  const isCreador = role === 'criador';

  const creatorSection = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr><td style="background:#e0f2fe;border-radius:12px;padding:20px;">
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">Pronto para monetizar sua solução? 💡</p>
        <p style="margin:0 0 16px;font-size:13px;color:#6E6E73;line-height:1.65;font-family:-apple-system,Arial,sans-serif;">Como criador, você pode publicar soluções de IA e começar a vender para empresas em toda a América Latina.</p>
        <a href="https://weprompt.app.br/dashboard/criador" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;border-radius:10px;font-family:-apple-system,Arial,sans-serif;">Publicar minha primeira solução →</a>
      </td></tr>
    </table>`;

  const html = newBase(`
    <h1 style="font-size:28px;font-weight:800;color:#1D1D1F;margin:0 0 12px;letter-spacing:-0.5px;font-family:-apple-system,Arial,sans-serif;">Olá, ${nome}! 👋</h1>
    <p style="font-size:15px;color:#6E6E73;line-height:1.7;margin:0 0 28px;font-family:-apple-system,Arial,sans-serif;">
      Seja bem-vindo(a) à WePrompt — o primeiro marketplace de soluções de IA da América Latina.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr><td style="padding:0 0 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid #e5e7eb;border-radius:12px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:22px;line-height:1.2;">🔍</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">Explore 500+ soluções de IA prontas para usar</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid #e5e7eb;border-radius:12px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:22px;line-height:1.2;">🇧🇷</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">Suporte em português, pagamentos em reais</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid #e5e7eb;border-radius:12px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:22px;line-height:1.2;">⚡</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">Implemente em minutos, não em meses</p>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <div style="text-align:center;margin-bottom:0;">
      <a href="https://weprompt.app.br/solucoes" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 32px;border-radius:12px;font-family:-apple-system,Arial,sans-serif;">Explorar Soluções →</a>
    </div>

    ${isCreador ? creatorSection : ''}
  `);

  return resend.emails.send({
    from: FROM_NEW,
    to,
    subject: 'Bem-vindo à WePrompt! 🚀',
    html,
  });
}

export async function sendConfirmacaoCompra({ to, nome, solutionName, solutionCategory, price }) {
  const priceLabel = price != null
    ? `R$&nbsp;${Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : 'Gratuito';

  const html = newBase(`
    <h1 style="font-size:26px;font-weight:800;color:#1D1D1F;margin:0 0 8px;letter-spacing:-0.5px;font-family:-apple-system,Arial,sans-serif;">Compra confirmada! ✅</h1>
    <p style="font-size:15px;color:#6E6E73;line-height:1.7;margin:0 0 28px;font-family:-apple-system,Arial,sans-serif;">
      ${nome ? `Olá, ${nome}! ` : ''}Seu pagamento foi processado com sucesso.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #0369A1;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:24px;">
        <p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">${solutionName}</p>
        ${solutionCategory ? `<p style="margin:0 0 12px;"><span style="display:inline-block;background:#e0f2fe;color:#0369A1;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;font-family:-apple-system,Arial,sans-serif;">${solutionCategory}</span></p>` : ''}
        <p style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0369A1;letter-spacing:-0.5px;font-family:-apple-system,Arial,sans-serif;">${priceLabel}</p>
        <p style="margin:0;font-size:13px;font-weight:700;color:#059669;font-family:-apple-system,Arial,sans-serif;">✓ Acesso liberado imediatamente</p>
      </td></tr>
    </table>

    <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">Próximos passos</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      ${[
        ['1', 'Acesse sua solução no dashboard', 'Todas as suas compras ficam salvas no seu painel.'],
        ['2', 'Entre em contato com o criador se precisar de ajuda', 'O criador está disponível para ajudar com a configuração.'],
        ['3', 'Deixe uma avaliação', 'Sua opinião ajuda outros compradores a escolher.'],
      ].map(([n, title, desc]) => `
      <tr><td style="padding:0 0 14px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="32" valign="top" style="padding-right:12px;">
              <div style="width:28px;height:28px;border-radius:50%;background:#0369A1;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#fff;font-family:-apple-system,Arial,sans-serif;">${n}</div>
            </td>
            <td valign="top">
              <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">${title}</p>
              <p style="margin:0;font-size:13px;color:#6E6E73;line-height:1.55;font-family:-apple-system,Arial,sans-serif;">${desc}</p>
            </td>
          </tr>
        </table>
      </td></tr>`).join('')}
    </table>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://weprompt.app.br/dashboard/empresa" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 32px;border-radius:12px;font-family:-apple-system,Arial,sans-serif;">Acessar Meu Dashboard →</a>
    </div>

    <p style="font-size:13px;color:#6E6E73;text-align:center;margin:0 0 20px;font-family:-apple-system,Arial,sans-serif;">
      Dúvidas? Responda este email ou acesse <a href="mailto:contato@weprompt.app.br" style="color:#0369A1;text-decoration:none;">contato@weprompt.app.br</a>
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border:1.5px solid #bbf7d0;border-radius:12px;background:#f0fdf4;padding:16px 20px;">
        <p style="margin:0;font-size:14px;color:#1D1D1F;font-family:-apple-system,Arial,sans-serif;">
          🛡️ <strong>Garantia de 7 dias</strong> — Se não funcionar como descrito, devolvemos 100% do valor.
        </p>
      </td></tr>
    </table>
  `);

  return resend.emails.send({
    from: FROM_NEW,
    to,
    subject: `Sua compra foi confirmada! ✅ ${solutionName}`,
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
