"use client";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12L11.2 3.05a1.125 1.125 0 011.6 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Soluções",
    badge: "13",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    label: "Usuários",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "Solicitações",
    badge: "3",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    label: "Receita",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Configurações",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const METRICS = [
  { label: "Aguardando Revisão", value: "13", sub: "soluções aguardando aprovação" },
  { label: "Solicitações de Loja", value: "3", sub: "alterações de perfil pendentes" },
  { label: "Total de Usuários", value: "125", sub: "124 criadores" },
  { label: "Soluções Ativas", value: "0", sub: "de 39 no total" },
];

const ACTIVITY_ROWS = [
  { solution: "Assistente de E-mails Pro", creator: "Carlos M.", status: "Aguardando", date: "28 mai 2026" },
  { solution: "ChatBot WhatsApp", creator: "Ana S.", status: "Aprovado", date: "27 mai 2026" },
  { solution: "Gerador de Conteúdo", creator: "Pedro R.", status: "Aguardando", date: "27 mai 2026" },
  { solution: "CRM Inteligente", creator: "Marina L.", status: "Rejeitado", date: "26 mai 2026" },
  { solution: "Analytics Dashboard", creator: "João F.", status: "Aprovado", date: "26 mai 2026" },
];

const STATUS_STYLES = {
  Aprovado: { background: "#dcfce7", color: "#16a34a" },
  Aguardando: { background: "#fef3c7", color: "#d97706" },
  Rejeitado: { background: "#fee2e2", color: "#dc2626" },
};

const TABS = [
  { label: "Dashboard", badge: null },
  { label: "Soluções", badge: "13" },
  { label: "Usuários", badge: null },
  { label: "Solicitações", badge: "3" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [hoveredNav, setHoveredNav] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 240,
        height: "100vh",
        background: "white",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <img
            src="/logo-icon.png"
            alt="WePrompt"
            style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            const isHovered = hoveredNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "#eff6ff" : isHovered ? "#f9fafb" : "transparent",
                  color: isActive ? "#2563EB" : "#6b7280",
                  fontWeight: isActive ? 600 : 400,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: "auto",
                    background: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 240, padding: 40, minHeight: "100vh", flex: 1 }}>
        {/* Top */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
            Visão geral da atividade do marketplace
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e5e7eb", marginBottom: 32 }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                style={{
                  fontSize: 14,
                  paddingRight: 24,
                  paddingBottom: 12,
                  paddingTop: 0,
                  paddingLeft: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  borderBottom: isActive ? "2px solid #111827" : "2px solid transparent",
                  background: "transparent",
                  color: isActive ? "#111827" : "#6b7280",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  marginBottom: -1,
                  transition: "color 0.15s",
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

        {/* Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}>
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: 13, color: "#6b7280" }}>{metric.label}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginTop: 8, lineHeight: 1 }}>
                {metric.value}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{metric.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue Card */}
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          border: "1px solid #e5e7eb",
          display: "inline-block",
          minWidth: 260,
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Receita Total</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginTop: 8, lineHeight: 1 }}>
            R$ 0,00
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>de pedidos concluídos</div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#6b7280",
            letterSpacing: 1,
            marginBottom: 12,
            textTransform: "uppercase",
          }}>
            Ações Rápidas
          </div>
          <div>
            {["Revisar soluções", "Gerenciar usuários", "Solicitações de loja"].map((action) => (
              <button
                key={action}
                onClick={() => setActiveNav(action === "Revisar soluções" ? "Soluções" : action === "Gerenciar usuários" ? "Usuários" : "Solicitações")}
                style={{
                  color: "#2563EB",
                  fontSize: 14,
                  fontWeight: 500,
                  marginRight: 24,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Atividade Recente</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SOLUÇÃO", "CRIADOR", "STATUS", "DATA"].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px 24px",
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 600,
                      textAlign: "left",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_ROWS.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.solution}
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.creator}
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    <span style={{
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      ...STATUS_STYLES[row.status],
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
