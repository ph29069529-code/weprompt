"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

function SolutionCard({ solution, router }) {
  const [hov, setHov] = useState(false);

  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Gratuito";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => router.push(`/solucoes/${solution.id}`)}
      style={{
        background: "#fff",
        borderRadius: 20,
        border: `1px solid ${hov ? "rgba(99,102,241,0.3)" : "#E5E7EB"}`,
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover */}
      <div style={{ height: 180, flexShrink: 0, overflow: "hidden" }}>
        {solution.cover_url ? (
          <img
            src={solution.cover_url}
            alt={solution.titulo}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hov ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.4s ease",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: "#EEF2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 36, color: "#6366F1", opacity: 0.35 }}>✦</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        {solution.categoria && (
          <span style={{
            display: "inline-block",
            background: "#F3F4F6",
            color: "#374151",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 999,
            padding: "3px 10px",
            marginBottom: 10,
            alignSelf: "flex-start",
          }}>
            {solution.categoria}
          </span>
        )}

        <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E", flex: 1, lineHeight: 1.4 }}>
          {solution.titulo}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#0A0F1E" }}>
            {priceLabel}
          </span>
          <span style={{
            background: hov ? "#4F46E5" : "#0A0F1E",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            transition: "background 0.2s",
          }}>
            Ver solução →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SolutionsShowcase() {
  const router = useRouter();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("solutions")
      .select("id, titulo, categoria, preco, cover_url")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setSolutions(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{
      padding: "100px 48px",
      background: "#F8F9FB",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @keyframes skelPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6366F1",
            marginBottom: 12,
          }}>
            Catálogo
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0A0F1E",
            marginBottom: 16,
          }}>
            Soluções prontas para usar.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
            Escolha, ative e comece a usar em minutos.
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                animation: "skelPulse 1.5s ease-in-out infinite",
              }}>
                <div style={{ height: 180, background: "#F3F4F6" }} />
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ width: 72, height: 22, borderRadius: 999, background: "#F3F4F6", marginBottom: 12 }} />
                  <div style={{ width: "75%", height: 18, borderRadius: 6, background: "#F3F4F6", marginBottom: 16 }} />
                  <div style={{ width: "45%", height: 16, borderRadius: 4, background: "#F3F4F6" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && solutions.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {solutions.map(s => (
              <SolutionCard key={s.id} solution={s} router={router} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && solutions.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: "#6366F1", opacity: 0.2 }}>✦</div>
            <div style={{ fontSize: 15, color: "#9CA3AF" }}>
              Nenhuma solução disponível no momento.
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <button
            onClick={() => router.push("/solucoes")}
            style={{
              background: "#0A0F1E",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 40px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#6366F1"}
            onMouseLeave={e => e.currentTarget.style.background = "#0A0F1E"}
          >
            Ver todas as soluções →
          </button>
        </div>
      </div>
    </section>
  );
}
