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

function CheckIcon({ color = "#059669" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="11" fill={color + "22"} />
      <path d="M7 12l3 3 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
          <WePromptLogo id="sol-d-header" textColor={NEAR_BLACK} />
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

/* ── Purchase Card ── */
function PurchaseCard({ solution, user, alreadyOwned, onCheckout, checkoutLoading, checkoutError, creator, isMobile }) {
  const [shared, setShared] = useState(false);
  const [fav, setFav] = useState(false);

  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Gratuito";
  const isOneTime = solution.payment_type === "one_time";

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: solution.titulo, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(0,0,0,0.09)", padding: "26px", position: isMobile ? "static" : "sticky", top: 88, marginBottom: 20 }}>

      {/* Price */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: BLUE, letterSpacing: "-1.5px", lineHeight: 1 }}>
            {priceLabel}
          </span>
          {solution.preco != null && (
            <span style={{ fontSize: 13, color: GRAY_TEXT, fontWeight: 500 }}>
              {isOneTime ? "pagamento único" : "por mês"}
            </span>
          )}
        </div>
        {solution.preco == null && (
          <div style={{ fontSize: 13, color: "#059669", fontWeight: 600, marginTop: 4 }}>Disponível gratuitamente</div>
        )}
      </div>

      {/* CTA */}
      {alreadyOwned ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 12, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.15)" />
            <path d="M7 12l3 3 7-7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>Você já possui esta solução ✓</span>
        </div>
      ) : (
        <button onClick={onCheckout} disabled={checkoutLoading} style={{
          width: "100%", height: 52, borderRadius: 12, border: "none",
          background: checkoutLoading ? "rgba(3,105,161,0.5)" : BLUE,
          color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: checkoutLoading ? "not-allowed" : "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginBottom: 12, transition: "background 0.15s",
        }}
          onMouseEnter={e => { if (!checkoutLoading) e.currentTarget.style.background = "#0284C7"; }}
          onMouseLeave={e => { if (!checkoutLoading) e.currentTarget.style.background = BLUE; }}
        >
          {checkoutLoading ? "Redirecionando…" : solution.preco != null ? "Adquirir solução" : "Começar gratuitamente"}
          {!checkoutLoading && <Arrow />}
        </button>
      )}

      {/* Secondary actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={handleShare} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${BORDER}`, background: "transparent", color: shared ? BLUE : GRAY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "border-color 0.15s, color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
          onMouseLeave={e => { if (!shared) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; } }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          {shared ? "Copiado!" : "Compartilhar"}
        </button>
        <button onClick={() => setFav(f => !f)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${fav ? "#f43f5e" : BORDER}`, background: fav ? "rgba(244,63,94,0.06)" : "transparent", color: fav ? "#f43f5e" : GRAY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s" }}
          onMouseEnter={e => { if (!fav) { e.currentTarget.style.borderColor = "#f43f5e"; e.currentTarget.style.color = "#f43f5e"; } }}
          onMouseLeave={e => { if (!fav) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = GRAY_TEXT; } }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={fav ? "#f43f5e" : "none"} stroke={fav ? "#f43f5e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {fav ? "Favoritado" : "Favoritar"}
        </button>
      </div>

      {checkoutError && (
        <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>
          {checkoutError}
        </div>
      )}

      <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />

      {/* Included */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Incluso</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {["Acesso imediato após pagamento", "Suporte em português", "Atualizações incluídas", "Reembolso em 7 dias"].map(item => (
            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <CheckIcon color="#059669" />
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        {[
          { label: "Suporte em português", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", bg: "#e0f2fe", color: BLUE },
          { label: "Reembolso em 7 dias", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", bg: "rgba(5,150,105,0.1)", color: "#059669" },
        ].map(b => (
          <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: b.bg, color: b.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={b.icon} />
            </svg>
            {b.label}
          </span>
        ))}
      </div>

      <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />

      {/* Creator mini-profile */}
      {creator && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Criador</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
              {initials(creator.nome)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{creator.nome}</div>
              <div style={{ fontSize: 12, color: GRAY_TEXT }}>{creator.solution_count || 1} soluções publicadas</div>
            </div>
          </div>
          {creator.id && (
            <a href={`/criadores/${creator.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: BLUE, textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
              Ver perfil do criador <Arrow />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Related Solutions ── */
function RelatedSolutions({ categoria, currentId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!categoria) return;
    supabase
      .from("solutions")
      .select("id, titulo, preco, categoria, cover_url, payment_type")
      .eq("status", "approved")
      .eq("ativo", true)
      .eq("categoria", categoria)
      .neq("id", currentId)
      .limit(2)
      .then(({ data }) => { if (data) setRelated(data); });
  }, [categoria, currentId]);

  if (related.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 14 }}>Soluções relacionadas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {related.map(r => (
          <a key={r.id} href={`/solucoes/${r.id}`} style={{ display: "flex", gap: 12, textDecoration: "none", borderRadius: 12, padding: "10px", border: `1px solid ${BORDER}`, transition: "background 0.15s, border-color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = BLUE; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = BORDER; }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #e0f2fe, #bae6fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {r.cover_url
                ? <img src={r.cover_url} alt={r.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: BLUE, opacity: 0.35, fontSize: 20 }}>✦</span>}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{r.titulo}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, background: "#e0f2fe", color: BLUE, padding: "2px 7px", borderRadius: 99 }}>{r.categoria}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: NEAR_BLACK }}>
                  {r.preco != null ? `R$ ${Number(r.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton({ isMobile }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "88px 16px 60px" : "96px 32px 80px" }}>
      <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
      <div style={{ display: "flex", gap: 28, animation: "shimmer 1.5s ease-in-out infinite" }}>
        <div style={{ flex: isMobile ? "1" : "0 0 65%" }}>
          <div style={{ width: 180, height: 12, borderRadius: 4, background: "#ddd", marginBottom: 26 }} />
          <div style={{ width: 80, height: 22, borderRadius: 99, background: "#e5e7eb", marginBottom: 12 }} />
          <div style={{ width: "75%", height: 42, borderRadius: 10, background: "#e5e7eb", marginBottom: 14 }} />
          <div style={{ width: "55%", height: 14, borderRadius: 4, background: "#ddd", marginBottom: 18 }} />
          <div style={{ width: "100%", height: 340, borderRadius: 20, background: "#e5e7eb", marginBottom: 24 }} />
          <div style={{ width: "100%", height: 14, borderRadius: 4, background: "#e5e7eb", marginBottom: 8 }} />
          <div style={{ width: "88%", height: 14, borderRadius: 4, background: "#e5e7eb", marginBottom: 8 }} />
          <div style={{ width: "70%", height: 14, borderRadius: 4, background: "#e5e7eb" }} />
        </div>
        {!isMobile && (
          <div style={{ flex: "0 0 35%" }}>
            <div style={{ width: "100%", height: 420, borderRadius: 20, background: "#e5e7eb" }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SOLUTION DETAIL
══════════════════════════════════════════ */
function SolutionDetail({ isMobile }) {
  const { id } = useParams();
  const [solution, setSolution]     = useState(null);
  const [creator, setCreator]       = useState(null);
  const [reviews, setReviews]       = useState([]);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [user, setUser]             = useState(null);
  const [activeTab, setActiveTab]   = useState("descricao");

  useEffect(() => {
    if (!id) return;
    async function init() {
      const [solRes, sessionRes] = await Promise.all([
        supabase.from("solutions").select("*").eq("id", id).eq("ativo", true).eq("status", "approved").single(),
        supabase.auth.getSession(),
      ]);

      if (solRes.error || !solRes.data) { setNotFound(true); setLoading(false); return; }

      const sol = solRes.data;
      setSolution(sol);

      const sess = sessionRes.data?.session;
      if (sess?.user) setUser(sess.user);

      const [creatorRes, reviewsRes, ownedRes] = await Promise.all([
        sol.creator_id
          ? supabase.from("profiles").select("id, nome").eq("id", sol.creator_id).single()
          : Promise.resolve({ data: null }),
        supabase.from("reviews").select("*").eq("solution_id", id).order("created_at", { ascending: false }).limit(10),
        sess?.user
          ? supabase.from("subscriptions").select("id").eq("solution_id", id).eq("business_id", sess.user.id).limit(1)
          : Promise.resolve({ data: [] }),
      ]);

      if (creatorRes.data) {
        const { count } = await supabase
          .from("solutions")
          .select("id", { count: "exact", head: true })
          .eq("creator_id", sol.creator_id)
          .eq("status", "approved");
        setCreator({ ...creatorRes.data, solution_count: count || 1 });
      } else if (sol.criador_nome) {
        setCreator({ nome: sol.criador_nome, solution_count: 1 });
      }

      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (ownedRes.data?.length > 0) setAlreadyOwned(true);

      setLoading(false);
    }
    init();
  }, [id]);

  function handleCheckout() {
    if (!user) { window.location.href = `/login?redirect=/checkout/${id}`; return; }
    window.location.href = `/checkout/${id}`;
  }

  if (loading) return <Skeleton isMobile={isMobile} />;

  if (notFound) {
    return (
      <div style={{ maxWidth: 560, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, color: BLUE, opacity: 0.18, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NEAR_BLACK, marginBottom: 8 }}>Solução não encontrada</h1>
        <p style={{ fontSize: 15, color: GRAY_TEXT, marginBottom: 24 }}>Esta solução pode ter sido removida ou ainda não está disponível.</p>
        <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: BLUE, color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#0284C7"} onMouseLeave={e => e.currentTarget.style.background = BLUE}>
          ← Voltar para soluções
        </a>
      </div>
    );
  }

  if (!solution) return null;

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
    : 5;

  const tabs = [
    { key: "descricao",  label: "Descrição" },
    { key: "como-usar",  label: "Como usar" },
    { key: "incluso",    label: "O que está incluso" },
    { key: "avaliacoes", label: `Avaliações${reviews.length > 0 ? ` (${reviews.length})` : ""}` },
  ];

  const purchaseCard = (
    <PurchaseCard
      solution={solution}
      user={user}
      alreadyOwned={alreadyOwned}
      onCheckout={handleCheckout}
      checkoutLoading={false}
      checkoutError=""
      creator={creator}
      isMobile={isMobile}
    />
  );

  return (
    <div style={{ background: BG_GRAY, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "88px 16px 60px" : "96px 32px 80px" }}>

        {/* Purchase card on top on mobile */}
        {isMobile && purchaseCard}

        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ flex: isMobile ? "1" : "0 0 calc(65% - 14px)", minWidth: 0 }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <a href="/solucoes" style={{ fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}>
                Soluções
              </a>
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>→</span>
              <a href={`/solucoes?categoria=${encodeURIComponent(solution.categoria || "")}`} style={{ fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}>
                {solution.categoria}
              </a>
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>→</span>
              <span style={{ fontSize: 13, color: NEAR_BLACK, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{solution.titulo}</span>
            </div>

            {/* Category pill */}
            <span style={{ display: "inline-block", background: "#e0f2fe", color: BLUE, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
              {solution.categoria}
            </span>

            {/* Title */}
            <h1 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: NEAR_BLACK, margin: "12px 0 14px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              {solution.titulo}
            </h1>

            {/* Creator row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                {creator ? initials(creator.nome) : "?"}
              </div>
              <span style={{ fontSize: 14, color: GRAY_TEXT }}>
                Por <strong style={{ color: NEAR_BLACK }}>{creator?.nome || solution.criador_nome || "—"}</strong>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(5,150,105,0.1)", color: "#059669", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>
                ✓ Criador Verificado
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Stars rating={avgRating} size={13} />
                <span style={{ fontSize: 12, color: GRAY_TEXT }}>({reviews.length})</span>
              </div>
            </div>

            {/* Hero image */}
            <div style={{ width: "100%", borderRadius: 20, overflow: "hidden", marginBottom: 24, background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" }}>
              {solution.cover_url ? (
                <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ padding: "80px 40px", textAlign: "center" }}>
                  <div style={{ fontSize: 52, color: BLUE, opacity: 0.2, marginBottom: 12 }}>✦</div>
                  <div style={{ fontSize: 16, color: BLUE, opacity: 0.45, fontWeight: 700 }}>{solution.titulo}</div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              {/* Tab bar */}
              <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                    padding: "15px 20px", border: "none", background: "transparent",
                    fontSize: 14, fontWeight: activeTab === t.key ? 700 : 500,
                    color: activeTab === t.key ? BLUE : GRAY_TEXT,
                    borderBottom: `2px solid ${activeTab === t.key ? BLUE : "transparent"}`,
                    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                    transition: "color 0.15s", marginBottom: -1,
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ padding: isMobile ? "24px 20px" : "28px 32px" }}>

                {/* DESCRIÇÃO */}
                {activeTab === "descricao" && (
                  <div>
                    <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8, margin: "0 0 28px", whiteSpace: "pre-line" }}>
                      {solution.descricao}
                    </p>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10 }}>Ideal para</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {["Pequenas e médias empresas", "Equipes de marketing", "Empreendedores", "Startups"].map(tag => (
                          <span key={tag} style={{ background: "#e0f2fe", color: BLUE, fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 99 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* COMO USAR */}
                {activeTab === "como-usar" && (
                  solution.delivery_instructions ? (
                    <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>
                      {solution.delivery_instructions}
                    </p>
                  ) : (
                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                      <div style={{ fontSize: 36, opacity: 0.18, marginBottom: 14 }}>📋</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>
                        O criador ainda não adicionou instruções de uso.
                      </div>
                      <div style={{ fontSize: 13, color: GRAY_TEXT }}>As instruções completas são enviadas após a aquisição.</div>
                    </div>
                  )
                )}

                {/* O QUE ESTÁ INCLUSO */}
                {activeTab === "incluso" && (
                  <div>
                    <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        "Acesso imediato após pagamento",
                        solution.delivery_files?.length > 0
                          ? `${solution.delivery_files.length} arquivo(s) de entrega`
                          : null,
                        solution.delivery_links?.length > 0
                          ? `${solution.delivery_links.length} link(s) de acesso`
                          : null,
                        "Suporte em português com o criador",
                        "Atualizações futuras da solução",
                        "Reembolso em 7 dias se não funcionar conforme descrito",
                      ].filter(Boolean).map(item => (
                        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <CheckIcon color="#059669" />
                          <span style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.6 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e0f2fe", borderRadius: 10, padding: "11px 16px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                        {solution.delivery_files?.length > 0
                          ? "Entrega digital imediata"
                          : "Configuração assistida pelo criador"}
                      </span>
                    </div>
                  </div>
                )}

                {/* AVALIAÇÕES */}
                {activeTab === "avaliacoes" && (
                  reviews.length > 0 ? (
                    <div>
                      {/* Summary */}
                      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: "20px 24px", background: BG_GRAY, borderRadius: 16 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 52, fontWeight: 900, color: NEAR_BLACK, lineHeight: 1 }}>
                            {avgRating.toFixed(1)}
                          </div>
                          <div style={{ marginTop: 6 }}><Stars rating={avgRating} size={18} /></div>
                          <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 4 }}>{reviews.length} avaliações</div>
                        </div>
                      </div>
                      {/* Cards */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {reviews.map((r, i) => (
                          <div key={i} style={{ padding: "18px 20px", background: BG_GRAY, borderRadius: 14 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                                {(r.reviewer_name || "U").charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 3 }}>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK }}>{r.reviewer_name || "Usuário verificado"}</span>
                                  <span style={{ fontSize: 12, color: GRAY_TEXT }}>
                                    {new Date(r.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                                  </span>
                                </div>
                                <Stars rating={r.rating || 5} size={12} />
                              </div>
                            </div>
                            {r.comment && (
                              <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                      <div style={{ fontSize: 36, opacity: 0.18, marginBottom: 14 }}>⭐</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>
                        Seja o primeiro a avaliar esta solução
                      </div>
                      <div style={{ fontSize: 13, color: GRAY_TEXT }}>As avaliações aparecem após a aquisição.</div>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          {!isMobile && (
            <div style={{ flex: "0 0 calc(35% - 14px)", minWidth: 0 }}>
              {purchaseCard}
              <RelatedSolutions categoria={solution.categoria} currentId={id} />
            </div>
          )}
        </div>

        {/* Related on mobile */}
        {isMobile && (
          <div style={{ marginTop: 20 }}>
            <RelatedSolutions categoria={solution.categoria} currentId={id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SolutionPage() {
  const width    = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <Navbar isMobile={isMobile} />
      <Suspense fallback={<div style={{ background: BG_GRAY, minHeight: "100vh" }}><Skeleton isMobile={isMobile} /></div>}>
        <SolutionDetail isMobile={isMobile} />
      </Suspense>
    </div>
  );
}
