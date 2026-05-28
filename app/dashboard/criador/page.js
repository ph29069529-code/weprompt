"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RANGES = ["7d", "30d", "90d"];

const BAR_VALUES = [12, 8, 24, 18, 35, 22, 41, 15, 28, 33, 19, 44, 37, 26, 52, 48, 31, 43, 67, 58, 39, 45, 71, 64, 48, 55, 74, 63, 49, 58];
const MAX_BAR = 74;
const CHART_HEIGHT = 160;

const SALES = [
  { solution: "Assistente de E-mails Pro", buyer: "João S.", value: "R$ 97,00", date: "28 mai 2026", status: "Concluído" },
  { solution: "ChatBot WhatsApp", buyer: "Maria L.", value: "R$ 147,00", date: "27 mai 2026", status: "Concluído" },
  { solution: "Gerador de Conteúdo", buyer: "Pedro R.", value: "R$ 67,00", date: "26 mai 2026", status: "Processando" },
  { solution: "Assistente de E-mails Pro", buyer: "Ana C.", value: "R$ 97,00", date: "25 mai 2026", status: "Concluído" },
  { solution: "ChatBot WhatsApp", buyer: "Lucas M.", value: "R$ 147,00", date: "24 mai 2026", status: "Reembolsado" },
];

const STATUS_STYLES = {
  Concluído: { background: "#dcfce7", color: "#16a34a" },
  Processando: { background: "#dbeafe", color: "#2563EB" },
  Reembolsado: { background: "#fee2e2", color: "#dc2626" },
};

const METRICS = [
  {
    iconBg: "#16a34a",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Ganhos Esta Semana",
    value: "R$ 196,00",
    sub: "+26% ↑",
    subColor: "#16a34a",
    route: "/dashboard/criador/vendas",
  },
  {
    iconBg: "#2563EB",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    label: "Soluções Ativas",
    value: "40",
    sub: "de 64 no total",
    subColor: "#9ca3af",
    route: "/dashboard/criador/solucoes",
  },
  {
    iconBg: "#ea580c",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Aguardando Revisão",
    value: "22",
    sub: "soluções pendentes",
    subColor: "#9ca3af",
    route: "/dashboard/criador/solucoes",
  },
  {
    iconBg: "#7c3aed",
    icon: (
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    label: "Vendas Esta Semana",
    value: "6",
    sub: "+20% ↑",
    subColor: "#16a34a",
    route: "/dashboard/criador/vendas",
  },
];

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

export default function CriadorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeRange, setActiveRange] = useState("30d");
  const [chartReady, setChartReady] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);

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
              if (i === 1) { router.push("/dashboard/criador/solucoes"); return; }
              if (i === 2) { router.push("/dashboard/criador/vendas"); return; }
              if (i === 3) { router.push("/dashboard/criador/configuracoes"); return; }
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

      {/* STRIPE BANNER */}
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 12,
        padding: "12px 24px",
        margin: "24px 32px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, background: "#635BFF", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>S</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#15803d" }}>Stripe Conectado</span>
          <span style={{ color: "#9ca3af" }}>·</span>
          <span style={{ fontSize: 14, color: "#6b7280" }}>Pagamentos habilitados</span>
        </div>
        <button
          onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
          style={{
            fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer",
            border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px",
            background: "white",
          }}
        >
          Gerenciar Pagamentos ↗
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px" }}>
        {/* TITLE ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Bem-vindo de volta, Criador! Veja como sua loja está performando.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => router.push("/criadores/user_test")}
              style={{
                border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 18px",
                fontSize: 14, color: "#374151", display: "flex", alignItems: "center", gap: 6,
                background: "white", cursor: "pointer",
              }}
            >
              Ver Minha Loja ↗
            </button>
            <button
              onClick={() => router.push("/dashboard/criador/nova-solucao")}
              style={{
                background: "#111827", color: "white", borderRadius: 8,
                padding: "9px 18px", fontSize: 14, fontWeight: 600,
                border: "none", cursor: "pointer",
              }}
            >
              + Nova Solução
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
                onClick={() => router.push(m.route)}
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
                  cursor: "pointer",
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

          {/* RIGHT: Revenue Chart */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
            {/* Chart Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" fill="none" stroke="#2563EB" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Visão Geral de Receita</span>
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
                  <svg width="16" height="16" fill="none" stroke="#2563EB" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Últimos 30d
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1 }}>R$ 613,60</div>
              </div>
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "14px 18px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Total acumulado
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1 }}>R$ 1.457,60</div>
              </div>
            </div>

            {/* Bar Chart */}
            {(() => {
              const chartBars = activeRange === "7d"
                ? BAR_VALUES.slice(-7)
                : activeRange === "90d"
                  ? BAR_VALUES.map(v => v * 3)
                  : BAR_VALUES;
              const chartMax = activeRange === "90d" ? MAX_BAR * 3 : MAX_BAR;
              const topLabel = activeRange === "90d" ? "R$ 223,20" : "R$ 74,40";
              const midLabel = activeRange === "90d" ? "R$ 111,60" : "R$ 37,20";
              return (
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 24,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    pointerEvents: "none",
                  }}>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{topLabel}</span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{midLabel}</span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>R$ 0</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: CHART_HEIGHT, paddingLeft: 52 }}>
                    {chartBars.map((v, i) => {
                      const h = chartReady ? Math.round((v / chartMax) * CHART_HEIGHT) : 0;
                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                          title={`R$ ${v},00`}
                          style={{
                            flex: 1,
                            height: h,
                            borderRadius: "3px 3px 0 0",
                            background: hoveredBar === i ? "#2563EB" : "#bfdbfe",
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
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>
                      {activeRange === "7d" ? "Dez 25" : "Dez 18"}
                    </span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>Jan 18</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* RECENT SALES TABLE */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 24 }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Vendas Recentes</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SOLUÇÃO", "COMPRADOR", "VALOR", "DATA", "STATUS"].map((col) => (
                  <th key={col} style={{
                    padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600,
                    textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5,
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SALES.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => router.push("/dashboard/criador/solucoes")}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: hoveredRow === i ? "#f8faff" : "transparent",
                    transition: "background 0.15s ease",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.solution}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.buyer}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{row.value}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.date}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    <span style={{
                      borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                      ...STATUS_STYLES[row.status],
                    }}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
