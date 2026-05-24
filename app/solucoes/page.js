"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

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

const CATEGORIES = ["Todos", "Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços", "#"],
  ["Como funciona", "#"],
  ["Para Criadores", "#"],
];

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

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 16, padding: "24px",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{ width: 80, height: 22, borderRadius: 6, background: "rgba(0,0,0,0.07)", marginBottom: 16 }} />
      <div style={{ width: "70%", height: 20, borderRadius: 6, background: "rgba(0,0,0,0.07)", marginBottom: 10 }} />
      <div style={{ width: "100%", height: 14, borderRadius: 4, background: "rgba(0,0,0,0.05)", marginBottom: 6 }} />
      <div style={{ width: "85%", height: 14, borderRadius: 4, background: "rgba(0,0,0,0.05)", marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 90, height: 18, borderRadius: 4, background: "rgba(0,0,0,0.07)" }} />
        <div style={{ width: 110, height: 36, borderRadius: 8, background: "rgba(0,0,0,0.07)" }} />
      </div>
    </div>
  );
}

function SolutionCard({ solution }) {
  const isOneTime = solution.payment_type === "one_time";
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(107,92,231,0.4)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,92,231,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", paddingTop: "56.25%", flexShrink: 0 }}>
        {solution.cover_url ? (
          <img
            src={solution.cover_url} alt={solution.titulo}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, rgba(107,92,231,0.08) 0%, rgba(139,92,246,0.04) 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 36, opacity: 0.15, color: PURPLE }}>✦</span>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{
          display: "inline-block",
          background: "rgba(107,92,231,0.08)", color: PURPLE,
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
          alignSelf: "flex-start", letterSpacing: "0.2px",
        }}>
          {solution.categoria}
        </span>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: 0, lineHeight: 1.35 }}>
          {solution.titulo}
        </h2>

        <p style={{
          fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.6, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>
              {solution.preco != null
                ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "Gratuito"}
            </span>
            {solution.preco != null && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
                background: isOneTime ? "rgba(22,163,74,0.08)" : "rgba(107,92,231,0.08)",
                color: isOneTime ? "#15803D" : PURPLE,
              }}>
                {isOneTime ? "Único" : "Mensal"}
              </span>
            )}
          </div>
          <a
            href={`/solucoes/${solution.id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
              color: "#fff", padding: "8px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Ver <Arrow />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SolucoesPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
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

  useEffect(() => {
    async function fetchSolutions() {
      const { data, error } = await supabase
        .from("solutions").select("*")
        .eq("ativo", true).eq("status", "approved")
        .order("created_at", { ascending: false });
      if (!error && data) setSolutions(data);
      setLoading(false);
    }
    fetchSolutions();
  }, []);

  const filtered = activeCategory === "Todos" ? solutions : solutions.filter(s => s.categoria === activeCategory);

  return (
    <div style={{ minHeight: "100vh", color: DARK }}>

      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="solucoes-header" textColor={DARK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} className="nav-link"
                  style={label === "Explorar" ? { color: PURPLE, fontWeight: 600 } : {}}
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
                  <a href="/cadastro" className="btn-dark" style={{
                    borderRadius: 999, padding: "9px 20px",
                    fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    textDecoration: "none",
                  }}>
                    Criar conta <Arrow />
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
              <a key={label} href={href}
                onClick={() => setMenuOpen(false)}
                style={{
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
                  flex: 1, textAlign: "center",
                  borderRadius: 999, padding: "11px",
                  fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  textDecoration: "none",
                }}>
                  Meu Dashboard <Arrow />
                </a>
              ) : (
                <>
                  <a href="/login" style={{
                    flex: 1, textAlign: "center",
                    borderRadius: 999, padding: "11px",
                    fontSize: 14, fontWeight: 500,
                    textDecoration: "none", color: DARK,
                    border: "1.5px solid rgba(0,0,0,0.14)",
                  }}>
                    Entrar
                  </a>
                  <a href="/cadastro" className="btn-dark" style={{
                    flex: 1, textAlign: "center",
                    borderRadius: 999, padding: "11px",
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

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Soluções de IA
          </h1>
          <p style={{ fontSize: 16, color: GRAY, margin: 0 }}>
            Descubra ferramentas e agentes de IA prontos para usar no seu negócio.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px", borderRadius: 99, fontFamily: "inherit",
                border: `1.5px solid ${activeCategory === cat ? PURPLE : "rgba(0,0,0,0.12)"}`,
                background: activeCategory === cat ? "rgba(107,92,231,0.08)" : "#fff",
                color: activeCategory === cat ? PURPLE : GRAY,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2, color: PURPLE }}>✦</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 8 }}>
              {activeCategory === "Todos" ? "Nenhuma solução disponível ainda" : `Nenhuma solução em "${activeCategory}"`}
            </h2>
            <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
              {activeCategory === "Todos"
                ? "Em breve teremos soluções incríveis de IA para você explorar."
                : "Tente outra categoria ou explore todas as soluções disponíveis."}
            </p>
            {activeCategory !== "Todos" && (
              <button
                onClick={() => setActiveCategory("Todos")}
                style={{
                  background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                  border: "none", borderRadius: 8, padding: "10px 24px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Ver todas as soluções
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((s, i) => <SolutionCard key={s.id} solution={s} index={i} />)}
          </div>
        )}
      </main>
    </div>
  );
}
