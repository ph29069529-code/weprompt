"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import NavbarDashboard from "../../components/NavbarDashboard";

const CRIADOR_TABS = [
  { label: "Dashboard",       key: "dashboard"     },
  { label: "Minhas Soluções", key: "solucoes"      },
  { label: "Vendas",          key: "vendas"         },
  { label: "Configurações",   key: "configuracoes"  },
  { label: "Analytics",       key: "analytics"      },
];

const fmtBRL = v =>
  `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_BADGE = {
  approved: { background: "rgba(99,102,241,0.08)", color: "#6366F1", label: "Aprovada" },
  pending:  { background: "#fef3c7", color: "#d97706", label: "Pendente" },
  draft:    { background: "#f3f4f6", color: "#6b7280", label: "Rascunho" },
  rejected: { background: "#fee2e2", color: "#dc2626", label: "Rejeitada" },
};

function MetricCard({ iconBg, icon, label, value, sub, subColor, onClick, hovered, idx, onEnter, onLeave }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.2s ease", cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 999, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.1, marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: subColor || "#9ca3af", marginTop: 2, fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function CriadorPage() {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [criadorSubs, setCriadorSubs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Criador");
  const [userId, setUserId] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentSolutions, setRecentSolutions] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const uid = session.user.id;
      setUserId(uid);

      try {
        const [profileRes, approvedRes, pendingRes, solutionsRes] = await Promise.all([
          supabase.from("profiles").select("nome").eq("id", uid).single(),
          supabase.from("solutions").select("id", { count: "exact", head: true })
            .eq("creator_id", uid).eq("status", "approved"),
          supabase.from("solutions").select("id", { count: "exact", head: true })
            .eq("creator_id", uid).eq("status", "pending"),
          supabase.from("solutions").select("id, titulo, categoria, preco, status, created_at")
            .eq("creator_id", uid).order("created_at", { ascending: false }).limit(5),
        ]);

        if (profileRes.data?.nome) setUserName(profileRes.data.nome);
        setApprovedCount(approvedRes.count || 0);
        setPendingCount(pendingRes.count || 0);
        setRecentSolutions(solutionsRes.data || []);
      } catch {
        setError("Não foi possível carregar os dados. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    async function loadAnalytics() {
      const { data: sols } = await supabase.from("solutions").select("id").eq("creator_id", userId);
      const ids = (sols || []).map(s => s.id);
      if (ids.length > 0) {
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("id, created_at, solution_id, solutions(titulo, preco)")
          .in("solution_id", ids);
        setCriadorSubs(subs || []);
      }
    }
    loadAnalytics().catch(() => {});
  }, [userId]);

  const initials = name => name?.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "C";

  if (loading) {
    const sk = (h = 80) => ({
      background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: 12,
      height: h,
    });
    return (
      <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", height: 60 }} />
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", height: 44 }} />
        <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ ...sk(28), width: 240, marginBottom: 28, borderRadius: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={sk(80)} />
              <div style={sk(80)} />
              <div style={sk(80)} />
              <div style={sk(80)} />
            </div>
            <div style={sk(360)} />
          </div>
          <div style={{ ...sk(200), marginTop: 24 }} />
        </div>
      </div>
    );
  }

  const MONTHS_PT_C = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const analyticsLast6 = Array.from({ length: 6 }, (_, j) => {
    const d = new Date(); d.setMonth(d.getMonth() - 5 + j);
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTHS_PT_C[d.getMonth()] };
  });
  const analyticsRevenueByMonth = analyticsLast6.map(({ year, month }) =>
    criadorSubs.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; })
      .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
  );
  const analyticsMaxRevenue = Math.max(...analyticsRevenueByMonth, 1);
  const analyticsHasRevenue = analyticsRevenueByMonth.some(v => v > 0);
  const analyticsSalesMap = {};
  for (const s of criadorSubs) {
    const sid = s.solution_id;
    if (sid) {
      if (!analyticsSalesMap[sid]) analyticsSalesMap[sid] = { titulo: s.solutions?.titulo || "—", count: 0 };
      analyticsSalesMap[sid].count++;
    }
  }
  const analyticsTopSols = Object.values(analyticsSalesMap).sort((a, b) => b.count - a.count).slice(0, 5);
  const analyticsMaxSales = Math.max(...analyticsTopSols.map(s => s.count), 1);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <NavbarDashboard />
      <style>{`
        .dash-header { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
        @media (min-width: 640px) { .dash-header { flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 0; } }
        .dash-vendas-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
        @media (min-width: 640px) { .dash-vendas-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* TABS ROW */}
      <div className="scroll-x" style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 16px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab) => (
          <button key={tab.key}
            onClick={() => setActiveView(tab.key)}
            onMouseEnter={() => setHoveredTab(tab.key)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{ fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", border: "none", borderBottom: activeView === tab.key ? "2px solid #6366F1" : "2px solid transparent", background: "transparent", color: activeView === tab.key ? "#6366F1" : hoveredTab === tab.key ? "#374151" : "#6B7280", fontWeight: activeView === tab.key ? 600 : 400, marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap" }}
          >{tab.label}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "16px" }}>

        {activeView === "dashboard" && <>
        {/* TITLE ROW */}
        <div className="dash-header">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Bem-vindo de volta, {userName}! Veja como sua loja está.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
              + Nova Solução
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#B91C1C", marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, alignItems: "flex-start" }}>

          {/* LEFT: Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MetricCard
              iconBg="#6366F1"
              icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
              label="Soluções Aprovadas"
              value={approvedCount}
              sub={approvedCount === 1 ? "1 no catálogo" : `${approvedCount} no catálogo`}
              subColor="#6b7280"
              onClick={() => router.push("/dashboard/criador/solucoes")}
              hovered={hoveredMetric === 0}
              onEnter={() => setHoveredMetric(0)}
              onLeave={() => setHoveredMetric(null)}
            />
            <MetricCard
              iconBg="#6366F1"
              icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Aguardando Revisão"
              value={pendingCount}
              sub={pendingCount === 0 ? "nenhuma pendente" : "aguardando aprovação"}
              subColor={pendingCount > 0 ? "#d97706" : "#6b7280"}
              onClick={() => router.push("/dashboard/criador/solucoes")}
              hovered={hoveredMetric === 1}
              onEnter={() => setHoveredMetric(1)}
              onLeave={() => setHoveredMetric(null)}
            />
            <MetricCard
              iconBg="#6366F1"
              icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Receita Total"
              value="R$ 0,00"
              sub="disponível em breve"
              subColor="#9ca3af"
            />
            <MetricCard
              iconBg="#6366F1"
              icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>}
              label="Vendas Totais"
              value="0"
              sub="disponível em breve"
              subColor="#9ca3af"
            />
          </div>

          {/* RIGHT: Empty chart state */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, textAlign: "center" }}>
            <svg width="48" height="48" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nenhuma venda ainda</div>
            <div style={{ fontSize: 13, color: "#9ca3af", maxWidth: 260, lineHeight: 1.5 }}>
              Publique sua primeira solução para começar a acompanhar suas vendas aqui.
            </div>
            {approvedCount === 0 && (
              <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ marginTop: 20, background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + Nova Solução
              </button>
            )}
          </div>
        </div>

        {/* RECENT SOLUTIONS */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 24 }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Soluções Recentes</span>
            <button onClick={() => router.push("/dashboard/criador/solucoes")} style={{ fontSize: 13, color: "#6366F1", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
              Ver todas →
            </button>
          </div>

          {recentSolutions.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>Você ainda não publicou nenhuma solução.</div>
              <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + Criar primeira solução
              </button>
            </div>
          ) : (
            <div className="scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr>
                  {["SOLUÇÃO", "CATEGORIA", "PREÇO", "DATA", "STATUS"].map(col => (
                    <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSolutions.map((sol, i) => {
                  const badge = STATUS_BADGE[sol.status] || STATUS_BADGE.draft;
                  return (
                    <tr key={sol.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                      style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s", cursor: "pointer" }}
                      onClick={() => router.push("/dashboard/criador/solucoes")}
                    >
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{sol.titulo}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{sol.categoria || "—"}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{fmtBRL(sol.preco)}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #f9fafb" }}>{fmtDate(sol.created_at)}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                        <span style={{ borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600, background: badge.background, color: badge.color }}>{badge.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          )}
        </div>
        </>}

        {/* ── MINHAS SOLUÇÕES ── */}
        {activeView === "solucoes" && (
          <div>
            <div className="dash-header" style={{ marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Minhas Soluções</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Gerencie suas soluções publicadas e rascunhos.</p>
              </div>
              <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                + Nova Solução
              </button>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Todas as Soluções</span>
                <span style={{ background: "#EEF2FF", color: "#6366F1", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99 }}>{approvedCount + pendingCount}</span>
              </div>
              {recentSolutions.length === 0 ? (
                <div style={{ padding: "64px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nenhuma solução publicada ainda.</div>
                  <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>+ Criar primeira solução</button>
                </div>
              ) : (
                <div className="scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
                  <thead><tr>{["SOLUÇÃO","CATEGORIA","PREÇO","DATA","STATUS"].map(col => <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>)}</tr></thead>
                  <tbody>{recentSolutions.map((sol, i) => {
                    const badge = STATUS_BADGE[sol.status] || STATUS_BADGE.draft;
                    return (
                      <tr key={sol.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                        style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s", cursor: "pointer" }}
                        onClick={() => router.push("/dashboard/criador/solucoes")}>
                        <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{sol.titulo}</td>
                        <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{sol.categoria || "—"}</td>
                        <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{fmtBRL(sol.preco)}</td>
                        <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #f9fafb" }}>{fmtDate(sol.created_at)}</td>
                        <td style={{ padding: "12px 20px", borderBottom: "1px solid #f9fafb" }}><span style={{ borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600, background: badge.background, color: badge.color }}>{badge.label}</span></td>
                      </tr>
                    );
                  })}</tbody>
                </table></div>
              )}
            </div>
          </div>
        )}

        {/* ── VENDAS ── */}
        {activeView === "vendas" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Vendas</h1>
              <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Histórico de vendas das suas soluções.</p>
            </div>
            <div className="dash-vendas-grid">
              <MetricCard iconBg="#6366F1" icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
                label="Receita Total" value="R$ 0,00" sub="disponível em breve" subColor="#9ca3af" />
              <MetricCard iconBg="#6366F1" icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                label="Total de Clientes" value={criadorSubs.length} sub={`${criadorSubs.length} assinatura${criadorSubs.length !== 1 ? "s" : ""}`} subColor="#6b7280" />
              <MetricCard iconBg="#6366F1" icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
                label="Soluções Vendidas" value={approvedCount} sub={`${approvedCount} no catálogo`} subColor="#6b7280" />
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "64px 24px", textAlign: "center" }}>
              {criadorSubs.length === 0 ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nenhuma venda registrada ainda.</div>
                  <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Suas vendas aparecerão aqui após a primeira compra.</div>
                  <button onClick={() => router.push("/dashboard/criador/nova-solucao")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Publicar solução</button>
                </>
              ) : (
                <div style={{ fontSize: 14, color: "#6b7280" }}>Detalhes de vendas disponíveis na aba Analytics.</div>
              )}
            </div>
          </div>
        )}

        {/* ── CONFIGURAÇÕES ── */}
        {activeView === "configuracoes" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Configurações</h1>
              <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Gerencie sua conta e preferências.</p>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 32, maxWidth: 560 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Perfil do Criador</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nome</label>
                  <input defaultValue={userName} readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827", background: "#f9fafb", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Soluções publicadas</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                    <span style={{ fontSize: 14, color: "#111827" }}>{approvedCount} aprovada{approvedCount !== 1 ? "s" : ""}, {pendingCount} pendente{pendingCount !== 1 ? "s" : ""}</span>
                    <button onClick={() => setActiveView("solucoes")} style={{ fontSize: 13, color: "#6366F1", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Ver soluções →</button>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
                  <button onClick={() => router.push("/dashboard/criador/configuracoes")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366F1", color: "white", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                    Configurações avançadas →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "analytics" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Analytics</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Desempenho das suas soluções</p>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Receita por período</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>Últimos 6 meses (R$)</div>
              {!analyticsHasRevenue ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 14 }}>
                  Nenhum dado ainda. Suas métricas aparecerão aqui após as primeiras vendas.
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                  {analyticsRevenueByMonth.map((v, idx) => (
                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: "#6366F1", fontWeight: 600, minHeight: 14 }}>
                        {v > 0 ? `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}` : ""}
                      </div>
                      <div style={{ width: "100%", background: "#6366F1", borderRadius: 4, height: Math.max((v / analyticsMaxRevenue) * 72, v > 0 ? 4 : 0) }} />
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{analyticsLast6[idx].label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Top soluções por vendas</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>Ranking por número de vendas</div>
              {analyticsTopSols.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 14 }}>
                  Nenhum dado ainda. Suas métricas aparecerão aqui após as primeiras vendas.
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                  {analyticsTopSols.map((sol, idx) => (
                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, minHeight: 14 }}>{sol.count}</div>
                      <div style={{ width: "100%", background: "#6366F1", borderRadius: 4, height: Math.max((sol.count / analyticsMaxSales) * 72, 4) }} />
                      <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%", textAlign: "center" }}>
                        {sol.titulo.length > 12 ? sol.titulo.slice(0, 11) + "…" : sol.titulo}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Conversão</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Views → Compras</div>
                <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: 13 }}>Em breve</div>
              </div>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Visualizações</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Views por solução</div>
                <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: 13 }}>Em breve</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
