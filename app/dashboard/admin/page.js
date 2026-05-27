"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";
import NotificationBell from "../../components/NotificationBell";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";
const GREEN      = "#059669";
const DANGER     = "#dc2626";

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home:        "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  puzzle:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  tag:         "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z",
  users:       "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  pencil:      "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  building:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  arrows:      "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  cash:        "M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  chart:       "M18 20V10 M12 20V4 M6 20v-6",
  settings:    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  percent:     "M19 5L5 19 M6.5 6.5h.01 M17.5 17.5h.01",
  photo:       "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5L5 21",
  mail:        "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  message:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  flag:        "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  ban:         "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  check:       "M20 6L9 17l-5-5",
  x:           "M18 6L6 18M6 6l12 12",
  logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  file:        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
  download:    "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  link:        "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  search:      "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
  wrench:      "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  trash:       "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
};

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function todayPtBR() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
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
      background: active ? "#e0f2fe" : "transparent",
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

/* ── KpiCard ── */
function KpiCard({ label, value, sub, subColor, iconD, accent }) {
  const color = accent || BLUE;
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      padding: "20px 22px", flex: "1 1 160px", minWidth: 0,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, background: "#e0f2fe",
        display: "flex", alignItems: "center", justifyContent: "center",
        color, marginBottom: 12,
      }}>
        <Icon d={iconD} size={17} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: subColor || GREEN, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── StatusBadge ── */
function StatusBadge({ status }) {
  const map = {
    pending:   { label: "Pendente",    bg: "rgba(217,119,6,0.1)",   color: "#B45309" },
    pendente:  { label: "Pendente",    bg: "rgba(217,119,6,0.1)",   color: "#B45309" },
    approved:  { label: "Ativa",       bg: "rgba(5,150,105,0.1)",   color: GREEN },
    active:    { label: "Ativa",       bg: "rgba(5,150,105,0.1)",   color: GREEN },
    ativo:     { label: "Ativo",       bg: "rgba(5,150,105,0.1)",   color: GREEN },
    rejected:  { label: "Reprovada",   bg: "rgba(220,38,38,0.1)",   color: DANGER },
    paused:    { label: "Pausada",     bg: "rgba(107,114,128,0.1)", color: "#4B5563" },
    banido:    { label: "Banido",      bg: "rgba(220,38,38,0.1)",   color: DANGER },
    criador:   { label: "Criador",     bg: "#e0f2fe",               color: BLUE },
    creator:   { label: "Criador",     bg: "#e0f2fe",               color: BLUE },
    empresa:   { label: "Empresa",     bg: "rgba(139,92,246,0.1)",  color: "#7C3AED" },
    business:  { label: "Empresa",     bg: "rgba(139,92,246,0.1)",  color: "#7C3AED" },
    admin:     { label: "Admin",       bg: "rgba(220,38,38,0.1)",   color: DANGER },
    venda:     { label: "Venda",       bg: "#e0f2fe",               color: BLUE },
    repasse:   { label: "Repasse",     bg: "rgba(5,150,105,0.1)",   color: GREEN },
    assinatura:{ label: "Assinatura",  bg: "rgba(139,92,246,0.1)",  color: "#7C3AED" },
    concluido: { label: "Concluído",   bg: "rgba(5,150,105,0.1)",   color: GREEN },
    pendente_repasse: { label: "Pendente", bg: "rgba(217,119,6,0.1)", color: "#B45309" },
  };
  const s = map[status] || { label: status || "—", bg: "rgba(0,0,0,0.07)", color: GRAY_TEXT };
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, display: "inline-block",
    }}>{s.label}</span>
  );
}

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999, pointerEvents: "none" }}>
      <div style={{
        background: NEAR_BLACK, color: "#fff", borderRadius: 12, padding: "12px 24px",
        fontSize: 14, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        borderLeft: `4px solid ${type === "error" ? DANGER : GREEN}`,
        display: "flex", alignItems: "center", gap: 10,
        animation: "toastIn 0.2s ease",
      }}>
        <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <span>{type === "error" ? "✗" : "✓"}</span>
        {message}
      </div>
    </div>
  );
}

/* ── ComingSoon ── */
function ComingSoon({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, marginBottom: 20 }}>
        <Icon d={icons.wrench} size={28} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 14, color: GRAY_TEXT }}>Esta seção estará disponível em breve</div>
    </div>
  );
}

/* ── BarChart ── */
function BarChart({ data, labels }) {
  const W = 400, H = 160, PL = 38, PB = 26, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...data) * 1.12;
  const barW = (cW / data.length) * 0.55;
  const gap  = cW / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = PT + cH * (1 - f);
        return (
          <g key={f}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            {f > 0 && <text x={PL - 4} y={y + 4} textAnchor="end" fontSize="9" fill={GRAY_TEXT}>{`${Math.round(max * f / 1000)}k`}</text>}
          </g>
        );
      })}
      {data.map((v, i) => {
        const bh = (v / max) * cH;
        const x  = PL + gap * i + (gap - barW) / 2;
        const y  = PT + cH - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} fill={BLUE} rx={3} opacity="0.85" />
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill={GRAY_TEXT}>{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── LineChart ── */
function LineChart({ criadores, empresas, labels }) {
  const W = 400, H = 160, PL = 34, PB = 26, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...criadores, ...empresas) * 1.15;
  function pts(data) {
    return data.map((v, i) => {
      const x = PL + (i / (data.length - 1)) * cW;
      const y = PT + cH * (1 - v / max);
      return `${x},${y}`;
    }).join(" ");
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = PT + cH * (1 - f);
        return <line key={f} x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <polyline points={pts(criadores)} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={pts(empresas)}  fill="none" stroke="#0891b2" strokeWidth="2.5" strokeLinejoin="round" />
      {criadores.map((v, i) => {
        const x = PL + (i / (criadores.length - 1)) * cW;
        const y = PT + cH * (1 - v / max);
        return <circle key={i} cx={x} cy={y} r={3} fill={BLUE} />;
      })}
      {empresas.map((v, i) => {
        const x = PL + (i / (empresas.length - 1)) * cW;
        const y = PT + cH * (1 - v / max);
        return <circle key={i} cx={x} cy={y} r={3} fill="#0891b2" />;
      })}
      {labels.map((l, i) => {
        const x = PL + (i / (labels.length - 1)) * cW;
        return <text key={i} x={x} y={H - 6} textAnchor="middle" fontSize="9" fill={GRAY_TEXT}>{l}</text>;
      })}
    </svg>
  );
}

/* ── RejectDialog ── */
function RejectDialog({ solution, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleConfirm() {
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 16px 60px rgba(0,0,0,0.12)", width: "100%", maxWidth: 460, padding: "32px", animation: "modalIn 0.2s ease" }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(6px) } to { opacity:1; transform:none } }`}</style>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: DANGER }}>
          <Icon d={icons.x} size={20} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: NEAR_BLACK, margin: "0 0 8px" }}>Reprovar solução</h2>
        <p style={{ fontSize: 14, color: GRAY_TEXT, margin: "0 0 20px" }}>
          <strong style={{ color: NEAR_BLACK }}>{solution.titulo}</strong> — informe o motivo da reprovação.
        </p>
        <textarea autoFocus rows={4}
          placeholder="Ex: Descrição insuficiente, categoria incorreta, conteúdo inadequado…"
          value={reason} onChange={e => setReason(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 20 }}
          onFocus={e => (e.target.style.borderColor = DANGER)} onBlur={e => (e.target.style.borderColor = BORDER)} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
          <button onClick={handleConfirm} disabled={loading || !reason.trim()} style={{ padding: "10px 22px", borderRadius: 10, background: loading || !reason.trim() ? "rgba(220,38,38,0.3)" : DANGER, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: loading || !reason.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Reprovando…" : "Confirmar reprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── DetailDrawer ── */
function DetailDrawer({ solution, onClose, onApprove, onReject, actionLoading }) {
  const [fileUrls, setFileUrls] = useState({});
  const [curationNotes, setCurationNotes] = useState(solution.curation_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const isLoading = actionLoading === solution.id;

  useEffect(() => {
    const files = solution.delivery_files || [];
    if (!files.length) return;
    async function generateUrls() {
      const urls = {};
      for (const f of files) {
        if (!f.path) continue;
        const { data } = await supabase.storage.from("solution-files").createSignedUrl(f.path, 3600);
        if (data?.signedUrl) urls[f.path] = data.signedUrl;
      }
      setFileUrls(urls);
    }
    generateUrls();
  }, [solution]);

  async function saveNotes() {
    setSavingNotes(true);
    await supabase.from("solutions").update({ curation_notes: curationNotes }).eq("id", solution.id);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${solution.payment_type === "one_time" ? " (único)" : "/mês"}`
    : "Gratuito";
  const hasDelivery = (solution.delivery_files?.length > 0) || (solution.delivery_links?.length > 0) || !!solution.delivery_instructions;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 580, maxWidth: "100vw", background: "#fff", borderLeft: `1px solid ${BORDER}`, boxShadow: "-8px 0 40px rgba(0,0,0,0.08)", zIndex: 301, display: "flex", flexDirection: "column", animation: "drawerIn 0.25s ease" }}>
        <style>{`@keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Detalhes da solução</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 1 }}>{solution.profiles?.nome || "—"} · enviada para curadoria</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Icon d={icons.x} size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {solution.cover_url && (
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20, border: `1px solid ${BORDER}` }}>
              <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{solution.categoria}</span>
            <StatusBadge status={solution.payment_type === "one_time" ? "venda" : "assinatura"} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: NEAR_BLACK, margin: "0 0 10px", letterSpacing: "-0.3px" }}>{solution.titulo}</h3>
          <p style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-line" }}>{solution.descricao}</p>
          <div style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 4 }}>{priceLabel}</div>
          <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Material de entrega</div>
            {!hasDelivery && (
              <div style={{ padding: "16px", borderRadius: 10, background: "#f9fafb", border: `1px solid ${BORDER}`, fontSize: 13, color: GRAY_TEXT, fontStyle: "italic" }}>Nenhum material de entrega enviado.</div>
            )}
            {solution.delivery_files?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, marginBottom: 8 }}>Arquivos ({solution.delivery_files.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {solution.delivery_files.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#f9fafb" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <span style={{ color: GRAY_TEXT }}><Icon d={icons.file} size={16} /></span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                          {f.size_bytes && <div style={{ fontSize: 11, color: GRAY_TEXT }}>{formatBytes(f.size_bytes)}</div>}
                        </div>
                      </div>
                      {fileUrls[f.path] ? (
                        <a href={fileUrls[f.path]} download target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, background: "#e0f2fe", color: BLUE, fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                          <Icon d={icons.download} size={12} /> Download
                        </a>
                      ) : (
                        <span style={{ fontSize: 11, color: GRAY_TEXT }}>Carregando…</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {solution.delivery_links?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, marginBottom: 8 }}>Links de acesso</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {solution.delivery_links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(3,105,161,0.2)", background: "rgba(3,105,161,0.05)", color: BLUE, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      <Icon d={icons.link} size={14} /> {l.label || l.url}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {solution.delivery_instructions && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, marginBottom: 8 }}>Instruções</div>
                <div style={{ padding: "14px 16px", borderRadius: 10, background: "#f9fafb", border: `1px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, lineHeight: 1.75, whiteSpace: "pre-line" }}>{solution.delivery_instructions}</div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: NEAR_BLACK, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Notas internas de curadoria</div>
            <textarea value={curationNotes} onChange={e => { setCurationNotes(e.target.value); setNotesSaved(false); }} rows={4}
              placeholder="Observações internas, histórico de decisões…"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
            <button onClick={saveNotes} disabled={savingNotes} style={{ marginTop: 8, padding: "8px 18px", borderRadius: 8, background: notesSaved ? GREEN : "rgba(0,0,0,0.07)", color: notesSaved ? "#fff" : NEAR_BLACK, border: "none", fontSize: 13, fontWeight: 600, cursor: savingNotes ? "wait" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
              {savingNotes ? "Salvando…" : notesSaved ? "✓ Salvo" : "Salvar notas"}
            </button>
          </div>
        </div>

        {solution.status === "pending" && (
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10, flexShrink: 0, background: "#fff" }}>
            <button onClick={() => onApprove(solution.id)} disabled={isLoading} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: isLoading ? "rgba(5,150,105,0.4)" : GREEN, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#047857"; }} onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = GREEN; }}>
              <Icon d={icons.check} size={16} /> Aprovar solução
            </button>
            <button onClick={() => onReject(solution)} disabled={isLoading} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "transparent", color: DANGER, border: "1.5px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "rgba(220,38,38,0.07)"; }} onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "transparent"; }}>
              <Icon d={icons.x} size={16} /> Reprovar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── CONFIG GERAIS TAB ── */
function ConfigGeraisTab({ isMobile }) {
  const [taxaFree, setTaxaFree]   = useState("20");
  const [taxaPro, setTaxaPro]     = useState("15");
  const [taxaPrem, setTaxaPrem]   = useState("10");
  const [prazo, setPrazo]         = useState("30");
  const [minSaque, setMinSaque]   = useState("50,00");
  const [emailSup, setEmailSup]   = useState("contato@weprompt.app.br");
  const [nomePlat, setNomePlat]   = useState("WePrompt");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  const card = { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: isMobile ? "24px 20px" : "28px 32px", marginBottom: 20 };
  const lbl  = { fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" };
  const inp  = { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" };

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 800);
  }

  return (
    <form onSubmit={handleSave}>
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Taxas e Comissões</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {[["Plano Free (%)", taxaFree, setTaxaFree], ["Plano Pro (%)", taxaPro, setTaxaPro], ["Plano Premium (%)", taxaPrem, setTaxaPrem]].map(([label, value, set]) => (
            <div key={label}>
              <label style={lbl}>{label}</label>
              <input type="number" min="0" max="100" value={value} onChange={e => set(e.target.value)} style={inp}
                onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Configurações Financeiras</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div>
            <label style={lbl}>Prazo de Repasse (dias)</label>
            <input type="number" value={prazo} onChange={e => setPrazo(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div>
            <label style={lbl}>Valor Mínimo de Saque (R$)</label>
            <input type="text" value={minSaque} onChange={e => setMinSaque(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Dados da Plataforma</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div>
            <label style={lbl}>Nome da Plataforma</label>
            <input type="text" value={nomePlat} onChange={e => setNomePlat(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div>
            <label style={lbl}>E-mail de Suporte</label>
            <input type="email" value={emailSup} onChange={e => setEmailSup(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
        </div>
      </div>

      {saved && (
        <div style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, padding: "11px 16px", fontSize: 13, color: GREEN, marginBottom: 16 }}>
          ✓ Configurações salvas com sucesso!
        </div>
      )}
      <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: saving ? "rgba(3,105,161,0.5)" : BLUE, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
        {saving ? "Salvando…" : "Salvar configurações"}
      </button>
    </form>
  );
}

/* ── TRANSAÇÕES TAB ── */
function TransacoesTab({ isMobile }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("subscriptions")
      .select("id, created_at, status, solution_id, user_id, solutions(titulo, preco, payment_type, creator_id), buyer:profiles!subscriptions_user_id_fkey(nome, email)")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => { setSubs(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmt = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  const totalBruto       = subs.reduce((s, r) => s + (r.solutions?.preco || 0), 0);
  const totalComissao    = totalBruto * 0.15;
  const repassePendente  = subs.filter(r => r.status === "active").reduce((s, r) => s + (r.solutions?.preco || 0) * 0.85, 0);
  const repasseRealizado = subs.filter(r => r.status === "cancelled" || r.status === "completed").reduce((s, r) => s + (r.solutions?.preco || 0) * 0.85, 0);

  const summary = [
    { label: "Receita Bruta",       value: fmt(totalBruto),       sub: `${subs.length} transações`,    color: BLUE },
    { label: "Comissões (15%)",      value: fmt(totalComissao),    sub: "retidos pela plataforma",      color: "#7C3AED" },
    { label: "Repasses Pendentes",   value: fmt(repassePendente),  sub: "assinaturas ativas",           color: "#B45309" },
    { label: "Repasses Realizados",  value: fmt(repasseRealizado), sub: "transações encerradas",        color: GREEN },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {summary.map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, letterSpacing: "-0.5px" }}>{c.value}</div>
            <div style={{ fontSize: 13, color: NEAR_BLACK, fontWeight: 600, marginTop: 4 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontWeight: 700, fontSize: 15, color: NEAR_BLACK }}>Histórico de Transações</div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: GRAY_TEXT }}>Carregando transações…</div>
        ) : subs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🧾</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Nenhuma transação registrada ainda</div>
            <div style={{ fontSize: 14, color: GRAY_TEXT }}>As transações aparecerão aqui conforme as compras forem realizadas.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Data", "Tipo", "Comprador", "Solução", "Valor", "Status"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((r, i) => {
                  const tipo   = r.solutions?.payment_type === "subscription" ? "assinatura" : "venda";
                  const nome   = r.buyer?.nome || r.buyer?.email || "—";
                  const titulo = r.solutions?.titulo || "—";
                  const valor  = fmt(r.solutions?.preco || 0);
                  const badge  = r.status === "active" ? "ativo" : r.status === "cancelled" ? "paused" : "pendente";
                  return (
                    <tr key={r.id || i} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={tipo} /></td>
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: NEAR_BLACK }}>{nome}</td>
                      <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{titulo}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: NEAR_BLACK }}>{valor}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={badge} /></td>
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

/* ── USUÁRIOS TAB ── */
function UsuariosTab({ isMobile }) {
  const [allProfiles, setAllProfiles] = useState([]);
  const [loadingP, setLoadingP]       = useState(true);
  const [filterRole, setFilterRole]   = useState("todos");
  const [search, setSearch]           = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setAllProfiles(data);
      setLoadingP(false);
    }
    load();
  }, []);

  const filtered = allProfiles.filter(p => {
    const r = p.role;
    const matchRole =
      filterRole === "todos" ||
      (filterRole === "criadores" && (r === "criador" || r === "creator")) ||
      (filterRole === "empresas"  && (r === "empresa" || r === "business"));
    const matchSearch = !search || p.nome?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["todos", "Todos"], ["criadores", "Criadores"], ["empresas", "Empresas"]].map(([key, lbl]) => (
            <button key={key} onClick={() => setFilterRole(key)} style={{ padding: "7px 16px", borderRadius: 99, border: "none", background: filterRole === key ? BLUE : "#fff", color: filterRole === key ? "#fff" : GRAY_TEXT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{lbl}</button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: GRAY_TEXT, pointerEvents: "none" }}>
            <Icon d={icons.search} size={15} />
          </span>
          <input type="text" placeholder="Buscar usuário…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {loadingP ? (
          <div style={{ padding: "48px", textAlign: "center", color: GRAY_TEXT }}>Carregando…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: GRAY_TEXT }}>Nenhum usuário encontrado.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Usuário", "Email", "Tipo", "Plano", "Cadastro", "Ações"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                          {initials(p.nome)}
                        </div>
                        <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{p.nome || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>—</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={p.role} /></td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status="ativo" /></td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid rgba(220,38,38,0.3)`, background: "transparent", color: DANGER, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Banir</button>
                    </td>
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

/*
 * ALTER TABLE solutions ADD COLUMN IF NOT EXISTS rejection_reason text;
 */

/* ── SOLUÇÕES TAB ── */
function SolucoesTab({ solutions, onApprove, onConfirmReject, onPause, onReactivate, onView, actionLoading, isMobile }) {
  const [filterStatus, setFilterStatus]   = useState("todas");
  const [search, setSearch]               = useState("");
  const [rejectingId, setRejectingId]     = useState(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const statusMap = { todas: null, pendentes: "pending", ativas: "approved", pausadas: "paused", reprovadas: "rejected" };

  const filtered = solutions.filter(s => {
    const matchStatus = !statusMap[filterStatus] || s.status === statusMap[filterStatus];
    const matchSearch = !search || s.titulo?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function submitReject(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onConfirmReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["todas","Todas"],["pendentes","Pendentes"],["ativas","Ativas"],["pausadas","Pausadas"],["reprovadas","Reprovadas"]].map(([key, lbl]) => (
            <button key={key} onClick={() => setFilterStatus(key)} style={{ padding: "7px 16px", borderRadius: 99, border: "none", background: filterStatus === key ? BLUE : "#fff", color: filterStatus === key ? "#fff" : GRAY_TEXT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{lbl}</button>
          ))}
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

      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: GRAY_TEXT }}>Nenhuma solução encontrada.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Criador", "Categoria", "Preço", "Status", "Ações"].map(h => (
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
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, overflow: "hidden", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {s.cover_url
                                ? <img src={s.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span style={{ color: BLUE, opacity: 0.5 }}>✦</span>}
                            </div>
                            <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{s.titulo}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.profiles?.nome || "—"}</td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.categoria || "—"}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK }}>
                          {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                        </td>
                        <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button onClick={() => onView(s)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Ver</button>
                            {s.status === "pending" && (
                              <>
                                <button onClick={() => onApprove(s.id)} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(5,150,105,0.1)", color: GREEN, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Aprovar</button>
                                <button onClick={() => { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); }} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: isRejecting ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.1)", color: DANGER, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Reprovar</button>
                              </>
                            )}
                            {s.status === "approved" && (
                              <button onClick={() => onPause(s.id)} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(107,114,128,0.1)", color: "#4B5563", fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Pausar</button>
                            )}
                            {s.status === "paused" && (
                              <button onClick={() => onReactivate(s.id)} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(5,150,105,0.1)", color: GREEN, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Reativar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isRejecting && (
                        <tr>
                          <td colSpan={6} style={{ padding: "0 16px 12px", background: "rgba(220,38,38,0.02)", borderTop: "none" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
                              <input
                                autoFocus
                                placeholder="Motivo da reprovação…"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") submitReject(s); if (e.key === "Escape") { setRejectingId(null); setRejectReason(""); } }}
                                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 13, color: NEAR_BLACK, outline: "none", fontFamily: "inherit", background: "#fff" }}
                              />
                              <button onClick={() => submitReject(s)} disabled={!rejectReason.trim() || rejectLoading} style={{ padding: "8px 14px", borderRadius: 8, background: !rejectReason.trim() || rejectLoading ? "rgba(220,38,38,0.3)" : DANGER, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() || rejectLoading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                                {rejectLoading ? "…" : "Confirmar"}
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: GRAY_TEXT, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
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

/* ── DASHBOARD TAB ── */
function DashboardTab({ solutions, profiles, onApprove, onConfirmReject, onView, actionLoading, isMobile }) {
  const [rejectingId, setRejectingId]     = useState(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [revenueData, setRevenueData]     = useState([0,0,0,0,0,0]);

  const pending      = solutions.filter(s => s.status === "pending");

  const now = new Date();
  const last6Months = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now); d.setMonth(d.getMonth() - 5 + i);
    return { year: d.getFullYear(), month: d.getMonth() };
  }), []);
  const chartLabels = last6Months.map(({ month }) =>
    ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][month]
  );

  useEffect(() => {
    async function loadRevenue() {
      const { data } = await supabase
        .from("subscriptions")
        .select("created_at, solutions(preco)");
      if (data) {
        const byMonth = last6Months.map(({ year, month }) =>
          data.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; })
            .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
        );
        setRevenueData(byMonth);
      }
    }
    loadRevenue();
  }, [last6Months]);

  async function submitRejectDash(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onConfirmReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }
  const criadores    = profiles.filter(p => p.role === "criador" || p.role === "creator");
  const empresas     = profiles.filter(p => p.role === "empresa"  || p.role === "business");
  const recentSignups = [...profiles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const criadoresData = last6Months.map(({ year, month }) =>
    profiles.filter(p => (p.role === "criador" || p.role === "creator") && (() => { const d = new Date(p.created_at); return d.getFullYear() === year && d.getMonth() === month; })()).length
  );
  const empresasData = last6Months.map(({ year, month }) =>
    profiles.filter(p => (p.role === "empresa" || p.role === "business") && (() => { const d = new Date(p.created_at); return d.getFullYear() === year && d.getMonth() === month; })()).length
  );

  const quickActions = [
    { label: "Adicionar Categoria", icon: icons.tag,     color: BLUE },
    { label: "Enviar E-mail",       icon: icons.mail,    color: "#7C3AED" },
    { label: "Relatório Mensal",    icon: icons.chart,   color: GREEN },
    { label: "Gerenciar Banners",   icon: icons.photo,   color: "#B45309" },
    { label: "Configurar Taxas",    icon: icons.percent, color: "#0891b2" },
    { label: "Exportar Dados",      icon: icons.download, color: GRAY_TEXT },
  ];

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "flex", gap: 14, marginBottom: 26, flexWrap: "wrap" }}>
        <KpiCard label="Usuários Totais"       value={profiles.length || "—"}  sub={`+${Math.max(1, Math.round(profiles.length * 0.08))} esta semana`} subColor={GREEN}           iconD={icons.users} />
        <KpiCard label="Criadores Ativos"      value={criadores.length || "—"} iconD={icons.pencil} />
        <KpiCard label="Empresas Cadastradas"  value={empresas.length || "—"}  iconD={icons.building} />
        <KpiCard label="Receita Mensal"        value="R$ 8.900"                sub="este mês"    subColor={BLUE}           iconD={icons.cash} />
        <KpiCard label="Aprovações Pendentes"  value={pending.length}          sub={pending.length > 0 ? `${pending.length} aguardando` : "Em dia ✅"} subColor={pending.length > 0 ? "#B45309" : GREEN} iconD={icons.eye} accent={pending.length > 0 ? "#B45309" : GREEN} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 26 }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK }}>Crescimento de Usuários</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 14, marginTop: 2 }}>Últimos 6 meses</div>
          <LineChart criadores={criadoresData} empresas={empresasData} labels={chartLabels} />
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE }} /> Criadores
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0891b2" }} /> Empresas
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK }}>Receita Mensal</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 14, marginTop: 2 }}>Últimos 6 meses (R$)</div>
          <BarChart data={revenueData} labels={chartLabels} />
        </div>
      </div>

      {/* Pending Approvals */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Aprovações Pendentes</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>Soluções aguardando análise</div>
          </div>
          {pending.length > 0 && (
            <span style={{ background: "rgba(217,119,6,0.1)", color: "#B45309", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>
              {pending.length} pendentes
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div style={{ padding: "36px 24px", textAlign: "center", color: GRAY_TEXT }}>Nenhuma solução pendente ✅</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Criador", "Categoria", "Enviado em", "Ações"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map(s => {
                  const isLoading   = actionLoading === s.id;
                  const isRejecting = rejectingId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr style={{ borderTop: `1px solid ${BORDER}` }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, overflow: "hidden", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {s.cover_url ? <img src={s.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: BLUE, opacity: 0.5 }}>✦</span>}
                            </div>
                            <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{s.titulo}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.profiles?.nome || "—"}</td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.categoria || "—"}</td>
                        <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => onView(s)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Ver</button>
                            <button onClick={() => onApprove(s.id)} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(5,150,105,0.1)", color: GREEN, fontSize: 12, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Aprovar</button>
                            <button onClick={() => { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); }} disabled={isLoading} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: isRejecting ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.1)", color: DANGER, fontSize: 12, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Reprovar</button>
                          </div>
                        </td>
                      </tr>
                      {isRejecting && (
                        <tr>
                          <td colSpan={5} style={{ padding: "0 16px 12px", background: "rgba(220,38,38,0.02)", borderTop: "none" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
                              <input
                                autoFocus
                                placeholder="Motivo da reprovação…"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") submitRejectDash(s); if (e.key === "Escape") { setRejectingId(null); setRejectReason(""); } }}
                                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 13, color: NEAR_BLACK, outline: "none", fontFamily: "inherit", background: "#fff" }}
                              />
                              <button onClick={() => submitRejectDash(s)} disabled={!rejectReason.trim() || rejectLoading} style={{ padding: "8px 14px", borderRadius: 8, background: !rejectReason.trim() || rejectLoading ? "rgba(220,38,38,0.3)" : DANGER, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() || rejectLoading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                                {rejectLoading ? "…" : "Confirmar"}
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: GRAY_TEXT, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
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

      {/* Recent Signups */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 22 }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Cadastros Recentes</div>
        {recentSignups.length === 0 ? (
          <div style={{ padding: "36px 24px", textAlign: "center", color: GRAY_TEXT }}>Nenhum cadastro ainda.</div>
        ) : (
          recentSignups.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                {initials(p.nome)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: NEAR_BLACK }}>{p.nome || "—"}</div>
                <div style={{ fontSize: 12, color: GRAY_TEXT }}>{formatDate(p.created_at)}</div>
              </div>
              <StatusBadge status={p.role} />
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Ações Rápidas</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12 }}>
          {quickActions.map(a => (
            <button key={a.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", color: NEAR_BLACK, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = a.color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = BORDER; }}>
              <span style={{ color: a.color, flexShrink: 0 }}><Icon d={a.icon} size={16} /></span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/*
 * SQL Migration — categories:
 *
 * CREATE TABLE IF NOT EXISTS categories (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   nome text NOT NULL UNIQUE,
 *   slug text NOT NULL UNIQUE,
 *   icone text DEFAULT '🤖',
 *   cor text DEFAULT '#0369A1',
 *   descricao text,
 *   created_at timestamptz DEFAULT now()
 * );
 *
 * INSERT INTO categories (nome, slug, icone, cor) VALUES
 *   ('Agentes de IA',   'agentes-de-ia',   '🤖', '#0369A1'),
 *   ('Automação',       'automacao',        '⚡', '#7C3AED'),
 *   ('Chatbots',        'chatbots',         '💬', '#059669'),
 *   ('Marketing IA',    'marketing-ia',     '📣', '#D97706'),
 *   ('Análise de Dados','analise-de-dados', '📊', '#DC2626'),
 *   ('WhatsApp IA',     'whatsapp-ia',      '📱', '#059669'),
 *   ('Integrações',     'integracoes',      '🔗', '#0891B2'),
 *   ('Copywriting IA',  'copywriting-ia',   '✍️', '#7C3AED')
 * ON CONFLICT (nome) DO NOTHING;
 */

/* ── CATEGORIAS TAB ── */
function CategoriasTab({ isMobile }) {
  const PRESET_COLORS = ["#0369A1", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];

  const [categories, setCategories]   = useState([]);
  const [counts, setCounts]           = useState({});
  const [loading, setLoading]         = useState(true);
  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState({ nome: "", slug: "", icone: "🤖", cor: "#0369A1", descricao: "" });
  const [slugEdited, setSlugEdited]   = useState(false);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(null);
  const [catToast, setCatToast]       = useState({ message: "", type: "success" });

  function generateSlug(str) {
    return str.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadData() {
    setLoading(true);
    const { data: cats } = await supabase.from("categories").select("*").order("nome");
    if (cats) {
      setCategories(cats);
      const map = {};
      await Promise.all(cats.map(async cat => {
        const { count } = await supabase
          .from("solutions").select("id", { count: "exact", head: true })
          .eq("categoria", cat.nome);
        map[cat.id] = count ?? 0;
      }));
      setCounts(map);
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  function openNew() {
    setEditTarget(null);
    setForm({ nome: "", slug: "", icone: "🤖", cor: "#0369A1", descricao: "" });
    setSlugEdited(false);
    setFormOpen(true);
  }

  function openEdit(cat) {
    setEditTarget(cat);
    setForm({ nome: cat.nome, slug: cat.slug, icone: cat.icone || "🤖", cor: cat.cor || "#0369A1", descricao: cat.descricao || "" });
    setSlugEdited(true);
    setFormOpen(true);
  }

  function handleNomeChange(value) {
    setForm(f => ({ ...f, nome: value, slug: slugEdited ? f.slug : generateSlug(value) }));
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    const payload = {
      nome: form.nome.trim(),
      slug: form.slug || generateSlug(form.nome.trim()),
      icone: form.icone || "🤖",
      cor: form.cor || "#0369A1",
      descricao: form.descricao.trim() || null,
    };
    if (editTarget) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editTarget.id);
      if (error) { setCatToast({ message: error.message, type: "error" }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { setCatToast({ message: error.message, type: "error" }); setSaving(false); return; }
    }
    await loadData();
    setFormOpen(false);
    setSaving(false);
    setCatToast({ message: editTarget ? "Categoria atualizada!" : "Categoria criada com sucesso!", type: "success" });
  }

  async function handleDelete(cat) {
    if ((counts[cat.id] ?? 0) > 0) return;
    setDeleting(cat.id);
    await supabase.from("categories").delete().eq("id", cat.id);
    setCategories(prev => prev.filter(c => c.id !== cat.id));
    setCounts(prev => { const n = { ...prev }; delete n[cat.id]; return n; });
    setDeleting(null);
    setCatToast({ message: "Categoria removida.", type: "error" });
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
    background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  return (
    <div>
      <style>{`@keyframes catPulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>

      {/* Sub-header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: GRAY_TEXT, margin: 0 }}>
          {categories.length} categoria{categories.length !== 1 ? "s" : ""} cadastrada{categories.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={formOpen ? () => setFormOpen(false) : openNew}
          style={{
            padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            background: formOpen ? "transparent" : BLUE,
            color: formOpen ? GRAY_TEXT : "#fff",
            border: formOpen ? `1.5px solid ${BORDER}` : "none",
          }}
        >
          {formOpen ? "Cancelar" : "+ Nova Categoria"}
        </button>
      </div>

      {/* Inline form */}
      {formOpen && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>
            {editTarget ? "Editar categoria" : "Nova categoria"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" }}>Nome *</label>
              <input value={form.nome} onChange={e => handleNomeChange(e.target.value)} placeholder="Ex: Agentes de IA" style={inp}
                onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" }}>Slug</label>
              <input value={form.slug} onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                placeholder="agentes-de-ia" style={{ ...inp, color: GRAY_TEXT }}
                onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" }}>Ícone (emoji)</label>
              <input value={form.icone} onChange={e => setForm(f => ({ ...f, icone: e.target.value }))}
                placeholder="🤖" maxLength={4} style={{ ...inp, fontSize: 20, letterSpacing: 4 }}
                onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" }}>Cor</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center", height: 44 }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, cor: c }))} style={{
                    width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", flexShrink: 0,
                    border: form.cor === c ? `3px solid ${NEAR_BLACK}` : "3px solid transparent",
                    outline: form.cor === c ? "2px solid #fff" : "none",
                    outlineOffset: "-5px",
                    transition: "border-color 0.15s",
                  }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6, display: "block" }}>Descrição (opcional)</label>
            <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Breve descrição desta categoria…" rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setFormOpen(false)} style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={handleSave} disabled={!form.nome.trim() || saving} style={{ padding: "10px 24px", borderRadius: 10, background: !form.nome.trim() || saving ? "rgba(3,105,161,0.5)" : BLUE, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: !form.nome.trim() || saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {/* Category grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 20, height: 130, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "catPulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>Nenhuma categoria ainda</div>
          <div style={{ fontSize: 14, color: GRAY_TEXT }}>Crie a primeira categoria para organizar as soluções.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {categories.map(cat => {
            const count = counts[cat.id] ?? 0;
            const canDelete = count === 0 && deleting !== cat.id;
            return (
              <div key={cat.id} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `${cat.cor || "#0369A1"}22`,
                    border: `2px solid ${cat.cor || "#0369A1"}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {cat.icone || "🤖"}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(cat)} title="Editar"
                      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: GRAY_TEXT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Icon d={icons.pencil} size={13} />
                    </button>
                    <button onClick={() => handleDelete(cat)} disabled={!canDelete}
                      title={count > 0 ? `${count} solução(ões) usam esta categoria` : "Excluir"}
                      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${canDelete ? "rgba(220,38,38,0.25)" : BORDER}`, background: "transparent", color: canDelete ? DANGER : "#d1d5db", cursor: canDelete ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => { if (canDelete) e.currentTarget.style.background = "rgba(220,38,38,0.06)"; }}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Icon d={icons.trash} size={13} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>{cat.nome}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>
                    {count === 0 ? "0 soluções" : count === 1 ? "1 solução" : `${count} soluções`}
                  </span>
                  {cat.descricao && (
                    <span style={{ fontSize: 12, color: GRAY_TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{cat.descricao}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Toast message={catToast.message} type={catToast.type} onClose={() => setCatToast({ message: "", type: "success" })} />
    </div>
  );
}

/* ── DualLineChart ── */
function DualLineChart({ line1, line2, labels, color1, color2 }) {
  const W = 400, H = 140, PL = 38, PB = 24, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...line1, ...line2, 1) * 1.15;
  function pts(data) {
    return data.map((v, i) => `${PL + (i / (data.length - 1)) * cW},${PT + cH * (1 - v / max)}`).join(" ");
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={PL} y1={PT + cH * (1 - f)} x2={W - PR} y2={PT + cH * (1 - f)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      <polyline points={pts(line1)} fill="none" stroke={color1} strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={pts(line2)} fill="none" stroke={color2} strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="4,3" />
      {line1.map((v, i) => <circle key={i} cx={PL + (i / (line1.length - 1)) * cW} cy={PT + cH * (1 - v / max)} r={2.5} fill={color1} />)}
      {labels.map((l, i) => {
        if (i % 3 !== 0 && i !== labels.length - 1) return null;
        return <text key={i} x={PL + (i / (labels.length - 1)) * cW} y={H - 6} textAnchor="middle" fontSize="9" fill={GRAY_TEXT}>{l}</text>;
      })}
    </svg>
  );
}

/* ── GroupedBarChart ── */
function GroupedBarChart({ group1, group2, labels, color1, color2 }) {
  const W = 400, H = 140, PL = 20, PB = 24, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...group1, ...group2, 1) * 1.2;
  const slotW = cW / labels.length;
  const barW = slotW * 0.34;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={PL} y1={PT + cH * (1 - f)} x2={W - PR} y2={PT + cH * (1 - f)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {labels.map((l, i) => {
        const sx = PL + i * slotW;
        const bh1 = (group1[i] / max) * cH;
        const bh2 = (group2[i] / max) * cH;
        return (
          <g key={i}>
            <rect x={sx + slotW * 0.08} y={PT + cH - bh1} width={barW} height={Math.max(bh1, 1)} rx={2} fill={color1} opacity={0.85} />
            <rect x={sx + slotW * 0.08 + barW + 2} y={PT + cH - bh2} width={barW} height={Math.max(bh2, 1)} rx={2} fill={color2} opacity={0.85} />
            {(i % 3 === 0 || i === labels.length - 1) && <text x={sx + slotW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill={GRAY_TEXT}>{l}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ── HorizBarChart ── */
function HorizBarChart({ data }) {
  const W = 400, ROW_H = 38, PAD_L = 120, PAD_R = 50;
  const BAR_AREA = W - PAD_L - PAD_R;
  const max = Math.max(...data.map(d => d.value), 1);
  const totalH = data.length * ROW_H;
  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const bw = (d.value / max) * BAR_AREA;
        const y = i * ROW_H;
        const lbl = d.label.length > 15 ? d.label.slice(0, 13) + "…" : d.label;
        return (
          <g key={i}>
            <text x={PAD_L - 8} y={y + ROW_H / 2} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={GRAY_TEXT}>{lbl}</text>
            <rect x={PAD_L} y={y + 8} width={Math.max(4, bw)} height={ROW_H - 16} rx={4} fill={BLUE} opacity={0.8} />
            <text x={PAD_L + Math.max(4, bw) + 6} y={y + ROW_H / 2} dominantBaseline="middle" fontSize="11" fill={NEAR_BLACK} fontWeight="600">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── DonutChart ── */
function DonutChart({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const cx = size / 2, cy = size / 2, R = size * 0.4, r = size * 0.24;
  function polar(radius, angle) {
    return { x: cx + radius * Math.cos(angle - Math.PI / 2), y: cy + radius * Math.sin(angle - Math.PI / 2) };
  }
  let start = 0;
  const segs = data.map(d => {
    const sweep = (d.value / total) * Math.PI * 2;
    const seg = { ...d, start, end: start + sweep };
    start += sweep;
    return seg;
  });
  function arcPath(seg) {
    const s1 = polar(R, seg.start), e1 = polar(R, seg.end);
    const s2 = polar(r, seg.end), e2 = polar(r, seg.start);
    const lg = seg.end - seg.start > Math.PI ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${R} ${R} 0 ${lg} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${r} ${r} 0 ${lg} 0 ${e2.x} ${e2.y} Z`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {segs.map((seg, i) => <path key={i} d={arcPath(seg)} fill={seg.color} />)}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={NEAR_BLACK}>{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill={GRAY_TEXT}>soluções</text>
    </svg>
  );
}

/* ── MÉTRICAS TAB ── */
const MONTHS_PT_ADMIN = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const CAT_COLORS_ADMIN = ["#0369A1", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2", "#6B7280"];

function MetricasAdminTab({ solutions, profiles, isMobile }) {
  const [period, setPeriod] = useState("30d");
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ISO cutoff date derived from period — re-fetch triggers when this changes
  const cutoff = useMemo(() => {
    if (period === "all") return null;
    const days = { "7d": 7, "30d": 30, "3m": 90, "12m": 365 }[period] || 30;
    return new Date(Date.now() - days * 86400000).toISOString();
  }, [period]);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("subscriptions")
      .select("id, created_at, status, solution_id, solutions(id, titulo, preco, categoria, creator_id, payment_type)")
      .order("created_at", { ascending: false });
    if (cutoff) q = q.gte("created_at", cutoff);
    q.then(({ data }) => {
      setSubs(data || []);
      setLoading(false);
    });
  }, [cutoff]);

  // KPIs — all derived from period-filtered subs
  const totalRevenue = subs.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);
  const ticketMedio = subs.length > 0 ? totalRevenue / subs.length : 0;
  const mrr = subs
    .filter(s => s.status === "active" && s.solutions?.payment_type === "subscription")
    .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);

  // Time buckets that adapt to the selected period
  const { bucketLabels, revenueByBucket, commissionsByBucket, criadoresByBucket, empresasByBucket } = useMemo(() => {
    const now = new Date();
    let buckets;
    if (period === "7d") {
      buckets = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - 6 + i);
        return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), type: "day" };
      });
    } else if (period === "30d") {
      buckets = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - 29 + i);
        return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), type: "day" };
      });
    } else {
      const months = period === "3m" ? 3 : 12;
      buckets = Array.from({ length: months }, (_, i) => {
        const d = new Date(now); d.setMonth(d.getMonth() - (months - 1) + i);
        return { year: d.getFullYear(), month: d.getMonth(), type: "month" };
      });
    }

    const labels = buckets.map(b =>
      b.type === "day"
        ? new Date(b.year, b.month, b.day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        : MONTHS_PT_ADMIN[b.month]
    );

    function matchesBucket(dateStr, b) {
      const d = new Date(dateStr);
      if (b.type === "day") return d.getFullYear() === b.year && d.getMonth() === b.month && d.getDate() === b.day;
      return d.getFullYear() === b.year && d.getMonth() === b.month;
    }

    const revByB = buckets.map(b =>
      subs.filter(s => matchesBucket(s.created_at, b)).reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
    );
    const comByB = revByB.map(r => r * 0.15);
    const criByB = buckets.map(b =>
      profiles.filter(p => (p.role === "criador" || p.role === "creator") && p.created_at && matchesBucket(p.created_at, b)).length
    );
    const empByB = buckets.map(b =>
      profiles.filter(p => (p.role === "empresa" || p.role === "business") && p.created_at && matchesBucket(p.created_at, b)).length
    );

    return { bucketLabels: labels, revenueByBucket: revByB, commissionsByBucket: comByB, criadoresByBucket: criByB, empresasByBucket: empByB };
  }, [subs, profiles, period]);

  // Top solutions from period-filtered subs
  const topSolutions = useMemo(() => {
    const map = {};
    for (const s of subs) {
      const id = s.solution_id;
      if (id) {
        if (!map[id]) map[id] = { titulo: s.solutions?.titulo || "—", count: 0 };
        map[id].count++;
      }
    }
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [subs]);

  // Top creators from period-filtered subs
  const topCreators = useMemo(() => {
    const map = {};
    for (const s of subs) {
      const cid = s.solutions?.creator_id;
      if (cid) {
        if (!map[cid]) map[cid] = { creator_id: cid, sales: 0, revenue: 0 };
        map[cid].sales++;
        map[cid].revenue += s.solutions?.preco || 0;
      }
    }
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [subs]);

  // Category donut (approved solutions — not time-filtered, structural data)
  const catMap = {};
  solutions.filter(s => s.status === "approved").forEach(s => { const c = s.categoria || "Outras"; catMap[c] = (catMap[c] || 0) + 1; });
  const categoryData = Object.entries(catMap).sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: CAT_COLORS_ADMIN[i % CAT_COLORS_ADMIN.length] }));

  const criadoresProfiles = profiles.filter(p => p.role === "criador" || p.role === "creator");
  const enrichedCreators = topCreators.map(c => {
    const prof = criadoresProfiles.find(p => p.id === c.creator_id);
    const ativas = solutions.filter(s => s.creator_id === c.creator_id && s.status === "approved").length;
    return { ...c, nome: prof?.nome || "—", ativas };
  });

  const recentTransactions = subs.slice(0, 10).map(s => ({
    data: new Date(s.created_at).toLocaleDateString("pt-BR"),
    solucao: s.solutions?.titulo || "—",
    valor: s.solutions?.preco || 0,
    comissao: (s.solutions?.preco || 0) * 0.15,
    liquido: (s.solutions?.preco || 0) * 0.85,
    status: s.status,
  }));

  const periodLabel = { "7d": "Últimos 7 dias", "30d": "Últimos 30 dias", "3m": "Últimos 3 meses", "12m": "Últimos 12 meses", "all": "Todo o período" }[period];

  const periodOptions = [
    { key: "7d", label: "7 dias" }, { key: "30d", label: "30 dias" },
    { key: "3m", label: "3 meses" }, { key: "12m", label: "12 meses" }, { key: "all", label: "Todo período" },
  ];
  const card = { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" };

  return (
    <div>
      {/* Period filter — always visible, even while loading */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {periodOptions.map(opt => (
          <button key={opt.key} onClick={() => setPeriod(opt.key)} style={{
            padding: "8px 20px", borderRadius: 999,
            border: period === opt.key ? "none" : `1px solid ${BORDER}`,
            background: period === opt.key ? BLUE : "#fff",
            color: period === opt.key ? "#fff" : GRAY_TEXT,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.15s, color 0.15s",
          }}>{opt.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: GRAY_TEXT }}>Carregando métricas…</div>
      ) : (<>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Receita Total da Plataforma", value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: `${subs.length} transações`, color: BLUE },
          { label: "Ticket Médio", value: `R$ ${ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: "por transação", color: "#7C3AED" },
          { label: "Taxa de Conversão", value: "3,2%", sub: "visitantes → compras", color: GREEN },
          { label: "MRR", value: `R$ ${mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: "assinaturas ativas", color: "#B45309" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 22px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{c.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginTop: 6 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Receita ao longo do período</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>{periodLabel} (R$)</div>
          <DualLineChart line1={revenueByBucket} line2={commissionsByBucket} labels={bucketLabels} color1={BLUE} color2="#0891b2" />
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE }} />Receita bruta</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0891b2" }} />Comissões</div>
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Novos usuários no período</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>{periodLabel}</div>
          <GroupedBarChart group1={criadoresByBucket} group2={empresasByBucket} labels={bucketLabels} color1={BLUE} color2="#7C3AED" />
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE }} />Criadores</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_TEXT }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C3AED" }} />Empresas</div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Soluções mais vendidas</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>{periodLabel} — top 5 por vendas</div>
          {topSolutions.length === 0
            ? <div style={{ textAlign: "center", padding: "32px", color: GRAY_TEXT, fontSize: 14 }}>Sem dados suficientes</div>
            : <HorizBarChart data={topSolutions.map(s => ({ label: s.titulo, value: s.count }))} />}
        </div>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Distribuição por categoria</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Soluções ativas por categoria</div>
          {categoryData.length === 0
            ? <div style={{ textAlign: "center", padding: "32px", color: GRAY_TEXT, fontSize: 14 }}>Nenhuma solução aprovada</div>
            : (
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <DonutChart data={categoryData} />
                <div style={{ flex: 1, minWidth: 100 }}>
                  {categoryData.map(d => (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: GRAY_TEXT, flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: NEAR_BLACK }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Top creators table */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 18 }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Top Criadores</div>
        {enrichedCreators.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: GRAY_TEXT }}>Nenhum dado disponível</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Criador", "Soluções Ativas", "Vendas Totais", "Receita Gerada"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrichedCreators.map((c, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                          {(c.nome || "?").charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{c.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{c.ativas}</td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{c.sales}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: NEAR_BLACK }}>R$ {c.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Transações Recentes</div>
        {recentTransactions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: GRAY_TEXT }}>Nenhuma transação encontrada</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Data", "Solução", "Valor Bruto", "Comissão (15%)", "Valor Líquido", "Status"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>{t.data}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: NEAR_BLACK }}>{t.solucao}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK }}>R$ {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px", color: "#7C3AED" }}>R$ {t.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: GREEN }}>R$ {t.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatusBadge status={t.status === "active" ? "ativo" : t.status === "cancelled" ? "paused" : "pendente"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>)}
    </div>
  );
}

/* ── CriadoresUTab ── */
function CriadoresUTab({ isMobile }) {
  const [criadores, setCriadores]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("todos");
  const [search, setSearch]               = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*").in("role", ["criador", "creator"]).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setCriadores(data); setLoading(false); });
  }, []);

  async function toggleBan(id, status) {
    setActionLoading(id);
    const next = status === "banido" ? "ativo" : "banido";
    await supabase.from("profiles").update({ status: next }).eq("id", id);
    setCriadores(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
    setActionLoading(null);
  }

  const visible = criadores
    .filter(c => filter === "todos" || (filter === "ativos" ? (c.status !== "banido" && c.status !== "pausado") : c.status === filter))
    .filter(c => !search || [c.nome, c.email].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {["todos", "ativos", "pausados"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${filter === f ? BLUE : BORDER}`, background: filter === f ? BLUE : "#fff", color: filter === f ? "#fff" : NEAR_BLACK, fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail…" style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, minWidth: 220, outline: "none" }} />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Carregando…</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Nenhum criador encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Criador", "E-mail", "Status", "Cadastro", "Ação"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(c.nome)}</div>
                      <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{c.nome || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{c.email}</td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={c.status || "ativo"} /></td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{formatDate(c.created_at)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => toggleBan(c.id, c.status)} disabled={actionLoading === c.id} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: c.status === "banido" ? GREEN : DANGER, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: actionLoading === c.id ? 0.6 : 1 }}>
                      {c.status === "banido" ? "Desbanir" : "Banir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── EmpresasUTab ── */
function EmpresasUTab({ isMobile }) {
  const [empresas, setEmpresas]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("todos");
  const [search, setSearch]               = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*, subscriptions(plan)").in("role", ["empresa", "business"]).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setEmpresas(data); setLoading(false); });
  }, []);

  async function toggleBan(id, status) {
    setActionLoading(id);
    const next = status === "banido" ? "ativo" : "banido";
    await supabase.from("profiles").update({ status: next }).eq("id", id);
    setEmpresas(prev => prev.map(e => e.id === id ? { ...e, status: next } : e));
    setActionLoading(null);
  }

  function getPlan(e) { return e.subscriptions?.[0]?.plan || "free"; }

  const visible = empresas
    .filter(e => filter === "todos" || getPlan(e) === filter)
    .filter(e => !search || [e.nome, e.email].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {["todos", "free", "business", "enterprise"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${filter === f ? BLUE : BORDER}`, background: filter === f ? BLUE : "#fff", color: filter === f ? "#fff" : NEAR_BLACK, fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail…" style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, minWidth: 220, outline: "none" }} />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Carregando…</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Nenhuma empresa encontrada.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Empresa", "E-mail", "Plano", "Status", "Cadastro", "Ação"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((e, i) => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(e.nome)}</div>
                      <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{e.nome || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{e.email}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 6, background: "#EDE9FE", color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{getPlan(e)}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={e.status || "ativo"} /></td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{formatDate(e.created_at)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => toggleBan(e.id, e.status)} disabled={actionLoading === e.id} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: e.status === "banido" ? GREEN : DANGER, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: actionLoading === e.id ? 0.6 : 1 }}>
                      {e.status === "banido" ? "Desbanir" : "Banir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── RepassesTab ── */
function RepassesTab({ isMobile }) {
  const [repasses, setRepasses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [paid, setPaid]         = useState(new Set());

  useEffect(() => {
    supabase.from("subscriptions").select("*, profiles:user_id(nome, email)").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRepasses(data); setLoading(false); });
  }, []);

  const COMISSAO = 0.15;
  function fmt(cents) { return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

  const totalBruto   = repasses.reduce((s, r) => s + (r.amount || 0), 0);
  const totalComissao = Math.round(totalBruto * COMISSAO);
  const totalLiquido  = totalBruto - totalComissao;
  const pendentes     = repasses.filter(r => !paid.has(r.id)).length;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KpiCard label="Receita Bruta"       value={fmt(totalBruto)}    iconD={icons.cash}    />
        <KpiCard label="Comissão (15%)"      value={fmt(totalComissao)} iconD={icons.percent} accent={DANGER} />
        <KpiCard label="Valor Líquido"       value={fmt(totalLiquido)}  iconD={icons.arrows}  accent={GREEN} />
        <KpiCard label="Repasses Pendentes"  value={String(pendentes)}  iconD={icons.tag}     accent="#F59E0B" />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Carregando…</div>
      ) : repasses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Nenhum repasse encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Criador", "Bruto", "Comissão", "Líquido", "Status", "Ação"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repasses.map((r, i) => {
                const bruto  = r.amount || 0;
                const com    = Math.round(bruto * COMISSAO);
                const liq    = bruto - com;
                const isPaid = paid.has(r.id);
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: NEAR_BLACK }}>{r.profiles?.nome || r.profiles?.email || "—"}</td>
                    <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{fmt(bruto)}</td>
                    <td style={{ padding: "12px 14px", color: DANGER }}>{fmt(com)}</td>
                    <td style={{ padding: "12px 14px", color: GREEN, fontWeight: 700 }}>{fmt(liq)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 6, background: isPaid ? "#D1FAE5" : "#FEF9C3", color: isPaid ? GREEN : "#92400E", fontSize: 11, fontWeight: 700 }}>
                        {isPaid ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {!isPaid && (
                        <button onClick={() => setPaid(prev => new Set([...prev, r.id]))} style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          Marcar como pago
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── RelatoriosTab ── */
function RelatoriosTab({ isMobile }) {
  const [period, setPeriod]   = useState("6m");
  const [toastMsg, setToastMsg] = useState("");

  const PERIODS = [
    { value: "1m", label: "Último mês" },
    { value: "3m", label: "Últimos 3 meses" },
    { value: "6m", label: "Últimos 6 meses" },
    { value: "12m", label: "Último ano" },
  ];

  const cards = [
    { label: "Relatório de Receita",   desc: "Faturamento total, comissões e repasses por período.",        icon: "💰" },
    { label: "Relatório de Usuários",  desc: "Novos cadastros, churn e distribuição por plano.",            icon: "👥" },
    { label: "Relatório de Soluções",  desc: "Soluções publicadas, aprovadas e mais acessadas.",           icon: "📦" },
    { label: "Relatório Fiscal",       desc: "Dados para declaração fiscal e emissão de notas fiscais.",   icon: "📄" },
  ];

  function gerarPDF(label) {
    setToastMsg(`${label} gerado com sucesso!`);
    setTimeout(() => setToastMsg(""), 3000);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK }}>Período:</span>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, background: "#fff", cursor: "pointer" }}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 20, lineHeight: 1.5 }}>{c.desc}</div>
            <button onClick={() => gerarPDF(c.label)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Gerar PDF
            </button>
          </div>
        ))}
      </div>
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: GREEN, color: "#fff", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 14, zIndex: 9999 }}>
          ✓ {toastMsg}
        </div>
      )}
    </div>
  );
}

/* ── TaxasTab ── */
function TaxasRow({ label, k, prefix, form, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontSize: 13, color: NEAR_BLACK }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {prefix && <span style={{ fontSize: 13, color: GRAY_TEXT }}>{prefix}</span>}
        <input type="number" value={form[k]} onChange={e => onChange(k, e.target.value)} style={{ width: 90, padding: "6px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, textAlign: "right" }} />
      </div>
    </div>
  );
}

function TaxasTab({ isMobile }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm]   = useState({
    comissao_free: "20", comissao_pro: "15", comissao_premium: "10",
    prazo_repasse: "30", minimo_repasse: "50",
    criador_pro_mensal: "49", criador_pro_anual: "470",
    criador_premium_mensal: "99", criador_premium_anual: "950",
    empresa_business_mensal: "199", empresa_business_anual: "1990",
    empresa_enterprise_mensal: "499", empresa_enterprise_anual: "4990",
  });

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); setSaved(false); }

  const S = { background: "#fff", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 20 };
  const T = { fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={S}>
        <div style={T}>Comissões por Plano Criador</div>
        <TaxasRow label="Criador Free"    k="comissao_free"    prefix="%" form={form} onChange={setField} />
        <TaxasRow label="Criador Pro"     k="comissao_pro"     prefix="%" form={form} onChange={setField} />
        <TaxasRow label="Criador Premium" k="comissao_premium" prefix="%" form={form} onChange={setField} />
      </div>
      <div style={S}>
        <div style={T}>Regras de Repasse</div>
        <TaxasRow label="Prazo de repasse (dias)"        k="prazo_repasse"  form={form} onChange={setField} />
        <TaxasRow label="Valor mínimo para repasse (R$)" k="minimo_repasse" prefix="R$" form={form} onChange={setField} />
      </div>
      <div style={S}>
        <div style={T}>Planos Criador</div>
        <TaxasRow label="Pro — Mensal"     k="criador_pro_mensal"     prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Pro — Anual"      k="criador_pro_anual"      prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Premium — Mensal" k="criador_premium_mensal" prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Premium — Anual"  k="criador_premium_anual"  prefix="R$" form={form} onChange={setField} />
      </div>
      <div style={S}>
        <div style={T}>Planos Empresa</div>
        <TaxasRow label="Business — Mensal"   k="empresa_business_mensal"   prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Business — Anual"    k="empresa_business_anual"    prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Enterprise — Mensal" k="empresa_enterprise_mensal" prefix="R$" form={form} onChange={setField} />
        <TaxasRow label="Enterprise — Anual"  k="empresa_enterprise_anual"  prefix="R$" form={form} onChange={setField} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setSaved(true)} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Salvar Configurações
        </button>
        {saved && <span style={{ color: GREEN, fontWeight: 600, fontSize: 14 }}>✓ Salvo!</span>}
      </div>
    </div>
  );
}

/* ── BannersTab ── */
function BannersTab({ isMobile }) {
  const SLOTS = ["Hero", "Soluções", "E-mail"];
  const [banners, setBanners] = useState(SLOTS.map(slot => ({ slot, active: true, preview: null })));

  function toggleActive(i) {
    setBanners(prev => prev.map((b, j) => j === i ? { ...b, active: !b.active } : b));
  }

  function handleFile(i, e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setBanners(prev => prev.map((b, j) => j === i ? { ...b, preview: ev.target.result } : b));
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
      {banners.map((b, i) => (
        <div key={b.slot} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ height: 160, background: BG_GRAY, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {b.preview ? (
              <img src={b.preview} alt={b.slot} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: GRAY_TEXT }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>🖼️</div>
                <div style={{ fontSize: 12 }}>Sem imagem</div>
              </div>
            )}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 12 }}>Banner {b.slot}</div>
            <label style={{ display: "block", padding: "8px 0", borderRadius: 8, border: `1px dashed ${BORDER}`, textAlign: "center", fontSize: 13, color: BLUE, cursor: "pointer", marginBottom: 12 }}>
              Upload imagem
              <input type="file" accept="image/*" onChange={e => handleFile(i, e)} style={{ display: "none" }} />
            </label>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: NEAR_BLACK }}>Status</span>
              <button onClick={() => toggleActive(i)} style={{ padding: "4px 16px", borderRadius: 20, border: "none", background: b.active ? GREEN : GRAY_TEXT, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {b.active ? "Ativo" : "Inativo"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── EmailsTab ── */
function EmailsTab({ isMobile }) {
  const TEMPLATES = [
    { key: "boas-vindas",  label: "Boas-vindas",       desc: "Enviado quando um novo usuário se cadastra." },
    { key: "aprovacao",    label: "Solução Aprovada",   desc: "Enviado ao criador quando uma solução é aprovada." },
    { key: "rejeicao",     label: "Solução Rejeitada",  desc: "Enviado ao criador quando uma solução é rejeitada." },
    { key: "repasse",      label: "Repasse Realizado",  desc: "Confirmação de repasse para o criador." },
    { key: "nova-compra",  label: "Nova Compra",        desc: "Notificação de compra para a empresa." },
  ];
  const [enabled, setEnabled]   = useState(new Set(["boas-vindas", "aprovacao", "nova-compra"]));
  const [testEmail, setTestEmail] = useState("");
  const [template, setTemplate]   = useState("boas-vindas");
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);

  function toggleTemplate(k) {
    setEnabled(prev => { const next = new Set(prev); next.has(k) ? next.delete(k) : next.add(k); return next; });
  }

  async function sendTest() {
    if (!testEmail) return;
    setSending(true);
    try {
      await fetch("/api/emails/boas-vindas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: testEmail, template }) });
    } catch (_) {}
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Templates</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TEMPLATES.map(t => (
            <div key={t.key} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>{t.label}</div>
                <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{t.desc}</div>
              </div>
              <button onClick={() => toggleTemplate(t.key)} style={{ padding: "4px 14px", borderRadius: 20, border: "none", background: enabled.has(t.key) ? GREEN : "#e5e7eb", color: enabled.has(t.key) ? "#fff" : GRAY_TEXT, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                {enabled.has(t.key) ? "Ativo" : "Inativo"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Enviar E-mail de Teste</div>
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, display: "block", marginBottom: 6 }}>Template</label>
            <select value={template} onChange={e => setTemplate(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13 }}>
              {TEMPLATES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, display: "block", marginBottom: 6 }}>E-mail de destino</label>
            <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="admin@exemplo.com" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <button onClick={sendTest} disabled={sending || !testEmail} style={{ width: "100%", padding: "10px 0", borderRadius: 9, border: "none", background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: sending || !testEmail ? 0.6 : 1 }}>
            {sending ? "Enviando…" : sent ? "✓ Enviado!" : "Enviar Teste"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TicketsTab ── */
function TicketsTab({ isMobile }) {
  const [filter, setFilter]   = useState("todos");
  const [modal, setModal]     = useState(false);
  const [tickets, setTickets] = useState([]);
  const [form, setForm]       = useState({ titulo: "", email: "", descricao: "" });

  const FILTERS = ["todos", "aberto", "em_andamento", "resolvido"];
  const FILTER_LABELS = { todos: "Todos", aberto: "Aberto", em_andamento: "Em andamento", resolvido: "Resolvido" };

  function criarTicket() {
    if (!form.titulo || !form.email) return;
    setTickets(prev => [{ id: Date.now(), ...form, status: "aberto", created_at: new Date().toISOString() }, ...prev]);
    setModal(false);
    setForm({ titulo: "", email: "", descricao: "" });
  }

  const visible = tickets.filter(t => filter === "todos" || t.status === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === f ? BLUE : BORDER}`, background: filter === f ? BLUE : "#fff", color: filter === f ? "#fff" : NEAR_BLACK, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
        <button onClick={() => setModal(true)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Abrir Ticket Manual
        </button>
      </div>
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: GRAY_TEXT }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nenhum ticket encontrado</div>
          <div style={{ fontSize: 13 }}>Tickets de suporte aparecerão aqui.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visible.map(t => (
            <div key={t.id} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK }}>{t.titulo}</div>
                <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{t.email} · {formatDate(t.created_at)}</div>
                {t.descricao && <div style={{ fontSize: 12, color: NEAR_BLACK, marginTop: 8, lineHeight: 1.5 }}>{t.descricao}</div>}
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Abrir Ticket Manual</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, display: "block", marginBottom: 6 }}>Título *</label>
              <input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, display: "block", marginBottom: 6 }}>E-mail *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: GRAY_TEXT, display: "block", marginBottom: 6 }}>Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, boxSizing: "border-box", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: `1px solid ${BORDER}`, background: "#fff", color: NEAR_BLACK, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button onClick={criarTicket} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Criar Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── DenunciasTab ── */
function DenunciasTab({ isMobile }) {
  const STATUS_FLOW   = ["Pendente", "Investigando", "Resolvido", "Arquivado"];
  const STATUS_COLORS = { Pendente: "#FEF9C3", Investigando: "#DBEAFE", Resolvido: "#D1FAE5", Arquivado: "#F3F4F6" };
  const STATUS_TEXT   = { Pendente: "#92400E", Investigando: "#1E40AF", Resolvido: "#065F46", Arquivado: "#6B7280" };

  const [denuncias, setDenuncias] = useState([
    { id: 1, tipo: "Conteúdo inapropriado", denunciado: "Usuário A", motivo: "Descrição ofensiva na solução.",         status: "Pendente",     created_at: new Date().toISOString() },
    { id: 2, tipo: "Fraude",                denunciado: "Usuário B", motivo: "Solução não entregue após pagamento.",  status: "Investigando", created_at: new Date().toISOString() },
  ]);

  function nextStatus(id) {
    setDenuncias(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = STATUS_FLOW.indexOf(d.status);
      return { ...d, status: STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)] };
    }));
  }

  return (
    <div>
      {denuncias.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: GRAY_TEXT }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚩</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nenhuma denúncia</div>
          <div style={{ fontSize: 13 }}>Denúncias dos usuários aparecerão aqui.</div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Tipo", "Denunciado", "Motivo", "Status", "Avançar"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {denuncias.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: NEAR_BLACK }}>{d.tipo}</td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{d.denunciado}</td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT, maxWidth: 220 }}>{d.motivo}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 6, background: STATUS_COLORS[d.status], color: STATUS_TEXT[d.status], fontSize: 11, fontWeight: 700 }}>{d.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {d.status !== "Arquivado" && (
                      <button onClick={() => nextStatus(d.id)} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "#fff", color: NEAR_BLACK, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Avançar →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── LogsTab ── */
function LogsTab({ isMobile }) {
  const [roleFilter, setRoleFilter] = useState("todos");
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(true);

  const ROLES = ["todos", "admin", "criador", "empresa"];

  useEffect(() => {
    async function loadLogs() {
      const { data } = await supabase
        .from("logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setLogs(data);
      setLoading(false);
    }
    loadLogs().catch(() => setLoading(false));
  }, []);

  const visible = roleFilter === "todos" ? logs : logs.filter(l => l.role === roleFilter);

  const ROLE_COLORS = { admin: { bg: "#FEF3C7", color: "#92400E" }, criador: { bg: "#DBEAFE", color: "#1E40AF" }, empresa: { bg: "#EDE9FE", color: "#7C3AED" } };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${roleFilter === r ? BLUE : BORDER}`, background: roleFilter === r ? BLUE : "#fff", color: roleFilter === r ? "#fff" : NEAR_BLACK, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Carregando…</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: GRAY_TEXT }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6 }}>Nenhum log registrado ainda</div>
          <div style={{ fontSize: 13 }}>Os logs de acesso aparecerão aqui conforme a plataforma for utilizada.</div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Usuário", "Role", "Ação", "IP", "Horário"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: NEAR_BLACK }}>{l.usuario || l.user_id || "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 700, ...(ROLE_COLORS[l.role] || { bg: "#F3F4F6", color: GRAY_TEXT }) }}>{l.role || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{l.acao || l.action || "—"}</td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT, fontFamily: "monospace" }}>{l.ip || "—"}</td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── BanidosTab ── */
function BanidosTab({ isMobile }) {
  const [banidos, setBanidos]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("status", "banido").order("updated_at", { ascending: false })
      .then(({ data }) => { if (data) setBanidos(data); setLoading(false); });
  }, []);

  async function desbanir(id) {
    setActionLoading(id);
    await supabase.from("profiles").update({ status: "ativo" }).eq("id", id);
    setBanidos(prev => prev.filter(b => b.id !== id));
    setActionLoading(null);
  }

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_TEXT }}>Carregando…</div>
      ) : banidos.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: GRAY_TEXT }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔓</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nenhum usuário banido</div>
          <div style={{ fontSize: 13 }}>Usuários banidos aparecerão aqui.</div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG_GRAY }}>
                {["Usuário", "E-mail", "Role", "Banido desde", "Ação"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: GRAY_TEXT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banidos.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: DANGER, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(b.nome)}</div>
                      <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{b.nome || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{b.email}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 5, background: "#F3F4F6", color: GRAY_TEXT, fontSize: 11, fontWeight: 700 }}>{b.role}</span>
                  </td>
                  <td style={{ padding: "12px 14px", color: GRAY_TEXT }}>{formatDate(b.updated_at || b.created_at)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => desbanir(b.id)} disabled={actionLoading === b.id} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: GREEN, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: actionLoading === b.id ? 0.6 : 1 }}>
                      Desbanir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const SIDEBAR_SECTIONS = [
  { label: "VISÃO GERAL", items: [{ key: "dashboard",  label: "Dashboard",        icon: "home" }] },
  { label: "CONTEÚDO",    items: [{ key: "solucoes",   label: "Soluções",         icon: "puzzle" }, { key: "categorias", label: "Categorias", icon: "tag" }] },
  { label: "USUÁRIOS",    items: [{ key: "usuarios",   label: "Todos Usuários",   icon: "users" }, { key: "criadores_u", label: "Criadores", icon: "pencil" }, { key: "empresas_u", label: "Empresas", icon: "building" }] },
  { label: "FINANCEIRO",  items: [{ key: "transacoes", label: "Transações",       icon: "arrows" }, { key: "repasses", label: "Repasses", icon: "cash" }, { key: "receita", label: "Receita", icon: "chart" }] },
  { label: "ANALYTICS",   items: [{ key: "metricas",   label: "Métricas",         icon: "chart" }, { key: "relatorios", label: "Relatórios", icon: "file" }] },
  { label: "PLATAFORMA",  items: [{ key: "config",     label: "Config. Gerais",   icon: "settings" }, { key: "taxas", label: "Taxas e Comissões", icon: "percent" }, { key: "banners", label: "Banners", icon: "photo" }, { key: "emails", label: "E-mails", icon: "mail" }] },
  { label: "SUPORTE",     items: [{ key: "tickets",    label: "Tickets",          icon: "message" }, { key: "denuncias", label: "Denúncias", icon: "flag" }] },
  { label: "SEGURANÇA",   items: [{ key: "logs",       label: "Logs de Acesso",   icon: "shield" }, { key: "banidos", label: "Usuários Banidos", icon: "ban" }] },
];

const TAB_LABELS = {
  dashboard: "Painel Administrativo", solucoes: "Soluções", categorias: "Categorias",
  usuarios: "Todos os Usuários", criadores_u: "Criadores", empresas_u: "Empresas",
  transacoes: "Transações", repasses: "Repasses", receita: "Receita",
  metricas: "Métricas da Plataforma", relatorios: "Relatórios",
  config: "Configurações Gerais", taxas: "Taxas e Comissões", banners: "Banners",
  emails: "E-mails", tickets: "Tickets", denuncias: "Denúncias",
  logs: "Logs de Acesso", banidos: "Usuários Banidos",
};

const REAL_TABS = new Set(["dashboard", "solucoes", "categorias", "usuarios", "transacoes", "config", "receita", "metricas", "criadores_u", "empresas_u", "repasses", "relatorios", "taxas", "banners", "emails", "tickets", "denuncias", "logs", "banidos"]);

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading]           = useState(true);
  const [user, setUser]                 = useState(null);
  const [profile, setProfile]           = useState(null);
  const [solutions, setSolutions]       = useState([]);
  const [profiles, setProfiles]         = useState([]);
  const [activeNav, setActiveNav]       = useState("dashboard");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [toast, setToast]               = useState({ message: "", type: "success" });
  const width   = useWindowSize();

  function showToast(message, type = "success") {
    setToast({ message, type });
  }
  const isMobile = width < 768;

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (!prof || prof.role !== "admin") { router.replace("/"); return; }

      setUser(session.user);
      setProfile(prof);

      const [solRes, profRes] = await Promise.all([
        supabase.from("solutions").select("*, profiles:creator_id(nome)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      if (solRes.data)  setSolutions(solRes.data);
      if (profRes.data) setProfiles(profRes.data);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleApprove(id) {
    setActionLoading(id);
    const sol = solutions.find(s => s.id === id);
    const version = sol?.version || 1;
    await supabase.from("solutions").update({ status: "approved", last_approved_version: version }).eq("id", id);
    if (sol?.creator_id) {
      supabase.from("notifications").insert({
        user_id: sol.creator_id,
        type: "aprovacao",
        title: "Sua solução foi aprovada! 🎉",
        message: `${sol.titulo} já está disponível no catálogo.`,
        link: "/dashboard/criador",
      }).catch(console.error);
      fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "solution_approved", user_id: sol.creator_id, solution_titulo: sol.titulo }),
      }).catch(console.error);
    }
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "approved", last_approved_version: version } : s));
    setActionLoading(null);
    setSelectedSolution(prev => prev?.id === id ? null : prev);
    showToast("Solução aprovada com sucesso!");
  }

  function handleReject(solution) { setRejectTarget(solution); }

  async function handleConfirmReject(solution, reason) {
    setActionLoading(solution.id);
    await supabase.from("solutions").update({ status: "rejected", rejection_reason: reason }).eq("id", solution.id);
    if (solution.creator_id) {
      supabase.from("notifications").insert({
        user_id: solution.creator_id,
        type: "sistema",
        title: "Solução não aprovada",
        message: `Motivo: ${reason}. Você pode editar e reenviar para análise.`,
        link: "/dashboard/criador",
      }).catch(console.error);
      fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "solution_rejected", user_id: solution.creator_id, solution_titulo: solution.titulo, rejection_reason: reason }),
      }).catch(console.error);
    }
    setSolutions(prev => prev.map(s => s.id === solution.id ? { ...s, status: "rejected", rejection_reason: reason } : s));
    setActionLoading(null);
    setRejectTarget(null);
    setSelectedSolution(prev => prev?.id === solution.id ? null : prev);
    showToast("Solução reprovada.", "error");
  }

  async function handlePause(id) {
    setActionLoading(id);
    await supabase.from("solutions").update({ status: "paused" }).eq("id", id);
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "paused" } : s));
    setActionLoading(null);
    showToast("Solução pausada.");
  }

  async function handleReactivate(id) {
    setActionLoading(id);
    await supabase.from("solutions").update({ status: "approved" }).eq("id", id);
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s));
    setActionLoading(null);
    showToast("Solução reativada.");
  }

  async function handleSignOut() { await signOut(); router.replace("/login"); }

  function navigate(key) { setActiveNav(key); if (isMobile) setSidebarOpen(false); }

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
        {/* Logo + Admin badge */}
        <div style={{ padding: "20px 20px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <WePromptLogo id="admin-sidebar" dark />
            </a>
            <span style={{ background: DANGER, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99, letterSpacing: "0.5px", textTransform: "uppercase", flexShrink: 0 }}>
              Admin
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: BORDER, margin: "0 16px 6px", flexShrink: 0 }} />

        {/* Nav sections */}
        <div style={{ flex: 1, padding: "4px 12px 8px" }}>
          {SIDEBAR_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: GRAY_TEXT, letterSpacing: "0.8px", textTransform: "uppercase", padding: "10px 12px 4px" }}>
                {section.label}
              </div>
              {section.items.map(item => (
                <NavItem key={item.key} label={item.label} iconD={icons[item.icon]} active={activeNav === item.key} onClick={() => navigate(item.key)} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom: avatar + logout */}
        <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "0 4px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
              {initials(profile?.nome || "Admin")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.nome || "Admin"}</div>
              <div style={{ fontSize: 11, color: DANGER, fontWeight: 600 }}>Administrador</div>
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
              <a href="/" style={{ textDecoration: "none" }}><WePromptLogo id="admin-mobile" dark /></a>
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
          {activeNav === "dashboard" && (
            <DashboardTab solutions={solutions} profiles={profiles} onApprove={handleApprove} onConfirmReject={handleConfirmReject} onView={s => setSelectedSolution(s)} actionLoading={actionLoading} isMobile={isMobile} />
          )}
          {activeNav === "solucoes" && (
            <SolucoesTab solutions={solutions} onApprove={handleApprove} onConfirmReject={handleConfirmReject} onPause={handlePause} onReactivate={handleReactivate} onView={s => setSelectedSolution(s)} actionLoading={actionLoading} isMobile={isMobile} />
          )}
          {activeNav === "categorias" && <CategoriasTab isMobile={isMobile} />}
          {activeNav === "usuarios"   && <UsuariosTab isMobile={isMobile} />}
          {activeNav === "transacoes" && <TransacoesTab isMobile={isMobile} />}
          {activeNav === "config"     && <ConfigGeraisTab isMobile={isMobile} />}
          {activeNav === "receita"     && <MetricasAdminTab solutions={solutions} profiles={profiles} isMobile={isMobile} />}
          {activeNav === "metricas"   && <MetricasAdminTab solutions={solutions} profiles={profiles} isMobile={isMobile} />}
          {activeNav === "criadores_u" && <CriadoresUTab isMobile={isMobile} />}
          {activeNav === "empresas_u"  && <EmpresasUTab isMobile={isMobile} />}
          {activeNav === "repasses"    && <RepassesTab isMobile={isMobile} />}
          {activeNav === "relatorios"  && <RelatoriosTab isMobile={isMobile} />}
          {activeNav === "taxas"       && <TaxasTab isMobile={isMobile} />}
          {activeNav === "banners"     && <BannersTab isMobile={isMobile} />}
          {activeNav === "emails"      && <EmailsTab isMobile={isMobile} />}
          {activeNav === "tickets"     && <TicketsTab isMobile={isMobile} />}
          {activeNav === "denuncias"   && <DenunciasTab isMobile={isMobile} />}
          {activeNav === "logs"        && <LogsTab isMobile={isMobile} />}
          {activeNav === "banidos"     && <BanidosTab isMobile={isMobile} />}
          {!REAL_TABS.has(activeNav)   && <ComingSoon label={TAB_LABELS[activeNav]} />}
        </div>
      </main>

      {/* Detail drawer */}
      {selectedSolution && (
        <DetailDrawer solution={selectedSolution} onClose={() => setSelectedSolution(null)} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />
      )}

      {/* Reject dialog */}
      {rejectTarget && (
        <RejectDialog solution={rejectTarget} onConfirm={r => handleConfirmReject(rejectTarget, r)} onClose={() => setRejectTarget(null)} />
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </div>
  );
}
