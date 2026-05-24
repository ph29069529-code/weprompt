"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.08)";

const CATEGORIES = ["Automação", "Agentes de IA", "Chatbots", "Análise de Dados", "Marketing IA"];

function useWindowSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
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
      background: "#fff",
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 14,
      padding: "20px 24px", flex: 1, minWidth: 0,
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
      background: checked ? PURPLE : "rgba(0,0,0,0.15)",
      border: "none", cursor: "pointer", padding: 0,
      position: "relative", flexShrink: 0, transition: "background 0.2s",
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
  pending:  { label: "Em análise", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  color: "#B45309" },
  approved: { label: "Aprovado",   bg: "rgba(22,163,74,0.1)",   border: "rgba(22,163,74,0.3)",   color: "#15803D" },
  rejected: { label: "Reprovado",  bg: "rgba(220,38,38,0.1)",   border: "rgba(220,38,38,0.3)",   color: "#B91C1C" },
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
function SolutionCard({ solution, onToggleAtivo, onEdit, isMobile }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 14,
      padding: isMobile ? "14px 16px" : "20px 24px",
      display: "flex", alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 10 : 20, flexWrap: isMobile ? "wrap" : "nowrap",
      overflow: "hidden",
    }}>
      {!isMobile && (
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          background: solution.ativo ? PURPLE : "rgba(0,0,0,0.15)",
        }} />
      )}

      <div style={{ flex: isMobile ? "1 1 100%" : 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          {isMobile && (
            <div style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: solution.ativo ? PURPLE : "rgba(0,0,0,0.15)",
            }} />
          )}
          <span style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{solution.titulo}</span>
          <StatusBadge status={solution.status || "pending"} />
          {(solution.version || 1) > 1 && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 99,
              background: "rgba(107,92,231,0.1)", color: PURPLE,
            }}>
              v{solution.version}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: GRAY, overflow: "hidden" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(107,92,231,0.08)", color: PURPLE,
            padding: "2px 8px", borderRadius: 99,
            fontWeight: 600, marginRight: 8,
          }}>
            {solution.categoria}
          </span>
          {solution.descricao?.slice(0, 80)}{solution.descricao?.length > 80 ? "…" : ""}
        </div>
        {solution.status === "rejected" && solution.rejection_reason && (
          <div style={{
            marginTop: 6, fontSize: 12, color: "#B91C1C",
            background: "rgba(220,38,38,0.07)", padding: "4px 10px", borderRadius: 6, display: "inline-block",
          }}>
            Motivo: {solution.rejection_reason}
          </div>
        )}
      </div>

      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: isMobile ? "space-between" : "flex-end",
        gap: 16, flex: isMobile ? "1 1 100%" : "0 0 auto",
      }}>
        <div style={{ textAlign: isMobile ? "left" : "right" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
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
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(107,92,231,0.07)")}
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

  function addLink() { setDeliveryLinks(prev => [...prev, { label: "", url: "" }]); }
  function updateLink(i, field, val) {
    setDeliveryLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }
  function removeLink(i) { setDeliveryLinks(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    borderRadius: 10, border: `1.5px solid ${BORDER}`,
    fontSize: 14, color: DARK, background: "#fff",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6 };

  const backdropStyle = {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const panelStyle = {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    boxShadow: "0 16px 60px rgba(0,0,0,0.12)",
    width: "100%", maxWidth: 560, padding: "32px",
    animation: "modalIn 0.2s ease",
    maxHeight: "90vh", overflowY: "auto",
  };

  if (submitted) {
    return (
      <div style={backdropStyle}>
        <div style={{ ...panelStyle, textAlign: "center" }}>
          <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: 28, color: "#15803D",
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
            background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff", border: "none",
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

          <div style={{
            fontSize: 11, fontWeight: 700, color: GRAY,
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16,
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
                border: coverPreview ? `1px solid ${BORDER}` : `2px dashed rgba(0,0,0,0.12)`,
                background: coverPreview ? "transparent" : "#f9fafb",
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
                  color: GRAY,
                }}>
                  <Icon d={icons.upload} size={22} />
                  <span style={{ fontSize: 12 }}>Clique para enviar · JPG, PNG ou WebP · máx. 2MB</span>
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
            {coverError && <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 6 }}>{coverError}</div>}
          </div>

          {/* Título */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Título</label>
            <input type="text" required placeholder="Ex: Agente de Atendimento com IA"
              value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Descrição</label>
            <textarea required rows={3} placeholder="Descreva o que sua solução faz e como ela ajuda o cliente…"
              value={descricao} onChange={e => setDescricao(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = BORDER)} />
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
                  background: paymentType === opt.value ? "rgba(107,92,231,0.07)" : "#f9fafb",
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
                onBlur={e => (e.target.style.borderColor = BORDER)}>
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
                onBlur={e => (e.target.style.borderColor = BORDER)} />
            </div>
          </div>

          {/* Section divider: Entrega */}
          <div style={{
            margin: "0 -32px 24px", padding: "16px 32px",
            background: "#f9fafb",
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>
              Entrega para Curadoria
            </div>
            <div style={{ fontSize: 12, color: GRAY }}>
              Privado — visível apenas para a equipe de curadoria.
            </div>
          </div>

          {/* Arquivos */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Arquivos da solução</label>

            {(existingFiles.length > 0 || pendingFiles.length > 0) && (
              <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {existingFiles.map((f, i) => (
                  <div key={`ex-${i}`} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 8,
                    border: `1px solid ${BORDER}`, background: "#f9fafb",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ color: GRAY }}><Icon d={icons.file} size={14} /></span>
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
                    border: "1px solid rgba(107,92,231,0.25)", background: "rgba(107,92,231,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ color: PURPLE }}><Icon d={icons.file} size={14} /></span>
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

            <div
              onClick={() => deliveryFileInputRef.current?.click()}
              style={{
                padding: "14px", borderRadius: 10,
                border: "2px dashed rgba(0,0,0,0.12)",
                background: "#f9fafb", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                color: GRAY, transition: "border-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = PURPLE)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")}
            >
              <Icon d={icons.upload} size={16} />
              <span style={{ fontSize: 13 }}>
                Adicionar arquivo · PDF, ZIP, TXT, DOCX, MP4 · máx. 50MB
              </span>
            </div>
            <input ref={deliveryFileInputRef} type="file" multiple
              accept=".pdf,.zip,.txt,.docx,.mp4,application/pdf,application/zip,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4"
              style={{ display: "none" }} onChange={handleDeliveryFileChange} />
            {fileError && <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 6 }}>{fileError}</div>}
          </div>

          {/* Links */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Links de acesso</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {deliveryLinks.map((link, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="text" placeholder="Rótulo (ex: Vídeo demo)"
                    value={link.label} onChange={e => updateLink(i, "label", e.target.value)}
                    style={{ ...inputStyle, width: "35%" }}
                    onFocus={e => (e.target.style.borderColor = PURPLE)}
                    onBlur={e => (e.target.style.borderColor = BORDER)} />
                  <input type="url" placeholder="https://…"
                    value={link.url} onChange={e => updateLink(i, "url", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = PURPLE)}
                    onBlur={e => (e.target.style.borderColor = BORDER)} />
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

          {/* Instruções */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              Instruções para o curador <span style={{ fontWeight: 400, color: GRAY }}>(opcional)</span>
            </label>
            <textarea rows={3}
              placeholder="Explique como testar a solução, credenciais de acesso, contexto adicional…"
              value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = BORDER)} />
          </div>

          {error && (
            <div style={{
              background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#B91C1C", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1.5px solid ${BORDER}`,
              background: "transparent", color: GRAY,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              padding: "10px 24px", borderRadius: 10,
              background: loading ? "rgba(107,92,231,0.5)" : "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
              color: "#fff", border: "none",
              fontSize: 14, fontWeight: 600,
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

/* ── Settings form (Criador) ── */
function SettingsCriador({ user, profile, isMobile, onProfileUpdate }) {
  const [nome, setNome] = useState(profile?.nome || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [portfolioLink, setPortfolioLink] = useState(profile?.portfolio_link || "");
  const [pixKey, setPixKey] = useState(profile?.pix_key || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const avatarInputRef = useRef(null);

  const fldStyle = {
    width: "100%", padding: "10px 14px",
    borderRadius: 10, border: `1.5px solid ${BORDER}`,
    fontSize: 14, color: DARK, background: "#fff",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const lbl = { fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, display: "block" };

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    setSaveError("");

    let avatarUrl = profile?.avatar_url || null;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars").upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }

    const updates = { nome, bio, portfolio_link: portfolioLink, pix_key: pixKey };
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) {
      setSaveError("Erro ao salvar. Tente novamente.");
    } else {
      setSaveMsg("Alterações salvas!");
      onProfileUpdate({ ...profile, ...updates });
      setTimeout(() => setSaveMsg(""), 3000);
    }
    setSaving(false);
  }

  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 16, padding: isMobile ? "24px 20px" : "32px",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 24 }}>Configurações</h2>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Foto de perfil</label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
              background: "rgba(107,92,231,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `2px solid ${BORDER}`,
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 24, fontWeight: 700, color: PURPLE }}>{(nome || "?").charAt(0).toUpperCase()}</span>}
            </div>
            <button type="button" onClick={() => avatarInputRef.current?.click()} style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1.5px solid ${BORDER}`, background: "transparent",
              color: DARK, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Alterar foto
            </button>
            <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nome completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Email</label>
          <input type="email" value={user?.email || ""} readOnly
            style={{ ...fldStyle, background: "#f9fafb", color: GRAY, cursor: "default" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Bio / Descrição do perfil</label>
          <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Descreva sua experiência e especialidades…"
            style={{ ...fldStyle, resize: "vertical", lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Link do portfólio ou site</label>
          <input type="url" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)}
            placeholder="https://seusite.com" style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ height: 1, background: BORDER, margin: "8px 0 24px" }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
          Dados bancários
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={lbl}>Chave PIX</label>
          <input type="text" value={pixKey} onChange={e => setPixKey(e.target.value)}
            placeholder="CPF, email, telefone ou chave aleatória" style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        {saveError && (
          <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>
            {saveError}
          </div>
        )}
        {saveMsg && (
          <div style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#15803D", marginBottom: 16 }}>
            {saveMsg}
          </div>
        )}

        <button type="submit" disabled={saving} style={{
          padding: "11px 24px", borderRadius: 10,
          background: saving ? "rgba(107,92,231,0.5)" : "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
          color: "#fff", border: "none", fontSize: 14, fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
          boxShadow: saving ? "none" : "0 4px 12px rgba(107,92,231,0.25)",
        }}>
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}

/* ── Sidebar nav item ── */
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderRadius: 10, border: "none",
      background: active ? "rgba(107,92,231,0.1)" : "transparent",
      color: active ? PURPLE : GRAY,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="dash-loading" />
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
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif", color: DARK }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,0.4)" }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0,
        left: isMobile && !sidebarOpen ? -240 : 0,
        zIndex: 50,
        transition: "left 0.25s ease",
        overflowY: "auto",
      }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="dash-sidebar" textColor={DARK} />
          </a>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "0 16px 16px" }} />
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem key={item.key} icon={item.icon} label={item.label}
              active={activeNav === item.key}
              onClick={() => { setActiveNav(item.key); if (isMobile) setSidebarOpen(false); }} />
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(107,92,231,0.1)",
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
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(220,38,38,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon d={icons.logout} size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : 240, minWidth: 0 }}>
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
              <WePromptLogo id="dash-mobile" textColor={DARK} />
            </a>
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 22, color: DARK, padding: "4px 8px",
                display: "flex", alignItems: "center",
              }}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "24px 16px 32px" : "40px 32px" }}>

          {activeNav === "solutions" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
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
                  background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                  border: "none", borderRadius: 10,
                  padding: "11px 20px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
                  transition: "opacity 0.15s", flexShrink: 0,
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <Icon d={icons.plus} size={16} /> Nova Solução
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
                <StatCard label="Total de soluções" value={solutions.length} sub={`${solutions.filter(s => s.ativo).length} ativas`} />
                <StatCard label="Assinantes" value="0" sub="Nenhum ainda" />
                <StatCard label="Receita mensal" value="R$ 0" sub="Sem assinaturas ativas" />
              </div>

              {solutions.length === 0 ? (
                <div style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  borderRadius: 16, padding: "60px 32px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2, color: PURPLE }}>✦</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                    Você ainda não publicou nenhuma solução.
                  </h2>
                  <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
                    Comece agora e coloque sua solução de IA no maior marketplace da América Latina.
                  </p>
                  <button onClick={openCreate} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)", color: "#fff",
                    border: "none", borderRadius: 10,
                    padding: "11px 24px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
                  }}>
                    <Icon d={icons.plus} size={16} /> Criar minha primeira solução
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {solutions.map(s => (
                    <SolutionCard key={s.id} solution={s}
                      onToggleAtivo={handleToggleAtivo}
                      onEdit={openEdit}
                      isMobile={isMobile} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav === "settings" && (
            <SettingsCriador
              user={user}
              profile={profile}
              isMobile={isMobile}
              onProfileUpdate={setProfile}
            />
          )}

          {(activeNav === "revenue" || activeNav === "subscribers") && (
            <div style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              borderRadius: 16, padding: "80px 32px", textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: 0.15, color: DARK }}>
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
