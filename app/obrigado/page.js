"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";
const GREEN      = "#059669";

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
          <WePromptLogo id="obrigado-header" textColor={NEAR_BLACK} />
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

/* ══════════════════════════════════════════
   SUCCESS CONTENT
══════════════════════════════════════════ */
function SuccessContent({ isMobile }) {
  const params     = useSearchParams();
  const solutionId = params.get("solution_id");

  const [session,  setSession]  = useState(null);
  const [solution, setSolution] = useState(null);
  const [creator,  setCreator]  = useState(null);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session: sess } } = await supabase.auth.getSession();
      setSession(sess);

      if (!solutionId) { setLoaded(true); return; }

      const { data: sol } = await supabase
        .from("solutions")
        .select("id, titulo, categoria, cover_url, creator_id, criador_nome")
        .eq("id", solutionId)
        .single();

      if (sol) {
        setSolution(sol);
        if (sol.creator_id) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("nome")
            .eq("id", sol.creator_id)
            .single();
          if (prof) setCreator(prof);
        }
      }

      setLoaded(true);
    }
    init();
  }, [solutionId]);

  const dashboardUrl = getDashboardUrl(session);

  const STEPS = [
    {
      n: 1,
      title: "Acesse sua solução no dashboard",
      desc:  "Todas as suas compras ficam salvas no seu painel",
    },
    {
      n: 2,
      title: "Entre em contato com o criador",
      desc:  "Se precisar de ajuda para configurar, o criador está disponível",
    },
    {
      n: 3,
      title: "Deixe uma avaliação",
      desc:  "Sua opinião ajuda outros compradores a escolher",
    },
  ];

  return (
    <div style={{ background: BG_GRAY, minHeight: "100vh" }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0);    opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        .success-circle {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "96px 20px 60px" : "96px 24px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* 1 — Success animation */}
        <div className="success-circle" style={{
          width: 120, height: 120, borderRadius: "50%",
          background: "linear-gradient(135deg, #0369A1, #38BDF8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 40px rgba(3,105,161,0.3)",
        }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1, userSelect: "none" }}>✓</span>
        </div>

        {/* 2 — Title */}
        <h1 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: NEAR_BLACK, margin: "32px 0 0", textAlign: "center", letterSpacing: "-0.8px", lineHeight: 1.15 }}>
          Pagamento confirmado!
        </h1>

        {/* 3 — Subtitle */}
        <p style={{ fontSize: isMobile ? 15 : 18, color: GRAY_TEXT, textAlign: "center", margin: "12px 0 0", lineHeight: 1.6, maxWidth: 460 }}>
          Obrigado pela sua compra. Você já tem acesso à solução.
        </p>

        {/* 4 — Solution card */}
        {loaded && solution && (
          <div style={{ width: "100%", background: "#fff", borderRadius: 20, padding: 24, marginTop: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: 16, alignItems: "center" }}>
            {/* Thumbnail */}
            <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #e0f2fe, #bae6fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {solution.cover_url
                ? <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 22, color: BLUE, opacity: 0.3 }}>✦</span>}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {solution.titulo}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  {solution.categoria}
                </span>
                {(creator?.nome || solution.criador_nome) && (
                  <span style={{ fontSize: 12, color: GRAY_TEXT }}>
                    por <strong style={{ color: NEAR_BLACK, fontWeight: 600 }}>{creator?.nome || solution.criador_nome}</strong>
                  </span>
                )}
              </div>
            </div>
            {/* Access badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(5,150,105,0.09)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 99, padding: "5px 12px", flexShrink: 0, whiteSpace: "nowrap" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.2)" />
                <path d="M7 12l3 3 7-7" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Acesso liberado</span>
            </div>
          </div>
        )}

        {/* 5 — Next steps */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 20, padding: isMobile ? "24px 20px" : 32, marginTop: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 24 }}>Próximos passos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {STEPS.map(step => (
              <div key={step.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.55 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 — Action buttons */}
        <div style={{ width: "100%", marginTop: 32 }}>
          <button
            onClick={() => { window.location.href = dashboardUrl; }}
            style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: BLUE, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
            onMouseLeave={e => e.currentTarget.style.background = BLUE}
          >
            Ir para Meu Dashboard <Arrow />
          </button>
          <button
            onClick={() => { window.location.href = "/solucoes"; }}
            style={{ width: "100%", height: 48, borderRadius: 14, border: `2px solid ${BLUE}`, background: "transparent", color: BLUE, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Explorar mais soluções
          </button>
        </div>

        {/* 7 — Support note */}
        <p style={{ marginTop: 24, fontSize: 13, color: GRAY_TEXT, textAlign: "center" }}>
          Dúvidas? Entre em contato:{" "}
          <a href="mailto:contato@weprompt.app.br" style={{ color: BLUE, fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            contato@weprompt.app.br
          </a>
        </p>

      </div>
    </div>
  );
}

export default function ObrigadoPage() {
  const width    = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <Navbar isMobile={isMobile} />
      <Suspense fallback={<div style={{ background: BG_GRAY, minHeight: "100vh" }} />}>
        <SuccessContent isMobile={isMobile} />
      </Suspense>
    </div>
  );
}
