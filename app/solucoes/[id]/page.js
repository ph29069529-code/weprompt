"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return "https://www.youtube.com/embed/" + ytMatch[1];
  const loomMatch = url.match(/loom\.com\/share\/([^?\s]+)/);
  if (loomMatch) return "https://www.loom.com/embed/" + loomMatch[1];
  return url;
}

const CATEGORY_GRADIENTS = {
  "Agentes de IA":    "linear-gradient(135deg, #1e3a5f, #2563EB)",
  "Marketing IA":     "linear-gradient(135deg, #1e1b4b, #7c3aed)",
  "Automação":        "linear-gradient(135deg, #14532d, #16a34a)",
  "Chatbots":         "linear-gradient(135deg, #1a1a2e, #0891b2)",
  "Análise de Dados": "linear-gradient(135deg, #1e1b4b, #4f46e5)",
  "Copywriting IA":   "linear-gradient(135deg, #1c1917, #b45309)",
  "Integrações":      "linear-gradient(135deg, #1e3a5f, #0369A1)",
  "WhatsApp IA":      "linear-gradient(135deg, #14532d, #25D366)",
};

function initials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function Stars({ rating = 5, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function CheckSVG({ size = 14, color = "#16a34a" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Reviews Tab ── (all Supabase queries preserved exactly) */
function ReviewsTab({ solutionId, user, alreadyOwned }) {
  const [reviews,    setReviews]    = useState([]);
  const [loaded,     setLoaded]     = useState(false);
  const [hoverStar,  setHoverStar]  = useState(0);
  const [selStar,    setSelStar]    = useState(0);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [formError,  setFormError]  = useState("");

  useEffect(() => {
    if (!solutionId) return;
    fetch(`/api/reviews?solution_id=${solutionId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [solutionId]);

  const hasReviewed = user ? reviews.some(r => r.user_id === user.id) : false;
  const avg = reviews.length > 0
    ? reviews.reduce((a, r) => a + (r.rating || 5), 0) / reviews.length
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    n, count: reviews.filter(r => Math.round(r.rating) === n).length,
  }));

  async function handleSubmit() {
    if (!selStar) { setFormError("Selecione uma nota de 1 a 5 estrelas."); return; }
    setSubmitting(true);
    setFormError("");
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session?.access_token}` },
      body: JSON.stringify({ solution_id: solutionId, rating: selStar, comment }),
    });
    const json = await res.json();
    if (!res.ok) { setFormError(json.error || "Erro ao publicar avaliação."); setSubmitting(false); return; }
    setSuccess(true);
    if (json.review) setReviews(prev => [json.review, ...prev]);
    setSubmitting(false);
  }

  if (!loaded) return <div style={{ textAlign: "center", padding: 40, color: "#6b7280", fontSize: 14 }}>Carregando avaliações…</div>;

  return (
    <div>
      {reviews.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 24 }}>
          {/* Rating summary */}
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#111827", lineHeight: 1 }}>{avg.toFixed(1)}</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><Stars rating={avg} size={16} /></div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{reviews.length} avaliações</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {ratingCounts.map(({ n, count }) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, width: 8, flexShrink: 0 }}>{n}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <div style={{ flex: 1, height: 5, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`, height: "100%", background: "#111827", borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7280", width: 16, textAlign: "right", flexShrink: 0 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div>
            {reviews.map((r, i) => (
              <div key={r.id || i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: "#e5e7eb", color: "#374151", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {initials(r.reviewer_name || "U")}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.reviewer_name || "Usuário verificado"}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {new Date(r.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}><Stars rating={r.rating || 5} size={13} /></div>
                {r.comment && <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "8px 0 0" }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
          Ainda não há avaliações para esta solução.
        </div>
      )}

      {/* Review form */}
      <div style={{ borderTop: reviews.length > 0 ? "1px solid #e5e7eb" : "none", paddingTop: reviews.length > 0 ? 24 : 0 }}>
        {!user ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>Faça login para avaliar esta solução.</div>
            <a href={`/login?redirect=/solucoes/${solutionId}`} style={{ color: "#0369A1", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Entrar →</a>
          </div>
        ) : !alreadyOwned ? (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 14, color: "#6b7280" }}>
            Adquira esta solução para deixar uma avaliação.
          </div>
        ) : hasReviewed || success ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.2)" /><path d="M7 12l3 3 7-7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>Você já avaliou esta solução ✓</span>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Deixe sua avaliação</div>
            <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n}
                  onClick={() => setSelStar(n)}
                  onMouseEnter={() => setHoverStar(n)}
                  onMouseLeave={() => setHoverStar(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", fontSize: 32, lineHeight: 1, color: n <= (hoverStar || selStar) ? "#f59e0b" : "#e5e7eb", transition: "color 0.1s" }}>
                  ★
                </button>
              ))}
            </div>
            <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Conte sua experiência com esta solução..."
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", background: "#fff", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, outline: "none" }}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            {formError && <div style={{ fontSize: 13, color: "#dc2626", marginTop: 8 }}>{formError}</div>}
            <button onClick={handleSubmit} disabled={submitting}
              style={{ marginTop: 12, height: 44, padding: "0 24px", borderRadius: 999, border: "none", background: submitting ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: submitting ? "none" : "0 4px 16px rgba(99,102,241,0.35)", transition: "opacity 0.15s" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.opacity = "1"; }}>
              {submitting ? "Publicando…" : "Publicar avaliação"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Related Solutions ── (Supabase query preserved exactly) */
function RelatedSolutions({ categoria, currentId }) {
  const router = useRouter();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!categoria) return;
    supabase
      .from("solutions")
      .select("id, titulo, preco, categoria, cover_url, payment_type")
      .eq("status", "approved")
      .eq("ativo", true)
      .eq("categoria", categoria)
      .neq("id", currentId)
      .limit(3)
      .then(({ data }) => { if (data) setRelated(data); });
  }, [categoria, currentId]);

  if (related.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase" }}>SOLUÇÕES RELACIONADAS</div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {related.map(r => (
          <div key={r.id} onClick={() => router.push(`/solucoes/${r.id}`)}
            style={{ background: "#f9fafb", borderRadius: 10, padding: 12, display: "flex", gap: 10, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: CATEGORY_GRADIENTS[r.categoria] || "linear-gradient(135deg, #1e3a5f, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {r.cover_url
                ? <img src={r.cover_url} alt={r.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, textAlign: "center", padding: 4, lineHeight: 1.2 }}>{r.titulo.slice(0, 20)}</span>}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.titulo}</div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
                {r.preco != null ? `R$ ${Number(r.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Grátis"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div className="sk-sol-wrap" style={{ animation: "shimmer 1.5s ease-in-out infinite" }}>
      <style>{`
        .sk-sol-wrap { padding: 24px 16px; }
        @media (min-width: 768px) { .sk-sol-wrap { padding: 24px 48px; } }
        .sk-sol-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        @media (min-width: 768px) { .sk-sol-grid { grid-template-columns: 1fr 420px; } }
      `}</style>
      <div className="sk-sol-grid">
        <div>
          <div style={{ width: 220, height: 12, borderRadius: 4, background: "#e5e7eb", marginBottom: 20 }} />
          <div style={{ width: 90, height: 22, borderRadius: 99, background: "#e5e7eb", marginBottom: 14 }} />
          <div style={{ width: "75%", height: 44, borderRadius: 8, background: "#e5e7eb", marginBottom: 14 }} />
          <div style={{ width: "50%", height: 14, borderRadius: 4, background: "#e5e7eb", marginBottom: 20 }} />
          <div style={{ width: "100%", height: 460, borderRadius: 16, background: "#e5e7eb" }} />
        </div>
        <div>
          <div style={{ width: "100%", height: 520, borderRadius: 16, background: "#e5e7eb" }} />
        </div>
      </div>
    </div>
  );
}

/* ── FAQ ── */
const FAQ_ITEMS = [
  { q: "Como acesso a solução após a compra?",     a: "Você recebe acesso imediato por email após a confirmação do pagamento." },
  { q: "Posso pedir reembolso?",                   a: "Sim, oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do valor." },
  { q: "Preciso de conhecimento técnico?",         a: "Não. Todas as soluções são documentadas e prontas para usar." },
  { q: "Como funciona o suporte?",                 a: "O criador oferece suporte direto via plataforma em português." },
  { q: "Posso usar em múltiplos projetos?",        a: "Depende da licença de cada solução. Verifique os detalhes na aba 'O que está incluso'." },
];

function FAQSection() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 32, margin: "32px 16px 0" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Perguntas frequentes</div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i}
          onClick={() => setOpenFaq(openFaq === i ? null : i)}
          style={{ borderBottom: "1px solid #f3f4f6", padding: "16px 0", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{item.q}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"
              style={{ flexShrink: 0, marginLeft: 12, transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {openFaq === i && (
            <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginTop: 10 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}


/* ══════════════════════════════════════════
   SOLUTION DETAIL — all Supabase queries preserved exactly
══════════════════════════════════════════ */
function SolutionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [solution,     setSolution]     = useState(null);
  const [creator,      setCreator]      = useState(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [notFound,     setNotFound]     = useState(false);
  const [user,         setUser]         = useState(null);
  const [activeTab,    setActiveTab]    = useState(0);
  const [shared,       setShared]       = useState(false);
  const [fav,          setFav]          = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  useEffect(() => {
    if (!id) return;
    async function init() {
      const [solRes, sessionRes] = await Promise.all([
        supabase.from("solutions").select("*").eq("id", id).eq("ativo", true).eq("status", "approved").single(),
        supabase.auth.getSession(),
      ]);

      // Auth gate — unauthenticated users are redirected to login
      const sess = sessionRes.data?.session;
      if (!sess) {
        router.replace(`/login?redirect=/solucoes/${id}&msg=ver-solucao`);
        return;
      }

      if (solRes.error || !solRes.data) { setNotFound(true); setLoading(false); return; }

      const sol = solRes.data;
      setSolution(sol);

      if (sess?.user) setUser(sess.user);

      const [creatorRes, ownedRes] = await Promise.all([
        sol.creator_id
          ? supabase.from("profiles").select("id, nome").eq("id", sol.creator_id).single()
          : Promise.resolve({ data: null }),
        sess?.user
          ? supabase.from("subscriptions").select("id").eq("solution_id", id).eq("business_id", sess.user.id).limit(1)
          : Promise.resolve({ data: [] }),
      ]);

      if (creatorRes.data) {
        const { count } = await supabase
          .from("solutions")
          .select("id", { count: "exact", head: true })
          .eq("creator_id", sol.creator_id)
          .eq("status", "approved");
        setCreator({ ...creatorRes.data, solution_count: count || 1 });
      } else if (sol.criador_nome) {
        setCreator({ nome: sol.criador_nome, solution_count: 1 });
      }

      if (ownedRes.data?.length > 0) setAlreadyOwned(true);
      setLoading(false);
    }
    init();
  }, [id]);

  function handleCheckout() {
    if (!user) { window.location.href = `/login?redirect=/checkout/${id}`; return; }
    window.location.href = `/checkout/${id}`;
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: solution.titulo, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, color: "#111827", opacity: 0.15, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Solução não encontrada</h1>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>Esta solução pode ter sido removida ou ainda não está disponível.</p>
        <button onClick={() => router.push("/solucoes")}
          style={{ background: "#111827", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          ← Voltar para soluções
        </button>
      </div>
    );
  }

  if (!solution) return null;

  const gradient  = CATEGORY_GRADIENTS[solution.categoria] || "linear-gradient(135deg, #1e3a5f, #2563EB)";
  const isOneTime = solution.payment_type === "one_time";
  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Gratuito";

  const tabs = [
    "Descrição",
    "Como usar",
    "O que está incluso",
    `Avaliações${(solution.review_count || 0) > 0 ? ` (${solution.review_count})` : ""}`,
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="sol-breadcrumb" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span onClick={() => router.push("/solucoes")} style={{ color: "#6b7280", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.color = "#111827"}
          onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
          Soluções
        </span>
        <span style={{ color: "#d1d5db" }}>→</span>
        <span onClick={() => router.push(`/solucoes?categoria=${encodeURIComponent(solution.categoria || "")}`)}
          style={{ color: "#6b7280", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.color = "#111827"}
          onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
          {solution.categoria}
        </span>
        <span style={{ color: "#d1d5db" }}>→</span>
        <span style={{ color: "#111827", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{solution.titulo}</span>
      </div>

      {/* Two-column layout */}
      <div className="sol-layout" style={{ gap: 32 }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Category + tipo badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "inline-block", background: "#f3f4f6", color: "#374151", borderRadius: 999, fontSize: 12, fontWeight: 600, padding: "3px 10px" }}>
              {solution.categoria}
            </span>
            {solution.tipo === "agente_integracao" ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#EDE9FE", color: "#6D28D9", borderRadius: 999, fontSize: 12, fontWeight: 700, padding: "4px 12px", boxShadow: "0 1px 4px rgba(109,40,217,0.15)" }}>
                ⚡ Agente com Integração
              </span>
            ) : solution.tipo === "prompt_pack" || solution.tipo === "prompt" ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F3E8FF", color: "#7C3AED", borderRadius: 999, fontSize: 12, fontWeight: 700, padding: "3px 10px" }}>
                📄 Prompt Pack
              </span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#EEF2FF", color: "#4338CA", borderRadius: 999, fontSize: 12, fontWeight: 700, padding: "3px 10px" }}>
                🤖 Agente IA
              </span>
            )}
          </div>

          {/* Title + Oficial badge */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: "#0A0F1E", lineHeight: 1.2, margin: 0, letterSpacing: "-0.04em" }}>
              {solution.titulo}
            </h1>
            {solution.creator_id === "00000000-0000-0000-0000-000000000001" && (
              <span style={{
                display: "inline-flex", alignItems: "center", alignSelf: "center",
                fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "white", letterSpacing: "0.05em", whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
              }}>
                ✦ Oficial WePrompt
              </span>
            )}
          </div>

          {/* Creator row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "#f3f4f6", color: "#374151", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {creator ? initials(creator.nome) : "?"}
            </div>
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
              Por {creator?.nome || solution.criador_nome || "—"}
            </span>
            <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontSize: 12, fontWeight: 600, padding: "2px 10px" }}>
              ✓ Criador Verificado
            </span>
            {(solution.review_count || 0) > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Stars rating={solution.avg_rating || 5} size={13} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>({solution.review_count})</span>
              </div>
            )}
          </div>

          {/* Cover image */}
          <div className="sol-cover" style={{ borderRadius: 16, overflow: "hidden", marginTop: 20, width: "100%" }}>
            {solution.cover_url ? (
              <img src={solution.cover_url} alt={solution.titulo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box" }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.4 }}>{solution.titulo}</span>
              </div>
            )}
          </div>

          {/* Tabs row */}
          <div
            className="sol-tabs-row"
            style={{
              display: "flex", gap: 0, borderBottom: "1px solid #e5e7eb",
              marginTop: 28, background: "#fff", borderRadius: "12px 12px 0 0",
              padding: "0 0 0 24px",
              overflowX: "auto", WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none", msOverflowStyle: "none",
            }}
          >
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                fontSize: 14,
                padding: "14px 16px 14px 0",
                marginRight: 8,
                cursor: "pointer",
                border: "none",
                borderBottom: activeTab === i ? "2px solid #6366F1" : "2px solid transparent",
                background: "transparent",
                color: activeTab === i ? "#6366F1" : "#6b7280",
                fontWeight: activeTab === i ? 600 : 400,
                marginBottom: -1,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                flexShrink: 0,
              }}>
                {tab}
              </button>
            ))}
            {/* spacer so last tab isn't clipped on scroll (padding-right doesn't work in WebKit flex scroll) */}
            <div style={{ minWidth: 24, flexShrink: 0 }} />
          </div>

          {/* Tab content */}
          <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", border: "1px solid #e5e7eb", borderTop: "none", padding: 28 }}>

            {/* Tab 0 — Descrição */}
            {activeTab === 0 && (
              <div>
                <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{solution.descricao}</p>

                {/* Como funciona */}
                {solution.como_funciona && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Como funciona</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{solution.como_funciona}</p>
                  </div>
                )}

                {/* Integração — seções específicas para agente_integracao */}
                {solution.tipo === "agente_integracao" && (
                  <>
                    {solution.apps_integrados && (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Apps integrados</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {solution.apps_integrados.split(",").map(app => app.trim()).filter(Boolean).map(app => (
                            <span key={app} style={{ background: "#EDE9FE", color: "#6D28D9", borderRadius: 999, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>{app}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {solution.requisitos_tecnicos && (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Requisitos técnicos</div>
                        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{solution.requisitos_tecnicos}</p>
                      </div>
                    )}
                    {solution.instrucoes_configuracao && (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Como configurar</div>
                        <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 16 }}>
                          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{solution.instrucoes_configuracao}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Ver em ação */}
                {solution.video_demo && getEmbedUrl(solution.video_demo) && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Ver em ação</div>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}>
                      <iframe
                        src={getEmbedUrl(solution.video_demo)}
                        title="Demonstração"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 12 }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 24, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Ideal para</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Pequenas e médias empresas", "Equipes de marketing", "Empreendedores", "Startups"].map(tag => (
                      <span key={tag} style={{ background: "#f3f4f6", color: "#374151", borderRadius: 999, padding: "5px 14px", fontSize: 13, display: "inline-block", marginBottom: 4, maxWidth: "100%", boxSizing: "border-box" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1 — Como usar */}
            {activeTab === 1 && (
              solution.delivery_instructions ? (
                <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{solution.delivery_instructions}</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    "Após a compra, você recebe acesso imediato por e-mail com todas as instruções.",
                    "Faça o download dos arquivos ou acesse os links disponibilizados pelo criador.",
                    "Siga a documentação incluída para configurar a solução no seu ambiente.",
                    "Em caso de dúvidas, acesse o suporte direto com o criador pela plataforma.",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 999, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, paddingTop: 4 }}>{step}</span>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab 2 — O que está incluso */}
            {activeTab === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Acesso imediato após pagamento",
                  solution.delivery_files?.length > 0 ? `${solution.delivery_files.length} arquivo(s) de entrega` : null,
                  solution.delivery_links?.length > 0 ? `${solution.delivery_links.length} link(s) de acesso` : null,
                  "Suporte em português com o criador",
                  "Atualizações futuras da solução",
                  "Reembolso em 7 dias se não funcionar conforme descrito",
                ].filter(Boolean).map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckSVG size={16} color="#16a34a" />
                    <span style={{ fontSize: 14, color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3 — Avaliações */}
            {activeTab === 3 && (
              <ReviewsTab solutionId={id} user={user} alreadyOwned={alreadyOwned} />
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="sol-purchase-card">
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span className="sol-price" style={{ fontWeight: 900, color: "#111827", letterSpacing: "-1.5px", lineHeight: 1 }}>{priceLabel}</span>
              {solution.preco != null && (
                <span style={{ fontSize: 14, color: "#6b7280", marginLeft: 8 }}>{isOneTime ? "pagamento único" : "por mês"}</span>
              )}
            </div>

            {/* CTA */}
            {alreadyOwned ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, marginTop: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(5,150,105,0.2)" /><path d="M7 12l3 3 7-7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>Você já possui esta solução ✓</span>
              </div>
            ) : (
              <button onClick={handleCheckout} disabled={checkoutLoading}
                style={{ width: "100%", background: checkoutLoading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", borderRadius: 999, padding: "14px", fontSize: 16, fontWeight: 700, marginTop: 16, border: "none", cursor: checkoutLoading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: checkoutLoading ? "none" : "0 4px 20px rgba(99,102,241,0.4)", transition: "opacity 0.15s", minHeight: 52 }}
                onMouseEnter={e => { if (!checkoutLoading) e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { if (!checkoutLoading) e.currentTarget.style.opacity = "1"; }}>
                {checkoutLoading ? "Redirecionando…" : solution.preco != null
                  ? (solution.tipo === "prompt_pack" || solution.tipo === "prompt" ? "Adquirir Prompt Pack →" : "Adquirir solução →")
                  : "Começar gratuitamente →"}
              </button>
            )}

            {/* Prompt Pack info box */}
            {(solution.tipo === "prompt_pack" || solution.tipo === "prompt") && !alreadyOwned && (
              <div style={{ marginTop: 12, padding: "12px 14px", background: "#F3E8FF", border: "1px solid #DDD6FE", borderRadius: 10, fontSize: 13, color: "#6D28D9", lineHeight: 1.6 }}>
                📄 Após a compra, você terá acesso imediato ao conteúdo completo dentro da plataforma.
              </div>
            )}

            {/* Secondary buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <button onClick={handleShare}
                style={{ border: "1.5px solid #6366F1", borderRadius: 999, padding: "9px", fontSize: 13, color: "#6366F1", cursor: "pointer", background: "transparent", fontFamily: "inherit", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {shared ? "✓ Copiado!" : "↑ Compartilhar"}
              </button>
              <button onClick={() => setFav(f => !f)}
                style={{ border: `1.5px solid ${fav ? "#f43f5e" : "#6366F1"}`, borderRadius: 999, padding: "9px", fontSize: 13, color: fav ? "#f43f5e" : "#6366F1", cursor: "pointer", background: "transparent", fontFamily: "inherit", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = fav ? "rgba(244,63,94,0.06)" : "rgba(99,102,241,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {fav ? "♥ Favoritado" : "♡ Favoritar"}
              </button>
            </div>

            <div style={{ height: 1, background: "#e5e7eb", margin: "24px 0 0" }} />

            {/* Included */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1 }}>INCLUSO</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Acesso imediato após pagamento", "Suporte em português", "Atualizações incluídas", "Reembolso em 7 dias"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckSVG size={14} color="#16a34a" />
                    <span style={{ fontSize: 13, color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {["💬 Suporte em português", "🛡 Reembolso em 7 dias"].map(b => (
                <span key={b} style={{ background: "#f3f4f6", color: "#374151", borderRadius: 999, padding: "5px 12px", fontSize: 12 }}>{b}</span>
              ))}
            </div>

            <div style={{ height: 1, background: "#e5e7eb", margin: "24px 0 0" }} />

            {/* Creator */}
            {creator && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1 }}>CRIADOR</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, padding: "12px 0" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: "#f3f4f6", color: "#374151", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {initials(creator.nome)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{creator.nome}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{creator.solution_count || 1} soluções publicadas</div>
                  </div>
                </div>
                {solution.creator_id && (
                  <span onClick={() => router.push(`/criadores/${solution.creator_id}`)}
                    style={{ display: "block", marginTop: 10, fontSize: 13, fontWeight: 600, color: "#111827", cursor: "pointer", textDecoration: "underline" }}>
                    Ver perfil do criador →
                  </span>
                )}
              </div>
            )}

            {/* Related solutions */}
            <RelatedSolutions categoria={solution.categoria} currentId={id} />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQSection />
    </div>
  );
}

export default function SolutionPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: "#111827", overflowX: "hidden" }}>
      <Navbar />
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .sol-breadcrumb { padding: 16px; }
        @media (min-width: 768px) { .sol-breadcrumb { padding: 16px 48px; } }
        .sol-layout { display: grid; grid-template-columns: 1fr; gap: 32px; padding: 0 16px; align-items: flex-start; }
        @media (min-width: 768px) { .sol-layout { grid-template-columns: 1fr 420px; padding: 0 48px; } }
        .sol-cover { height: 240px; }
        @media (min-width: 768px) { .sol-cover { height: 460px; } }
        .sol-purchase-card { position: static; }
        @media (min-width: 768px) { .sol-purchase-card { position: sticky; top: 80px; } }
        .sol-price { font-size: 28px; }
        @media (min-width: 768px) { .sol-price { font-size: 42px; } }
        .sol-tabs-row::-webkit-scrollbar { display: none; }
      `}</style>
      <Suspense fallback={<Skeleton />}>
        <SolutionDetail />
      </Suspense>
    </div>
  );
}
