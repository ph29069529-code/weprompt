"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const BORDER = "rgba(255,255,255,0.1)";
const TEXT2 = "rgba(255,255,255,0.6)";

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

const BackArrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SolutionDetail() {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function init() {
      const [solutionRes, sessionRes] = await Promise.all([
        supabase.from("solutions").select("*").eq("id", id).eq("ativo", true).eq("status", "approved").single(),
        supabase.auth.getSession(),
      ]);
      if (solutionRes.error || !solutionRes.data) {
        setNotFound(true);
      } else {
        setSolution(solutionRes.data);
      }
      if (sessionRes.data?.session?.user) setUser(sessionRes.data.session.user);
      setLoading(false);
    }
    init();
  }, [id]);

  async function handleCheckout() {
    if (!user) {
      window.location.href = `/login?redirect=/solucoes/${id}`;
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution_id: solution.id,
          solution_titulo: solution.titulo,
          solution_preco: solution.preco,
          user_id: user.id,
          payment_type: solution.payment_type || "subscription",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setCheckoutError(json.error || "Erro ao iniciar pagamento. Tente novamente.");
        setCheckoutLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setCheckoutError("Erro ao iniciar pagamento. Tente novamente.");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
          <div style={{ width: 120, height: 14, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 32 }} />
          <div style={{ width: 80, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />
          <div style={{ width: "60%", height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
          <div style={{ width: "100%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
          <div style={{ width: "90%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
          <div style={{ width: "75%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 40 }} />
          <div style={{ width: 200, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Solução não encontrada</h1>
        <p style={{ fontSize: 15, color: TEXT2, marginBottom: 24 }}>
          Esta solução pode ter sido removida ou ainda não está disponível.
        </p>
        <a href="/solucoes" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
          color: "#fff", padding: "11px 24px", borderRadius: 10,
          fontSize: 14, fontWeight: 600, textDecoration: "none",
        }}>
          <BackArrow /> Voltar para soluções
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
      <a href="/solucoes" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: TEXT2, fontSize: 14, fontWeight: 500,
        textDecoration: "none", marginBottom: 32,
        transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
      >
        <BackArrow /> Voltar para soluções
      </a>

      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}>
        {solution.cover_url && (
          <div style={{ height: 280, flexShrink: 0 }}>
            <img src={solution.cover_url} alt={solution.titulo}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ padding: "32px 40px 40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(107,92,231,0.2)", color: "#a78bfa",
              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
            }}>
              {solution.categoria}
            </span>
            {solution.preco != null && (
              <span style={{
                display: "inline-block",
                background: solution.payment_type === "one_time" ? "rgba(74,222,128,0.15)" : "rgba(107,92,231,0.15)",
                color: solution.payment_type === "one_time" ? "#4ade80" : "#a78bfa",
                fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
              }}>
                {solution.payment_type === "one_time" ? "Venda Única" : "Assinatura Mensal"}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: 30, fontWeight: 800, color: "#fff",
            margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.25,
          }}>
            {solution.titulo}
          </h1>

          <p style={{ fontSize: 16, color: TEXT2, lineHeight: 1.75, margin: "0 0 32px", whiteSpace: "pre-line" }}>
            {solution.descricao}
          </p>

          <div style={{ height: 1, background: BORDER, marginBottom: 28 }} />

          {solution.criador_nome && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(107,92,231,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#a78bfa",
              }}>
                {solution.criador_nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, color: TEXT2, marginBottom: 2 }}>Criador</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{solution.criador_nome}</div>
              </div>
            </div>
          )}

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>Preço</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                  {solution.preco != null
                    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "Gratuito"}
                </div>
                {solution.preco != null && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 99,
                    background: solution.payment_type === "one_time" ? "rgba(74,222,128,0.15)" : "rgba(107,92,231,0.2)",
                    color: solution.payment_type === "one_time" ? "#4ade80" : "#a78bfa",
                  }}>
                    {solution.payment_type === "one_time" ? "Pagamento único" : "por mês"}
                  </span>
                )}
              </div>
            </div>

            {solution.preco != null ? (
              <button
                onClick={handleCheckout} disabled={checkoutLoading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: checkoutLoading ? "rgba(107,92,231,0.4)" : "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
                  color: "#fff", padding: "14px 28px", borderRadius: 12,
                  fontSize: 16, fontWeight: 700, border: "none",
                  cursor: checkoutLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "opacity 0.15s",
                  boxShadow: checkoutLoading ? "none" : "0 4px 24px rgba(107,92,231,0.45)",
                }}
                onMouseEnter={e => { if (!checkoutLoading) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => { if (!checkoutLoading) e.currentTarget.style.opacity = "1"; }}
              >
                {checkoutLoading
                  ? "Redirecionando…"
                  : solution.payment_type === "one_time"
                    ? `Comprar por R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : `Assinar por R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`}
                {!checkoutLoading && <Arrow />}
              </button>
            ) : (
              <a href="/cadastro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                padding: "14px 28px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 4px 24px rgba(107,92,231,0.45)",
              }}>
                Começar gratuitamente <Arrow />
              </a>
            )}
          </div>

          {checkoutError && (
            <div style={{
              marginTop: 16,
              background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.35)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#fca5a5",
            }}>
              {checkoutError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SolutionPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const width = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{ minHeight: "100vh", color: "#fff" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,26,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <WePromptLogo id="solution-detail-header" />
          </a>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} style={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500, fontSize: 14, textDecoration: "none",
                  padding: "6px 12px", borderRadius: 8,
                  transition: "color 0.15s",
                }}>
                  {label}
                </a>
              ))}
            </nav>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a href="/login" style={{
                borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 500,
                textDecoration: "none", color: "rgba(255,255,255,0.8)",
                border: "1.5px solid rgba(255,255,255,0.15)", background: "transparent",
              }}>
                Entrar
              </a>
              <a href="/cadastro" style={{
                borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
              }}>
                Criar conta <Arrow />
              </a>
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 22, color: "#fff", padding: "4px 8px",
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
            background: "rgba(10,10,26,0.97)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "12px 24px 20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(([label, href]) => (
              <a key={label} href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "12px 4px", fontSize: 16, fontWeight: 500,
                  color: "rgba(255,255,255,0.85)", textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <a href="/login" style={{
                flex: 1, textAlign: "center",
                borderRadius: 999, padding: "11px",
                fontSize: 14, fontWeight: 500,
                textDecoration: "none", color: "rgba(255,255,255,0.8)",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}>
                Entrar
              </a>
              <a href="/cadastro" style={{
                flex: 1, textAlign: "center",
                borderRadius: 999, padding: "11px",
                fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                textDecoration: "none",
                background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
                color: "#fff",
              }}>
                Criar conta <Arrow />
              </a>
            </div>
          </div>
        )}
      </header>

      <Suspense fallback={null}>
        <SolutionDetail />
      </Suspense>
    </div>
  );
}
