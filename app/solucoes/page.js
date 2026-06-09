"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const BLUE   = "#6366F1";
const BORDER = "#e5e7eb";

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
  "Único":  { bg: "#f3f4f6", color: "#374151" },
  "Mensal": { bg: "#f3f4f6", color: "#374151" },
  "Anual":  { bg: "#f3f4f6", color: "#374151" },
};

function getReputationBadge(avgRating, reviewCount) {
  const r = Number(avgRating) || 0;
  const c = reviewCount || 0;
  if (c >= 50 && r >= 4.5) return { icon: "🏆", label: "Elite", color: "#F59E0B" };
  if (c >= 20 && r >= 4.5) return { icon: "💎", label: "Top",   color: "#6366F1" };
  if (c >= 10 && r >= 4.0) return { icon: "🥇", label: "Pro",   color: "#10B981" };
  return null;
}

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
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= full ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 3 }}>({count})</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1px solid #e5e7eb", overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ height: 180, background: "#f3f4f6" }} />
      <div style={{ padding: 20 }}>
        <div style={{ width: 80, height: 18, borderRadius: 99, background: "#e0f2fe", marginBottom: 14 }} />
        <div style={{ width: "80%", height: 16, borderRadius: 6, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
        <div style={{ width: "100%", height: 12, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 6 }} />
        <div style={{ width: "65%", height: 12, borderRadius: 4, background: "rgba(0,0,0,0.04)" }} />
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 20px" }}>
        <div style={{ width: "100%", height: 36, borderRadius: 999, background: "#EEF2FF" }} />
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
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 180, flexShrink: 0, overflow: "hidden", position: "relative" }}>
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
        {/* Oficial WePrompt badge */}
        {solution.creator_id === "00000000-0000-0000-0000-000000000001" && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            color: "white", letterSpacing: "0.05em",
            boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
          }}>
            ✦ Oficial WePrompt
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Badges */}
        <div>
          <span style={{
            display: "inline-block",
            background: "#f3f4f6", color: "#374151",
            borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "3px 10px",
          }}>
            {solution.categoria}
          </span>
          <span style={{
            display: "inline-block", marginLeft: 6,
            background: badge.bg, color: badge.color,
            borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "3px 10px",
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
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {solution.descricao}
        </p>

        {/* Creator row */}
        {creatorName && (
          <a href={solution.creator_id ? `/criadores/${solution.creator_id}` : undefined}
            style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, textDecoration: "none", cursor: solution.creator_id ? "pointer" : "default" }}
            onClick={e => { if (!solution.creator_id) e.preventDefault(); }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999,
              background: "#dbeafe", color: "#2563EB",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {creatorName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{creatorName}</span>
            {(() => {
              const badge = getReputationBadge(solution.avg_rating, solution.review_count);
              return badge ? (
                <span style={{ fontSize: 10, fontWeight: 700, color: badge.color, background: `${badge.color}18`, padding: "1px 7px", borderRadius: 99 }}>
                  {badge.icon} {badge.label}
                </span>
              ) : null;
            })()}
          </a>
        )}

        {/* Price + stars */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            {solution.preco != null
              ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Gratuito"}
          </span>
          {hasRating && (
            <StarRating rating={solution.avg_rating} count={solution.rating_count || 0} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 20px" }}>
        <a
          href={`/solucoes/${solution.id}`}
          style={{
            display: "block", width: "100%", boxSizing: "border-box",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff",
            borderRadius: 999, padding: "10px",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            textAlign: "center", transition: "opacity 0.15s", cursor: "pointer",
            boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
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
  const [tipoFilter, setTipoFilter]         = useState("");
  /* ── Supabase queries (unchanged) ── */
  useEffect(() => {
    supabase.from("categories").select("nome, icone, cor").order("nome")
      .then(({ data }) => { if (data) setCategories(data); });
  }, []);

  useEffect(() => {
    async function fetchSolutions() {
      const { data, error } = await supabase
        .from("solutions").select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (!error && data) setSolutions(data);
      setLoading(false);
    }
    fetchSolutions();
  }, []);

  const filtered = solutions.filter(s => {
    const matchCat = activeCategory === "Todos" || s.categoria === activeCategory;
    const matchTipo = !tipoFilter || s.tipo === tipoFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q
      || s.titulo?.toLowerCase().includes(q)
      || s.descricao?.toLowerCase().includes(q);
    return matchCat && matchTipo && matchSearch;
  });

  return (
    <div style={{ background: "#F8F7FF", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden" }}>
      <Navbar />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .catalog-container { padding: 80px 16px 32px; }
        @media (min-width: 768px) { .catalog-container { padding: 80px 48px 32px; } }
        .catalog-header { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 768px) { .catalog-header { flex-direction: row; justify-content: space-between; align-items: center; gap: 0; } }
        .catalog-search { width: 100%; }
        @media (min-width: 768px) { .catalog-search { width: 320px; } }
        .catalog-grid { display: grid; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .catalog-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
      `}</style>

      {/* ── MAIN CONTENT ── */}
      <div className="catalog-container">

        {/* Header row */}
        <div className="catalog-header" style={{ marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#0A0F1E", letterSpacing: "-0.04em", margin: 0 }}>Soluções de IA</h1>
            <p style={{ fontSize: 15, color: "#6B7280", marginTop: 6, marginBottom: 0 }}>
              Descubra ferramentas e agentes de IA curados, prontos para usar no seu negócio.
            </p>
          </div>
          {/* Inline search */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="catalog-search"
            placeholder="Buscar soluções..."
            style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999,
              padding: "12px 20px", fontSize: 14, minHeight: 44, boxSizing: "border-box",
              color: "#111827", outline: "none", fontFamily: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
            onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {/* Tipo filter — Agente com Integração */}
          {(() => {
            const isActive = tipoFilter === "agente_integracao";
            return (
              <button
                onClick={() => { setTipoFilter(isActive ? "" : "agente_integracao"); setActiveCategory("Todos"); }}
                style={{
                  padding: "12px 18px", borderRadius: 999, minHeight: 44,
                  fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", border: isActive ? "none" : "1px solid #DDD6FE",
                  background: isActive ? "#7C3AED" : "#F5F3FF",
                  color: isActive ? "#fff" : "#7C3AED",
                  transition: "all 0.15s", display: "inline-flex", alignItems: "center",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#EDE9FE"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#F5F3FF"; }}
              >
                ⚡ Agente com Integração
              </button>
            );
          })()}

          {/* Category pills */}
          {[{ nome: "Todos" }, ...categories].map(cat => {
            const isActive = activeCategory === cat.nome && !tipoFilter;
            return (
              <button
                key={cat.nome}
                onClick={() => { setActiveCategory(cat.nome); setTipoFilter(""); }}
                style={{
                  padding: "12px 18px", borderRadius: 999, minHeight: 44,
                  fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", border: isActive ? "none" : "1px solid #e5e7eb",
                  background: isActive ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#fff",
                  color: isActive ? "#fff" : "#374151",
                  boxShadow: isActive ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                  transition: "all 0.15s", display: "inline-flex", alignItems: "center",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F5F3FF"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#fff"; }}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>

        {/* Result count when searching */}
        {searchQuery.trim() && !loading && (
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
            <strong style={{ color: "#111827" }}>{filtered.length}</strong>{" "}
            resultado{filtered.length !== 1 ? "s" : ""} para{" "}
            <strong style={{ color: "#111827" }}>"{searchQuery.trim()}"</strong>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="catalog-grid" style={{ gap: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16, color: BLUE, opacity: 0.2 }}>✦</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {searchQuery.trim()
                ? `Nenhum resultado para "${searchQuery.trim()}"`
                : activeCategory === "Todos"
                  ? "Nenhuma solução disponível ainda"
                  : `Nenhuma solução em "${activeCategory}"`}
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
              {searchQuery.trim()
                ? "Tente outras palavras-chave ou explore por categoria."
                : activeCategory === "Todos"
                  ? "Em breve teremos soluções incríveis de IA para você explorar."
                  : "Tente outra categoria ou explore todas as soluções disponíveis."}
            </p>
            {(activeCategory !== "Todos" || searchQuery.trim() || tipoFilter) && (
              <button
                onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); setTipoFilter(""); }}
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", border: "none",
                  borderRadius: 999, padding: "12px 28px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Ver todas as soluções
              </button>
            )}
          </div>
        ) : (
          <div className="catalog-grid" style={{ gap: 20 }}>
            {filtered.map(s => <SolutionCard key={s.id} solution={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
