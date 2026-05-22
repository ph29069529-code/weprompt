"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const LIGHT_BG = "#F7F7FC";
const GREEN = "#16A34A";
const RED = "#DC2626";
const AMBER = "#D97706";

const ADMIN_EMAIL = "ph29069529@gmail.com";

const TABS = [
  { key: "pending",  label: "Pendentes",  color: AMBER },
  { key: "approved", label: "Aprovadas",  color: GREEN },
  { key: "rejected", label: "Reprovadas", color: RED },
];

/* ── Icons ── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  check:  "M20 6L9 17l-5-5",
  x:      "M18 6L6 18M6 6l12 12",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

/* ── Reject dialog ── */
function RejectDialog({ solution, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(10,10,26,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        width: "100%", maxWidth: 460, padding: "32px",
        animation: "modalIn 0.2s ease",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(6px) } to { opacity:1; transform:none } }`}</style>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#FEF2F2", border: "1px solid #FECACA",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, color: RED,
        }}>
          <Icon d={icons.x} size={20} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>
          Reprovar solução
        </h2>
        <p style={{ fontSize: 14, color: GRAY, margin: "0 0 20px" }}>
          <strong style={{ color: DARK }}>{solution.titulo}</strong> — informe o motivo
          da reprovação para o criador.
        </p>
        <textarea
          autoFocus
          rows={4}
          placeholder="Ex: Descrição insuficiente, categoria incorreta, conteúdo inadequado…"
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px",
            borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.12)",
            fontSize: 14, color: DARK, background: "#FAFAFA",
            outline: "none", resize: "vertical", lineHeight: 1.6,
            boxSizing: "border-box", fontFamily: "inherit", marginBottom: 20,
          }}
          onFocus={e => (e.target.style.borderColor = RED)}
          onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 10,
            border: "1.5px solid rgba(0,0,0,0.12)",
            background: "transparent", color: GRAY,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={loading || !reason.trim()} style={{
            padding: "10px 22px", borderRadius: 10,
            background: loading || !reason.trim() ? "#EF8888" : RED,
            color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600,
            cursor: loading || !reason.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}>
            {loading ? "Reprovando…" : "Confirmar reprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Solution row ── */
function SolutionRow({ solution, onApprove, onReject, actionLoading }) {
  const isLoading = actionLoading === solution.id;
  const creatorNome = solution.profiles?.nome || "—";
  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${solution.payment_type === "one_time" ? " único" : "/mês"}`
    : "Gratuito";

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 24px",
      display: "flex", gap: 16,
    }}>
      {/* Cover thumbnail */}
      <div style={{
        width: 88, height: 56, borderRadius: 8, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, rgba(107,92,231,0.1), rgba(56,189,248,0.08))",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {solution.cover_url ? (
          <img src={solution.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 20, opacity: 0.2 }}>✦</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4 }}>
          {solution.titulo}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          <span style={{
            background: `${PURPLE}12`, color: PURPLE,
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
          }}>
            {solution.categoria}
          </span>
          <span style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{priceLabel}</span>
          <span style={{ fontSize: 12, color: GRAY }}>· Criador: {creatorNome}</span>
        </div>
        <p style={{
          fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>
      </div>

      {/* Actions — only for pending */}
      {solution.status === "pending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, justifyContent: "center" }}>
          <button
            onClick={() => onApprove(solution.id)}
            disabled={isLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isLoading ? "#86EFAC" : GREEN, color: "#fff",
              border: "none", borderRadius: 8, padding: "8px 16px",
              fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#15803D"; }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = GREEN; }}
          >
            <Icon d={icons.check} size={14} /> Aprovar
          </button>
          <button
            onClick={() => onReject(solution)}
            disabled={isLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", color: RED,
              border: `1.5px solid rgba(220,38,38,0.25)`,
              borderRadius: 8, padding: "7px 16px",
              fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)"; } }}
            onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.25)"; } }}
          >
            <Icon d={icons.x} size={14} /> Reprovar
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      if (session.user.email !== ADMIN_EMAIL) { router.replace("/"); return; }

      const { data } = await supabase
        .from("solutions")
        .select("*, profiles:creator_id(nome)")
        .order("created_at", { ascending: false });

      if (data) setSolutions(data);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleApprove(id) {
    setActionLoading(id);
    await supabase.from("solutions").update({ status: "approved" }).eq("id", id);
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s));
    setActionLoading(null);
  }

  async function handleReject(solution) {
    setRejectTarget(solution);
  }

  async function confirmReject(reason) {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    await supabase
      .from("solutions")
      .update({ status: "rejected" })
      .eq("id", rejectTarget.id);
    setSolutions(prev => prev.map(s =>
      s.id === rejectTarget.id ? { ...s, status: "rejected" } : s
    ));
    setActionLoading(null);
    setRejectTarget(null);
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  const filtered = solutions.filter(s => s.status === activeTab);

  const counts = {
    pending:  solutions.filter(s => s.status === "pending").length,
    approved: solutions.filter(s => s.status === "approved").length,
    rejected: solutions.filter(s => s.status === "rejected").length,
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: LIGHT_BG,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="admin-loading" textColor={DARK} />
          <div style={{ fontSize: 13, color: GRAY, marginTop: 16 }}>Carregando painel…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "'DM Sans', sans-serif",
      background: LIGHT_BG, color: DARK,
    }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0,
      }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="admin-sidebar" textColor={DARK} />
          </a>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 16px 12px" }} />

        <div style={{ padding: "4px 16px 0" }}>
          <div style={{
            padding: "10px 12px", borderRadius: 8,
            background: `${PURPLE}10`, color: PURPLE,
            fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            Curadoria
          </div>

          <div style={{ marginTop: 20, padding: "0 4px" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: activeTab === tab.key ? `${PURPLE}10` : "transparent",
                color: activeTab === tab.key ? PURPLE : "#374151",
                fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 500,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
              }}>
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? PURPLE : "rgba(0,0,0,0.08)",
                  color: activeTab === tab.key ? "#fff" : GRAY,
                  fontSize: 11, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 99,
                  minWidth: 20, textAlign: "center",
                }}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: "16px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: 12, color: GRAY, fontWeight: 500, padding: "4px 12px 8px" }}>
            Admin · {ADMIN_EMAIL}
          </div>
          <button onClick={handleSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: "transparent", color: RED,
            fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>

          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
              {TABS.find(t => t.key === activeTab)?.label}
            </h1>
            <p style={{ fontSize: 14, color: GRAY, margin: "4px 0 0" }}>
              {activeTab === "pending"
                ? "Soluções aguardando sua análise."
                : activeTab === "approved"
                ? "Soluções publicadas no marketplace."
                : "Soluções reprovadas."}
            </p>
          </div>

          {/* Solution list */}
          {filtered.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "60px 32px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>
                {activeTab === "pending" ? "✦" : activeTab === "approved" ? "✓" : "×"}
              </div>
              <p style={{ fontSize: 15, color: GRAY, margin: 0 }}>
                {activeTab === "pending"
                  ? "Nenhuma solução pendente no momento."
                  : activeTab === "approved"
                  ? "Nenhuma solução aprovada ainda."
                  : "Nenhuma solução reprovada."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(s => (
                <SolutionRow
                  key={s.id}
                  solution={s}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── REJECT DIALOG ── */}
      {rejectTarget && (
        <RejectDialog
          solution={rejectTarget}
          onConfirm={confirmReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
