"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";

const CATEGORIES = ["Todos", "Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      padding: "24px",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{ width: 80, height: 22, borderRadius: 6, background: "#E5E7EB", marginBottom: 16 }} />
      <div style={{ width: "70%", height: 20, borderRadius: 6, background: "#E5E7EB", marginBottom: 10 }} />
      <div style={{ width: "100%", height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 6 }} />
      <div style={{ width: "85%", height: 14, borderRadius: 4, background: "#E5E7EB", marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 90, height: 18, borderRadius: 4, background: "#E5E7EB" }} />
        <div style={{ width: 110, height: 36, borderRadius: 8, background: "#E5E7EB" }} />
      </div>
    </div>
  );
}

function SolutionCard({ solution }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(107,92,231,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Category badge */}
      <span style={{
        display: "inline-block",
        background: `${PURPLE}12`,
        color: PURPLE,
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 99,
        alignSelf: "flex-start",
        letterSpacing: "0.2px",
      }}>
        {solution.categoria}
      </span>

      {/* Title */}
      <h2 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: 0, lineHeight: 1.3 }}>
        {solution.titulo}
      </h2>

      {/* Description */}
      <p style={{
        fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        flex: 1,
      }}>
        {solution.descricao}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>
          {solution.preco != null
            ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`
            : "Gratuito"}
        </span>
        <a
          href={`/solucoes/${solution.id}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: PURPLE, color: "#fff",
            padding: "9px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#5A4BD6")}
          onMouseLeave={e => (e.currentTarget.style.background = PURPLE)}
        >
          Ver solução <Arrow />
        </a>
      </div>
    </div>
  );
}

export default function SolucoesPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    async function fetchSolutions() {
      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (!error && data) setSolutions(data);
      setLoading(false);
    }
    fetchSolutions();
  }, []);

  const filtered = activeCategory === "Todos"
    ? solutions
    : solutions.filter(s => s.categoria === activeCategory);

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
            <WePromptLogo id="solucoes-header" textColor={DARK} />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[["Explorar", "/solucoes"], ["Preços", "#"], ["Como funciona", "#"], ["Para Criadores", "#"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link"
                style={label === "Explorar" ? { color: PURPLE, fontWeight: 600 } : {}}
              >
                {label}
              </a>
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

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Soluções de IA
          </h1>
          <p style={{ fontSize: 16, color: GRAY, margin: 0 }}>
            Descubra ferramentas e agentes de IA prontos para usar no seu negócio.
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: 99,
                border: `1.5px solid ${activeCategory === cat ? PURPLE : "rgba(0,0,0,0.12)"}`,
                background: activeCategory === cat ? `${PURPLE}10` : "#fff",
                color: activeCategory === cat ? PURPLE : GRAY,
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff", borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
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
                  background: PURPLE, color: "#fff",
                  border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Ver todas as soluções
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map(s => <SolutionCard key={s.id} solution={s} />)}
          </div>
        )}
      </main>
    </div>
  );
}
