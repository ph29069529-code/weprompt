"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function initials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function Stars({ rating = 5, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function EmpresaProfilePage() {
  const { id } = useParams();
  const router  = useRouter();

  const [empresa,  setEmpresa]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [subs,     setSubs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const { data: prof, error } = await supabase
        .from("profiles").select("*").eq("id", id).single();
      if (error || !prof) { setNotFound(true); setLoading(false); return; }
      setEmpresa(prof);

      const [subsRes, reviewsRes] = await Promise.all([
        supabase.from("subscriptions")
          .select("id, created_at, solutions(titulo)")
          .eq("user_id", id),
        supabase.from("reviews")
          .select("*, solutions(titulo)")
          .eq("reviewer_id", id)
          .order("created_at", { ascending: false }),
      ]);
      setSubs(subsRes.data || []);
      setReviews(reviewsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Carregando perfil…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🏢</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Empresa não encontrada</div>
        <button onClick={() => router.push("/solucoes")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Explorar Soluções
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <img src="/logo.png" alt="WePrompt" onClick={() => router.push("/")} style={{ width: 160, height: "auto", cursor: "pointer" }} />
        <button onClick={() => router.push("/solucoes")} style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Explorar Soluções
        </button>
      </nav>

      {/* Profile header */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {initials(empresa?.nome)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0A0F1E", marginBottom: 4, letterSpacing: "-0.5px" }}>{empresa?.nome || "—"}</div>
              {empresa?.cidade && <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>📍 {empresa.cidade}</div>}
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[
                  { label: "Soluções adquiridas", value: subs.length },
                  { label: "Avaliações enviadas", value: reviews.length },
                  { label: "Membro desde", value: formatDate(empresa?.created_at) },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0A0F1E" }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", marginBottom: 16 }}>
          Avaliações enviadas
        </div>
        {reviews.length === 0 ? (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "56px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Nenhuma avaliação ainda</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Esta empresa ainda não avaliou nenhum criador.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map((r, i) => (
              <div key={r.id || i} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.solutions?.titulo || "—"}</div>
                  <Stars rating={r.rating || 5} />
                </div>
                {r.comment && <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{r.comment}</div>}
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{formatDate(r.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
