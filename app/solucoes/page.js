"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const BORDER = "rgba(255,255,255,0.1)";
const TEXT2 = "rgba(255,255,255,0.6)";

const CATEGORIES = ["Todos", "Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", flexShrink: 0 }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${BORDER}`,
      borderRadius: 16, padding: "24px",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ width: 80, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
      <div style={{ width: "70%", height: 20, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 10 }} />
      <div style={{ width: "100%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 6 }} />
      <div style={{ width: "85%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 90, height: 18, borderRadius: 4, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ width: 110, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)" }} />
      </div>
    </div>
  );
}

function SolutionCard({ solution, index = 0 }) {
  const isOneTime = solution.payment_type === "one_time";
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(107,92,231,0.5)";
        e.currentTarget.style.boxShadow = "0 0 30px rgba(107,92,231,0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.boxShadow = "none";
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
            background: `linear-gradient(135deg, rgba(107,92,231,0.2) 0%, rgba(139,92,246,0.1) 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 36, opacity: 0.25 }}>✦</span>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{
          display: "inline-block",
          background: "rgba(107,92,231,0.2)", color: "#a78bfa",
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
          alignSelf: "flex-start", letterSpacing: "0.2px",
        }}>
          {solution.categoria}
        </span>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.35 }}>
          {solution.titulo}
        </h2>

        <p style={{
          fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.6, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {solution.preco != null
                ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "Gratuito"}
            </span>
            {solution.preco != null && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
                background: isOneTime ? "rgba(74,222,128,0.15)" : "rgba(107,92,231,0.2)",
                color: isOneTime ? "#4ade80" : "#a78bfa",
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
    <div style={{ minHeight: "100vh", color: "#fff" }}>

      <header style={{
        position: "sticky", top: 0, zIndex: 50,
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
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="solucoes-header" />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[["Explorar", "/solucoes"], ["Preços", "#"], ["Como funciona", "#"], ["Para Criadores", "#"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link"
                style={label === "Explorar" ? { color: "#a78bfa", fontWeight: 600 } : {}}
              >
                {label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/login" style={{
              borderRadius: 999, padding: "8px 18px",
              fontSize: 14, fontWeight: 500,
              textDecoration: "none", color: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              background: "transparent",
            }}>
              Entrar
            </a>
            <a href="/cadastro" style={{
              borderRadius: 999, padding: "9px 20px",
              fontSize: 14, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none",
              background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
              color: "#fff",
            }}>
              Criar conta <Arrow />
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Soluções de IA
          </h1>
          <p style={{ fontSize: 16, color: TEXT2, margin: 0 }}>
            Descubra ferramentas e agentes de IA prontos para usar no seu negócio.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px", borderRadius: 99, fontFamily: "inherit",
                border: `1.5px solid ${activeCategory === cat ? PURPLE : "rgba(255,255,255,0.15)"}`,
                background: activeCategory === cat ? "rgba(107,92,231,0.25)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat ? "#a78bfa" : TEXT2,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>✦</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              {activeCategory === "Todos" ? "Nenhuma solução disponível ainda" : `Nenhuma solução em "${activeCategory}"`}
            </h2>
            <p style={{ fontSize: 14, color: TEXT2, marginBottom: 24 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map((s, i) => <SolutionCard key={s.id} solution={s} index={i} />)}
          </div>
        )}
      </main>
    </div>
  );
}
