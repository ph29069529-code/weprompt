"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";
const BG_GRAY    = "#F5F5F7";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role  = session.user.user_metadata?.role;
  const email = session.user.email;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const NAV_LINKS = [
  ["Explorar",       "/solucoes"],
  ["Preços",         "/precos"],
  ["Como funciona",  "#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" fill="rgba(3,105,161,0.1)" />
    <path d="M7 12l3 3 7-7" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" fill="rgba(220,38,38,0.09)" />
    <path d="M8 8l8 8M16 8l-8 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function Section({ number, title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: BLUE, flexShrink: 0 }}>
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

function Li({ children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
      <Check />
      <span style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7 }}>{children}</span>
    </li>
  );
}

function XLi({ children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
      <XMark />
      <span style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7 }}>{children}</span>
    </li>
  );
}

function Navbar({ session, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardUrl = getDashboardUrl(session);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <WePromptLogo id="tc-header" textColor={NEAR_BLACK} />
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: GRAY_TEXT, textDecoration: "none", padding: "6px 14px", borderRadius: 8, transition: "color 0.15s, background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}>
                {label}
              </a>
            ))}
          </nav>
        )}

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {session ? (
              <a href={dashboardUrl} style={{ borderRadius: 999, padding: "9px 22px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE, border: `2px solid ${BLUE}`, background: "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  Entrar
                </a>
                <a href="/cadastro" style={{ borderRadius: 999, padding: "9px 22px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
                  Criar conta <Arrow />
                </a>
              </>
            )}
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NEAR_BLACK, padding: "4px 8px", display: "flex", alignItems: "center" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "12px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: "13px 4px", fontSize: 17, fontWeight: 500, color: NEAR_BLACK, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {session ? (
              <a href={dashboardUrl} style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE, border: `2px solid ${BLUE}` }}>Entrar</a>
                <a href="/cadastro" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>Criar conta <Arrow /></a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ isMobile }) {
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "44px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: 20, textAlign: isMobile ? "center" : "left" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <WePromptLogo id="tc-footer" textColor={NEAR_BLACK} />
        </a>
        <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>© 2026 WePrompt. O 1º marketplace de IA da América Latina.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
          {[["Termos para Criadores", "/para-criadores/termos"], ["Termos para Empresas", "/para-empresas/termos"], ["Política de Privacidade", "/privacidade"], ["Contato", "mailto:contato@weprompt.app.br"]].map(([label, href]) => (
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

export default function TermosCriadores() {
  const [session, setSession] = useState(null);
  const width    = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG_GRAY, fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <style>{`@media print { header, footer { display:none; } }`}</style>

      <Navbar session={session} isMobile={isMobile} />

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: isMobile ? "56px 24px 48px" : "72px 32px 56px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e0f2fe", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.5px", textTransform: "uppercase" }}>Termos para Criadores</span>
            </div>
            <h1 style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px", margin: "0 0 14px", lineHeight: 1.1 }}>
              Termos de Uso —{" "}
              <span style={{ color: BLUE }}>Criadores</span>
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
              <a href="/para-empresas/termos" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: `2px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; }}>
                Ver termos para Empresas <Arrow />
              </a>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: isMobile ? "32px 16px 64px" : "40px 32px 80px" }}>

          <Section number="1" title="O que é a WePrompt">
            <P>A <strong style={{ color: NEAR_BLACK }}>WePrompt</strong> é o primeiro marketplace de soluções de Inteligência Artificial da América Latina. Nossa plataforma conecta criadores de soluções de IA — agentes, automações, prompts, chatbots e mais — com empresas que buscam implementar IA em seus processos.</P>
            <P style={{ margin: 0 }}>Ao se cadastrar como criador, você passa a fazer parte de um ecossistema dedicado a democratizar o acesso à IA no mercado brasileiro, com suporte em português e repasses via PIX.</P>
          </Section>

          <Section number="2" title="Como funciona para criadores">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {[
                { step: "01", title: "Cadastro gratuito",    desc: "Crie sua conta de criador gratuitamente. Nenhum dado de pagamento necessário no início." },
                { step: "02", title: "Publicar solução",     desc: "Envie sua solução com título, descrição, categoria, preço e material de entrega." },
                { step: "03", title: "Aprovação em até 48h", desc: "Nossa equipe de curadoria analisa e aprova sua solução antes de ir ao ar no catálogo." },
                { step: "04", title: "Venda e receba via PIX", desc: "Após aprovação, sua solução fica disponível e você recebe via PIX conforme o prazo." },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ background: BG_GRAY, borderRadius: 14, padding: "20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 6, letterSpacing: "0.5px" }}>ETAPA {step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section number="3" title="Planos disponíveis">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 480 }}>
                <thead>
                  <tr style={{ background: BG_GRAY }}>
                    {["Plano", "Preço", "Soluções", "Comissão", "Oferta Fundadores"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: NEAR_BLACK, whiteSpace: "nowrap", borderBottom: `2px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { plan: "Free",    price: "R$ 0",       sols: "Até 3",     comm: "20%", badge: null,                          color: GRAY_TEXT },
                    { plan: "Pro",     price: "R$ 97/mês",  sols: "Ilimitado", comm: "15%", badge: "3 meses grátis fundadores",   color: BLUE },
                    { plan: "Premium", price: "R$ 297/mês", sols: "Ilimitado", comm: "10%", badge: "3 meses grátis fundadores",   color: "#7C3AED" },
                  ].map((r, i) => (
                    <tr key={r.plan} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: r.color }}>{r.plan}</td>
                      <td style={{ padding: "14px 16px", color: NEAR_BLACK, fontWeight: 600 }}>{r.price}</td>
                      <td style={{ padding: "14px 16px", color: GRAY_TEXT }}>{r.sols}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: NEAR_BLACK }}>{r.comm}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {r.badge
                          ? <span style={{ background: "rgba(5,150,105,0.1)", color: "#059669", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>{r.badge}</span>
                          : <span style={{ color: GRAY_TEXT }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section number="4" title="Comissão da plataforma">
            <P>A WePrompt retém uma comissão sobre cada venda realizada. A comissão varia de acordo com o plano do criador:</P>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {[
                { plan: "Free",    pct: "20%", ex: "Venda de R$100 → WePrompt recebe R$20 · Criador recebe R$80", color: GRAY_TEXT },
                { plan: "Pro",     pct: "15%", ex: "Venda de R$100 → WePrompt recebe R$15 · Criador recebe R$85", color: BLUE },
                { plan: "Premium", pct: "10%", ex: "Venda de R$100 → WePrompt recebe R$10 · Criador recebe R$90", color: "#7C3AED" },
              ].map(r => (
                <div key={r.plan} style={{ background: BG_GRAY, borderRadius: 12, padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: r.color, minWidth: 80 }}>Plano {r.plan}</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: r.color }}>{r.pct}</span>
                  <span style={{ fontSize: 13, color: GRAY_TEXT, flex: 1 }}>{r.ex}</span>
                </div>
              ))}
            </div>
            <P style={{ margin: 0 }}>A comissão é descontada automaticamente antes do repasse. Você sempre visualiza o valor líquido no seu painel.</P>
          </Section>

          <Section number="5" title="Repasse dos pagamentos">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li><strong style={{ color: NEAR_BLACK }}>Prazo:</strong> 30 dias após a confirmação da venda.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Valor mínimo para saque:</strong> R$ 50,00.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Método:</strong> PIX (chave cadastrada nas configurações do seu painel).</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Estornos:</strong> Vendas estornadas ou com reembolso aprovado não são repassadas.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Histórico:</strong> Todos os repasses ficam registrados no painel de Vendas.</Li>
            </ul>
          </Section>

          <Section number="6" title="Período gratuito para fundadores">
            <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 6 }}>🎁 Oferta de fundadores</div>
              <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7 }}>
                Criadores que se cadastrarem <strong style={{ color: NEAR_BLACK }}>até a data de lançamento</strong> ganham{" "}
                <strong style={{ color: "#059669" }}>3 meses gratuitos</strong> nos planos Pro (R$ 97/mês) e Premium (R$ 297/mês).
              </div>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Os 3 meses gratuitos são contados a partir da ativação do plano.</Li>
              <Li>Após o período, a cobrança normal é iniciada automaticamente.</Li>
              <Li>Cancelamento a qualquer momento, sem taxa e sem fidelidade.</Li>
              <Li>Oferta não cumulável com outros benefícios promocionais.</Li>
            </ul>
          </Section>

          <Section number="7" title="O que pode ser vendido">
            <P>A WePrompt é especializada em soluções de Inteligência Artificial. Podem ser publicadas:</P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Agentes de IA (ChatGPT, Claude, Gemini e outros modelos)</Li>
              <Li>Automações com ferramentas de IA (Make, Zapier, n8n, etc.)</Li>
              <Li>Chatbots para atendimento, vendas e suporte ao cliente</Li>
              <Li>Prompts otimizados para casos de uso específicos</Li>
              <Li>Integrações e pipelines de dados com IA</Li>
              <Li>Templates e ferramentas de marketing com IA</Li>
              <Li>Soluções de atendimento e CRM potencializadas por IA</Li>
            </ul>
            <div style={{ background: "#e0f2fe", borderRadius: 10, padding: "14px 18px", marginTop: 12, fontSize: 13, color: BLUE, fontWeight: 600 }}>
              Toda solução publicada deve funcionar conforme descrito. Soluções com avaliações negativas recorrentes são revisadas pela curadoria.
            </div>
          </Section>

          <Section number="8" title="O que é proibido">
            <P>Para manter a qualidade e confiança do marketplace, é expressamente proibido:</P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <XLi>Plágio ou cópia de soluções de outros criadores</XLi>
              <XLi>Promessas falsas, exageradas ou enganosas na descrição</XLi>
              <XLi>Publicar soluções que não funcionam conforme descrito</XLi>
              <XLi>Conteúdo ilegal, ofensivo, discriminatório ou prejudicial</XLi>
              <XLi>Violação de direitos autorais ou propriedade intelectual</XLi>
              <XLi>Soluções que coletam dados sem consentimento explícito do usuário</XLi>
            </ul>
            <P style={{ margin: "12px 0 0", color: "#DC2626", fontSize: 13 }}>
              O descumprimento destas regras pode resultar em suspensão imediata da conta e remoção das soluções publicadas.
            </P>
          </Section>

          <Section number="9" title="Responsabilidades do criador">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Manter a solução funcionando corretamente após a publicação.</Li>
              <Li>Responder a solicitações de suporte dos compradores em até <strong style={{ color: NEAR_BLACK }}>72 horas</strong>.</Li>
              <Li>Atualizar a solução quando ocorrerem mudanças relevantes nas ferramentas utilizadas.</Li>
              <Li>Garantir que descrição, screenshots e demos representam fielmente a solução.</Li>
              <Li>Cumprir com as leis de proteção de dados (LGPD) em todas as soluções oferecidas.</Li>
            </ul>
          </Section>

          <Section number="10" title="Responsabilidades da WePrompt">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Processar pagamentos com segurança via gateways de pagamento homologados.</Li>
              <Li>Manter a plataforma disponível com alta disponibilidade.</Li>
              <Li>Realizar curadoria de qualidade antes de publicar cada solução.</Li>
              <Li>Oferecer suporte em português para criadores e compradores.</Li>
              <Li>Realizar repasses dentro do prazo estabelecido (30 dias após a venda).</Li>
              <Li>Mediar disputas entre criadores e empresas de forma imparcial.</Li>
            </ul>
          </Section>

          <Section number="11" title="Cancelamento e reembolso">
            <P><strong style={{ color: NEAR_BLACK }}>Planos do criador:</strong> O criador pode cancelar seu plano (Pro ou Premium) a qualquer momento. O acesso permanece ativo até o fim do período pago.</P>
            <P><strong style={{ color: NEAR_BLACK }}>Reembolso para empresas:</strong> Empresas podem solicitar reembolso em até 7 dias corridos caso a solução não funcione conforme a descrição. Cada caso é analisado individualmente.</P>
            <P style={{ margin: 0 }}><strong style={{ color: NEAR_BLACK }}>Impacto no criador:</strong> Se um reembolso é aprovado, o valor correspondente é descontado do próximo repasse ou retido do saldo disponível.</P>
          </Section>

          <Section number="12" title="Disputas">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Disputas entre criador e empresa são mediadas pela equipe WePrompt.</Li>
              <Li>O criador tem prazo de <strong style={{ color: NEAR_BLACK }}>72 horas</strong> para responder a reclamações abertas no dashboard.</Li>
              <Li>A decisão final sobre reembolsos e créditos cabe à WePrompt, após análise imparcial.</Li>
              <Li>Criadores com histórico recorrente de disputas podem ter a conta revisada.</Li>
            </ul>
          </Section>

          <Section number="13" title="Alterações nos termos">
            <P>A WePrompt pode atualizar estes Termos de Uso a qualquer momento. Quando houver alterações relevantes, enviaremos um aviso prévio de <strong style={{ color: NEAR_BLACK }}>15 dias por email</strong> para todos os criadores cadastrados.</P>
            <P style={{ margin: 0 }}>O uso continuado da plataforma após o prazo de aviso implica aceitação dos novos termos. Caso não concorde, o criador pode cancelar sua conta sem penalidades.</P>
          </Section>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0284C7 100%)`, borderRadius: 20, padding: isMobile ? "32px 24px" : "40px 48px", textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.3px" }}>
              Dúvidas sobre os termos?
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: "0 0 24px" }}>
              Nossa equipe responde em português em até 48 horas.
            </p>
            <a href="mailto:contato@weprompt.app.br" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: BLUE, padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              contato@weprompt.app.br
            </a>
          </div>

        </div>
      </main>

      <Footer isMobile={isMobile} />
    </div>
  );
}
