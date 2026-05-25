"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "../components/WePromptLogo";
import { supabase } from "../lib/supabase";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role  = session.user.user_metadata?.role;
  const email = session.user.email;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function useWindowSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ dark }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="8" cy="8" r="7"
      fill={dark ? "rgba(255,255,255,0.18)" : "rgba(3,105,161,0.12)"} />
    <path d="M5 8l2 2 4-4"
      stroke={dark ? "#fff" : BLUE}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços",   "/precos"],
  ["Como funciona", "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const CRIADOR_PLANS = [
  {
    key: "free", name: "Free",
    monthly: 0, annualMonthly: 0, annualTotal: 0,
    commission: "20%",
    tagline: "Para começar a publicar soluções sem custo algum.",
    features: [
      "Até 3 soluções publicadas",
      "Analytics básico",
      "Curadoria e aprovação WePrompt",
      "Badge de perfil de criador",
      "Suporte via e-mail",
    ],
    cta: "Começar grátis", ctaHref: "/cadastro?role=criador",
    dark: false, popular: false, founder: false, premium: false,
  },
  {
    key: "pro", name: "Pro",
    monthly: 97, annualMonthly: 77, annualTotal: 924,
    commission: "15%",
    tagline: "Para criadores que querem crescer e profissionalizar sua presença.",
    features: [
      "Soluções ilimitadas",
      "Destaque na categoria",
      "Analytics completo com métricas",
      'Badge "Criador Verificado" ✦',
      "Suporte prioritário",
    ],
    cta: "Começar Pro", ctaHref: "/cadastro?role=criador",
    dark: true, popular: true, founder: true, premium: false,
  },
  {
    key: "premium", name: "Premium",
    monthly: 297, annualMonthly: 237, annualTotal: 2844,
    commission: "10%",
    tagline: "Para criadores que querem o máximo de visibilidade e receita.",
    features: [
      "Tudo do plano Pro",
      "Topo da categoria (destaque máximo)",
      "Destaque na homepage da WePrompt",
      "Suporte prioritário dedicado",
      "Gestão de afiliados",
    ],
    cta: "Começar Premium", ctaHref: "/cadastro?role=criador",
    dark: false, popular: false, founder: true, premium: true,
  },
];

const EMPRESA_PLANS = [
  {
    key: "free", name: "Free",
    monthly: 0, annualMonthly: 0, annualTotal: 0,
    commission: null,
    tagline: "Explore o marketplace e descubra soluções de IA sem compromisso.",
    features: [
      "Acesso ao catálogo completo",
      "Compra e assinatura de soluções",
      "Filtros e busca avançada",
      "Avaliações verificadas",
      "Suporte via e-mail",
    ],
    cta: "Começar grátis", ctaHref: "/cadastro",
    dark: false, popular: false, founder: false, premium: false,
  },
  {
    key: "business", name: "Business",
    monthly: 197, annualMonthly: 157, annualTotal: 1884,
    commission: null,
    tagline: "Para equipes que querem as melhores soluções de IA com economia.",
    features: [
      "10% de desconto em todas as soluções",
      "Suporte prioritário em PT-BR",
      "Curadoria personalizada mensal",
      "Até 3 usuários na conta",
      "Onboarding guiado",
      "Acesso a soluções em pré-lançamento",
    ],
    cta: "Começar Business", ctaHref: "/cadastro",
    dark: true, popular: true, founder: false, premium: false,
  },
  {
    key: "enterprise", name: "Enterprise",
    monthly: 497, annualMonthly: 397, annualTotal: 4764,
    commission: null,
    tagline: "Para grandes empresas com alto volume e necessidades dedicadas.",
    features: [
      "20% de desconto em todas as soluções",
      "Suporte dedicado via WhatsApp",
      "Curadoria personalizada semanal",
      "Usuários ilimitados",
      "Onboarding completo da equipe",
      "Relatório de ROI mensal",
    ],
    cta: "Falar com a equipe", ctaHref: "mailto:contato@weprompt.app.br",
    dark: false, popular: false, founder: false, premium: true,
  },
];

const EMPRESA_COMPARE = [
  { feature: "Acesso ao catálogo",      free: "✓",     business: "✓",              enterprise: "✓" },
  { feature: "Desconto nas soluções",   free: "–",     business: "10%",            enterprise: "20%" },
  { feature: "Suporte",                 free: "E-mail", business: "Prioritário PT-BR", enterprise: "WhatsApp dedicado" },
  { feature: "Curadoria personalizada", free: "–",     business: "Mensal",         enterprise: "Semanal" },
  { feature: "Usuários na conta",       free: "1",     business: "Até 3",          enterprise: "Ilimitados" },
  { feature: "Onboarding",              free: "–",     business: "Guiado",         enterprise: "Completo" },
  { feature: "Relatório de ROI",        free: "–",     business: "–",              enterprise: "Mensal" },
];

const FAQ_ITEMS = [
  {
    q: "Posso mudar de plano a qualquer momento?",
    a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A cobrança é ajustada proporcionalmente ao tempo restante do período.",
  },
  {
    q: "O que acontece se eu cancelar?",
    a: "Ao cancelar, você retorna ao plano Free automaticamente. Suas soluções publicadas permanecem ativas, mas sujeitas às regras do plano Free (até 3 soluções para criadores).",
  },
  {
    q: "Há cobrança de taxa de setup ou taxas escondidas?",
    a: "Não. Nenhum plano possui taxa de setup ou cobranças adicionais surpresa. Você paga apenas a mensalidade do plano escolhido.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartão de crédito, boleto bancário e PIX para os planos mensais e anuais. O repasse para criadores é feito exclusivamente via PIX.",
  },
  {
    q: "Quando os criadores recebem o repasse das vendas?",
    a: "O repasse é realizado via PIX em até 30 dias após a confirmação da venda. O valor mínimo para saque é R$ 50. Abaixo disso, o saldo fica acumulado para o próximo ciclo.",
  },
];

function PricingCard({ plan, billing, isMobile }) {
  const isFree  = plan.monthly === 0;
  const price   = billing === "annual" ? plan.annualMonthly : plan.monthly;

  const cardBg      = plan.dark ? BLUE : "#fff";
  const cardBorder  = plan.premium ? `2px solid ${BLUE}` : plan.dark ? "none" : "1px solid rgba(0,0,0,0.07)";
  const cardShadow  = plan.dark
    ? "0 24px 60px rgba(3,105,161,0.3)"
    : plan.premium
    ? "0 4px 24px rgba(3,105,161,0.1)"
    : "0 2px 12px rgba(0,0,0,0.06)";

  const textPrimary   = plan.dark ? "#fff"                         : NEAR_BLACK;
  const textSecondary = plan.dark ? "rgba(255,255,255,0.6)"        : GRAY_TEXT;
  const textMuted     = plan.dark ? "rgba(255,255,255,0.4)"        : "rgba(0,0,0,0.35)";

  return (
    <div style={{
      background: cardBg, borderRadius: 20,
      padding: isMobile ? "28px 24px" : "36px 28px",
      border: cardBorder,
      boxShadow: cardShadow,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>

      {plan.popular && (
        <div style={{
          position: "absolute", top: 20, right: 20,
          background: plan.dark ? "rgba(255,255,255,0.2)" : BLUE,
          color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "4px 12px",
          borderRadius: 999, letterSpacing: "0.08em",
        }}>
          POPULAR
        </div>
      )}

      {plan.founder && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: plan.dark ? "rgba(255,255,255,0.15)" : "rgba(3,105,161,0.08)",
          color: plan.dark ? "#fff" : BLUE,
          border: `1px solid ${plan.dark ? "rgba(255,255,255,0.2)" : "rgba(3,105,161,0.2)"}`,
          fontSize: 11, fontWeight: 700, padding: "4px 12px",
          borderRadius: 999, marginBottom: 16, alignSelf: "flex-start",
        }}>
          ✦ 3 meses grátis · Fundadores
        </div>
      )}

      {/* Plan name */}
      <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: textSecondary, marginBottom: 8,
      }}>
        {plan.name}
      </div>

      {/* Commission badge (creators only) */}
      {plan.commission && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginBottom: 16, alignSelf: "flex-start",
        }}>
          <span style={{
            fontSize: 22, fontWeight: 800,
            color: plan.dark ? "#fff" : BLUE,
          }}>
            {plan.commission}
          </span>
          <span style={{ fontSize: 12, color: textSecondary }}>de comissão</span>
        </div>
      )}

      {/* Price */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
        {isFree ? (
          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-1.5px", color: textPrimary, lineHeight: 1 }}>
            Grátis
          </span>
        ) : (
          <>
            <span style={{ fontSize: 18, fontWeight: 700, color: textSecondary, paddingBottom: 7 }}>R$</span>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-2px", color: textPrimary, lineHeight: 1 }}>
              {price.toLocaleString("pt-BR")}
            </span>
            <span style={{ fontSize: 13, color: textMuted, paddingBottom: 9 }}>/mês</span>
          </>
        )}
      </div>

      {/* Annual note / savings prompt */}
      {!isFree && (
        <div style={{ marginBottom: 4, minHeight: 20 }}>
          {billing === "annual" ? (
            <span style={{ fontSize: 12, color: textSecondary }}>
              Cobrado anualmente · R$ {plan.annualTotal.toLocaleString("pt-BR")}/ano
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: plan.dark ? "rgba(255,255,255,0.12)" : "rgba(22,163,74,0.1)",
              color: plan.dark ? "#fff" : "#15803D",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
            }}>
              Economize 20% no anual
            </span>
          )}
        </div>
      )}

      {/* Tagline */}
      <p style={{
        fontSize: 13, lineHeight: 1.65, color: textSecondary,
        margin: "16px 0 22px",
      }}>
        {plan.tagline}
      </p>

      {/* Divider */}
      <div style={{
        height: 1,
        background: plan.dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.07)",
        marginBottom: 22,
      }} />

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Check dark={plan.dark} />
            <span style={{ fontSize: 13, lineHeight: 1.5, color: plan.dark ? "rgba(255,255,255,0.85)" : "#374151" }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={plan.ctaHref}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          borderRadius: 12, padding: "14px 20px",
          fontSize: 14, fontWeight: 700, textDecoration: "none",
          transition: "background 0.15s, opacity 0.15s",
          ...(plan.dark
            ? { background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }
            : isFree
            ? { border: `2px solid ${BLUE}`, color: BLUE, background: "transparent" }
            : { background: BLUE, color: "#fff" }
          ),
        }}
        onMouseEnter={e => {
          if (plan.dark) e.currentTarget.style.background = "rgba(255,255,255,0.26)";
          else if (isFree) e.currentTarget.style.background = "rgba(3,105,161,0.06)";
          else e.currentTarget.style.background = "#0284C7";
        }}
        onMouseLeave={e => {
          if (plan.dark) e.currentTarget.style.background = "rgba(255,255,255,0.18)";
          else if (isFree) e.currentTarget.style.background = "transparent";
          else e.currentTarget.style.background = BLUE;
        }}
      >
        {plan.cta} <Arrow />
      </a>
    </div>
  );
}

export default function PrecosPage() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [session,   setSession]   = useState(null);
  const [audience,  setAudience]  = useState("criadores");
  const [billing,   setBilling]   = useState("monthly");
  const [faqOpen,   setFaqOpen]   = useState(null);
  const width      = useWindowSize();
  const isMobile   = width < 768;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const plans = audience === "criadores" ? CRIADOR_PLANS : EMPRESA_PLANS;

  return (
    <div style={{ minHeight: "100vh", color: NEAR_BLACK, background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 32px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="precos-nav" textColor={NEAR_BLACK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontSize: 14, fontWeight: label === "Preços" ? 600 : 500,
                  color: label === "Preços" ? BLUE : GRAY_TEXT,
                  textDecoration: "none", padding: "6px 14px", borderRadius: 8,
                  transition: "color 0.15s, background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = label === "Preços" ? BLUE : GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}
                >
                  {label}
                </a>
              ))}
            </nav>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  borderRadius: 999, padding: "9px 22px",
                  background: BLUE, color: "#fff",
                  fontSize: 14, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  textDecoration: "none", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = BLUE}
                >
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: BLUE,
                    border: "2px solid " + BLUE, background: "transparent",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    Entrar
                  </a>
                  <a href="/cadastro" style={{
                    borderRadius: 999, padding: "9px 22px",
                    background: BLUE, color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    textDecoration: "none", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                    onMouseLeave={e => e.currentTarget.style.background = BLUE}
                  >
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 22, color: NEAR_BLACK, padding: "4px 8px", display: "flex", alignItems: "center",
            }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{
            position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            padding: "12px 24px 24px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                padding: "13px 4px", fontSize: 17, fontWeight: 500,
                color: label === "Preços" ? BLUE : NEAR_BLACK, textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                  background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  textDecoration: "none", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = BLUE}
                >
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                    fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE,
                    border: "2px solid " + BLUE, transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    Entrar
                  </a>
                  <a href="/cadastro" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                    background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    textDecoration: "none", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                    onMouseLeave={e => e.currentTarget.style.background = BLUE}
                  >
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ── HEADER + TOGGLES ── */}
        <section style={{
          background: "#fff",
          paddingTop: isMobile ? 104 : 128,
          paddingBottom: isMobile ? 56 : 72,
          paddingLeft: 24, paddingRight: 24,
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: BLUE,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Planos e Preços
            </div>
            <h1 style={{
              fontSize: isMobile ? "clamp(34px, 8vw, 48px)" : "clamp(48px, 6vw, 68px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: isMobile ? "-1px" : "-2px",
              lineHeight: 1.06, marginBottom: 18,
            }}>
              Simples e transparente
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 19, color: GRAY_TEXT, lineHeight: 1.65, margin: "0 0 48px" }}>
              Comece gratuitamente. Escale quando precisar.
            </p>

            {/* Toggles */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center", justifyContent: "center",
              gap: 16,
            }}>
              {/* Audience toggle */}
              <div style={{
                display: "inline-flex",
                background: BG_GRAY, borderRadius: 12, padding: 4,
                border: "1px solid rgba(0,0,0,0.07)",
              }}>
                {[["criadores", "Criadores"], ["empresas", "Empresas"]].map(([key, label]) => (
                  <button key={key} onClick={() => setAudience(key)} style={{
                    padding: "9px 22px", borderRadius: 9, border: "none",
                    background: audience === key ? BLUE : "transparent",
                    color: audience === key ? "#fff" : GRAY_TEXT,
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                  }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Billing toggle */}
              <div style={{
                display: "inline-flex",
                background: BG_GRAY, borderRadius: 12, padding: 4,
                border: "1px solid rgba(0,0,0,0.07)",
                alignItems: "center",
              }}>
                {[["monthly", "Mensal"], ["annual", "Anual"]].map(([key, label]) => (
                  <button key={key} onClick={() => setBilling(key)} style={{
                    padding: "9px 22px", borderRadius: 9, border: "none",
                    background: billing === key ? BLUE : "transparent",
                    color: billing === key ? "#fff" : GRAY_TEXT,
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    {label}
                    {key === "annual" && (
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                        background: billing === "annual" ? "rgba(255,255,255,0.2)" : "rgba(22,163,74,0.12)",
                        color: billing === "annual" ? "#fff" : "#15803D",
                        padding: "2px 7px", borderRadius: 99,
                      }}>
                        −20%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        <section style={{
          background: BG_GRAY,
          padding: isMobile ? "48px 24px 72px" : "64px 48px 96px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? 20 : 24,
              alignItems: "start",
            }}>
              {plans.map(plan => (
                <PricingCard key={plan.key} plan={plan} billing={billing} isMobile={isMobile} />
              ))}
            </div>

            {audience === "criadores" && (
              <div style={{
                marginTop: 32, padding: "16px 24px",
                background: "rgba(3,105,161,0.05)",
                border: "1px solid rgba(3,105,161,0.15)",
                borderRadius: 14, textAlign: "center",
                fontSize: 13, color: GRAY_TEXT, lineHeight: 1.8,
              }}>
                <strong style={{ color: BLUE }}>✦ Oferta de Criadores Fundadores:</strong>{" "}
                Os primeiros 500 criadores ganham 3 meses gratuitos nos planos Pro e Premium.
                Aplicado automaticamente no cadastro. Sem cartão de crédito nos primeiros 3 meses.
              </div>
            )}
          </div>
        </section>

        {/* ── COMMISSION TABLE (Criadores) ── */}
        {audience === "criadores" && (
          <section style={{
            background: "#fff",
            padding: isMobile ? "64px 24px" : "96px 48px",
          }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: BLUE,
                  letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
                }}>
                  Comissões
                </div>
                <h2 style={{
                  fontSize: isMobile ? "clamp(28px, 6vw, 40px)" : "clamp(32px, 4vw, 48px)",
                  fontWeight: 800, color: NEAR_BLACK,
                  letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 14,
                }}>
                  Como funciona a comissão?
                </h2>
                <p style={{ fontSize: 16, color: GRAY_TEXT, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
                  A WePrompt retém uma comissão sobre cada venda. O valor varia conforme o seu plano.
                </p>
              </div>

              {/* Table */}
              <div style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "1.2fr 100px 1fr 1fr",
                  padding: "14px 28px",
                  background: BG_GRAY,
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                }}>
                  {["Plano", "Comissão", ...(isMobile ? [] : ["Exemplo (R$ 100)", "Você recebe"])].map(h => (
                    <div key={h} style={{
                      fontSize: 11, fontWeight: 700, color: GRAY_TEXT,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      textAlign: h === "Comissão" ? "center" : "left",
                    }}>
                      {h}
                    </div>
                  ))}
                </div>

                {[
                  { plan: "Free",    commission: "20%", example: "R$ 100,00", youGet: "R$ 80,00" },
                  { plan: "Pro",     commission: "15%", example: "R$ 100,00", youGet: "R$ 85,00" },
                  { plan: "Premium", commission: "10%", example: "R$ 100,00", youGet: "R$ 90,00" },
                ].map((row, i) => (
                  <div key={row.plan} style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "1.2fr 100px 1fr 1fr",
                    alignItems: "center",
                    padding: isMobile ? "18px 24px" : "20px 28px",
                    background: i % 2 === 1 ? BG_GRAY : "#fff",
                    borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: NEAR_BLACK }}>
                      Plano {row.plan}
                    </div>
                    <div style={{
                      fontSize: isMobile ? 24 : 28, fontWeight: 800, color: BLUE,
                      textAlign: "center",
                    }}>
                      {row.commission}
                    </div>
                    {!isMobile && (
                      <>
                        <div style={{ fontSize: 14, color: GRAY_TEXT }}>{row.example}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#15803D" }}>{row.youGet}</div>
                      </>
                    )}
                    {isMobile && (
                      <div style={{
                        gridColumn: "1 / -1", marginTop: 6,
                        fontSize: 13, color: GRAY_TEXT,
                      }}>
                        Em {row.example} → você recebe{" "}
                        <strong style={{ color: "#15803D" }}>{row.youGet}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p style={{
                textAlign: "center", fontSize: 13, color: GRAY_TEXT,
                marginTop: 16, lineHeight: 1.7,
              }}>
                Repasse via PIX em até 30 dias após venda confirmada. Saque mínimo de R$ 50.
              </p>
            </div>
          </section>
        )}

        {/* ── COMPARISON TABLE (Empresas) ── */}
        {audience === "empresas" && (
          <section style={{
            background: "#fff",
            padding: isMobile ? "64px 24px" : "96px 48px",
          }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: BLUE,
                  letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
                }}>
                  Comparação
                </div>
                <h2 style={{
                  fontSize: isMobile ? "clamp(28px, 6vw, 40px)" : "clamp(32px, 4vw, 48px)",
                  fontWeight: 800, color: NEAR_BLACK,
                  letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 14,
                }}>
                  Compare os planos
                </h2>
                <p style={{ fontSize: 16, color: GRAY_TEXT, lineHeight: 1.65, maxWidth: 480, margin: "0 auto" }}>
                  Escolha o plano ideal para o tamanho e necessidades da sua empresa.
                </p>
              </div>

              <div style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr",
                  padding: "14px 24px",
                  background: BG_GRAY,
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                }}>
                  {["Funcionalidade", "Free", "Business", "Enterprise"].map((h, i) => (
                    <div key={h} style={{
                      fontSize: 11, fontWeight: 700,
                      color: h === "Business" ? BLUE : GRAY_TEXT,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      textAlign: i === 0 ? "left" : "center",
                    }}>
                      {h}
                    </div>
                  ))}
                </div>

                {EMPRESA_COMPARE.map((row, i) => (
                  <div key={row.feature} style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr",
                    alignItems: "center",
                    padding: isMobile ? "12px 16px" : "16px 24px",
                    background: i % 2 === 1 ? BG_GRAY : "#fff",
                    borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>{row.feature}</div>
                    {[row.free, row.business, row.enterprise].map((val, idx) => (
                      <div key={idx} style={{
                        fontSize: 13, textAlign: "center",
                        fontWeight: val !== "–" && val !== "✓" ? 600 : 400,
                        color: val === "–" ? "rgba(0,0,0,0.2)" : val === "✓" ? "#15803D" : NEAR_BLACK,
                      }}>
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section style={{
          background: BG_GRAY,
          padding: isMobile ? "64px 24px" : "96px 48px",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: BLUE,
                letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
              }}>
                FAQ
              </div>
              <h2 style={{
                fontSize: isMobile ? "clamp(28px, 6vw, 40px)" : "clamp(32px, 4vw, 48px)",
                fontWeight: 800, color: NEAR_BLACK,
                letterSpacing: "-1px", lineHeight: 1.1,
              }}>
                Perguntas frequentes
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16,
                  border: `1px solid ${faqOpen === i ? "rgba(3,105,161,0.2)" : "rgba(0,0,0,0.07)"}`,
                  boxShadow: faqOpen === i ? "0 4px 20px rgba(3,105,161,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}>
                  <button
                    onClick={() => setFaqOpen(prev => prev === i ? null : i)}
                    style={{
                      width: "100%", padding: "20px 24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "inherit", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, lineHeight: 1.4 }}>
                      {q}
                    </span>
                    <span style={{ color: faqOpen === i ? BLUE : GRAY_TEXT, flexShrink: 0 }}>
                      <ChevronDown open={faqOpen === i} />
                    </span>
                  </button>
                  {faqOpen === i && (
                    <div style={{
                      padding: "0 24px 20px",
                      fontSize: 14, color: GRAY_TEXT, lineHeight: 1.75,
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                      paddingTop: 16,
                    }}>
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section style={{
          background: "#fff",
          padding: isMobile ? "64px 24px" : "96px 48px",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{
              fontSize: isMobile ? 26 : 36, fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 14,
            }}>
              Ainda tem dúvidas?
            </h2>
            <p style={{ fontSize: 16, color: GRAY_TEXT, lineHeight: 1.65, marginBottom: 32 }}>
              Nossa equipe está pronta para ajudar você a escolher o melhor plano.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={audience === "criadores" ? "/cadastro?role=criador" : "/cadastro"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: 12, padding: "14px 28px",
                  background: BLUE, color: "#fff",
                  fontSize: 15, fontWeight: 700, textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                onMouseLeave={e => e.currentTarget.style.background = BLUE}
              >
                Começar grátis <Arrow />
              </a>
              <a
                href="mailto:contato@weprompt.app.br"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: 12, padding: "14px 28px",
                  border: "2px solid " + BLUE, color: BLUE,
                  background: "transparent",
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Falar com a equipe
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#fff",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "44px 32px",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          gap: 20, textAlign: isMobile ? "center" : "left",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="precos-footer" textColor={NEAR_BLACK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
            {[
              ["Termos para Criadores", "/para-criadores/termos"],
              ["Termos para Empresas",  "/para-empresas/termos"],
              ["Contato", "mailto:contato@weprompt.app.br"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{
                fontSize: 13, color: GRAY_TEXT, textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
                onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
