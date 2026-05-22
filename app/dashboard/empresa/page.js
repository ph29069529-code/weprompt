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

/* ── Icons ── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  subscriptions: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  explore: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  arrow: "M3 8h10M9 4l4 4-4 4",
};

/* ── Stat card ── */
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 24px",
      flex: 1, minWidth: 0,
      borderTop: `3px solid ${accent || PURPLE}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── Sidebar nav item ── */
function NavItem({ icon, label, active, onClick, external, href }) {
  const content = (
    <>
      <span style={{ opacity: active ? 1 : 0.6 }}><Icon d={icon} size={16} /></span>
      {label}
    </>
  );

  const baseStyle = {
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "10px 16px", borderRadius: 10,
    background: active ? `${PURPLE}12` : "transparent",
    color: active ? PURPLE : "#374151",
    fontSize: 14, fontWeight: active ? 600 : 500,
    cursor: "pointer", fontFamily: "inherit",
    textAlign: "left",
    transition: "background 0.15s, color 0.15s",
    textDecoration: "none",
  };

  if (href) {
    return (
      <a href={href} style={{ ...baseStyle, border: "none" }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={{ ...baseStyle, border: "none" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {content}
    </button>
  );
}

/* ── Cancel confirm dialog ── */
function CancelDialog({ solution, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(10,10,26,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        width: "100%", maxWidth: 420,
        padding: "32px",
        animation: "modalIn 0.2s ease",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#FEF2F2",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          color: RED,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
          </svg>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>
          Cancelar assinatura?
        </h2>
        <p style={{ fontSize: 14, color: GRAY, margin: "0 0 24px", lineHeight: 1.6 }}>
          Você está prestes a cancelar a assinatura de{" "}
          <strong style={{ color: DARK }}>{solution}</strong>.
          {" "}Você perderá o acesso ao fim do período atual.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 10,
            border: "1.5px solid rgba(0,0,0,0.12)",
            background: "transparent", color: GRAY,
            fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Manter assinatura
          </button>
          <button onClick={handleConfirm} disabled={loading} style={{
            padding: "10px 20px", borderRadius: 10,
            background: loading ? "#EF8888" : RED,
            color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}>
            {loading ? "Cancelando…" : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Subscription card ── */
function SubscriptionCard({ sub, onCancel }) {
  const solution = sub.solutions;
  const statusActive = sub.status === "active";

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      {/* Color accent bar */}
      <div style={{
        width: 4, height: 48, borderRadius: 99, flexShrink: 0,
        background: statusActive
          ? `linear-gradient(180deg, ${PURPLE}, #38BDF8)`
          : "rgba(0,0,0,0.12)",
      }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4 }}>
          {solution?.titulo || "Solução removida"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {solution?.categoria && (
            <span style={{
              display: "inline-block",
              background: `${PURPLE}12`, color: PURPLE,
              padding: "2px 8px", borderRadius: 99,
              fontSize: 11, fontWeight: 600,
            }}>
              {solution.categoria}
            </span>
          )}
          <span style={{ fontSize: 12, color: GRAY }}>
            Desde {new Date(sub.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: DARK }}>
          {solution?.preco != null
            ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "Gratuito"}
        </div>
        {solution?.preco != null && (
          <div style={{ fontSize: 11, color: GRAY }}>/mês</div>
        )}
      </div>

      {/* Status badge */}
      <div style={{
        padding: "4px 12px", borderRadius: 99, flexShrink: 0,
        background: statusActive ? "#F0FDF4" : "#FEF2F2",
        border: `1px solid ${statusActive ? "#BBF7D0" : "#FECACA"}`,
        fontSize: 12, fontWeight: 600,
        color: statusActive ? GREEN : RED,
      }}>
        {statusActive ? "Ativa" : "Cancelada"}
      </div>

      {/* Cancel button */}
      {statusActive && (
        <button
          onClick={onCancel}
          style={{
            padding: "8px 16px", borderRadius: 8, flexShrink: 0,
            border: "1.5px solid rgba(220,38,38,0.2)",
            background: "transparent", color: RED,
            fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#FEF2F2";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
          }}
        >
          Cancelar
        </button>
      )}
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
  const [activeNav, setActiveNav] = useState("subscriptions");
  const [cancelTarget, setCancelTarget] = useState(null); // { id, titulo }

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const u = session.user;
      setUser(u);

      const [profileRes, subsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase
          .from("subscriptions")
          .select("*, solutions(*)")
          .eq("business_id", u.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (subsRes.data) setSubscriptions(subsRes.data);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  async function handleCancel(subId) {
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subId);

    setSubscriptions(prev =>
      prev.map(s => s.id === subId ? { ...s, status: "cancelled" } : s)
    );
    setCancelTarget(null);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: LIGHT_BG,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="empresa-loading" textColor={DARK} />
          <div style={{ fontSize: 13, color: GRAY, marginTop: 16 }}>Carregando dashboard…</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split("@")[0] || "Empresa";

  const activeSubs = subscriptions.filter(s => s.status === "active");
  const monthlySpend = activeSubs.reduce((sum, s) => sum + (s.solutions?.preco || 0), 0);

  const navItems = [
    { key: "subscriptions", icon: icons.subscriptions, label: "Minhas Assinaturas" },
    { key: "explore", icon: icons.explore, label: "Explorar Soluções", href: "/solucoes" },
    { key: "settings", icon: icons.settings, label: "Configurações" },
  ];

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
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="empresa-sidebar" textColor={DARK} />
          </a>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 16px 16px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={item.href ? undefined : () => setActiveNav(item.key)}
              href={item.href}
            />
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(22,163,74,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: GREEN, flexShrink: 0,
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: GRAY }}>Empresa</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 10, border: "none",
            background: "transparent", color: RED,
            fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            textAlign: "left",
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
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>

          {/* ── MINHAS ASSINATURAS ── */}
          {activeNav === "subscriptions" && (
            <>
              {/* Page header */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
                  Minhas Assinaturas
                </h1>
                <p style={{ fontSize: 14, color: GRAY, margin: "4px 0 0" }}>
                  Gerencie todas as soluções de IA que sua empresa utiliza.
                </p>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                <StatCard
                  label="Assinaturas ativas"
                  value={activeSubs.length}
                  sub={subscriptions.length > activeSubs.length
                    ? `${subscriptions.length - activeSubs.length} cancelada(s)`
                    : "Todas ativas"}
                  accent={PURPLE}
                />
                <StatCard
                  label="Gasto mensal"
                  value={monthlySpend > 0
                    ? `R$ ${monthlySpend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "R$ 0"}
                  sub={activeSubs.length > 0 ? `em ${activeSubs.length} solução(ões)` : "Sem assinaturas ativas"}
                  accent="#16A34A"
                />
              </div>

              {/* Subscriptions list */}
              {subscriptions.length === 0 ? (
                <div style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.07)",
                  padding: "60px 32px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                    Você ainda não assinou nenhuma solução.
                  </h2>
                  <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
                    Explore o marketplace e encontre ferramentas de IA prontas para o seu negócio.
                  </p>
                  <a
                    href="/solucoes"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: PURPLE, color: "#fff",
                      border: "none", borderRadius: 10,
                      padding: "11px 24px", fontSize: 14, fontWeight: 600,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
                    }}
                  >
                    Explorar soluções
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Active first, then cancelled */}
                  {[...subscriptions]
                    .sort((a, b) => {
                      if (a.status === b.status) return 0;
                      return a.status === "active" ? -1 : 1;
                    })
                    .map(sub => (
                      <SubscriptionCard
                        key={sub.id}
                        sub={sub}
                        onCancel={() => setCancelTarget({ id: sub.id, titulo: sub.solutions?.titulo || "esta solução" })}
                      />
                    ))}
                </div>
              )}
            </>
          )}

          {/* ── PLACEHOLDER: CONFIGURAÇÕES ── */}
          {activeNav === "settings" && (
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "80px 32px", textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: 0.2 }}>
                <Icon d={icons.settings} size={48} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                Configurações
              </h2>
              <p style={{ fontSize: 14, color: GRAY }}>Esta seção estará disponível em breve.</p>
            </div>
          )}

        </div>
      </main>

      {/* ── CANCEL DIALOG ── */}
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
