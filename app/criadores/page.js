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
  ["Preços", "/#precos"],
  ["Como funciona", "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

export default function CriadoresPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const width = useWindowSize();
  const isMobile = width < 768;
  const dashboardUrl = getDashboardUrl(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ minHeight: "100vh", color: DARK, background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 30%, #EEF0FF 60%, #F5F0FF 100%)" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="criadores-header" textColor={DARK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} className="nav-link"
                  style={label === "Para Criadores" ? { color: PURPLE, fontWeight: 600 } : {}}
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
                  borderRadius: 999, padding: "9px 20px",
                  fontSize: 14, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    borderRadius: 999, padding: "8px 18px",
                    fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: DARK,
                    border: "1.5px solid rgba(0,0,0,0.14)",
                    background: "transparent",
                  }}>
                    Entrar
                  </a>
                  <a href="/cadastro?role=criador" className="btn-dark" style={{
                    borderRadius: 999, padding: "9px 20px",
                    fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    textDecoration: "none",
                  }}>
                    Começar a criar <Arrow />
                  </a>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 22, color: DARK, padding: "4px 8px",
                display: "flex", alignItems: "center",
              }}
            >
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
                color: DARK, textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>
                {label}
              </a>
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
                  }}>
                    Entrar
                  </a>
                  <a href="/cadastro?role=criador" className="btn-dark" style={{
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

        {/* ── HERO ── */}
        <section style={{ padding: isMobile ? "56px 24px 48px" : "96px 24px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: PURPLE, color: "#fff",
            borderRadius: 999, padding: "5px 14px",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.03em",
            marginBottom: 28,
          }}>
            <span style={{ fontSize: 10 }}>✦</span>
            Programa de Criadores WePrompt
          </div>

          <h1 style={{
            fontSize: isMobile ? 36 : "clamp(36px, 5vw, 60px)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px",
            color: DARK, marginBottom: 24, maxWidth: 720, margin: "0 auto 24px",
          }}>
            Transforme suas soluções de IA em receita recorrente
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.7, color: GRAY,
            maxWidth: 540, margin: "0 auto 40px",
          }}>
            Publique no maior marketplace de IA da América Latina. Alcance mais de 10.000 empresas prontas para pagar pelo que você criou.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/cadastro?role=criador" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: DARK, color: "#fff",
              borderRadius: 999, padding: "14px 30px",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              Começar a criar <Arrow />
            </a>
            <a href="/solucoes" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 999, padding: "14px 30px",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              border: "1.5px solid rgba(0,0,0,0.15)", color: DARK,
            }}>
              Ver o marketplace
            </a>
          </div>

          {/* Social proof strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, marginTop: 40,
          }}>
            <div style={{ display: "flex" }}>
              {["#6B5CE7", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"].map((color, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                  border: "2px solid #fff",
                  marginLeft: i > 0 ? -8 : 0,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 14, color: GRAY }}>
              <strong style={{ color: DARK }}>+180 criadores</strong> já publicaram no WePrompt
            </span>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 16,
          }}>
            {[
              ["R$ 0", "Para publicar"],
              ["10.000+", "Empresas alcançadas"],
              ["0%", "Sem taxa de setup"],
              ["48h", "Curadoria em até"],
            ].map(([num, label]) => (
              <div key={label} style={{
                background: "#fff",
                border: `1px solid ${BORDER}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderRadius: 16, padding: "24px 20px",
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: DARK }}>{num}</div>
                <div style={{ fontSize: 13, color: GRAY, fontWeight: 500, marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS FOR CREATORS ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
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
              Do upload ao primeiro pagamento
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 480, margin: "0 auto" }}>
              Processo simples, curadoria rápida, pagamento garantido.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>
            {[
              {
                step: "01", icon: "📝",
                title: "Crie sua conta",
                desc: "Cadastre-se como Criador em menos de 2 minutos. Sem burocracia, sem mensalidade.",
                features: ["Cadastro gratuito", "Perfil público personalizado", "Dashboard completo"],
              },
              {
                step: "02", icon: "🚀",
                title: "Publique sua solução",
                desc: "Descreva sua solução, defina o preço e envie para curadoria. Nossa equipe analisa em até 48h.",
                features: ["Título e descrição", "Defina preço mensal ou único", "Upload de arquivos e links"],
              },
              {
                step: "03", icon: "💰",
                title: "Comece a receber",
                desc: "Aprovado, sua solução vai ao marketplace. Cada nova assinatura gera receita recorrente para você.",
                features: ["Pagamentos automáticos", "Dashboard de vendas", "Suporte da equipe WePrompt"],
              },
            ].map((card, i) => (
              <div key={card.step} style={{
                background: i === 1 ? DARK : "#fff",
                border: i === 1 ? "none" : `1px solid ${BORDER}`,
                boxShadow: i === 1 ? "0 24px 60px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                borderRadius: 20, padding: "32px 28px",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{card.icon}</div>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                  color: i === 1 ? "rgba(255,255,255,0.4)" : GRAY, marginBottom: 8,
                }}>
                  PASSO {card.step}
                </div>
                <h3 style={{
                  fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px",
                  color: i === 1 ? "#fff" : DARK, marginBottom: 10,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: 14, lineHeight: 1.65, marginBottom: 24,
                  color: i === 1 ? "rgba(255,255,255,0.55)" : GRAY,
                }}>
                  {card.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {card.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Check color={i === 1 ? "#C4B5FD" : PURPLE} />
                      <span style={{ fontSize: 14, color: i === 1 ? "rgba(255,255,255,0.7)" : "#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 8 }}>
              Por que criar no WePrompt?
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 480, margin: "0 auto" }}>
              A plataforma construída para criadores de IA brasileiros.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 16,
          }}>
            {[
              {
                icon: "💸",
                title: "Você define o preço",
                desc: "Cobre por assinatura mensal ou venda única. Você tem controle total sobre o modelo de monetização da sua solução.",
              },
              {
                icon: "🎯",
                title: "Alcance qualificado",
                desc: "Nossas empresas buscam ativamente soluções de IA. Você não precisa fazer marketing — o marketplace trabalha por você.",
              },
              {
                icon: "✅",
                title: "Curadoria que valoriza",
                desc: "Nossa seleção rigorosa significa que soluções aprovadas têm credibilidade. Seu trabalho ganha o peso de uma marca confiável.",
              },
              {
                icon: "🇧🇷",
                title: "Mercado brasileiro",
                desc: "Foco no mercado que você conhece. Suporte em português, pagamentos em reais, comunidade local de criadores.",
              },
              {
                icon: "📊",
                title: "Dashboard completo",
                desc: "Acompanhe assinantes, receita e performance em tempo real. Tome decisões baseadas em dados, não em suposições.",
              },
              {
                icon: "🤝",
                title: "Suporte da equipe",
                desc: "Desde o cadastro até a aprovação e além. Temos uma equipe dedicada para ajudar criadores a crescerem na plataforma.",
              },
            ].map(item => (
              <div key={item.title} style={{
                background: "#fff",
                border: `1px solid ${BORDER}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderRadius: 16,
                padding: "28px 24px",
                display: "flex", gap: 20, alignItems: "flex-start",
              }}>
                <div style={{
                  fontSize: 28, flexShrink: 0,
                  width: 52, height: 52,
                  background: "rgba(107,92,231,0.07)",
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── REVENUE CALCULATOR ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: DARK, borderRadius: 24,
            padding: isMobile ? "40px 24px" : "56px 48px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 36 : 64,
            alignItems: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: `${PURPLE}22`, pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(107,92,231,0.25)", color: "#C4B5FD",
                borderRadius: 999, padding: "4px 12px",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
                marginBottom: 20,
              }}>
                POTENCIAL DE RECEITA
              </span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", marginBottom: 16 }}>
                Calcule o que você pode ganhar
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 0 }}>
                Com apenas 50 empresas assinando sua solução por R$ 97/mês, você gera R$ 4.850 de receita recorrente mensal.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
              {[
                { assinantes: "10 empresas", preco: "R$ 97/mês", total: "R$ 970/mês" },
                { assinantes: "50 empresas", preco: "R$ 97/mês", total: "R$ 4.850/mês", highlight: true },
                { assinantes: "100 empresas", preco: "R$ 97/mês", total: "R$ 9.700/mês" },
              ].map(row => (
                <div key={row.assinantes} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderRadius: 12,
                  background: row.highlight ? PURPLE : "rgba(255,255,255,0.07)",
                  border: row.highlight ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.assinantes}</div>
                    <div style={{ fontSize: 12, color: row.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>{row.preco}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{row.total}</div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, textAlign: "right" }}>
                * valores ilustrativos
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "0 24px 96px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 100%)",
            border: `1px solid ${BORDER}`,
            borderRadius: 24,
            padding: isMobile ? "48px 24px" : "64px 48px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: DARK, letterSpacing: "-0.8px", marginBottom: 16 }}>
              Pronto para publicar sua primeira solução?
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Crie sua conta gratuitamente, envie sua solução e alcance milhares de empresas em menos de 48 horas.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/cadastro?role=criador" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: DARK, color: "#fff",
                borderRadius: 999, padding: "14px 30px",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
              }}>
                Criar minha conta <Arrow />
              </a>
              <a href="mailto:contato@weprompt.app.br" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 999, padding: "14px 30px",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                border: "1.5px solid rgba(0,0,0,0.15)", color: DARK,
              }}>
                Falar com a equipe
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#F3F4F6", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          gap: 16, textAlign: isMobile ? "center" : "left",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="criadores-footer" textColor={DARK} />
          </a>
          <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>
            © 2026 WePrompt. O 1º marketplace de IA da América Latina.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" className="footer-link">Privacidade</a>
            <a href="#" className="footer-link">Termos</a>
            <a href="mailto:contato@weprompt.app.br" className="footer-link">Contato</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
