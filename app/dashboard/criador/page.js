"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

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

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}><img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} /></Link>
        <div style={{ display: "flex", alignItems: "center", background: searchFocused ? "white" : "#f3f4f6", borderRadius: 8, padding: "8px 16px", width: 360, gap: 8, border: searchFocused ? "1px solid #6366F1" : "1px solid transparent", boxShadow: searchFocused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none", transition: "all 0.2s ease" }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
          <input placeholder="Buscar soluções..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard/criador/configuracoes" style={{ textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "#6366F1", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
              {initials(userName)}
            </div>
          </Link>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 1) router.push("/dashboard/criador/solucoes");
              else if (i === 2) router.push("/dashboard/criador/vendas");
              else if (i === 3) router.push("/dashboard/criador/configuracoes");
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{ fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", border: "none", borderBottom: i === 0 ? "2px solid #111827" : "2px solid transparent", background: "transparent", color: i === 0 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280", fontWeight: i === 0 ? 600 : 400, marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap" }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px" }}>

        {/* TITLE ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "flex-start" }}>

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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
