"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";
import NotificationBell from "../../components/NotificationBell";

/* ── Color / style constants ── */
const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F8F9FB";
const BLUE       = "#6366F1";
const BORDER     = "#e5e7eb";
const DANGER     = "#dc2626";

/* ── Hooks ── */
function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

/* ── Icon ── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  puzzle:   "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  pencil:   "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  building: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  wrench:   "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  arrows:   "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  chart:    "M18 20V10 M12 20V4 M6 20v-6",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  search:   "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
  check:    "M20 6L9 17l-5-5",
  pencil:   "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  x:        "M18 6L6 18M6 6l12 12",
};

/* ── Helpers ── */
function todayPtBR() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

/* ── NavItem ── */
function NavItem({ label, iconD, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "9px 12px", borderRadius: 12, border: "none",
      background: active ? "#EEF2FF" : "transparent",
      color: active ? BLUE : GRAY_TEXT,
      fontSize: 13, fontWeight: active ? 600 : 500,
      cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
      transition: "background 0.15s", textAlign: "left",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ flexShrink: 0 }}><Icon d={iconD} size={15} /></span>
      {label}
    </button>
  );
}

/* ── Sidebar items ── */
const SIDEBAR_ITEMS = [
  { key: "dashboard",     label: "Dashboard",     icon: "home" },
  { key: "solucoes",      label: "Soluções",      icon: "puzzle" },
  { key: "solicitacoes",  label: "Solicitações",  icon: "eye" },
  { key: "usuarios",      label: "Usuários",      icon: "users" },
  { key: "criadores",     label: "Criadores",     icon: "pencil" },
  { key: "empresas",      label: "Empresas",      icon: "building" },
  { key: "workspace",     label: "Workspace",     icon: "wrench" },
  { key: "transacoes",    label: "Transações",    icon: "arrows" },
  { key: "analytics",     label: "Analytics",     icon: "chart" },
  { key: "categorias",    label: "Categorias",    icon: "tag" },
  { key: "configuracoes", label: "Configurações", icon: "settings" },
];

const TAB_LABELS = {
  dashboard:     "Painel Administrativo",
  solucoes:      "Soluções",
  solicitacoes:  "Solicitações",
  usuarios:      "Usuários",
  criadores:     "Criadores",
  empresas:      "Empresas",
  workspace:     "Workspace",
  transacoes:    "Transações",
  analytics:     "Analytics",
  categorias:    "Categorias",
  configuracoes: "Configurações",
};

/* ── StatusBadge ── */
function StatusBadge({ status }) {
  const map = {
    pending:   { label: "Pendente",   bg: "rgba(217,119,6,0.1)",   color: "#B45309" },
    pendente:  { label: "Pendente",   bg: "rgba(217,119,6,0.1)",   color: "#B45309" },
    approved:  { label: "Ativa",      bg: "rgba(99,102,241,0.1)",  color: BLUE },
    active:    { label: "Ativa",      bg: "rgba(99,102,241,0.1)",  color: BLUE },
    ativo:     { label: "Ativo",      bg: "rgba(99,102,241,0.1)",  color: BLUE },
    rejected:  { label: "Reprovada",  bg: "rgba(220,38,38,0.1)",   color: DANGER },
    paused:    { label: "Pausada",    bg: "rgba(107,114,128,0.1)", color: "#4B5563" },
    cancelled: { label: "Cancelado",  bg: "rgba(107,114,128,0.1)", color: "#4B5563" },
    criador:   { label: "Criador",    bg: "#EEF2FF",               color: BLUE },
    creator:   { label: "Criador",    bg: "#EEF2FF",               color: BLUE },
    empresa:   { label: "Empresa",    bg: "rgba(99,102,241,0.1)",  color: "#6366F1" },
    business:  { label: "Empresa",    bg: "rgba(99,102,241,0.1)",  color: "#6366F1" },
    admin:     { label: "Admin",      bg: "rgba(220,38,38,0.1)",   color: DANGER },
  };
  const s = map[status] || { label: status || "—", bg: "rgba(0,0,0,0.07)", color: GRAY_TEXT };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, display: "inline-block", flexShrink: 0 }}>
      {s.label}
    </span>
  );
}

/* ── DashboardTab ── */
function DashboardTab({ solutions, profiles, subscriptions, onNavigate }) {
  const pendingCount      = solutions.filter(s => s.status === "pending").length;
  const totalUsers        = profiles.length;
  const criadoresCount    = profiles.filter(p => p.role === "criador" || p.role === "creator").length;
  const empresasCount     = profiles.filter(p => p.role === "empresa"  || p.role === "business").length;
  const approvedCount     = solutions.filter(s => s.status === "approved").length;
  const gmvTotal          = subscriptions.reduce((sum, sub) => sum + (sub.solutions?.preco || 0), 0);
  const receitaPlataforma = gmvTotal * 0.15;
  const weekAgo           = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newUsersThisWeek  = profiles.filter(p => new Date(p.created_at) > weekAgo).length;

  const fmtBRL = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const kpiCards = [
    { label: "Aguardando Revisão", value: pendingCount,            accent: "#F97316" },
    { label: "Total Usuários",     value: totalUsers,              accent: BLUE },
    { label: "Criadores",          value: criadoresCount,          accent: BLUE },
    { label: "Empresas",           value: empresasCount,           accent: BLUE },
    { label: "Soluções Ativas",    value: approvedCount,           accent: "#16A34A" },
    { label: "GMV Total",          value: fmtBRL(gmvTotal),        accent: BLUE },
    { label: "Receita WePrompt",   value: fmtBRL(receitaPlataforma), accent: "#16A34A" },
    { label: "Novos esta semana",  value: newUsersThisWeek,        accent: BLUE },
  ];

  const recentSolutions = [...solutions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const recentProfiles  = [...profiles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const recentSubs      = [...subscriptions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const colCard = { background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden", flex: "1 1 0", minWidth: 220 };
  const colHead = { padding: "14px 16px", borderBottom: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 700, color: NEAR_BLACK };
  const row     = { padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${BORDER}`, fontSize: 13 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* KPI grid — 4 columns × 2 rows */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpiCards.map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: GRAY_TEXT }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: NEAR_BLACK, lineHeight: 1 }}>{c.value}</div>
            <div style={{ height: 3, borderRadius: 2, background: c.accent, marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* Recent activity — 3 columns */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Últimas Soluções */}
        <div style={colCard}>
          <div style={colHead}>Últimas Soluções</div>
          {recentSolutions.length === 0
            ? <div style={{ padding: 16, fontSize: 13, color: GRAY_TEXT }}>Nenhuma solução.</div>
            : recentSolutions.map(s => (
              <div key={s.id} style={row}>
                <span style={{ color: NEAR_BLACK, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(s.titulo || s.nome || "—").slice(0, 30)}
                </span>
                <StatusBadge status={s.status} />
                <span style={{ color: GRAY_TEXT, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(s.created_at)}</span>
              </div>
            ))
          }
        </div>

        {/* Últimos Usuários */}
        <div style={colCard}>
          <div style={colHead}>Últimos Usuários</div>
          {recentProfiles.length === 0
            ? <div style={{ padding: 16, fontSize: 13, color: GRAY_TEXT }}>Nenhum usuário.</div>
            : recentProfiles.map(p => (
              <div key={p.id} style={row}>
                <span style={{ color: NEAR_BLACK, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nome || "—"}</span>
                <StatusBadge status={p.role} />
                <span style={{ color: GRAY_TEXT, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(p.created_at)}</span>
              </div>
            ))
          }
        </div>

        {/* Últimas Transações */}
        <div style={colCard}>
          <div style={colHead}>Últimas Transações</div>
          {recentSubs.length === 0
            ? <div style={{ padding: 16, fontSize: 13, color: GRAY_TEXT }}>Nenhuma transação ainda.</div>
            : recentSubs.map(s => (
              <div key={s.id} style={row}>
                <span style={{ color: GRAY_TEXT, fontFamily: "monospace", fontSize: 11, flexShrink: 0 }}>{String(s.id).slice(0, 8)}…</span>
                <StatusBadge status={s.status === "active" ? "ativo" : s.status} />
                <span style={{ color: GRAY_TEXT, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(s.created_at)}</span>
              </div>
            ))
          }
        </div>

      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => onNavigate("solicitacoes")} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #FED7AA", background: "#FFF7ED", color: "#C2410C", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Revisar Pendentes ({pendingCount})
        </button>
        <button onClick={() => onNavigate("usuarios")} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #C7D2FE", background: "#EEF2FF", color: "#4338CA", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Ver Usuários
        </button>
        <button onClick={() => onNavigate("transacoes")} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #BBF7D0", background: "#F0FDF4", color: "#15803D", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Ver Transações
        </button>
      </div>

    </div>
  );
}

/* ── SolucoesTab ── */
function SolucoesTab({ solutions, onApprove, onConfirmReject, onView, actionLoading }) {
  const [filter, setFilter]             = useState("todas");
  const [search, setSearch]             = useState("");
  const [rejectingId, setRejectingId]   = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const statusMap = { todas: null, pendentes: "pending", aprovadas: "approved", rejeitadas: "rejected" };

  const filtered = solutions
    .filter(s => !statusMap[filter] || s.status === statusMap[filter])
    .filter(s => !search || (s.titulo || s.nome || "").toLowerCase().includes(search.toLowerCase()));

  async function submitReject(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onConfirmReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }

  const pillBtn = (key, label) => (
    <button key={key} onClick={() => setFilter(key)} style={{
      padding: "7px 16px", borderRadius: 99, border: "none",
      background: filter === key ? BLUE : "#fff",
      color: filter === key ? "#fff" : GRAY_TEXT,
      fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}>{label}</button>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pillBtn("todas", "Todas")}
          {pillBtn("pendentes", "Pendentes")}
          {pillBtn("aprovadas", "Aprovadas")}
          {pillBtn("rejeitadas", "Rejeitadas")}
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: GRAY_TEXT, pointerEvents: "none" }}>
            <Icon d={icons.search} size={15} />
          </span>
          <input type="text" placeholder="Buscar solução…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "56px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
            Nenhuma solução encontrada.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Título", "Criador", "Categoria", "Preço", "Status", "Data", "Ações"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isLoading   = actionLoading === s.id;
                  const isRejecting = rejectingId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr style={{ borderTop: `1px solid ${BORDER}` }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK, maxWidth: 220 }}>
                          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {(s.titulo || s.nome || "—").slice(0, 30)}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.profiles?.nome || "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          {s.categoria
                            ? <span style={{ background: "#EEF2FF", color: BLUE, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99 }}>{s.categoria}</span>
                            : <span style={{ color: GRAY_TEXT }}>—</span>}
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK, whiteSpace: "nowrap" }}>
                          {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                        </td>
                        <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button onClick={() => onView(s)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Ver
                            </button>
                            {s.status === "pending" && (
                              <>
                                <button onClick={() => { if (!isLoading) onApprove(s.id); }}
                                  style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(99,102,241,0.1)", color: BLUE, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1, fontFamily: "inherit" }}>
                                  Aprovar
                                </button>
                                <button onClick={() => { if (!isLoading) { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); } }}
                                  style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: isRejecting ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.1)", color: DANGER, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1, fontFamily: "inherit" }}>
                                  Reprovar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isRejecting && (
                        <tr>
                          <td colSpan={7} style={{ padding: "0 16px 12px", background: "rgba(220,38,38,0.02)" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
                              <input autoFocus placeholder="Motivo da reprovação…" value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") submitReject(s); if (e.key === "Escape") { setRejectingId(null); setRejectReason(""); } }}
                                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 13, color: NEAR_BLACK, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                              <button onClick={() => submitReject(s)} disabled={!rejectReason.trim() || rejectLoading}
                                style={{ padding: "8px 14px", borderRadius: 8, background: !rejectReason.trim() || rejectLoading ? "rgba(220,38,38,0.3)" : DANGER, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() || rejectLoading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                                {rejectLoading ? "…" : "Confirmar"}
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: GRAY_TEXT, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                Cancelar
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SolicitacoesTab ── */
function SolicitacoesTab({ solutions, onApprove, onConfirmReject, onView, actionLoading }) {
  const [rejectingId, setRejectingId]     = useState(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const pending = solutions.filter(s => s.status === "pending");

  async function submitReject(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onConfirmReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }

  if (pending.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, marginBottom: 20 }}>
          <Icon d={icons.check} size={28} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Nenhuma solicitação pendente</div>
        <div style={{ fontSize: 14, color: GRAY_TEXT }}>Todas as soluções foram revisadas.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {pending.map(s => {
        const isLoading   = actionLoading === s.id;
        const isRejecting = rejectingId === s.id;
        const priceLabel  = s.preco != null
          ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${s.payment_type === "subscription" ? "/mês" : " (único)"}`
          : "Gratuito";
        return (
          <div key={s.id} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>{s.titulo || s.nome || "—"}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                  {s.categoria && (
                    <span style={{ background: "#EEF2FF", color: BLUE, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99 }}>{s.categoria}</span>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{priceLabel}</span>
                  <span style={{ fontSize: 13, color: GRAY_TEXT }}>· {s.profiles?.nome || "—"}</span>
                  <span style={{ fontSize: 13, color: GRAY_TEXT }}>· {formatDate(s.created_at)}</span>
                </div>
                {s.descricao && (
                  <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {s.descricao}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                <button onClick={() => onView(s)}
                  style={{ padding: "8px 16px", borderRadius: 9, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Ver detalhes
                </button>
                <button onClick={() => { if (!isLoading) onApprove(s.id); }} disabled={isLoading}
                  style={{ padding: "8px 16px", borderRadius: 9, border: "none", background: isLoading ? "rgba(99,102,241,0.4)" : BLUE, color: "#fff", fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? "…" : "Aprovar"}
                </button>
                <button onClick={() => { if (!isLoading) { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); } }} disabled={isLoading}
                  style={{ padding: "8px 16px", borderRadius: 9, border: `1.5px solid rgba(220,38,38,0.3)`, background: isRejecting ? "rgba(220,38,38,0.07)" : "transparent", color: DANGER, fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isLoading ? 0.7 : 1 }}>
                  Reprovar
                </button>
              </div>
            </div>
            {isRejecting && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
                <textarea autoFocus rows={3} placeholder="Motivo da reprovação…" value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 14, color: NEAR_BLACK, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }}
                  onFocus={e => (e.target.style.borderColor = DANGER)} onBlur={e => (e.target.style.borderColor = "rgba(220,38,38,0.35)")} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => submitReject(s)} disabled={!rejectReason.trim() || rejectLoading}
                    style={{ padding: "8px 20px", borderRadius: 9, background: !rejectReason.trim() || rejectLoading ? "rgba(220,38,38,0.3)" : DANGER, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() || rejectLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    {rejectLoading ? "Reprovando…" : "Confirmar reprovação"}
                  </button>
                  <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                    style={{ padding: "8px 18px", borderRadius: 9, background: "transparent", color: GRAY_TEXT, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── UsuariosTab ── */
function UsuariosTab({ profiles }) {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = profiles
    .filter(p => {
      if (filter === "todos") return true;
      if (filter === "criadores") return p.role === "criador" || p.role === "creator";
      if (filter === "empresas")  return p.role === "empresa"  || p.role === "business";
      return p.role === filter;
    })
    .filter(p =>
      !search ||
      p.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    );

  const pillBtn = (key, label) => (
    <button key={key} onClick={() => setFilter(key)} style={{
      padding: "7px 16px", borderRadius: 99, border: "none",
      background: filter === key ? BLUE : "#fff",
      color: filter === key ? "#fff" : GRAY_TEXT,
      fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}>{label}</button>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pillBtn("todos", "Todos")}
          {pillBtn("criadores", "Criadores")}
          {pillBtn("empresas", "Empresas")}
          {pillBtn("admin", "Admins")}
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: GRAY_TEXT, pointerEvents: "none" }}>
            <Icon d={icons.search} size={15} />
          </span>
          <input type="text" placeholder="Buscar por nome ou e-mail…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "56px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Usuário", "E-mail", "Tipo", "Cadastro"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                          {initials(p.nome)}
                        </div>
                        <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{p.nome || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{p.email || "—"}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={p.role} /></td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CriadoresTab ── */
function CriadoresTab({ profiles, solutions, subscriptions }) {
  const criadores = profiles
    .filter(p => p.role === "criador" || p.role === "creator")
    .map(p => {
      const approved = solutions.filter(s => s.creator_id === p.id && s.status === "approved").length;
      const pending  = solutions.filter(s => s.creator_id === p.id && s.status === "pending").length;
      const revenue  = subscriptions
        .filter(sub => solutions.some(s => s.id === sub.solution_id && s.creator_id === p.id))
        .reduce((sum, sub) => {
          const sol = solutions.find(s => s.id === sub.solution_id);
          return sum + (sol?.preco || 0);
        }, 0);
      return { ...p, approved, pending, revenue };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const fmtBRL = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {criadores.length === 0 ? (
        <div style={{ padding: "56px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
          Nenhum criador cadastrado ainda.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Criador", "E-mail", "Sol. Ativas", "Pendentes", "Receita Total", "Cadastro"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criadores.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                        {initials(p.nome)}
                      </div>
                      <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{p.nome || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{p.email || "—"}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color: BLUE }}>{p.approved}</span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color: p.pending > 0 ? "#B45309" : GRAY_TEXT }}>{p.pending}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: NEAR_BLACK, whiteSpace: "nowrap" }}>{fmtBRL(p.revenue)}</td>
                  <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── EmpresasTab ── */
function EmpresasTab({ profiles, subscriptions, solutions }) {
  const empresas = profiles
    .filter(p => p.role === "empresa" || p.role === "business")
    .map(p => {
      const mySubs        = subscriptions.filter(s => s.business_id === p.id || s.user_id === p.id);
      const activeSubs    = mySubs.filter(s => s.status === "active").length;
      const totalInvested = mySubs.reduce((sum, sub) => {
        const sol = solutions.find(s => s.id === sub.solution_id);
        return sum + (sol?.preco || 0);
      }, 0);
      return { ...p, activeSubs, totalInvested };
    })
    .sort((a, b) => b.totalInvested - a.totalInvested);

  const fmtBRL = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {empresas.length === 0 ? (
        <div style={{ padding: "56px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
          Nenhuma empresa cadastrada ainda.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Empresa", "E-mail", "Sol. Ativas", "Total Investido", "Cadastro"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empresas.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6366F1", flexShrink: 0 }}>
                        {initials(p.nome)}
                      </div>
                      <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{p.nome || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{p.email || "—"}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color: BLUE }}>{p.activeSubs}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: NEAR_BLACK, whiteSpace: "nowrap" }}>{fmtBRL(p.totalInvested)}</td>
                  <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── WorkspaceTab ── */
function WorkspaceTab() {
  const metrics = [
    { label: "Sessões hoje",       value: "—" },
    { label: "Agentes executados", value: "—" },
    { label: "Tempo médio",        value: "—" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, padding: "48px 24px" }}>
      <div style={{ border: "2px dashed rgba(99,102,241,0.3)", borderRadius: 16, padding: 48, textAlign: "center", background: "rgba(99,102,241,0.02)", width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Icon d={icons.wrench} size={48} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: NEAR_BLACK, marginBottom: 12 }}>Workspace</div>
        <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
          Acompanhe sessões ativas, conversas em andamento e execuções de agentes em tempo real.
          Disponível na Fase 3.
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#D1D5DB", marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TransacoesTab ── */
function TransacoesTab({ subscriptions, solutions, profiles }) {
  const gmv     = subscriptions.reduce((sum, sub) => {
    const sol = solutions.find(s => s.id === sub.solution_id);
    return sum + (sol?.preco || 0);
  }, 0);
  const receita = gmv * 0.15;
  const fmtBRL  = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const summary = [
    { label: "GMV Total",          value: fmtBRL(gmv),              color: BLUE },
    { label: "Receita WePrompt",   value: fmtBRL(receita),          color: "#16A34A" },
    { label: "Total Transações",   value: subscriptions.length,     color: NEAR_BLACK },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {summary.map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color, letterSpacing: "-0.5px" }}>{c.value}</div>
            <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {subscriptions.length === 0 ? (
          <div style={{ padding: "56px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Nenhuma transação registrada ainda.</div>
            <div style={{ fontSize: 14, color: GRAY_TEXT }}>As transações aparecerão aqui após as primeiras vendas.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Empresa", "Criador", "Valor", "Comissão", "Data", "Status"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, i) => {
                  const sol      = solutions.find(s => s.id === sub.solution_id);
                  const empresa  = profiles.find(p => p.id === (sub.business_id || sub.user_id));
                  const criador  = sol ? profiles.find(p => p.id === sol.creator_id) : null;
                  const preco    = sol?.preco || 0;
                  const comissao = preco * 0.15;
                  return (
                    <tr key={sub.id || i} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: NEAR_BLACK }}>{sol?.titulo || sol?.nome || "—"}</td>
                      <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{empresa?.nome || "—"}</td>
                      <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{criador?.nome || "—"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: NEAR_BLACK, whiteSpace: "nowrap" }}>{fmtBRL(preco)}</td>
                      <td style={{ padding: "12px 16px", color: "#6366F1", whiteSpace: "nowrap" }}>{fmtBRL(comissao)}</td>
                      <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(sub.created_at)}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={sub.status === "active" ? "ativo" : sub.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── AnalyticsTab ── */
function AnalyticsTab({ solutions, profiles, subscriptions }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }), month: d.getMonth(), year: d.getFullYear() };
  });

  const usersByMonth = months.map(({ month, year }) =>
    profiles.filter(p => { const c = new Date(p.created_at); return c.getMonth() === month && c.getFullYear() === year; }).length
  );

  const gmvByMonth = months.map(({ month, year }) =>
    subscriptions
      .filter(sub => { const d = new Date(sub.created_at); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, sub) => { const sol = solutions.find(s => s.id === sub.solution_id); return sum + (sol?.preco || 0); }, 0)
  );

  const categories = ["Agentes IA", "Automação", "Marketing", "Analytics", "WhatsApp", "Vendas"];
  const solsByCategory = categories.map(cat =>
    solutions.filter(s => s.categoria === cat && s.status === "approved").length
  );

  const criadoresRevenue = profiles
    .filter(p => p.role === "criador" || p.role === "creator")
    .map(p => ({
      name: (p.nome || p.email?.split("@")[0] || "—").slice(0, 10),
      revenue: subscriptions
        .filter(sub => { const sol = solutions.find(s => s.id === sub.solution_id); return sol?.creator_id === p.id; })
        .reduce((sum, sub) => { const sol = solutions.find(s => s.id === sub.solution_id); return sum + (sol?.preco || 0); }, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  function BarChart({ data, labels, color = BLUE, valuePrefix = "" }) {
    const max = Math.max(...data, 1);
    const allZero = data.every(v => v === 0);
    if (allZero) {
      return <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY_TEXT, fontSize: 13 }}>Sem dados ainda</div>;
    }
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
        {data.map((val, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4, height: "100%" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color }}>{valuePrefix}{val > 1000 ? `${(val / 1000).toFixed(1)}k` : val}</span>
            <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: `${Math.max((val / max) * 100, 4)}%`, background: color, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
            </div>
            <span style={{ fontSize: 10, color: GRAY_TEXT, textAlign: "center", whiteSpace: "nowrap" }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  }

  const chartCard = { background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={chartCard}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>Crescimento de Usuários</div>
        <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Últimos 6 meses</div>
        <BarChart data={usersByMonth} labels={months.map(m => m.label)} color={BLUE} />
      </div>
      <div style={chartCard}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>GMV Mensal</div>
        <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Últimos 6 meses (R$)</div>
        <BarChart data={gmvByMonth} labels={months.map(m => m.label)} color="#6366F1" valuePrefix="R$" />
      </div>
      <div style={chartCard}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>Soluções por Categoria</div>
        <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Soluções ativas aprovadas</div>
        <BarChart data={solsByCategory} labels={categories.map(c => c.slice(0, 8))} color="#16A34A" />
      </div>
      <div style={chartCard}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>Top Criadores por Receita</div>
        <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Top 5 por GMV gerado</div>
        <BarChart data={criadoresRevenue.map(c => c.revenue)} labels={criadoresRevenue.map(c => c.name)} color="#B45309" valuePrefix="R$" />
      </div>
    </div>
  );
}

/* ── CategoriasTab ── */
function CategoriasTab({ solutions }) {
  const [categories, setCategories] = useState([
    "Agentes IA", "Automação", "Marketing", "Analytics",
    "WhatsApp", "Vendas", "Atendimento", "Conteúdo",
  ]);
  const [newCat, setNewCat]     = useState("");
  const [editing, setEditing]   = useState(null);
  const [editValue, setEditValue] = useState("");

  function addCategory() {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => [...prev, trimmed]);
    setNewCat("");
  }

  function saveEdit(old) {
    const trimmed = editValue.trim();
    if (!trimmed || (categories.includes(trimmed) && trimmed !== old)) return;
    setCategories(prev => prev.map(c => c === old ? trimmed : c));
    setEditing(null);
    setEditValue("");
  }

  function deleteCategory(cat) {
    const count = solutions.filter(s => s.categoria === cat && s.status === "approved").length;
    if (count > 0) return;
    setCategories(prev => prev.filter(c => c !== cat));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {categories.map(cat => {
          const count    = solutions.filter(s => s.categoria === cat && s.status === "approved").length;
          const isEditing = editing === cat;
          return (
            <div key={cat} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(cat); if (e.key === "Escape") { setEditing(null); setEditValue(""); } }}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: 6, border: `1.5px solid ${BLUE}`, fontSize: 14, fontWeight: 600, color: NEAR_BLACK, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 600, color: NEAR_BLACK, marginBottom: 4 }}>{cat}</div>
                )}
                <div style={{ fontSize: 12, color: GRAY_TEXT }}>
                  <span style={{ fontWeight: 700, color: count > 0 ? BLUE : GRAY_TEXT }}>{count}</span> soluções ativas
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(cat)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>OK</button>
                    <button onClick={() => { setEditing(null); setEditValue(""); }} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 12, cursor: "pointer" }}>✕</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(cat); setEditValue(cat); }} title="Editar"
                      style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Icon d={icons.pencil} size={13} />
                    </button>
                    <button onClick={() => deleteCategory(cat)} disabled={count > 0} title={count > 0 ? `${count} soluções usam esta categoria` : "Excluir"}
                      style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${count > 0 ? BORDER : "rgba(220,38,38,0.25)"}`, background: "transparent", color: count > 0 ? "#d1d5db" : DANGER, cursor: count > 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => { if (count === 0) e.currentTarget.style.background = "rgba(220,38,38,0.06)"; }}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Icon d={icons.trash} size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 400 }}>
        <input type="text" placeholder="Nova categoria…" value={newCat} onChange={e => setNewCat(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addCategory(); }}
          style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, outline: "none", fontFamily: "inherit" }}
          onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
        <button onClick={addCategory} disabled={!newCat.trim()}
          style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: newCat.trim() ? BLUE : "#e5e7eb", color: newCat.trim() ? "#fff" : GRAY_TEXT, fontSize: 13, fontWeight: 600, cursor: newCat.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          Adicionar
        </button>
      </div>
    </div>
  );
}

/* ── ConfiguracoesTab ── */
function ConfiguracoesTab() {
  const card = { background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "24px 28px", marginBottom: 16 };
  const row  = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` };
  const lbl  = { fontSize: 13, color: NEAR_BLACK };
  const val  = { fontSize: 13, fontWeight: 600, color: GRAY_TEXT };

  const integrations = [
    { name: "Stripe",   detail: "Produção ativa" },
    { name: "Resend",   detail: "contato@weprompt.app.br" },
    { name: "Supabase", detail: "São Paulo (SP)" },
    { name: "Vercel",   detail: "Deploy automático" },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Card 1 — Status */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Status da Plataforma</div>
        <div style={row}>
          <span style={lbl}>Status</span>
          <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>Online · 99.9% uptime</span>
        </div>
        <div style={{ ...row, borderBottom: "none" }}>
          <span style={lbl}>Versão</span>
          <span style={val}>1.0.0 — Beta</span>
        </div>
      </div>

      {/* Card 2 — Taxas */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Taxas de Comissão</div>
        {[["Free Plan", "20%"], ["Pro Plan", "15%"], ["Premium Plan", "10%"]].map(([plan, pct]) => (
          <div key={plan} style={row}>
            <span style={lbl}>{plan}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{pct} comissão</span>
          </div>
        ))}
        <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 12 }}>Aplicadas automaticamente nas transações</div>
      </div>

      {/* Card 3 — Integrações */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Integrações Ativas</div>
        {integrations.map(({ name, detail }) => (
          <div key={name} style={row}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK }}>{name}</span>
            </div>
            <span style={val}>{detail}</span>
          </div>
        ))}
      </div>

      {/* Card 4 — Contato */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Contato e Suporte</div>
        <div style={{ fontSize: 14, color: NEAR_BLACK, marginBottom: 6 }}>contato@weprompt.app.br</div>
        <div style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 10 }}>Gerenciar via Resend dashboard</div>
        <a href="https://resend.com" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: BLUE, fontWeight: 600, textDecoration: "none" }}>Abrir Resend →</a>
      </div>

      {/* Card 5 — Docs legais */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Documentos Legais</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="/privacidade" style={{ fontSize: 13, color: BLUE, fontWeight: 600, textDecoration: "none" }}>Política de Privacidade →</a>
          <a href="/termos" style={{ fontSize: 13, color: BLUE, fontWeight: 600, textDecoration: "none" }}>Termos de Uso →</a>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 4 }}>Última atualização: Junho 2026</div>
        </div>
      </div>
    </div>
  );
}

/* ── ProfileDrawer ── */
function ProfileDrawer({ profile, userEmail, onClose, onSaved }) {
  const [nome,     setNome]     = useState(profile?.nome     || "");
  const [telefone, setTelefone] = useState(profile?.telefone || "");
  const [cidade,   setCidade]   = useState(profile?.cidade   || "");
  const [bio,      setBio]      = useState(profile?.bio      || "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome     || "");
      setTelefone(profile.telefone || "");
      setCidade(profile.cidade   || "");
      setBio(profile.bio      || "");
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    await supabase.from("profiles")
      .update({ nome, telefone, cidade, bio })
      .eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    onSaved?.({ ...profile, nome, telefone, cidade, bio });
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSignOutFromDrawer() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const lbl = { fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 199 }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100vh",
        width: 400, maxWidth: "100vw",
        background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        zIndex: 200, padding: 32, overflowY: "auto",
        boxSizing: "border-box",
        animation: "slideInProfile 0.25s ease",
      }}>
        <style>{`@keyframes slideInProfile { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK }}>Meu Perfil</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Icon d={icons.x} size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 auto 12px" }}>
            {initials(nome || profile?.nome || "A")}
          </div>
          <button style={{ fontSize: 13, color: BLUE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Alterar foto
          </button>
          <div style={{ fontSize: 11, color: GRAY_TEXT, marginTop: 4 }}>Upload de foto disponível em breve</div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Nome completo</label>
            <input value={nome} onChange={e => setNome(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input value={userEmail || ""} readOnly style={{ ...inp, background: "#f9fafb", color: GRAY_TEXT, cursor: "default" }} />
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 4 }}>Para alterar o email, entre em contato</div>
          </div>
          <div>
            <label style={lbl}>Telefone</label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="+55 11 99999-9999" style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div>
            <label style={lbl}>Cidade</label>
            <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="São Paulo, SP" style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div>
            <label style={lbl}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Conte um pouco sobre você..." rows={3}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", fontFamily: "inherit", marginTop: 24, fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s", color: "#fff", background: saved ? "#16A34A" : saving ? "rgba(99,102,241,0.5)" : BLUE }}>
          {saved ? "✓ Perfil atualizado!" : saving ? "Salvando…" : "Salvar alterações"}
        </button>

        {/* Danger zone */}
        <div style={{ borderTop: "1px solid #FEE2E2", marginTop: 32, paddingTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#EF4444", marginBottom: 12 }}>Zona de Perigo</div>
          <button onClick={handleSignOutFromDrawer}
            style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid #FECACA", background: "#FEF2F2", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function AdminDashboard() {
  const router  = useRouter();
  const width   = useWindowSize();
  const isMobile = width < 768;

  /* nav */
  const [activeNav, setActiveNav]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* auth */
  const [loading, setLoading]   = useState(true);
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);

  /* data */
  const [solutions,      setSolutions]      = useState([]);
  const [profiles,       setProfiles]       = useState([]);
  const [subscriptions,  setSubscriptions]  = useState([]);

  /* actions */
  const [actionLoading,    setActionLoading]    = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

  /* profile drawer */
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: prof } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      if (!prof || prof.role !== "admin") { router.replace("/"); return; }

      setUser(session.user);
      setProfile(prof);

      const [solRes, subsRes] = await Promise.all([
        supabase.from("solutions")
          .select("*, profiles:creator_id(nome)")
          .order("created_at", { ascending: false }),
        supabase.from("subscriptions")
          .select("*, solutions(preco)")
          .order("created_at", { ascending: false }),
      ]);

      // Try RPC that joins auth.users to get emails; fall back to direct query
      // SQL to create the function (run once in Supabase SQL editor):
      // CREATE OR REPLACE FUNCTION get_users_with_email()
      // RETURNS TABLE(id uuid, nome text, email text, role text, status text, created_at timestamptz)
      // LANGUAGE sql SECURITY DEFINER AS $$
      //   SELECT p.id, p.nome, u.email, p.role, p.status, p.created_at
      //   FROM profiles p JOIN auth.users u ON p.id = u.id
      // $$;
      let profData = [];
      const { data: rpcData, error: rpcErr } = await supabase
        .rpc("get_users_with_email")
        .order("created_at", { ascending: false });
      if (!rpcErr && rpcData) {
        profData = rpcData;
      } else {
        const { data: fallback } = await supabase
          .from("profiles").select("*").order("created_at", { ascending: false });
        profData = fallback || [];
      }

      if (solRes.data)  setSolutions(solRes.data);
      setProfiles(profData);
      if (subsRes.data) setSubscriptions(subsRes.data);

      setLoading(false);
    }
    init();
  }, [router]);

  async function handleSignOut() { await signOut(); router.replace("/login"); }

  function navigate(key) {
    setActiveNav(key);
    if (isMobile) setSidebarOpen(false);
  }

  async function handleApprove(id) {
    setActionLoading(id);
    await supabase.from("solutions").update({ status: "approved" }).eq("id", id);
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s));
    setActionLoading(null);
  }

  async function handleConfirmReject(solution, reason) {
    setActionLoading(solution.id);
    await supabase.from("solutions")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", solution.id);
    setSolutions(prev => prev.map(s =>
      s.id === solution.id ? { ...s, status: "rejected", rejection_reason: reason } : s
    ));
    setActionLoading(null);
  }

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG_GRAY }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="admin-loading" />
          <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 16 }}>Verificando acesso…</div>
        </div>
      </div>
    );
  }

  /* ── Shell ── */
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK, background: BG_GRAY }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,0.4)" }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, flexShrink: 0, background: "#fff", borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0,
        left: isMobile && !sidebarOpen ? -260 : 0,
        zIndex: 50, transition: "left 0.25s ease", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid #E5E7EB`, marginBottom: 8, flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/logo.png" alt="WePrompt" style={{ width: 130, height: "auto", display: "block" }} />
          </Link>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "4px 12px 8px" }}>
          {SIDEBAR_ITEMS.map(item => (
            <NavItem
              key={item.key}
              label={item.label}
              iconD={icons[item.icon]}
              active={activeNav === item.key}
              onClick={() => navigate(item.key)}
            />
          ))}
        </div>

        {/* Bottom: avatar + logout */}
        <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div
            onClick={() => setProfileOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "6px 4px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, flexShrink: 0, transition: "opacity 0.15s, outline 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.outline = `2px solid ${BLUE}`; e.currentTarget.style.outlineOffset = "2px"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.outline = "none"; }}>
              {initials(profile?.nome || "Admin")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.nome || "Admin"}</div>
              <div style={{ fontSize: 11, color: GRAY_TEXT, fontWeight: 500 }}>Administrador · editar perfil</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: DANGER, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(220,38,38,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <Icon d={icons.logout} size={15} /> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : 260, minWidth: 0, minHeight: "100vh" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link href="/" style={{ textDecoration: "none" }}><WePromptLogo id="admin-mobile" dark /></Link>
              <span style={{ background: DANGER, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99, letterSpacing: "0.5px", textTransform: "uppercase" }}>Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NEAR_BLACK, padding: "4px 8px", display: "flex", alignItems: "center" }}>
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>
        )}

        <div style={{ padding: isMobile ? "24px 16px 40px" : "36px 40px" }}>

          {/* Page heading */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, margin: 0, letterSpacing: "-0.5px" }}>
                {TAB_LABELS[activeNav]}
              </h1>
              {activeNav === "dashboard" && (
                <p style={{ fontSize: 13, color: GRAY_TEXT, margin: "4px 0 0", textTransform: "capitalize" }}>{todayPtBR()}</p>
              )}
            </div>
            <NotificationBell />
          </div>

          {/* Tab content */}
          {activeNav === "dashboard"     && <DashboardTab solutions={solutions} profiles={profiles} subscriptions={subscriptions} onNavigate={navigate} />}
          {activeNav === "solucoes"      && <SolucoesTab solutions={solutions} onApprove={handleApprove} onConfirmReject={handleConfirmReject} onView={s => setSelectedSolution(s)} actionLoading={actionLoading} isMobile={isMobile} />}
          {activeNav === "solicitacoes"  && <SolicitacoesTab solutions={solutions} onApprove={handleApprove} onConfirmReject={handleConfirmReject} onView={s => setSelectedSolution(s)} actionLoading={actionLoading} isMobile={isMobile} />}
          {activeNav === "usuarios"      && <UsuariosTab profiles={profiles} />}
          {activeNav === "criadores"     && <CriadoresTab profiles={profiles} solutions={solutions} subscriptions={subscriptions} />}
          {activeNav === "empresas"      && <EmpresasTab profiles={profiles} subscriptions={subscriptions} solutions={solutions} />}
          {activeNav === "workspace"     && <WorkspaceTab />}
          {activeNav === "transacoes"    && <TransacoesTab subscriptions={subscriptions} solutions={solutions} profiles={profiles} />}
          {activeNav === "analytics"     && <AnalyticsTab solutions={solutions} profiles={profiles} subscriptions={subscriptions} />}
          {activeNav === "categorias"    && <CategoriasTab solutions={solutions} />}
          {activeNav === "configuracoes" && <ConfiguracoesTab />}

        </div>
      </main>

      {/* Profile drawer */}
      {profileOpen && (
        <ProfileDrawer
          profile={profile}
          userEmail={user?.email}
          onClose={() => setProfileOpen(false)}
          onSaved={updated => setProfile(updated)}
        />
      )}

    </div>
  );
}
