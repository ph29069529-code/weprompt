"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const BLUE   = "#6366F1";
const NEAR_BLACK = "#1D1D1F";
const GRAY   = "#6B7280";
const BORDER = "#E5E7EB";
const DANGER = "#DC2626";
const GREEN  = "#6366F1";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(name) {
  if (!name) return "?";
  const p = name.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0].slice(0, 2).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    pending:  { label: "Pendente",  bg: "rgba(217,119,6,0.1)",  color: "#B45309" },
    approved: { label: "Ativa",     bg: "rgba(99,102,241,0.1)", color: BLUE },
    rejected: { label: "Reprovada", bg: "rgba(220,38,38,0.1)",  color: DANGER },
    paused:   { label: "Pausada",   bg: "rgba(107,114,128,0.1)",color: "#4B5563" },
    criador:  { label: "Criador",   bg: "#EEF2FF",              color: BLUE },
    creator:  { label: "Criador",   bg: "#EEF2FF",              color: BLUE },
    empresa:  { label: "Empresa",   bg: "#EEF2FF",              color: BLUE },
    business: { label: "Empresa",   bg: "#EEF2FF",              color: BLUE },
    admin:    { label: "Admin",     bg: "rgba(220,38,38,0.1)",  color: DANGER },
    ativo:    { label: "Ativo",     bg: "rgba(99,102,241,0.1)", color: BLUE },
  };
  const s = map[status] || { label: status || "—", bg: "rgba(0,0,0,0.07)", color: GRAY };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

/* ── Dashboard Tab ── */
function DashboardContent({ solutions, profiles }) {
  const pending    = solutions.filter(s => s.status === "pending");
  const criadores  = profiles.filter(p => p.role === "criador" || p.role === "creator");
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const novosEssaSemana = profiles.filter(p => new Date(p.created_at) > sevenDaysAgo).length;

  const metrics = [
    { label: "Aguardando Revisão", value: String(pending.length), sub: "soluções pendentes de aprovação" },
    { label: "Total de Usuários",  value: String(profiles.length), sub: `${criadores.length} criadores` },
    { label: "Novos Usuários",     value: String(novosEssaSemana), sub: "últimos 7 dias" },
    { label: "Soluções Ativas",    value: String(solutions.filter(s => s.status === "approved").length), sub: `de ${solutions.length} no total` },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: "white", borderRadius: 12, padding: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 12, color: GRAY, fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: NEAR_BLACK, marginTop: 6, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${BORDER}` }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 600, color: NEAR_BLACK }}>
          Aprovações Pendentes
          {pending.length > 0 && (
            <span style={{ marginLeft: 8, background: "rgba(217,119,6,0.1)", color: "#B45309", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: GRAY }}>Nenhuma solução aguardando análise.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Criador", "Categoria", "Data"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontWeight: 600, color: GRAY, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.slice(0, 8).map((s, i) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 20px", color: NEAR_BLACK, fontWeight: 500 }}>{s.titulo || s.nome || "—"}</td>
                    <td style={{ padding: "12px 20px", color: GRAY }}>{s.profiles?.nome || "—"}</td>
                    <td style={{ padding: "12px 20px", color: GRAY }}>{s.categoria || "—"}</td>
                    <td style={{ padding: "12px 20px", color: GRAY, whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
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

/* ── Soluções Tab ── */
function SolucoesContent({ solutions, onApprove, onReject, actionLoading }) {
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const statusMap = { todas: null, pendentes: "pending", ativas: "approved", reprovadas: "rejected" };
  const filtered = solutions.filter(s => {
    const matchStatus = !statusMap[filter] || s.status === statusMap[filter];
    const matchSearch = !search || (s.titulo || s.nome || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function submitReject(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["todas","Todas"],["pendentes","Pendentes"],["ativas","Ativas"],["reprovadas","Reprovadas"]].map(([k, lbl]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ padding: "6px 16px", borderRadius: 99, border: "none", background: filter === k ? BLUE : "white", color: filter === k ? "white" : GRAY, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              {lbl}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Buscar solução…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, outline: "none" }} />
      </div>

      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: GRAY }}>Nenhuma solução encontrada.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Solução", "Criador", "Categoria", "Preço", "Status", "Ações"].map(h => (
                    <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontWeight: 600, color: GRAY, whiteSpace: "nowrap" }}>{h}</th>
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
                        <td style={{ padding: "12px 20px", fontWeight: 500, color: NEAR_BLACK }}>{s.titulo || s.nome || "—"}</td>
                        <td style={{ padding: "12px 20px", color: GRAY }}>{s.profiles?.nome || "—"}</td>
                        <td style={{ padding: "12px 20px", color: GRAY }}>{s.categoria || "—"}</td>
                        <td style={{ padding: "12px 20px", fontWeight: 600, color: NEAR_BLACK }}>
                          {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                        </td>
                        <td style={{ padding: "12px 20px" }}><StatusBadge status={s.status} /></td>
                        <td style={{ padding: "12px 20px" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {s.status === "pending" && (
                              <>
                                <button onClick={() => { if (!isLoading) onApprove(s.id); }} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(99,102,241,0.1)", color: BLUE, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}>Aprovar</button>
                                <button onClick={() => { if (!isLoading) { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); } }} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: isRejecting ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.1)", color: DANGER, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}>Reprovar</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isRejecting && (
                        <tr>
                          <td colSpan={6} style={{ padding: "0 20px 12px", background: "rgba(220,38,38,0.02)" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
                              <input autoFocus placeholder="Motivo da reprovação…" value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") submitReject(s); if (e.key === "Escape") { setRejectingId(null); setRejectReason(""); } }}
                                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 13, outline: "none" }} />
                              <button onClick={() => submitReject(s)} disabled={!rejectReason.trim() || rejectLoading} style={{ padding: "8px 14px", borderRadius: 8, background: !rejectReason.trim() ? "rgba(220,38,38,0.3)" : DANGER, color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() ? "not-allowed" : "pointer" }}>
                                {rejectLoading ? "…" : "Confirmar"}
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: GRAY, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
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

/* ── Usuários Tab ── */
function UsuariosContent({ profiles }) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  const filtered = profiles.filter(p => {
    const r = p.role;
    const matchRole =
      filterRole === "todos" ||
      (filterRole === "criadores" && (r === "criador" || r === "creator")) ||
      (filterRole === "empresas"  && (r === "empresa" || r === "business"));
    const matchSearch = !search || p.nome?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["todos","Todos"],["criadores","Criadores"],["empresas","Empresas"]].map(([k, lbl]) => (
            <button key={k} onClick={() => setFilterRole(k)} style={{ padding: "6px 16px", borderRadius: 99, border: "none", background: filterRole === k ? BLUE : "white", color: filterRole === k ? "white" : GRAY, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              {lbl}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Buscar usuário…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${BORDER}`, fontSize: 13, color: NEAR_BLACK, outline: "none" }} />
      </div>

      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: GRAY }}>Nenhum usuário encontrado.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Usuário", "Email", "Tipo", "Cadastro"].map(h => (
                    <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontWeight: 600, color: GRAY, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                          {initials(p.nome)}
                        </div>
                        <span style={{ fontWeight: 600, color: NEAR_BLACK }}>{p.nome || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", color: GRAY }}>{p.email || "—"}</td>
                    <td style={{ padding: "12px 20px" }}><StatusBadge status={p.role} /></td>
                    <td style={{ padding: "12px 20px", color: GRAY, whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</td>
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

/* ── Solicitações Tab ── */
function SolicitacoesContent({ solutions, onApprove, onReject, actionLoading }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const pending = solutions.filter(s => s.status === "pending");

  async function submitReject(s) {
    if (!rejectReason.trim()) return;
    setRejectLoading(true);
    await onReject(s, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setRejectLoading(false);
  }

  if (pending.length === 0) {
    return (
      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${BORDER}`, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8 }}>Nenhuma solicitação pendente.</div>
        <div style={{ fontSize: 14, color: GRAY }}>Novas soluções submetidas pelos criadores aparecerão aqui.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: NEAR_BLACK }}>Soluções aguardando análise</div>
          <span style={{ background: "rgba(217,119,6,0.1)", color: "#B45309", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>
            {pending.length} pendente{pending.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Solução", "Criador", "Categoria", "Preço", "Enviada em", "Ações"].map(h => (
                  <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontWeight: 600, color: GRAY, whiteSpace: "nowrap" }}>{h}</th>
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
                      <td style={{ padding: "12px 20px", fontWeight: 500, color: NEAR_BLACK }}>{s.titulo || s.nome || "—"}</td>
                      <td style={{ padding: "12px 20px", color: GRAY }}>{s.profiles?.nome || "—"}</td>
                      <td style={{ padding: "12px 20px", color: GRAY }}>{s.categoria || "—"}</td>
                      <td style={{ padding: "12px 20px", fontWeight: 600, color: NEAR_BLACK }}>
                        {s.preco != null ? `R$ ${Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
                      </td>
                      <td style={{ padding: "12px 20px", color: GRAY, whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => { if (!isLoading) onApprove(s.id); }} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "rgba(99,102,241,0.1)", color: BLUE, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}>Aprovar</button>
                          <button onClick={() => { if (!isLoading) { setRejectingId(isRejecting ? null : s.id); setRejectReason(""); } }} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: isRejecting ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.1)", color: DANGER, fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}>Reprovar</button>
                        </div>
                      </td>
                    </tr>
                    {isRejecting && (
                      <tr>
                        <td colSpan={6} style={{ padding: "0 20px 12px", background: "rgba(220,38,38,0.02)" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
                            <input autoFocus placeholder="Motivo da reprovação…" value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") submitReject(s); if (e.key === "Escape") { setRejectingId(null); setRejectReason(""); } }}
                              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid rgba(220,38,38,0.35)`, fontSize: 13, outline: "none" }} />
                            <button onClick={() => submitReject(s)} disabled={!rejectReason.trim() || rejectLoading} style={{ padding: "8px 14px", borderRadius: 8, background: !rejectReason.trim() ? "rgba(220,38,38,0.3)" : DANGER, color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: !rejectReason.trim() ? "not-allowed" : "pointer" }}>
                              {rejectLoading ? "…" : "Confirmar"}
                            </button>
                            <button onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: GRAY, border: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
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
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MAIN PAGE
══════════════════════════════ */
const TABS = [
  { key: "dashboard",    label: "Dashboard" },
  { key: "solucoes",     label: "Soluções" },
  { key: "usuarios",     label: "Usuários" },
  { key: "solicitacoes", label: "Solicitações" },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [solutions, setSolutions]         = useState([]);
  const [profiles, setProfiles]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast]                 = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (!prof || prof.role !== "admin") { router.replace("/"); return; }

      const [solRes, profRes] = await Promise.all([
        supabase.from("solutions").select("*, profiles:creator_id(nome)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      if (solRes.data)  setSolutions(solRes.data);
      if (profRes.data) setProfiles(profRes.data);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [router]);

  async function handleApprove(id) {
    setActionLoading(id);
    await supabase.from("solutions").update({ status: "approved" }).eq("id", id);
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s));
    setActionLoading(null);
    setToast("Solução aprovada!");
    setTimeout(() => setToast(""), 3000);
  }

  async function handleReject(solution, reason) {
    setActionLoading(solution.id);
    await supabase.from("solutions").update({ status: "rejected", rejection_reason: reason }).eq("id", solution.id);
    setSolutions(prev => prev.map(s => s.id === solution.id ? { ...s, status: "rejected" } : s));
    setActionLoading(null);
    setToast("Solução reprovada.");
    setTimeout(() => setToast(""), 3000);
  }

  const pendingCount = solutions.filter(s => s.status === "pending").length;

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: `1px solid ${BORDER}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <img src="/logo.png" alt="WePrompt" style={{ height: 32 }} />
        <span style={{ background: DANGER, color: "white", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.5px", textTransform: "uppercase" }}>Admin</span>
      </nav>

      {/* TABS */}
      <div style={{ background: "white", borderBottom: `1px solid ${BORDER}`, padding: "0 32px", display: "flex", gap: 0 }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const badge = tab.key === "solucoes" || tab.key === "solicitacoes" ? pendingCount : 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                fontSize: 14, padding: "14px 0", paddingRight: 20,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                border: "none", borderBottom: isActive ? `2px solid ${NEAR_BLACK}` : "2px solid transparent",
                background: "transparent", color: isActive ? NEAR_BLACK : GRAY,
                fontWeight: isActive ? 600 : 400, marginBottom: -1,
                transition: "color 0.15s ease",
              }}
            >
              {tab.label}
              {badge > 0 && (
                <span style={{ background: "rgba(217,119,6,0.1)", color: "#B45309", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "32px", maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: NEAR_BLACK, margin: 0 }}>
            {TABS.find(t => t.key === activeTab)?.label}
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: GRAY }}>Carregando…</div>
        ) : (
          <>
            {activeTab === "dashboard"    && <DashboardContent solutions={solutions} profiles={profiles} />}
            {activeTab === "solucoes"     && <SolucoesContent solutions={solutions} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />}
            {activeTab === "usuarios"     && <UsuariosContent profiles={profiles} />}
            {activeTab === "solicitacoes" && <SolicitacoesContent solutions={solutions} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />}
          </>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: NEAR_BLACK, color: "white", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 500, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
