"use client";
import { useState, useEffect } from "react";

const TABS = [
  { label: "Dashboard", badge: null },
  { label: "Soluções", badge: "13" },
  { label: "Usuários", badge: null },
  { label: "Solicitações", badge: "3" },
];

const METRICS_ROW1 = [
  { label: "Aguardando Revisão", value: "13", sub: "soluções aguardando aprovação", color: null },
  { label: "Solicitações de Loja", value: "3", sub: "alterações de perfil pendentes", color: null },
  { label: "Total de Usuários", value: "125", sub: "124 criadores", color: null },
  { label: "Soluções Ativas", value: "0", sub: "de 39 no total", color: null },
];

const METRICS_ROW2 = [
  { label: "GMV Total", value: "R$ 0,00", sub: "volume total transacionado", color: null },
  { label: "Taxa de Aprovação", value: "68%", sub: "dos últimos 30 dias", color: "#16a34a" },
  { label: "Novos Usuários", value: "12", sub: "esta semana", color: "#2563EB" },
  { label: "Receita Total", value: "R$ 0,00", sub: "de pedidos concluídos", color: null },
];

const BAR_DATA = [
  { month: "Jan", value: 8 },
  { month: "Fev", value: 15 },
  { month: "Mar", value: 22 },
  { month: "Abr", value: 31 },
  { month: "Mai", value: 45 },
  { month: "Jun", value: 58 },
];

const ACTIVITY_ROWS = [
  { solution: "Assistente de E-mails Pro", creator: "Carlos M.", category: "Automação", status: "Aguardando", date: "28 mai 2026", action: "Revisar" },
  { solution: "ChatBot WhatsApp", creator: "Ana S.", category: "Chatbots", status: "Aprovado", date: "27 mai 2026", action: "Ver" },
  { solution: "Gerador de Conteúdo", creator: "Pedro R.", category: "Marketing", status: "Aguardando", date: "27 mai 2026", action: "Revisar" },
  { solution: "CRM Inteligente", creator: "Marina L.", category: "Vendas", status: "Rejeitado", date: "26 mai 2026", action: "Ver" },
  { solution: "Analytics Dashboard", creator: "João F.", category: "Análise", status: "Aprovado", date: "26 mai 2026", action: "Ver" },
  { solution: "Bot de Prospecção", creator: "Lucas T.", category: "Vendas", status: "Aguardando", date: "25 mai 2026", action: "Revisar" },
  { solution: "Resumidor de Reuniões", creator: "Carla B.", category: "Produtividade", status: "Aprovado", date: "25 mai 2026", action: "Ver" },
  { solution: "Gerador de Contratos", creator: "Rafael N.", category: "Jurídico", status: "Aguardando", date: "24 mai 2026", action: "Revisar" },
];

const STATUS_STYLES = {
  Aprovado: { background: "#dcfce7", color: "#16a34a" },
  Aguardando: { background: "#fef3c7", color: "#d97706" },
  Rejeitado: { background: "#fee2e2", color: "#dc2626" },
};

const FILTERS = ["Todos", "Aguardando", "Aprovado", "Rejeitado"];

const MAX_BAR_VALUE = 58;
const MAX_BAR_HEIGHT = 80;
const BAR_DELAYS = ["0s", "0.1s", "0.2s", "0.3s", "0.4s", "0.5s"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [chartReady, setChartReady] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredActionLink, setHoveredActionLink] = useState(null);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChartReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const filteredRows =
    activeFilter === "Todos"
      ? ACTIVITY_ROWS
      : ACTIVITY_ROWS.filter((r) => r.status === activeFilter);

  return (
    <div style={{ isolation: "isolate" }}>
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* TOP NAVBAR */}
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
        {/* Left: Logo */}
        <img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} />

        {/* Center: Search */}
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
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Buscar soluções, usuários..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }}
          />
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
            Marketplace ▾
          </button>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
            Vender
          </button>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          {/* Cart */}
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          {/* Bell with red dot */}
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{
              width: 8,
              height: 8,
              background: "#ef4444",
              borderRadius: 999,
              position: "absolute",
              top: -2,
              right: -2,
            }} />
          </button>
          {/* Avatar */}
          <div
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
            style={{
              width: 32,
              height: 32,
              background: "#2563EB",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transform: avatarHovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.15s ease",
            }}
          >
            A
          </div>
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
        {TABS.map((tab, i) => {
          const isActive = activeTab === i;
          const isHovered = hoveredTab === i;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              onMouseEnter={() => setHoveredTab(i)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                fontSize: 14,
                padding: "14px 0",
                marginRight: 8,
                paddingRight: 20,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                borderBottom: isActive ? "2px solid #111827" : "2px solid transparent",
                background: "transparent",
                color: isActive ? "#111827" : isHovered ? "#374151" : "#6b7280",
                fontWeight: isActive ? 600 : 400,
                marginBottom: -1,
                transition: "color 0.15s ease",
              }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 7px",
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "32px 32px", maxWidth: 1200 }}>
        {/* Section Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 2, marginBottom: 0 }}>
            Visão geral da atividade do marketplace
          </p>
        </div>

        {/* Metrics Grid — 8 cards, 2 rows of 4 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {[...METRICS_ROW1, ...METRICS_ROW2].map((m, i) => (
            <div
              key={m.label}
              onMouseEnter={() => setHoveredMetric(i)}
              onMouseLeave={() => setHoveredMetric(null)}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #e5e7eb",
                transform: hoveredMetric === i ? "scale(1.02)" : "scale(1)",
                boxShadow: hoveredMetric === i ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{m.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: m.color || "#111827", marginTop: 6, lineHeight: 1 }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{m.sub}</div>
              <div style={{ fontSize: 11, color: "#16a34a", marginTop: 6, fontWeight: 500 }}>↑ 12% esta semana</div>
            </div>
          ))}
        </div>

        {/* Two Column Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* Mini Bar Chart */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
              Crescimento de Usuários
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", height: 100, gap: 0 }}>
              {BAR_DATA.map((bar, i) => {
                const barHeight = Math.round((bar.value / MAX_BAR_VALUE) * MAX_BAR_HEIGHT);
                const isBarHovered = hoveredBar === i;
                return (
                  <div
                    key={bar.month}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 8 }}
                  >
                    <div
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{
                        width: 32,
                        height: chartReady ? barHeight : 0,
                        background: isBarHovered ? "#1d4ed8" : "#2563EB",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, transform 0.15s ease",
                        transitionDelay: BAR_DELAYS[i],
                        transform: isBarHovered ? "scaleY(1.05)" : "scaleY(1)",
                        transformOrigin: "bottom",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {isBarHovered && (
                        <div style={{
                          position: "absolute",
                          top: -24,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#111827",
                          color: "white",
                          fontSize: 11,
                          padding: "2px 6px",
                          borderRadius: 4,
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          zIndex: 10,
                        }}>
                          {bar.value}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", marginTop: 4 }}>
                      {bar.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
              Ações Rápidas
            </div>
            {[
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: "Revisar soluções pendentes",
                badge: "13",
              },
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                label: "Gerenciar usuários",
                badge: "125",
              },
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                ),
                label: "Solicitações de loja",
                badge: "3",
              },
            ].map((action, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoveredAction(i)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: hoveredAction === i ? "1px solid #2563EB" : "1px solid #e5e7eb",
                  fontSize: 14,
                  color: "#374151",
                  textAlign: "left",
                  cursor: "pointer",
                  marginBottom: 8,
                  background: hoveredAction === i ? "#f8faff" : "white",
                  transform: hoveredAction === i ? "translateX(4px)" : "translateX(0)",
                  transition: "all 0.15s ease",
                }}
              >
                {action.icon}
                <span style={{ flex: 1 }}>{action.label}</span>
                <span style={{
                  marginLeft: "auto",
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 7px",
                }}>
                  {action.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          {/* Table Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Atividade Recente</span>
            <div style={{ display: "flex", gap: 8 }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "none",
                    background: activeFilter === f ? "#111827" : "#f3f4f6",
                    color: activeFilter === f ? "white" : "#6b7280",
                    transition: "all 0.15s ease",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SOLUÇÃO", "CRIADOR", "CATEGORIA", "STATUS", "DATA", "AÇÃO"].map((col) => (
                  <th key={col} style={{
                    padding: "10px 20px",
                    fontSize: 11,
                    color: "#9ca3af",
                    fontWeight: 600,
                    textAlign: "left",
                    borderBottom: "1px solid #f3f4f6",
                    letterSpacing: 0.5,
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr
                  key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: hoveredRow === i ? "#f8faff" : "transparent",
                    transition: "background 0.15s ease",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.solution}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.creator}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.category}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    <span style={{
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      ...STATUS_STYLES[row.status],
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.date}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    <button
                      onMouseEnter={() => setHoveredActionLink(i)}
                      onMouseLeave={() => setHoveredActionLink(null)}
                      style={{
                        color: hoveredActionLink === i ? "#1d4ed8" : "#2563EB",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        padding: 0,
                        textDecoration: hoveredActionLink === i ? "underline" : "none",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {row.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
