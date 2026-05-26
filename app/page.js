"use client";

import { useState, useEffect } from "react";
import WePromptLogo from "./components/WePromptLogo";
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

const BLUE = "#0369A1";

function DashboardMockup() {
  const sols = [
    { name: "Agente de Vendas WhatsApp", cat: "WhatsApp IA" },
    { name: "Auto Proposta Comercial",   cat: "Automação" },
    { name: "Suporte Inteligente 24h",   cat: "Chatbots" },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
      padding: "28px 24px", width: "100%", maxWidth: 400,
      border: "1px solid rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F56","#FFBD2E","#27C93F"].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>Dashboard WePrompt</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {sols.map(({ name, cat }) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderLeft: "3px solid " + BLUE,
            padding: "10px 14px", borderRadius: "0 10px 10px 0",
            background: "#f0f9ff",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 3 }}>{name}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: BLUE, background: "#e0f2fe", padding: "2px 8px", borderRadius: 99 }}>{cat}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "4px 10px", borderRadius: 99, flexShrink: 0 }}>Ativo ✓</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 4 }}>Receita este mês</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: BLUE }}>R$ 188,00</span>
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
            <polyline points="2,20 12,14 22,16 36,6 46,10" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const width = useWindowSize();
  const isMobile = width < 768;

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
      `}</style>

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
          SECTION 1 — COMO FUNCIONA (steps + mockup)
      ════════════════════════════════════════ */}
      <section id="como-funciona" style={{ background: BG_GRAY, padding: isMobile ? "88px 24px" : "128px 48px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 64 : 96,
          alignItems: "center",
        }}>
          {/* Left: steps */}
          <div className="reveal-left">
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
              Como funciona
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 40px)" : "clamp(28px, 3.5vw, 40px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-1px", lineHeight: 1.12, marginBottom: 48,
            }}>
              Simples de usar, poderoso nos resultados
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {[
                {
                  n: "1",
                  title: "Cadastre-se gratuitamente",
                  desc: "Crie sua conta em menos de 2 minutos. Sem cartão de crédito.",
                },
                {
                  n: "2",
                  title: "Explore e adquira soluções",
                  desc: "Navegue pelo catálogo curado, escolha a solução ideal e ative com 1 clique.",
                },
                {
                  n: "3",
                  title: "Implemente e escale",
                  desc: "Receba suporte em português e coloque sua solução rodando no mesmo dia.",
                },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: BLUE, color: "#fff",
                    fontSize: 24, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 8px 20px rgba(3,105,161,0.28)",
                  }}>{n}</div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="/cadastro" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 44, borderRadius: 999, padding: "14px 32px",
              background: BLUE, color: "#fff",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              transition: "background 0.15s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.transform = "none"; }}
            >
              Começar agora <Arrow />
            </a>
          </div>

          {/* Right: dashboard mockup */}
          <div className="reveal-right" style={{ display: "flex", justifyContent: "center" }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — PARA QUEM É A WEPROMPT
      ════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: isMobile ? "88px 24px" : "120px 48px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 42px)" : "clamp(32px, 4vw, 42px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-1px", lineHeight: 1.1,
            }}>
              Uma plataforma, dois lados
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 24,
          }}>
            {/* Empresas card */}
            <div className="reveal" style={{
              background: "#fff", borderRadius: 20, padding: isMobile ? "32px 28px" : "40px",
              border: "1px solid #e5e7eb",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 24 }}>🏢</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.5px" }}>Para Empresas</h3>
              <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.65, marginBottom: 28 }}>
                Encontre e implemente soluções de IA sem precisar contratar um dev
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {[
                  "Catálogo curado com soluções testadas",
                  "Suporte em português incluído",
                  "Pagamentos em reais via cartão ou PIX",
                  "Garantia de 7 dias em toda compra",
                ].map(b => (
                  <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="12" cy="12" r="11" fill="rgba(3,105,161,0.12)" />
                      <path d="M7 12l3 3 7-7" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 14, color: NEAR_BLACK, lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>
              <a href="/solucoes" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 999, padding: "12px 28px",
                background: BLUE, color: "#fff",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                onMouseLeave={e => e.currentTarget.style.background = BLUE}
              >
                Explorar soluções <Arrow />
              </a>
            </div>

            {/* Criadores card */}
            <div className="reveal" style={{
              background: "#fff", borderRadius: 20, padding: isMobile ? "32px 28px" : "40px",
              border: "1px solid #e5e7eb",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 24 }}>🎨</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.5px" }}>Para Criadores</h3>
              <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.65, marginBottom: 28 }}>
                Monetize suas soluções de IA vendendo para empresas brasileiras
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {[
                  "Publique em menos de 10 minutos",
                  "Receba via PIX automaticamente",
                  "Alcance empresas em todo o Brasil",
                  "1 mês grátis para os 100 primeiros",
                ].map(b => (
                  <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="12" cy="12" r="11" fill="rgba(3,105,161,0.12)" />
                      <path d="M7 12l3 3 7-7" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 14, color: NEAR_BLACK, lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>
              <a href="/criadores" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 999, padding: "12px 28px",
                background: "transparent", color: BLUE,
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                border: "2px solid " + BLUE,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Quero ser criador <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES GRID — gray
      ════════════════════════════════════════ */}
      <section style={{ background: BG_GRAY, padding: isMobile ? "88px 24px" : "120px 48px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Diferenciais
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 42px)" : "clamp(32px, 4vw, 42px)",
              fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-1px", lineHeight: 1.1,
            }}>
              Por que a WePrompt?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
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
                background: "#fff", borderRadius: 20,
                padding: isMobile ? "26px 22px" : "32px 28px",
                border: "1px solid rgba(0,0,0,0.04)",
                cursor: "default",
                transition: "box-shadow 0.25s, transform 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 30, marginBottom: 18 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10, letterSpacing: "-0.3px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.72, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — DEPOIMENTOS (placeholder)
      ════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: isMobile ? "88px 24px" : "120px 48px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Você está no lugar certo
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 42px)" : "clamp(32px, 4vw, 42px)",
              fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
            }}>
              Empresas que já confiam na WePrompt
            </h2>
            <p style={{ fontSize: 16, color: GRAY_TEXT, maxWidth: 540, margin: "0 auto" }}>
              Depoimentos em breve — estamos coletando os primeiros feedbacks dos nossos clientes fundadores.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {[
              { initials: "MC", name: "Maria C.", role: "CEO — Startup Tech" },
              { initials: "JP", name: "João P.", role: "Diretor — Agência Digital" },
              { initials: "AS", name: "Ana S.", role: "Fundadora — E-commerce" },
            ].map(({ initials, name, role }) => (
              <div key={name} className="reveal" style={{
                background: "#fff", borderRadius: 20, padding: "32px",
                border: "2px dashed #e5e7eb", position: "relative", overflow: "hidden",
              }}>
                {/* Card content */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: GRAY_TEXT }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#d1d5db" }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#d1d5db" }}>{role}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, color: "#d1d5db" }}>★</span>)}
                </div>
                <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7 }}>
                  Depoimento em breve...
                </div>
                {/* "Em breve" overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(255,255,255,0.88)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(2px)",
                }}>
                  <span style={{
                    background: BG_GRAY, border: "1.5px solid #e5e7eb",
                    borderRadius: 999, padding: "8px 20px",
                    fontSize: 13, fontWeight: 700, color: GRAY_TEXT,
                  }}>Em breve</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — CENTRAL DE AJUDA (dark navy)
      ════════════════════════════════════════ */}
      <section style={{ background: "#0A0F1E", padding: isMobile ? "88px 24px" : "120px 48px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Precisa de ajuda?
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 42px)" : "clamp(32px, 4vw, 42px)",
              fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 14,
            }}>
              Estamos aqui para te ajudar
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 460, margin: "0 auto" }}>
              Suporte em português para toda dúvida de implementação
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
            {[
              { icon: "🔍", title: "Central de Ajuda", desc: "Tutoriais e guias para usar a plataforma", cta: "Acessar →", href: "mailto:contato@weprompt.app.br" },
              { icon: "❓", title: "Perguntas Frequentes", desc: "As dúvidas mais comuns respondidas", cta: "Ver FAQ →", href: "/precos" },
              { icon: "💬", title: "Fale Conosco", desc: "Tire suas dúvidas por email", cta: "Enviar mensagem →", href: "mailto:contato@weprompt.app.br" },
              { icon: "📄", title: "Termos e Privacidade", desc: "Conheça nossas políticas", cta: "Ler →", href: "/privacidade" },
            ].map(({ icon, title, desc, cta, href }) => (
              <div key={title} className="reveal" style={{
                background: "#fff", borderRadius: 20, padding: isMobile ? "24px 18px" : "28px",
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: isMobile ? 28 : 36, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{desc}</div>
                <a href={href} style={{ fontSize: 13, fontWeight: 700, color: BLUE, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >{cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — SOBRE NÓS
      ════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: isMobile ? "88px 24px" : "120px 48px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 56 : 96,
          alignItems: "center",
        }}>
          {/* Left: text */}
          <div className="reveal-left">
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
              Sobre nós
            </div>
            <h2 style={{
              fontSize: isMobile ? "clamp(26px, 7vw, 38px)" : "clamp(26px, 3vw, 38px)",
              fontWeight: 800, color: NEAR_BLACK,
              letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 28,
            }}>
              Nascemos para democratizar a IA nas empresas brasileiras
            </h2>
            <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8, marginBottom: 18 }}>
              A WePrompt é o primeiro marketplace de soluções de inteligência artificial da América Latina. Nascemos com uma missão clara: tornar a IA acessível para qualquer empresa brasileira, independente do tamanho ou orçamento.
            </p>
            <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8, marginBottom: 18 }}>
              Acreditamos que a inteligência artificial não deve ser privilégio de grandes corporações. Por isso, conectamos criadores talentosos de soluções de IA com empresas que precisam inovar — com suporte em português, pagamentos em reais e sem burocracia.
            </p>
            <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8, marginBottom: 36 }}>
              Nossa visão é ser a maior plataforma de IA do Brasil, onde qualquer empresa encontra a ferramenta certa para crescer, e qualquer criador encontra o mercado para monetizar seu talento.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }}>
              {[
                { icon: "🎯", label: "Missão", value: "Democratizar IA no Brasil" },
                { icon: "👁", label: "Visão", value: "Maior marketplace de IA da América Latina" },
                { icon: "💎", label: "Valores", value: "Simplicidade, confiança e inovação" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: BG_GRAY, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 12, color: GRAY_TEXT, lineHeight: 1.5 }}>{value}</div>
                </div>
              ))}
            </div>

            <a href="/sobre" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 15, fontWeight: 700, color: BLUE, textDecoration: "none",
              transition: "gap 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "12px"}
              onMouseLeave={e => e.currentTarget.style.gap = "8px"}
            >
              Conheça nossa história <Arrow />
            </a>
          </div>

          {/* Right: gradient card */}
          <div className="reveal-right" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, #0369A1 0%, #0891B2 100%)",
              borderRadius: 24, padding: isMobile ? "40px 32px" : "52px 44px",
              width: "100%", maxWidth: 400,
              boxShadow: "0 32px 64px rgba(3,105,161,0.3)",
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 8 }}>WePrompt</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 52 }}>Fundada em 2026</div>

              {[
                { stat: "1º", label: "Marketplace de IA do Brasil" },
                { stat: "100", label: "Vagas de Criador Fundador" },
                { stat: "48h", label: "Para aprovação de soluções" },
              ].map(({ stat, label }) => (
                <div key={label} style={{ borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 20, paddingBottom: 20 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>{stat}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
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
      <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        {/* Main footer columns */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "56px 24px 40px" : "64px 48px 48px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr",
            gap: isMobile ? 40 : 32,
          }}>
            {/* Column 1: Brand */}
            <div>
              <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
                <WePromptLogo id="footer" textColor={NEAR_BLACK} />
              </a>
              <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 260 }}>
                O 1º marketplace de soluções de IA da América Latina. Conectamos empresas aos melhores criadores de IA.
              </p>
              <a href="mailto:contato@weprompt.app.br" style={{ fontSize: 14, color: BLUE, textDecoration: "none", fontWeight: 500 }}>
                contato@weprompt.app.br
              </a>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {/* Instagram */}
                <a href="https://instagram.com/weprompt" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{
                  width: 36, height: 36, borderRadius: 8, background: "#F5F5F7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: GRAY_TEXT, textDecoration: "none", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e5e7eb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5F5F7"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com/company/weprompt" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{
                  width: 36, height: 36, borderRadius: 8, background: "#F5F5F7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: GRAY_TEXT, textDecoration: "none", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e5e7eb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5F5F7"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Plataforma */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                Plataforma
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Explorar Soluções", "/solucoes"],
                  ["Preços", "/precos"],
                  ["Como Funciona", "/#como-funciona"],
                  ["Para Criadores", "/criadores"],
                  ["Cadastrar", "/cadastro"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontSize: 14, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
                      onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Criadores */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                Criadores
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Publicar Solução", "/dashboard/criador"],
                  ["Planos para Criadores", "/precos"],
                  ["Criadores Fundadores", "/criadores"],
                  ["Dashboard", "/dashboard/criador"],
                  ["Termos para Criadores", "/para-criadores/termos"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontSize: 14, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
                      onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Empresas */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                Empresas
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Explorar Catálogo", "/solucoes"],
                  ["Planos para Empresas", "/precos"],
                  ["Dashboard", "/dashboard/empresa"],
                  ["Termos para Empresas", "/para-empresas/termos"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontSize: 14, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
                      onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Ajuda */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                Ajuda
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Central de Ajuda", "/ajuda"],
                  ["Perguntas Frequentes", "/ajuda#faq"],
                  ["Política de Privacidade", "/privacidade"],
                  ["Fale Conosco", "mailto:contato@weprompt.app.br"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontSize: 14, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
                      onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div style={{ borderTop: "1px solid #e5e7eb" }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 24px" : "20px 48px",
            display: "flex", flexDirection: isMobile ? "column" : "row",
            alignItems: "center", justifyContent: "space-between",
            gap: isMobile ? 8 : 0,
            textAlign: isMobile ? "center" : "left",
          }}>
            <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>
              © 2026 WePrompt — O 1º marketplace de soluções de IA da América Latina.
            </p>
            <p style={{ fontSize: 13, color: GRAY_TEXT, margin: 0 }}>
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
