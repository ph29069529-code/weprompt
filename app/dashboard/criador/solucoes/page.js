"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const GRADIENTS = {
  atendimento:  "linear-gradient(135deg, #6366F1, #6366F1)",
  emails:       "linear-gradient(135deg, #6366F1, #6366F1)",
  vendas:       "linear-gradient(135deg, #6366F1, #6366F1)",
  dados:        "linear-gradient(135deg, #1e1b4b, #4f46e5)",
  whatsapp:     "linear-gradient(135deg, #6366F1, #6366F1)",
  marketing:    "linear-gradient(135deg, #6366F1, #6366F1)",
  outro:        "linear-gradient(135deg, #1c1917, #78716c)",
  Automação:    "linear-gradient(135deg, #6366F1, #6366F1)",
  Chatbots:     "linear-gradient(135deg, #0A0F1E, #6366F1)",
  Marketing:    "linear-gradient(135deg, #6366F1, #6366F1)",
  Vendas:       "linear-gradient(135deg, #6366F1, #6366F1)",
  Análise:      "linear-gradient(135deg, #1e1b4b, #4f46e5)",
  Atendimento:  "linear-gradient(135deg, #6366F1, #6366F1)",
};

const STATUS_DOT = {
  approved: "#6366F1",
  pending:  "#6366F1",
  draft:    "#9ca3af",
  rejected: "#ef4444",
};

const STATUS_BADGE = {
  approved: { background: "rgba(99,102,241,0.08)", color: "#6366F1", label: "Aprovada" },
  pending:  { background: "#fef3c7", color: "#d97706", label: "Pendente" },
  draft:    { background: "#f3f4f6", color: "#6b7280", label: "Rascunho" },
  rejected: { background: "#fee2e2", color: "#dc2626", label: "Rejeitada" },
};

const fmtBRL = v =>
  `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ClockIcon = ({ size = 12 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>
);

function SolutionCard({ solution, router }) {
  const [hovered, setHovered] = useState(false);
  const badge = STATUS_BADGE[solution.status] || STATUS_BADGE.draft;
  const dot = STATUS_DOT[solution.status] || "#9ca3af";
  const showClock = solution.status === "pending" || solution.status === "rejected";
  const gradient = GRADIENTS[solution.categoria] || GRADIENTS.outro;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", position: "relative", transform: hovered ? "translateY(-2px)" : "translateY(0)", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s ease" }}
    >
      {/* Status dot */}
      <div style={{ position: "absolute", top: 12, right: 12, width: 10, height: 10, borderRadius: 999, background: dot, zIndex: 2, boxShadow: "0 0 0 2px white" }} />

      {/* Thumbnail */}
      <div style={{ height: 120, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <span style={{ color: "white", fontSize: 13, fontWeight: 700, textAlign: "center", lineHeight: 1.4, opacity: 0.95 }}>
          {solution.titulo}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: 16 }}>
        <div>
          <span style={{ background: "#f3f4f6", color: "#374151", borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "3px 8px", display: "inline-block" }}>
            {solution.categoria || "Geral"}
          </span>
          <span style={{ marginLeft: 6, background: badge.background, color: badge.color, fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 8px", display: "inline-block" }}>
            {badge.label}
          </span>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 8, lineHeight: 1.35 }}>
          {solution.titulo}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{fmtBRL(solution.preco)}</span>
        </div>

        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          {showClock && <ClockIcon size={11} />}
          {fmtDate(solution.created_at)}
        </div>
      </div>

      {/* Card Footer */}
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>
          <PencilIcon /> Editar
        </button>
      </div>
    </div>
  );
}

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

export default function SolucoesPage() {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data, error: fetchErr } = await supabase
        .from("solutions")
        .select("id, titulo, categoria, preco, status, created_at, payment_type")
        .eq("creator_id", session.user.id)
        .order("created_at", { ascending: false });

      if (fetchErr) {
        setError("Não foi possível carregar os dados. Tente recarregar a página.");
      } else {
        setSolutions(data || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const counts = {
    all:      solutions.length,
    approved: solutions.filter(s => s.status === "approved").length,
    pending:  solutions.filter(s => s.status === "pending").length,
    rejected: solutions.filter(s => s.status === "rejected").length,
  };

  const FILTERS = [
    { id: "all",      label: `Todas ${counts.all}` },
    { id: "approved", label: `Ativas ${counts.approved}` },
    { id: "pending",  label: `Pendentes ${counts.pending}` },
    { id: "rejected", label: `Rejeitadas ${counts.rejected}` },
  ];

  const filtered = activeFilter === "all"
    ? solutions
    : solutions.filter(s => s.status === activeFilter);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 0) router.push("/dashboard/criador");
              else if (i === 2) router.push("/dashboard/criador/vendas");
              else if (i === 3) router.push("/dashboard/criador/configuracoes");
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{ fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", border: "none", borderBottom: i === 1 ? "2px solid #111827" : "2px solid transparent", background: "transparent", color: i === 1 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280", fontWeight: i === 1 ? 600 : 400, marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap" }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px" }}>

        {/* TITLE ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Minhas Soluções</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Gerencie e acompanhe todas as suas soluções.
            </p>
          </div>
          <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
            + Nova Solução
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#B91C1C", marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* FILTER PILLS */}
        {!loading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {FILTERS.map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  style={{ background: isActive ? "#111827" : "white", color: isActive ? "white" : "#374151", borderRadius: 999, padding: "7px 18px", fontSize: 14, fontWeight: isActive ? 600 : 400, border: isActive ? "none" : "1px solid #e5e7eb", cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit" }}>
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 32px", color: "#9ca3af", fontSize: 14 }}>
            Carregando suas soluções…
          </div>
        ) : solutions.length === 0 ? (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "64px 24px", textAlign: "center" }}>
            <svg width="48" height="48" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 16px", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nenhuma solução publicada ainda.</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Clique em + Nova Solução para começar.</div>
            <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              + Nova Solução
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {filtered.map(s => (
                <SolutionCard key={s.id} solution={s} router={router} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 32px", color: "#9ca3af", fontSize: 14 }}>
                Nenhuma solução neste filtro.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
