"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "../components/WePromptLogo";
import { supabase } from "../lib/supabase";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.08)";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role = session.user.user_metadata?.role;
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

const Check = ({ dark }) => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="8" cy="8" r="7" fill={dark ? "rgba(196,181,253,0.25)" : "rgba(107,92,231,0.12)"} />
    <path d="M5 8l2 2 4-4" stroke={dark ? "#C4B5FD" : PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços", "/precos"],
  ["Como funciona", "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const CRIADOR_PLANS = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    annualMonthly: 0,
    annualTotal: 0,
    tagline: "Para começar a publicar soluções sem custo algum.",
    features: [
      "Até 3 soluções publicadas",
      "20% de comissão por venda",
      "Analytics básico",
      "Curadoria e aprovação WePrompt",
      "Badge de perfil de criador",
      "Suporte via e-mail",
    ],
    cta: "Começar grátis",
    ctaHref: "/cadastro?role=criador",
    dark: false,
    popular: false,
    founder: false,
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 97,
    annualMonthly: 77,
    annualTotal: 924,
    tagline: "Para criadores que querem crescer e profissionalizar sua presença.",
    features: [
      "Soluções ilimitadas",
      "15% de comissão por venda",
      "Destaque na categoria",
      "Analytics completo com métricas",
      'Badge "Criador Verificado" ✦',
      "Suporte prioritário",
    ],
    cta: "Começar Pro",
    ctaHref: "/cadastro?role=criador",
    dark: true,
    popular: true,
    founder: true,
  },
  {
    key: "premium",
    name: "Premium",
    monthly: 297,
    annualMonthly: 237,
    annualTotal: 2844,
    tagline: "Para criadores que querem o máximo de visibilidade e receita.",
    features: [
      "Tudo do plano Pro",
      "10% de comissão por venda",
      "Topo da categoria (destaque máximo)",
      "Destaque na homepage da WePrompt",
      "Suporte prioritário dedicado",
      "Gestão de afiliados",
    ],
    cta: "Começar Premium",
    ctaHref: "/cadastro?role=criador",
    dark: false,
    popular: false,
    founder: true,
  },
];

const EMPRESA_PLANS = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    annualMonthly: 0,
    annualTotal: 0,
    tagline: "Explore o marketplace e descubra soluções de IA sem compromisso.",
    features: [
      "Acesso ao catálogo completo",
      "Compra e assinatura de soluções",
      "Preço cheio nas soluções",
      "Suporte via e-mail",
      "Filtros e busca avançada",
      "Avaliações verificadas",
    ],
    cta: "Começar grátis",
    ctaHref: "/cadastro",
    dark: false,
    popular: false,
    founder: false,
  },
  {
    key: "business",
    name: "Business",
    monthly: 197,
    annualMonthly: 157,
    annualTotal: 1884,
    tagline: "Para equipes que querem as melhores soluções de IA com economia.",
    features: [
      "10% de desconto em todas as soluções",
      "Suporte prioritário em PT-BR",
      "Curadoria personalizada mensal",
      "Até 3 usuários na conta",
      "Onboarding guiado",
      "Acesso a soluções em pré-lançamento",
    ],
    cta: "Começar Business",
    ctaHref: "/cadastro",
    dark: true,
    popular: true,
    founder: false,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthly: 497,
    annualMonthly: 397,
    annualTotal: 4764,
    tagline: "Para grandes empresas com alto volume e necessidades dedicadas.",
    features: [
      "20% de desconto em todas as soluções",
      "Suporte dedicado via WhatsApp",
      "Curadoria personalizada semanal",
      "Usuários ilimitados",
      "Onboarding completo da equipe",
      "Relatório de ROI mensal",
    ],
    cta: "Falar com a equipe",
    ctaHref: "mailto:contato@weprompt.app.br",
    dark: false,
    popular: false,
    founder: false,
  },
];

const EMPRESA_COMPARE = [
  { feature: "Acesso ao catálogo", free: "✓", business: "✓", enterprise: "✓" },
  { feature: "Desconto nas soluções", free: "–", business: "10%", enterprise: "20%" },
  { feature: "Suporte", free: "E-mail", business: "Prioritário PT-BR", enterprise: "WhatsApp dedicado" },
  { feature: "Curadoria personalizada", free: "–", business: "Mensal", enterprise: "Semanal" },
  { feature: "Usuários na conta", free: "1", business: "Até 3", enterprise: "Ilimitados" },
  { feature: "Onboarding", free: "–", business: "Guiado", enterprise: "Completo" },
  { feature: "Relatório de ROI", free: "–", business: "–", enterprise: "Mensal" },
];

function PricingCard({ plan, billing, isMobile }) {
  const isFree = plan.monthly === 0;
  const price = billing === "annual" ? plan.annualMonthly : plan.monthly;

  return (
    <div style={{
      background: plan.dark ? DARK : "#fff",
      borderRadius: 20,
      padding: isMobile ? "28px 22px" : "36px 28px",
      border: plan.dark ? "none" : `1px solid ${BORDER}`,
      boxShadow: plan.dark
        ? "0 24px 60px rgba(0,0,0,0.22)"
        : "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>

      {plan.popular && (
        <div style={{
          position: "absolute", top: 18, right: 18,
          background: PURPLE, color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "3px 11px",
          borderRadius: 999, letterSpacing: "0.06em",
        }}>
          POPULAR
        </div>
      )}

      {plan.founder && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: plan.dark ? "rgba(196,181,253,0.15)" : "rgba(107,92,231,0.08)",
          color: plan.dark ? "#C4B5FD" : PURPLE,
          border: `1px solid ${plan.dark ? "rgba(196,181,253,0.2)" : "rgba(107,92,231,0.15)"}`,
          fontSize: 11, fontWeight: 700, padding: "4px 12px",
          borderRadius: 999, marginBottom: 16, alignSelf: "flex-start",
        }}>
          ✦ 3 meses grátis · Fundadores
        </div>
      )}

      <div style={{
        fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
        color: plan.dark ? "rgba(255,255,255,0.45)" : GRAY,
        marginBottom: 10, textTransform: "uppercase",
      }}>
        {plan.name}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
        {isFree ? (
          <span style={{
            fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px",
            color: plan.dark ? "#fff" : DARK, lineHeight: 1,
          }}>
            Grátis
          </span>
        ) : (
          <>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: plan.dark ? "rgba(255,255,255,0.7)" : DARK,
              paddingBottom: 6,
            }}>
              R$
            </span>
            <span style={{
              fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px",
              color: plan.dark ? "#fff" : DARK, lineHeight: 1,
            }}>
              {price.toLocaleString("pt-BR")}
            </span>
            <span style={{
              fontSize: 13, paddingBottom: 8,
              color: plan.dark ? "rgba(255,255,255,0.35)" : GRAY,
            }}>
              /mês
            </span>
          </>
        )}
      </div>

      {!isFree && (
        <div style={{ marginBottom: 4, minHeight: 20 }}>
          {billing === "annual" ? (
            <span style={{ fontSize: 12, color: plan.dark ? "rgba(255,255,255,0.35)" : GRAY }}>
              Cobrado anualmente · R$ {plan.annualTotal.toLocaleString("pt-BR")}/ano
            </span>
          ) : (
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: plan.dark ? "#A78BFA" : PURPLE,
            }}>
              Economize 20% no plano anual →
            </span>
          )}
        </div>
      )}

      <p style={{
        fontSize: 13, lineHeight: 1.65,
        color: plan.dark ? "rgba(255,255,255,0.45)" : GRAY,
        margin: "16px 0 24px",
      }}>
        {plan.tagline}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <Check dark={plan.dark} />
            <span style={{
              fontSize: 13, lineHeight: 1.5,
              color: plan.dark ? "rgba(255,255,255,0.7)" : "#374151",
            }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      <a
        href={plan.ctaHref}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          borderRadius: 999, padding: "13px 20px",
          fontSize: 14, fontWeight: 700, textDecoration: "none",
          transition: "opacity 0.15s",
          ...(plan.dark
            ? { background: PURPLE, color: "#fff", boxShadow: "0 4px 20px rgba(107,92,231,0.4)" }
            : isFree
            ? { border: "1.5px solid rgba(0,0,0,0.14)", color: DARK, background: "transparent" }
            : { background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff", boxShadow: "0 4px 16px rgba(107,92,231,0.3)" }
          ),
        }}
      >
        {plan.cta} <Arrow />
      </a>
    </div>
  );
}

export default function PrecosPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [audience, setAudience] = useState("criadores");
  const [billing, setBilling] = useState("monthly");
  const width = useWindowSize();
  const isMobile = width < 768;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const plans = audience === "criadores" ? CRIADOR_PLANS : EMPRESA_PLANS;

  return (
    <div style={{
      minHeight: "100vh", color: DARK,
      background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 30%, #EEF0FF 60%, #F5F0FF 100%)",
    }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="precos-nav" textColor={DARK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} className="nav-link"
                  style={label === "Preços" ? { color: PURPLE, fontWeight: 600 } : {}}
                >
                  {label}
                </a>
              ))}
            </nav>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {session ? (
                <a href={dashboardUrl} className="btn-dark" style={{
                  borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: DARK, border: "1.5px solid rgba(0,0,0,0.14)",
                    background: "transparent",
                  }}>Entrar</a>
                  <a href="/cadastro" className="btn-dark" style={{
                    borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                  }}>
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 22, color: DARK, padding: "4px 8px", display: "flex", alignItems: "center",
            }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{
            position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            padding: "12px 24px 20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                padding: "12px 4px", fontSize: 16, fontWeight: 500,
                color: DARK, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>{label}</a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {session ? (
                <a href={dashboardUrl} className="btn-dark" style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                  fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                    fontSize: 14, fontWeight: 500, textDecoration: "none", color: DARK,
                    border: "1.5px solid rgba(0,0,0,0.14)",
                  }}>Entrar</a>
                  <a href="/cadastro" className="btn-dark" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                    fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    textDecoration: "none",
                  }}>
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ── PAGE HEADER ── */}
        <section style={{ padding: isMobile ? "56px 24px 40px" : "88px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(107,92,231,0.08)", border: "1px solid rgba(107,92,231,0.14)",
              color: PURPLE, fontSize: 12, fontWeight: 700,
              padding: "5px 14px", borderRadius: 999, marginBottom: 24, letterSpacing: "0.05em",
            }}>
              ✦ Planos e Preços
            </div>
            <h1 style={{
              fontSize: isMobile ? 34 : 54,
              fontWeight: 800, color: DARK, letterSpacing: "-1.5px",
              lineHeight: 1.1, marginBottom: 18,
            }}>
              O plano certo para cada momento
            </h1>
            <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.7, margin: 0 }}>
              Comece grátis e escale conforme cresce. Sem taxas escondidas, sem surpresas.
            </p>
          </div>
        </section>

        {/* ── TOGGLES ── */}
        <section style={{ padding: "0 24px 52px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

          {/* Audience toggle */}
          <div style={{
            display: "inline-flex", background: "#fff",
            border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            {[["criadores", "Para Criadores"], ["empresas", "Para Empresas"]].map(([key, label]) => (
              <button key={key} onClick={() => setAudience(key)} style={{
                padding: "10px 22px", borderRadius: 9,
                background: audience === key ? DARK : "transparent",
                color: audience === key ? "#fff" : GRAY,
                border: "none", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            background: "#fff", border: `1px solid ${BORDER}`,
            borderRadius: 999, padding: "8px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: billing === "monthly" ? DARK : GRAY }}>
              Mensal
            </span>
            <button
              onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
              style={{
                width: 46, height: 26, borderRadius: 99,
                background: billing === "annual" ? PURPLE : "rgba(0,0,0,0.12)",
                border: "none", cursor: "pointer", padding: 0,
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 5,
                left: billing === "annual" ? 24 : 5,
                width: 16, height: 16, borderRadius: "50%",
                background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: billing === "annual" ? DARK : GRAY }}>
              Anual
            </span>
            {billing === "annual" && (
              <span style={{
                background: "rgba(22,163,74,0.09)", color: "#15803D",
                border: "1px solid rgba(22,163,74,0.18)",
                fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999,
              }}>
                −20%
              </span>
            )}
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 16 : 20,
            alignItems: "start",
          }}>
            {plans.map(plan => (
              <PricingCard key={plan.key} plan={plan} billing={billing} isMobile={isMobile} />
            ))}
          </div>

          {audience === "criadores" && (
            <div style={{
              marginTop: 32, padding: "16px 24px",
              background: "rgba(107,92,231,0.05)",
              border: "1px solid rgba(107,92,231,0.12)",
              borderRadius: 12, textAlign: "center",
              fontSize: 13, color: GRAY, lineHeight: 1.8,
            }}>
              <strong style={{ color: PURPLE }}>* Oferta de Criadores Fundadores:</strong>{" "}
              Os primeiros 500 criadores a se cadastrar ganham 3 meses gratuitos nos planos Pro e Premium.
              A oferta é aplicada automaticamente no cadastro. Sem necessidade de cartão de crédito para os 3 primeiros meses.
            </div>
          )}
        </section>

        {/* ── COMMISSION TABLE (Criadores) ── */}
        {audience === "criadores" && (
          <section style={{ padding: "0 24px 80px", maxWidth: 840, margin: "0 auto" }}>
            <h2 style={{
              fontSize: isMobile ? 22 : 28, fontWeight: 800, color: DARK,
              textAlign: "center", marginBottom: 10, letterSpacing: "-0.5px",
            }}>
              Como funciona a comissão?
            </h2>
            <p style={{ textAlign: "center", fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.7 }}>
              A WePrompt retém uma comissão sobre cada venda. O valor varia conforme o seu plano.
            </p>
            <div style={{
              background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
            }}>
              {[
                { plan: "Free", comissao: "20%", sobre: "R$ 97 vendido", voce: "R$ 77,60", plat: "R$ 19,40" },
                { plan: "Pro",  comissao: "15%", sobre: "R$ 97 vendido", voce: "R$ 82,45", plat: "R$ 14,55" },
                { plan: "Premium", comissao: "10%", sobre: "R$ 97 vendido", voce: "R$ 87,30", plat: "R$ 9,70" },
              ].map((row, i) => (
                <div key={row.plan} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 80px 1fr 1fr 1fr",
                  gap: isMobile ? 8 : 0,
                  alignItems: "center",
                  padding: isMobile ? "18px 20px" : "18px 28px",
                  borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: DARK }}>Plano {row.plan}</div>
                  <div style={{
                    fontSize: isMobile ? 22 : 28, fontWeight: 800, color: PURPLE,
                    textAlign: isMobile ? "right" : "center",
                  }}>
                    {row.comissao}
                  </div>
                  {!isMobile && (
                    <>
                      <div style={{ fontSize: 13, color: GRAY, paddingLeft: 16 }}>Exemplo: {row.sobre}</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.04em" }}>Você recebe</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#15803D" }}>{row.voce}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.04em" }}>Plataforma</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: DARK }}>{row.plat}</div>
                      </div>
                    </>
                  )}
                  {isMobile && (
                    <div style={{ gridColumn: "1 / -1", fontSize: 13, color: GRAY, marginTop: 4 }}>
                      Para uma venda de {row.sobre} → você recebe <strong style={{ color: "#15803D" }}>{row.voce}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: GRAY, marginTop: 14, lineHeight: 1.7 }}>
              Repasse via PIX em até 30 dias após a venda confirmada. Saque mínimo de R$ 50.
            </p>
          </section>
        )}

        {/* ── COMPARISON TABLE (Empresas) ── */}
        {audience === "empresas" && (
          <section style={{ padding: "0 24px 80px", maxWidth: 840, margin: "0 auto" }}>
            <h2 style={{
              fontSize: isMobile ? 22 : 28, fontWeight: 800, color: DARK,
              textAlign: "center", marginBottom: 10, letterSpacing: "-0.5px",
            }}>
              Compare os planos
            </h2>
            <p style={{ textAlign: "center", fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.7 }}>
              Escolha o plano ideal para o tamanho e necessidades da sua empresa.
            </p>
            <div style={{
              background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
            }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1.4fr 1.4fr",
                padding: "14px 24px",
                borderBottom: `2px solid ${BORDER}`,
                background: "#fafafa",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.04em" }}>Funcionalidade</div>
                {["Free", "Business", "Enterprise"].map(label => (
                  <div key={label} style={{ fontSize: 12, fontWeight: 700, color: label === "Business" ? PURPLE : GRAY, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {label}
                  </div>
                ))}
              </div>
              {EMPRESA_COMPARE.map((row, i) => (
                <div key={row.feature} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1.4fr 1.4fr",
                  alignItems: "center",
                  padding: isMobile ? "12px 16px" : "14px 24px",
                  borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{row.feature}</div>
                  {[row.free, row.business, row.enterprise].map((val, idx) => (
                    <div key={idx} style={{
                      fontSize: 13, textAlign: "center", fontWeight: val !== "–" && val !== "✓" ? 600 : 400,
                      color: val === "–" ? "rgba(0,0,0,0.18)" : val === "✓" ? "#15803D" : DARK,
                    }}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 22 : 28, fontWeight: 800, color: DARK,
            textAlign: "center", marginBottom: 36, letterSpacing: "-0.5px",
          }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Posso mudar de plano a qualquer momento?",
                a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A cobrança é ajustada proporcionalmente.",
              },
              {
                q: "O que acontece se eu cancelar?",
                a: "Ao cancelar, você retorna ao plano Free. Suas soluções publicadas permanecem ativas, mas sujeitas às regras do plano Free (até 3 soluções).",
              },
              {
                q: "Há cobrança de taxa de setup?",
                a: "Não. Nenhum plano tem taxa de setup ou taxas escondidas. Você paga apenas a mensalidade do plano escolhido.",
              },
              {
                q: "Aceita cartão de crédito ou apenas PIX?",
                a: "Aceitamos cartão de crédito, boleto e PIX para pagamento dos planos mensais e anuais.",
              },
            ].map(({ q, a }, i) => (
              <div key={i} style={{
                background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14,
                padding: "20px 24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 8 }}>{q}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "0 24px 96px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: DARK, borderRadius: 24,
            padding: isMobile ? "48px 24px" : "72px 48px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse 60% 70% at 50% 110%, ${PURPLE}33 0%, transparent 65%)`,
            }} />
            <div style={{ position: "absolute", top: -32, left: -32, width: 120, height: 120, borderRadius: "50%", background: `${PURPLE}18` }} />
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "#4F46E533" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{
                fontSize: isMobile ? 28 : 44, fontWeight: 800, color: "#fff",
                letterSpacing: "-1px", marginBottom: 16,
              }}>
                {audience === "criadores"
                  ? "Comece a monetizar sua IA hoje"
                  : "Encontre a solução de IA ideal para sua empresa"}
              </h2>
              <p style={{
                fontSize: 16, color: "rgba(255,255,255,0.5)",
                maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7,
              }}>
                {audience === "criadores"
                  ? "Cadastro gratuito. Curadoria em até 48h. Sem taxa de setup."
                  : "Acesse centenas de soluções de IA curadas. Suporte em português."}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={audience === "criadores" ? "/cadastro?role=criador" : "/cadastro"}
                  className="btn-primary"
                  style={{
                    borderRadius: 999, padding: "14px 32px", fontSize: 15, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                  }}
                >
                  {audience === "criadores" ? "Criar conta de Criador" : "Criar conta grátis"} <Arrow />
                </a>
                <a href="mailto:contato@weprompt.app.br" style={{
                  borderRadius: 999, padding: "14px 32px", fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)",
                }}>
                  Falar com a equipe
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#F3F4F6", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          gap: 16, textAlign: isMobile ? "center" : "left",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="precos-footer" textColor={DARK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
            <a href="/para-criadores/termos" className="footer-link">Termos para Criadores</a>
            <a href="/para-empresas/termos" className="footer-link">Termos para Empresas</a>
            <a href="mailto:contato@weprompt.app.br" className="footer-link">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
