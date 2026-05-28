"use client";
import { useState, useEffect } from "react";

const TABS = [
  { label: "Início" },
  { label: "Soluções Adquiridas" },
  { label: "Explorar Catálogo" },
  { label: "Histórico de Compras" },
  { label: "Analytics" },
  { label: "Configurações" },
];

const RANGES = ["7d", "30d", "90d"];

const BAR_VALUES = [15, 22, 18, 31, 27, 42, 38, 25, 44, 51, 36, 48, 55, 41, 62, 58, 47, 53, 68, 71, 49, 57, 74, 66, 52, 61, 78, 69, 55, 63];
const MAX_BAR = 78;
const CHART_HEIGHT = 160;

const SOLUTIONS = [
  { name: "Pack de Prompts WhatsApp", category: "Agentes de IA", value: "R$ 47,00", since: "mai. 2026", status: "Ativa" },
  { name: "Assistente de E-mails", category: "Automação", value: "R$ 97,00", since: "mai. 2026", status: "Ativa" },
  { name: "ChatBot Atendimento", category: "Chatbots", value: "R$ 147,00", since: "abr. 2026", status: "Ativa" },
  { name: "Gerador de Relatórios", category: "Analytics", value: "R$ 67,00", since: "abr. 2026", status: "Ativa" },
  { name: "CRM Inteligente", category: "Vendas", value: "R$ 197,00", since: "mar. 2026", status: "Ativa" },
];

const PLAN_FEATURES = [
  "Acesso ao catálogo completo",
  "Compra avulsa de soluções",
  "Suporte via e-mail",
];

const METRICS = [
  {
    iconBg: "#2563EB",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    label: "Soluções Adquiridas",
    value: "5",
    sub: "5 ativas",
    subColor: "#9ca3af",
  },
  {
    iconBg: "#16a34a",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Investimento Total",
    value: "R$ 235,00",
    sub: "este mês",
    subColor: "#9ca3af",
  },
  {
    iconBg: "#ea580c",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Soluções Ativas",
    value: "5",
    sub: "todas funcionando",
    subColor: "#16a34a",
  },
  {
    iconBg: "#7c3aed",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    label: "Economia Estimada",
    value: "R$ 1.200,00",
    sub: "vs contratar equipe",
    subColor: "#16a34a",
  },
];

export default function EmpresaDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeRange, setActiveRange] = useState("30d");
  const [chartReady, setChartReady] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setChartReady(true), 400);
    return () => clearTimeout(t);
  }, []);

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
          <button style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Explorar Catálogo</button>
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
            width: 32, height: 32, background: "#0369A1", borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>P</div>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        display: "flex",
        gap: 0,
        overflowX: "auto",
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14,
              padding: "14px 0",
              paddingRight: 20,
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
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px" }}>

        {/* TITLE ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Olá, Pericles 👋</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Aqui está o resumo das suas soluções de IA.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 18px",
              fontSize: 14, color: "#374151", display: "flex", alignItems: "center", gap: 6,
              background: "white", cursor: "pointer",
            }}>
              Explorar Catálogo ↗
            </button>
            <button style={{
              background: "#111827", color: "white", borderRadius: 8,
              padding: "9px 18px", fontSize: 14, fontWeight: 600,
              border: "none", cursor: "pointer",
            }}>
              Adquirir Solução +
            </button>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "flex-start" }}>

          {/* LEFT: Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                onMouseEnter={() => setHoveredMetric(i)}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transform: hoveredMetric === i ? "scale(1.02)" : "scale(1)",
                  boxShadow: hoveredMetric === i ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s ease",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 999,
                  background: m.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.1, marginTop: 2 }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: m.subColor, marginTop: 2, fontWeight: 500 }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Usage Chart */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
            {/* Chart Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" fill="none" stroke="#0369A1" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-9.75C12.75 2.754 13.254 2.25 13.875 2.25h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0112.75 19.875V3.375zm-9 5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 19.875V8.625z" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Uso de Soluções</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    style={{
                      background: activeRange === r ? "#111827" : "#f3f4f6",
                      color: activeRange === r ? "white" : "#6b7280",
                      borderRadius: 999,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >{r}</button>
                ))}
              </div>
            </div>

            {/* Value Cards */}
            <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "14px 18px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <svg width="16" height="16" fill="none" stroke="#0369A1" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Acessos este mês
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1 }}>347</div>
              </div>
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "14px 18px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Tarefas automatizadas
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1 }}>1.204</div>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 24,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                pointerEvents: "none",
              }}>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>74</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>37</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>0</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: CHART_HEIGHT, paddingLeft: 52 }}>
                {BAR_VALUES.map((v, i) => {
                  const h = chartReady ? Math.round((v / MAX_BAR) * CHART_HEIGHT) : 0;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                      title={`${v} acessos`}
                      style={{
                        flex: 1,
                        height: h,
                        borderRadius: "3px 3px 0 0",
                        background: hoveredBar === i ? "#0369A1" : "#bae6fd",
                        minWidth: 8,
                        transition: "height 0.6s ease, background 0.15s ease",
                        transitionDelay: `${(i * 0.02).toFixed(2)}s`,
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingLeft: 52 }}>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>1 mai</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>30 mai</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOLUÇÕES ADQUIRIDAS TABLE */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 24 }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Soluções Adquiridas</span>
            <button
              onClick={() => setActiveTab(1)}
              style={{ color: "#0369A1", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Ver todas →
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SOLUÇÃO", "CATEGORIA", "VALOR", "DESDE", "STATUS", "AÇÃO"].map((col) => (
                  <th key={col} style={{
                    padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600,
                    textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5,
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOLUTIONS.map((row, i) => (
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
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{row.name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.category}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{row.value}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.since}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    <button style={{ color: "#0369A1", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Acessar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PLANO ATUAL */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Plano atual</div>
              <span style={{
                display: "inline-block",
                background: "#f3f4f6", color: "#111827",
                fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
                marginBottom: 12,
              }}>Free</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PLAN_FEATURES.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill="rgba(3,105,161,0.1)" />
                      <path d="M5 8l2 2 4-4" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <a href="/precos" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#0369A1", color: "white", borderRadius: 8, padding: "10px 20px",
              fontSize: 14, fontWeight: 600, textDecoration: "none", flexShrink: 0,
              transition: "background 0.15s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
              onMouseLeave={e => e.currentTarget.style.background = "#0369A1"}
            >
              Fazer upgrade →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
