"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

/* ── Copy-to-clipboard hook ── */
function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  }, [timeout]);
  return [copied, copy];
}

/* ── Minimal markdown-like renderer ──────────────────────────────────
   Handles: ## headings, --- dividers, [PROMPT] blocks, plain text
*/
function ContentRenderer({ raw }) {
  if (!raw) return null;

  // Split on [PROMPT] markers to identify prompt blocks
  // We process line by line and accumulate sections
  const lines = raw.split("\n");
  const sections = [];
  let current = { type: "text", lines: [] };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "[PROMPT]") {
      // flush pending text
      if (current.lines.length > 0) { sections.push({ ...current }); current = { type: "text", lines: [] }; }
      // collect prompt block until next --- or ## or end
      const promptLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "---" && !lines[i].startsWith("##")) {
        promptLines.push(lines[i]);
        i++;
      }
      sections.push({ type: "prompt", lines: promptLines });
    } else {
      current.lines.push(line);
      i++;
    }
  }
  if (current.lines.length > 0) sections.push(current);

  return (
    <div>
      {sections.map((sec, si) => {
        if (sec.type === "prompt") {
          return <PromptBlock key={si} text={sec.lines.join("\n").trim()} />;
        }
        // Render text section line by line
        return (
          <div key={si}>
            {sec.lines.map((line, li) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={li} style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", marginTop: li === 0 && si === 0 ? 0 : 32, marginBottom: 12 }}>
                    {line.replace(/^## /, "")}
                  </h2>
                );
              }
              if (line.trim() === "---") {
                return <hr key={li} style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "24px 0" }} />;
              }
              if (line.trim() === "") {
                return <div key={li} style={{ height: 8 }} />;
              }
              return (
                <p key={li} style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", margin: "0 0 4px" }}>
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PromptBlock({ text }) {
  const [copied, copy] = useCopy();
  return (
    <div style={{ position: "relative", background: "#F8F9FB", border: "1px solid #E5E7EB", borderLeft: "3px solid #6366F1", borderRadius: 8, padding: "16px 48px 16px 16px", margin: "12px 0", fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, color: "#374151", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {text}
      <button
        onClick={() => copy(text)}
        title="Copiar prompt"
        style={{ position: "absolute", top: 10, right: 10, background: copied ? "#6366F1" : "white", border: "1px solid #E5E7EB", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: copied ? "white" : "#6366F1", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
        {copied ? "✓ Copiado" : "Copiar"}
      </button>
    </div>
  );
}

/* ── Page ── */
export default function PromptPackPage() {
  const { id } = useParams();
  const router  = useRouter();

  const [solution,  setSolution]  = useState(null);
  const [creator,   setCreator]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [denied,    setDenied]    = useState(false);
  const [copiedAll, copyAll]      = useCopy();

  useEffect(() => {
    if (!id) return;
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const uid = session.user.id;

      // Verify active subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, created_at")
        .eq("solution_id", id)
        .eq("business_id", uid)
        .eq("status", "active")
        .limit(1)
        .single();

      if (!sub) { setDenied(true); setLoading(false); return; }

      const { data: sol } = await supabase
        .from("solutions")
        .select("*, profiles:creator_id(id, nome)")
        .eq("id", id)
        .single();

      if (!sol) { setDenied(true); setLoading(false); return; }

      setSolution({ ...sol, purchase_date: sub.created_at });
      if (sol.profiles) setCreator(sol.profiles);
      setLoading(false);
    }
    init();
  }, [id, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F9FB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Carregando…</div>
      </div>
    );
  }

  if (denied) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F9FB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "Inter, sans-serif", padding: 24 }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Acesso restrito</div>
        <div style={{ fontSize: 14, color: "#6b7280", textAlign: "center", maxWidth: 360 }}>
          Você precisa adquirir esta solução para acessar o conteúdo.
        </div>
        <button onClick={() => router.push(`/solucoes/${id}`)}
          style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Ver solução →
        </button>
      </div>
    );
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Header card */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #E5E7EB", padding: 28, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            {solution.cover_url && (
              <img src={solution.cover_url} alt={solution.titulo} width={80} height={80} style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                {solution.categoria && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99, background: "#f3f4f6", color: "#374151" }}>{solution.categoria}</span>
                )}
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: "#EEF2FF", color: "#6366F1" }}>📄 Prompt Pack</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0A0F1E", margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                {solution.titulo}
              </h1>
              {creator && (
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Por{" "}
                  <Link href={`/criadores/${creator.id}`} style={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>
                    {creator.nome}
                  </Link>
                </div>
              )}
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
                Adquirido em {fmtDate(solution.purchase_date)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>Seus Prompts</h2>
          <button
            onClick={() => copyAll(solution.conteudo_pack || "")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: copiedAll ? "#6366F1" : "white", color: copiedAll ? "white" : "#6366F1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {copiedAll ? "✓ Copiado!" : "Copiar tudo"}
          </button>
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {solution.conteudo_pack ? (
            <ContentRenderer raw={solution.conteudo_pack} />
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 14 }}>
              Conteúdo ainda não disponível. Entre em contato com o criador.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
