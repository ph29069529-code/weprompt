"use client";

/*
  SQL — run once in Supabase SQL Editor:

  CREATE TABLE IF NOT EXISTS workspace_sessions (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        REFERENCES profiles(id),
    solution_id UUID        REFERENCES solutions(id),
    messages    JSONB       DEFAULT '[]',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE workspace_sessions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can manage own sessions" ON workspace_sessions
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  ALTER TABLE solutions ADD COLUMN IF NOT EXISTS agent_system_prompt TEXT;
  ALTER TABLE solutions ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'agente';
  ALTER TABLE solutions ADD COLUMN IF NOT EXISTS conteudo_pack TEXT;
*/

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

/* ── helpers ── */
function initials(nome) {
  if (!nome) return "IA";
  const p = nome.trim().split(" ");
  return p.length >= 2
    ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
    : p[0].slice(0, 2).toUpperCase();
}

function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function getSuggestions(categoria) {
  const map = {
    "Atendimento":    ["Como posso melhorar meu atendimento ao cliente?", "Crie um script de atendimento para minha equipe", "Quais são as melhores práticas de suporte?"],
    "Vendas":         ["Como aumentar minhas conversões de vendas?", "Crie um script de vendas persuasivo", "Analise meu funil de vendas"],
    "Marketing":      ["Crie uma campanha de email marketing", "Sugira uma estratégia de conteúdo para minha empresa", "Como melhorar meu ROI em anúncios?"],
    "Automação":      ["Quais processos posso automatizar primeiro?", "Como integrar esta solução com meu CRM?", "Mostre um exemplo de automação de email"],
    "Análise de Dados": ["Analise os dados do meu negócio", "Crie um relatório de desempenho", "Quais métricas devo acompanhar?"],
    "WhatsApp IA":    ["Como configurar o bot no WhatsApp Business?", "Crie uma mensagem de boas-vindas", "Como tratar reclamações automaticamente?"],
    "Chatbots":       ["Como personalizar as respostas do chatbot?", "Crie um fluxo de conversa para vendas", "Como reduzir taxa de abandono?"],
    "Copywriting IA": ["Escreva um texto de vendas para meu produto", "Crie um email de prospecção", "Escreva uma bio profissional"],
    "Agentes de IA":  ["O que você pode fazer por mim?", "Como posso aproveitar melhor esta IA?", "Me dê um exemplo prático do seu uso"],
  };
  return map[categoria] || [
    "Como posso começar?",
    "O que você pode fazer pelo meu negócio?",
    "Me dê um exemplo prático",
  ];
}

/* ── dot animation ── */
const dotStyle = (delay) => ({
  width: 8, height: 8, borderRadius: "50%",
  background: "#6366F1", display: "inline-block",
  animation: `dotBounce 1.2s ease-in-out ${delay}s infinite`,
});

/* ── copy hook ── */
function useCopy(ms = 1800) {
  const [copiedId, setCopiedId] = useState(null);
  const copy = useCallback((text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), ms);
    });
  }, [ms]);
  return [copiedId, copy];
}

/* ════════════════════════════════════════ */

export default function WorkspacePage() {
  const { id } = useParams();
  const router  = useRouter();

  const [user,        setUser]        = useState(null);
  const [solution,    setSolution]    = useState(null);
  const [creator,     setCreator]     = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [denied,      setDenied]      = useState(false);

  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId,   setSessionId]   = useState(null);
  const [sessions,    setSessions]    = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const [copiedId, copy] = useCopy();

  /* auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  /* mount — auth + data */
  useEffect(() => {
    if (!id) return;
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      setUser(session.user);

      /* verify subscription */
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("solution_id", id)
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (!sub) { setDenied(true); setPageLoading(false); return; }

      /* solution details */
      const { data: sol } = await supabase
        .from("solutions")
        .select("*, profiles:creator_id(id, nome)")
        .eq("id", id)
        .single();

      if (!sol) { setDenied(true); setPageLoading(false); return; }
      setSolution(sol);
      if (sol.profiles) setCreator(sol.profiles);

      /* past sessions */
      const { data: sessData } = await supabase
        .from("workspace_sessions")
        .select("id, messages, created_at, updated_at")
        .eq("solution_id", id)
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .limit(10);
      if (sessData) setSessions(sessData);

      setPageLoading(false);
    }
    init();
  }, [id, router]);

  /* save session to Supabase */
  const saveSession = useCallback(async (msgs) => {
    if (!user || !solution) return;
    if (sessionId) {
      await supabase
        .from("workspace_sessions")
        .update({ messages: msgs, updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    } else {
      const { data } = await supabase
        .from("workspace_sessions")
        .insert({ user_id: user.id, solution_id: solution.id, messages: msgs })
        .select()
        .single();
      if (data) {
        setSessionId(data.id);
        setSessions((prev) => [data, ...prev]);
      }
    }
  }, [user, solution, sessionId]);

  /* send message */
  const sendMessage = useCallback(async () => {
    if (!input.trim() || chatLoading) return;

    const userMsg = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const withUser = [...messages, userMsg];
    setMessages(withUser);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setChatLoading(true);

    try {
      const res = await fetch("/api/workspace/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: withUser.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: solution?.agent_system_prompt,
          solutionId: solution?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na API");

      const agentMsg = {
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      const final = [...withUser, agentMsg];
      setMessages(final);
      await saveSession(final);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro. Tente novamente.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [input, chatLoading, messages, solution, saveSession]);

  function startNewSession() {
    setMessages([]);
    setSessionId(null);
  }

  function loadSession(sess) {
    setMessages(sess.messages || []);
    setSessionId(sess.id);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  /* ── Loading / Denied screens ── */
  if (pageLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", background: "#F8F9FB" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>🤖</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Carregando workspace…</div>
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "Inter, sans-serif", padding: 24 }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Acesso restrito</div>
        <div style={{ fontSize: 14, color: "#6B7280", textAlign: "center", maxWidth: 360 }}>
          Você precisa ter uma assinatura ativa para acessar este workspace.
        </div>
        <button onClick={() => router.push(`/solucoes/${id}`)}
          style={{ background: "#6366F1", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Ver solução →
        </button>
      </div>
    );
  }

  const suggestions = getSuggestions(solution?.categoria);
  const solInitials = solution?.titulo ? initials(solution.titulo) : "IA";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-8px); }
        }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside style={{ width: 260, flexShrink: 0, background: "white", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* Back button */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6" }}>
          <button onClick={() => router.push("/dashboard/empresa")}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            ← Minhas Soluções
          </button>
        </div>

        {/* Solution info */}
        <div style={{ padding: 16, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            {solution?.cover_url ? (
              <img src={solution.cover_url} alt={solution.titulo} width={48} height={48}
                style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                {solInitials}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {solution?.titulo}
              </div>
              {creator && (
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  por{" "}
                  <Link href={`/criadores/${creator.id}`} style={{ color: "#6366F1", textDecoration: "none", fontWeight: 600 }}>
                    {creator.nome}
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: "#EEF2FF", color: "#6366F1", borderRadius: 99, padding: "2px 8px" }}>
              Agente IA WePrompt
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#16A34A" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
              Online
            </span>
          </div>
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 8px 4px" }}>
            Conversas
          </div>

          <button onClick={startNewSession}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.06)", color: "#6366F1", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8, fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}>
            + Nova conversa
          </button>

          {sessions.map((sess) => {
            const firstMsg = Array.isArray(sess.messages) && sess.messages[0];
            const preview = firstMsg ? String(firstMsg.content).slice(0, 36) + "…" : "Conversa vazia";
            const isActive = sess.id === sessionId;
            return (
              <button key={sess.id} onClick={() => loadSession(sess)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: isActive ? "#EEF2FF" : "transparent", textAlign: "left", cursor: "pointer", marginBottom: 2, fontFamily: "inherit", transition: "background 0.1s" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#6366F1" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {preview}
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{fmtDate(sess.updated_at)}</div>
              </button>
            );
          })}
        </div>

        {/* User info bottom */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6366F1", flexShrink: 0 }}>
            {initials(user?.email || "U")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email || "Usuário"}
            </div>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace("/login"); }}
            style={{ fontSize: 12, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Sair
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CHAT ══════════ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F8F9FB", minWidth: 0, overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 15, fontWeight: 700 }}>
              {solInitials}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{solution?.titulo}</div>
              <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(99,102,241,0.08)", color: "#6366F1", padding: "2px 9px", borderRadius: 100 }}>
                powered by Claude
              </span>
            </div>
          </div>
          <button title="Configurações (em breve)"
            style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 8, padding: "6px 10px", cursor: "default", color: "#9CA3AF" }}>
            ⚙
          </button>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Welcome state */}
          {messages.length === 0 && !chatLoading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: "40px 24px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
                {solInitials}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", marginBottom: 10 }}>
                Olá! Sou o {solution?.titulo}
              </div>
              <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 480, lineHeight: 1.7, marginBottom: 28 }}>
                {solution?.descricao_curta || solution?.descricao?.slice(0, 120) || "Como posso ajudar você hoje?"}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    style={{ border: "1px solid #E5E7EB", borderRadius: 100, padding: "8px 16px", fontSize: 13, color: "#374151", background: "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              index={i}
              solInitials={solInitials}
              copiedId={copiedId}
              onCopy={copy}
            />
          ))}

          {/* Loading dots */}
          {chatLoading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {solInitials}
              </div>
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={dotStyle(0)} />
                <span style={dotStyle(0.2)} />
                <span style={dotStyle(0.4)} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "16px 24px", flexShrink: 0 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 10 }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem… (Enter para enviar, Shift+Enter para nova linha)"
              rows={1}
              style={{
                flex: 1, padding: "12px 52px 12px 16px",
                borderRadius: 12, border: "1px solid #E5E7EB",
                fontSize: 14, color: "#111827", background: "white",
                outline: "none", resize: "none", lineHeight: 1.5,
                fontFamily: "inherit", maxHeight: 120, overflowY: "auto",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              style={{
                position: "absolute", right: 10, bottom: 10,
                width: 34, height: 34, borderRadius: 8, border: "none",
                background: chatLoading || !input.trim() ? "#E5E7EB" : "#6366F1",
                color: chatLoading || !input.trim() ? "#9CA3AF" : "white",
                cursor: chatLoading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}>
              {chatLoading
                ? <span style={{ fontSize: 14, animation: "spin 1s linear infinite", display: "inline-block" }}>↻</span>
                : <span style={{ fontSize: 16 }}>↑</span>}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
            WePrompt Workspace · Powered by Claude · As respostas podem conter imprecisões.
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Message bubble component ── */
function MessageBubble({ msg, index, solInitials, copiedId, onCopy }) {
  const isUser = msg.role === "user";
  const [hovered, setHovered] = useState(false);
  const msgId = `msg-${index}`;

  return (
    <div
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 12, alignItems: "flex-start" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
          {solInitials}
        </div>
      )}

      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4 }}>
        <div style={{
          background: isUser ? "#0A0F1E" : "white",
          color: isUser ? "white" : "#0A0F1E",
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px",
          fontSize: 14, lineHeight: 1.65,
          border: isUser ? "none" : "1px solid #E5E7EB",
          boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {msg.content}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{fmtTime(msg.timestamp)}</span>
          <button onClick={() => onCopy(msg.content, msgId)}
            style={{ fontSize: 11, color: copiedId === msgId ? "#16A34A" : "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: "0 2px", fontFamily: "inherit" }}>
            {copiedId === msgId ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
