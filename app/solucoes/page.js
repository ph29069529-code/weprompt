"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";

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

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ height: 200, background: BG_GRAY }} />
      <div style={{ padding: 20 }}>
        <div style={{ width: 70, height: 20, borderRadius: 99, background: "#e0f2fe", marginBottom: 14 }} />
        <div style={{ width: "80%", height: 20, borderRadius: 6, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
        <div style={{ width: "100%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 6 }} />
        <div style={{ width: "70%", height: 13, borderRadius: 4, background: "rgba(0,0,0,0.04)", marginBottom: 18 }} />
        <div style={{ width: 80, height: 24, borderRadius: 4, background: "rgba(0,0,0,0.06)", marginBottom: 16 }} />
        <div style={{ width: "100%", height: 42, borderRadius: 12, background: "#e0f2fe" }} />
      </div>
    </div>
  );
}

function SolutionCard({ solution }) {
  const isOneTime = solution.payment_type === "one_time";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(3,105,161,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image area */}
      <div style={{ height: 200, flexShrink: 0, overflow: "hidden" }}>
        {solution.cover_url ? (
          <img
            src={solution.cover_url}
            alt={solution.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 40, opacity: 0.25, color: BLUE }}>✦</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Category */}
        <span style={{
          display: "inline-block", alignSelf: "flex-start",
          background: "#e0f2fe", color: BLUE,
          fontSize: 12, fontWeight: 600,
          padding: "3px 10px", borderRadius: 999,
          letterSpacing: "0.01em",
        }}>
          {solution.categoria}
        </span>

        {/* Title */}
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: NEAR_BLACK,
          margin: "12px 0 0", lineHeight: 1.35,
        }}>
          {solution.titulo}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 14, color: GRAY_TEXT,
          margin: "8px 0 0", lineHeight: 1.5, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: BLUE }}>
            {solution.preco != null
              ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Gratuito"}
          </span>
          {solution.preco != null && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: isOneTime ? "rgba(22,163,74,0.1)" : "rgba(3,105,161,0.1)",
              color: isOneTime ? "#15803D" : BLUE,
            }}>
              {isOneTime ? "Único" : "Mensal"}
            </span>
          )}
        </div>

        {/* CTA button */}
        <a
          href={`/solucoes/${solution.id}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: BLUE, color: "#fff",
            borderRadius: 12, padding: "12px",
            marginTop: 16,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
          onMouseLeave={e => e.currentTarget.style.background = BLUE}
        >
          Ver solução <Arrow />
        </a>
      </div>
    </div>
  );
}

export default function SolucoesPage() {
  const [solutions, setSolutions]         = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery]     = useState("");
  const width      = useWindowSize();
  const isMobile   = width < 768;
  const isTablet   = width >= 768 && width < 1024;

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

      {/* ── HEADER SECTION ── */}
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
            fontSize: isMobile ? "clamp(36px, 8vw, 52px)" : "clamp(48px, 6vw, 72px)",
            fontWeight: 800, color: NEAR_BLACK,
            letterSpacing: isMobile ? "-1px" : "-2px",
            lineHeight: 1.06, marginBottom: 20, margin: "0 0 20px",
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

      {/* ── FILTER + GRID ── */}
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
            <div style={{ position: "relative", maxWidth: 560 }}>
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

          {/* Filter bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            paddingBottom: isMobile ? 32 : 48,
          }}>
            {[{ nome: "Todos", icone: null }, ...categories].map(cat => (
              <button
                key={cat.nome}
                onClick={() => setActiveCategory(cat.nome)}
                style={{
                  padding: "9px 20px", borderRadius: 999,
                  fontFamily: "inherit",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeCategory === cat.nome ? BLUE : "#e5e7eb",
                  background: activeCategory === cat.nome ? BLUE : BG_GRAY,
                  color: activeCategory === cat.nome ? "#fff" : GRAY_TEXT,
                  transition: "all 0.15s",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat.nome) {
                    e.currentTarget.style.background = "#e0f2fe";
                    e.currentTarget.style.borderColor = "#bae6fd";
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat.nome) {
                    e.currentTarget.style.background = BG_GRAY;
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }
                }}
              >
                {cat.icone && <span style={{ fontSize: 14, lineHeight: 1 }}>{cat.icone}</span>}
                {cat.nome}
              </button>
            ))}
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
