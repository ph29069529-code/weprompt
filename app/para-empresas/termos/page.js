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
          <WePromptLogo id="te-header" textColor={NEAR_BLACK} />
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
          <WePromptLogo id="te-footer" textColor={NEAR_BLACK} />
        </a>
        <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>© 2026 WePrompt. O 1º marketplace de IA da América Latina.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
          {[["Termos para Criadores", "/para-criadores/termos"], ["Termos para Empresas", "/para-empresas/termos"], ["Contato", "mailto:contato@weprompt.app.br"]].map(([label, href]) => (
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

export default function TermosEmpresas() {
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
              <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.5px", textTransform: "uppercase" }}>Termos para Empresas</span>
            </div>
            <h1 style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px", margin: "0 0 14px", lineHeight: 1.1 }}>
              Termos de Uso —{" "}
              <span style={{ color: BLUE }}>Empresas</span>
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
              <a href="/para-criadores/termos" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: `2px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; }}>
                Ver termos para Criadores <Arrow />
              </a>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: isMobile ? "32px 16px 64px" : "40px 32px 80px" }}>

          <Section number="1" title="O que é a WePrompt">
            <P>A <strong style={{ color: NEAR_BLACK }}>WePrompt</strong> é o primeiro marketplace de soluções de Inteligência Artificial da América Latina. Nossa plataforma conecta empresas que buscam soluções de IA prontas para implementar com criadores especializados em agentes, automações, prompts, chatbots e muito mais.</P>
            <P style={{ margin: 0 }}>Todo o suporte é em português, os pagamentos são em reais e as soluções são desenvolvidas por criadores brasileiros focados na realidade do mercado nacional.</P>
          </Section>

          <Section number="2" title="Como funciona para empresas">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {[
                { step: "01", title: "Navegar no catálogo",     desc: "Explore centenas de soluções de IA filtradas por categoria, preço e avaliação." },
                { step: "02", title: "Adquirir a solução",      desc: "Assine ou compre a solução escolhida. Pagamento seguro em reais via cartão ou PIX." },
                { step: "03", title: "Acessar e usar",          desc: "Receba o material de entrega pelo dashboard e implemente a solução no seu negócio." },
                { step: "04", title: "Suporte em português",    desc: "Tire dúvidas com o criador ou com a equipe WePrompt, sempre em português." },
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 8 }}>
              {[
                {
                  plan: "Free",
                  price: "R$ 0",
                  color: GRAY_TEXT,
                  bg: BG_GRAY,
                  items: ["Acesso ao catálogo completo", "Compra de soluções a preço cheio", "Suporte por email em até 48h"],
                },
                {
                  plan: "Business",
                  price: "R$ 197/mês",
                  sub: "ou R$ 157/mês no plano anual",
                  color: BLUE,
                  bg: "#f0f9ff",
                  items: ["10% de desconto em todas as soluções", "Suporte prioritário em até 4h úteis", "Curadoria mensal de novidades", "Até 3 usuários na conta"],
                },
                {
                  plan: "Enterprise",
                  price: "R$ 497/mês",
                  sub: "ou R$ 397/mês no plano anual",
                  color: "#7C3AED",
                  bg: "rgba(139,92,246,0.04)",
                  items: ["20% de desconto em todas as soluções", "WhatsApp dedicado — resposta em até 1h útil", "Curadoria semanal personalizada", "Usuários ilimitados", "Onboarding dedicado", "Relatório de ROI mensal"],
                },
              ].map(r => (
                <div key={r.plan} style={{ border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: "24px", background: r.bg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: r.color }}>{r.plan}</div>
                      {r.sub && <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{r.sub}</div>}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: r.color }}>{r.price}</div>
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                          <circle cx="12" cy="12" r="11" fill={r.color + "18"} />
                          <path d="M7 12l3 3 7-7" stroke={r.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section number="4" title="Curadoria e qualidade">
            <P>Toda solução publicada no marketplace passa por um processo rigoroso de aprovação antes de ficar disponível para as empresas:</P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Verificação de funcionalidade — testamos que a solução faz o que promete.</Li>
              <Li>Análise de descrição — confirmamos que o conteúdo é claro, preciso e honesto.</Li>
              <Li>Avaliação de qualidade — garantimos que o material de entrega está completo.</Li>
              <Li>Monitoramento contínuo — soluções com avaliações ruins são revisadas ou removidas.</Li>
            </ul>
            <div style={{ background: "#e0f2fe", borderRadius: 10, padding: "14px 18px", marginTop: 12, fontSize: 13, color: BLUE, fontWeight: 600 }}>
              Nenhuma solução vai ao ar sem passar pela curadoria da equipe WePrompt.
            </div>
          </Section>

          <Section number="5" title="Política de reembolso">
            <P>Se uma solução adquirida não funcionar conforme descrito, a empresa pode solicitar reembolso:</P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li><strong style={{ color: NEAR_BLACK }}>Prazo:</strong> 7 dias corridos após a compra.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Como solicitar:</strong> Abra um chamado pelo dashboard, na seção Histórico de Compras.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Análise:</strong> A WePrompt analisa o caso em até 5 dias úteis.</Li>
              <Li><strong style={{ color: NEAR_BLACK }}>Resultado:</strong> Se aprovado, o reembolso é processado via estorno ou crédito na plataforma.</Li>
            </ul>
            <div style={{ background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 10, padding: "12px 16px", marginTop: 12 }}>
              <span style={{ fontSize: 13, color: "#B45309", fontWeight: 600 }}>
                Não cobre casos de "não gostei" sem justificativa técnica demonstrável.
              </span>
            </div>
          </Section>

          <Section number="6" title="Suporte em português">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { plan: "Free",       sla: "Suporte por email — resposta em até 48 horas",     color: GRAY_TEXT },
                { plan: "Business",   sla: "Suporte prioritário — resposta em até 4 horas úteis", color: BLUE },
                { plan: "Enterprise", sla: "WhatsApp dedicado — resposta em até 1 hora útil",   color: "#7C3AED" },
              ].map(r => (
                <div key={r.plan} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: BG_GRAY, borderRadius: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: r.color, minWidth: 80 }}>{r.plan}</span>
                  <span style={{ fontSize: 14, color: GRAY_TEXT, flex: 1 }}>{r.sla}</span>
                </div>
              ))}
            </div>
            <P style={{ margin: "12px 0 0", fontSize: 13 }}>
              Suporte disponível em dias úteis, das 9h às 18h (horário de Brasília).
            </P>
          </Section>

          <Section number="7" title="Uso aceitável">
            <P>As soluções adquiridas na WePrompt são para uso interno da empresa compradora.</P>
            <P><strong style={{ color: NEAR_BLACK }}>É permitido:</strong></P>
            <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0 }}>
              <Li>Usar a solução nos processos internos da empresa.</Li>
              <Li>Compartilhar o acesso com colaboradores dentro do limite do plano.</Li>
              <Li>Integrar a solução aos sistemas internos da empresa.</Li>
            </ul>
            <P><strong style={{ color: NEAR_BLACK }}>Não é permitido:</strong></P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <XLi>Revender, redistribuir ou sublicenciar a solução a terceiros.</XLi>
              <XLi>Compartilhar acessos além do número de usuários do plano contratado.</XLi>
              <XLi>Fazer engenharia reversa ou copiar a solução para uso fora da plataforma.</XLi>
            </ul>
          </Section>

          <Section number="8" title="Responsabilidades da WePrompt">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Garantir a disponibilidade da plataforma com alta confiabilidade.</Li>
              <Li>Realizar curadoria rigorosa de qualidade em todas as soluções.</Li>
              <Li>Processar pagamentos com segurança via gateways homologados.</Li>
              <Li>Mediar disputas entre empresas e criadores de forma imparcial.</Li>
              <Li>Oferecer suporte em português dentro dos SLAs do plano contratado.</Li>
            </ul>
          </Section>

          <Section number="9" title="Responsabilidades da empresa">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Usar as soluções conforme os termos de uso do criador e da WePrompt.</Li>
              <Li>Não compartilhar acessos além do limite de usuários do plano.</Li>
              <Li>Fornecer informações precisas e verdadeiras no cadastro.</Li>
              <Li>Notificar a WePrompt caso identifique problemas ou violações nas soluções adquiridas.</Li>
            </ul>
          </Section>

          <Section number="10" title="Disputas com criadores">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
              {[
                { num: "1", text: "Empresa abre reclamação pelo dashboard, na seção Histórico de Compras." },
                { num: "2", text: "A WePrompt notifica o criador sobre a reclamação aberta." },
                { num: "3", text: "O criador tem prazo de 72 horas para responder e apresentar sua versão." },
                { num: "4", text: "A WePrompt analisa os dois lados e decide sobre reembolso ou crédito." },
              ].map(({ num, text }) => (
                <div key={num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: BLUE, flexShrink: 0 }}>{num}</div>
                  <span style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7, paddingTop: 3 }}>{text}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section number="11" title="Privacidade e LGPD">
            <P>A WePrompt está em plena conformidade com a <strong style={{ color: NEAR_BLACK }}>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.</P>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>Os dados da empresa são utilizados exclusivamente para operar a plataforma.</Li>
              <Li>Não vendemos, alugamos ou compartilhamos dados com terceiros para fins de marketing.</Li>
              <Li>Você pode solicitar a exclusão dos seus dados a qualquer momento pelo suporte.</Li>
              <Li>Dados são armazenados em servidores seguros com criptografia em repouso e em trânsito.</Li>
            </ul>
            <P style={{ margin: "12px 0 0" }}>
              Para detalhes completos, consulte nossa{" "}
              <a href="/privacidade" style={{ color: BLUE, textDecoration: "underline" }}>Política de Privacidade</a>.
            </P>
          </Section>

          <Section number="12" title="Cancelamento">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <Li>O plano pode ser cancelado a qualquer momento, sem multa ou fidelidade.</Li>
              <Li>O acesso é mantido até o fim do período pago (mensal ou anual).</Li>
              <Li>Após o cancelamento, os dados da conta são mantidos por <strong style={{ color: NEAR_BLACK }}>90 dias</strong>.</Li>
              <Li>Após os 90 dias, os dados são excluídos permanentemente, salvo obrigação legal.</Li>
            </ul>
          </Section>

          <Section number="13" title="Alterações nos termos">
            <P>A WePrompt pode atualizar estes Termos de Uso a qualquer momento. Quando houver alterações relevantes, enviaremos um aviso prévio de <strong style={{ color: NEAR_BLACK }}>15 dias por email</strong> para todas as empresas cadastradas.</P>
            <P style={{ margin: 0 }}>O uso continuado da plataforma após o prazo de aviso implica aceitação dos novos termos. Caso não concorde, a empresa pode cancelar sua conta sem penalidades.</P>
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
