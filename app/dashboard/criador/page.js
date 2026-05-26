"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";
import NotificationBell from "../../components/NotificationBell";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";

const CATEGORIES = ["Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  solutions: "M4 6h16M4 10h16M4 14h8",
  chart:     "M18 20V10M12 20V4M6 20v-6",
  revenue:   "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  settings:  "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus:      "M12 5v14M5 12h14",
  close:     "M18 6L6 18M6 6l12 12",
  check:     "M20 6L9 17l-5-5",
  upload:    "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  file:      "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
  chevron:   "M6 9l6 6 6-6",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  link:      "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
};

/* ── Status badge ── */
const STATUS_CFG = {
  pending:  { label: "Em análise", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  color: "#B45309" },
  approved: { label: "Ativo",      bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.25)",   color: "#15803D" },
  rejected: { label: "Pausado",    bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.25)",   color: "#B91C1C" },
};
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span style={{
      display: "inline-block",
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
    }}>{c.label}</span>
  );
}

/* ── KPI card ── */
function KpiCard({ iconD, label, value, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      padding: "24px", flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "#e0f2fe", color: BLUE,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <Icon d={iconD} size={18} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: BLUE, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2, opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 99,
      background: checked ? BLUE : "rgba(0,0,0,0.15)",
      border: "none", cursor: "pointer", padding: 0,
      position: "relative", flexShrink: 0, transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: 3,
        left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

/* ── Bar chart ── */
function BarChart({ data, labels }) {
  const max = Math.max(...data);
  const W = 560; const H = 140;
  const bw = 48;
  const gap = (W - data.length * bw) / (data.length + 1);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1={0} y1={H - p * H} x2={W} y2={H - p * H}
          stroke={BORDER} strokeWidth={1} />
      ))}
      {data.map((val, i) => {
        const bh = (val / max) * H;
        const x = gap + i * (bw + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bh} width={bw} height={bh} rx={6}
              fill={BLUE} opacity={i === data.length - 1 ? 1 : 0.55} />
            <text x={x + bw / 2} y={H + 18} textAnchor="middle"
              fontSize={11} fill={GRAY_TEXT} fontFamily="inherit">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Helpers ── */
function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ALLOWED_TYPES = [
  "application/pdf", "application/zip", "application/x-zip-compressed",
  "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "video/mp4",
];
const ALLOWED_EXT = /\.(pdf|zip|txt|docx|mp4)$/i;

/* ══════════════════════════════
   MODAL — Nova / Editar Solução
══════════════════════════════ */
function NovasolucaoModal({ onClose, onCreated, onUpdated, userId, solution = null }) {
  const isEdit = !!solution;
  const coverInputRef = useRef(null);
  const deliveryFileInputRef = useRef(null);

  const [titulo, setTitulo] = useState(solution?.titulo || "");
  const [descricao, setDescricao] = useState(solution?.descricao || "");
  const [categoria, setCategoria] = useState(solution?.categoria || CATEGORIES[0]);
  const [preco, setPreco] = useState(solution?.preco != null ? String(solution.preco) : "");
  const [paymentType, setPaymentType] = useState(solution?.payment_type || "subscription");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(solution?.cover_url || "");
  const [coverError, setCoverError] = useState("");
  const [existingFiles, setExistingFiles] = useState(solution?.delivery_files || []);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [deliveryLinks, setDeliveryLinks] = useState(
    solution?.delivery_links?.length > 0 ? solution.delivery_links : [{ label: "", url: "" }]
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState(solution?.delivery_instructions || "");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setCoverError("Formato inválido. Use JPG, PNG ou WebP."); return; }
    if (file.size > 2 * 1024 * 1024) { setCoverError("Imagem muito grande. Máximo 2MB."); return; }
    setCoverError(""); setCoverFile(file); setCoverPreview(URL.createObjectURL(file));
  }

  function handleDeliveryFileChange(e) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.test(f.name)) { setFileError(`"${f.name}" — formato inválido. Use PDF, ZIP, TXT, DOCX ou MP4.`); return; }
      if (f.size > 50 * 1024 * 1024) { setFileError(`"${f.name}" excede o limite de 50MB.`); return; }
    }
    setFileError(""); setPendingFiles(prev => [...prev, ...files]); e.target.value = "";
  }

  function addLink() { setDeliveryLinks(prev => [...prev, { label: "", url: "" }]); }
  function updateLink(i, field, val) { setDeliveryLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l)); }
  function removeLink(i) { setDeliveryLinks(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    let coverUrl = isEdit ? (solution.cover_url || null) : null;
    if (coverFile) {
      const ext = coverFile.name.split(".").pop().toLowerCase();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { data: up, error: ue } = await supabase.storage.from("solution-covers").upload(path, coverFile, { cacheControl: "3600", upsert: false });
      if (ue) { setError("Erro ao enviar imagem: " + ue.message); setLoading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("solution-covers").getPublicUrl(up.path);
      coverUrl = publicUrl;
    }
    const uploadedFiles = [...existingFiles];
    for (const f of pendingFiles) {
      const safeName = f.name.replace(/\s+/g, "_");
      const path = `${userId}/${Date.now()}_${safeName}`;
      const { data: up, error: ue } = await supabase.storage.from("solution-files").upload(path, f, { cacheControl: "3600", upsert: false });
      if (ue) { setError("Erro ao enviar arquivo: " + ue.message); setLoading(false); return; }
      uploadedFiles.push({ name: f.name, path: up.path, size_bytes: f.size, content_type: f.type });
    }
    const cleanLinks = deliveryLinks.filter(l => l.url.trim());
    const payload = {
      titulo, descricao, categoria,
      preco: preco === "" ? null : parseFloat(preco),
      payment_type: paymentType, cover_url: coverUrl,
      delivery_files: uploadedFiles, delivery_links: cleanLinks,
      delivery_instructions: deliveryInstructions.trim() || null,
    };
    if (isEdit) {
      const { data, error: ue } = await supabase.from("solutions").update({ ...payload, status: "pending" }).eq("id", solution.id).select().single();
      if (ue) { setError(ue.message || "Erro ao atualizar solução."); setLoading(false); return; }
      onUpdated(data);
    } else {
      const { data, error: ie } = await supabase.from("solutions").insert({ ...payload, status: "pending", creator_id: userId, ativo: true, version: 1 }).select().single();
      if (ie) { setError(ie.message || "Erro ao criar solução."); setLoading(false); return; }
      onCreated(data);
    }
    setSubmitted(true); setLoading(false);
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6 };
  const fi = e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; };
  const fb = e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; };

  const backdrop = {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const panel = {
    background: "#fff", borderRadius: 20,
    boxShadow: "0 16px 60px rgba(0,0,0,0.12)",
    width: "100%", maxWidth: 560, padding: "32px",
    animation: "modalIn 0.2s ease",
    maxHeight: "90vh", overflowY: "auto",
  };

  if (submitted) {
    return (
      <div style={backdrop}>
        <div style={{ ...panel, textAlign: "center" }}>
          <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: 28, color: "#15803D",
          }}>✦</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: NEAR_BLACK, margin: "0 0 10px" }}>
            {isEdit ? "Atualização enviada para análise!" : "Solução enviada para curadoria!"}
          </h2>
          <p style={{ fontSize: 14, color: GRAY_TEXT, margin: "0 0 24px", lineHeight: 1.6 }}>
            {isEdit
              ? "Sua atualização foi enviada para nova análise. Em até 48 horas você saberá o resultado."
              : <>Nossa equipe irá analisar em até <strong style={{ color: NEAR_BLACK }}>48 horas</strong>. Acompanhe o status aqui no dashboard.</>}
          </p>
          <button onClick={onClose} style={{
            background: BLUE, color: "#fff", border: "none",
            borderRadius: 10, padding: "11px 28px",
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Entendido</button>
        </div>
      </div>
    );
  }

  return (
    <div style={backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={panel}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: NEAR_BLACK, margin: 0 }}>
            {isEdit ? "Editar Solução" : "Nova Solução"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: 4, borderRadius: 6, display: "flex" }}>
            <Icon d={icons.close} size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
            Informações públicas
          </div>
          {/* Cover */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Imagem de capa</label>
            <div onClick={() => coverInputRef.current?.click()} style={{
              position: "relative", paddingTop: "42%", borderRadius: 10, overflow: "hidden",
              border: coverPreview ? `1px solid ${BORDER}` : `2px dashed ${BORDER}`,
              background: coverPreview ? "transparent" : "#f9fafb", cursor: "pointer",
            }}
              onMouseEnter={e => { if (!coverPreview) e.currentTarget.style.borderColor = BLUE; }}
              onMouseLeave={e => { if (!coverPreview) e.currentTarget.style.borderColor = BORDER; }}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: GRAY_TEXT }}>
                  <Icon d={icons.upload} size={22} />
                  <span style={{ fontSize: 12 }}>Clique para enviar · JPG, PNG ou WebP · máx. 2MB</span>
                </div>
              )}
              {coverPreview && (
                <button type="button" onClick={ev => { ev.stopPropagation(); setCoverFile(null); setCoverPreview(""); }} style={{
                  position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff",
                  border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon d={icons.close} size={14} />
                </button>
              )}
            </div>
            <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleCoverChange} />
            {coverError && <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 6 }}>{coverError}</div>}
          </div>
          {/* Título */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Título</label>
            <input type="text" required placeholder="Ex: Agente de Atendimento com IA"
              value={titulo} onChange={e => setTitulo(e.target.value)} style={inp}
              onFocus={fi} onBlur={fb} />
          </div>
          {/* Descrição */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Descrição</label>
            <textarea required rows={3} placeholder="Descreva o que sua solução faz…"
              value={descricao} onChange={e => setDescricao(e.target.value)}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} onFocus={fi} onBlur={fb} />
          </div>
          {/* Payment type */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Modelo de pagamento</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { value: "subscription", label: "Assinatura Mensal", icon: "↻", sub: "Cobrança recorrente" },
                { value: "one_time",     label: "Venda Única",       icon: "✦", sub: "Pagamento único" },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setPaymentType(opt.value)} style={{
                  padding: "12px", borderRadius: 10, textAlign: "left", fontFamily: "inherit",
                  border: `2px solid ${paymentType === opt.value ? BLUE : BORDER}`,
                  background: paymentType === opt.value ? "rgba(3,105,161,0.05)" : "#f9fafb",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{opt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: GRAY_TEXT, marginTop: 2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Categoria + Preço */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            <div>
              <label style={lbl}>Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)}
                style={{ ...inp, cursor: "pointer" }} onFocus={fi} onBlur={fb}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>{paymentType === "one_time" ? "Preço único (R$)" : "Preço mensal (R$)"}</label>
              <input type="number" min="0" step="0.01" placeholder="Ex: 97.00"
                value={preco} onChange={e => setPreco(e.target.value)} style={inp} onFocus={fi} onBlur={fb} />
            </div>
          </div>
          {/* Entrega divider */}
          <div style={{ margin: "0 -32px 24px", padding: "14px 32px", background: BG_GRAY, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>
              Entrega para Curadoria
            </div>
            <div style={{ fontSize: 12, color: GRAY_TEXT }}>Privado — visível apenas para a equipe de curadoria.</div>
          </div>
          {/* Arquivos */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Arquivos da solução</label>
            {(existingFiles.length > 0 || pendingFiles.length > 0) && (
              <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {existingFiles.map((f, i) => (
                  <div key={`ex-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#f9fafb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ color: GRAY_TEXT }}><Icon d={icons.file} size={14} /></span>
                      <span style={{ fontSize: 13, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: GRAY_TEXT, flexShrink: 0 }}>{formatBytes(f.size_bytes)}</span>
                    </div>
                    <button type="button" onClick={() => setExistingFiles(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: "2px 4px", display: "flex" }}>
                      <Icon d={icons.close} size={14} />
                    </button>
                  </div>
                ))}
                {pendingFiles.map((f, i) => (
                  <div key={`pend-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, border: `1px solid rgba(3,105,161,0.25)`, background: "rgba(3,105,161,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ color: BLUE }}><Icon d={icons.file} size={14} /></span>
                      <span style={{ fontSize: 13, color: NEAR_BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: BLUE, flexShrink: 0 }}>{formatBytes(f.size)} · novo</span>
                    </div>
                    <button type="button" onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: "2px 4px", display: "flex" }}>
                      <Icon d={icons.close} size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div onClick={() => deliveryFileInputRef.current?.click()} style={{
              padding: "14px", borderRadius: 10, border: `2px dashed ${BORDER}`,
              background: "#f9fafb", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: GRAY_TEXT,
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = BLUE}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
            >
              <Icon d={icons.upload} size={16} />
              <span style={{ fontSize: 13 }}>Adicionar arquivo · PDF, ZIP, TXT, DOCX, MP4 · máx. 50MB</span>
            </div>
            <input ref={deliveryFileInputRef} type="file" multiple
              accept=".pdf,.zip,.txt,.docx,.mp4,application/pdf,application/zip,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4"
              style={{ display: "none" }} onChange={handleDeliveryFileChange} />
            {fileError && <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 6 }}>{fileError}</div>}
          </div>
          {/* Links */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Links de acesso</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {deliveryLinks.map((link, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="text" placeholder="Rótulo" value={link.label} onChange={e => updateLink(i, "label", e.target.value)}
                    style={{ ...inp, width: "35%" }} onFocus={fi} onBlur={fb} />
                  <input type="url" placeholder="https://…" value={link.url} onChange={e => updateLink(i, "url", e.target.value)}
                    style={{ ...inp, flex: 1 }} onFocus={fi} onBlur={fb} />
                  {deliveryLinks.length > 1 && (
                    <button type="button" onClick={() => removeLink(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY_TEXT, padding: "0 4px", flexShrink: 0, display: "flex" }}>
                      <Icon d={icons.close} size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addLink} style={{
              marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              color: BLUE, fontSize: 13, fontWeight: 600, padding: "4px 0", fontFamily: "inherit",
            }}>
              <Icon d={icons.plus} size={14} /> Adicionar link
            </button>
          </div>
          {/* Instruções */}
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Instruções para o curador <span style={{ fontWeight: 400, color: GRAY_TEXT }}>(opcional)</span></label>
            <textarea rows={3} placeholder="Explique como testar a solução…"
              value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} onFocus={fi} onBlur={fb} />
          </div>
          {error && <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 10, border: `1px solid ${BORDER}`,
              background: "transparent", color: GRAY_TEXT,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{
              padding: "10px 24px", borderRadius: 10,
              background: loading ? "rgba(3,105,161,0.5)" : BLUE,
              color: "#fff", border: "none", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {loading
                ? (pendingFiles.length > 0 ? "Enviando arquivos…" : "Salvando…")
                : <><Icon d={icons.check} size={14} /> {isEdit ? "Salvar alterações" : "Enviar para curadoria"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════
   CONFIGURAÇÕES — Criador
══════════════════════════ */
function SettingsCriador({ user, profile, isMobile, onProfileUpdate }) {
  const [nome, setNome] = useState(profile?.nome || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [portfolioLink, setPortfolioLink] = useState(profile?.portfolio_link || "");
  const [pixKey, setPixKey] = useState(profile?.pix_key || "");
  const [pixKeyType, setPixKeyType] = useState("cpf");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [notifVenda, setNotifVenda] = useState(true);
  const [notifComentario, setNotifComentario] = useState(true);
  const [notifAtualizacoes, setNotifAtualizacoes] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const avatarInputRef = useRef(null);

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const lbl = { fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" };
  const fi = e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; };
  const fb = e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; };

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true); setSaveMsg(""); setSaveError("");
    let avatarUrl = profile?.avatar_url || null;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }
    const updates = { id: user.id, nome, role: profile?.role || "criador" };
    const { error } = await supabase.from("profiles").upsert(updates);
    if (error) {
      console.error("Save error:", error);
      setSaveError("Erro ao salvar: " + error.message);
    } else {
      setSaveMsg("Alterações salvas com sucesso!");
      onProfileUpdate({ ...profile, nome });
      setTimeout(() => setSaveMsg(""), 3000);
    }
    setSaving(false);
  }

  const cardStyle = {
    background: "#fff", borderRadius: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    padding: isMobile ? "24px 20px" : "32px",
    marginBottom: 20,
  };
  const sectionTitle = { fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 };
  const divider = { height: 1, background: BORDER, margin: "20px 0" };
  const subHead = {
    fontSize: 11, fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase",
    letterSpacing: "0.8px", marginBottom: 16,
  };

  const planName = profile?.plan === "pro" ? "Pro" : profile?.plan === "premium" ? "Premium" : "Free";
  const planCommission = profile?.plan === "pro" ? "15%" : profile?.plan === "premium" ? "10%" : "20%";

  const FAQ_ITEMS = [
    { q: "Quanto tempo demora a aprovação das soluções?", a: "Nossa equipe analisa em até 48 horas úteis após o envio. Você receberá uma notificação por email com o resultado." },
    { q: "Como funciona o repasse dos pagamentos?", a: "O repasse é feito via PIX em até 30 dias após a confirmação da venda. O valor mínimo para saque é R$ 50." },
    { q: "Posso editar minha solução depois de publicada?", a: "Sim. Qualquer edição re-envia a solução para nova análise de curadoria, que leva até 48 horas." },
    { q: "O que acontece se minha solução for reprovada?", a: "Você recebe um feedback detalhado por email. Após as correções, pode reenviar para análise sem custo adicional." },
    { q: "Posso ter soluções em múltiplas categorias?", a: "Cada solução pertence a uma categoria. Você pode ter soluções em quantas categorias quiser, sem limite." },
  ];

  return (
    <form onSubmit={handleSubmit}>

      {/* Perfil */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Perfil público</h3>
        {/* Avatar */}
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Foto de perfil</label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
              background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center",
              border: `2px solid ${BORDER}`,
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>{(nome || "?").charAt(0).toUpperCase()}</span>}
            </div>
            <button type="button" onClick={() => avatarInputRef.current?.click()} style={{
              padding: "8px 18px", borderRadius: 10, border: `1px solid ${BORDER}`,
              background: "transparent", color: NEAR_BLACK, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Alterar foto</button>
            <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nome completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={inp} onFocus={fi} onBlur={fb} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Email</label>
          <input type="email" value={user?.email || ""} readOnly style={{ ...inp, background: BG_GRAY, color: GRAY_TEXT, cursor: "default" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Bio / Descrição</label>
          <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Descreva sua experiência e especialidades…" style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} onFocus={fi} onBlur={fb} />
        </div>
        <div>
          <label style={lbl}>Link do portfólio ou site</label>
          <input type="url" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="https://seusite.com" style={inp} onFocus={fi} onBlur={fb} />
        </div>
      </div>

      {/* PIX */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Dados de pagamento</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div>
            <label style={lbl}>Tipo de chave PIX</label>
            <select value={pixKeyType} onChange={e => setPixKeyType(e.target.value)}
              style={{ ...inp, cursor: "pointer" }} onFocus={fi} onBlur={fb}>
              {[["cpf", "CPF"], ["cnpj", "CNPJ"], ["email", "Email"], ["phone", "Telefone"], ["random", "Chave aleatória"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Chave PIX</label>
            <input type="text" value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="CPF, email, telefone ou chave aleatória" style={inp} onFocus={fi} onBlur={fb} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 12, margin: "12px 0 0" }}>
          O repasse é feito via PIX em até 30 dias após a venda confirmada.
        </p>
      </div>

      {/* Plano atual */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Plano atual</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                background: planName === "Free" ? BG_GRAY : BLUE,
                color: planName === "Free" ? NEAR_BLACK : "#fff",
                fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
              }}>{planName}</span>
            </div>
            <p style={{ fontSize: 14, color: GRAY_TEXT, margin: 0 }}>
              Comissão WePrompt: <strong style={{ color: NEAR_BLACK }}>{planCommission}</strong> por venda
            </p>
          </div>
          <a href="/precos" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: BLUE, color: "#fff",
            borderRadius: 12, padding: "10px 20px",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
            onMouseLeave={e => e.currentTarget.style.background = BLUE}
          >
            Fazer upgrade →
          </a>
        </div>
      </div>

      {/* Segurança */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Segurança</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>Senha atual</label>
            <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" style={inp} onFocus={fi} onBlur={fb} />
          </div>
          <div>
            <label style={lbl}>Nova senha</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Mínimo 8 caracteres" style={inp} onFocus={fi} onBlur={fb} />
          </div>
          <div>
            <label style={lbl}>Confirmar nova senha</label>
            <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repita a nova senha" style={inp} onFocus={fi} onBlur={fb} />
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Notificações</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { label: "Nova venda", sub: "Receba um aviso a cada nova assinatura ou compra", checked: notifVenda, set: setNotifVenda },
            { label: "Novo comentário", sub: "Seja notificado quando um cliente avaliar sua solução", checked: notifComentario, set: setNotifComentario },
            { label: "Atualizações da plataforma", sub: "Novidades, melhorias e comunicados da WePrompt", checked: notifAtualizacoes, set: setNotifAtualizacoes },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>{item.label}</div>
                <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 2 }}>{item.sub}</div>
              </div>
              <Toggle checked={item.checked} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      {/* Ajuda */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Ajuda</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              <button type="button" onClick={() => setFaqOpen(prev => prev === i ? null : i)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", background: "#fff", border: "none", cursor: "pointer",
                fontFamily: "inherit", gap: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK, textAlign: "left" }}>{item.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  style={{ flexShrink: 0, transition: "transform 0.25s", transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M6 9l6 6 6-6" stroke={GRAY_TEXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: GRAY_TEXT, lineHeight: 1.65 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Termos */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Termos e Políticas</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            ["Termos de Uso para Criadores", "/para-criadores/termos"],
            ["Política de Privacidade", "/para-empresas/termos"],
          ].map(([label, href]) => (
            <a key={label} href={href} style={{
              fontSize: 14, color: BLUE, textDecoration: "none", fontWeight: 500,
            }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              {label} →
            </a>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {saveError && <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>{saveError}</div>}
      {saveMsg && <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#15803D", marginBottom: 16 }}>{saveMsg}</div>}

      <button type="submit" disabled={saving} style={{
        padding: "14px 32px", borderRadius: 12,
        background: saving ? "rgba(3,105,161,0.5)" : BLUE,
        color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
        cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
        transition: "background 0.15s",
      }}
        onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#0284C7"; }}
        onMouseLeave={e => { if (!saving) e.currentTarget.style.background = BLUE; }}
      >
        {saving ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}

/* ── Sidebar nav item ── */
function NavItem({ iconD, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderRadius: 12, border: "none",
      background: active ? "#e0f2fe" : "transparent",
      color: active ? BLUE : GRAY_TEXT,
      fontSize: 14, fontWeight: active ? 600 : 500,
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      transition: "background 0.15s, color 0.15s",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ opacity: active ? 1 : 0.55, flexShrink: 0 }}>
        <Icon d={iconD} size={16} />
      </span>
      {label}
    </button>
  );
}

const GREEN_CRIADOR = "#059669";
const MONTHS_PT_C = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/* ── SimpleLineChart ── */
function SimpleLineChart({ data, labels }) {
  const W = 400, H = 140, PL = 44, PB = 26, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...data, 1) * 1.15;
  function gx(i) { return PL + (i / Math.max(data.length - 1, 1)) * cW; }
  function gy(v) { return PT + cH * (1 - v / max); }
  const pts = data.map((v, i) => `${gx(i)},${gy(v)}`).join(" ");
  const area = `M ${gx(0)},${PT + cH} ${data.map((v, i) => `L ${gx(i)},${gy(v)}`).join(" ")} L ${gx(data.length - 1)},${PT + cH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGradC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369A1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = PT + cH * (1 - f);
        return (
          <g key={f}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            {f > 0 && <text x={PL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#6E6E73">
              {max * f >= 1000 ? `${(max * f / 1000).toFixed(0)}k` : Math.round(max * f)}
            </text>}
          </g>
        );
      })}
      <path d={area} fill="url(#lineGradC)" />
      <polyline points={pts} fill="none" stroke="#0369A1" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((v, i) => <circle key={i} cx={gx(i)} cy={gy(v)} r={3} fill="#0369A1" />)}
      {labels.map((l, i) => <text key={i} x={gx(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#6E6E73">{l}</text>)}
    </svg>
  );
}

/* ── HorizBarChart ── */
function HorizBarChartC({ data }) {
  const W = 400, ROW_H = 38, PAD_L = 120, PAD_R = 50;
  const BAR_AREA = W - PAD_L - PAD_R;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <svg viewBox={`0 0 ${W} ${data.length * ROW_H}`} width="100%" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const bw = (d.value / max) * BAR_AREA;
        const y = i * ROW_H;
        const lbl = d.label.length > 15 ? d.label.slice(0, 13) + "…" : d.label;
        return (
          <g key={i}>
            <text x={PAD_L - 8} y={y + ROW_H / 2} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#6E6E73">{lbl}</text>
            <rect x={PAD_L} y={y + 8} width={Math.max(4, bw)} height={ROW_H - 16} rx={4} fill="#0369A1" opacity={0.8} />
            <text x={PAD_L + Math.max(4, bw) + 6} y={y + ROW_H / 2} dominantBaseline="middle" fontSize="11" fill="#1D1D1F" fontWeight="600">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── ANALYTICS TAB ── */
function AnalyticsCriadorTab({ solutions, userId, isMobile }) {
  const [period, setPeriod] = useState("30d");
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    async function load() {
      const solutionIds = solutions.map(s => s.id);
      if (solutionIds.length === 0) { setLoading(false); return; }
      const [subsRes, reviewsRes] = await Promise.all([
        supabase.from("subscriptions").select("id, created_at, status, solution_id, solutions(id, titulo, preco, categoria)").in("solution_id", solutionIds).order("created_at", { ascending: false }),
        supabase.from("reviews").select("rating").in("solution_id", solutionIds),
      ]);
      if (subsRes.data) setSubs(subsRes.data);
      if (reviewsRes.data?.length > 0) {
        setAvgRating((reviewsRes.data.reduce((s, r) => s + r.rating, 0) / reviewsRes.data.length).toFixed(1));
      }
      setLoading(false);
    }
    load();
  }, [solutions, userId]);

  const filteredSubs = useMemo(() => {
    if (period === "all") return subs;
    const days = { "7d": 7, "30d": 30, "3m": 90, "12m": 365 }[period] || 30;
    const cutoff = new Date(Date.now() - days * 86400000);
    return subs.filter(s => new Date(s.created_at) >= cutoff);
  }, [subs, period]);

  const now = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now); d.setMonth(d.getMonth() - 5 + i);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const monthLabels = last6Months.map(({ month }) => MONTHS_PT_C[month]);
  const revenueByMonth = last6Months.map(({ year, month }) =>
    subs.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; })
      .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
  );

  const thisMonth = subs.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); });
  const totalRevenue = subs.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);

  const solMap = {};
  for (const s of subs) {
    if (!solMap[s.solution_id]) solMap[s.solution_id] = { titulo: s.solutions?.titulo || "—", count: 0, revenue: 0 };
    solMap[s.solution_id].count++;
    solMap[s.solution_id].revenue += s.solutions?.preco || 0;
  }
  const solSales = Object.values(solMap).sort((a, b) => b.count - a.count);

  const solPerformance = solutions.map(sol => {
    const sd = solMap[sol.id] || { count: 0, revenue: 0 };
    return { id: sol.id, titulo: sol.titulo, categoria: sol.categoria, status: sol.status, vendas: sd.count, receita: sd.revenue, comissao: sd.revenue * 0.15, liquido: sd.revenue * 0.85 };
  });

  const periodOptions = [
    { key: "7d", label: "7 dias" }, { key: "30d", label: "30 dias" },
    { key: "3m", label: "3 meses" }, { key: "12m", label: "12 meses" }, { key: "all", label: "Todo período" },
  ];
  const card = { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" };

  if (loading) return <div style={{ textAlign: "center", padding: "80px", color: GRAY_TEXT }}>Carregando analytics…</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: GRAY_TEXT }}>Performance das suas soluções de IA.</p>
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {periodOptions.map(opt => (
          <button key={opt.key} onClick={() => setPeriod(opt.key)} style={{
            padding: "7px 18px", borderRadius: 99, border: "none",
            background: period === opt.key ? BLUE : "#fff",
            color: period === opt.key ? "#fff" : GRAY_TEXT,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "background 0.15s, color 0.15s",
          }}>{opt.label}</button>
        ))}
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: "acumulada" },
          { label: "Vendas este mês", value: thisMonth.length, sub: MONTHS_PT_C[now.getMonth()] + "/" + now.getFullYear() },
          { label: "Avaliação Média", value: avgRating ? `⭐ ${avgRating}` : "—", sub: "média das reviews" },
          { label: "Visualizações", value: "—", sub: "em breve" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 22px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: BLUE, letterSpacing: "-0.5px" }}>{c.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginTop: 6 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Receita por mês</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Últimos 6 meses (R$)</div>
          <SimpleLineChart data={revenueByMonth} labels={monthLabels} />
        </div>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Vendas por solução</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Ranking por número de vendas</div>
          {solSales.length === 0
            ? <div style={{ textAlign: "center", padding: "32px", color: GRAY_TEXT, fontSize: 14 }}>Sem vendas ainda</div>
            : <HorizBarChartC data={solSales.map(s => ({ label: s.titulo, value: s.count }))} />}
        </div>
      </div>

      {/* Performance table */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>Performance por Solução</div>
        {solPerformance.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: GRAY_TEXT }}>Nenhuma solução publicada.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Vendas", "Receita Bruta", "Comissão (15%)", "Receita Líquida", "Status"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solPerformance.map((s) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, color: NEAR_BLACK }}>{s.titulo}</div>
                      <div style={{ fontSize: 11, color: GRAY_TEXT }}>{s.categoria}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT }}>{s.vendas}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK }}>R$ {s.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px", color: "#7C3AED" }}>R$ {s.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: GREEN_CRIADOR }}>R$ {s.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        display: "inline-block",
                        background: s.status === "approved" ? "rgba(5,150,105,0.1)" : s.status === "pending" ? "rgba(217,119,6,0.1)" : "rgba(107,114,128,0.1)",
                        color: s.status === "approved" ? "#15803D" : s.status === "pending" ? "#B45309" : "#4B5563",
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      }}>
                        {s.status === "approved" ? "Ativo" : s.status === "pending" ? "Em análise" : "Pausado"}
                      </span>
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

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function CriadorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("inicio");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const width = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const u = session.user;
      setUser(u);
      const [profileRes, solutionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase.from("solutions").select("*").eq("creator_id", u.id).order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (solutionsRes.data) setSolutions(solutionsRes.data);

      const solutionIds = solutionsRes.data?.map(s => s.id) || [];
      if (solutionIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at, user_id, solution_id")
          .in("solution_id", solutionIds)
          .order("created_at", { ascending: false })
          .limit(5);
        if (reviewsData?.length > 0) {
          const uids = [...new Set(reviewsData.map(r => r.user_id))];
          const { data: profs } = await supabase.from("profiles").select("id, nome").in("id", uids);
          const profMap = Object.fromEntries((profs || []).map(p => [p.id, p]));
          const solMap  = Object.fromEntries((solutionsRes.data || []).map(s => [s.id, s]));
          setRecentReviews(reviewsData.map(r => ({
            ...r,
            reviewer_name:   profMap[r.user_id]?.nome || "Usuário",
            solution_titulo: solMap[r.solution_id]?.titulo || "—",
          })));
        }
      }

      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    async function loadChart() {
      if (!user || solutions.length === 0) return;
      const solutionIds = solutions.map(s => s.id);
      const now = new Date();
      const last6 = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now); d.setMonth(d.getMonth() - 5 + i);
        return { year: d.getFullYear(), month: d.getMonth() };
      });
      setChartLabels(last6.map(({ month }) => MONTHS_PT_C[month]));
      const { data } = await supabase
        .from("subscriptions")
        .select("created_at, solutions(preco)")
        .in("solution_id", solutionIds);
      if (data) {
        const byMonth = last6.map(({ year, month }) =>
          data.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; })
            .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
        );
        setChartData(byMonth);
      }
    }
    loadChart();
  }, [user, solutions]);

  function openCreate() { setEditingSolution(null); setModalOpen(true); }
  function openEdit(s) { setEditingSolution(s); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingSolution(null); }

  async function handleToggleAtivo(id, newValue) {
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, ativo: newValue } : s));
    await supabase.from("solutions").update({ ativo: newValue }).eq("id", id);
  }

  function handleCreated(s) { setSolutions(prev => [s, ...prev]); }
  function handleUpdated(s) { setSolutions(prev => prev.map(x => x.id === s.id ? s : x)); }
  async function handleSignOut() { await signOut(); router.replace("/login"); }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("nova") === "1") {
      setModalOpen(true);
      window.history.replaceState({}, "", "/dashboard/criador");
    }
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG_GRAY }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="dash-loading" textColor={NEAR_BLACK} />
          <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 16 }}>Carregando dashboard…</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split("@")[0] || "Criador";
  const initials = displayName.charAt(0).toUpperCase();

  const navItems = [
    { key: "inicio",        iconD: icons.home,      label: "Início" },
    { key: "prompts",       iconD: icons.solutions,  label: "Meus Prompts" },
    { key: "analytics",     iconD: icons.chart,      label: "Analytics" },
    { key: "vendas",        iconD: icons.revenue,    label: "Vendas" },
    { key: "configuracoes", iconD: icons.settings,   label: "Configurações" },
  ];

  const filteredSolutions = solutions.filter(s => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return s.ativo && s.status === "approved";
    if (filterStatus === "pending") return s.status === "pending";
    if (filterStatus === "paused") return !s.ativo || s.status === "rejected";
    return true;
  });

  const activeSolutions = solutions.filter(s => s.ativo && s.status === "approved").length;

  const [chartData, setChartData]     = useState([0,0,0,0,0,0]);
  const [chartLabels, setChartLabels] = useState(["Jan","Fev","Mar","Abr","Mai","Jun"]);


  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK, background: BG_GRAY }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,0.4)" }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "#fff",
        borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0,
        left: isMobile && !sidebarOpen ? -240 : 0,
        zIndex: 50, transition: "left 0.25s ease",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="dash-sidebar" textColor={NEAR_BLACK} />
          </a>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "0 16px 16px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem key={item.key} iconD={item.iconD} label={item.label}
              active={activeNav === item.key}
              onClick={() => { setActiveNav(item.key); if (isMobile) setSidebarOpen(false); }} />
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "#e0f2fe",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: BLUE,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: GRAY_TEXT }}>Criador</span>
                <span style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#fff", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, padding: "3px 10px",
                  flexShrink: 0,
                }}>
                  🏅 Criador Fundador
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 12, border: "none",
            background: "transparent", color: "#DC2626",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon d={icons.logout} size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : 240, minWidth: 0 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            position: "sticky", top: 0, zIndex: 40,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 16px", height: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <WePromptLogo id="dash-mobile" textColor={NEAR_BLACK} />
            </a>
            <button onClick={() => setSidebarOpen(o => !o)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 22, color: NEAR_BLACK, padding: "4px 8px", display: "flex", alignItems: "center",
            }}>
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>
        )}

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "40px 32px 48px" }}>

          {/* ── TAB: INÍCIO ── */}
          {activeNav === "inicio" && (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.8px", marginBottom: 6 }}>
                    Olá, {displayName} 👋
                  </h1>
                  <p style={{ fontSize: 15, color: GRAY_TEXT }}>Aqui está o resumo do seu painel de criador.</p>
                </div>
                <NotificationBell />
              </div>

              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                <KpiCard iconD={icons.solutions} label="Prompts Ativos" value={activeSolutions} sub={`${solutions.length} publicados`} />
                <KpiCard iconD={icons.revenue} label="Receita Total" value="R$ 0" sub="Sem assinaturas" />
                <KpiCard iconD={icons.star} label="Avaliação Média" value="—" sub="Nenhuma ainda" />
                <KpiCard iconD={icons.chart} label="Vendas este mês" value="0" sub="Mai/2026" />
              </div>

              {/* Bar chart */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "28px 28px 20px", marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Receita nos últimos 6 meses</div>
                    <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 2 }}>Dados ilustrativos</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BLUE }}>
                    {`R$ ${chartData.reduce((a, b) => a + b, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </div>
                </div>
                <BarChart data={chartData} labels={chartLabels} />
              </div>

              {/* Solutions table */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 28, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Meus Prompts</div>
                  <button onClick={() => setActiveNav("prompts")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: BLUE, fontWeight: 600, fontFamily: "inherit",
                  }}>Ver todos →</button>
                </div>
                {solutions.length === 0 ? (
                  <div style={{ padding: "40px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
                    Nenhum prompt publicado ainda.{" "}
                    <button onClick={openCreate} style={{ background: "none", border: "none", color: BLUE, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
                      Criar agora →
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: BG_GRAY }}>
                          {["Nome", "Categoria", "Preço", "Vendas", "Avaliação", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: GRAY_TEXT, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {solutions.slice(0, 5).map((s, i) => (
                          <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: NEAR_BLACK, maxWidth: 180 }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.titulo}</div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{s.categoria}</span>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: NEAR_BLACK, whiteSpace: "nowrap" }}>
                              {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: GRAY_TEXT }}>0</td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: GRAY_TEXT }}>—</td>
                            <td style={{ padding: "14px 16px" }}><StatusBadge status={s.status || "pending"} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent reviews */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Avaliações recebidas</div>
                {recentReviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: GRAY_TEXT, fontSize: 14 }}>
                    Nenhuma avaliação recebida ainda.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {recentReviews.map((r, i) => (
                      <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: i < recentReviews.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, color: BLUE }}>
                          {(r.reviewer_name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: NEAR_BLACK }}>{r.reviewer_name}</span>
                            <span style={{ display: "inline-flex", gap: 1 }}>
                              {[1,2,3,4,5].map(n => (
                                <svg key={n} width="11" height="11" viewBox="0 0 24 24" fill={n <= r.rating ? "#FBBF24" : "#e5e7eb"}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </span>
                            <span style={{ fontSize: 11, background: "#e0f2fe", color: BLUE, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>{r.solution_titulo}</span>
                          </div>
                          {r.comment && (
                            <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.comment}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: GRAY_TEXT, flexShrink: 0, whiteSpace: "nowrap" }}>
                          {new Date(r.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── TAB: MEUS PROMPTS ── */}
          {activeNav === "prompts" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Meus Prompts</h1>
                  <p style={{ fontSize: 14, color: GRAY_TEXT }}>Gerencie suas soluções publicadas no marketplace.</p>
                </div>
                <button onClick={openCreate} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: BLUE, color: "#fff", border: "none", borderRadius: 12,
                  padding: "11px 20px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                  onMouseLeave={e => e.currentTarget.style.background = BLUE}
                >
                  <Icon d={icons.plus} size={16} /> Nova Solução
                </button>
              </div>

              {/* Filter pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {[
                  { key: "all",     label: "Todos" },
                  { key: "active",  label: "Ativos" },
                  { key: "pending", label: "Em análise" },
                  { key: "paused",  label: "Pausados" },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
                    padding: "7px 18px", borderRadius: 999, border: "none",
                    background: filterStatus === f.key ? BLUE : "#fff",
                    color: filterStatus === f.key ? "#fff" : GRAY_TEXT,
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "background 0.15s, color 0.15s",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredSolutions.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "60px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.15 }}>✦</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Nenhuma solução encontrada</h2>
                  <p style={{ fontSize: 14, color: GRAY_TEXT, marginBottom: 24 }}>
                    {filterStatus === "all"
                      ? "Comece agora e publique sua solução de IA no marketplace."
                      : "Nenhuma solução corresponde a este filtro."}
                  </p>
                  {filterStatus === "all" && (
                    <button onClick={openCreate} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: BLUE, color: "#fff", border: "none", borderRadius: 12,
                      padding: "11px 24px", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      <Icon d={icons.plus} size={16} /> Criar minha primeira solução
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredSolutions.map(s => (
                    <div key={s.id} style={{
                      background: "#fff", borderRadius: 20,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      padding: isMobile ? "16px" : "20px 24px",
                      display: "flex", alignItems: isMobile ? "flex-start" : "center",
                      gap: isMobile ? 12 : 20, flexWrap: isMobile ? "wrap" : "nowrap",
                    }}>
                      {/* Cover thumbnail */}
                      <div style={{
                        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                        background: "#e0f2fe", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {s.cover_url
                          ? <img src={s.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 20 }}>✦</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: NEAR_BLACK }}>{s.titulo}</span>
                          <StatusBadge status={s.status || "pending"} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: GRAY_TEXT }}>
                          <span style={{ background: "#e0f2fe", color: BLUE, padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{s.categoria}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
                            {s.descricao?.slice(0, 80)}{s.descricao?.length > 80 ? "…" : ""}
                          </span>
                        </div>
                        {s.status === "rejected" && s.rejection_reason && (
                          <div style={{ marginTop: 6, fontSize: 12, color: "#B91C1C", background: "rgba(220,38,38,0.07)", padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>
                            Motivo: {s.rejection_reason}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>
                            {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                          </div>
                          {s.preco != null && <div style={{ fontSize: 11, color: GRAY_TEXT }}>{s.payment_type === "one_time" ? "único" : "/mês"}</div>}
                        </div>
                        <button onClick={() => openEdit(s)} style={{
                          padding: "7px 16px", borderRadius: 10, border: `1px solid ${BORDER}`,
                          background: "transparent", color: NEAR_BLACK,
                          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                          display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = BG_GRAY}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Icon d={icons.edit} size={13} /> Editar
                        </button>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <Toggle checked={s.ativo} onChange={v => handleToggleAtivo(s.id, v)} />
                          <span style={{ fontSize: 10, color: s.ativo ? BLUE : GRAY_TEXT, fontWeight: 600 }}>
                            {s.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── TAB: ANALYTICS ── */}
          {activeNav === "analytics" && (
            <AnalyticsCriadorTab solutions={solutions} userId={user?.id} isMobile={isMobile} />
          )}

          {/* ── TAB: VENDAS ── */}
          {activeNav === "vendas" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Vendas</h1>
                <p style={{ fontSize: 14, color: GRAY_TEXT }}>Histórico de vendas e repasses.</p>
              </div>

              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Receita bruta", value: "R$ 0" },
                  { label: "Comissão WePrompt", value: "R$ 0" },
                  { label: "Valor líquido", value: "R$ 0" },
                  { label: "Próximo repasse", value: "—" },
                ].map(item => (
                  <div key={item.label} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px" }}>
                    <div style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 8 }}>{item.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: BLUE, letterSpacing: "-0.5px" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Histórico de vendas</div>
                </div>
                <div style={{ padding: "48px 32px", textAlign: "center", color: GRAY_TEXT }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>💸</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6 }}>Nenhuma venda ainda</div>
                  <div style={{ fontSize: 14 }}>Suas vendas aparecerão aqui assim que você tiver assinantes.</div>
                </div>
              </div>
            </>
          )}

          {/* ── TAB: CONFIGURAÇÕES ── */}
          {activeNav === "configuracoes" && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Configurações</h1>
                <p style={{ fontSize: 14, color: GRAY_TEXT }}>Gerencie seu perfil, pagamentos e preferências.</p>
              </div>
              <SettingsCriador user={user} profile={profile} isMobile={isMobile} onProfileUpdate={setProfile} />
            </>
          )}

        </div>
      </main>

      {modalOpen && (
        <NovasolucaoModal
          solution={editingSolution}
          onClose={closeModal}
          onCreated={s => { handleCreated(s); router.push("/dashboard/criador/solucao-publicada"); }}
          onUpdated={s => { handleUpdated(s); closeModal(); }}
          userId={user.id}
        />
      )}
    </div>
  );
}
