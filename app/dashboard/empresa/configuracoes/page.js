"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const TABS = [
  { label: "Início" },
  { label: "Soluções Adquiridas" },
  { label: "Explorar Catálogo" },
  { label: "Histórico de Compras" },
  { label: "Configurações" },
];

const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
  background: "white", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
};
const lbl = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" };
const card = { background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 };

const fi = e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; };
const fb = e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; };

export default function EmpresaConfiguracoesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(4);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const [nome, setNome] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserEmail(session.user.email || "");
      supabase.from("profiles").select("nome").eq("id", session.user.id).single()
        .then(({ data }) => { if (data?.nome) setNome(data.nome); });
    });
  }, [router]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSwitchAccount() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = nome?.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "E";

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", background: searchFocused ? "white" : "#f3f4f6", borderRadius: 8, padding: "8px 16px", width: 360, gap: 8, border: searchFocused ? "1px solid #6366F1" : "1px solid transparent", boxShadow: searchFocused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none", transition: "all 0.2s ease" }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
          <input placeholder="Buscar soluções..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard/empresa/configuracoes" style={{ textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "#6366F1", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
              {initials}
            </div>
          </a>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map((tab, i) => (
          <button key={tab.label}
            onClick={() => { if (i === 0) router.push("/dashboard/empresa"); else setActiveTab(i); }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{ fontSize: 14, padding: "14px 0", paddingRight: 20, cursor: "pointer", display: "inline-flex", alignItems: "center", border: "none", borderBottom: i === 4 ? "2px solid #111827" : "2px solid transparent", background: "transparent", color: i === 4 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280", fontWeight: i === 4 ? 600 : 400, marginBottom: -1, transition: "color 0.15s ease", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px", maxWidth: 680 }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Minha Conta</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Gerencie seu perfil e preferências.</p>
        </div>

        <form onSubmit={handleSave}>
          {/* PERFIL */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Perfil da Empresa</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Nome / Razão social</label>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da empresa" style={inp} onFocus={fi} onBlur={fb} />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input value={userEmail} readOnly style={{ ...inp, background: "#f9fafb", color: "#6b7280", cursor: "default" }} />
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            padding: "12px 28px", borderRadius: 8,
            background: saving ? "rgba(99,102,241,0.5)" : "#6366F1",
            color: "white", border: "none", fontSize: 14, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </form>

        {/* CONTA / LOGOUT */}
        <div style={{ ...card, marginTop: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Conta</h3>
          {userEmail && (
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
              Conectado como <strong style={{ color: "#374151" }}>{userEmail}</strong>
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#FEF2F2", color: "#EF4444",
                border: "1px solid #FECACA", borderRadius: 10,
                padding: "14px 28px", fontWeight: 600, fontSize: 15,
                cursor: loggingOut ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.15s",
                opacity: loggingOut ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = "#FEE2E2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; }}
            >
              <LogOut size={18} />
              {loggingOut ? "Saindo…" : "Sair da conta"}
            </button>
            <button
              type="button"
              onClick={handleSwitchAccount}
              style={{ fontSize: 14, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#374151")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
            >
              Entrar em outra conta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
