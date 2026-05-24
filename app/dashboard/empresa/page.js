"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";
import WePromptLogo from "../../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.08)";

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

const icons = {
  subscriptions: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  explore: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

function StatCard({ label, value, sub, accentColor }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 14,
      padding: "20px 24px",
      flex: 1, minWidth: 0,
      borderTop: `3px solid ${accentColor || PURPLE}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, href }) {
  const content = (
    <>
      <span style={{ opacity: active ? 1 : 0.6 }}><Icon d={icon} size={16} /></span>
      {label}
    </>
  );
  const baseStyle = {
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "10px 16px", borderRadius: 10,
    background: active ? "rgba(107,92,231,0.1)" : "transparent",
    color: active ? PURPLE : GRAY,
    fontSize: 14, fontWeight: active ? 600 : 500,
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    transition: "background 0.15s, color 0.15s", textDecoration: "none",
  };
  if (href) {
    return (
      <a href={href} style={{ ...baseStyle, border: "none" }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} style={{ ...baseStyle, border: "none" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      {content}
    </button>
  );
}

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
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        boxShadow: "0 16px 60px rgba(0,0,0,0.12)",
        width: "100%", maxWidth: 420, padding: "32px",
        animation: "modalIn 0.2s ease",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, color: "#DC2626",
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
          <strong style={{ color: DARK }}>{solution}</strong>.{" "}
          Você perderá o acesso ao fim do período atual.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 10,
            border: `1.5px solid ${BORDER}`,
            background: "transparent", color: GRAY,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Manter assinatura
          </button>
          <button onClick={handleConfirm} disabled={loading} style={{
            padding: "10px 20px", borderRadius: 10,
            background: loading ? "rgba(220,38,38,0.4)" : "#DC2626",
            color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {loading ? "Cancelando…" : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionCard({ sub, onCancel, isMobile }) {
  const solution = sub.solutions;
  const statusActive = sub.status === "active";
  const isOneTime = solution?.payment_type === "one_time";
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 14,
      padding: isMobile ? "14px 16px" : "20px 24px",
      display: "flex", alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 10 : 20, flexWrap: isMobile ? "wrap" : "nowrap",
      overflow: "hidden",
    }}>
      <div style={{
        width: 4, height: 48, borderRadius: 99, flexShrink: 0,
        background: statusActive
          ? "linear-gradient(180deg, #6B5CE7, #8B5CF6)"
          : "rgba(0,0,0,0.12)",
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {solution?.titulo || "Solução removida"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {solution?.categoria && (
            <span style={{
              display: "inline-block",
              background: "rgba(107,92,231,0.08)", color: PURPLE,
              padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600,
            }}>
              {solution.categoria}
            </span>
          )}
          <span style={{ fontSize: 12, color: GRAY }}>
            Desde {new Date(sub.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: isMobile ? "space-between" : "flex-end",
        gap: 10, flex: isMobile ? "1 1 100%" : "0 0 auto",
        marginTop: isMobile ? 4 : 0,
      }}>
        <div style={{ textAlign: isMobile ? "left" : "right" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: DARK }}>
            {solution?.preco != null
              ? `R$ ${Number(solution.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Gratuito"}
          </div>
          {solution?.preco != null && (
            <div style={{ fontSize: 11, color: GRAY }}>{isOneTime ? "único" : "/mês"}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            padding: "4px 12px", borderRadius: 99,
            background: statusActive ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
            border: `1px solid ${statusActive ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)"}`,
            fontSize: 12, fontWeight: 600,
            color: statusActive ? "#15803D" : "#B91C1C",
            whiteSpace: "nowrap",
          }}>
            {statusActive ? "Ativa" : "Cancelada"}
          </div>
          {statusActive && (
            <button onClick={onCancel} style={{
              padding: "8px 16px", borderRadius: 8,
              border: "1.5px solid rgba(220,38,38,0.25)",
              background: "transparent", color: "#DC2626",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s, border-color 0.15s",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.07)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.25)"; }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Settings form (Empresa) ── */
function SettingsEmpresa({ user, profile, isMobile, onProfileUpdate }) {
  const [nome, setNome] = useState(profile?.nome || "");
  const [cnpj, setCnpj] = useState(profile?.cnpj || "");
  const [segmento, setSegmento] = useState(profile?.segmento || "");
  const [site, setSite] = useState(profile?.site || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  const fldStyle = {
    width: "100%", padding: "10px 14px",
    borderRadius: 10, border: `1.5px solid ${BORDER}`,
    fontSize: 14, color: DARK, background: "#fff",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const lbl = { fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, display: "block" };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    setSaveError("");

    const updates = { nome, cnpj, segmento, site };
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) {
      setSaveError("Erro ao salvar. Tente novamente.");
    } else {
      setSaveMsg("Alterações salvas!");
      onProfileUpdate({ ...profile, ...updates });
      setTimeout(() => setSaveMsg(""), 3000);
    }
    setSaving(false);
  }

  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      borderRadius: 16, padding: isMobile ? "24px 20px" : "32px",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 24 }}>Configurações</h2>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nome da empresa</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Email</label>
          <input type="email" value={user?.email || ""} readOnly
            style={{ ...fldStyle, background: "#f9fafb", color: GRAY, cursor: "default" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>CNPJ</label>
          <input type="text" value={cnpj} onChange={e => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00" style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Segmento / Setor</label>
          <input type="text" value={segmento} onChange={e => setSegmento(e.target.value)}
            placeholder="Ex: Varejo, Saúde, Tecnologia…" style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={lbl}>Site da empresa</label>
          <input type="url" value={site} onChange={e => setSite(e.target.value)}
            placeholder="https://suaempresa.com.br" style={fldStyle}
            onFocus={e => (e.target.style.borderColor = PURPLE)}
            onBlur={e => (e.target.style.borderColor = BORDER)} />
        </div>

        {saveError && (
          <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>
            {saveError}
          </div>
        )}
        {saveMsg && (
          <div style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#15803D", marginBottom: 16 }}>
            {saveMsg}
          </div>
        )}

        <button type="submit" disabled={saving} style={{
          padding: "11px 24px", borderRadius: 10,
          background: saving ? "rgba(107,92,231,0.5)" : "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
          color: "#fff", border: "none", fontSize: 14, fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
          boxShadow: saving ? "none" : "0 4px 12px rgba(107,92,231,0.25)",
        }}>
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}

export default function EmpresaDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("subscriptions");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const width = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    async function init() {
      const { data: { user: u }, error: userError } = await supabase.auth.getUser();
      if (userError || !u) { router.replace("/login"); return; }

      console.log("[empresa] user.id:", u.id);
      setUser(u);

      const [profileRes, subsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase
          .from("subscriptions")
          .select("*, solutions(*)")
          .eq("business_id", u.id)
          .order("created_at", { ascending: false }),
      ]);

      console.log("[empresa] subscriptions data:", subsRes.data);
      console.log("[empresa] subscriptions error:", subsRes.error);

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
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", subId);
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: "cancelled" } : s));
    setCancelTarget(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <WePromptLogo id="empresa-loading" />
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
        overflowY: "auto",
      }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <WePromptLogo id="empresa-sidebar" textColor={DARK} />
          </a>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "0 16px 16px" }} />
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={item.href ? undefined : () => { setActiveNav(item.key); if (isMobile) setSidebarOpen(false); }}
              href={item.href}
            />
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(22,163,74,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#15803D", flexShrink: 0,
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
            background: "transparent", color: "#DC2626",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
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
              <WePromptLogo id="empresa-mobile" textColor={DARK} />
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
        <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "24px 16px 32px" : "40px 32px" }}>

          {activeNav === "subscriptions" && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
                  Minhas Assinaturas
                </h1>
                <p style={{ fontSize: 14, color: GRAY, margin: "4px 0 0" }}>
                  Gerencie todas as soluções de IA que sua empresa utiliza.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
                <StatCard
                  label="Assinaturas ativas"
                  value={activeSubs.length}
                  sub={subscriptions.length > activeSubs.length
                    ? `${subscriptions.length - activeSubs.length} cancelada(s)`
                    : "Todas ativas"}
                  accentColor={PURPLE}
                />
                <StatCard
                  label="Gasto mensal"
                  value={monthlySpend > 0
                    ? `R$ ${monthlySpend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "R$ 0"}
                  sub={activeSubs.length > 0 ? `em ${activeSubs.length} solução(ões)` : "Sem assinaturas ativas"}
                  accentColor="#15803D"
                />
              </div>

              {subscriptions.length === 0 ? (
                <div style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  borderRadius: 16, padding: "60px 32px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                    Você ainda não assinou nenhuma solução.
                  </h2>
                  <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
                    Explore o marketplace e encontre ferramentas de IA prontas para o seu negócio.
                  </p>
                  <a href="/solucoes" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
                    color: "#fff", borderRadius: 10,
                    padding: "11px 24px", fontSize: 14, fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(107,92,231,0.3)",
                  }}>
                    Explorar soluções
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                        isMobile={isMobile}
                      />
                    ))}
                </div>
              )}
            </>
          )}

          {activeNav === "settings" && (
            <SettingsEmpresa
              user={user}
              profile={profile}
              isMobile={isMobile}
              onProfileUpdate={setProfile}
            />
          )}

        </div>
      </main>

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
