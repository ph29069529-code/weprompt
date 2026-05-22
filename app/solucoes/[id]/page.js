"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";

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
        supabase.from("solutions").select("*").eq("id", id).eq("ativo", true).single(),
        supabase.auth.getSession(),
      ]);

      if (solutionRes.error || !solutionRes.data) {
        setNotFound(true);
      } else {
        setSolution(solutionRes.data);
      }

      if (sessionRes.data?.session?.user) {
        setUser(sessionRes.data.session.user);
      }

      setLoading(false);
    }
    init();
  }, [id]);

  async function handleCheckout() {
    if (!user) {
      window.location.href = `/login`;
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
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
          <div style={{ width: 120, height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 32 }} />
          <div style={{ width: 80, height: 22, borderRadius: 6, background: "#E5E7EB", marginBottom: 16 }} />
          <div style={{ width: "60%", height: 36, borderRadius: 8, background: "#E5E7EB", marginBottom: 16 }} />
          <div style={{ width: "100%", height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 8 }} />
          <div style={{ width: "90%", height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 8 }} />
          <div style={{ width: "75%", height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 40 }} />
          <div style={{ width: 200, height: 48, borderRadius: 10, background: "#E5E7EB" }} />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 8 }}>Solução não encontrada</h1>
        <p style={{ fontSize: 15, color: GRAY, marginBottom: 24 }}>
          Esta solução pode ter sido removida ou ainda não está disponível.
        </p>
        <a href="/solucoes" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: PURPLE, color: "#fff",
          padding: "11px 24px", borderRadius: 10,
          fontSize: 14, fontWeight: 600, textDecoration: "none",
        }}>
          <BackArrow /> Voltar para soluções
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* Back link */}
      <a href="/solucoes" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: GRAY, fontSize: 14, fontWeight: 500,
        textDecoration: "none", marginBottom: 32,
        transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = DARK)}
        onMouseLeave={e => (e.currentTarget.style.color = GRAY)}
      >
        <BackArrow /> Voltar para soluções
      </a>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.08)",
        padding: "40px",
      }}>
        {/* Category + payment type badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <span style={{
            display: "inline-block",
            background: `${PURPLE}12`, color: PURPLE,
            fontSize: 11, fontWeight: 600,
            padding: "4px 10px", borderRadius: 99, letterSpacing: "0.2px",
          }}>
            {solution.categoria}
          </span>
          {solution.preco != null && (
            <span style={{
              display: "inline-block",
              background: solution.payment_type === "one_time" ? "rgba(22,163,74,0.1)" : "rgba(107,92,231,0.08)",
              color: solution.payment_type === "one_time" ? "#16A34A" : PURPLE,
              fontSize: 11, fontWeight: 600,
              padding: "4px 10px", borderRadius: 99,
            }}>
              {solution.payment_type === "one_time" ? "Venda Única" : "Assinatura Mensal"}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 30, fontWeight: 800, color: DARK,
          margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.25,
        }}>
          {solution.titulo}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 16, color: GRAY, lineHeight: 1.75,
          margin: "0 0 32px", whiteSpace: "pre-line",
        }}>
          {solution.descricao}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(0,0,0,0.07)", marginBottom: 28 }} />

        {/* Creator info */}
        {solution.criador_nome && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `${PURPLE}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700, color: PURPLE,
            }}>
              {solution.criador_nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: GRAY, marginBottom: 2 }}>Criador</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{solution.criador_nome}</div>
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 12, color: GRAY, marginBottom: 6 }}>Preço</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: "-0.5px" }}>
                {solution.preco != null
                  ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  : "Gratuito"}
              </div>
              {solution.preco != null && (
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 99,
                  background: solution.payment_type === "one_time" ? "rgba(22,163,74,0.1)" : `${PURPLE}12`,
                  color: solution.payment_type === "one_time" ? "#16A34A" : PURPLE,
                }}>
                  {solution.payment_type === "one_time" ? "Pagamento único" : "por mês"}
                </span>
              )}
            </div>
          </div>

          {solution.preco != null ? (
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: checkoutLoading ? "#9B8DE8" : PURPLE,
                color: "#fff",
                padding: "14px 28px", borderRadius: 12,
                fontSize: 16, fontWeight: 700,
                border: "none", cursor: checkoutLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s, box-shadow 0.15s",
                boxShadow: checkoutLoading ? "none" : "0 4px 16px rgba(107,92,231,0.3)",
              }}
              onMouseEnter={e => {
                if (!checkoutLoading) {
                  e.currentTarget.style.background = "#5A4BD6";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(107,92,231,0.45)";
                }
              }}
              onMouseLeave={e => {
                if (!checkoutLoading) {
                  e.currentTarget.style.background = PURPLE;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(107,92,231,0.3)";
                }
              }}
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
              background: PURPLE, color: "#fff",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 16, fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
            }}>
              Começar gratuitamente <Arrow />
            </a>
          )}
        </div>

        {checkoutError && (
          <div style={{
            marginTop: 16,
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: "#DC2626",
          }}>
            {checkoutError}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SolutionPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 30%, #EEF0FF 60%, #F5F0FF 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: DARK,
    }}>
      {/* Header */}
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
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="solution-detail-header" textColor={DARK} />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[["Explorar", "/solucoes"], ["Preços", "#"], ["Como funciona", "#"], ["Para Criadores", "#"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link">{label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/login" style={{
              borderRadius: 999, padding: "8px 18px",
              fontSize: 14, fontWeight: 500,
              textDecoration: "none", color: DARK,
              border: "1.5px solid rgba(0,0,0,0.14)",
              background: "transparent",
            }}>
              Entrar
            </a>
            <a href="/cadastro" style={{
              borderRadius: 999, padding: "9px 20px",
              fontSize: 14, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none",
              background: DARK, color: "#fff",
            }}>
              Criar conta <Arrow />
            </a>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <SolutionDetail />
      </Suspense>
    </div>
  );
}
