"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const LIGHT_BG = "#F7F7FC";

const CATEGORIES = ["Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

/* ── Icons ── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  solutions:   "M4 6h16M4 10h16M4 14h8",
  revenue:     "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  subscribers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  settings:    "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus:        "M12 5v14M5 12h14",
  close:       "M18 6L6 18M6 6l12 12",
  check:       "M20 6L9 17l-5-5",
  upload:      "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  link:        "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  trash:       "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  file:        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
};

/* ── Stat card ── */
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 24px",
      flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 99,
      background: checked ? PURPLE : "rgba(0,0,0,0.12)",
      border: "none", cursor: "pointer", padding: 0,
      position: "relative", flexShrink: 0,
      transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: 3,
        left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

/* ── Status badge ── */
const STATUS_CONFIG = {
  pending:  { label: "Em análise", bg: "#FEFCE8", border: "#FDE047", color: "#854D0E" },
  approved: { label: "Aprovado",   bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
  rejected: { label: "Reprovado",  bg: "#FEF2F2", border: "#FECACA", color: "#DC2626" },
};
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-block",
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
    }}>
      {cfg.label}
    </span>
  );
}

/* ── Solution card ── */
function SolutionCard({ solution, onToggleAtivo, onEdit }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
        background: solution.ativo ? PURPLE : "rgba(0,0,0,0.15)",
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{solution.titulo}</span>
          <StatusBadge status={solution.status || "pending"} />
          {(solution.version || 1) > 1 && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 99,
              background: "rgba(107,92,231,0.08)", color: PURPLE,
            }}>
              v{solution.version}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: GRAY }}>
          <span style={{
            display: "inline-block",
            background: `${PURPLE}12`, color: PURPLE,
            padding: "2px 8px", borderRadius: 99,
            fontWeight: 600, marginRight: 8,
          }}>
            {solution.categoria}
          </span>
          {solution.descricao?.slice(0, 80)}{solution.descricao?.length > 80 ? "…" : ""}
        </div>
        {solution.status === "rejected" && solution.rejection_reason && (
          <div style={{
            marginTop: 6, fontSize: 12, color: "#DC2626",
            background: "#FEF2F2", padding: "4px 10px", borderRadius: 6, display: "inline-block",
          }}>
            Motivo: {solution.rejection_reason}
          </div>
        )}
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: DARK }}>
          {solution.preco != null
            ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "Gratuito"}
        </div>
        {solution.preco != null && (
          <div style={{ fontSize: 11, color: GRAY }}>
            {solution.payment_type === "one_time" ? "único" : "/mês"}
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => onEdit(solution)}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1.5px solid rgba(107,92,231,0.25)`,
            background: "transparent", color: PURPLE,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${PURPLE}0D`)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Icon d={icons.edit} size={12} /> Editar
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Toggle checked={solution.ativo} onChange={v => onToggleAtivo(solution.id, v)} />
          <span style={{ fontSize: 10, color: solution.ativo ? PURPLE : GRAY, fontWeight: 600 }}>
            {solution.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4",
];
const ALLOWED_EXT = /\.(pdf|zip|txt|docx|mp4)$/i;

/* ── Modal ── */
function NovasolucaoModal({ onClose, onCreated, onUpdated, userId, solution = null }) {
  const isEdit = !!solution;
  const coverInputRef = useRef(null);
  const deliveryFileInputRef = useRef(null);

  // Public fields
  const [titulo, setTitulo] = useState(solution?.titulo || "");
  const [descricao, setDescricao] = useState(solution?.descricao || "");
  const [categoria, setCategoria] = useState(solution?.categoria || CATEGORIES[0]);
  const [preco, setPreco] = useState(solution?.preco != null ? String(solution.preco) : "");
  const [paymentType, setPaymentType] = useState(solution?.payment_type || "subscription");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(solution?.cover_url || "");
  const [coverError, setCoverError] = useState("");

  // Delivery fields
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

  /* Cover image */
  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setCoverError("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setCoverError("Imagem muito grande. Máximo 2MB.");
      return;
    }
    setCoverError("");
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  /* Delivery files */
  function handleDeliveryFileChange(e) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.test(f.name)) {
        setFileError(`"${f.name}" — formato inválido. Use PDF, ZIP, TXT, DOCX ou MP4.`);
        return;
      }
      if (f.size > 50 * 1024 * 1024) {
        setFileError(`"${f.name}" excede o limite de 50MB.`);
        return;
      }
    }
    setFileError("");
    setPendingFiles(prev => [...prev, ...files]);
    e.target.value = "";
  }

  /* Links */
  function addLink() { setDeliveryLinks(prev => [...prev, { label: "", url: "" }]); }
  function updateLink(i, field, val) {
    setDeliveryLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }
  function removeLink(i) { setDeliveryLinks(prev => prev.filter((_, idx) => idx !== i)); }

  /* Submit */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Upload cover
    let coverUrl = isEdit ? (solution.cover_url || null) : null;
    if (coverFile) {
      const ext = coverFile.name.split(".").pop().toLowerCase();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { data: up, error: ue } = await supabase.storage
        .from("solution-covers")
        .upload(path, coverFile, { cacheControl: "3600", upsert: false });
      if (ue) { setError("Erro ao enviar imagem: " + ue.message); setLoading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("solution-covers").getPublicUrl(up.path);
      coverUrl = publicUrl;
    }

    // Upload delivery files
    const uploadedFiles = [...existingFiles];
    for (const f of pendingFiles) {
      const safeName = f.name.replace(/\s+/g, "_");
      const path = `${userId}/${Date.now()}_${safeName}`;
      const { data: up, error: ue } = await supabase.storage
        .from("solution-files")
        .upload(path, f, { cacheControl: "3600", upsert: false });
      if (ue) { setError("Erro ao enviar arquivo: " + ue.message); setLoading(false); return; }
      uploadedFiles.push({ name: f.name, path: up.path, size_bytes: f.size, content_type: f.type });
    }

    const cleanLinks = deliveryLinks.filter(l => l.url.trim());

    const payload = {
      titulo, descricao, categoria,
      preco: preco === "" ? null : parseFloat(preco),
      payment_type: paymentType,
      cover_url: coverUrl,
      delivery_files: uploadedFiles,
      delivery_links: cleanLinks,
      delivery_instructions: deliveryInstructions.trim() || null,
    };

    if (isEdit) {
      const { data, error: ue } = await supabase
        .from("solutions")
        .update({ ...payload, status: "pending" })
        .eq("id", solution.id)
        .select().single();
      if (ue) { setError(ue.message || "Erro ao atualizar solução."); setLoading(false); return; }
      onUpdated(data);
    } else {
      const { data, error: ie } = await supabase
        .from("solutions")
        .insert({ ...payload, status: "pending", creator_id: userId, ativo: true, version: 1 })
        .select().single();
      if (ie) { setError(ie.message || "Erro ao criar solução."); setLoading(false); return; }
      onCreated(data);
    }

    setSubmitted(true);
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.12)",
    fontSize: 14, color: DARK, background: "#FAFAFA", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6 };
  const backdropStyle = {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(10,10,26,0.4)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const panelStyle = {
    background: "#fff", borderRadius: 20,
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    width: "100%", maxWidth: 560, padding: "32px",
    animation: "modalIn 0.2s ease",
    maxHeight: "90vh", overflowY: "auto",
  };

  /* Success screen */
  if (submitted) {
    return (
      <div style={backdropStyle}>
        <div style={{ ...panelStyle, textAlign: "center" }}>
          <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: 28,
          }}>✦</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 10px" }}>
            {isEdit ? "Atualização enviada para análise!" : "Solução enviada para curadoria!"}
          </h2>
          <p style={{ fontSize: 14, color: GRAY, margin: "0 0 24px", lineHeight: 1.6 }}>
            {isEdit
              ? "Sua atualização foi enviada para nova análise. Em até 48 horas você saberá o resultado."
              : <>Nossa equipe irá analisar sua solução em até <strong style={{ color: DARK }}>48 horas</strong>. Você poderá acompanhar o status aqui no dashboard.</>}
          </p>
          <button onClick={onClose} style={{
            background: PURPLE, color: "#fff", border: "none",
            borderRadius: 10, padding: "11px 28px",
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={backdropStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={panelStyle}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: 0 }}>
            {isEdit ? "Editar Solução" : "Nova Solução"}
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: GRAY, padding: 4, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon d={icons.close} size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Section: Informações públicas ── */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: GRAY,
            textTransform: "uppercase", letterSpacing: "0.8px",
            marginBottom: 16,
          }}>
            Informações públicas
          </div>

          {/* Cover */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Imagem de capa</label>
            <div
              onClick={() => coverInputRef.current?.click()}
              style={{
                position: "relative", paddingTop: "42%",
                borderRadius: 10, overflow: "hidden",
                border: coverPreview ? "none" : "2px dashed rgba(0,0,0,0.12)",
                background: coverPreview ? "transparent" : "#FAFAFA",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!coverPreview) e.currentTarget.style.borderColor = PURPLE; }}
              onMouseLeave={e => { if (!coverPreview) e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Preview"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Icon d={icons.upload} size={22} />
                  <span style={{ fontSize: 12, color: GRAY }}>Clique para enviar · JPG, PNG ou WebP · máx. 2MB</span>
                </div>
              )}
              {coverPreview && (
                <button type="button"
                  onClick={ev => { ev.stopPropagation(); setCoverFile(null); setCoverPreview(""); }}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.5)", color: "#fff",
                    border: "none", borderRadius: "50%",
                    width: 28, height: 28, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <Icon d={icons.close} size={14} />
                </button>
              )}
            </div>
            <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }} onChange={handleCoverChange} />
            {coverError && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 6 }}>{coverError}</div>}
          </div>

          {/* Título */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Título</label>
            <input type="text" required placeholder="Ex: Agente de Atendimento com IA"
              value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Descrição</label>
            <textarea required rows={3} placeholder="Descreva o que sua solução faz e como ela ajuda o cliente…"
              value={descricao} onChange={e => setDescricao(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
          </div>

          {/* Payment type */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Modelo de pagamento</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { value: "subscription", label: "Assinatura Mensal", icon: "↻", sub: "Cobrança recorrente" },
                { value: "one_time",     label: "Venda Única",       icon: "✦", sub: "Pagamento único" },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setPaymentType(opt.value)} style={{
                  padding: "12px", borderRadius: 10, textAlign: "left", fontFamily: "inherit",
                  border: `2px solid ${paymentType === opt.value ? PURPLE : "rgba(0,0,0,0.1)"}`,
                  background: paymentType === opt.value ? `${PURPLE}0D` : "#fff",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{opt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Categoria + Preço */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={e => (e.target.style.borderColor = PURPLE)}
                onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                {paymentType === "one_time" ? "Preço único (R$)" : "Preço mensal (R$)"}
              </label>
              <input type="number" min="0" step="0.01" placeholder="Ex: 97.00"
                value={preco} onChange={e => setPreco(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = PURPLE)}
                onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
            </div>
          </div>

          {/* ── Section divider: Entrega ── */}
          <div style={{ margin: "0 -32px 24px", padding: "16px 32px", background: "#F7F7FC", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>
              Entrega para Curadoria
            </div>
            <div style={{ fontSize: 12, color: GRAY }}>
              Privado — visível apenas para a equipe de curadoria.
            </div>
          </div>

          {/* Arquivos da solução */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Arquivos da solução</label>

            {/* Existing + pending files list */}
            {(existingFiles.length > 0 || pendingFiles.length > 0) && (
              <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {existingFiles.map((f, i) => (
                  <div key={`ex-${i}`} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.08)", background: "#fff",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <Icon d={icons.file} size={14} />
                      <span style={{ fontSize: 13, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.name}
                      </span>
                      <span style={{ fontSize: 11, color: GRAY, flexShrink: 0 }}>{formatBytes(f.size_bytes)}</span>
                    </div>
                    <button type="button" onClick={() => setExistingFiles(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, padding: "2px 4px", display: "flex" }}>
                      <Icon d={icons.close} size={14} />
                    </button>
                  </div>
                ))}
                {pendingFiles.map((f, i) => (
                  <div key={`pend-${i}`} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 8,
                    border: `1px solid ${PURPLE}30`, background: `${PURPLE}05`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <Icon d={icons.file} size={14} />
                      <span style={{ fontSize: 13, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.name}
                      </span>
                      <span style={{ fontSize: 11, color: PURPLE, flexShrink: 0 }}>
                        {formatBytes(f.size)} · novo
                      </span>
                    </div>
                    <button type="button" onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, padding: "2px 4px", display: "flex" }}>
                      <Icon d={icons.close} size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <div
              onClick={() => deliveryFileInputRef.current?.click()}
              style={{
                padding: "14px", borderRadius: 10,
                border: "2px dashed rgba(0,0,0,0.1)",
                background: "#FAFAFA", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = PURPLE)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
            >
              <Icon d={icons.upload} size={16} />
              <span style={{ fontSize: 13, color: GRAY }}>
                Adicionar arquivo · PDF, ZIP, TXT, DOCX, MP4 · máx. 50MB
              </span>
            </div>
            <input ref={deliveryFileInputRef} type="file" multiple
              accept=".pdf,.zip,.txt,.docx,.mp4,application/pdf,application/zip,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4"
              style={{ display: "none" }} onChange={handleDeliveryFileChange} />
            {fileError && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 6 }}>{fileError}</div>}
          </div>

          {/* Links de acesso */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Links de acesso</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {deliveryLinks.map((link, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="text" placeholder="Rótulo (ex: Vídeo demo)"
                    value={link.label} onChange={e => updateLink(i, "label", e.target.value)}
                    style={{ ...inputStyle, width: "35%" }}
                    onFocus={e => (e.target.style.borderColor = PURPLE)}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
                  <input type="url" placeholder="https://…"
                    value={link.url} onChange={e => updateLink(i, "url", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = PURPLE)}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
                  {deliveryLinks.length > 1 && (
                    <button type="button" onClick={() => removeLink(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, padding: "0 4px", flexShrink: 0, display: "flex" }}>
                      <Icon d={icons.close} size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addLink} style={{
              marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              color: PURPLE, fontSize: 13, fontWeight: 600, padding: "4px 0", fontFamily: "inherit",
            }}>
              <Icon d={icons.plus} size={14} /> Adicionar link
            </button>
          </div>

          {/* Instruções para o curador */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Instruções para o curador <span style={{ fontWeight: 400, color: GRAY }}>(opcional)</span></label>
            <textarea rows={3}
              placeholder="Explique como testar a solução, credenciais de acesso, contexto adicional…"
              value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")} />
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#DC2626", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 10,
              border: "1.5px solid rgba(0,0,0,0.12)",
              background: "transparent", color: GRAY,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              padding: "10px 24px", borderRadius: 10,
              background: loading ? "#9B8DE8" : PURPLE,
              color: "#fff", border: "none",
              fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
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

/* ── Sidebar nav item ── */
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderRadius: 10, border: "none",
      background: active ? `${PURPLE}12` : "transparent",
      color: active ? PURPLE : "#374151",
      fontSize: 14, fontWeight: active ? 600 : 500,
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      transition: "background 0.15s, color 0.15s",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ opacity: active ? 1 : 0.6 }}><Icon d={icon} size={16} /></span>
      {label}
    </button>
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
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("solutions");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);

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
      setLoading(false);
    }
    init();
  }, [router]);

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

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: LIGHT_BG,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="dash-loading" textColor={DARK} />
          <div style={{ fontSize: 13, color: GRAY, marginTop: 16 }}>Carregando dashboard…</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split("@")[0] || "Criador";
  const navItems = [
    { key: "solutions",   icon: icons.solutions,   label: "Minhas Soluções" },
    { key: "revenue",     icon: icons.revenue,     label: "Receita" },
    { key: "subscribers", icon: icons.subscribers, label: "Assinantes" },
    { key: "settings",    icon: icons.settings,    label: "Configurações" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif", background: LIGHT_BG, color: DARK }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0, background: "#fff",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0, overflowY: "auto",
      }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="dash-sidebar" textColor={DARK} />
          </a>
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 16px 16px" }} />
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem key={item.key} icon={item.icon} label={item.label}
              active={activeNav === item.key} onClick={() => setActiveNav(item.key)} />
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `${PURPLE}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: PURPLE, flexShrink: 0,
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: GRAY }}>Criador</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 10, border: "none",
            background: "transparent", color: "#DC2626",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon d={icons.logout} size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, marginLeft: 240, minWidth: 0 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>

          {activeNav === "solutions" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
                    Minhas Soluções
                  </h1>
                  <p style={{ fontSize: 14, color: GRAY, margin: "4px 0 0" }}>
                    Gerencie as soluções que você publicou no marketplace.
                  </p>
                </div>
                <button onClick={openCreate} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: PURPLE, color: "#fff",
                  border: "none", borderRadius: 10,
                  padding: "11px 20px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
                  transition: "background 0.15s, box-shadow 0.15s", flexShrink: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#5A4BD6"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(107,92,231,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = PURPLE; e.currentTarget.style.boxShadow = "0 4px 16px rgba(107,92,231,0.3)"; }}
                >
                  <Icon d={icons.plus} size={16} /> Nova Solução
                </button>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                <StatCard label="Total de soluções" value={solutions.length} sub={`${solutions.filter(s => s.ativo).length} ativas`} />
                <StatCard label="Assinantes" value="0" sub="Nenhum ainda" />
                <StatCard label="Receita mensal" value="R$ 0" sub="Sem assinaturas ativas" />
              </div>

              {solutions.length === 0 ? (
                <div style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.07)",
                  padding: "60px 32px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                    Você ainda não publicou nenhuma solução.
                  </h2>
                  <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
                    Comece agora e coloque sua solução de IA no maior marketplace da América Latina.
                  </p>
                  <button onClick={openCreate} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: PURPLE, color: "#fff",
                    border: "none", borderRadius: 10,
                    padding: "11px 24px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <Icon d={icons.plus} size={16} /> Criar minha primeira solução
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {solutions.map(s => (
                    <SolutionCard key={s.id} solution={s}
                      onToggleAtivo={handleToggleAtivo}
                      onEdit={openEdit} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav !== "solutions" && (
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "80px 32px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 16 }}>
                <Icon d={navItems.find(n => n.key === activeNav)?.icon || icons.solutions} size={48} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                {navItems.find(n => n.key === activeNav)?.label}
              </h2>
              <p style={{ fontSize: 14, color: GRAY }}>Esta seção estará disponível em breve.</p>
            </div>
          )}

        </div>
      </main>

      {/* ── MODAL ── */}
      {modalOpen && (
        <NovasolucaoModal
          solution={editingSolution}
          onClose={closeModal}
          onCreated={s => { handleCreated(s); closeModal(); }}
          onUpdated={s => { handleUpdated(s); closeModal(); }}
          userId={user.id}
        />
      )}
    </div>
  );
}
