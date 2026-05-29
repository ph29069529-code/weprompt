"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";

const CATEGORY_GRADIENTS = {
  "Agentes de IA":    "linear-gradient(135deg, #1e3a5f, #2563EB)",
  "Marketing IA":     "linear-gradient(135deg, #1e1b4b, #7c3aed)",
  "Automação":        "linear-gradient(135deg, #14532d, #16a34a)",
  "Chatbots":         "linear-gradient(135deg, #1a1a2e, #0891b2)",
  "Análise de Dados": "linear-gradient(135deg, #1e1b4b, #4f46e5)",
  "Copywriting IA":   "linear-gradient(135deg, #1c1917, #b45309)",
  "Integrações":      "linear-gradient(135deg, #1e3a5f, #0369A1)",
  "WhatsApp IA":      "linear-gradient(135deg, #14532d, #25D366)",
};

const PAYMENT_BADGE = {
  "Único":  { bg: "rgba(22,163,74,0.12)",  color: "#15803D" },
  "Mensal": { bg: "rgba(3,105,161,0.12)",  color: "#0369A1" },
  "Anual":  { bg: "rgba(124,58,237,0.12)", color: "#6d28d9" },
};

function paymentLabel(payment_type) {
  if (payment_type === "one_time") return "Único";
  if (payment_type === "annual")   return "Anual";
  return "Mensal";
}

function StarRating({ rating, count }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= full ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 3 }}>({count})</span>
    </div>
  );
}

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

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid #f3f4f6",
      overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ height: 180, background: BG_GRAY }} />
      <div style={{ padding: 20 }}>
        <div style={{ width: 70, height: 18, borderRadius: 99, background: "#e0f2fe", marginBottom: 14 }} />
        <div style={{ width: "80%", height: 18, borderRadius: 6, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
        <div style={{ width: "100%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 6 }} />
        <div style={{ width: "70%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 18 }} />
        <div style={{ width: 80, height: 22, borderRadius: 4, background: "rgba(0,0,0,0.06)" }} />
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 20px" }}>
        <div style={{ width: "100%", height: 38, borderRadius: 8, background: "#e0f2fe" }} />
      </div>
    </div>
  );
}

function SolutionCard({ solution }) {
  const gradient    = CATEGORY_GRADIENTS[solution.categoria] || "linear-gradient(135deg, #1e3a5f, #2563EB)";
  const label       = paymentLabel(solution.payment_type);
  const badge       = PAYMENT_BADGE[label] || PAYMENT_BADGE["Mensal"];
  const creatorName = solution.criador_nome || solution.autor || null;
  const hasRating   = solution.avg_rating > 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 180, position: "relative", flexShrink: 0, overflow: "hidden" }}>
        {solution.cover_url ? (
          <img
            src={solution.cover_url}
            alt={solution.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, boxSizing: "border-box",
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.4 }}>
              {solution.titulo}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Badges */}
        <div>
          <span style={{
            display: "inline-block",
            background: "#eff6ff", color: "#0369A1",
            borderRadius: 999, fontSize: 11, fontWeight: 600,
            padding: "3px 10px",
          }}>
            {solution.categoria}
          </span>
          <span style={{
            display: "inline-block", marginLeft: 6,
            background: badge.bg, color: badge.color,
            borderRadius: 999, fontSize: 11, fontWeight: 600,
            padding: "3px 10px",
          }}>
            {label}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 10, lineHeight: 1.35, margin: "10px 0 0" }}>
          {solution.titulo}
        </h2>

        {/* Description — 2-line clamp */}
        <p style={{
          fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {solution.descricao}
        </p>

        {/* Creator row */}
        {creatorName && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999,
              background: "#dbeafe", color: "#2563EB",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {creatorName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{creatorName}</span>
          </div>
        )}

        {/* Bottom row: price + stars */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#0369A1" }}>
            {solution.preco != null
              ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Gratuito"}
          </span>
          {hasRating && (
            <StarRating rating={solution.avg_rating} count={solution.rating_count || 0} />
          )}
        </div>
      </div>

      {/* Card footer */}
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 20px" }}>
        <a
          href={`/solucoes/${solution.id}`}
          style={{
            display: "block", width: "100%", boxSizing: "border-box",
            background: "#0369A1", color: "#fff",
            borderRadius: 8, padding: "10px",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            textAlign: "center",
            transition: "background 0.15s",
            cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#0284c7"}
          onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
        >
          Ver solução →
        </a>
      </div>
    </div>
  );
}

export default function SolucoesPage() {
  const [solutions, setSolutions]           = useState([]);
  const [categories, setCategories]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery]       = useState("");
  const width    = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    supabase.from("categories").select("nome, icone, cor").order("nome")
      .then(({ data }) => { if (data) setCategories(data); });
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

  const filtered = solutions.filter(s => {
    const matchCat = activeCategory === "Todos" || s.categoria === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q
      || s.titulo?.toLowerCase().includes(q)
      || s.descricao?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const cols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <div style={{ minHeight: "100vh", color: NEAR_BLACK, background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* HEADER */}
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
            fontSize: 52, fontWeight: 800, color: NEAR_BLACK,
            letterSpacing: isMobile ? "-1px" : "-2px",
            lineHeight: 1.06, margin: "0 0 20px",
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

      {/* FILTER + GRID */}
      <section style={{
        background: BG_GRAY,
        paddingTop: 0,
        paddingBottom: isMobile ? 72 : 112,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Search bar */}
          <div style={{ paddingTop: isMobile ? 32 : 48, paddingBottom: 20 }}>
            <div style={{ position: "relative", maxWidth: 600 }}>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar soluções de IA..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "14px 44px 14px 44px",
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 12, fontSize: 15, color: NEAR_BLACK,
                  outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "#e5e7eb", border: "none", borderRadius: "50%",
                    width: 22, height: 22, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    color: GRAY_TEXT, display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                  aria-label="Limpar busca"
                >×</button>
              )}
            </div>
          </div>

          {/* Filter pills — no emojis */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: isMobile ? 32 : 48 }}>
            {[{ nome: "Todos" }, ...categories].map(cat => {
              const isActive = activeCategory === cat.nome;
              return (
                <button
                  key={cat.nome}
                  onClick={() => setActiveCategory(cat.nome)}
                  style={{
                    padding: "7px 18px", borderRadius: 999,
                    fontFamily: "inherit",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    border: isActive ? "none" : "1px solid #e5e7eb",
                    background: isActive ? "#0369A1" : "#fff",
                    color: isActive ? "#fff" : "#374151",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#fff"; }}
                >
                  {cat.nome}
                </button>
              );
            })}
          </div>

          {/* Result count */}
          {searchQuery.trim() && !loading && (
            <div style={{ fontSize: 14, color: GRAY_TEXT, marginBottom: 20 }}>
              <strong style={{ color: NEAR_BLACK }}>{filtered.length}</strong>{" "}
              resultado{filtered.length !== 1 ? "s" : ""} para{" "}
              <strong style={{ color: NEAR_BLACK }}>"{searchQuery.trim()}"</strong>
            </div>
          )}

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
                {searchQuery.trim()
                  ? `Nenhum resultado para "${searchQuery.trim()}"`
                  : activeCategory === "Todos"
                    ? "Nenhuma solução disponível ainda"
                    : `Nenhuma solução em "${activeCategory}"`}
              </h2>
              <p style={{ fontSize: 15, color: GRAY_TEXT, marginBottom: 28, lineHeight: 1.6 }}>
                {searchQuery.trim()
                  ? "Tente outras palavras-chave ou explore por categoria."
                  : activeCategory === "Todos"
                    ? "Em breve teremos soluções incríveis de IA para você explorar."
                    : "Tente outra categoria ou explore todas as soluções disponíveis."}
              </p>
              {(activeCategory !== "Todos" || searchQuery.trim()) && (
                <button
                  onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}
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
