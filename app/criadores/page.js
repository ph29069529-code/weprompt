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
  ["Explorar",       "/solucoes"],
  ["Preços",         "/precos"],
  ["Como funciona",  "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const PLANS = [
  {
    name: "Free", monthly: 0, commission: "20%",
    tagline: "Comece a publicar soluções sem custo algum.",
    features: ["Até 3 soluções publicadas", "Analytics básico", "Curadoria em 48h", "Suporte via e-mail"],
    cta: "Começar grátis", ctaHref: "/cadastro?role=criador",
    dark: false, founder: false,
  },
  {
    name: "Pro", monthly: 97, commission: "15%",
    tagline: "Para criadores que querem crescer e profissionalizar.",
    features: ["Soluções ilimitadas", "Destaque na categoria", "Analytics completo", 'Badge "Criador Verificado" ✦', "Suporte prioritário"],
    cta: "Começar Pro", ctaHref: "/cadastro?role=criador",
    dark: true, founder: true,
  },
  {
    name: "Premium", monthly: 297, commission: "10%",
    tagline: "O máximo de visibilidade e receita na plataforma.",
    features: ["Tudo do plano Pro", "Topo da categoria", "Destaque na homepage", "Suporte dedicado", "Gestão de afiliados"],
    cta: "Começar Premium", ctaHref: "/cadastro?role=criador",
    dark: false, founder: true, premium: true,
  },
];

const BENEFITS = [
  { icon: "🌎", title: "Alcance nacional", desc: "Chegue a empresas brasileiras que buscam ativamente soluções de IA — sem precisar fazer marketing por conta própria." },
  { icon: "💸", title: "PIX automático", desc: "Receba seu repasse via PIX de forma automática. Sem complicação, sem burocracia, sem espera interminável para sacar." },
  { icon: "📊", title: "Dashboard completo", desc: "Acompanhe assinantes, receita e performance em tempo real. Tome decisões baseadas em dados reais do seu negócio." },
  { icon: "🤝", title: "Suporte dedicado", desc: "Do cadastro até a aprovação e além. Uma equipe real, em português, pronta para ajudar você a crescer na plataforma." },
  { icon: "✨", title: "Curadoria de qualidade", desc: "Soluções aprovadas ganham credibilidade instantânea. Estar no WePrompt significa ser reconhecido como referência em IA." },
  { icon: "👥", title: "Comunidade de criadores", desc: "Conecte-se com outros criadores de IA no Brasil, troque experiências e construa parcerias dentro do maior marketplace do setor." },
];

const TESTIMONIALS = [
  {
    initials: "RM", color: "#0369A1",
    name: "Rafael M.", role: "Criador fundador",
    quote: "Em breve — depoimento real de criador fundador da WePrompt.",
  },
  {
    initials: "AS", color: "#0284C7",
    name: "Ana S.", role: "Especialista em IA",
    quote: "Em breve — depoimento real de criador fundador da WePrompt.",
  },
  {
    initials: "LC", color: "#38BDF8",
    name: "Lucas C.", role: "Desenvolvedor de automações",
    quote: "Em breve — depoimento real de criador fundador da WePrompt.",
  },
];

export default function CriadoresPage() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [session,  setSession]        = useState(null);
  const [founderCount, setFounderCount] = useState(null);
  const width      = useWindowSize();
  const isMobile   = width < 768;
  const isTablet   = width >= 768 && width < 1024;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role", ["criador", "creator"])
      .then(({ count }) => setFounderCount(count ?? 0));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", color: NEAR_BLACK, background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .revealed { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.08s; }
        .reveal-delay-2 { transition-delay: 0.16s; }
        .reveal-delay-3 { transition-delay: 0.24s; }
        .reveal-delay-4 { transition-delay: 0.32s; }
      `}</style>

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
            <WePromptLogo id="criadores-nav" textColor={NEAR_BLACK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontSize: 14, fontWeight: label === "Para Criadores" ? 600 : 500,
                  color: label === "Para Criadores" ? BLUE : GRAY_TEXT,
                  textDecoration: "none", padding: "6px 14px", borderRadius: 8,
                  transition: "color 0.15s, background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = label === "Para Criadores" ? BLUE : GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}
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
                  <a href="/cadastro?role=criador" style={{
                    borderRadius: 999, padding: "9px 22px",
                    background: BLUE, color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    textDecoration: "none", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                    onMouseLeave={e => e.currentTarget.style.background = BLUE}
                  >
                    Começar grátis <Arrow />
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
            padding: "12px 24px 20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                padding: "12px 4px", fontSize: 16, fontWeight: 500,
                color: label === "Para Criadores" ? BLUE : NEAR_BLACK,
                textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                  background: BLUE, color: "#fff",
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
                    fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE,
                    border: "2px solid " + BLUE, background: "transparent",
                  }}>
                    Entrar
                  </a>
                  <a href="/cadastro?role=criador" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "11px",
                    background: BLUE, color: "#fff",
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

        {/* ── HERO ── */}
        <section style={{
          background: "#fff",
          paddingTop: isMobile ? 108 : 148,
          paddingBottom: isMobile ? 64 : 96,
          paddingLeft: 24, paddingRight: 24,
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* Badge */}
            <div className="reveal" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(3,105,161,0.08)", color: BLUE,
              border: "1px solid rgba(3,105,161,0.2)",
              borderRadius: 999, padding: "6px 16px",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.01em",
              marginBottom: 28,
            }}>
              <span>✦</span> Para Criadores de IA
            </div>

            {/* Headline */}
            <h1 className="reveal reveal-delay-1" style={{
              fontSize: isMobile ? 36 : "clamp(40px, 5.5vw, 68px)",
              fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2.5px",
              color: NEAR_BLACK, margin: "0 0 24px",
            }}>
              Transforme sua solução de IA em receita recorrente
            </h1>

            {/* Subtitle */}
            <p className="reveal reveal-delay-2" style={{
              fontSize: isMobile ? 17 : 20, lineHeight: 1.65, color: GRAY_TEXT,
              maxWidth: 560, margin: "0 auto 40px",
            }}>
              Publique sua solução de IA, chegue a empresas brasileiras e receba via PIX. Sem burocracia.
            </p>

            {/* CTA buttons */}
            <div className="reveal reveal-delay-3" style={{
              display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
              marginBottom: 52,
            }}>
              <a href="/cadastro?role=criador" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: BLUE, color: "#fff",
                borderRadius: 999, padding: isMobile ? "13px 26px" : "15px 32px",
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                transition: "background 0.15s, transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.transform = "none"; }}
              >
                Começar agora <Arrow />
              </a>
              <a href="#como-funciona" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: NEAR_BLACK,
                border: "2px solid rgba(0,0,0,0.14)",
                borderRadius: 999, padding: isMobile ? "12px 26px" : "14px 32px",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                transition: "border-color 0.15s, background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.28)"; e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)"; e.currentTarget.style.background = "transparent"; }}
              >
                Ver como funciona
              </a>
            </div>

          </div>
        </section>

        {/* ── FOUNDER OFFER BANNER ── */}
        <section style={{ background: "#fff", padding: isMobile ? "32px 24px 0" : "48px 48px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #0369A1, #0891B2)",
              borderRadius: 20, padding: isMobile ? "32px 24px" : "40px",
              marginBottom: 48,
            }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff", color: "#0369A1",
                borderRadius: 999, padding: "5px 14px",
                fontSize: 12, fontWeight: 700, marginBottom: 20,
              }}>
                ⚡ Oferta de Lançamento
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
                gap: isMobile ? 28 : 40,
                alignItems: "center",
              }}>
                {/* Left: title + benefits */}
                <div>
                  <h2 style={{
                    fontSize: isMobile ? 22 : 28, fontWeight: 800,
                    color: "#fff", letterSpacing: "-0.5px", marginBottom: 24, lineHeight: 1.2,
                  }}>
                    Seja um dos 100 Criadores Fundadores
                  </h2>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 12, marginBottom: 28,
                  }}>
                    {[
                      { icon: "🎁", title: "1 mês grátis no plano Pro",  sub: "Valor de R$97, sem precisar de cartão" },
                      { icon: "🏅", title: "Badge Criador Fundador",      sub: "Permanente no seu perfil para sempre" },
                      { icon: "🔝", title: "Destaque no catálogo",        sub: "Suas soluções em primeiro nas buscas" },
                      { icon: "💰", title: "Comissão de 15%",             sub: "Menor taxa da plataforma durante o mês grátis" },
                    ].map(b => (
                      <div key={b.title} style={{
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 12, padding: "12px 16px",
                        display: "flex", gap: 12, alignItems: "flex-start",
                      }}>
                        <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.3 }}>{b.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{b.title}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{b.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="/cadastro?role=criador" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#fff", color: "#0369A1",
                    borderRadius: 12, padding: "16px 32px",
                    fontSize: 15, fontWeight: 700, textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Quero ser Criador Fundador →
                  </a>
                </div>

                {/* Right: counter */}
                <div style={{
                  textAlign: isMobile ? "left" : "center",
                  minWidth: isMobile ? undefined : 180,
                }}>
                  <div style={{ fontSize: isMobile ? 48 : 64, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-2px" }}>
                    {founderCount ?? "…"}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 16, marginTop: 4 }}>
                    de 100 vagas preenchidas
                  </div>
                  <div style={{
                    height: 8, borderRadius: 999,
                    background: "rgba(255,255,255,0.2)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      background: "rgba(255,255,255,0.65)",
                      width: `${Math.min(((founderCount ?? 0) / 100) * 100, 100)}%`,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="como-funciona" style={{ background: BG_GRAY, padding: isMobile ? "64px 24px" : "96px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Processo
              </p>
              <h2 style={{
                fontSize: isMobile ? 28 : "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800, letterSpacing: "-1.5px", color: NEAR_BLACK, marginBottom: 12,
              }}>
                Como funciona
              </h2>
              <p style={{ fontSize: 17, color: GRAY_TEXT, maxWidth: 460, margin: "0 auto" }}>
                Do cadastro ao primeiro pagamento em 4 passos simples.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 20,
            }}>
              {[
                { num: "01", icon: "📝", title: "Cadastre-se gratuitamente", desc: "Crie sua conta como criador em menos de 2 minutos. Sem mensalidade e sem burocracia." },
                { num: "02", icon: "🚀", title: "Publique sua solução",       desc: "Descreva sua solução, defina o preço e envie. Aceitamos assinatura mensal e pagamento único." },
                { num: "03", icon: "✅", title: "Nossa equipe aprova em 48h", desc: "Curadoria rigorosa para garantir qualidade. Aprovado, sua solução entra ao vivo no marketplace." },
                { num: "04", icon: "💸", title: "Comece a receber via PIX",   desc: "Cada nova assinatura gera receita recorrente direto na sua conta via PIX, automaticamente." },
              ].map((step, i) => (
                <div key={step.num} className={`reveal reveal-delay-${i + 1}`} style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 28px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  display: "flex", flexDirection: "column", gap: 16,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: "rgba(3,105,161,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.06em", marginBottom: 8 }}>
                      PASSO {step.num}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.2px" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.65, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── PLANS ── */}
        <section style={{ background: "#fff", padding: isMobile ? "64px 24px" : "96px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Planos
              </p>
              <h2 style={{
                fontSize: isMobile ? 28 : "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800, letterSpacing: "-1.5px", color: NEAR_BLACK, marginBottom: 12,
              }}>
                Escolha seu plano
              </h2>
              <p style={{ fontSize: 17, color: GRAY_TEXT, maxWidth: 460, margin: "0 auto" }}>
                Comece gratuitamente e evolua conforme seu negócio cresce.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 20, alignItems: "start",
            }}>
              {PLANS.map((plan, i) => {
                const isFree = plan.monthly === 0;
                return (
                  <div key={plan.name} className={`reveal reveal-delay-${i + 1}`} style={{
                    background: plan.dark ? BLUE : "#fff",
                    border: plan.premium ? `2px solid ${BLUE}` : plan.dark ? "none" : "1px solid rgba(0,0,0,0.07)",
                    borderRadius: 20,
                    padding: isMobile ? "28px 24px" : "36px 28px",
                    boxShadow: plan.dark
                      ? "0 24px 60px rgba(3,105,161,0.28)"
                      : plan.premium
                      ? "0 4px 24px rgba(3,105,161,0.1)"
                      : "0 2px 12px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column",
                    position: "relative", overflow: "hidden",
                  }}>

                    {/* Popular badge */}
                    {plan.dark && (
                      <div style={{
                        position: "absolute", top: 20, right: 20,
                        background: "rgba(255,255,255,0.2)", color: "#fff",
                        fontSize: 10, fontWeight: 800, padding: "4px 12px",
                        borderRadius: 999, letterSpacing: "0.08em",
                      }}>
                        POPULAR
                      </div>
                    )}

                    {/* Founder badge — Pro only */}
                    {plan.founder && !plan.premium && (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: plan.dark ? "rgba(255,255,255,0.15)" : "rgba(3,105,161,0.08)",
                        color: plan.dark ? "#fff" : BLUE,
                        border: `1px solid ${plan.dark ? "rgba(255,255,255,0.2)" : "rgba(3,105,161,0.2)"}`,
                        fontSize: 11, fontWeight: 700, padding: "4px 12px",
                        borderRadius: 999, marginBottom: 16, alignSelf: "flex-start",
                      }}>
                        🏅 1 mês grátis · Fundadores
                      </div>
                    )}

                    {/* Plan name */}
                    <div style={{
                      fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: plan.dark ? "rgba(255,255,255,0.6)" : GRAY_TEXT,
                      marginBottom: 8,
                    }}>
                      {plan.name}
                    </div>

                    {/* Commission */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, alignSelf: "flex-start" }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: plan.dark ? "#fff" : BLUE }}>
                        {plan.commission}
                      </span>
                      <span style={{ fontSize: 12, color: plan.dark ? "rgba(255,255,255,0.6)" : GRAY_TEXT }}>
                        de comissão
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 16 }}>
                      {isFree ? (
                        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-1.5px", color: plan.dark ? "#fff" : NEAR_BLACK, lineHeight: 1 }}>
                          Grátis
                        </span>
                      ) : (
                        <>
                          <span style={{ fontSize: 18, fontWeight: 700, color: plan.dark ? "rgba(255,255,255,0.6)" : GRAY_TEXT, paddingBottom: 7 }}>R$</span>
                          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-2px", color: plan.dark ? "#fff" : NEAR_BLACK, lineHeight: 1 }}>
                            {plan.monthly}
                          </span>
                          <span style={{ fontSize: 13, color: plan.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)", paddingBottom: 9 }}>/mês</span>
                        </>
                      )}
                    </div>

                    {/* Tagline */}
                    <p style={{
                      fontSize: 13, lineHeight: 1.65, margin: "0 0 20px",
                      color: plan.dark ? "rgba(255,255,255,0.6)" : GRAY_TEXT,
                    }}>
                      {plan.tagline}
                    </p>

                    {/* Divider */}
                    <div style={{
                      height: 1,
                      background: plan.dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.07)",
                      marginBottom: 20,
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
                    <a href={plan.ctaHref} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      borderRadius: 12, padding: "14px 20px",
                      fontSize: 14, fontWeight: 700, textDecoration: "none",
                      transition: "background 0.15s",
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
              })}
            </div>

            {/* Link to full pricing */}
            <p className="reveal" style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: GRAY_TEXT }}>
              Ver comparação completa de planos em{" "}
              <a href="/precos" style={{ color: BLUE, fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >
                /precos →
              </a>
            </p>

          </div>
        </section>

        {/* ── BENEFITS GRID ── */}
        <section style={{ background: BG_GRAY, padding: isMobile ? "64px 24px" : "96px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Vantagens
              </p>
              <h2 style={{
                fontSize: isMobile ? 28 : "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800, letterSpacing: "-1.5px", color: NEAR_BLACK, marginBottom: 12,
              }}>
                Por que os melhores criadores escolhem a WePrompt?
              </h2>
              <p style={{ fontSize: 17, color: GRAY_TEXT, maxWidth: 500, margin: "0 auto" }}>
                Uma plataforma construída do zero para criadores de IA brasileiros.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: 20,
            }}>
              {BENEFITS.map((item, i) => (
                <div key={item.title} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 28px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(3,105,161,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "rgba(3,105,161,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 20,
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.2px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ background: "#fff", padding: isMobile ? "64px 24px" : "96px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Depoimentos
              </p>
              <h2 style={{
                fontSize: isMobile ? 28 : "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800, letterSpacing: "-1.5px", color: NEAR_BLACK, marginBottom: 12,
              }}>
                O que dizem nossos criadores
              </h2>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(3,105,161,0.06)",
                border: "1px solid rgba(3,105,161,0.15)",
                borderRadius: 999, padding: "8px 18px",
                fontSize: 13, color: GRAY_TEXT, marginTop: 8,
              }}>
                <span>⏳</span> Em breve — depoimentos reais de criadores fundadores
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 20,
            }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className={`reveal reveal-delay-${i + 1}`} style={{
                  background: BG_GRAY,
                  borderRadius: 20, padding: "32px 28px",
                  display: "flex", flexDirection: "column", gap: 20,
                }}>
                  {/* Quote */}
                  <p style={{
                    fontSize: 15, lineHeight: 1.7, color: GRAY_TEXT,
                    fontStyle: "italic", margin: 0, flex: 1,
                  }}>
                    "{t.quote}"
                  </p>
                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: GRAY_TEXT }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ background: BG_GRAY, padding: isMobile ? "64px 24px" : "96px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="reveal" style={{
              background: `linear-gradient(135deg, ${BLUE} 0%, #0284C7 50%, #38BDF8 100%)`,
              borderRadius: 24,
              padding: isMobile ? "52px 28px" : "72px 64px",
              textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              {/* Decorative orb */}
              <div style={{
                position: "absolute", top: -60, right: -60,
                width: 240, height: 240, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: -40, left: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative" }}>
                <p style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 999, padding: "6px 16px",
                  fontSize: 13, fontWeight: 600, marginBottom: 24,
                }}>
                  ✦ Sem cartão de crédito
                </p>

                <h2 style={{
                  fontSize: isMobile ? 28 : "clamp(28px, 4vw, 48px)",
                  fontWeight: 800, letterSpacing: "-1.5px",
                  color: "#fff", marginBottom: 20,
                }}>
                  Pronto para monetizar sua solução?
                </h2>

                <p style={{
                  fontSize: 18, color: "rgba(255,255,255,0.8)",
                  maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.65,
                }}>
                  Crie sua conta grátis e publique sua primeira solução em menos de 10 minutos.
                </p>

                <a href="/cadastro?role=criador" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: BLUE,
                  borderRadius: 999, padding: "15px 36px",
                  fontSize: 16, fontWeight: 700, textDecoration: "none",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Criar conta grátis <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          gap: 16, textAlign: isMobile ? "center" : "left",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="criadores-footer" textColor={NEAR_BLACK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              ["Privacidade", "/para-criadores/termos"],
              ["Termos", "/para-criadores/termos"],
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
