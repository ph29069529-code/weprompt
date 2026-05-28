"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  { id: "all",      label: "Todas 64" },
  { id: "active",   label: "Ativas 40" },
  { id: "pending",  label: "Pendentes 22" },
  { id: "rejected", label: "Rejeitadas" },
];

const SOLUTIONS = [
  { name: "Assistente de E-mails Pro", category: "Automação",   status: "active",   price: "R$ 97,00",  sales: 34, submittedAt: "Ativo" },
  { name: "ChatBot WhatsApp",          category: "Chatbots",    status: "active",   price: "R$ 147,00", sales: 28, submittedAt: "Ativo" },
  { name: "Gerador de Conteúdo",       category: "Marketing",   status: "pending",  price: "R$ 67,00",  sales: 0,  submittedAt: "Enviado ontem" },
  { name: "CRM Inteligente",           category: "Vendas",      status: "active",   price: "R$ 197,00", sales: 15, submittedAt: "Ativo" },
  { name: "Analytics Dashboard",       category: "Análise",     status: "active",   price: "R$ 127,00", sales: 21, submittedAt: "Ativo" },
  { name: "Bot de Prospecção",         category: "Vendas",      status: "pending",  price: "R$ 87,00",  sales: 0,  submittedAt: "Enviado 2 dias atrás" },
  { name: "Resumidor de Reuniões",     category: "Produtividade", status: "active", price: "R$ 57,00",  sales: 9,  submittedAt: "Ativo" },
  { name: "Gerador de Contratos",      category: "Jurídico",    status: "rejected", price: "R$ 77,00",  sales: 0,  submittedAt: "Enviado 3 dias atrás" },
  { name: "Agente de Suporte",         category: "Atendimento", status: "pending",  price: "R$ 117,00", sales: 0,  submittedAt: "Enviado 3 dias atrás" },
];

const GRADIENTS = {
  Automação:    "linear-gradient(135deg, #1e3a5f, #2563EB)",
  Chatbots:     "linear-gradient(135deg, #1a1a2e, #7c3aed)",
  Marketing:    "linear-gradient(135deg, #1e3a5f, #0891b2)",
  Vendas:       "linear-gradient(135deg, #14532d, #16a34a)",
  Análise:      "linear-gradient(135deg, #1e1b4b, #4f46e5)",
  Produtividade:"linear-gradient(135deg, #1c1917, #78716c)",
  Jurídico:     "linear-gradient(135deg, #1c1917, #b45309)",
  Atendimento:  "linear-gradient(135deg, #1e3a5f, #0369A1)",
};

const STATUS_DOT = {
  active:   "#22c55e",
  pending:  "#f97316",
  rejected: "#ef4444",
};

const STATUS_BADGE = {
  active:   { background: "#dcfce7", color: "#16a34a", label: "Ativa" },
  pending:  { background: "#fef3c7", color: "#d97706", label: "Pendente" },
  rejected: { background: "#fee2e2", color: "#dc2626", label: "Rejeitada" },
};

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

function SolutionCard({ solution }) {
  const [hovered, setHovered] = useState(false);
  const badge = STATUS_BADGE[solution.status];
  const showClock = solution.status === "pending" || solution.status === "rejected";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        position: "relative",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      {/* Status dot */}
      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 999,
        background: STATUS_DOT[solution.status],
        zIndex: 2,
        boxShadow: "0 0 0 2px white",
      }} />

      {/* Thumbnail */}
      <div style={{
        height: 120,
        background: GRADIENTS[solution.category] || GRADIENTS.Atendimento,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}>
        <span style={{
          color: "white",
          fontSize: 13,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.4,
          opacity: 0.95,
        }}>
          {solution.name}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: 16 }}>
        {/* Badges */}
        <div>
          <span style={{
            background: "#f3f4f6",
            color: "#374151",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            display: "inline-block",
          }}>
            {solution.category}
          </span>
          <span style={{
            marginLeft: 6,
            background: badge.background,
            color: badge.color,
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 999,
            padding: "3px 8px",
            display: "inline-inline-flex",
            alignItems: "center",
            gap: 3,
          }}>
            {badge.label}
          </span>
        </div>

        {/* Name */}
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 8, lineHeight: 1.35 }}>
          {solution.name}
        </div>

        {/* Price + Sales */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{solution.price}</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{solution.sales} vendas</span>
        </div>

        {/* Submitted at */}
        <div style={{
          fontSize: 11,
          color: "#9ca3af",
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          {showClock && <ClockIcon size={11} />}
          {solution.submittedAt}
        </div>
      </div>

      {/* Card Footer */}
      <div style={{
        borderTop: "1px solid #f3f4f6",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#374151",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "inherit",
        }}>
          <PencilIcon /> Editar
        </button>
        <button style={{
          fontSize: 18,
          color: "#9ca3af",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: "0 4px",
          lineHeight: 1,
          fontFamily: "inherit",
        }}>
          •••
        </button>
      </div>
    </div>
  );
}

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

export default function SolucoesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = activeFilter === "all"
    ? SOLUTIONS
    : SOLUTIONS.filter(s => s.status === activeFilter);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <img src="/logo-icon.png" alt="WePrompt" style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }} />

        <div style={{
          display: "flex",
          alignItems: "center",
          background: searchFocused ? "white" : "#f3f4f6",
          borderRadius: 8,
          padding: "8px 16px",
          width: 360,
          gap: 8,
          border: searchFocused ? "1px solid #2563EB" : "1px solid transparent",
          boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          transition: "all 0.2s ease",
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Buscar soluções..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Marketplace ▾</button>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Vender ▾</button>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: 999, position: "absolute", top: -2, right: -2 }} />
          </button>
          <div style={{
            width: 32, height: 32, background: "#7c3aed", borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>C</div>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        display: "flex",
        gap: 0,
      }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => {
              if (i === 0) { router.push("/dashboard/criador"); return; }
              setActiveTab(i);
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14,
              padding: "14px 20px 14px 0",
              marginRight: 8,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              border: "none",
              borderBottom: activeTab === i ? "2px solid #111827" : "2px solid transparent",
              background: "transparent",
              color: activeTab === i ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: activeTab === i ? 600 : 400,
              marginBottom: -1,
              transition: "color 0.15s ease",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
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
          <button style={{
            background: "#111827", color: "white", borderRadius: 8,
            padding: "9px 18px", fontSize: 14, fontWeight: 600,
            border: "none", cursor: "pointer",
          }}>
            + Nova Solução
          </button>
        </div>

        {/* FILTER PILLS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  background: isActive ? "#111827" : "white",
                  color: isActive ? "white" : "#374151",
                  borderRadius: 999,
                  padding: "7px 18px",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? "none" : "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* SOLUTIONS GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {filtered.map((s, i) => (
            <SolutionCard key={i} solution={s} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "64px 32px",
            color: "#9ca3af",
            fontSize: 14,
          }}>
            Nenhuma solução encontrada para este filtro.
          </div>
        )}

      </div>
    </div>
  );
}
