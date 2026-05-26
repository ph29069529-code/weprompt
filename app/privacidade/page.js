"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";
const BG_GRAY    = "#F5F5F7";

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" fill="rgba(3,105,161,0.1)" />
    <path d="M7 12l3 3 7-7" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Shield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.1)" />
    <path d="M9 12l2 2 4-4" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Section card ── */
function Section({ number, title, children, accent }) {
  const bg = accent || "#e0f2fe";
  const color = accent ? (accent === "rgba(5,150,105,0.15)" ? "#059669" : BLUE) : BLUE;
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
          {number}
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: NEAR_BLACK, margin: 0, letterSpacing: "-0.3px", paddingTop: 5 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function P({ children, style }) {
  return <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.75, margin: "0 0 12px", ...style }}>{children}</p>;
}

function Li({ children, icon }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
      {icon || <Check />}
      <span style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7 }}>{children}</span>
    </li>
  );
}

function DataRow({ label, items }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map(item => (
          <span key={item} style={{ background: BG_GRAY, color: GRAY_TEXT, fontSize: 13, padding: "4px 12px", borderRadius: 99, fontWeight: 500 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Footer ── */
function Footer({ isMobile }) {
  const links = [
    ["Termos para Criadores", "/para-criadores/termos"],
    ["Termos para Empresas",  "/para-empresas/termos"],
    ["Política de Privacidade", "/privacidade"],
    ["Contato",               "mailto:contato@weprompt.app.br"],
  ];
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "44px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: 20, textAlign: isMobile ? "center" : "left" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <WePromptLogo id="priv-footer" textColor={NEAR_BLACK} />
        </a>
        <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>© 2026 WePrompt. O 1º marketplace de IA da América Latina.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
          {links.map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK} onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function Privacidade() {
  const width    = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", background: BG_GRAY, fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <style>{`@media print { footer { display:none; } }`}</style>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: isMobile ? "56px 24px 48px" : "72px 32px 56px" }}>

            {/* LGPD compliance badge row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e0f2fe", borderRadius: 99, padding: "6px 16px" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.5px", textTransform: "uppercase" }}>Política de Privacidade</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(5,150,105,0.1)", borderRadius: 99, padding: "6px 14px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#059669" opacity="0.2" />
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.5px", textTransform: "uppercase" }}>LGPD Compliant</span>
              </div>
            </div>

            <h1 style={{ fontSize: isMobile ? 30 : 44, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px", margin: "0 0 14px", lineHeight: 1.1 }}>
              Sua privacidade é<br />
              <span style={{ color: BLUE }}>nossa prioridade</span>
            </h1>
            <p style={{ fontSize: 16, color: GRAY_TEXT, margin: "0 0 28px", lineHeight: 1.6 }}>
              Última atualização: <strong style={{ color: NEAR_BLACK }}>maio de 2026</strong>
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => window.print()} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 10, border: `2px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                </svg>
                Imprimir / Baixar PDF
              </button>
              <a href="mailto:privacidade@weprompt.app.br" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: `2px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                Contato de privacidade
              </a>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: isMobile ? "32px 16px 64px" : "40px 32px 80px" }}>

          {/* Quick summary strip */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { icon: "🚫", label: "Não vendemos dados", sub: "Nunca" },
              { icon: "🔐", label: "Senhas criptografadas", sub: "Sempre" },
              { icon: "🇧🇷", label: "LGPD compliant", sub: "Art. 18" },
              { icon: "📧", label: "Seus direitos", sub: "15 dias úteis" },
            ].map(c => (
              <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: NEAR_BLACK, lineHeight: 1.35 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: BLUE, fontWeight: 600, marginTop: 3 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          <Section number="1" title="Quem somos">
            <P>A <strong style={{ color: NEAR_BLACK }}>WePrompt</strong> é o primeiro marketplace de soluções de Inteligência Artificial da América Latina. Conectamos criadores de soluções de IA com empresas que buscam implementar automações, agentes e ferramentas de IA em seus processos.</P>
            <div style={{ background: BG_GRAY, borderRadius: 12, padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Controlador de dados</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>WePrompt</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Contato para privacidade</div>
                <a href="mailto:privacidade@weprompt.app.br" style={{ fontSize: 14, fontWeight: 600, color: BLUE, textDecoration: "none" }}>privacidade@weprompt.app.br</a>
              </div>
            </div>
          </Section>

          <Section number="2" title="Quais dados coletamos">
            <P>Coletamos apenas os dados necessários para operar a plataforma. Veja exatamente o que coletamos:</P>
            <DataRow label="Dados de cadastro" items={["Nome completo", "E-mail", "Senha (criptografada)"]} />
            <DataRow label="Dados de perfil — Criadores" items={["Bio / apresentação", "Link do portfólio", "Chave PIX"]} />
            <DataRow label="Dados de perfil — Empresas" items={["Nome da empresa", "CNPJ", "Segmento", "Site"]} />
            <DataRow label="Dados de uso" items={["Soluções acessadas", "Compras realizadas", "Interações na plataforma"]} />
            <DataRow label="Dados técnicos" items={["Endereço IP", "Navegador", "Dispositivo", "Cookies de sessão"]} />
            <div style={{ background: "#e0f2fe", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: BLUE, fontWeight: 600, marginTop: 8 }}>
              Nunca coletamos dados que não sejam necessários para operar o serviço.
            </div>
          </Section>

          <Section number="3" title="Para que usamos seus dados">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Operar e melhorar a plataforma WePrompt</Li>
              <Li>Processar pagamentos e realizar repasses a criadores</Li>
              <Li>Enviar comunicações relevantes sobre a plataforma</Li>
              <Li>Curadoria e recomendações personalizadas de soluções</Li>
              <Li>Segurança da plataforma e prevenção a fraudes</Li>
              <Li>Cumprimento de obrigações legais e fiscais</Li>
            </ul>
            <div style={{ marginTop: 8, background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#B45309", fontWeight: 500 }}>
              Comunicações de marketing são enviadas <strong>somente com seu consentimento</strong>. Você pode cancelar a qualquer momento.
            </div>
          </Section>

          <Section number="4" title="Base legal para tratamento (LGPD)">
            <P>Todo tratamento de dados na WePrompt é fundamentado em uma das bases legais previstas na LGPD:</P>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { base: "Execução de contrato",  desc: "Para operar sua conta, processar transações e disponibilizar os serviços contratados.", color: BLUE, bg: "#e0f2fe" },
                { base: "Legítimo interesse",    desc: "Para segurança da plataforma, prevenção a fraudes e melhoria dos serviços.", color: "#7C3AED", bg: "rgba(139,92,246,0.08)" },
                { base: "Consentimento",         desc: "Para comunicações de marketing e uso de dados não essenciais. Revogável a qualquer momento.", color: "#059669", bg: "rgba(5,150,105,0.08)" },
                { base: "Obrigação legal",       desc: "Quando exigido por legislação fiscal, trabalhista ou regulatória aplicável.", color: "#B45309", bg: "rgba(217,119,6,0.08)" },
              ].map(r => (
                <div key={r.base} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: r.bg }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill={r.color + "20"} />
                      <path d="M7 12l3 3 7-7" stroke={r.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: r.color, marginBottom: 4 }}>{r.base}</div>
                    <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section number="5" title="Compartilhamento de dados">
            <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>Não vendemos seus dados. Nunca.</span>
            </div>
            <P>Compartilhamos dados apenas com parceiros essenciais para operar a plataforma:</P>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Stripe",   role: "Processador de pagamentos",       purpose: "Para processar pagamentos com cartão e PIX com segurança." },
                { name: "Supabase", role: "Banco de dados e autenticação",    purpose: "Para armazenar dados e gerenciar autenticação de usuários." },
                { name: "Vercel",   role: "Infraestrutura e hospedagem",      purpose: "Para servir a plataforma com alta disponibilidade." },
                { name: "Autoridades", role: "Quando exigido por lei",        purpose: "Somente quando obrigado por determinação judicial ou legal." },
              ].map(p => (
                <div key={p.name} style={{ display: "flex", gap: 14, padding: "14px 16px", background: BG_GRAY, borderRadius: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 90 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: BLUE, fontWeight: 600 }}>{p.role}</div>
                  </div>
                  <div style={{ fontSize: 14, color: GRAY_TEXT, flex: 1, lineHeight: 1.6 }}>{p.purpose}</div>
                </div>
              ))}
            </div>
            <P style={{ margin: "12px 0 0", fontSize: 13 }}>
              Todos os parceiros seguem padrões equivalentes de proteção de dados e estão sujeitos a contratos de processamento adequados.
            </P>
          </Section>

          <Section number="6" title="Seus direitos (LGPD — Art. 18)">
            <P>Nos termos da Lei Geral de Proteção de Dados, você tem os seguintes direitos sobre seus dados:</P>
            <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0 }}>
              <Li icon={<Shield />}>Confirmação e acesso aos dados que temos sobre você</Li>
              <Li icon={<Shield />}>Correção de dados incompletos, inexatos ou desatualizados</Li>
              <Li icon={<Shield />}>Anonimização, bloqueio ou eliminação de dados desnecessários</Li>
              <Li icon={<Shield />}>Portabilidade dos seus dados para outro fornecedor de serviço</Li>
              <Li icon={<Shield />}>Eliminação dos dados tratados com base em consentimento</Li>
              <Li icon={<Shield />}>Informação sobre com quem compartilhamos seus dados</Li>
              <Li icon={<Shield />}>Revogação do consentimento para comunicações de marketing</Li>
              <Li icon={<Shield />}>Oposição ao tratamento quando baseado em legítimo interesse</Li>
            </ul>
            <div style={{ background: BG_GRAY, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>Para exercer qualquer um desses direitos:</div>
              <a href="mailto:privacidade@weprompt.app.br" style={{ fontSize: 15, fontWeight: 700, color: BLUE, textDecoration: "none" }}>
                privacidade@weprompt.app.br
              </a>
              <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>Respondemos em até 15 dias úteis, conforme exigido pela LGPD.</div>
            </div>
          </Section>

          <Section number="7" title="Retenção de dados">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Conta ativa",            period: "Toda a relação",    desc: "Dados mantidos enquanto você tiver uma conta ativa na plataforma.", color: BLUE },
                { label: "Após cancelamento",      period: "90 dias",           desc: "Dados mantidos por 90 dias após o cancelamento, depois anonimizados ou excluídos.", color: GRAY_TEXT },
                { label: "Dados financeiros",      period: "5 anos",            desc: "Registros financeiros mantidos por obrigação fiscal conforme legislação vigente.", color: "#B45309" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", gap: 16, padding: "16px 20px", background: BG_GRAY, borderRadius: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 130 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{r.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: r.color, marginTop: 2 }}>{r.period}</div>
                  </div>
                  <div style={{ fontSize: 14, color: GRAY_TEXT, flex: 1, lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section number="8" title="Segurança dos dados">
            <P>Implementamos medidas técnicas e organizacionais para proteger seus dados:</P>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {[
                { icon: "🔑", title: "Senhas criptografadas",        desc: "Nunca armazenamos senhas em texto plano. Usamos hashing seguro (bcrypt)." },
                { icon: "🔒", title: "HTTPS / TLS",                  desc: "Toda comunicação entre você e a plataforma é criptografada em trânsito." },
                { icon: "🛡️",  title: "Acesso restrito",              desc: "Dados sensíveis acessíveis somente por funcionários que precisam deles." },
                { icon: "👁️",  title: "Monitoramento contínuo",       desc: "Detectamos e respondemos a atividades suspeitas em tempo real." },
                { icon: "☁️",  title: "Infraestrutura certificada",   desc: "Hospedagem em Vercel e Supabase com SOC 2 Type II e ISO 27001." },
                { icon: "🔄",  title: "Backups regulares",            desc: "Backups automáticos e testados para garantir disponibilidade dos dados." },
              ].map(s => (
                <div key={s.title} style={{ background: BG_GRAY, borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{s.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section number="9" title="Cookies">
            <P>Usamos somente cookies essenciais para o funcionamento da plataforma:</P>
            <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0 }}>
              <Li>Manter sua sessão logada com segurança</Li>
              <Li>Lembrar suas preferências de uso na plataforma</Li>
              <Li>Proteção contra CSRF e outros ataques de segurança</Li>
            </ul>
            <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#059669", fontWeight: 600 }}>
              Não utilizamos cookies de rastreamento de terceiros nem pixels de publicidade.
            </div>
          </Section>

          <Section number="10" title="Menores de idade">
            <div style={{ background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#B45309", marginBottom: 8 }}>
                Plataforma restrita a maiores de 18 anos
              </div>
              <P style={{ margin: 0 }}>
                A WePrompt é destinada exclusivamente a empresas e profissionais com 18 anos ou mais. Não coletamos intencionalmente dados de menores de idade. Se identificarmos que coletamos dados de um menor, excluiremos essas informações imediatamente.
              </P>
            </div>
          </Section>

          <Section number="11" title="Alterações nesta política">
            <P>A WePrompt pode atualizar esta Política de Privacidade periodicamente. Quando houver alterações relevantes:</P>
            <ul style={{ listStyle: "none", margin: "0 0 12px", padding: 0 }}>
              <Li>Notificaremos por email com <strong style={{ color: NEAR_BLACK }}>15 dias de antecedência</strong>.</Li>
              <Li>A data de "última atualização" no topo desta página será atualizada.</Li>
              <Li>Para alterações substanciais, solicitaremos nova confirmação de consentimento.</Li>
            </ul>
            <P style={{ margin: 0 }}>O uso continuado da plataforma após o prazo indica aceitação dos novos termos.</P>
          </Section>

          <Section number="12" title="Contato e Encarregado (DPO)">
            <P>Para qualquer dúvida, solicitação ou reclamação sobre o tratamento dos seus dados pessoais:</P>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <div style={{ background: BG_GRAY, borderRadius: 14, padding: "20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Privacidade e DPO</div>
                <a href="mailto:privacidade@weprompt.app.br" style={{ fontSize: 15, fontWeight: 700, color: BLUE, textDecoration: "none", display: "block", marginBottom: 6 }}>
                  privacidade@weprompt.app.br
                </a>
                <div style={{ fontSize: 13, color: GRAY_TEXT }}>Resposta em até <strong style={{ color: NEAR_BLACK }}>15 dias úteis</strong> (prazo LGPD)</div>
              </div>
              <div style={{ background: BG_GRAY, borderRadius: 14, padding: "20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Suporte Geral</div>
                <a href="mailto:contato@weprompt.app.br" style={{ fontSize: 15, fontWeight: 700, color: BLUE, textDecoration: "none", display: "block", marginBottom: 6 }}>
                  contato@weprompt.app.br
                </a>
                <div style={{ fontSize: 13, color: GRAY_TEXT }}>Dúvidas gerais sobre a plataforma</div>
              </div>
            </div>
            <P style={{ margin: "16px 0 0", fontSize: 13, color: GRAY_TEXT }}>
              Você também pode registrar uma reclamação junto à <strong style={{ color: NEAR_BLACK }}>ANPD</strong> (Autoridade Nacional de Proteção de Dados) em{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer" style={{ color: BLUE, textDecoration: "underline" }}>gov.br/anpd</a>.
            </P>
          </Section>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0284C7 100%)`, borderRadius: 20, padding: isMobile ? "32px 24px" : "40px 48px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.3px" }}>
              Dúvidas sobre privacidade?
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: "0 0 24px" }}>
              Respondemos todas as solicitações em até 15 dias úteis, conforme exigido pela LGPD.
            </p>
            <a href="mailto:privacidade@weprompt.app.br" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: BLUE, padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              privacidade@weprompt.app.br
            </a>
          </div>

        </div>
      </main>

      <Footer isMobile={isMobile} />
    </div>
  );
}
