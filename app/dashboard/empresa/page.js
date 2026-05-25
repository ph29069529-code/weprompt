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
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  grid:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  explore: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  history: "M12 8v4l3 3M12 3a9 9 0 100 18A9 9 0 0012 3z",
  chart:   "M18 20V10M12 20V4M6 20v-6",
  settings:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  check:   "M20 6L9 17l-5-5",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  chevron: "M6 9l6 6 6-6",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus:    "M12 5v14M5 12h14",
};

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

/* ── Sidebar nav item ── */
function NavItem({ iconD, label, active, onClick, href }) {
  const style = {
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "10px 16px", borderRadius: 12, border: "none",
    background: active ? "#e0f2fe" : "transparent",
    color: active ? BLUE : GRAY_TEXT,
    fontSize: 14, fontWeight: active ? 600 : 500,
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    transition: "background 0.15s, color 0.15s", textDecoration: "none",
  };
  const inner = (
    <>
      <span style={{ opacity: active ? 1 : 0.55, flexShrink: 0 }}><Icon d={iconD} size={16} /></span>
      {label}
    </>
  );
  if (href) {
    return (
      <a href={href} style={style}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} style={style}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      {inner}
    </button>
  );
}

/* ── Cancel dialog ── */
function CancelDialog({ solution, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  async function handleConfirm() { setLoading(true); await onConfirm(); setLoading(false); }
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 16px 60px rgba(0,0,0,0.12)",
        width: "100%", maxWidth: 420, padding: "32px",
        animation: "modalIn 0.2s ease",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, color: "#DC2626",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: NEAR_BLACK, margin: "0 0 8px" }}>Cancelar assinatura?</h2>
        <p style={{ fontSize: 14, color: GRAY_TEXT, margin: "0 0 24px", lineHeight: 1.6 }}>
          Você está prestes a cancelar a assinatura de{" "}
          <strong style={{ color: NEAR_BLACK }}>{solution}</strong>.{" "}
          Você perderá o acesso ao fim do período atual.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 10, border: `1px solid ${BORDER}`,
            background: "transparent", color: GRAY_TEXT,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Manter assinatura</button>
          <button onClick={handleConfirm} disabled={loading} style={{
            padding: "10px 20px", borderRadius: 10,
            background: loading ? "rgba(220,38,38,0.4)" : "#DC2626",
            color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {loading ? "Cancelando…" : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Acquired solution card ── */
function AcquiredCard({ sub, onCancel, isMobile }) {
  const solution = sub.solutions;
  const isActive = sub.status === "active";
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(3,105,161,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      {/* Thumbnail */}
      <div style={{ height: 120, position: "relative", flexShrink: 0 }}>
        {solution?.cover_url ? (
          <img src={solution.cover_url} alt={solution.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, color: BLUE, opacity: 0.6,
          }}>✦</div>
        )}
        {/* Status badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: isActive ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)",
          color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 99,
        }}>
          {isActive ? "Ativa" : "Cancelada"}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        {solution?.categoria && (
          <span style={{
            display: "inline-block", alignSelf: "flex-start",
            background: "#e0f2fe", color: BLUE,
            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
            marginBottom: 10,
          }}>{solution.categoria}</span>
        )}
        <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 6, lineHeight: 1.3 }}>
          {solution?.titulo || "Solução removida"}
        </div>
        <div style={{ fontSize: 13, color: GRAY_TEXT, marginBottom: 16 }}>
          Desde {new Date(sub.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
          {solution?.preco != null && (
            <span style={{ marginLeft: 8, color: NEAR_BLACK, fontWeight: 600 }}>
              · R$ {Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <span style={{ fontWeight: 400, color: GRAY_TEXT }}>{solution.payment_type === "one_time" ? " único" : "/mês"}</span>
            </span>
          )}
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
          <a href="/solucoes" style={{
            flex: 1, textAlign: "center",
            background: BLUE, color: "#fff",
            borderRadius: 10, padding: "10px",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
            onMouseLeave={e => e.currentTarget.style.background = BLUE}
          >
            Acessar →
          </a>
          <a href="mailto:contato@weprompt.app.br" style={{
            padding: "10px 14px", borderRadius: 10,
            border: `1px solid ${BORDER}`, color: GRAY_TEXT,
            fontSize: 13, fontWeight: 500, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = BG_GRAY}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Suporte
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════
   CONFIGURAÇÕES — Empresa
══════════════════════════ */
function SettingsEmpresa({ user, profile, isMobile, onProfileUpdate }) {
  const [nome, setNome] = useState(profile?.nome || "");
  const [cnpj, setCnpj] = useState(profile?.cnpj || "");
  const [segmento, setSegmento] = useState(profile?.segmento || "");
  const [site, setSite] = useState(profile?.site || "");
  const [descricao, setDescricao] = useState(profile?.descricao || "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [notifNovaSolucao, setNotifNovaSolucao] = useState(true);
  const [notifAtualizacoes, setNotifAtualizacoes] = useState(true);
  const [notifComunicados, setNotifComunicados] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(profile?.avatar_url || "");

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const lbl = { fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" };
  const fi = e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; };
  const fb = e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; };

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true); setSaveMsg(""); setSaveError("");
    const updates = { id: user.id, nome, role: profile?.role || "empresa" };
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

  const planName = profile?.plan === "business" ? "Business" : profile?.plan === "enterprise" ? "Enterprise" : "Free";

  const FAQ_ITEMS = [
    { q: "Como funciona o modelo de assinatura?", a: "Você paga mensalmente e tem acesso contínuo à solução enquanto a assinatura estiver ativa. O cancelamento pode ser feito a qualquer momento." },
    { q: "Como cancelo uma assinatura?", a: "Acesse 'Soluções Adquiridas', localize a solução desejada e clique em 'Cancelar'. Você mantém o acesso até o fim do período pago." },
    { q: "Posso usar soluções em múltiplos projetos?", a: "Cada assinatura é válida para a sua conta empresa. Consulte os termos de uso de cada solução para saber as restrições de uso." },
    { q: "O que acontece após cancelar uma assinatura?", a: "Você mantém o acesso até o fim do período já pago. Após isso, o acesso é encerrado automaticamente." },
    { q: "Como entro em contato com o criador da solução?", a: "Use o botão 'Suporte' na solução adquirida. Isso abrirá um contato direto com a equipe WePrompt, que facilita o contato com o criador." },
  ];

  return (
    <form onSubmit={handleSubmit}>

      {/* Perfil da Empresa */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Perfil da empresa</h3>

        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Logo da empresa</label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, overflow: "hidden", flexShrink: 0,
              background: "#e0f2fe", border: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>{(nome || "E").charAt(0).toUpperCase()}</span>}
            </div>
            <button type="button" onClick={() => logoInputRef.current?.click()} style={{
              padding: "8px 18px", borderRadius: 10, border: `1px solid ${BORDER}`,
              background: "transparent", color: NEAR_BLACK, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Alterar logo</button>
            <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleLogoChange} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 0 }}>
          <div>
            <label style={lbl}>Nome da empresa</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={inp} onFocus={fi} onBlur={fb} />
          </div>
          <div>
            <label style={lbl}>CNPJ</label>
            <input type="text" value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" style={inp} onFocus={fi} onBlur={fb} />
          </div>
          <div>
            <label style={lbl}>Segmento</label>
            <select value={segmento} onChange={e => setSegmento(e.target.value)} style={{ ...inp, cursor: "pointer" }} onFocus={fi} onBlur={fb}>
              <option value="">Selecione…</option>
              {["Tecnologia", "Varejo", "Saúde", "Educação", "Finanças", "Marketing", "RH", "Jurídico", "Logística", "Outros"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input type="email" value={user?.email || ""} readOnly style={{ ...inp, background: BG_GRAY, color: GRAY_TEXT, cursor: "default" }} />
          </div>
          <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
            <label style={lbl}>Site da empresa</label>
            <input type="url" value={site} onChange={e => setSite(e.target.value)} placeholder="https://suaempresa.com.br" style={inp} onFocus={fi} onBlur={fb} />
          </div>
          <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
            <label style={lbl}>Descrição</label>
            <textarea rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Conte um pouco sobre sua empresa…" style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} onFocus={fi} onBlur={fb} />
          </div>
        </div>
      </div>

      {/* Usuários da conta */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, margin: 0 }}>Usuários da conta</h3>
          <button type="button" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10,
            border: `1px solid ${BORDER}`, background: "transparent",
            color: NEAR_BLACK, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = BG_GRAY}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon d={icons.plus} size={14} /> Convidar usuário
          </button>
        </div>
        {/* Current user row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: BLUE,
          }}>
            {(nome || "E").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>{nome || "Administrador"}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT }}>{user?.email}</div>
          </div>
          <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>Admin</span>
        </div>
        <p style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 12, margin: "12px 0 0" }}>
          Convidar usuários adicionais está disponível nos planos Business e Enterprise.{" "}
          <a href="/precos" style={{ color: BLUE, textDecoration: "none" }}>Ver planos →</a>
        </p>
      </div>

      {/* Plano Atual */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Plano atual</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{
                background: planName === "Free" ? BG_GRAY : BLUE,
                color: planName === "Free" ? NEAR_BLACK : "#fff",
                fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
              }}>{planName}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(planName === "Free"
                ? ["Acesso ao catálogo completo", "Compra avulsa de soluções", "Suporte via e-mail"]
                : ["10% de desconto em todas as soluções", "Suporte prioritário em PT-BR", "Curadoria personalizada mensal"]
              ).map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: GRAY_TEXT }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="rgba(3,105,161,0.1)" />
                    <path d="M5 8l2 2 4-4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <a href="/precos" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: BLUE, color: "#fff", borderRadius: 12, padding: "10px 20px",
            fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "background 0.15s",
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
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Segurança</h3>
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
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Notificações</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { label: "Nova solução no catálogo", sub: "Seja notificado quando novas soluções relevantes forem publicadas", checked: notifNovaSolucao, set: setNotifNovaSolucao },
            { label: "Atualizações de soluções adquiridas", sub: "Receba avisos quando uma solução que você usa for atualizada", checked: notifAtualizacoes, set: setNotifAtualizacoes },
            { label: "Comunicados da WePrompt", sub: "Novidades, promoções e melhorias da plataforma", checked: notifComunicados, set: setNotifComunicados },
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
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 20 }}>Ajuda</h3>
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
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: GRAY_TEXT, lineHeight: 1.65 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Termos */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 16 }}>Termos e Políticas</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            ["Termos de Uso para Empresas", "/para-empresas/termos"],
            ["Política de Privacidade", "/para-criadores/termos"],
          ].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 14, color: BLUE, textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >{label} →</a>
          ))}
        </div>
      </div>

      {/* Feedback + Save */}
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

const MONTHS_PT_E = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const CAT_COLORS_E = ["#0369A1", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];

/* ── SimpleBarChart ── */
function SimpleBarChart({ data, labels }) {
  const W = 400, H = 140, PL = 44, PB = 26, PT = 8, PR = 8;
  const cW = W - PL - PR, cH = H - PT - PB;
  const max = Math.max(...data, 1) * 1.15;
  const barW = (cW / data.length) * 0.55;
  const gap = cW / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
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
      {data.map((v, i) => {
        const bh = Math.max((v / max) * cH, v > 0 ? 2 : 0);
        const x = PL + gap * i + (gap - barW) / 2;
        return (
          <g key={i}>
            <rect x={x} y={PT + cH - bh} width={barW} height={bh} fill="#0369A1" rx={4} opacity={i === data.length - 1 ? 1 : 0.65} />
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#6E6E73">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── DonutChart ── */
function DonutChartE({ data, size = 140 }) {
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
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#1D1D1F">{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#6E6E73">adquiridas</text>
    </svg>
  );
}

/* ── ANALYTICS EMPRESA TAB ── */
function AnalyticsEmpresaTab({ subscriptions, isMobile }) {
  const [period, setPeriod] = useState("30d");

  const filteredSubs = useMemo(() => {
    if (period === "all") return subscriptions;
    const days = { "7d": 7, "30d": 30, "3m": 90, "12m": 365 }[period] || 30;
    const cutoff = new Date(Date.now() - days * 86400000);
    return subscriptions.filter(s => new Date(s.created_at) >= cutoff);
  }, [subscriptions, period]);

  const activeSubs = subscriptions.filter(s => s.status === "active");
  const totalInvested = subscriptions.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);
  const estimatedSavings = totalInvested * 3;

  const now = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now); d.setMonth(d.getMonth() - 5 + i);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const monthLabels = last6Months.map(({ month }) => MONTHS_PT_E[month]);
  const gastosByMonth = last6Months.map(({ year, month }) =>
    subscriptions.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; })
      .reduce((sum, s) => sum + (s.solutions?.preco || 0), 0)
  );

  const catMap = {};
  subscriptions.forEach(s => { const c = s.solutions?.categoria || "Outras"; catMap[c] = (catMap[c] || 0) + 1; });
  const categoryData = Object.entries(catMap).sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: CAT_COLORS_E[i % CAT_COLORS_E.length] }));

  const periodOptions = [
    { key: "7d", label: "7 dias" }, { key: "30d", label: "30 dias" },
    { key: "3m", label: "3 meses" }, { key: "12m", label: "12 meses" }, { key: "all", label: "Todo período" },
  ];
  const card = { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "22px 24px" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: GRAY_TEXT }}>Análise de investimentos em soluções de IA.</p>
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
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Investido em Soluções", value: `R$ ${totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: `${filteredSubs.length} transações no período` },
          { label: "Soluções Adquiridas", value: subscriptions.length, sub: `${activeSubs.length} ativas atualmente` },
          { label: "Economia Estimada", value: `R$ ${estimatedSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: "vs contratar dev (3× o investido)" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: BLUE, letterSpacing: "-0.5px" }}>{c.value}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NEAR_BLACK, marginTop: 6 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Gastos por mês</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Últimos 6 meses (R$)</div>
          <SimpleBarChart data={gastosByMonth} labels={monthLabels} />
        </div>
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 2 }}>Soluções por categoria</div>
          <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 16 }}>Distribuição das aquisições</div>
          {categoryData.length === 0
            ? <div style={{ textAlign: "center", padding: "32px", color: GRAY_TEXT, fontSize: 14 }}>Nenhuma solução adquirida</div>
            : (
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <DonutChartE data={categoryData} />
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

      {/* ROI table */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>ROI por Solução</div>
        {subscriptions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: GRAY_TEXT }}>Nenhuma solução adquirida ainda.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Categoria", "Valor Pago", "Status", "Data de Aquisição"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: GRAY_TEXT, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK }}>{sub.solutions?.titulo || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#e0f2fe", color: BLUE, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                        {sub.solutions?.categoria || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: NEAR_BLACK }}>
                      {sub.solutions?.preco != null ? `R$ ${Number(sub.solutions.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        display: "inline-block",
                        background: sub.status === "active" ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)",
                        color: sub.status === "active" ? "#15803D" : "#B91C1C",
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      }}>
                        {sub.status === "active" ? "Ativo" : "Cancelado"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: GRAY_TEXT, whiteSpace: "nowrap" }}>
                      {new Date(sub.created_at).toLocaleDateString("pt-BR")}
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
export default function EmpresaDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("inicio");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const width = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    async function init() {
      const { data: { user: u }, error: userError } = await supabase.auth.getUser();
      if (userError || !u) { router.replace("/login"); return; }

      console.log("[empresa] user.id:", u.id);
      setUser(u);

      const [profileRes, subsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase
          .from("subscriptions")
          .select("*, solutions(*)")
          .eq("business_id", u.id)
          .order("created_at", { ascending: false }),
      ]);

      console.log("[empresa] subscriptions data:", subsRes.data);
      console.log("[empresa] subscriptions error:", subsRes.error);

      if (profileRes.data) setProfile(profileRes.data);
      if (subsRes.data) setSubscriptions(subsRes.data);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleSignOut() { await signOut(); router.replace("/login"); }

  async function handleCancel(subId) {
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", subId);
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: "cancelled" } : s));
    setCancelTarget(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG_GRAY }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="empresa-loading" textColor={NEAR_BLACK} />
          <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 16 }}>Carregando dashboard…</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split("@")[0] || "Empresa";
  const activeSubs = subscriptions.filter(s => s.status === "active");
  const monthlySpend = activeSubs.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);

  const planName = profile?.plan === "business" ? "Business" : profile?.plan === "enterprise" ? "Enterprise" : "Free";
  const planDiscount = planName === "Enterprise" ? 0.2 : planName === "Business" ? 0.1 : 0;
  const savings = monthlySpend * planDiscount;

  const allCategories = [...new Set(subscriptions.map(s => s.solutions?.categoria).filter(Boolean))];

  const filteredSubs = subscriptions.filter(s => {
    const matchSearch = !searchQuery ||
      s.solutions?.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.solutions?.categoria?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategoria === "all" || s.solutions?.categoria === filterCategoria;
    return matchSearch && matchCat;
  });

  const navItems = [
    { key: "inicio",        iconD: icons.home,     label: "Início" },
    { key: "solucoes",      iconD: icons.grid,     label: "Soluções Adquiridas" },
    { key: "explorar",      iconD: icons.explore,  label: "Explorar Catálogo", href: "/solucoes" },
    { key: "historico",     iconD: icons.history,  label: "Histórico de Compras" },
    { key: "analytics",     iconD: icons.chart,    label: "Analytics" },
    { key: "configuracoes", iconD: icons.settings, label: "Configurações" },
  ];

  /* Reusable acquired solutions grid */
  function SolucoesGrid({ subs, showEmpty = true }) {
    const sorted = [...subs].sort((a, b) => a.status === b.status ? 0 : a.status === "active" ? -1 : 1);
    if (sorted.length === 0 && showEmpty) {
      return (
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>🏢</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 8 }}>Você ainda não adquiriu nenhuma solução.</h2>
          <p style={{ fontSize: 14, color: GRAY_TEXT, marginBottom: 24 }}>Explore o marketplace e encontre ferramentas de IA para seu negócio.</p>
          <a href="/solucoes" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: BLUE, color: "#fff", borderRadius: 12,
            padding: "11px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
            onMouseLeave={e => e.currentTarget.style.background = BLUE}
          >
            Explorar catálogo →
          </a>
        </div>
      );
    }
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(2, 1fr)",
        gap: 20,
      }}>
        {sorted.map(sub => (
          <AcquiredCard key={sub.id} sub={sub}
            onCancel={() => setCancelTarget({ id: sub.id, titulo: sub.solutions?.titulo || "esta solução" })}
            isMobile={isMobile} />
        ))}
      </div>
    );
  }

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
        <div style={{ padding: "22px 20px 18px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="empresa-sidebar" textColor={NEAR_BLACK} />
          </a>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "0 16px 16px" }} />
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem key={item.key} iconD={item.iconD} label={item.label}
              active={activeNav === item.key}
              onClick={item.href ? undefined : () => { setActiveNav(item.key); if (isMobile) setSidebarOpen(false); }}
              href={item.href} />
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "#e0f2fe",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: BLUE,
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: GRAY_TEXT }}>Empresa</div>
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
              <WePromptLogo id="empresa-mobile" textColor={NEAR_BLACK} />
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
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.8px", marginBottom: 6 }}>
                    Olá, {displayName} 👋
                  </h1>
                  <p style={{ fontSize: 15, color: GRAY_TEXT }}>Aqui está o resumo das suas soluções de IA.</p>
                </div>
                <NotificationBell />
              </div>

              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                <KpiCard iconD={icons.grid}    label="Soluções Adquiridas" value={subscriptions.length} sub={`${activeSubs.length} ativas`} />
                <KpiCard iconD={icons.history} label="Créditos Restantes"  value={planName === "Free" ? "Free" : "—"} sub={`Plano ${planName}`} />
                <KpiCard iconD={icons.explore} label="Economia Estimada"   value={savings > 0 ? `R$ ${savings.toFixed(0)}` : "—"} sub={planDiscount > 0 ? `${planDiscount * 100}% de desconto` : "Upgrade para economizar"} />
                <KpiCard iconD={icons.check}   label="Soluções Ativas"     value={activeSubs.length} sub={monthlySpend > 0 ? `R$ ${monthlySpend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês` : "Sem gasto recorrente"} />
              </div>

              {/* Acquired solutions */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px", marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Soluções Adquiridas</div>
                  <button onClick={() => setActiveNav("solucoes")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: BLUE, fontWeight: 600, fontFamily: "inherit",
                  }}>Ver todas →</button>
                </div>
                <SolucoesGrid subs={subscriptions.slice(0, 4)} />
              </div>

              {/* Current plan */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px", marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK, marginBottom: 12 }}>Plano atual</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{
                        background: planName === "Free" ? BG_GRAY : BLUE,
                        color: planName === "Free" ? NEAR_BLACK : "#fff",
                        fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
                      }}>{planName}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(planName === "Free"
                        ? ["Acesso ao catálogo completo", "Compra avulsa de soluções", "Suporte via e-mail"]
                        : ["10% de desconto em todas as soluções", "Suporte prioritário em PT-BR", "Curadoria personalizada mensal"]
                      ).map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: GRAY_TEXT }}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" fill="rgba(3,105,161,0.1)" />
                            <path d="M5 8l2 2 4-4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  {planName === "Free" && (
                    <a href="/precos" style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: BLUE, color: "#fff", borderRadius: 12, padding: "10px 20px",
                      fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "background 0.15s",
                      flexShrink: 0,
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                      onMouseLeave={e => e.currentTarget.style.background = BLUE}
                    >
                      Fazer upgrade →
                    </a>
                  )}
                </div>
              </div>

              {/* Recent purchases table */}
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NEAR_BLACK }}>Compras recentes</div>
                  <button onClick={() => setActiveNav("historico")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: BLUE, fontWeight: 600, fontFamily: "inherit",
                  }}>Ver histórico →</button>
                </div>
                {subscriptions.length === 0 ? (
                  <div style={{ padding: "40px 24px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
                    Nenhuma compra registrada ainda.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: BG_GRAY }}>
                          {["Data", "Solução", "Valor", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: GRAY_TEXT, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.slice(0, 5).map((sub, i) => (
                          <tr key={sub.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: GRAY_TEXT, whiteSpace: "nowrap" }}>
                              {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: NEAR_BLACK }}>
                              {sub.solutions?.titulo || "—"}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: NEAR_BLACK, whiteSpace: "nowrap" }}>
                              {sub.solutions?.preco != null
                                ? `R$ ${Number(sub.solutions.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                : "Grátis"}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                display: "inline-block",
                                background: sub.status === "active" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                                border: `1px solid ${sub.status === "active" ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)"}`,
                                color: sub.status === "active" ? "#15803D" : "#B91C1C",
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                              }}>
                                {sub.status === "active" ? "Pago" : "Cancelado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── TAB: SOLUÇÕES ADQUIRIDAS ── */}
          {activeNav === "solucoes" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Soluções Adquiridas</h1>
                <p style={{ fontSize: 14, color: GRAY_TEXT }}>Todas as soluções de IA que sua empresa utiliza.</p>
              </div>

              {/* Search + filter */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: GRAY_TEXT, pointerEvents: "none" }}>
                    <Icon d={icons.search} size={16} />
                  </div>
                  <input
                    type="text" placeholder="Buscar soluções…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12,
                      border: `1px solid ${BORDER}`, fontSize: 14, color: NEAR_BLACK,
                      background: "#fff", outline: "none", boxSizing: "border-box",
                      fontFamily: "inherit", transition: "border-color 0.15s",
                    }}
                    onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["all", ...allCategories].map(cat => (
                    <button key={cat} onClick={() => setFilterCategoria(cat)} style={{
                      padding: "10px 18px", borderRadius: 999, border: "none",
                      background: filterCategoria === cat ? BLUE : "#fff",
                      color: filterCategoria === cat ? "#fff" : GRAY_TEXT,
                      fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "background 0.15s, color 0.15s",
                    }}>
                      {cat === "all" ? "Todas" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <SolucoesGrid subs={filteredSubs} />
            </>
          )}

          {/* ── TAB: EXPLORAR CATÁLOGO ── */}
          {activeNav === "explorar" && (
            <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "64px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>🔍</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 12 }}>Explorar Catálogo</h2>
              <p style={{ fontSize: 15, color: GRAY_TEXT, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.65 }}>
                Descubra centenas de soluções de IA prontas para transformar os processos da sua empresa.
              </p>
              <a href="/solucoes" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: BLUE, color: "#fff", borderRadius: 12,
                padding: "14px 32px", fontSize: 15, fontWeight: 700, textDecoration: "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#0284C7"}
                onMouseLeave={e => e.currentTarget.style.background = BLUE}
              >
                Ir para o catálogo →
              </a>
            </div>
          )}

          {/* ── TAB: HISTÓRICO DE COMPRAS ── */}
          {activeNav === "historico" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Histórico de Compras</h1>
                <p style={{ fontSize: 14, color: GRAY_TEXT }}>Todas as transações da sua conta empresa.</p>
              </div>

              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 20 }}>
                {subscriptions.length === 0 ? (
                  <div style={{ padding: "60px 32px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>📋</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: NEAR_BLACK, marginBottom: 6 }}>Nenhuma compra ainda</div>
                    <div style={{ fontSize: 14, color: GRAY_TEXT }}>Suas compras aparecerão aqui após adquirir soluções.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: BG_GRAY }}>
                          {["Data", "Solução", "Criador", "Valor", "Status"].map(h => (
                            <th key={h} style={{ padding: "14px 16px", fontSize: 12, fontWeight: 600, color: GRAY_TEXT, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((sub, i) => (
                          <tr key={sub.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: GRAY_TEXT, whiteSpace: "nowrap" }}>
                              {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: NEAR_BLACK, maxWidth: 200 }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {sub.solutions?.titulo || "—"}
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: GRAY_TEXT }}>
                              {sub.solutions?.creator_id ? "Criador" : "—"}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: NEAR_BLACK, whiteSpace: "nowrap" }}>
                              {sub.solutions?.preco != null
                                ? `R$ ${Number(sub.solutions.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                : "Grátis"}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                display: "inline-block",
                                background: sub.status === "active" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                                border: `1px solid ${sub.status === "active" ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)"}`,
                                color: sub.status === "active" ? "#15803D" : "#B91C1C",
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                              }}>
                                {sub.status === "active" ? "Pago" : "Cancelado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary */}
              {subscriptions.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: GRAY_TEXT }}>Total investido (assinaturas ativas)</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: BLUE }}>
                      {monthlySpend > 0
                        ? `R$ ${monthlySpend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`
                        : "R$ 0,00"}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── TAB: ANALYTICS ── */}
          {activeNav === "analytics" && (
            <AnalyticsEmpresaTab subscriptions={subscriptions} isMobile={isMobile} />
          )}

          {/* ── TAB: CONFIGURAÇÕES ── */}
          {activeNav === "configuracoes" && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: NEAR_BLACK, letterSpacing: "-0.5px", marginBottom: 4 }}>Configurações</h1>
                <p style={{ fontSize: 14, color: GRAY_TEXT }}>Gerencie o perfil, plano e preferências da sua empresa.</p>
              </div>
              <SettingsEmpresa user={user} profile={profile} isMobile={isMobile} onProfileUpdate={setProfile} />
            </>
          )}

        </div>
      </main>

      {cancelTarget && (
        <CancelDialog
          solution={cancelTarget.titulo}
          onConfirm={() => handleCancel(cancelTarget.id)}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}
