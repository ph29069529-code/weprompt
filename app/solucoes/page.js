"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

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

const CATEGORIES = ["Todos", "Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

const NAV_LINKS = [
  ["Explorar", "/solucoes"],
  ["Preços", "/precos"],
  ["Como funciona", "/#como-funciona"],
  ["Para Criadores", "/criadores"],
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
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ height: 200, background: BG_GRAY }} />
      <div style={{ padding: 20 }}>
        <div style={{ width: 70, height: 20, borderRadius: 99, background: "#e0f2fe", marginBottom: 14 }} />
        <div style={{ width: "80%", height: 20, borderRadius: 6, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
        <div style={{ width: "100%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 6 }} />
        <div style={{ width: "70%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 18 }} />
        <div style={{ width: 80, height: 24, borderRadius: 4, background: "rgba(0,0,0,0.06)", marginBottom: 16 }} />
        <div style={{ width: "100%", height: 42, borderRadius: 12, background: "#e0f2fe" }} />
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
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(3,105,161,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image area */}
      <div style={{ height: 200, flexShrink: 0, overflow: "hidden" }}>
        {solution.cover_url ? (
          <img
            src={solution.cover_url}
            alt={solution.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 40, opacity: 0.25, color: BLUE }}>✦</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Category */}
        <span style={{
          display: "inline-block", alignSelf: "flex-start",
          background: "#e0f2fe", color: BLUE,
          fontSize: 12, fontWeight: 600,
          padding: "3px 10px", borderRadius: 999,
          letterSpacing: "0.01em",
        }}>
          {solution.categoria}
        </span>

        {/* Title */}
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: NEAR_BLACK,
          margin: "12px 0 0", lineHeight: 1.35,
        }}>
          {solution.titulo}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 14, color: GRAY_TEXT,
          margin: "8px 0 0", lineHeight: 1.5, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: BLUE }}>
            {solution.preco != null
              ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Gratuito"}
          </span>
          {solution.preco != null && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: isOneTime ? "rgba(22,163,74,0.1)" : "rgba(3,105,161,0.1)",
              color: isOneTime ? "#15803D" : BLUE,
            }}>
              {isOneTime ? "Único" : "Mensal"}
            </span>
          )}
        </div>

        {/* CTA button */}
        <a
          href={`/solucoes/${solution.id}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: BLUE, color: "#fff",
            borderRadius: 12, padding: "12px",
            marginTop: 16,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
          onMouseLeave={e => e.currentTarget.style.background = BLUE}
        >
          Ver solução <Arrow />
        </a>
      </div>
    </div>
  );
}

export default function SolucoesPage() {
  const [solutions, setSolutions]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [menuOpen, setMenuOpen]           = useState(false);
  const [session, setSession]             = useState(null);
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

  const filtered = activeCategory === "Todos"
    ? solutions
    : solutions.filter(s => s.categoria === activeCategory);

  const cols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <div style={{ minHeight: "100vh", color: NEAR_BLACK, background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
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
            <WePromptLogo id="solucoes-header" textColor={NEAR_BLACK} />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontSize: 14, fontWeight: label === "Explorar" ? 600 : 500,
                  color: label === "Explorar" ? BLUE : GRAY_TEXT,
                  textDecoration: "none", padding: "6px 14px", borderRadius: 8,
                  transition: "color 0.15s, background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = label === "Explorar" ? BLUE : GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}
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
                color: label === "Explorar" ? BLUE : NEAR_BLACK,
                textDecoration: "none",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}>
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  flex: 1, textAlign: "center", borderRadius: 999, padding: "13px",
                  background: BLUE, color: "#fff",
                  fontSize: 14, fontWeight: 600,
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
                    background: BLUE, color: "#fff",
                    fontSize: 14, fontWeight: 600,
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

      {/* ── HEADER SECTION ── */}
      <section style={{
        background: "#fff",
        paddingTop: isMobile ? 104 : 128,
        paddingBottom: isMobile ? 48 : 64,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: BLUE,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18,
          }}>
            Catálogo
          </div>
          <h1 style={{
            fontSize: isMobile ? "clamp(36px, 8vw, 52px)" : "clamp(48px, 6vw, 72px)",
            fontWeight: 800, color: NEAR_BLACK,
            letterSpacing: isMobile ? "-1px" : "-2px",
            lineHeight: 1.06, marginBottom: 20, margin: "0 0 20px",
          }}>
            Soluções de IA
          </h1>
          <p style={{
            fontSize: isMobile ? 16 : 20, color: GRAY_TEXT,
            lineHeight: 1.65, maxWidth: 560, margin: 0,
          }}>
            Descubra ferramentas e agentes de IA curados, prontos para usar no seu negócio — em português.
          </p>
        </div>
      </section>

      {/* ── FILTER + GRID ── */}
      <section style={{
        background: BG_GRAY,
        paddingTop: 0,
        paddingBottom: isMobile ? 72 : 112,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Filter bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            paddingTop: isMobile ? 32 : 48,
            paddingBottom: isMobile ? 32 : 48,
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "9px 20px", borderRadius: 999,
                  fontFamily: "inherit",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeCategory === cat ? BLUE : "#e5e7eb",
                  background: activeCategory === cat ? BLUE : BG_GRAY,
                  color: activeCategory === cat ? "#fff" : GRAY_TEXT,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = "#e0f2fe";
                    e.currentTarget.style.borderColor = "#bae6fd";
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = BG_GRAY;
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: cols, gap: 24 }}>
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "#fff", borderRadius: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.18, color: BLUE }}>✦</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10 }}>
                {activeCategory === "Todos"
                  ? "Nenhuma solução disponível ainda"
                  : `Nenhuma solução em "${activeCategory}"`}
              </h2>
              <p style={{ fontSize: 15, color: GRAY_TEXT, marginBottom: 28, lineHeight: 1.6 }}>
                {activeCategory === "Todos"
                  ? "Em breve teremos soluções incríveis de IA para você explorar."
                  : "Tente outra categoria ou explore todas as soluções disponíveis."}
              </p>
              {activeCategory !== "Todos" && (
                <button
                  onClick={() => setActiveCategory("Todos")}
                  style={{
                    background: BLUE, color: "#fff",
                    border: "none", borderRadius: 12, padding: "12px 28px",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = BLUE}
                >
                  Ver todas as soluções
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: cols, gap: 24 }}>
              {filtered.map(s => <SolutionCard key={s.id} solution={s} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
