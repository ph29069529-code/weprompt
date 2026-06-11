"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import WePromptLogo from "../../components/WePromptLogo";
import Spinner from "../../components/Spinner";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const ACCENT      = "#6366F1";
const ACCENT_HOVER = "#4F46E5";
const BORDER     = "#e5e7eb";
const GREEN      = "#059669";

function getDashboardUrl(session) {
  if (!session) return "/login";
  const role = session.user.user_metadata?.role;
  if (role === "admin") return "/dashboard/admin";
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

function CheckIcon({ size = 16, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
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
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <WePromptLogo id="checkout-header" textColor={NEAR_BLACK} />
        </Link>

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
              <a href={dashboardUrl} style={{ borderRadius: 999, padding: "9px 22px", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"} onMouseLeave={e => e.currentTarget.style.background = ACCENT}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: ACCENT, border: `2px solid ${ACCENT}`, background: "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  Entrar
                </a>
                <a href="/cadastro" style={{ borderRadius: 999, padding: "9px 22px", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"} onMouseLeave={e => e.currentTarget.style.background = ACCENT}>
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
              <a href={dashboardUrl} style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                Meu Dashboard <Arrow />
              </a>
            ) : (
              <>
                <a href="/login" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", fontSize: 14, fontWeight: 500, textDecoration: "none", color: ACCENT, border: `2px solid ${ACCENT}` }}>Entrar</a>
                <a href="/cadastro" style={{ flex: 1, textAlign: "center", borderRadius: 999, padding: "13px", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>Criar conta <Arrow /></a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Trust Badge ── */
function TrustBadge({ icon, title, subtitle }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 16, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: 11, color: GRAY_TEXT, lineHeight: 1.4 }}>{subtitle}</div>
    </div>
  );
}

/* ── Testimonial Card ── */
function TestimonialCard({ quote, author, role, solution }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(n => (
          <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p style={{ fontSize: 13, color: GRAY_TEXT, fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
        "{quote}"
      </p>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{author}</div>
        <div style={{ fontSize: 11, color: GRAY_TEXT }}>{role} · {solution}</div>
      </div>
    </div>
  );
}

/* ── Stripe Badge ── */
function StripeBadge() {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 900, lineHeight: 1 }}>S</span>
      </div>
      <div>
        <div style={{ fontSize: 11, color: GRAY_TEXT, lineHeight: 1.5 }}>Processado com segurança pelo Stripe</div>
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: ACCENT, fontWeight: 600, textDecoration: "none" }}>stripe.com</a>
      </div>
    </div>
  );
}

/* ── Checkout Card (right column) ── */
function CheckoutCard({ solution, onPay, loading, error, isMobile, alreadyOwned }) {
  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Grátis";
  const isOneTime = solution.payment_type === "one_time";

  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(99,102,241,0.12)", padding: 32, position: isMobile ? "static" : "sticky", top: 88, marginBottom: isMobile ? 20 : 0 }}>

      {/* Solution name */}
      <div style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6, lineHeight: 1.3 }}>
        {solution.titulo}
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: ACCENT, letterSpacing: "-1.5px", lineHeight: 1 }}>
          {priceLabel}
        </span>
      </div>
      <div style={{ marginBottom: 20 }}>
        <span style={{ display: "inline-block", background: "#EEF2FF", color: ACCENT, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
          {solution.preco == null ? "gratuito" : isOneTime ? "pagamento único" : "por mês"}
        </span>
      </div>

      <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

      {/* What's included */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>O que está incluso</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Acesso imediato após pagamento",
            "Suporte em português incluído",
            "Atualizações gratuitas",
          ].map(item => (
            <li key={item} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <CheckIcon size={16} color={GREEN} />
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

      {/* CTA or owned state */}
      {alreadyOwned ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 12, marginBottom: 14 }}>
          <CheckIcon size={18} color={GREEN} />
          <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Você já possui esta solução ✓</span>
        </div>
      ) : (
        <button
          onClick={onPay}
          disabled={loading}
          style={{
            width: "100%", height: 56, borderRadius: 10, border: "none",
            background: loading ? "rgba(99,102,241,0.5)" : ACCENT,
            color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            marginBottom: 10, transition: "background 0.15s, box-shadow 0.15s",
            boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = ACCENT_HOVER; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; } }}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = ACCENT; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)"; } }}
        >
          {loading ? <Spinner /> : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          )}
          {loading ? "Redirecionando…" : "Finalizar pagamento seguro"}
          {!loading && <Arrow />}
        </button>
      )}

      {error && (
        <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Lock line */}
      <div style={{ textAlign: "center", fontSize: 12, color: GRAY_TEXT, marginBottom: 14 }}>
        🔒 Pagamento processado pelo Stripe
      </div>

      {/* Mini trust row */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 11, color: GRAY_TEXT, fontWeight: 500, marginBottom: 18 }}>
        <span>🔒 SSL</span>
        <span style={{ color: BORDER }}>|</span>
        <span>↩ 7 dias</span>
        <span style={{ color: BORDER }}>|</span>
        <span>🇧🇷 Suporte PT</span>
      </div>

      <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

      {/* Stripe badge */}
      <StripeBadge />

      {/* Money-back guarantee */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16, marginTop: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: GREEN, lineHeight: 1 }}>7</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: "0.3px" }}>dias</div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK, marginBottom: 3 }}>Garantia de reembolso</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, lineHeight: 1.55 }}>Se não funcionar como descrito, devolvemos 100% do valor.</div>
        </div>
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
        <div style={{ flex: isMobile ? "1" : "0 0 calc(60% - 14px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 220, height: 12, borderRadius: 4, background: "#ddd" }} />
          <div style={{ background: "#fff", borderRadius: 20, height: 180 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[1,2,3,4].map(n => <div key={n} style={{ background: "#fff", borderRadius: 16, height: 100 }} />)}
          </div>
          <div style={{ background: "#fff", borderRadius: 16, height: 80 }} />
        </div>
        {!isMobile && (
          <div style={{ flex: "0 0 calc(40% - 14px)" }}>
            <div style={{ background: "#fff", borderRadius: 20, height: 480 }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CHECKOUT CONTENT
══════════════════════════════════════════ */
function CheckoutContent({ isMobile }) {
  const { id } = useParams();
  const [solution, setSolution]       = useState(null);
  const [creator, setCreator]         = useState(null);
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [payLoading, setPayLoading]   = useState(false);
  const [payError, setPayError]       = useState("");

  useEffect(() => {
    if (!id) return;
    async function init() {
      const [solRes, sessionRes] = await Promise.all([
        supabase.from("solutions")
          .select("id, titulo, descricao, descricao_curta, categoria, preco, tipo, status, creator_id, cover_url, payment_type, avg_rating, review_count")
          .eq("id", id).eq("status", "approved").single(),
        supabase.auth.getSession(),
      ]);

      if (solRes.error || !solRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const sol = solRes.data;
      setSolution(sol);

      const sess = sessionRes.data?.session;
      if (!sess?.user) {
        window.location.href = `/login?redirect=/checkout/${id}`;
        return;
      }
      setUser(sess.user);
      setAccessToken(sess.access_token);

      const [creatorRes, ownedRes] = await Promise.all([
        sol.creator_id
          ? supabase.from("profiles").select("nome").eq("id", sol.creator_id).single()
          : Promise.resolve({ data: null }),
        supabase.from("subscriptions").select("id").eq("solution_id", id).eq("business_id", sess.user.id).limit(1),
      ]);

      if (creatorRes.data) setCreator(creatorRes.data);
      if (ownedRes.data?.length > 0) setAlreadyOwned(true);

      setLoading(false);
    }
    init();
  }, [id]);

  async function handlePay() {
    if (!user || !solution) return;
    setPayLoading(true);
    setPayError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          solution_id: solution.id,
          payment_type: solution.payment_type || "subscription",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setPayError(json.error || "Erro ao iniciar pagamento. Tente novamente.");
        setPayLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setPayError("Erro ao iniciar pagamento. Tente novamente.");
      setPayLoading(false);
    }
  }

  if (loading) return <Skeleton isMobile={isMobile} />;

  if (notFound) {
    return (
      <div style={{ maxWidth: 560, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, color: ACCENT, opacity: 0.18, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NEAR_BLACK, marginBottom: 8 }}>Solução não encontrada</h1>
        <p style={{ fontSize: 15, color: GRAY_TEXT, marginBottom: 24 }}>Esta solução pode ter sido removida ou ainda não está disponível.</p>
        <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: ACCENT, color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          ← Voltar para soluções
        </a>
      </div>
    );
  }

  if (!solution) return null;

  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Grátis";

  const checkoutCard = (
    <CheckoutCard
      solution={solution}
      onPay={handlePay}
      loading={payLoading}
      error={payError}
      isMobile={isMobile}
      alreadyOwned={alreadyOwned}
    />
  );

  return (
    <div style={{ background: BG_GRAY, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "88px 16px 60px" : "96px 32px 80px" }}>

        {/* Mobile: checkout card first */}
        {isMobile && checkoutCard}

        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ flex: isMobile ? "1" : "0 0 calc(60% - 14px)", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <a href="/solucoes" style={{ fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}>
                Soluções
              </a>
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>→</span>
              <a href={`/solucoes/${id}`} style={{ fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}
                onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}>
                {solution.titulo}
              </a>
              <span style={{ fontSize: 13, color: GRAY_TEXT }}>→</span>
              <span style={{ fontSize: 13, color: NEAR_BLACK, fontWeight: 500 }}>Checkout</span>
            </div>

            {/* Order summary card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: NEAR_BLACK, marginBottom: 22 }}>Resumo do pedido</div>

              {/* Solution row */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 22 }}>
                {/* Thumbnail */}
                <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {solution.cover_url
                    ? <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 28, color: ACCENT, opacity: 0.3 }}>✦</span>}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6, lineHeight: 1.3 }}>{solution.titulo}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-block", background: "#EEF2FF", color: ACCENT, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                      {solution.categoria}
                    </span>
                    {(creator?.nome || solution.criador_nome) && (
                      <span style={{ fontSize: 12, color: GRAY_TEXT }}>
                        por <strong style={{ color: NEAR_BLACK, fontWeight: 600 }}>{creator?.nome || solution.criador_nome}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

              {/* Price breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: GRAY_TEXT }}>Subtotal</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>{priceLabel}</span>
                </div>
                <div style={{ height: 1, background: BORDER }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Total</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: ACCENT, letterSpacing: "-0.8px" }}>{priceLabel}</span>
                </div>
              </div>
            </div>

            {/* Trust badges 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <TrustBadge icon="🔒" title="Pagamento 100% Seguro" subtitle="Criptografia SSL 256-bit" />
              <TrustBadge icon="↩️" title="Garantia de 7 dias" subtitle="Reembolso sem burocracia" />
              <TrustBadge icon="🇧🇷" title="Suporte em Português" subtitle="Atendimento humanizado" />
              <TrustBadge icon="✅" title="Solução Verificada" subtitle="Curada pela equipe WePrompt" />
            </div>

            {/* Payment methods */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 12 }}>Formas de pagamento aceitas</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {["Visa", "Mastercard", "Amex", "Pix", "Boleto"].map(m => (
                  <span key={m} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: NEAR_BLACK, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {m}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: GRAY_TEXT }}>Powered by</span>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>S</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#635BFF" }}>Stripe</span>
                </div>
              </div>
            </div>

            {/* Trust card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Por que confiar na WePrompt?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Soluções verificadas pela nossa equipe",
                  "Suporte em português incluído",
                  "Garantia de 7 dias ou seu dinheiro de volta",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckIcon size={20} color={GREEN} />
                    <span style={{ fontSize: 14, color: NEAR_BLACK, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (desktop) ── */}
          {!isMobile && (
            <div style={{ flex: "0 0 calc(40% - 14px)", minWidth: 0 }}>
              {checkoutCard}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const width    = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <Navbar isMobile={isMobile} />
      <Suspense fallback={<div style={{ background: BG_GRAY, minHeight: "100vh" }}><Skeleton isMobile={isMobile} /></div>}>
        <CheckoutContent isMobile={isMobile} />
      </Suspense>
    </div>
  );
}
