"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role  = session.user.user_metadata?.role;
  const email = session.user.email;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const NAV_LINKS = [
  ["Explorar",       "/solucoes"],
  ["Preços",         "/precos"],
  ["Como funciona",  "/#como-funciona"],
  ["Para Criadores", "/criadores"],
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

function initials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function Stars({ rating = 5, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#F59E0B" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ isMobile }) {
  const [session, setSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const dashboardUrl = getDashboardUrl(session);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <WePromptLogo id="criador-header" textColor={NEAR_BLACK} />
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: GRAY_TEXT, textDecoration: "none", padding: "6px 14px", borderRadius: 8, transition: "color 0.15s, background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = NEAR_BLACK; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = GRAY_TEXT; e.currentTarget.style.background = "transparent"; }}>
                {label}
              </a>
            ))}
          </nav>
        )}

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {session ? (
              <a href={dashboardUrl} style={{ borderRadius: 999, padding: "9px 22px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE, border: `2px solid ${BLUE}`, background: "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  Entrar
                </a>
                <a href="/cadastro" style={{ borderRadius: 999, padding: "9px 22px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
                  Criar conta <Arrow />
                </a>
              </>
            )}
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NEAR_BLACK, padding: "4px 8px", display: "flex", alignItems: "center" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "12px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: "13px 4px", fontSize: 17, fontWeight: 500, color: NEAR_BLACK, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {session ? (
              <a href={dashboardUrl} style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: BLUE, border: `2px solid ${BLUE}` }}>Entrar</a>
                <a href="/cadastro" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>Criar conta <Arrow /></a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Solution Card (matches /solucoes page style) ── */
function SolutionCard({ solution, isMobile }) {
  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Grátis";
  const isOneTime = solution.payment_type === "one_time";

  return (
    <a href={`/solucoes/${solution.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(3,105,161,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>

      {/* Cover image */}
      <div style={{ width: "100%", height: 180, background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {solution.cover_url
          ? <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 32, color: BLUE, opacity: 0.2 }}>✦</span>}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ display: "inline-block", background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, marginBottom: 10, alignSelf: "flex-start" }}>
          {solution.categoria}
        </span>
        <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, lineHeight: 1.35, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {solution.titulo}
        </div>
        {solution.descricao && (
          <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
            {solution.descricao}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: BLUE, letterSpacing: "-0.5px" }}>{priceLabel}</div>
            {solution.preco != null && (
              <div style={{ fontSize: 11, color: GRAY_TEXT, marginTop: 1 }}>{isOneTime ? "pagamento único" : "por mês"}</div>
            )}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#e0f2fe", color: BLUE, fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10 }}>
            Ver solução <Arrow />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Skeleton ── */
function Skeleton({ isMobile }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "88px 16px 60px" : "96px 32px 80px" }}>
      <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
      <div style={{ animation: "shimmer 1.5s ease-in-out infinite" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px", marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e0f2fe" }} />
          <div style={{ width: 200, height: 32, borderRadius: 8, background: "#e5e7eb" }} />
          <div style={{ width: 140, height: 20, borderRadius: 99, background: "#e5e7eb" }} />
          <div style={{ width: "60%", height: 14, borderRadius: 4, background: "#e5e7eb" }} />
          <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 28, borderRadius: 6, background: "#e5e7eb", marginBottom: 6 }} />
                <div style={{ width: 80, height: 12, borderRadius: 4, background: "#e0f2fe" }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ background: "#fff", borderRadius: 20, height: 280 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CREATOR PROFILE
══════════════════════════════════════════ */
function CreatorProfile({ isMobile }) {
  const { id } = useParams();
  const [creator, setCreator]         = useState(null);
  const [solutions, setSolutions]     = useState([]);
  const [avgRating, setAvgRating]     = useState(null);
  const [totalSales, setTotalSales]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    if (!id) return;
    async function init() {
      const [profileRes, solutionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("solutions").select("id, titulo, preco, categoria, cover_url, payment_type, descricao, ativo, status").eq("creator_id", id).eq("status", "approved").eq("ativo", true),
      ]);

      if (profileRes.error || !profileRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCreator(profileRes.data);
      const sols = solutionsRes.data || [];
      setSolutions(sols);

      if (sols.length > 0) {
        const solutionIds = sols.map(s => s.id);

        const [reviewsRes, salesRes] = await Promise.all([
          supabase.from("reviews").select("rating").in("solution_id", solutionIds),
          supabase.from("subscriptions").select("id", { count: "exact", head: true }).in("solution_id", solutionIds),
        ]);

        if (reviewsRes.data && reviewsRes.data.length > 0) {
          const avg = reviewsRes.data.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsRes.data.length;
          setAvgRating(avg);
        }

        if (salesRes.count != null) setTotalSales(salesRes.count);
      }

      setLoading(false);
    }
    init();
  }, [id]);

  if (loading) return <Skeleton isMobile={isMobile} />;

  if (notFound) {
    return (
      <div style={{ maxWidth: 560, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, color: BLUE, opacity: 0.18, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NEAR_BLACK, marginBottom: 8 }}>Criador não encontrado</h1>
        <p style={{ fontSize: 15, color: GRAY_TEXT, marginBottom: 24 }}>Este perfil pode ter sido removido ou o link está incorreto.</p>
        <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: BLUE, color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
          ← Ver todas as soluções
        </a>
      </div>
    );
  }

  const categories = ["Todos", ...Array.from(new Set(solutions.map(s => s.categoria).filter(Boolean)))];
  const filtered = activeCategory === "Todos" ? solutions : solutions.filter(s => s.categoria === activeCategory);

  const portfolioHostname = (() => {
    try { return new URL(creator.portfolio_link).hostname.replace(/^www\./, ""); } catch { return creator.portfolio_link; }
  })();

  return (
    <div style={{ background: BG_GRAY, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "88px 16px 60px" : "96px 32px 80px" }}>

        {/* ── HERO CARD ── */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: isMobile ? "32px 24px" : "48px 40px", marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: BLUE, marginBottom: 16, flexShrink: 0, overflow: "hidden", border: "3px solid rgba(3,105,161,0.12)" }}>
            {creator.avatar_url
              ? <img src={creator.avatar_url} alt={creator.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials(creator.nome)}
          </div>

          {/* Name */}
          <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: NEAR_BLACK, margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            {creator.nome}
          </h1>

          {/* Verified badge */}
          {creator.role === "criador" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(5,150,105,0.1)", color: "#059669", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.2)" />
                <path d="M7 12l3 3 7-7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Criador Verificado
            </span>
          )}

          {/* Bio */}
          {creator.bio && (
            <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7, maxWidth: 560, margin: "0 0 16px" }}>
              {creator.bio}
            </p>
          )}

          {/* Portfolio link */}
          {creator.portfolio_link && (
            <a href={creator.portfolio_link} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: BLUE, fontWeight: 600, textDecoration: "none", marginBottom: 24, padding: "6px 14px", borderRadius: 8, border: `1.5px solid rgba(3,105,161,0.2)`, background: "rgba(3,105,161,0.04)", transition: "background 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(3,105,161,0.09)"; e.currentTarget.style.borderColor = BLUE; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(3,105,161,0.04)"; e.currentTarget.style.borderColor = "rgba(3,105,161,0.2)"; }}>
              <ExternalIcon />
              {portfolioHostname}
            </a>
          )}

          {/* Stats */}
          <div style={{ display: "flex", gap: isMobile ? 20 : 48, justifyContent: "center", marginBottom: creator.email ? 24 : 0, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px" }}>{solutions.length}</div>
              <div style={{ fontSize: 12, color: GRAY_TEXT, fontWeight: 500, marginTop: 2 }}>Soluções publicadas</div>
            </div>
            <div style={{ width: 1, background: BORDER, alignSelf: "stretch" }} />
            <div style={{ textAlign: "center" }}>
              {avgRating != null ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px" }}>{avgRating.toFixed(1)}</span>
                    <Stars rating={avgRating} size={16} />
                  </div>
                  <div style={{ fontSize: 12, color: GRAY_TEXT, fontWeight: 500, marginTop: 2 }}>Avaliação média</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: GRAY_TEXT, letterSpacing: "-1px" }}>—</div>
                  <div style={{ fontSize: 12, color: GRAY_TEXT, fontWeight: 500, marginTop: 2 }}>Avaliação média</div>
                </>
              )}
            </div>
            <div style={{ width: 1, background: BORDER, alignSelf: "stretch" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: NEAR_BLACK, letterSpacing: "-1px" }}>{totalSales}</div>
              <div style={{ fontSize: 12, color: GRAY_TEXT, fontWeight: 500, marginTop: 2 }}>Vendas totais</div>
            </div>
          </div>

          {/* Contact button */}
          {creator.email && (
            <a href={`mailto:${creator.email}`}
              style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 999, padding: "11px 24px", border: `2px solid ${BLUE}`, color: BLUE, fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent", transition: "background 0.15s, color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BLUE; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Entrar em contato
            </a>
          )}
        </div>

        {/* ── SOLUTIONS SECTION ── */}
        <div>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: NEAR_BLACK, margin: 0, letterSpacing: "-0.3px" }}>
              Soluções de {creator.nome?.split(" ")[0]}
            </h2>
            {solutions.length > 0 && (
              <span style={{ fontSize: 13, color: GRAY_TEXT, fontWeight: 500 }}>
                {filtered.length} {filtered.length === 1 ? "solução" : "soluções"}
              </span>
            )}
          </div>

          {/* Category filter pills */}
          {solutions.length > 0 && categories.length > 2 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "7px 16px", borderRadius: 999, border: "none",
                  background: activeCategory === cat ? BLUE : "#fff",
                  color: activeCategory === cat ? "#fff" : GRAY_TEXT,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  transition: "background 0.15s, color 0.15s",
                }}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid or empty state */}
          {solutions.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "60px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 40, color: BLUE, opacity: 0.18, marginBottom: 14 }}>✦</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Este criador ainda não publicou soluções.</div>
              <div style={{ fontSize: 14, color: GRAY_TEXT, marginBottom: 24 }}>Volte em breve para conferir as novidades.</div>
              <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: BLUE, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                ← Explorar outras soluções
              </a>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: GRAY_TEXT }}>Nenhuma solução nesta categoria.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
              {filtered.map(s => (
                <SolutionCard key={s.id} solution={s} isMobile={isMobile} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CreatorProfilePage() {
  const width    = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <Navbar isMobile={isMobile} />
      <Suspense fallback={<div style={{ background: BG_GRAY, minHeight: "100vh" }}><Skeleton isMobile={isMobile} /></div>}>
        <CreatorProfile isMobile={isMobile} />
      </Suspense>
    </div>
  );
}
