"use client";

import { useState, useEffect } from "react";

const H = "#0A0F1E";
const B = "#374151";
const G = "#6B7280";
const INDIGO = "#6366F1";

export default function Privacidade() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const h2 = { fontSize: 20, fontWeight: 700, color: H, marginTop: 40, marginBottom: 12 };
  const p = { fontSize: 16, color: B, lineHeight: 1.8, margin: "0 0 16px" };
  const li = { marginBottom: 8 };

  const footerLinks = [["Início", "/"], ["Termos", "/termos"], ["Privacidade", "/privacidade"], ["Contato", "mailto:contato@weprompt.app.br"]];

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <main style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: mobile ? "40px 24px 60px" : "80px 24px" }}>

          <p style={{ fontSize: 13, fontWeight: 700, color: INDIGO, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Legal
          </p>
          <h1 style={{ fontSize: mobile ? 30 : 38, fontWeight: 800, color: H, letterSpacing: "-0.5px", margin: "0 0 10px" }}>
            Política de Privacidade
          </h1>
          <p style={{ fontSize: 15, color: G, margin: "0 0 56px" }}>Última atualização: Junho de 2026</p>

          <h2 style={h2}>1. Introdução</h2>
          <p style={p}>
            A <strong>WePrompt</strong> é o primeiro marketplace de soluções de Inteligência Artificial da América
            Latina. Esta Política de Privacidade descreve como coletamos, usamos e protegemos os dados pessoais dos
            usuários da plataforma, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>
          <p style={p}>
            Ao utilizar a WePrompt, você concorda com as práticas descritas nesta política. Somos o controlador dos
            seus dados pessoais e você pode entrar em contato conosco a qualquer momento pelo e-mail{" "}
            <a href="mailto:contato@weprompt.app.br" style={{ color: INDIGO, textDecoration: "none", fontWeight: 600 }}>
              contato@weprompt.app.br
            </a>.
          </p>

          <h2 style={h2}>2. Dados coletados</h2>
          <p style={p}>Coletamos apenas os dados necessários para operar a plataforma:</p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}><strong>Nome e e-mail</strong> — para criar sua conta e identificá-lo na plataforma.</li>
            <li style={li}><strong>Dados de pagamento</strong> — processados pelo Stripe. Não armazenamos dados de cartão de crédito.</li>
            <li style={li}><strong>Dados de perfil</strong> — para criadores: bio, portfólio, chave PIX. Para empresas: nome da empresa, CNPJ, segmento.</li>
            <li style={li}><strong>Dados de uso</strong> — soluções acessadas, compras realizadas e interações na plataforma.</li>
            <li style={li}><strong>Dados técnicos</strong> — endereço IP, navegador, dispositivo e cookies essenciais de sessão.</li>
          </ul>

          <h2 style={h2}>3. Uso dos dados</h2>
          <p style={p}>Utilizamos seus dados para:</p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>Operar e melhorar a plataforma WePrompt</li>
            <li style={li}>Processar pagamentos e realizar repasses a criadores</li>
            <li style={li}>Enviar e-mails transacionais (confirmação de compra, notificações de aprovação)</li>
            <li style={li}>Prevenir fraudes e garantir a segurança da plataforma</li>
            <li style={li}>Cumprir obrigações legais e fiscais aplicáveis</li>
          </ul>
          <p style={p}>
            Comunicações de marketing são enviadas somente com o seu consentimento e podem ser canceladas a qualquer momento.
          </p>

          <h2 style={h2}>4. Compartilhamento de dados</h2>
          <p style={p}>
            Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais para operar a plataforma:
          </p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}><strong>Stripe</strong> — processador de pagamentos. Responsável por todas as transações financeiras.</li>
            <li style={li}><strong>Resend</strong> — serviço de envio de e-mails transacionais.</li>
            <li style={li}><strong>Supabase</strong> — banco de dados e autenticação. Armazena seus dados com criptografia.</li>
            <li style={li}><strong>Autoridades competentes</strong> — somente quando exigido por determinação judicial ou legal.</li>
          </ul>
          <p style={p}>Todos os parceiros seguem padrões equivalentes de proteção de dados.</p>

          <h2 style={h2}>5. Direitos do usuário (LGPD)</h2>
          <p style={p}>Conforme o Art. 18 da LGPD, você tem o direito de:</p>
          <ul style={{ fontSize: 16, color: B, lineHeight: 1.8, paddingLeft: 24, margin: "0 0 16px" }}>
            <li style={li}>Confirmar a existência do tratamento de seus dados pessoais</li>
            <li style={li}>Acessar os dados que mantemos sobre você</li>
            <li style={li}>Corrigir dados incompletos, inexatos ou desatualizados</li>
            <li style={li}>Solicitar a anonimização, bloqueio ou exclusão de dados desnecessários</li>
            <li style={li}>Revogar o consentimento a qualquer momento</li>
            <li style={li}>Se opor ao tratamento com base em legítimo interesse</li>
          </ul>
          <p style={p}>
            Para exercer qualquer desses direitos, envie um e-mail para{" "}
            <a href="mailto:contato@weprompt.app.br" style={{ color: INDIGO, textDecoration: "none", fontWeight: 600 }}>
              contato@weprompt.app.br
            </a>. Respondemos em até 15 dias úteis, conforme exigido pela LGPD.
          </p>

          <h2 style={h2}>6. Retenção de dados</h2>
          <p style={p}>
            Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento, seus dados pessoais são
            anonimizados ou excluídos em até 90 dias. Registros financeiros são retidos por 5 anos em cumprimento
            às obrigações fiscais da legislação brasileira.
          </p>

          <h2 style={h2}>7. Cookies</h2>
          <p style={p}>
            Utilizamos apenas cookies essenciais para o funcionamento da plataforma: manter sua sessão logada,
            lembrar suas preferências e proteger contra ataques CSRF. Não utilizamos cookies de rastreamento de
            terceiros nem pixels de publicidade.
          </p>

          <h2 style={h2}>8. Contato</h2>
          <p style={p}>
            Para dúvidas, solicitações ou reclamações relacionadas a esta Política de Privacidade, entre em contato:{" "}
            <a href="mailto:contato@weprompt.app.br" style={{ color: INDIGO, textDecoration: "none", fontWeight: 600 }}>
              contato@weprompt.app.br
            </a>
          </p>
          <p style={{ ...p, marginBottom: 0 }}>
            Você também pode registrar uma reclamação junto à{" "}
            <strong>ANPD</strong> (Autoridade Nacional de Proteção de Dados) em{" "}
            <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer" style={{ color: INDIGO }}>
              gov.br/anpd
            </a>.
          </p>

        </div>
      </main>

      <footer style={{ background: H, padding: "36px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0 }}>
            © 2026 WePrompt — O 1º marketplace de IA da América Latina
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {footerLinks.map(([label, href]) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
