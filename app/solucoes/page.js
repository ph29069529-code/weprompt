"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const BLUE   = "#0369A1";
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
      background: "#fff", borderRadius: 16,
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
        <div style={{ width: "100%", height: 36, borderRadius: 8, background: "#e0f2fe" }} />
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
        border: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 180, flexShrink: 0, overflow: "hidden" }}>
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
            background: "#111827", color: "#fff",
            borderRadius: 8, padding: "10px",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            textAlign: "center", transition: "background 0.15s", cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#374151"}
          onMouseLeave={e => e.currentTarget.style.background = "#111827"}
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
  const [navSearchFocused, setNavSearchFocused] = useState(false);

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
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q
      || s.titulo?.toLowerCase().includes(q)
      || s.descricao?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <img src="/logo-icon.png" alt="WePrompt" style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }} />
        </a>

        {/* Center search */}
        <div style={{
          display: "flex", alignItems: "center",
          background: navSearchFocused ? "#fff" : "#f3f4f6",
          borderRadius: 8, padding: "8px 16px",
          width: 360, gap: 8,
          border: navSearchFocused ? "1px solid #2563EB" : "1px solid transparent",
          boxShadow: navSearchFocused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          transition: "all 0.2s ease",
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Buscar soluções..."
            onFocus={() => setNavSearchFocused(true)}
            onBlur={() => setNavSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }}
          />
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/solucoes" style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", textDecoration: "none" }}>Marketplace</a>
          <a href="/criadores" style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", textDecoration: "none" }}>Vender</a>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          {/* Cart */}
          <button onClick={() => window.__openCart?.()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          {/* Bell */}
          <button onClick={() => window.__openNotif?.()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: 999, position: "absolute", top: -2, right: -2 }} />
          </button>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, background: "#0369A1", borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            W
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "32px 48px" }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Soluções de IA</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Descubra ferramentas e agentes de IA curados, prontos para usar no seu negócio.
            </p>
          </div>
          {/* Inline search */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar soluções..."
            style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "9px 16px", width: 320, fontSize: 14,
              color: "#111827", outline: "none", fontFamily: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[{ nome: "Todos" }, ...categories].map(cat => {
            const isActive = activeCategory === cat.nome;
            return (
              <button
                key={cat.nome}
                onClick={() => setActiveCategory(cat.nome)}
                style={{
                  padding: "7px 18px", borderRadius: 999,
                  fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", border: isActive ? "none" : "1px solid #e5e7eb",
                  background: isActive ? "#111827" : "#fff",
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
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
            {(activeCategory !== "Todos" || searchQuery.trim()) && (
              <button
                onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}
                style={{
                  background: "#111827", color: "#fff", border: "none",
                  borderRadius: 8, padding: "10px 24px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#374151"}
                onMouseLeave={e => e.currentTarget.style.background = "#111827"}
              >
                Ver todas as soluções
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map(s => <SolutionCard key={s.id} solution={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
