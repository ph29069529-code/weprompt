"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

const SUMMARY_CARDS = [
  { label: "Total de Vendas",  value: "127",          sub: "desde o início",   subColor: "#9ca3af" },
  { label: "Receita Total",    value: "R$ 14.589,00", sub: "desde o início",   subColor: "#9ca3af" },
  { label: "Esta Semana",      value: "6",             sub: "+20% ↑",           subColor: "#16a34a" },
  { label: "Este Mês",         value: "28",            sub: "+12% ↑",           subColor: "#16a34a" },
];

const STATUS_STYLES = {
  Concluído:   { background: "#dcfce7", color: "#16a34a" },
  Processando: { background: "#dbeafe", color: "#2563EB" },
  Reembolsado: { background: "#fee2e2", color: "#dc2626" },
};

const SALES = [
  { solution: "Assistente de E-mails Pro", buyer: "João S.",    value: "R$ 97,00",  date: "28 mai 2026", status: "Concluído" },
  { solution: "ChatBot WhatsApp",           buyer: "Maria L.",   value: "R$ 147,00", date: "27 mai 2026", status: "Concluído" },
  { solution: "Gerador de Conteúdo",        buyer: "Pedro R.",   value: "R$ 67,00",  date: "26 mai 2026", status: "Processando" },
  { solution: "CRM Inteligente",            buyer: "Ana C.",     value: "R$ 197,00", date: "25 mai 2026", status: "Concluído" },
  { solution: "Analytics Dashboard",        buyer: "Lucas M.",   value: "R$ 127,00", date: "24 mai 2026", status: "Concluído" },
  { solution: "ChatBot WhatsApp",           buyer: "Fernanda T.", value: "R$ 147,00", date: "23 mai 2026", status: "Reembolsado" },
  { solution: "Assistente de E-mails Pro", buyer: "Rafael N.",  value: "R$ 97,00",  date: "22 mai 2026", status: "Concluído" },
  { solution: "Resumidor de Reuniões",      buyer: "Carla B.",   value: "R$ 57,00",  date: "21 mai 2026", status: "Concluído" },
  { solution: "CRM Inteligente",            buyer: "Marcos P.",  value: "R$ 197,00", date: "20 mai 2026", status: "Concluído" },
  { solution: "Analytics Dashboard",        buyer: "Sofia R.",   value: "R$ 127,00", date: "19 mai 2026", status: "Processando" },
];

export default function VendasPage() {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 32px", height: 60, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <img src="/logo-icon.png" alt="WePrompt" style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }} />
        <div style={{
          display: "flex", alignItems: "center",
          background: searchFocused ? "white" : "#f3f4f6",
          borderRadius: 8, padding: "8px 16px", width: 360, gap: 8,
          border: searchFocused ? "1px solid #2563EB" : "1px solid transparent",
          boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          transition: "all 0.2s ease",
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input placeholder="Buscar soluções..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }} />
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
          <div style={{ width: 32, height: 32, background: "#7c3aed", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>C</div>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 0) router.push("/dashboard/criador");
              else if (i === 1) router.push("/dashboard/criador/solucoes");
              else if (i === 3) router.push("/dashboard/criador/configuracoes");
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer",
              display: "inline-flex", alignItems: "center", border: "none",
              borderBottom: i === 2 ? "2px solid #111827" : "2px solid transparent",
              background: "transparent",
              color: i === 2 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: i === 2 ? 600 : 400,
              marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px" }}>

        {/* TITLE */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Vendas</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Histórico completo das suas vendas</p>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {SUMMARY_CARDS.map((c, i) => (
            <div key={c.label}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20,
                transform: hoveredCard === i ? "scale(1.02)" : "scale(1)",
                boxShadow: hoveredCard === i ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease", cursor: "default",
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: c.subColor, marginTop: 4, fontWeight: 500 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* SALES TABLE */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Todas as Vendas</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SOLUÇÃO", "COMPRADOR", "VALOR", "DATA", "STATUS"].map(col => (
                  <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SALES.map((row, i) => (
                <tr key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s ease", cursor: "pointer" }}
                >
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.solution}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.buyer}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{row.value}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.date}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    <span style={{ borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600, ...STATUS_STYLES[row.status] }}>{row.status}</span>
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
