"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import NavbarDashboard from "../../components/NavbarDashboard";

const TABS = [
  { label: "Início",               key: "inicio"        },
  { label: "Soluções Adquiridas",  key: "solucoes"      },
  { label: "Explorar Catálogo",    key: "catalogo"      },
  { label: "Histórico de Compras", key: "historico"     },
  { label: "Configurações",        key: "configuracoes" },
  { label: "Analytics",            key: "analytics"     },
];

const PLAN_FEATURES = [
  "Acesso ao catálogo completo",
  "Compra avulsa de soluções",
  "Suporte via e-mail",
];

const fmtBRL = v =>
  `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function MetricCard({ iconBg, icon, label, value, sub, subColor }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 999, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

export default function EmpresaDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inicio');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("usuário");
  const [userId, setUserId] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  /* perfil */
  const [profNome, setProfNome] = useState("");
  const [profCidade, setProfCidade] = useState("");
  const [profAvatarUrl, setProfAvatarUrl] = useState("");
  const [profAvatarFile, setProfAvatarFile] = useState(null);
  const [profAvatarPreview, setProfAvatarPreview] = useState("");
  const [profSaving, setProfSaving] = useState(false);
  const [profSaveOk, setProfSaveOk] = useState(false);
  const [profSaveErr, setProfSaveErr] = useState("");

  /* review modal */
  const [reviewModal,   setReviewModal]   = useState(null);
  const [reviewRating,  setReviewRating]  = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewedIds,   setReviewedIds]   = useState(new Set());

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const uid = session.user.id;
      setUserId(uid);

      // RLS note — run once in Supabase SQL Editor if subscriptions return empty:
      // CREATE POLICY "Empresas can read own subscriptions" ON subscriptions
      //   FOR SELECT USING (auth.uid() = business_id);
      try {
        const [profileRes, subsRes] = await Promise.all([
          supabase.from("profiles").select("nome, cidade, avatar_url").eq("id", uid).single(),
          supabase.from("subscriptions")
            .select("id, status, created_at, solutions(id, titulo, categoria, preco, access_url, creator_id, tipo)")
            .eq("business_id", uid)   // fixed: was incorrectly "user_id"
            .eq("status", "active")
            .order("created_at", { ascending: false }),
        ]);

        if (profileRes.data?.nome) setUserName(profileRes.data.nome);
        setProfNome(profileRes.data?.nome || "");
        setProfCidade(profileRes.data?.cidade || "");
        setProfAvatarUrl(profileRes.data?.avatar_url || "");
        setSubscriptions(subsRes.data || []);
      } catch {
        setError("Não foi possível carregar os dados. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function submitReview() {
    if (!reviewModal || !reviewRating) return;
    setReviewLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("reviews").insert({
      reviewer_id:  session.user.id,
      creator_id:   reviewModal.creator_id,
      solution_id:  reviewModal.solution_id,
      rating:       reviewRating,
      comment:      reviewComment.trim() || null,
    });
    setReviewedIds(prev => new Set([...prev, reviewModal.sub_id]));
    setReviewModal(null);
    setReviewRating(5);
    setReviewComment("");
    setReviewLoading(false);
  }

  const totalInvestment = subscriptions.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);
  const firstName = userName.split(" ")[0];
  const initials = userName?.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "E";

  async function handleSavePerfilEmpresa() {
    if (!userId) return;
    setProfSaving(true);
    setProfSaveOk(false);
    setProfSaveErr("");
    try {
      let avatarUrl = profAvatarUrl;
      if (profAvatarFile) {
        const ext = profAvatarFile.name.split(".").pop();
        const path = `${userId}/avatar.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, profAvatarFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = publicUrl;
        setProfAvatarUrl(publicUrl);
        setProfAvatarFile(null);
      }
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ nome: profNome.trim(), cidade: profCidade.trim(), avatar_url: avatarUrl })
        .eq("id", userId);
      if (updateErr) throw updateErr;
      setUserName(profNome.trim());
      setProfSaveOk(true);
      setTimeout(() => setProfSaveOk(false), 4000);
    } catch {
      setProfSaveErr("Erro ao salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setProfSaving(false);
    }
  }

  if (loading) {
    const sk = (h = 72) => ({
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
          <div style={{ ...sk(28), width: 220, marginBottom: 28, borderRadius: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24, maxWidth: 620 }}>
            <div style={sk(80)} />
            <div style={sk(80)} />
          </div>
          <div style={sk(240)} />
        </div>
      </div>
    );
  }

  const MONTHS_PT_E = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const empresaLast6 = Array.from({ length: 6 }, (_, j) => {
    const d = new Date(); d.setMonth(d.getMonth() - 5 + j);
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTHS_PT_E[d.getMonth()] };
  });
  const empresaSubsByMonth = empresaLast6.map(({ year, month }) =>
    subscriptions.filter(s => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === month; }).length
  );
  const empresaMaxByMonth = Math.max(...empresaSubsByMonth, 1);
  const empresaSolUsageMap = subscriptions.reduce((acc, s) => {
    const titulo = s.solutions?.titulo || "—";
    acc[titulo] = (acc[titulo] || 0) + 1;
    return acc;
  }, {});
  const empresaTopSols = Object.entries(empresaSolUsageMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const empresaMaxSolUsage = Math.max(...empresaTopSols.map(([, v]) => v), 1);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <NavbarDashboard onProfileClick={() => setActiveTab("configuracoes")} />
      <style>{`
        .dash-header { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
        @media (min-width: 640px) { .dash-header { flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 0; } }
      `}</style>

      {/* TABS ROW */}
      <div className="scroll-x" style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 16px", display: "flex", gap: 0 }}>
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} onMouseEnter={() => setHoveredTab(tab.key)} onMouseLeave={() => setHoveredTab(null)}
            style={{ fontSize: 14, padding: "14px 0", paddingRight: 20, cursor: "pointer", display: "inline-flex", alignItems: "center", border: "none", borderBottom: activeTab === tab.key ? "2px solid #6366F1" : "2px solid transparent", background: "transparent", color: activeTab === tab.key ? "#6366F1" : hoveredTab === tab.key ? "#374151" : "#6B7280", fontWeight: activeTab === tab.key ? 600 : 400, marginBottom: -1, transition: "color 0.15s ease", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "16px" }}>

        {/* TITLE ROW */}
        <div className="dash-header">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Olá, {firstName}</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
              Aqui está o resumo das suas soluções de IA.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/solucoes" style={{ border: "1.5px solid #6366F1", borderRadius: 999, padding: "12px 18px", minHeight: 44, fontSize: 14, color: "#6366F1", display: "flex", alignItems: "center", gap: 6, background: "transparent", cursor: "pointer", textDecoration: "none" }}>
              Explorar Catálogo ↗
            </a>
            <a href="/solucoes" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white", borderRadius: 999, padding: "12px 20px", minHeight: 44, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", boxShadow: "0 2px 12px rgba(99,102,241,0.3)" }}>
              Adquirir Solução +
            </a>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#B91C1C", marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* ── INÍCIO ── */}
        {activeTab === 'inicio' && <>
        {/* METRICS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24, maxWidth: 620 }}>
          <MetricCard
            iconBg="#6366F1"
            icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
            label="Soluções Adquiridas"
            value={subscriptions.length}
            sub={subscriptions.length === 1 ? "1 ativa" : `${subscriptions.length} ativas`}
          />
          <MetricCard
            iconBg="#6366F1"
            icon={<svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Investimento Total"
            value={fmtBRL(totalInvestment)}
            sub="em soluções de IA"
          />
        </div>

        {/* SOLUÇÕES ADQUIRIDAS */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Soluções Adquiridas</span>
          </div>
          {subscriptions.length === 0 ? (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Você ainda não adquiriu nenhuma solução.</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Explore o catálogo e encontre a ideal para seu negócio.</div>
              <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366F1", color: "white", borderRadius: 8, padding: "12px 20px", minHeight: 44, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Explorar catálogo →</a>
            </div>
          ) : (
            <div className="scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead><tr>{["SOLUÇÃO","CATEGORIA","VALOR","DESDE","AÇÃO","AVALIAR"].map(col => <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>)}</tr></thead>
              <tbody>{subscriptions.map((sub, i) => (
                <tr key={sub.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.titulo || "—"}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.categoria || "—"}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{fmtBRL(sub.solutions?.preco)}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{fmtDate(sub.created_at)}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    {sub.solutions?.tipo === "prompt_pack" || sub.solutions?.tipo === "prompt"
                      ? <a href={`/dashboard/empresa/solucoes/${sub.solutions.id}`} style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver Prompts →</a>
                      : <a href={`/dashboard/empresa/workspace/${sub.solutions?.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, background: "#6366F1", color: "white", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Abrir Workspace →</a>
                    }
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                    {sub.solutions?.creator_id && !reviewedIds.has(sub.id)
                      ? <button onClick={() => setReviewModal({ sub_id: sub.id, creator_id: sub.solutions.creator_id, solution_id: sub.solutions.id, title: sub.solutions.titulo })} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#4338CA", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Avaliar criador</button>
                      : reviewedIds.has(sub.id) ? <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Avaliado</span>
                      : <span style={{ color: "#9ca3af" }}>—</span>
                    }
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>

        {/* PLANO ATUAL */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Plano atual</div>
              <span style={{ display: "inline-block", background: "#f3f4f6", color: "#111827", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999, marginBottom: 12 }}>Free</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PLAN_FEATURES.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(99,102,241,0.1)" /><path d="M5 8l2 2 4-4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <a href="/precos" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366F1", color: "white", borderRadius: 8, padding: "12px 20px", minHeight: 44, fontSize: 14, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"} onMouseLeave={e => e.currentTarget.style.background = "#6366F1"}>
              Fazer upgrade →
            </a>
          </div>
        </div>
        </>}

        {/* ── SOLUÇÕES ADQUIRIDAS ── */}
        {activeTab === 'solucoes' && (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Soluções Adquiridas</span>
              <span style={{ marginLeft: 10, background: "#EEF2FF", color: "#6366F1", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99 }}>{subscriptions.length}</span>
            </div>
            {subscriptions.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nenhuma solução adquirida ainda.</div>
                <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366F1", color: "white", borderRadius: 8, padding: "12px 20px", minHeight: 44, fontSize: 14, fontWeight: 600, textDecoration: "none", marginTop: 12 }}>Explorar catálogo →</a>
              </div>
            ) : (
              <div className="scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead><tr>{["SOLUÇÃO","CATEGORIA","VALOR","DESDE","AÇÃO"].map(col => <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>)}</tr></thead>
                <tbody>{subscriptions.map((sub, i) => (
                  <tr key={sub.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.titulo || "—"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.categoria || "—"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{fmtBRL(sub.solutions?.preco)}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{fmtDate(sub.created_at)}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, borderBottom: "1px solid #f9fafb" }}>
                      {sub.solutions?.tipo === "prompt_pack" || sub.solutions?.tipo === "prompt"
                        ? <a href={`/dashboard/empresa/solucoes/${sub.solutions.id}`} style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver Prompts →</a>
                        : <a href={`/dashboard/empresa/workspace/${sub.solutions?.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, background: "#6366F1", color: "white", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Abrir Workspace →</a>
                      }
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* ── EXPLORAR CATÁLOGO ── */}
        {activeTab === 'catalogo' && (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center" }}>
            <svg width="48" height="48" fill="none" stroke="#6366F1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 16px", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Explore o Catálogo de Soluções</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
              Encontre agentes de IA, prompt packs e automações prontas para transformar seu negócio.
            </div>
            <a href="/solucoes" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6366F1", color: "white", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Abrir catálogo →
            </a>
          </div>
        )}

        {/* ── HISTÓRICO DE COMPRAS ── */}
        {activeTab === 'historico' && (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Histórico de Compras</span>
            </div>
            {subscriptions.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nenhuma compra realizada ainda.</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>Suas aquisições aparecerão aqui.</div>
              </div>
            ) : (
              <div className="scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead><tr>{["DATA","SOLUÇÃO","CATEGORIA","VALOR","STATUS"].map(col => <th key={col} style={{ padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: 0.5 }}>{col}</th>)}</tr></thead>
                <tbody>{[...subscriptions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((sub, i) => (
                  <tr key={sub.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ background: hoveredRow === i ? "#f8faff" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{fmtDate(sub.created_at)}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", fontWeight: 500, borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.titulo || "—"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{sub.solutions?.categoria || "—"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f9fafb" }}>{fmtBRL(sub.solutions?.preco)}</td>
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #f9fafb" }}>
                      <span style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>Ativa</span>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* ── CONFIGURAÇÕES ── */}
        {activeTab === 'configuracoes' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Configurações</h1>
              <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Gerencie o perfil da sua empresa.</p>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 32, maxWidth: 560, boxSizing: "border-box" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Perfil da Empresa</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Foto/logo */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Foto / Logo da empresa</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden", background: "#f3f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e5e7eb" }}>
                      {(profAvatarPreview || profAvatarUrl) ? (
                        <img src={profAvatarPreview || profAvatarUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                      ) : (
                        <span style={{ fontSize: 24, fontWeight: 700, color: "#9ca3af" }}>{initials}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="empresa-avatar-upload" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f3f4f6", color: "#374151", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid #e5e7eb", minHeight: 40 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        {profAvatarFile ? "Trocar imagem" : "Enviar imagem"}
                      </label>
                      <input id="empresa-avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setProfAvatarFile(file);
                        setProfAvatarPreview(URL.createObjectURL(file));
                      }} />
                      {profAvatarFile && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{profAvatarFile.name}</div>}
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>JPG, PNG ou WebP. Máx. 2MB.</div>
                    </div>
                  </div>
                </div>

                {/* Nome da empresa */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nome da empresa</label>
                  <input
                    type="text"
                    value={profNome}
                    onChange={e => setProfNome(e.target.value)}
                    placeholder="Nome da sua empresa"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", minHeight: 44, outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "#6366F1"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Cidade</label>
                  <input
                    type="text"
                    value={profCidade}
                    onChange={e => setProfCidade(e.target.value)}
                    placeholder="Ex: Belo Horizonte, MG"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", minHeight: 44, outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "#6366F1"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Plano */}
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Plano atual</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                    <span style={{ fontSize: 14, color: "#111827", fontWeight: 600 }}>Free</span>
                    <a href="/precos" style={{ fontSize: 13, color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>Fazer upgrade →</a>
                  </div>
                </div>

                {/* Feedback */}
                {profSaveOk && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.2)" /><path d="M7 12l3 3 7-7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>Perfil atualizado com sucesso!</span>
                  </div>
                )}
                {profSaveErr && (
                  <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, fontSize: 14, color: "#B91C1C" }}>
                    {profSaveErr}
                  </div>
                )}

                {/* Salvar */}
                <button
                  onClick={handleSavePerfilEmpresa}
                  disabled={profSaving}
                  style={{ background: profSaving ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white", borderRadius: 999, padding: "12px 20px", minHeight: 44, fontSize: 14, fontWeight: 600, border: "none", cursor: profSaving ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: profSaving ? "none" : "0 2px 12px rgba(99,102,241,0.3)", transition: "opacity 0.15s" }}
                >
                  {profSaving ? "Salvando…" : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Analytics</h1>
              <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Uso e impacto das suas soluções de IA</p>
            </div>

            {subscriptions.length === 0 ? (
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  Ative sua primeira solução para ver métricas de uso aqui.
                </div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>As métricas aparecerão após você adquirir e usar soluções.</div>
              </div>
            ) : (
              <>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Soluções mais usadas</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>Por número de licenças ativas</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                    {empresaTopSols.map(([titulo, count], i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, minHeight: 14 }}>{count}</div>
                        <div style={{ width: "100%", background: "#6366F1", borderRadius: 4, height: Math.max((count / empresaMaxSolUsage) * 72, 4) }} />
                        <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%", textAlign: "center" }}>
                          {titulo.length > 12 ? titulo.slice(0, 11) + "…" : titulo}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Uso ao longo do tempo</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>Aquisições por mês (últimos 6 meses)</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                    {empresaSubsByMonth.map((v, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, minHeight: 14 }}>{v > 0 ? v : ""}</div>
                        <div style={{ width: "100%", background: "#6366F1", borderRadius: 4, height: Math.max((v / empresaMaxByMonth) * 72, v > 0 ? 4 : 0) }} />
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{empresaLast6[i].label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Economia estimada</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>Horas automatizadas pelo uso das soluções</div>
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#6366F1" }}>{subscriptions.length * 5}h</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>estimativa mensal</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>{subscriptions.length}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>processos automatizados</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

      </div>

      {/* ── REVIEW MODAL ── */}
      {reviewModal && (
        <>
          <div onClick={() => setReviewModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440, zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", boxSizing: "border-box" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Avaliar criador</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{reviewModal.title}</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Avaliação</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReviewRating(n)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={n <= reviewRating ? "#f59e0b" : "#e5e7eb"} stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Comentário (opcional)</div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4}
                placeholder="Deixe um comentário sobre o criador..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#111827", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }}
                onFocus={e => (e.target.style.borderColor = "#6366F1")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: "11px 0", borderRadius: 999, border: "1.5px solid #6366F1", background: "transparent", color: "#6366F1", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Cancelar
              </button>
              <button onClick={submitReview} disabled={reviewLoading}
                style={{ flex: 2, padding: "11px 0", borderRadius: 999, border: "none", background: reviewLoading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white", fontSize: 14, fontWeight: 700, cursor: reviewLoading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: reviewLoading ? "none" : "0 2px 12px rgba(99,102,241,0.3)" }}>
                {reviewLoading ? "Enviando…" : "Enviar avaliação"}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
