import WePromptLogo from "./components/WePromptLogo";

/* ── Shared tokens ── */
const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const CARD_SHADOW = "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ color = PURPLE }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" fill={color + "22"} />
    <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", color: DARK }}>

      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <WePromptLogo id="header" textColor={DARK} />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {["Explorar", "Preços", "Como funciona", "Para Criadores"].map(l => (
              <a key={l} href="#" className="nav-link">{l}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/login" style={{
              borderRadius: 999, padding: "8px 18px",
              fontSize: 14, fontWeight: 500,
              textDecoration: "none", color: DARK,
              border: "1.5px solid rgba(0,0,0,0.14)",
              background: "transparent",
              transition: "background 0.15s",
            }}>
              Entrar
            </a>
            <a href="/cadastro" className="btn-dark" style={{
              borderRadius: 999, padding: "9px 20px",
              fontSize: 14, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none",
            }}>
              Criar conta <Arrow />
            </a>
          </div>
        </div>
      </header>

      <main>

        {/* ══════════════════════════════
            HERO — 2 column
        ══════════════════════════════ */}
        <section style={{ padding: "80px 24px 64px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* LEFT */}
            <div>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: PURPLE, color: "#fff",
                borderRadius: 999, padding: "5px 14px",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.03em",
                marginBottom: 28,
              }}>
                <span style={{ fontSize: 10 }}>✦</span>
                1º Marketplace de IA da América Latina
              </div>

              <h1 style={{
                fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800,
                lineHeight: 1.1, letterSpacing: "-1.5px",
                color: DARK, marginBottom: 20,
              }}>
                Encontre a solução de IA perfeita para o seu negócio
              </h1>

              <p style={{
                fontSize: 17, lineHeight: 1.7,
                color: GRAY, marginBottom: 36, maxWidth: 440,
              }}>
                Curadoria especializada, suporte em português e centenas de soluções prontas para usar — tudo em um só lugar.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <a href="#" className="btn-primary" style={{
                  borderRadius: 999, padding: "13px 26px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                }}>
                  Explorar Soluções <Arrow />
                </a>
                <a href="#" className="btn-outline-gray" style={{
                  borderRadius: 999, padding: "13px 26px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                }}>
                  Quero ser Criador
                </a>
              </div>
            </div>

            {/* RIGHT — mock dashboard card */}
            <div style={{ position: "relative" }}>
              {/* Floating elements */}
              <div style={{ position: "absolute", top: -18, right: -10, width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #7C3AED, #4F46E5)", transform: "rotate(14deg)", zIndex: 1 }} />
              <div style={{ position: "absolute", top: 56, left: -22, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #67E8F9, #3B82F6)", transform: "rotate(-10deg)", zIndex: 1 }} />
              <div style={{ position: "absolute", bottom: 32, right: -14, width: 22, height: 22, borderRadius: 6, background: PURPLE, opacity: 0.7, transform: "rotate(20deg)", zIndex: 1 }} />
              <div style={{ position: "absolute", bottom: -14, left: 24, width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #F59E0B, #EC4899)", transform: "rotate(-6deg)", zIndex: 1 }} />

              {/* Dark dashboard card */}
              <div style={{
                background: DARK, borderRadius: 24, padding: 28,
                boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
                position: "relative", zIndex: 0,
              }}>
                {/* Window chrome */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                  {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                  <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>WePrompt Dashboard</span>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[["500+", "Soluções de IA"], ["180+", "Criadores"]].map(([n, l]) => (
                    <div key={l} style={{
                      background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{n}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Categorias em alta</div>
                  {[["Automação", 78, PURPLE], ["Marketing IA", 62, "#3B82F6"], ["Analytics", 45, "#06B6D4"]].map(([label, pct, color]) => (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini feature pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Agentes IA", "Chatbots", "Análise de dados", "Automação"].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 500,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      borderRadius: 999, padding: "4px 10px",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════
            STATS STRIP
        ══════════════════════════════ */}
        <section style={{ padding: "0 24px 72px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              ["500+", "Soluções de IA"],
              ["180+", "Criadores"],
              ["10.000+", "Empresas"],
              ["98%", "Satisfação"],
            ].map(([num, label]) => (
              <div key={label} className="card" style={{ borderRadius: 16, padding: "24px 28px" }}>
                <div style={{ fontSize: 13, color: GRAY, fontWeight: 500, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: DARK }}>{num}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            FEATURES — BENTO GRID
        ══════════════════════════════ */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: `1px solid ${PURPLE}55`,
              color: PURPLE, fontSize: 12, fontWeight: 600,
              borderRadius: 999, padding: "5px 14px", letterSpacing: "0.05em",
            }}>
              <span>●</span> Funcionalidades
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", marginTop: 16, marginBottom: 0 }}>
              Tudo para você adotar IA com confiança
            </h2>
          </div>

          {/* Bento */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>

            {/* LEFT — tall dark */}
            <div style={{
              background: DARK, borderRadius: 20, padding: 40,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 400,
            }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(107,92,231,0.25)", color: "#C4B5FD",
                  borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 600,
                  marginBottom: 28, letterSpacing: "0.04em",
                }}>
                  PARA CRIADORES
                </div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 16 }}>
                  Para Criadores de IA
                </h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
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
              <a href="#" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: PURPLE, color: "#fff",
                borderRadius: 999, padding: "12px 24px",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                alignSelf: "flex-start",
              }}>
                Começar como Criador <Arrow />
              </a>
            </div>

            {/* RIGHT — stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Top right — white */}
              <div className="card" style={{ borderRadius: 20, padding: 32, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  {/* Avatar cluster */}
                  <div style={{ display: "flex" }}>
                    {["#6B5CE7", "#3B82F6", "#10B981", "#F59E0B"].map((color, i) => (
                      <div key={i} style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                        border: "2px solid #fff",
                        marginLeft: i > 0 ? -10 : 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "#fff", fontWeight: 700,
                      }}>
                        {["A", "B", "C", "D"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>+180 Criadores</div>
                    <div style={{ fontSize: 11, color: GRAY }}>já publicaram no marketplace</div>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: DARK, letterSpacing: "-0.3px", marginBottom: 8 }}>
                  Curadoria Especializada
                </h3>
                <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, margin: 0 }}>
                  Cada solução é revisada e validada pela nossa equipe. Zero ruído, apenas o que realmente funciona para empresas brasileiras.
                </p>
              </div>

              {/* Bottom right — dark purple */}
              <div style={{
                background: "linear-gradient(135deg, #2D1B69 0%, #4F46E5 100%)",
                borderRadius: 20, padding: 32, flex: 1,
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", marginBottom: 8 }}>
                  Suporte em Português
                </h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: 24 }}>
                  Toda a plataforma e suporte técnico em português. Sem barreiras de idioma para adotar IA.
                </p>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["99%", "uptime"], ["&lt;2h", "resposta"], ["PT-BR", "suporte"]].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }} dangerouslySetInnerHTML={{ __html: n }} />
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            HOW IT WORKS — pricing-style cards
        ══════════════════════════════ */}
        <section style={{ padding: "0 24px 96px", maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: `1px solid ${PURPLE}55`,
              color: PURPLE, fontSize: 12, fontWeight: 600,
              borderRadius: 999, padding: "5px 14px", letterSpacing: "0.05em",
            }}>
              <span>●</span> Como funciona
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", marginTop: 16, marginBottom: 8 }}>
              Simples passos para usar IA no seu negócio
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 480, margin: "0 auto" }}>
              Do cadastro à primeira solução rodando, em minutos.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                step: "01", title: "Explore o catálogo",
                sub: "Grátis para começar",
                features: ["Acesso a 500+ soluções", "Filtros por categoria", "Demos gratuitas", "Reviews verificados"],
                cta: "Explorar grátis", highlight: false,
              },
              {
                step: "02", title: "Escolha a solução",
                sub: "Mais popular",
                features: ["Comparativo detalhado", "Suporte da equipe WePrompt", "Documentação em português", "Trial disponível"],
                cta: "Falar com especialista", highlight: true,
              },
              {
                step: "03", title: "Comece a usar",
                sub: "Em produção hoje",
                features: ["Integração simplificada", "Onboarding guiado", "Suporte técnico dedicado", "Dashboard de uso"],
                cta: "Começar agora", highlight: false,
              },
            ].map((card) => (
              <div key={card.step} className={card.highlight ? "" : "card"} style={{
                borderRadius: 20, padding: "32px 28px",
                display: "flex", flexDirection: "column",
                ...(card.highlight ? {
                  background: DARK,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
                } : {}),
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                  color: card.highlight ? "rgba(255,255,255,0.4)" : GRAY,
                  marginBottom: 12,
                }}>
                  PASSO {card.step}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px",
                  color: card.highlight ? "#fff" : DARK,
                  marginBottom: 6,
                }}>
                  {card.title}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  color: card.highlight ? "#C4B5FD" : PURPLE,
                  marginBottom: 28,
                }}>
                  {card.sub}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 28 }}>
                  {card.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Check color={card.highlight ? "#C4B5FD" : PURPLE} />
                      <span style={{ fontSize: 14, color: card.highlight ? "rgba(255,255,255,0.7)" : "#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <a href="#" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  borderRadius: 999, padding: "12px 20px",
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  ...(card.highlight ? {
                    background: PURPLE, color: "#fff",
                  } : {
                    border: `1.5px solid rgba(0,0,0,0.15)`,
                    color: DARK, background: "transparent",
                  }),
                }}>
                  {card.cta} <Arrow />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            CTA BANNER
        ══════════════════════════════ */}
        <section style={{ padding: "0 24px 96px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: DARK, borderRadius: 24, padding: "64px 48px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse 60% 70% at 50% 110%, ${PURPLE}33 0%, transparent 65%)`,
            }} />
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -32, left: -32, width: 120, height: 120, borderRadius: "50%", background: `${PURPLE}18` }} />
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "#4F46E533" }} />

            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16 }}>
                Pronto para transformar seu negócio com IA?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>
                Junte-se a mais de 10.000 empresas que já adotam soluções de IA com suporte em português.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="#" className="btn-primary" style={{
                  borderRadius: 999, padding: "14px 30px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                }}>
                  Começar gratuitamente <Arrow />
                </a>
                <a href="#" style={{
                  borderRadius: 999, padding: "14px 30px",
                  fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                }}>
                  Falar com a equipe
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer style={{ background: "#F3F4F6", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <WePromptLogo id="footer" textColor={DARK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY, margin: 0, textAlign: "center" }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" className="footer-link">Privacidade</a>
            <a href="#" className="footer-link">Termos</a>
            <a href="#" className="footer-link">Contato</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
