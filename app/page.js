"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

/* ─── Design tokens ──────────────────────────────────────────────── */
const BLUE      = "#2563EB";
const DARK      = "#0F172A";
const TEXT      = "#1E293B";
const MUTED     = "#64748B";
const BG        = "#F8FAFC";
const WHITE     = "#FFFFFF";
const ACCENT    = "#3B82F6";
const BORDER    = "#e2e8f0";
const CARD_R    = 20;
const SHADOW    = "0 4px 24px rgba(0,0,0,0.08)";

/* ─── Hooks ──────────────────────────────────────────────────────── */
function useWindowSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

/* ─── Tiny helpers ───────────────────────────────────────────────── */
const FooterLink = ({ href, children }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{ fontSize: 14, color: hov ? WHITE : "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.15s", display: "block", marginBottom: 10 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
};

/* ─── Inline Navbar ──────────────────────────────────────────────── */
function PageNavbar({ session, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardUrl = session?.user?.user_metadata?.tipo === "criador"
    ? "/dashboard/criador"
    : session?.user?.user_metadata?.tipo === "empresa"
    ? "/dashboard/empresa"
    : "/dashboard/admin";

  const NAV_CENTER = [
    { label: "Explorar",    href: "/solucoes" },
    { label: "Soluções ▾", href: "/solucoes" },
    { label: "Empresa ▾",  href: "/para-empresas/termos" },
  ];

  const NavCenterLink = ({ href, children }) => {
    const [h, setH] = useState(false);
    return (
      <a href={href} style={{
        fontSize: 14, fontWeight: 500,
        color: h ? "#111827" : "#374151",
        textDecoration: "none", whiteSpace: "nowrap",
        transition: "color 0.15s",
      }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
      >{children}</a>
    );
  };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
        height: 64, display: "flex", alignItems: "center",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24,
        }}>
          {/* Left: logo */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo-light.png" style={{ height: 32, width: "auto", objectFit: "contain", display: "block" }} alt="WePrompt" />
          </a>

          {/* Center: nav links */}
          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {NAV_CENTER.map(({ label, href }) => (
                <NavCenterLink key={label} href={href}>{label}</NavCenterLink>
              ))}
            </nav>
          )}

          {/* Right: actions */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  background: "#111827", color: "#fff", borderRadius: 999,
                  padding: "10px 20px", fontSize: 14, fontWeight: 600,
                  textDecoration: "none", whiteSpace: "nowrap",
                }}>
                  Meu Dashboard →
                </a>
              ) : (
                <>
                  <a href="/login" style={{ fontSize: 14, color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
                    Falar conosco
                  </a>
                  <a href="/cadastro" style={{
                    background: "#111827", color: "#fff", borderRadius: 999,
                    padding: "10px 20px", fontSize: 14, fontWeight: 600,
                    textDecoration: "none", whiteSpace: "nowrap",
                  }}>
                    Começar grátis
                  </a>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              aria-label="Abrir menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "#fff",
          display: "flex", flexDirection: "column", padding: "0 24px",
        }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <img src="/logo-light.png" style={{ height: 32, width: "auto", objectFit: "contain", display: "block" }} alt="WePrompt" />
            </a>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
            {[
              { label: "Explorar",          href: "/solucoes" },
              { label: "Soluções",          href: "/solucoes" },
              { label: "Para Empresas",     href: "/para-empresas/termos" },
              { label: "Para Criadores",    href: "/criadores" },
              { label: "Preços",            href: "/precos" },
            ].map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                fontSize: 18, fontWeight: 600, color: "#111827", textDecoration: "none",
                padding: "14px 0", borderBottom: "1px solid #f1f5f9",
              }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            {session ? (
              <a href={dashboardUrl} style={{
                background: "#111827", color: "#fff", borderRadius: 12,
                padding: "14px 24px", fontSize: 15, fontWeight: 700,
                textDecoration: "none", textAlign: "center",
              }}>Meu Dashboard →</a>
            ) : (
              <>
                <a href="/login" style={{
                  border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 600,
                  textDecoration: "none", textAlign: "center",
                }}>Falar conosco</a>
                <a href="/cadastro" style={{
                  background: "#111827", color: "#fff", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", textAlign: "center",
                }}>Começar grátis</a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero side panel (animated circle grid) ────────────────────── */
const SIDE_ICONS = [
  { emoji: "📄", bg: "#4285F4", top: "8%",  left: "18%", dur: "3.8s", delay: "0s"    },
  { emoji: "📊", bg: "#1D6F42", top: "22%", left: "55%", dur: "5.1s", delay: "0.6s"  },
  { emoji: "🎨", bg: "#A259FF", top: "38%", left: "8%",  dur: "4.2s", delay: "1.1s"  },
  { emoji: "💬", bg: "#611F69", top: "52%", left: "62%", dur: "3.5s", delay: "0.3s"  },
  { emoji: "📧", bg: "#EA4335", top: "66%", left: "28%", dur: "4.9s", delay: "1.4s"  },
  { emoji: "📅", bg: "#1967D2", top: "80%", left: "70%", dur: "3.2s", delay: "0.8s"  },
  { emoji: "🤖", bg: "#F97316", top: "15%", left: "75%", dur: "5.5s", delay: "0.2s"  },
  { emoji: "⚡", bg: "#FF6900", top: "72%", left: "5%",  dur: "4.0s", delay: "1.8s"  },
];

function HeroSidePanel({ side, isMobile }) {
  if (isMobile) return null;
  const cols = 5;
  const circleSize = 44;
  const gap = 14;
  const pad = 20;
  const circles = Array.from({ length: cols * 14 });

  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0,
      [side]: 0, width: 280,
      overflow: "hidden", pointerEvents: "none",
    }}>
      {/* Fade mask toward center */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: side === "left"
          ? "linear-gradient(to right, transparent 60%, #fff 100%)"
          : "linear-gradient(to left, transparent 60%, #fff 100%)",
      }} />
      {/* Top + bottom fades */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(to bottom, #fff 0%, transparent 12%, transparent 88%, #fff 100%)",
      }} />

      {/* Circle grid */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${circleSize}px)`,
        gap,
        padding: pad,
      }}>
        {circles.map((_, i) => (
          <div key={i} style={{
            width: circleSize, height: circleSize, borderRadius: "50%",
            background: "#f1f5f9", flexShrink: 0,
          }} />
        ))}
      </div>

      {/* Floating app icons */}
      {SIDE_ICONS.map(({ emoji, bg, top, left, dur, delay }) => (
        <div key={emoji + top} style={{
          position: "absolute", top, left,
          width: circleSize, height: circleSize,
          borderRadius: 12,
          background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          animation: `heroFloat ${dur} ease-in-out infinite`,
          animationDelay: delay,
          zIndex: 3,
        }}>
          {emoji}
        </div>
      ))}
    </div>
  );
}

/* ─── Right-side role labels ─────────────────────────────────────── */
const ROLE_LABELS = [
  { top: "15%", label: "Empresa",     initials: "E", color: "#F97316" },
  { top: "30%", label: "Criador",     initials: "C", color: "#8B5CF6" },
  { top: "55%", label: "Fundador",    initials: "F", color: "#10B981" },
  { top: "70%", label: "Empresa PME", initials: "P", color: "#3B82F6" },
];

/* ─── Category card ─────────────────────────────────────────────── */
function CategoryCard({ name, icon, color, count, slug }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={`/solucoes?categoria=${slug || name}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        background: WHITE,
        borderRadius: CARD_R,
        overflow: "hidden",
        cursor: "pointer",
        transform: hov ? "scale(1.02)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.14)" : SHADOW,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}>
        {/* Top gradient */}
        <div style={{
          height: 140,
          background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 8,
        }}>
          <span style={{ fontSize: 48 }}>{icon}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: WHITE }}>{name}</span>
        </div>
        {/* Bottom */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
            {count === null ? "Em breve" : count === 0 ? "Nenhuma solução ainda" : count === 1 ? "1 solução disponível" : `${count} soluções disponíveis`}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Explorar →</span>
        </div>
      </div>
    </a>
  );
}

/* ─── Step card ─────────────────────────────────────────────────── */
function StepCard({ num, icon, title, desc }) {
  return (
    <div style={{
      background: WHITE,
      borderRadius: CARD_R,
      padding: 32,
      border: `1px solid ${BORDER}`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 16, right: 20,
        fontSize: 56, fontWeight: 900, color: "#EFF6FF",
        lineHeight: 1, userSelect: "none",
      }}>{num}</div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: BLUE,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 20,
      }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function Home() {
  const width = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data?.session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      const { data: cats } = await supabase.from("categories").select("*").order("nome");
      if (!cats || cats.length === 0) { setCategories([]); return; }
      const withCounts = await Promise.all(cats.map(async (cat) => {
        const { count } = await supabase
          .from("solutions")
          .select("id", { count: "exact", head: true })
          .eq("categoria", cat.nome)
          .eq("status", "ativo");
        return { ...cat, count: count ?? 0 };
      }));
      setCategories(withCounts);
    }
    loadCategories();
  }, []);

  const PLACEHOLDER_CATS = [
    { nome: "Agentes de IA",    icone: "🤖", cor: "#2563EB", slug: "agentes-ia",     count: null },
    { nome: "Automação",        icone: "⚡", cor: "#7C3AED", slug: "automacao",       count: null },
    { nome: "Chatbots",         icone: "💬", cor: "#059669", slug: "chatbots",        count: null },
    { nome: "Marketing IA",     icone: "📈", cor: "#D97706", slug: "marketing-ia",    count: null },
    { nome: "Análise de Dados", icone: "📊", cor: "#DC2626", slug: "analise-dados",   count: null },
    { nome: "WhatsApp IA",      icone: "📱", cor: "#0891B2", slug: "whatsapp-ia",     count: null },
  ];

  const displayCats = (categories && categories.length > 0) ? categories : PLACEHOLDER_CATS;

  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/solucoes?busca=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  const HERO_TAGS = [
    "Atendimento IA", "Automação de E-mails", "Redes Sociais",
    "Geração de Leads", "Análise de Dados", "WhatsApp IA", "Chatbots",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: TEXT, background: WHITE }}>

      {/* ════════════════════════════════════
          SECTION 1 — NAVBAR
      ════════════════════════════════════ */}
      <PageNavbar session={session} isMobile={isMobile} />

      {/* ════════════════════════════════════
          SECTION 2 — HERO
      ════════════════════════════════════ */}
      <section style={{
        position: "relative", background: "#fff",
        minHeight: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Keyframes */}
        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
        `}</style>

        {/* Left side panel */}
        <HeroSidePanel side="left" isMobile={isMobile} />

        {/* Right side panel */}
        {!isMobile && (
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 280, overflow: "hidden", pointerEvents: "none" }}>
            {/* Fade masks */}
            <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to left, transparent 60%, #fff 100%)" }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to bottom, #fff 0%, transparent 12%, transparent 88%, #fff 100%)" }} />
            {/* Circle grid */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              display: "grid", gridTemplateColumns: "repeat(5, 44px)", gap: 14, padding: 20,
            }}>
              {Array.from({ length: 70 }).map((_, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9" }} />
              ))}
            </div>
            {/* Floating icons */}
            {SIDE_ICONS.map(({ emoji, bg, top, left, dur, delay }) => (
              <div key={emoji + "r"} style={{
                position: "absolute", top, left,
                width: 44, height: 44, borderRadius: 12,
                background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                animation: `heroFloat ${dur} ease-in-out infinite`,
                animationDelay: delay, zIndex: 3,
              }}>{emoji}</div>
            ))}
            {/* Role labels */}
            {ROLE_LABELS.map(({ top, label, initials, color }) => (
              <div key={label} style={{
                position: "absolute", top, right: 8, zIndex: 4,
                display: "flex", alignItems: "center", gap: 8,
                pointerEvents: "none",
              }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff",
                  flexShrink: 0,
                }}>{initials}</div>
              </div>
            ))}
          </div>
        )}

        {/* Center content */}
        <div style={{
          position: "relative", zIndex: 10,
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: isMobile ? "72px 24px 64px" : "120px 32px 80px",
          maxWidth: 760, margin: "0 auto", width: "100%",
        }}>
          {/* H1 */}
          <h1 style={{
            fontSize: isMobile ? 40 : 64,
            fontWeight: 900, color: "#111827",
            lineHeight: 1.05, letterSpacing: "-2px",
            margin: 0,
          }}>
            Encontre Soluções de IA
          </h1>
          <h1 style={{
            fontSize: isMobile ? 40 : 64,
            fontWeight: 900, color: "#111827",
            lineHeight: 1.05, letterSpacing: "-2px",
            margin: "0 0 4px",
          }}>
            Para o Seu Negócio com
          </h1>
          {/* Inline gradient badge */}
          <h1 style={{
            fontSize: isMobile ? 40 : 64,
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-2px", margin: "0 0 24px",
          }}>
            <span style={{
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              borderRadius: 999,
              padding: isMobile ? "2px 20px" : "4px 28px",
              color: "#fff",
              display: "inline-block",
            }}>
              IA Curada
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: "#6b7280", lineHeight: 1.65,
            margin: "0 0 40px", maxWidth: 540,
          }}>
            Cada solução foi testada e aprovada antes de chegar até você. Implemente com confiança, suporte em português.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            width: "100%", maxWidth: 680, margin: "0 auto 24px",
          }}>
            <div style={{
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: 16,
              padding: "14px 16px 14px 20px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar soluções de IA para o seu negócio..."
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 16, color: "#111827",
                  background: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  minWidth: 0,
                }}
              />
              <button type="submit" style={{
                background: "#111827", color: "#fff",
                borderRadius: 10, padding: "8px 16px",
                border: "none", cursor: "pointer",
                fontSize: 18, lineHeight: 1, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                ↑
              </button>
            </div>
          </form>

          {/* Category tags */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10,
            justifyContent: "center",
          }}>
            {HERO_TAGS.map(tag => (
              <a
                key={tag}
                href={`/solucoes?busca=${encodeURIComponent(tag)}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 14, color: "#374151",
                  background: "#fff",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — CATEGORIAS
      ════════════════════════════════════ */}
      <section style={{ background: BG, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "340px 1fr",
            gap: isTablet ? 40 : 64,
            alignItems: "start",
          }}>
            {/* Left sticky */}
            <div style={{ position: isTablet ? "static" : "sticky", top: 80 }}>
              <div style={{
                display: "inline-block",
                background: "#EFF6FF", color: BLUE, borderRadius: 999,
                padding: "5px 14px", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
              }}>
                Nossas Soluções
              </div>
              <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: DARK, lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Soluções de IA Para Cada Necessidade
              </h2>
              <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: BLUE, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Do Seu Negócio
              </span>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, margin: "16px 0 28px", maxWidth: 300 }}>
                Trabalhamos com criadores talentosos para trazer as melhores ferramentas de IA ao mercado brasileiro.
              </p>
              <a href="/solucoes" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: `1.5px solid ${BLUE}`, color: BLUE, borderRadius: 12,
                padding: "12px 24px", fontSize: 14, fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = WHITE; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BLUE; }}
              >
                Ver todas as soluções →
              </a>
            </div>

            {/* Right: category grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 20,
            }}>
              {displayCats.map((cat) => (
                <CategoryCard
                  key={cat.nome}
                  name={cat.nome}
                  icon={cat.icone || "🔮"}
                  color={cat.cor || BLUE}
                  count={cat.count ?? null}
                  slug={cat.slug || cat.nome}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 4 — COMO FUNCIONA
      ════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block",
              background: "#EFF6FF", color: BLUE, borderRadius: 999,
              padding: "5px 14px", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Como Funciona
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: DARK, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Simples de Usar,
            </h2>
            <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: BLUE, margin: 0, letterSpacing: "-0.02em" }}>
              Poderoso nos Resultados
            </h2>
          </div>

          {/* Steps */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 24,
          }}>
            <StepCard
              num="01"
              icon="🔍"
              title="Explore o catálogo"
              desc="Navegue por centenas de soluções de IA organizadas por categoria e necessidade."
            />
            <StepCard
              num="02"
              icon="⚡"
              title="Adquira com 1 clique"
              desc="Pagamento seguro em reais via cartão ou PIX. Acesso imediato após confirmação."
            />
            <StepCard
              num="03"
              icon="🚀"
              title="Implemente e escale"
              desc="Suporte em português incluído. Coloque sua solução rodando no mesmo dia."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 5 — SOBRE NÓS
      ════════════════════════════════════ */}
      <section id="sobre" style={{ background: DARK, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 48 : 64,
            alignItems: "center",
          }}>
            {/* Left: text */}
            <div>
              <div style={{
                display: "inline-block",
                background: "rgba(59,130,246,0.2)", color: ACCENT, borderRadius: 999,
                padding: "5px 14px", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24,
              }}>
                Sobre Nós
              </div>
              <h2 style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800, color: WHITE, lineHeight: 1.15, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Feitos Para Quem Cria.
              </h2>
              <h2 style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800, color: ACCENT, lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.02em" }}>
                E Para Quem Precisa Crescer.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 16px" }}>
                A WePrompt nasceu com um propósito simples: conectar criadores talentosos de soluções de IA com empresas que precisam de ferramentas que realmente funcionam.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 16px" }}>
                Para as empresas, cada solução dentro da WePrompt passou por uma curadoria especializada e foi testada antes de chegar até você. Aqui você não arrisca — você simplesmente escolhe, adquire e implementa com confiança.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 32px" }}>
                Para os criadores, a WePrompt é o espaço construído 100% para vocês. Um lugar onde suas soluções chegam a milhares de empresas, onde você faz dinheiro de verdade e onde o crescimento da plataforma é o seu crescimento.
              </p>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
                {[
                  { icon: "🏢", title: "PMEs atendidas",  sub: "Crescendo todo dia" },
                  { icon: "✅", title: "Curadoria 100%",  sub: "Toda solução é testada" },
                  { icon: "🌎", title: "América Latina",  sub: "Nossa visão de alcance" },
                ].map(({ icon, title, sub }) => (
                  <div key={title} style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "20px 18px",
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dark card */}
            <div style={{
              background: "#1E293B",
              borderRadius: 24,
              padding: isMobile ? "32px 24px" : "40px",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: WHITE, marginBottom: 28, letterSpacing: "-0.02em" }}>Nossa Missão</div>

              {[
                "✅ Soluções 100% testadas e aprovadas",
                "🎯 Espaço feito para criadores venderem",
                "🌎 A maior plataforma de IA da América Latina",
              ].map((item, i) => (
                <div key={item} style={{
                  padding: "18px 0",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  fontSize: 15, fontWeight: 600, color: WHITE,
                }}>
                  {item}
                </div>
              ))}

              <a href="/cadastro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: WHITE, color: BLUE,
                borderRadius: 12, padding: "12px 24px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                marginTop: 28,
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Fazer parte da história →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 6 — CTA FINAL
      ════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
        padding: isMobile ? "72px 24px" : "80px 48px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: WHITE, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Pronto Para Transformar Seu Negócio Com IA?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 36px" }}>
            Junte-se às empresas que já descobriram o poder das soluções de IA da WePrompt.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <a href="/solucoes" style={{
              background: WHITE, color: BLUE, borderRadius: 12,
              padding: "14px 28px", fontSize: 15, fontWeight: 700,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Explorar Soluções →
            </a>
            <a href="/cadastro" style={{
              background: "transparent", border: "1.5px solid rgba(255,255,255,0.5)", color: WHITE,
              borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = WHITE}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"}
            >
              Quero ser Criador
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 7 — FOOTER
      ════════════════════════════════════ */}
      <footer style={{ background: DARK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "56px 24px 40px" : "64px 48px 48px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
            gap: isMobile ? 40 : 40,
          }}>
            {/* Col 1: Brand */}
            <div>
              <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: 16 }}>
                <img src="/logo-dark.png" height={36} style={{ height: 36, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }} alt="WePrompt" />
              </a>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 240 }}>
                O 1º marketplace de soluções de IA da América Latina.
              </p>
              <a href="mailto:contato@weprompt.app.br" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>
                contato@weprompt.app.br
              </a>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {[
                  { label: "Instagram", href: "https://instagram.com/weprompt", icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  )},
                  { label: "LinkedIn", href: "https://linkedin.com/company/weprompt", icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )},
                ].map(({ label, href, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,0.5)", textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = WHITE; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Plataforma */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Plataforma
              </h4>
              <FooterLink href="/solucoes">Explorar</FooterLink>
              <FooterLink href="/precos">Preços</FooterLink>
              <FooterLink href="/#como-funciona">Como Funciona</FooterLink>
              <FooterLink href="/criadores">Para Criadores</FooterLink>
              <FooterLink href="/cadastro">Cadastrar</FooterLink>
            </div>

            {/* Col 3: Criadores */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Criadores
              </h4>
              <FooterLink href="/dashboard/criador">Publicar Solução</FooterLink>
              <FooterLink href="/precos">Planos</FooterLink>
              <FooterLink href="/criadores">Fundadores</FooterLink>
              <FooterLink href="/dashboard/criador">Dashboard</FooterLink>
              <FooterLink href="/para-criadores/termos">Termos</FooterLink>
            </div>

            {/* Col 4: Ajuda */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Ajuda
              </h4>
              <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
              <FooterLink href="/ajuda#faq">FAQ</FooterLink>
              <FooterLink href="/privacidade">Privacidade</FooterLink>
              <FooterLink href="mailto:contato@weprompt.app.br">Contato</FooterLink>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 48, paddingTop: 24, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 8 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              © 2026 WePrompt — O 1º marketplace de soluções de IA da América Latina.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
