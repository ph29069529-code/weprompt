"use client";

import WePromptLogo from "./components/WePromptLogo";

const PURPLE = "#6B5CE7";
const TEXT2 = "rgba(255,255,255,0.6)";
const BORDER = "rgba(255,255,255,0.1)";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ color = "#a78bfa" }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" fill={color + "22"} />
    <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", color: "#fff" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,26,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          padding: "0 48px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="home-header" />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              ["Explorar", "/solucoes"],
              ["Preços", "#"],
              ["Como funciona", "#"],
              ["Para Criadores", "#"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{
                padding: "8px 14px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, color: TEXT2,
                textDecoration: "none", transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <a href="/login" style={{
              borderRadius: 999, padding: "8px 20px",
              fontSize: 14, fontWeight: 500,
              textDecoration: "none", color: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              background: "transparent", transition: "border-color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
            >
              Entrar
            </a>
            <a href="/cadastro" style={{
              borderRadius: 999, padding: "9px 20px",
              fontSize: 14, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none",
              background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(107,92,231,0.4)",
            }}>
              Criar conta <Arrow />
            </a>
          </div>
        </div>
      </header>

      <main>

        {/* ══════════ HERO ══════════ */}
        <section style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center",
          paddingTop: 64,
          padding: "64px 48px 80px",
        }}>
          <div style={{
            width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 80, alignItems: "center",
          }}>

            {/* Left column */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid rgba(107,92,231,0.5)",
                background: "rgba(107,92,231,0.1)",
                color: "#a78bfa",
                borderRadius: 999, padding: "6px 16px",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
                marginBottom: 32,
              }}>
                <span>✦</span>
                1º Marketplace de IA da América Latina
              </div>

              <h1 style={{
                fontSize: 56, fontWeight: 800,
                lineHeight: 1.1, letterSpacing: "-1.5px",
                color: "#fff", margin: "0 0 24px",
              }}>
                Encontre a solução de IA perfeita para o seu negócio
              </h1>

              <p style={{
                fontSize: 18, lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)",
                margin: "0 0 40px", maxWidth: 460,
              }}>
                Curadoria especializada, suporte em português e centenas de soluções prontas para usar — tudo em um só lugar.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <a href="/solucoes" style={{
                  borderRadius: 999, padding: "14px 28px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(107,92,231,0.5)",
                }}>
                  Explorar Soluções <Arrow />
                </a>
                <a href="#" style={{
                  borderRadius: 999, padding: "13px 28px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.85)",
                  background: "transparent",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                >
                  Quero ser Criador
                </a>
              </div>
            </div>

            {/* Right column — dashboard mockup */}
            <div style={{ position: "relative" }}>
              {/* Floating blobs */}
              <div style={{
                position: "absolute", top: -24, right: -16,
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                transform: "rotate(14deg)",
                boxShadow: "0 0 28px rgba(124,58,237,0.65)",
                zIndex: 1,
              }} />
              <div style={{
                position: "absolute", top: 60, left: -28,
                width: 32, height: 32, borderRadius: 10,
                background: "linear-gradient(135deg, #67E8F9, #3B82F6)",
                transform: "rotate(-10deg)",
                boxShadow: "0 0 20px rgba(56,189,248,0.55)",
                zIndex: 1,
              }} />
              <div style={{
                position: "absolute", bottom: 40, right: -18,
                width: 26, height: 26, borderRadius: 8,
                background: "linear-gradient(135deg, #F59E0B, #EC4899)",
                transform: "rotate(20deg)",
                boxShadow: "0 0 18px rgba(245,158,11,0.5)",
                zIndex: 1,
              }} />

              {/* Card */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: 24,
                boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
                position: "relative", zIndex: 0,
              }}>
                {/* Window dots + title */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                  {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                  <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                    WePrompt Dashboard
                  </span>
                </div>

                {/* Metric cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[["500+", "Soluções"], ["180+", "Criadores"]].map(([num, label]) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{num}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Category bars */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 11, color: "rgba(255,255,255,0.35)",
                    marginBottom: 12, fontWeight: 500,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>
                    Categorias em alta
                  </div>
                  {[
                    ["Automação", 78, PURPLE],
                    ["Marketing IA", 62, "#3B82F6"],
                    ["Analytics", 45, "#06B6D4"],
                  ].map(([label, pct, color]) => (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{label}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tag chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Agentes IA", "Chatbots", "Análise de dados", "Automação"].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 500,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.55)",
                      borderRadius: 999, padding: "4px 10px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        <section style={{ padding: "0 48px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              ["500+", "Soluções de IA"],
              ["180+", "Criadores"],
              ["10.000+", "Empresas"],
              ["98%", "Satisfação"],
            ].map(([num, label]) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${BORDER}`,
                borderRadius: 16, padding: "24px 28px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(107,92,231,0.4)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(107,92,231,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 13, color: TEXT2, fontWeight: 500, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: "#fff" }}>{num}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ FEATURES BENTO ══════════ */}
        <section style={{ padding: "0 48px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(107,92,231,0.4)",
              color: "#a78bfa", fontSize: 12, fontWeight: 600,
              borderRadius: 999, padding: "5px 14px", letterSpacing: "0.05em",
            }}>
              <span>●</span> Funcionalidades
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", marginTop: 16, marginBottom: 0, color: "#fff" }}>
              Tudo para você adotar IA com confiança
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>

            <div style={{
              background: "linear-gradient(135deg, rgba(107,92,231,0.2) 0%, rgba(79,70,229,0.15) 100%)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(107,92,231,0.3)",
              borderRadius: 20, padding: 40,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 400,
            }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  background: "rgba(107,92,231,0.3)", color: "#C4B5FD",
                  borderRadius: 999, padding: "4px 12px",
                  fontSize: 11, fontWeight: 600, marginBottom: 28, letterSpacing: "0.04em",
                }}>
                  PARA CRIADORES
                </div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 16 }}>
                  Para Criadores de IA
                </h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
                  Publique suas soluções de IA no maior marketplace da América Latina. Alcance milhares de empresas prontas para comprar.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
                  {["Publique em minutos", "Alcance 10.000+ empresas", "Monetize suas soluções", "Dashboard de analytics"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Check color="#C4B5FD" />
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/cadastro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                borderRadius: 999, padding: "12px 24px", fontSize: 14, fontWeight: 600,
                textDecoration: "none", alignSelf: "flex-start",
                boxShadow: "0 4px 20px rgba(107,92,231,0.4)",
              }}>
                Começar como Criador <Arrow />
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${BORDER}`,
                borderRadius: 20, padding: 32, flex: 1,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex" }}>
                    {["#6B5CE7", "#3B82F6", "#10B981", "#F59E0B"].map((color, i) => (
                      <div key={i} style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                        border: "2px solid rgba(255,255,255,0.15)",
                        marginLeft: i > 0 ? -10 : 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "#fff", fontWeight: 700,
                      }}>
                        {["A", "B", "C", "D"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>+180 Criadores</div>
                    <div style={{ fontSize: 11, color: TEXT2 }}>já publicaram no marketplace</div>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", marginBottom: 8 }}>
                  Curadoria Especializada
                </h3>
                <p style={{ fontSize: 14, color: TEXT2, lineHeight: 1.65, margin: 0 }}>
                  Cada solução é revisada e validada pela nossa equipe. Zero ruído, apenas o que realmente funciona para empresas brasileiras.
                </p>
              </div>

              <div style={{
                background: "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(107,92,231,0.2) 100%)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(107,92,231,0.3)",
                borderRadius: 20, padding: 32, flex: 1,
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", marginBottom: 8 }}>
                  Suporte em Português
                </h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: 24 }}>
                  Toda a plataforma e suporte técnico em português. Sem barreiras de idioma para adotar IA.
                </p>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["99%", "uptime"], ["<2h", "resposta"], ["PT-BR", "suporte"]].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{n}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section style={{ padding: "0 48px 96px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(107,92,231,0.4)",
              color: "#a78bfa", fontSize: 12, fontWeight: 600,
              borderRadius: 999, padding: "5px 14px", letterSpacing: "0.05em",
            }}>
              <span>●</span> Como funciona
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", marginTop: 16, marginBottom: 8, color: "#fff" }}>
              Simples passos para usar IA no seu negócio
            </h2>
            <p style={{ fontSize: 16, color: TEXT2, maxWidth: 480, margin: "0 auto" }}>
              Do cadastro à primeira solução rodando, em minutos.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { step: "01", title: "Explore o catálogo", sub: "Grátis para começar", features: ["Acesso a 500+ soluções", "Filtros por categoria", "Demos gratuitas", "Reviews verificados"], cta: "Explorar grátis", highlight: false },
              { step: "02", title: "Escolha a solução", sub: "Mais popular", features: ["Comparativo detalhado", "Suporte da equipe WePrompt", "Documentação em português", "Trial disponível"], cta: "Falar com especialista", highlight: true },
              { step: "03", title: "Comece a usar", sub: "Em produção hoje", features: ["Integração simplificada", "Onboarding guiado", "Suporte técnico dedicado", "Dashboard de uso"], cta: "Começar agora", highlight: false },
            ].map((card) => (
              <div key={card.step} style={{
                borderRadius: 20, padding: "32px 28px",
                display: "flex", flexDirection: "column",
                ...(card.highlight ? {
                  background: "linear-gradient(135deg, rgba(107,92,231,0.35), rgba(79,70,229,0.25))",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(107,92,231,0.5)",
                  boxShadow: "0 0 40px rgba(107,92,231,0.2)",
                } : {
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                  border: `1px solid ${BORDER}`,
                }),
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  PASSO {card.step}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", color: "#fff", marginBottom: 6 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: card.highlight ? "#C4B5FD" : "#a78bfa", marginBottom: 28 }}>
                  {card.sub}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 28 }}>
                  {card.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Check color={card.highlight ? "#C4B5FD" : "#a78bfa"} />
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="/solucoes" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  borderRadius: 999, padding: "12px 20px",
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  ...(card.highlight ? {
                    background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                    boxShadow: "0 4px 16px rgba(107,92,231,0.5)",
                  } : {
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)", background: "transparent",
                  }),
                }}>
                  {card.cta} <Arrow />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <section style={{ padding: "0 48px 96px" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(107,92,231,0.25), rgba(79,70,229,0.15))",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(107,92,231,0.35)",
            borderRadius: 24, padding: "64px 48px",
            textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: "0 0 80px rgba(107,92,231,0.15)",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 60% 70% at 50% 110%, rgba(107,92,231,0.3) 0%, transparent 65%)",
            }} />
            <div style={{ position: "absolute", top: -32, left: -32, width: 120, height: 120, borderRadius: "50%", background: "rgba(107,92,231,0.15)" }} />
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(79,70,229,0.15)" }} />

            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16 }}>
                Pronto para transformar seu negócio com IA?
              </h2>
              <p style={{ fontSize: 16, color: TEXT2, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>
                Junte-se a mais de 10.000 empresas que já adotam soluções de IA com suporte em português.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/cadastro" style={{
                  borderRadius: 999, padding: "14px 30px", fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                  background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                  boxShadow: "0 4px 24px rgba(107,92,231,0.5)",
                }}>
                  Começar gratuitamente <Arrow />
                </a>
                <a href="#" style={{
                  borderRadius: 999, padding: "14px 30px", fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
                }}>
                  Falar com a equipe
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        background: "rgba(255,255,255,0.03)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "40px 48px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="footer" />
          </a>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0, textAlign: "center" }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacidade", "Termos", "Contato"].map(label => (
              <a key={label} href="#" style={{
                fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
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
