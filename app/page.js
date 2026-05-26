"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "./components/WePromptLogo";
import { supabase } from "./lib/supabase";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role = session.user.user_metadata?.role;
  const email = session.user.email;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

const PURPLE = "#0EA5E9";
const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT = "#6E6E73";
const BG_GRAY = "#F5F5F7";

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

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços", "/precos"],
  ["Como funciona", "#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={PURPLE + "18"} />
    <path d="M7 12l3 3 7-7" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function CatalogMockup() {
  const solutions = [
    { cat: "WhatsApp IA", name: "Agente de Vendas WhatsApp", price: "R$ 97/mês", badge: "Verificado ✦" },
    { cat: "Automação",   name: "Auto Proposta Comercial",   price: "R$ 149/mês", badge: null },
    { cat: "Chatbots",    name: "Suporte Inteligente 24h",   price: "R$ 67/mês",  badge: "Verificado ✦" },
  ];
  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      padding: "24px",
      width: "100%", maxWidth: 360,
      boxShadow: "0 40px 80px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.06)",
      animation: "float 4s ease-in-out infinite",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        Catálogo WePrompt
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {solutions.map(({ cat, name, price, badge }) => (
          <div key={name} style={{
            background: BG_GRAY, borderRadius: 14, padding: "14px 16px",
            border: "1px solid rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: PURPLE,
                    background: PURPLE + "12", padding: "2px 8px", borderRadius: 99,
                  }}>
                    {cat}
                  </span>
                  {badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#15803D", background: "rgba(22,163,74,0.1)", padding: "2px 7px", borderRadius: 99 }}>
                      {badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, lineHeight: 1.35 }}>{name}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: PURPLE, flexShrink: 0, marginTop: 2 }}>{price}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "11px 16px", background: "#0369A1", borderRadius: 12, textAlign: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Ver todas as soluções →</span>
      </div>
    </div>
  );
}

function CreatorCard() {
  return (
    <div style={{
      background: NEAR_BLACK,
      borderRadius: 24,
      padding: "32px 28px",
      width: "100%", maxWidth: 360,
      boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
      animation: "float 4s ease-in-out infinite",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>
        Painel do Criador
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Receita este mês</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>—</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[{ label: "Assinantes", value: "—" }, { label: "Novas vendas", value: "—" }].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px",
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Desempenho por solução</div>
        {[
          { name: "Agente WhatsApp", pct: 82 },
          { name: "Chatbot Suporte", pct: 61 },
          { name: "Auto Proposta IA", pct: 43 },
        ].map(({ name, pct }) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{name}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: `linear-gradient(90deg, ${PURPLE}, #38BDF8)`,
                borderRadius: 99,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlassStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIndex(i => (i + 1) % 3), 3000);
    return () => clearInterval(id);
  }, []);

  const positionStyles = [
    {
      transform: "perspective(800px) rotateY(-5deg) translateZ(0px) translateX(0px) translateY(0px)",
      zIndex: 3, opacity: 1,
    },
    {
      transform: "perspective(800px) rotateY(-15deg) translateZ(-40px) translateX(25px) translateY(30px)",
      zIndex: 2, opacity: 0.95,
    },
    {
      transform: "perspective(800px) rotateY(-20deg) translateZ(-80px) translateX(50px) translateY(60px)",
      zIndex: 1, opacity: 0.82,
    },
  ];

  const contents = [
    /* card 0: Dashboard */
    <div key="dash" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#0EA5E9" }}>WePrompt Dashboard</span>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["Soluções de IA", "Criadores"].map(lbl => (
          <div key={lbl} style={{
            flex: 1, background: "rgba(14,165,233,0.08)", borderRadius: 10,
            padding: "12px 14px", border: "1px solid rgba(14,165,233,0.2)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9" }}>{lbl}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0369A1" }}>Automação</span>
          <span style={{ fontSize: 12, color: "#0369A1" }}>78%</span>
        </div>
        <div style={{ height: 6, background: "rgba(14,165,233,0.15)", borderRadius: 99 }}>
          <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg, #38BDF8, #0EA5E9)", borderRadius: 99 }} />
        </div>
      </div>
    </div>,

    /* card 1: Soluções em Alta */
    <div key="high" style={{ padding: "20px 24px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0369A1", marginBottom: 16 }}>Soluções em Alta</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {["Agentes IA", "WhatsApp", "Marketing"].map(tag => (
          <span key={tag} style={{
            padding: "5px 12px", borderRadius: 99,
            background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)",
            fontSize: 11, fontWeight: 600, color: "#0369A1",
          }}>{tag}</span>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)",
        borderRadius: 10, padding: "12px 14px",
      }}>
        <span style={{ fontSize: 13, color: "#1e40af" }}>🤖 Agente de Vendas</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9" }}>R$ 97/mês</span>
      </div>
    </div>,

    /* card 2: Suas Compras */
    <div key="purchases" style={{ padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0369A1", marginBottom: 16 }}>Suas Compras</div>
      {[0, 1].map(i => (
        <div key={i} style={{
          height: 12, borderRadius: 6, marginBottom: 10,
          background: "rgba(14,165,233,0.12)",
          filter: "blur(1.5px)", opacity: 0.6,
        }} />
      ))}
    </div>,
  ];

  return (
    <div style={{ position: "relative", width: 580, height: 460, flexShrink: 0, animation: "float 4s ease-in-out infinite" }}>
      {/* Soft radial glow behind the stack */}
      <div style={{
        position: "absolute", top: -40, right: -40, bottom: -40, left: -40,
        borderRadius: 40, zIndex: -1,
        background: "radial-gradient(ellipse at center, rgba(186,230,253,0.4) 0%, rgba(219,234,254,0.2) 50%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      {[0, 1, 2].map(cardIndex => {
        const pos = (cardIndex - activeIndex + 3) % 3;
        const { transform, zIndex, opacity } = positionStyles[pos];
        return (
          <div key={cardIndex} style={{
            position: "absolute", top: 0, left: 0,
            width: 500, height: 340,
            background: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(219,234,254,0.25) 50%, rgba(186,230,253,0.35) 100%)",
            border: "1.5px solid rgba(255,255,255,0.9)",
            borderRadius: 20,
            boxShadow: "0 16px 48px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)",
            overflow: "hidden",
            transform, zIndex, opacity,
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            {/* Top edge refraction highlight */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1, zIndex: 10,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            }} />
            {/* Left edge refraction highlight */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 1, zIndex: 10,
              background: "linear-gradient(180deg, rgba(255,255,255,0.9), transparent, rgba(255,255,255,0.3))",
            }} />
            {contents[cardIndex]}
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const width = useWindowSize();
  const isMobile = width < 768;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  /* ── Reveal animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", color: NEAR_BLACK, background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal-left.visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal-right.visible { opacity: 1; transform: translateX(0); }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @keyframes pulse-orb { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.06); } }
        .nav-hover:hover { color: ${NEAR_BLACK} !important; background: rgba(0,0,0,0.04) !important; }
      `}</style>

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
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
            <WePromptLogo id="header" textColor={NEAR_BLACK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontSize: 14, fontWeight: 500, color: GRAY_TEXT,
                  textDecoration: "none", padding: "6px 14px", borderRadius: 8,
                  transition: "color 0.15s, background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}
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
                  background: "#0369A1", color: "#fff",
                  fontSize: 14, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
                >
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: "#0369A1",
                    border: "2px solid #0369A1", background: "transparent",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    Entrar
                  </a>
                  <a href="/cadastro" style={{
                    borderRadius: 999, padding: "9px 22px",
                    background: "#0369A1", color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                    onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
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
                color: NEAR_BLACK, textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                  background: "#0369A1", color: "#fff",
                  fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  textDecoration: "none", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
                >
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                    fontSize: 14, fontWeight: 500, textDecoration: "none", color: "#0369A1",
                    border: "2px solid #0369A1", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    Entrar
                  </a>
                  <a href="/cadastro" style={{
                    flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                    background: "#0369A1", color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    textDecoration: "none", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                    onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
                  >
                    Criar conta <Arrow />
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════
          HERO — 100vh, white, two-column
      ════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "120px 24px 80px" : "148px 72px 80px",
        background: "#FFFFFF",
        position: "relative", overflow: "hidden",
        gap: isMobile ? 0 : 64,
      }}>
        {/* Left: text content */}
        <div style={{
          flex: 1,
          textAlign: isMobile ? "center" : "left",
          maxWidth: isMobile ? "100%" : 560,
          position: "relative", zIndex: 1,
        }}>
          {/* Badge pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff",
            border: "1.5px solid rgba(14,165,233,0.22)",
            borderRadius: 999, padding: "8px 20px",
            fontSize: 13, fontWeight: 600, color: PURPLE,
            marginBottom: 40,
            boxShadow: "0 2px 16px rgba(14,165,233,0.1)",
            letterSpacing: "0.01em",
          }}>
            <span>✦</span>
            1º Marketplace de IA da América Latina
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 800, color: NEAR_BLACK,
            letterSpacing: isMobile ? "-1.5px" : "-2px",
            lineHeight: 1.06, marginBottom: 28,
          }}>
            Encontre a solução de IA perfeita para o seu negócio
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? 17 : 19,
            color: GRAY_TEXT, lineHeight: 1.65,
            maxWidth: 500, margin: isMobile ? "0 auto 52px" : "0 0 52px",
          }}>
            O primeiro marketplace brasileiro de soluções de inteligência artificial.
            Curadoria especializada, suporte em português e pagamentos seguros.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 14,
            justifyContent: isMobile ? "center" : "flex-start",
            flexWrap: "wrap", marginBottom: 56,
          }}>
            <a href="/solucoes" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 999, padding: isMobile ? "15px 28px" : "17px 36px",
              background: "#0369A1", color: "#fff",
              fontSize: isMobile ? 15 : 17, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 8px 32px rgba(14,165,233,0.3)",
              transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0369A1"; e.currentTarget.style.transform = "none"; }}
            >
              Explorar Soluções <Arrow />
            </a>
            <a href="/cadastro?role=criador" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 999, padding: isMobile ? "14px 28px" : "16px 36px",
              background: "transparent", color: "#0369A1",
              fontSize: isMobile ? 15 : 17, fontWeight: 600, textDecoration: "none",
              border: "2px solid #0369A1",
              transition: "background 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(3,105,161,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              Quero ser Criador
            </a>
          </div>

          {/* Social proof */}
          <div>
            <p style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 14, fontWeight: 500, letterSpacing: "0.01em" }}>
              Confiado por empresas em todo o Brasil
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: isMobile ? "center" : "flex-start", flexWrap: "wrap" }}>
              {["Startups", "Agências Digitais", "E-commerce", "Consultorias", "Indústrias"].map(name => (
                <div key={name} style={{
                  padding: "7px 18px",
                  background: BG_GRAY, borderRadius: 999,
                  fontSize: 13, fontWeight: 600, color: GRAY_TEXT,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: glass stack — hidden on mobile */}
        {!isMobile && (
          <div style={{
            flex: 1, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <GlassStack />
          </div>
        )}

        {/* Bounce scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          color: GRAY_TEXT, opacity: 0.4, animation: "bounce 2.2s ease-in-out infinite",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TICKER — gray
      ════════════════════════════════════════ */}
      <div style={{
        background: BG_GRAY, padding: "18px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 24s linear infinite" }}>
          {[0, 1].map(i => (
            <span key={i} style={{
              display: "inline-block",
              fontSize: 14, fontWeight: 600, color: GRAY_TEXT,
              paddingRight: 0,
            }}>
              Agentes de IA • Automações • Chatbots • Marketing IA • WhatsApp IA • Analytics • Integrações • Copywriting IA • Geração de Leads • Atendimento IA •&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FOR CREATORS — gray, split
      ════════════════════════════════════════ */}
      <section style={{
        background: BG_GRAY,
        padding: isMobile ? "88px 24px" : "128px 48px",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 64 : 96,
          alignItems: "center",
        }}>
          {/* Left — text */}
          <div className="reveal-left">
            <div style={{
              fontSize: 12, fontWeight: 700, color: PURPLE,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Para Criadores
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(36px, 7vw, 52px)" : "clamp(40px, 4.5vw, 60px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: isMobile ? "-1px" : "-1.5px",
              lineHeight: 1.08, marginBottom: 36,
            }}>
              Distribua.<br />Monetize.<br />Escale.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
              {[
                { title: "Publique em minutos", desc: "Cadastre, descreva e envie sua solução. Nossa curadoria aprova em até 48 horas úteis." },
                { title: "Receba via PIX automaticamente", desc: "Sem burocracia, sem intermediários. Repasse direto na sua conta após cada venda confirmada." },
                { title: "Alcance empresas em todo o Brasil", desc: "Todo o mercado empresarial brasileiro que busca IA — pronto para descobrir sua solução." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <CheckIcon />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/criadores" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 16, fontWeight: 700, color: "#0369A1", textDecoration: "none",
              transition: "gap 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "12px"}
              onMouseLeave={e => e.currentTarget.style.gap = "8px"}
            >
              Começar como criador <Arrow />
            </a>
          </div>

          {/* Right — floating card */}
          <div className="reveal-right" style={{ display: "flex", justifyContent: "center" }}>
            <CreatorCard />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOR COMPANIES — white, split (flipped)
      ════════════════════════════════════════ */}
      <section style={{
        background: "#fff",
        padding: isMobile ? "88px 24px" : "128px 48px",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 64 : 96,
          alignItems: "center",
        }}>
          {/* Left — floating card (on desktop) */}
          {!isMobile && (
            <div className="reveal-left" style={{ display: "flex", justifyContent: "center" }}>
              <CatalogMockup />
            </div>
          )}

          {/* Right — text */}
          <div className="reveal-right">
            <div style={{
              fontSize: 12, fontWeight: 700, color: PURPLE,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Para Empresas
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(32px, 7vw, 48px)" : "clamp(36px, 4vw, 56px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: isMobile ? "-1px" : "-1.5px",
              lineHeight: 1.12, marginBottom: 36,
            }}>
              IA que funciona. Em português. Com suporte real.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
              {[
                { title: "Soluções testadas e aprovadas", desc: "Cada item do catálogo passou por curadoria rigorosa. Você não perde tempo com soluções quebradas." },
                { title: "Suporte brasileiro em português", desc: "Time humano disponível para ajudar sua empresa a implementar e tirar o máximo de cada solução." },
                { title: "Cancele quando quiser", desc: "Sem contratos longos, sem multa por rescisão. Você está sempre no controle." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <CheckIcon />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/solucoes" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 16, fontWeight: 700, color: "#0369A1", textDecoration: "none",
              transition: "gap 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "12px"}
              onMouseLeave={e => e.currentTarget.style.gap = "8px"}
            >
              Explorar soluções <Arrow />
            </a>
          </div>

          {/* Mobile: card after text */}
          {isMobile && (
            <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
              <CatalogMockup />
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS — gray
      ════════════════════════════════════════ */}
      <section id="como-funciona" style={{
        background: BG_GRAY,
        padding: isMobile ? "88px 24px" : "128px 48px",
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: PURPLE,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18,
            }}>
              Como funciona
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(32px, 7vw, 48px)" : "clamp(40px, 5vw, 60px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-2px", lineHeight: 1.08,
            }}>
              Simples. Rápido. Eficiente.
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 20,
          }}>
            {[
              {
                n: "1", title: "Encontre",
                desc: "Navegue pelo catálogo curado. Filtre por categoria, leia descrições detalhadas e avaliações verificadas de quem já usou.",
                delay: 0,
              },
              {
                n: "2", title: "Contrate",
                desc: "Compra única ou assinatura mensal. Pagamento seguro via cartão, boleto ou PIX. Acesso liberado imediatamente.",
                delay: 150,
              },
              {
                n: "3", title: "Cresça",
                desc: "Implante com suporte em português. Receba atualizações automáticas quando o criador lança melhorias.",
                delay: 300,
              },
            ].map(({ n, title, desc, delay }) => (
              <div key={n} className="reveal" style={{
                transitionDelay: `${delay}ms`,
                background: "#fff", borderRadius: 22,
                padding: isMobile ? "28px 24px" : "40px 32px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.05)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -16, right: -4,
                  fontSize: 96, fontWeight: 900, color: PURPLE, opacity: 0.07,
                  lineHeight: 1, letterSpacing: "-4px", pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {n}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: PURPLE + "14",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17, fontWeight: 800, color: PURPLE,
                  marginBottom: 22,
                }}>
                  {n}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: NEAR_BLACK, marginBottom: 14, letterSpacing: "-0.5px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.72, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES GRID — white
      ════════════════════════════════════════ */}
      <section style={{
        background: "#fff",
        padding: isMobile ? "88px 24px" : "128px 48px",
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: PURPLE,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18,
            }}>
              Diferenciais
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(32px, 7vw, 48px)" : "clamp(40px, 5vw, 60px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-2px", lineHeight: 1.08,
            }}>
              Por que a WePrompt?
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>
            {[
              { icon: "✦", title: "Curadoria Especializada", desc: "Cada solução é testada e aprovada por nosso time antes de aparecer no catálogo. Qualidade garantida — sem soluções quebradas." },
              { icon: "🇧🇷", title: "Suporte em Português", desc: "Atendimento humano em PT-BR em todos os planos. Sem chatbot, sem barreiras de idioma, sem esperar uma resposta em inglês." },
              { icon: "🔒", title: "Pagamentos Seguros", desc: "Infraestrutura certificada. PIX, cartão e boleto processados com segurança. Criadores recebem via PIX automaticamente." },
              { icon: "✓", title: "Criadores Verificados", desc: 'Badge "Criador Verificado" para quem mantém suas soluções funcionando, responde suporte e recebe boas avaliações.' },
              { icon: "📊", title: "Analytics Completo", desc: "Empresas e criadores têm acesso a dados claros: visualizações, conversão, receita e desempenho por solução." },
              { icon: "⚖️", title: "LGPD Compliance", desc: "Plataforma desenvolvida com proteção de dados brasileira desde o início. Seus dados nunca são vendidos ou compartilhados." },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} className="reveal" style={{
                transitionDelay: `${(i % 3) * 80}ms`,
                background: BG_GRAY, borderRadius: 20,
                padding: isMobile ? "26px 22px" : "32px 28px",
                border: "1px solid rgba(0,0,0,0.04)",
                cursor: "default",
                transition: "background 0.25s, box-shadow 0.25s, transform 0.25s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = BG_GRAY;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 18 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.3px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.72, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA — purple gradient
      ════════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, #0369A1 0%, ${PURPLE} 50%, #38BDF8 100%)`,
        padding: isMobile ? "88px 24px" : "128px 48px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Floating orbs */}
        <div style={{
          position: "absolute", top: -100, left: -100,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          animation: "pulse-orb 5s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -80,
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          animation: "pulse-orb 6s ease-in-out infinite 1.5s",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "35%", right: "12%",
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          animation: "pulse-orb 7s ease-in-out infinite 0.8s",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 800, margin: "0 auto",
          textAlign: "center", position: "relative",
        }}>
          <h2 className="reveal" style={{
            fontSize: isMobile ? "clamp(30px, 7vw, 48px)" : "clamp(40px, 5vw, 64px)",
            fontWeight: 800, color: "#fff",
            letterSpacing: isMobile ? "-1px" : "-2px",
            lineHeight: 1.08, marginBottom: 22,
          }}>
            Pronto para transformar seu negócio com IA?
          </h2>
          <p className="reveal" style={{
            fontSize: isMobile ? 16 : 20,
            color: "rgba(255,255,255,0.68)",
            maxWidth: 520, margin: "0 auto 52px", lineHeight: 1.65,
          }}>
            A plataforma brasileira para encontrar, contratar e escalar soluções de IA com suporte em português.
          </p>
          <div className="reveal" style={{
            display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
          }}>
            <a href="/solucoes" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 999, padding: isMobile ? "15px 28px" : "17px 36px",
              background: "#0369A1", color: "#fff",
              fontSize: isMobile ? 15 : 17, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 6px 28px rgba(0,0,0,0.18)",
              transition: "transform 0.15s, background 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0369A1"; e.currentTarget.style.transform = "none"; }}
            >
              Explorar Soluções <Arrow />
            </a>
            <a href="/cadastro?role=criador" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 999, padding: isMobile ? "14px 28px" : "16px 36px",
              background: "transparent", color: "#0369A1",
              fontSize: isMobile ? 15 : 17, fontWeight: 600, textDecoration: "none",
              border: "2px solid #0369A1",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Quero ser Criador
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
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
            <WePromptLogo id="footer" textColor={NEAR_BLACK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
            {[
              ["Termos para Criadores", "/para-criadores/termos"],
              ["Termos para Empresas", "/para-empresas/termos"],
              ["Política de Privacidade", "/privacidade"],
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
