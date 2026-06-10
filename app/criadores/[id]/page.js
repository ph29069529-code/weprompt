"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "../../components/Navbar";

// Single instance — avoids "Multiple GoTrueClient instances" warning
const authClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── MOCK FALLBACK DATA ───────────────────────────────────────────────────────

const GRADIENTS = {
  Automação:    "linear-gradient(135deg, #1e3a5f, #2563EB)",
  Chatbots:     "linear-gradient(135deg, #1a1a2e, #7c3aed)",
  Marketing:    "linear-gradient(135deg, #1e3a5f, #0891b2)",
  Vendas:       "linear-gradient(135deg, #14532d, #16a34a)",
};

const GRADIENT_DEFAULT = "linear-gradient(135deg, #1e3a5f, #2563EB)";

const AVATAR_COLORS = ["#2563EB", "#7c3aed", "#ea580c", "#16a34a", "#0891b2", "#d97706", "#4f46e5", "#dc2626"];

// ─── REPUTATION ──────────────────────────────────────────────────────────────

function getReputationLevel(avgRating, totalSales, totalReviews) {
  const rating = Number(avgRating) || 0;
  const sales  = totalSales || totalReviews || 0;
  if (sales >= 50 && rating >= 4.5) return { label: "Elite WePrompt", icon: "🏆", color: "#F59E0B", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)" };
  if (sales >= 20 && rating >= 4.5) return { label: "Top Criador",    icon: "💎", color: "#6366F1", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.35)"  };
  if (sales >= 10 && rating >= 4.0) return { label: "Estabelecido",   icon: "🥇", color: "#10B981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)" };
  if (sales >= 3  && rating >= 3.5) return { label: "Em Ascensão",    icon: "🥈", color: "#3B82F6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.35)" };
  return                                     { label: "Iniciante",     icon: "🥉", color: "#9CA3AF", bg: "rgba(156,163,175,0.15)",border: "rgba(156,163,175,0.35)" };
}

function getNextLevel(avgRating, totalSales, totalReviews) {
  const rating = Number(avgRating) || 0;
  const sales  = totalSales || totalReviews || 0;
  if (sales >= 50 && rating >= 4.5) return null; // already max
  if (sales >= 20 && rating >= 4.5) return { label: "Elite WePrompt", salesNeeded: 50, salesCurrent: sales };
  if (sales >= 10 && rating >= 4.0) return { label: "Top Criador",    salesNeeded: 20, salesCurrent: sales };
  if (sales >= 3  && rating >= 3.5) return { label: "Estabelecido",   salesNeeded: 10, salesCurrent: sales };
  return                                     { label: "Em Ascensão",   salesNeeded: 3,  salesCurrent: sales };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function parsePrice(str) {
  return parseFloat(str.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
}

function formatPrice(preco) {
  if (preco == null) return "R$ 0,00";
  return "R$ " + Number(preco).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

function formatMemberSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function mapSolution(s) {
  return {
    id: s.slug || String(s.id),
    name: s.titulo || s.name || "Solução",
    category: s.categoria || s.categories?.nome || "Automação",
    price: formatPrice(s.preco),
    sales: s.review_count || 0,
    rating: s.avg_rating ? Number(Number(s.avg_rating).toFixed(1)) : 0,
    reviews: s.review_count || 0,
    badge: (s.review_count || 0) > 20 ? "🏆 Top Seller" : null,
  };
}

function mapReview(r, i) {
  return {
    name: r.reviewer?.nome || r.profiles?.nome || r.nome || "Usuário",
    solution: r.solutions?.titulo || "",
    stars: r.rating || r.nota || 5,
    date: formatDate(r.created_at),
    text: r.comment || r.comentario || r.texto || "",
    helpful: 0,
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  };
}

function Stars({ rating, size = 16 }) {
  const full = Math.floor(rating);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= full ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function Skeleton({ w, h, radius = 8, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "#f3f4f6",
      animation: "pulse 1.5s ease-in-out infinite",
      ...style,
    }} />
  );
}

// ─── SOLUTION CARD ────────────────────────────────────────────────────────────

function SolutionCard({ sol }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white", borderRadius: 20, border: "1px solid #e5e7eb",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{
        height: 160, background: GRADIENTS[sol.category] || GRADIENT_DEFAULT,
        position: "relative", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20,
      }}>
        {sol.badge && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.3)", color: "white",
            fontSize: 11, padding: "4px 10px", borderRadius: 999,
          }}>{sol.badge}</div>
        )}
        <span style={{ color: "white", fontSize: 14, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
          {sol.name}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <span style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "3px 8px" }}>
          {sol.category}
        </span>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 8 }}>{sol.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Stars rating={sol.rating} size={14} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{sol.rating}</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>({sol.reviews} reviews)</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sol.sales} vendas</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginTop: 10 }}>{sol.price}</div>
        <button
          onClick={() => router.push("/solucoes/" + sol.id)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: "100%", background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            color: "white", borderRadius: 999, padding: "10px",
            fontSize: 14, fontWeight: 600, marginTop: 12,
            border: "none", cursor: "pointer", boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
            opacity: btnHovered ? 0.88 : 1, transition: "opacity 0.15s", fontFamily: "inherit",
          }}
        >
          Adquirir Solução →
        </button>
      </div>
    </div>
  );
}

// ─── REVIEW CARD ─────────────────────────────────────────────────────────────

function ReviewCard({ rev, idx, helpfulCounts, setHelpfulCounts }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 999, background: rev.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 16, fontWeight: 700, flexShrink: 0,
          }}>
            {rev.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{rev.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Comprou: {rev.solution}</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{rev.date}</span>
      </div>
      <div style={{ marginTop: 12 }}><Stars rating={rev.stars} size={15} /></div>
      <p style={{ fontSize: 14, color: "#374151", marginTop: 8, lineHeight: 1.6, margin: "8px 0 0" }}>
        {rev.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>Útil?</span>
        <button
          onClick={() => setHelpfulCounts(prev => ({ ...prev, [idx]: (prev[idx] ?? rev.helpful) + 1 }))}
          style={{
            border: "1px solid #e5e7eb", borderRadius: 999, padding: "3px 10px",
            fontSize: 12, color: "#6b7280", cursor: "pointer", background: "none", fontFamily: "inherit",
          }}
        >
          👍 Sim ({helpfulCounts[idx] ?? rev.helpful})
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CriadorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showToast, setShowToast] = useState(false);
  const [sortBy, setSortBy] = useState("sales");
  const [helpfulCounts, setHelpfulCounts] = useState({});

  // Supabase data
  const [creator, setCreator] = useState(null);
  const [dbSolutions, setDbSolutions] = useState(null);
  const [dbReviews, setDbReviews] = useState(null);
  const [dbSalesCount, setDbSalesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Auth — who is viewing this profile
  const [sessionUserId, setSessionUserId] = useState(null);

  // Inline edit mode
  const [editMode,          setEditMode]          = useState(false);
  const [editNome,          setEditNome]          = useState("");
  const [editBio,           setEditBio]           = useState("");
  const [editCidade,        setEditCidade]        = useState("");
  const [editAvatarFile,    setEditAvatarFile]    = useState(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");
  const [editSaving,        setEditSaving]        = useState(false);
  const [editErr,           setEditErr]           = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);

      // 1. Fetch creator profile
      const { data: creatorData, error: creatorError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (creatorError || !creatorData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCreator(creatorData);

      // 2. Fetch solutions
      const { data: solutionsData } = await supabase
        .from("solutions")
        .select("*")
        .eq("creator_id", id)
        .eq("status", "approved")
        .order("review_count", { ascending: false });

      if (solutionsData && solutionsData.length > 0) {
        setDbSolutions(solutionsData);
        // Count real sales (subscriptions) across all creator solutions
        const solIds = solutionsData.map(s => s.id);
        const { count: salesCount } = await supabase
          .from("subscriptions")
          .select("id", { count: "exact", head: true })
          .in("solution_id", solIds);
        setDbSalesCount(salesCount || 0);
      }

      // 3. Fetch reviews for this creator
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, solutions(id, titulo), reviewer:reviewer_id(nome)")
        .eq("creator_id", creatorData.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (reviewsData && reviewsData.length > 0) {
        setDbReviews(reviewsData);
      }

      setLoading(false);
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setSessionUserId(session.user.id);
    });
  }, []);

  const isOwner = sessionUserId === id;

  function enterEditMode() {
    setEditNome(creator?.nome || "");
    setEditBio(creator?.bio || "");
    setEditCidade(creator?.cidade || "");
    setEditAvatarFile(null);
    setEditAvatarPreview("");
    setEditErr("");
    setEditMode(true);
  }

  async function handleEditSave() {
    setEditSaving(true);
    setEditErr("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/login?redirect=/criadores/${id}`);
        return;
      }

      const bearer = `Bearer ${session.access_token}`;

      // Photo upload first — only when a new file was selected
      let avatarUrl = creator?.avatar_url || null;
      if (editAvatarFile) {
        const ext = editAvatarFile.name.split(".").pop();
        const path = session.user.id + "/avatar." + ext;
        // Storage upload via a client that carries the JWT explicitly
        const { createClient } = await import("@supabase/supabase-js");
        const storageClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          { global: { headers: { Authorization: bearer } } }
        );
        const { error: upErr } = await storageClient.storage
          .from("avatars")
          .upload(path, editAvatarFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = storageClient.storage.from("avatars").getPublicUrl(path);
        avatarUrl = publicUrl;
      }

      // Text + avatar_url update via API route — server-side getUser() validates the JWT
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": bearer,
        },
        body: JSON.stringify({
          nome: editNome.trim(),
          bio: editBio.trim(),
          cidade: editCidade.trim(),
          avatar_url: avatarUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar");

      setCreator(prev => ({ ...prev, nome: editNome.trim(), bio: editBio.trim(), cidade: editCidade.trim(), avatar_url: avatarUrl }));
      setEditAvatarFile(null);
      setEditAvatarPreview("");
      setEditMode(false);
    } catch (err) {
      setEditErr(err.message || "Erro ao salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setEditSaving(false);
    }
  }

  // ── Derived display data (real data only, no mock fallbacks) ─────────────

  const displaySolutions = dbSolutions ? dbSolutions.map(mapSolution) : [];
  const displayReviews   = dbReviews   ? dbReviews.map(mapReview)     : [];

  const displayName        = creator?.nome || "";
  const displayHandle      = creator?.slug ? `@${creator.slug}` : null;
  const displayBio         = creator?.bio  || null;
  const displayLocation    = creator?.cidade || creator?.localizacao || creator?.city || null;
  const displayMemberSince = formatMemberSince(creator?.created_at);
  const displayTags        = Array.isArray(creator?.tags) ? creator.tags : [];

  const totalSolutions = displaySolutions.length;
  const totalSales     = dbSalesCount;
  const totalReviews   = dbReviews?.length || 0;
  const avgRating      = totalReviews > 0
    ? (dbReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : null; // null = no reviews yet

  // Dynamic category pills from real solutions only
  const displayCategories = (() => {
    if (!dbSolutions || dbSolutions.length === 0) return [{ id: "all", label: "Todas 0" }];
    const counts = dbSolutions.reduce((acc, s) => {
      const cat = s.categoria || s.categories?.nome || "Outras";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return [
      { id: "all", label: `Todas ${dbSolutions.length}` },
      ...Object.entries(counts).map(([name, count]) => ({ id: name, label: `${name} ${count}` })),
    ];
  })();

  // Tabs with real counts
  const displayTabs = [
    `Soluções ${totalSolutions}`,
    `Avaliações ${totalReviews}`,
    "Sobre",
  ];

  // Rating bars — only from real reviews, empty array if none
  const displayRatingBars = (() => {
    if (!dbReviews || dbReviews.length === 0) return [];
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dbReviews.forEach(r => { const n = r.rating || 0; if (counts[n] !== undefined) counts[n]++; });
    const total = dbReviews.length;
    return [5, 4, 3, 2, 1].map(star => ({
      star, count: counts[star], pct: Math.round((counts[star] / total) * 100),
    }));
  })();

  // Sort + filter solutions
  const filtered = activeCategory === "all" ? displaySolutions : displaySolutions.filter(s => s.category === activeCategory);
  const filteredSolutions = [...filtered].sort((a, b) => {
    if (sortBy === "price")  return parsePrice(a.price) - parsePrice(b.price);
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "recent") return displaySolutions.indexOf(b) - displaySolutions.indexOf(a);
    return b.sales - a.sales;
  });

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${displayName} - WePrompt`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }

  // ── NOT FOUND ─────────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f9fafb",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Criador não encontrado</div>
        <div style={{ fontSize: 14, color: "#6b7280" }}>O perfil "{id}" não existe ou foi removido.</div>
        <button
          onClick={() => router.push("/criadores")}
          style={{
            marginTop: 8, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white",
            border: "none", borderRadius: 999, padding: "12px 28px",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
          }}
        >
          ← Ver todos os criadores
        </button>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "#F8F7FF", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden" }}>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .cri-banner { padding: 24px 16px 0; position: relative; }
        @media (min-width: 768px) { .cri-banner { padding: 48px 48px 0; } }
        .cri-actions { position: static; display: flex; gap: 12px; margin-bottom: 16px; justify-content: flex-end; }
        @media (min-width: 768px) { .cri-actions { position: absolute; top: 48px; right: 48px; margin-bottom: 0; } }
        .cri-profile-row { display: flex; flex-direction: column; align-items: center; gap: 28px; text-align: center; }
        @media (min-width: 768px) { .cri-profile-row { flex-direction: row; align-items: flex-end; text-align: left; } }
        .cri-tabs-bar { display: flex; gap: 0; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 0 16px; }
        .cri-tabs-bar::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .cri-tabs-bar { padding: 0 48px; } }
        .cri-content { background: #F8F7FF; padding: 16px; }
        @media (min-width: 768px) { .cri-content { padding: 32px 48px; } }
        .cri-sol-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .cri-sol-grid { grid-template-columns: repeat(3, 1fr); } }
        .cri-reviews-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: flex-start; }
        @media (min-width: 768px) { .cri-reviews-grid { grid-template-columns: 280px 1fr; } }
      `}</style>

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── PROFILE BANNER ────────────────────────────────────────────── */}
      <div className="cri-banner" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #6366F1 100%)" }}>
        <div className="cri-actions">
          {isOwner && !editMode && (
            <button onClick={enterEditMode} style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
              padding: "8px 18px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", minHeight: 44,
            }}>✏ Editar perfil</button>
          )}
          {editMode && (
            <>
              <button onClick={handleEditSave} disabled={editSaving} style={{
                background: editSaving ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "white", border: "none", borderRadius: 999,
                padding: "8px 20px", fontSize: 14, fontWeight: 600, minHeight: 44,
                cursor: editSaving ? "not-allowed" : "pointer", fontFamily: "inherit",
                boxShadow: editSaving ? "none" : "0 2px 12px rgba(99,102,241,0.4)",
              }}>
                {editSaving ? "Salvando…" : "Salvar alterações"}
              </button>
              <button onClick={() => setEditMode(false)} disabled={editSaving} style={{
                background: "rgba(255,255,255,0.15)", color: "white",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
                padding: "8px 18px", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}>Cancelar</button>
            </>
          )}
          {!editMode && (
            <button onClick={handleShare} style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
              padding: "8px 18px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", minHeight: 44,
            }}>Compartilhar ↗</button>
          )}
        </div>

        <div className="cri-profile-row">
          {/* Avatar */}
          <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 999,
              border: "4px solid white", background: "#dbeafe",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {(editAvatarPreview || creator?.avatar_url)
                ? <img src={editAvatarPreview || creator.avatar_url} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 52, fontWeight: 900, color: "#6366F1" }}>{displayName.charAt(0)}</span>
              }
            </div>
            {editMode && (
              <>
                <label htmlFor="edit-avatar-upload" style={{
                  position: "absolute", inset: 0, borderRadius: 999,
                  background: "rgba(0,0,0,0.45)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </label>
                <input id="edit-avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setEditAvatarFile(file);
                  setEditAvatarPreview(URL.createObjectURL(file));
                }} />
              </>
            )}
          </div>

          {/* Name + stats */}
          <div style={{ paddingBottom: 24, flex: 1 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton w={220} h={32} />
                <Skeleton w={120} h={16} />
                <Skeleton w={180} h={14} style={{ marginTop: 4 }} />
              </div>
            ) : (
              <>
                {(() => {
                  const rep = getReputationLevel(Number(avgRating), totalSales, totalReviews);
                  const nxt = getNextLevel(Number(avgRating), totalSales, totalReviews);
                  const pct = nxt ? Math.min(100, Math.round((nxt.salesCurrent / nxt.salesNeeded) * 100)) : 100;
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        {editMode ? (
                          <input
                            value={editNome}
                            onChange={e => setEditNome(e.target.value)}
                            placeholder="Seu nome"
                            style={{
                              fontSize: 24, fontWeight: 900, color: "white",
                              background: "rgba(255,255,255,0.15)",
                              border: "1.5px solid rgba(255,255,255,0.5)",
                              borderRadius: 12, padding: "6px 14px",
                              outline: "none", fontFamily: "inherit",
                              width: "100%", maxWidth: "100%", boxSizing: "border-box",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: 28, fontWeight: 900, color: "white" }}>{displayName}</span>
                        )}
                        <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {rep.icon} {rep.label}
                        </span>
                      </div>
                      {nxt && (
                        <div style={{ marginTop: 12, maxWidth: 360 }}>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Próximo nível: {nxt.label} ({nxt.salesCurrent}/{nxt.salesNeeded} vendas)</div>
                          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 3, background: "#6366F1", width: `${pct}%`, transition: "width 0.6s ease" }} />
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                {displayHandle && (
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{displayHandle}</div>
                )}
                {editMode ? (
                  <input
                    value={editCidade}
                    onChange={e => setEditCidade(e.target.value)}
                    placeholder="Sua cidade (ex: São Paulo, SP)"
                    style={{
                      fontSize: 13, color: "white", marginTop: 6,
                      background: "rgba(255,255,255,0.15)",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                      borderRadius: 8, padding: "5px 12px",
                      outline: "none", fontFamily: "inherit", width: "100%", maxWidth: "100%", boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                    {displayMemberSince && `Membro desde ${displayMemberSince}`}
                    {displayMemberSince && displayLocation && " · "}
                    {displayLocation}
                  </div>
                )}
              </>
            )}

            {/* Stats row — scrollable on mobile so 4 stat boxes don't cause page overflow */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginTop: 16, maxWidth: "100%" }}>
            <div style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden",
            }}>
              {loading
                ? [140, 140, 140, 140].map((w, i) => (
                    <div key={i} style={{
                      padding: "14px 28px",
                      borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
                    }}>
                      <Skeleton w={w - 80} h={28} style={{ margin: "0 auto 6px" }} />
                      <Skeleton w={w - 100} h={12} style={{ margin: "0 auto" }} />
                    </div>
                  ))
                : [
                    { value: totalSolutions.toString(),              sub: "Soluções",  extra: null },
                    { value: totalSales.toLocaleString("pt-BR"),     sub: "Vendas",    extra: null },
                    { value: avgRating ?? "—",                       sub: "Avaliação", extra: avgRating ? "★" : null },
                    { value: totalReviews.toString(),                sub: "Reviews",   extra: null },
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "14px 28px", textAlign: "center", color: "white",
                      borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                        {s.value}
                        {s.extra && <span style={{ color: "#f59e0b", fontSize: 18 }}>{s.extra}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{s.sub}</div>
                    </div>
                  ))
              }
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────────────────────── */}
      <div className="cri-tabs-bar" style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        position: "sticky", top: 60, zIndex: 10,
      }}>
        {displayTabs.map((tab, i) => (
          <button key={tab}
            onClick={() => setActiveTab(i)}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: "16px 24px 16px 0", marginRight: 8,
              cursor: "pointer", display: "inline-flex", alignItems: "center",
              border: "none",
              borderBottom: activeTab === i ? "2px solid #6366F1" : "2px solid transparent",
              background: "transparent",
              color: activeTab === i ? "#6366F1" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: activeTab === i ? 600 : 400,
              marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="cri-content">

        {/* ═══ SOLUÇÕES ═══ */}
        {activeTab === 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {loading
                  ? [80, 100, 90, 85, 70].map((w, i) => <Skeleton key={i} w={w} h={34} radius={999} />)
                  : displayCategories.map(c => (
                      <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
                        borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 500,
                        cursor: "pointer",
                        border: activeCategory === c.id ? "none" : "1px solid #e5e7eb",
                        background: activeCategory === c.id ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "white",
                        color: activeCategory === c.id ? "white" : "#374151",
                        boxShadow: activeCategory === c.id ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                        transition: "all 0.15s ease", fontFamily: "inherit",
                      }}>{c.label}</button>
                    ))
                }
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px",
                  fontSize: 13, color: "#374151", background: "white", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <option value="sales">Mais Vendidos</option>
                <option value="price">Menor Preço</option>
                <option value="rating">Maior Avaliação</option>
                <option value="recent">Mais Recentes</option>
              </select>
            </div>

            {loading
              ? (
                <div className="cri-sol-grid" style={{ gap: 20 }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                      <Skeleton w="100%" h={160} radius={0} />
                      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                        <Skeleton w={70} h={20} radius={999} />
                        <Skeleton w="80%" h={18} />
                        <Skeleton w="60%" h={14} />
                        <Skeleton w={80} h={28} />
                        <Skeleton w="100%" h={40} />
                      </div>
                    </div>
                  ))}
                </div>
              )
              : filteredSolutions.length === 0 ? (
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "56px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Nenhuma solução publicada ainda</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Este criador ainda não publicou soluções.</div>
                </div>
              ) : (
                <div className="cri-sol-grid" style={{ gap: 20 }}>
                  {filteredSolutions.map((sol, i) => <SolutionCard key={i} sol={sol} />)}
                </div>
              )
            }
          </>
        )}

        {/* ═══ AVALIAÇÕES ═══ */}
        {activeTab === 1 && (
          <div className="cri-reviews-grid">
            <div style={{
              background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
              padding: 24, position: "sticky", top: 120,
            }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Skeleton w={80} h={80} />
                  <Skeleton w={120} h={24} />
                  <Skeleton w={160} h={14} />
                  {[1,2,3,4,5].map(i => <Skeleton key={i} w="100%" h={16} />)}
                </div>
              ) : totalReviews === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Sem avaliações ainda</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>As avaliações aparecerão aqui após as primeiras vendas.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 64, fontWeight: 900, color: "#111827", textAlign: "center", lineHeight: 1 }}>{avgRating}</div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                    <Stars rating={Math.round(Number(avgRating))} size={28} />
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 8 }}>
                    Baseado em {totalReviews} avaliação{totalReviews !== 1 ? "ões" : ""}
                  </div>
                  {displayRatingBars.length > 0 && (
                    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                      {displayRatingBars.map(rb => (
                        <div key={rb.star} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, color: "#374151", width: 24 }}>{rb.star}★</span>
                          <div style={{ flex: 1, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${rb.pct}%`, height: "100%", background: "#f59e0b", borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 13, color: "#6b7280", width: 28, textAlign: "right" }}>{rb.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loading
                ? [1,2,3,4].map(i => (
                    <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        <Skeleton w={40} h={40} radius={999} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <Skeleton w={100} h={14} />
                          <Skeleton w={140} h={12} />
                        </div>
                      </div>
                      <Skeleton w="100%" h={14} style={{ marginBottom: 6 }} />
                      <Skeleton w="90%" h={14} style={{ marginBottom: 6 }} />
                      <Skeleton w="70%" h={14} />
                    </div>
                  ))
                : displayReviews.length === 0 ? (
                    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "48px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Nenhuma avaliação ainda.</div>
                      <div style={{ fontSize: 14, color: "#6b7280" }}>As avaliações aparecerão aqui após as primeiras vendas.</div>
                    </div>
                  ) : displayReviews.map((rev, i) => (
                    <ReviewCard
                      key={i}
                      rev={rev}
                      idx={i}
                      helpfulCounts={helpfulCounts}
                      setHelpfulCounts={setHelpfulCounts}
                    />
                  ))
              }
            </div>
          </div>
        )}

        {/* ═══ SOBRE ═══ */}
        {activeTab === 2 && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Sobre o Criador</h3>
              {loading
                ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Skeleton w="100%" h={16} />
                    <Skeleton w="95%" h={16} />
                    <Skeleton w="80%" h={16} />
                  </div>
                )
                : editMode ? (
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    rows={5}
                    placeholder="Fale sobre você, suas especialidades e experiência…"
                    style={{
                      width: "100%", boxSizing: "border-box",
                      padding: "12px 14px", borderRadius: 12,
                      border: "1.5px solid #6366F1",
                      fontSize: 15, color: "#111827", lineHeight: 1.7,
                      fontFamily: "inherit", resize: "vertical", outline: "none",
                    }}
                  />
                )
                : displayBio ? (
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                    {displayBio}
                  </p>
                ) : (
                  <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                    {isOwner ? "Clique em Editar perfil para adicionar uma bio." : "Este criador ainda não adicionou uma bio."}
                  </p>
                )
              }
              {editErr && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, fontSize: 13, color: "#B91C1C" }}>
                  {editErr}
                </div>
              )}
              {displayTags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {displayTags.map(tag => (
                    <span key={tag} style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: 999, padding: "4px 14px", fontSize: 13 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Informações</h3>
              {[
                ...(displayLocation ? [{
                  icon: <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                  text: displayLocation,
                }] : []),
                ...(displayMemberSince ? [{
                  icon: <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
                  text: `Membro desde ${displayMemberSince}`,
                }] : []),
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  text: "Identidade verificada",
                },
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
                  text: "Responde em menos de 2 horas",
                },
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                  fontSize: 14, color: "#374151",
                }}>
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── TOAST ─────────────────────────────────────────────────────── */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white",
          padding: "12px 20px", borderRadius: 999,
          fontSize: 14, zIndex: 100,
        }}>
          ✓ Link copiado!
        </div>
      )}
    </div>
  );
}
