"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.08)";
const GREEN = "#16A34A";

const ADMIN_EMAIL = "ph29069529@gmail.com";

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

const TABS = [
  { key: "pending",  label: "Pendentes",  color: "#B45309" },
  { key: "approved", label: "Aprovadas",  color: "#15803D" },
  { key: "rejected", label: "Reprovadas", color: "#B91C1C" },
];

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  file:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  link:     "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  arrow:    "M5 12h14M12 5l7 7-7 7",
};

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        boxShadow: "0 16px 60px rgba(0,0,0,0.12)",
        width: "100%", maxWidth: 460, padding: "32px",
        animation: "modalIn 0.2s ease",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(6px) } to { opacity:1; transform:none } }`}</style>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, color: "#DC2626",
        }}>
          <Icon d={icons.x} size={20} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>Reprovar solução</h2>
        <p style={{ fontSize: 14, color: GRAY, margin: "0 0 20px" }}>
          <strong style={{ color: DARK }}>{solution.titulo}</strong> — informe o motivo da reprovação para o criador.
        </p>
        <textarea autoFocus rows={4}
          placeholder="Ex: Descrição insuficiente, categoria incorreta, conteúdo inadequado…"
          value={reason} onChange={e => setReason(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px",
            borderRadius: 10, border: `1.5px solid ${BORDER}`,
            fontSize: 14, color: DARK, background: "#fff",
            outline: "none", resize: "vertical", lineHeight: 1.6,
            boxSizing: "border-box", fontFamily: "inherit", marginBottom: 20,
          }}
          onFocus={e => (e.target.style.borderColor = "#DC2626")}
          onBlur={e => (e.target.style.borderColor = BORDER)} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 10,
            border: `1.5px solid ${BORDER}`,
            background: "transparent", color: GRAY,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={loading || !reason.trim()} style={{
            padding: "10px 22px", borderRadius: 10,
            background: loading || !reason.trim() ? "rgba(220,38,38,0.3)" : "#DC2626",
            color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600,
            cursor: loading || !reason.trim() ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {loading ? "Reprovando…" : "Confirmar reprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Detail drawer ── */
function DetailDrawer({ solution, onClose, onApprove, onReject, actionLoading }) {
  const [fileUrls, setFileUrls] = useState({});
  const [curationNotes, setCurationNotes] = useState(solution.curation_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const isLoading = actionLoading === solution.id;

  useEffect(() => {
    const files = solution.delivery_files || [];
    if (!files.length) return;
    async function generateUrls() {
      const urls = {};
      for (const f of files) {
        if (!f.path) continue;
        const { data } = await supabase.storage
          .from("solution-files")
          .createSignedUrl(f.path, 3600);
        if (data?.signedUrl) urls[f.path] = data.signedUrl;
      }
      setFileUrls(urls);
    }
    generateUrls();
  }, [solution]);

  async function saveNotes() {
    setSavingNotes(true);
    await supabase.from("solutions").update({ curation_notes: curationNotes }).eq("id", solution.id);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${solution.payment_type === "one_time" ? " (único)" : "/mês"}`
    : "Gratuito";

  const hasDelivery = (solution.delivery_files?.length > 0) ||
    (solution.delivery_links?.length > 0) ||
    !!solution.delivery_instructions;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)",
      }} />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 580, maxWidth: "100vw",
        background: "#fff",
        borderLeft: `1px solid ${BORDER}`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.08)",
        zIndex: 301,
        display: "flex", flexDirection: "column",
        animation: "drawerIn 0.25s ease",
      }}>
        <style>{`@keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Drawer header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: DARK }}>Detalhes da solução</div>
            <div style={{ fontSize: 12, color: GRAY, marginTop: 1 }}>
              {solution.profiles?.nome || "—"} · enviada para curadoria
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: GRAY, padding: 6, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <Icon d={icons.x} size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {solution.cover_url && (
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20, border: `1px solid ${BORDER}` }}>
              <img src={solution.cover_url} alt={solution.titulo}
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            <span style={{
              background: "rgba(107,92,231,0.08)", color: PURPLE,
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
            }}>
              {solution.categoria}
            </span>
            <span style={{
              background: solution.payment_type === "one_time" ? "rgba(22,163,74,0.08)" : "rgba(107,92,231,0.08)",
              color: solution.payment_type === "one_time" ? "#15803D" : PURPLE,
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
            }}>
              {solution.payment_type === "one_time" ? "Venda Única" : "Assinatura Mensal"}
            </span>
            {(solution.version || 1) > 1 && (
              <span style={{
                background: "rgba(107,92,231,0.08)", color: PURPLE,
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
              }}>
                v{solution.version}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 10px", letterSpacing: "-0.3px" }}>
            {solution.titulo}
          </h3>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-line" }}>
            {solution.descricao}
          </p>
          <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 4 }}>{priceLabel}</div>

          <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />

          {/* Delivery section */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
              Material de entrega
            </div>

            {!hasDelivery && (
              <div style={{
                padding: "16px", borderRadius: 10,
                background: "#f9fafb", border: `1px solid ${BORDER}`,
                fontSize: 13, color: GRAY, fontStyle: "italic",
              }}>
                Nenhum material de entrega enviado pelo criador.
              </div>
            )}

            {solution.delivery_files?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 8 }}>
                  Arquivos ({solution.delivery_files.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {solution.delivery_files.map((f, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 8,
                      border: `1px solid ${BORDER}`, background: "#f9fafb",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <span style={{ color: GRAY }}><Icon d={icons.file} size={16} /></span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {f.name}
                          </div>
                          {f.size_bytes && (
                            <div style={{ fontSize: 11, color: GRAY }}>{formatBytes(f.size_bytes)}</div>
                          )}
                        </div>
                      </div>
                      {fileUrls[f.path] ? (
                        <a href={fileUrls[f.path]} download target="_blank" rel="noreferrer" style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 12px", borderRadius: 6,
                          background: "rgba(107,92,231,0.08)", color: PURPLE,
                          fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0,
                        }}>
                          <Icon d={icons.download} size={12} /> Download
                        </a>
                      ) : (
                        <span style={{ fontSize: 11, color: GRAY, flexShrink: 0 }}>Carregando…</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {solution.delivery_links?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 8 }}>
                  Links de acesso ({solution.delivery_links.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {solution.delivery_links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 8,
                      border: "1px solid rgba(107,92,231,0.2)", background: "rgba(107,92,231,0.05)",
                      color: PURPLE, fontSize: 13, fontWeight: 600, textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(107,92,231,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(107,92,231,0.05)")}
                    >
                      <Icon d={icons.link} size={14} />
                      <span>{l.label || l.url}</span>
                      <Icon d={icons.arrow} size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {solution.delivery_instructions && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 8 }}>
                  Instruções do criador
                </div>
                <div style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: "#f9fafb", border: `1px solid ${BORDER}`,
                  fontSize: 13, color: DARK, lineHeight: 1.75, whiteSpace: "pre-line",
                }}>
                  {solution.delivery_instructions}
                </div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />

          {/* Curation notes */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: DARK, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
              Notas internas de curadoria
            </div>
            <textarea
              value={curationNotes}
              onChange={e => { setCurationNotes(e.target.value); setNotesSaved(false); }}
              rows={4}
              placeholder="Observações internas, histórico de decisões, notas de revisão…"
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: `1.5px solid ${BORDER}`,
                fontSize: 14, color: DARK, background: "#fff",
                outline: "none", resize: "vertical", lineHeight: 1.6,
                boxSizing: "border-box", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
            <button onClick={saveNotes} disabled={savingNotes} style={{
              marginTop: 8,
              padding: "8px 18px", borderRadius: 8,
              background: notesSaved ? GREEN : "rgba(0,0,0,0.07)",
              color: notesSaved ? "#fff" : DARK, border: "none",
              fontSize: 13, fontWeight: 600,
              cursor: savingNotes ? "wait" : "pointer", fontFamily: "inherit",
              transition: "background 0.2s",
            }}>
              {savingNotes ? "Salvando…" : notesSaved ? "✓ Salvo" : "Salvar notas"}
            </button>
          </div>

          {solution.status === "pending" && <div style={{ height: 24 }} />}
        </div>

        {/* Sticky footer */}
        {solution.status === "pending" && (
          <div style={{
            padding: "16px 24px",
            borderTop: `1px solid ${BORDER}`,
            display: "flex", gap: 10, flexShrink: 0,
            background: "#fff",
          }}>
            <button
              onClick={() => onApprove(solution.id)}
              disabled={isLoading}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: isLoading ? "rgba(22,163,74,0.4)" : GREEN, color: "#fff",
                border: "none", borderRadius: 10, padding: "13px",
                fontSize: 14, fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#15803D"; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = GREEN; }}
            >
              <Icon d={icons.check} size={16} /> Aprovar solução
            </button>
            <button
              onClick={() => onReject(solution)}
              disabled={isLoading}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: "transparent", color: "#DC2626",
                border: "1.5px solid rgba(220,38,38,0.3)",
                borderRadius: 10, padding: "13px",
                fontSize: 14, fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "rgba(220,38,38,0.07)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)"; } }}
            >
              <Icon d={icons.x} size={16} /> Reprovar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Solution row ── */
function SolutionRow({ solution, onApprove, onReject, onView, actionLoading, isMobile }) {
  const isLoading = actionLoading === solution.id;
  const creatorNome = solution.profiles?.nome || "—";
  const priceLabel = solution.preco != null
    ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${solution.payment_type === "one_time" ? " único" : "/mês"}`
    : "Gratuito";
  const hasDelivery = (solution.delivery_files?.length > 0) || (solution.delivery_links?.length > 0) || !!solution.delivery_instructions;

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 14,
      padding: isMobile ? "14px 16px" : "20px 24px",
      display: "flex", gap: isMobile ? 12 : 16, alignItems: "flex-start",
      flexWrap: isMobile ? "wrap" : "nowrap",
      overflow: "hidden",
    }}>
      {!isMobile && (
        <div style={{
          width: 88, height: 56, borderRadius: 8, flexShrink: 0, overflow: "hidden",
          background: "rgba(107,92,231,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${BORDER}`,
        }}>
          {solution.cover_url ? (
            <img src={solution.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 20, opacity: 0.2, color: PURPLE }}>✦</span>
          )}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: DARK, overflow: "hidden", textOverflow: "ellipsis" }}>{solution.titulo}</span>
          {(solution.version || 1) > 1 && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 99,
              background: "rgba(107,92,231,0.08)", color: PURPLE,
            }}>
              v{solution.version}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          <span style={{ background: "rgba(107,92,231,0.08)", color: PURPLE, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
            {solution.categoria}
          </span>
          <span style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{priceLabel}</span>
          <span style={{ fontSize: 12, color: GRAY }}>· {creatorNome}</span>
          {hasDelivery && (
            <span style={{ fontSize: 11, color: "#15803D", fontWeight: 600, background: "rgba(22,163,74,0.08)", padding: "2px 8px", borderRadius: 99 }}>
              Material enviado
            </span>
          )}
        </div>
        <p style={{
          fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {solution.descricao}
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: 8,
        flex: isMobile ? "1 1 100%" : "0 0 auto",
        alignItems: "stretch",
        minWidth: isMobile ? "auto" : 120,
        marginTop: isMobile ? 4 : 0,
      }}>
        <button
          onClick={() => onView(solution)}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "transparent", color: GRAY,
            border: `1.5px solid ${BORDER}`,
            borderRadius: 8, padding: "7px 12px",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = BORDER; }}
        >
          <Icon d={icons.eye} size={13} /> Ver detalhes
        </button>

        {solution.status === "pending" && (
          <>
            <button onClick={() => onApprove(solution.id)} disabled={isLoading} style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: isLoading ? "rgba(22,163,74,0.4)" : GREEN, color: "#fff",
              border: "none", borderRadius: 8, padding: "7px 12px",
              fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit", whiteSpace: "nowrap", transition: "background 0.15s",
            }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#15803D"; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = GREEN; }}
            >
              <Icon d={icons.check} size={13} /> Aprovar
            </button>
            <button onClick={() => onReject(solution)} disabled={isLoading} style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "transparent", color: "#DC2626",
              border: "1.5px solid rgba(220,38,38,0.25)",
              borderRadius: 8, padding: "6px 12px",
              fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "rgba(220,38,38,0.07)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.25)"; } }}
            >
              <Icon d={icons.x} size={13} /> Reprovar
            </button>
          </>
        )}
      </div>
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
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const width = useWindowSize();
  const isMobile = width < 768;

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
    const sol = solutions.find(s => s.id === id);
    const version = sol?.version || 1;
    await supabase.from("solutions").update({
      status: "approved",
      last_approved_version: version,
    }).eq("id", id);
    setSolutions(prev => prev.map(s =>
      s.id === id ? { ...s, status: "approved", last_approved_version: version } : s
    ));
    setActionLoading(null);
    setSelectedSolution(prev => prev?.id === id ? null : prev);

    if (sol?.creator_id) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "solution_approved",
          user_id: sol.creator_id,
          solution_titulo: sol.titulo,
        }),
      }).catch(console.error);
    }
  }

  function handleReject(solution) { setRejectTarget(solution); }

  async function confirmReject(reason) {
    if (!rejectTarget) return;
    const targetId = rejectTarget.id;
    setActionLoading(targetId);
    await supabase.from("solutions").update({
      status: "rejected",
      rejection_reason: reason,
    }).eq("id", targetId);
    setSolutions(prev => prev.map(s =>
      s.id === targetId ? { ...s, status: "rejected", rejection_reason: reason } : s
    ));
    setActionLoading(null);
    setRejectTarget(null);
    setSelectedSolution(prev => prev?.id === targetId ? null : prev);

    if (rejectTarget?.creator_id) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "solution_rejected",
          user_id: rejectTarget.creator_id,
          solution_titulo: rejectTarget.titulo,
          rejection_reason: reason,
        }),
      }).catch(console.error);
    }
  }

  async function handleSignOut() { await signOut(); router.replace("/login"); }

  const filtered = solutions.filter(s => s.status === activeTab);
  const counts = {
    pending:  solutions.filter(s => s.status === "pending").length,
    approved: solutions.filter(s => s.status === "approved").length,
    rejected: solutions.filter(s => s.status === "rejected").length,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="admin-loading" />
          <div style={{ fontSize: 13, color: GRAY, marginTop: 16 }}>Carregando painel…</div>
        </div>
      </div>
    );
  }

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
      }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="admin-sidebar" textColor={DARK} />
          </a>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "0 16px 12px" }} />
        <div style={{ padding: "4px 16px 0" }}>
          <div style={{
            padding: "10px 12px", borderRadius: 8,
            background: "rgba(107,92,231,0.08)", color: PURPLE,
            fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
          }}>
            Curadoria
          </div>
          <div style={{ marginTop: 20, padding: "0 4px" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); if (isMobile) setSidebarOpen(false); }} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: activeTab === tab.key ? "rgba(107,92,231,0.1)" : "transparent",
                color: activeTab === tab.key ? PURPLE : GRAY,
                fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 500,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.background = "transparent"; }}
              >
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
        <div style={{ padding: "16px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 12, color: GRAY, fontWeight: 500, padding: "4px 12px 8px" }}>
            Admin · {ADMIN_EMAIL}
          </div>
          <button onClick={handleSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: "transparent", color: "#DC2626",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
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
              <WePromptLogo id="admin-mobile" textColor={DARK} />
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "24px 16px 32px" : "40px 32px" }}>
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

          {filtered.length === 0 ? (
            <div style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              borderRadius: 16,
              padding: "60px 32px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.2, color: DARK }}>
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
                  onView={sol => setSelectedSolution(sol)}
                  actionLoading={actionLoading}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedSolution && (
        <DetailDrawer
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      )}

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
