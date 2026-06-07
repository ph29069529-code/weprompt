"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const CRIADOR_TABS = ["Dashboard", "Minhas Soluções", "Vendas", "Configurações"];

const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
  background: "white", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
};
const lbl = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" };
const sectionCard = { background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 };

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 99,
      background: checked ? "#111827" : "#e5e7eb",
      border: "none", cursor: "pointer", padding: 0,
      position: "relative", flexShrink: 0, transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [handle, setHandle] = useState("");
  const [saving, setSaving] = useState(false);

  const [notifVenda, setNotifVenda] = useState(true);
  const [notifAvaliacao, setNotifAvaliacao] = useState(true);
  const [notifAprovacao, setNotifAprovacao] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserEmail(session.user.email || "");
      supabase.from("profiles").select("nome").eq("id", session.user.id).single()
        .then(({ data }) => { if (data?.nome) setNome(data.nome); });
    });
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSwitchAccount() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const fi = e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; };
  const fb = e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; };

  function triggerToast(msg) {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    triggerToast("Perfil salvo com sucesso!");
  }

  function handleAlterarSenha() {
    triggerToast("Email de redefinição enviado!");
  }

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* TABS ROW */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 0) router.push("/dashboard/criador");
              else if (i === 1) router.push("/dashboard/criador/solucoes");
              else if (i === 2) router.push("/dashboard/criador/vendas");
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: "14px 20px 14px 0", marginRight: 8, cursor: "pointer",
              display: "inline-flex", alignItems: "center", border: "none",
              borderBottom: i === 3 ? "2px solid #111827" : "2px solid transparent",
              background: "transparent",
              color: i === 3 ? "#111827" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: i === 3 ? 600 : 400,
              marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "24px 32px", maxWidth: 720 }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Configurações</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Gerencie seu perfil e preferências.</p>
        </div>

        <form onSubmit={handleSave}>

          {/* PERFIL */}
          <div style={sectionCard}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Perfil</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Nome</label>
                <input value={nome} onChange={e => setNome(e.target.value)} style={inp} onFocus={fi} onBlur={fb} />
              </div>
              <div>
                <label style={lbl}>@handle</label>
                <input value={handle} onChange={e => setHandle(e.target.value)} style={inp} onFocus={fi} onBlur={fb} placeholder="seunome" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Bio</label>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
                style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} onFocus={fi} onBlur={fb}
                placeholder="Fale um pouco sobre você..." />
            </div>
            <div>
              <label style={lbl}>Foto de perfil</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 999, background: "#6366F1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 20, fontWeight: 700, flexShrink: 0,
                }}>C</div>
                <button type="button" style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: "white", fontSize: 13, fontWeight: 500, color: "#374151",
                  cursor: "pointer", fontFamily: "inherit",
                }}>Alterar foto</button>
              </div>
            </div>
          </div>

          {/* PAGAMENTOS */}
          <div style={sectionCard}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Pagamentos</h3>
            <div style={{
              background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.08)", borderRadius: 10,
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: "#6366F1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>S</span>
                </div>
                <svg width="16" height="16" fill="none" stroke="#6366F1" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#6366F1" }}>Stripe Conectado</span>
                <span style={{ color: "#9ca3af" }}>·</span>
                <span style={{ fontSize: 14, color: "#6b7280" }}>Pagamentos habilitados</span>
              </div>
              <button type="button" onClick={() => window.open("https://dashboard.stripe.com", "_blank")} style={{
                fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer",
                border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px", background: "white",
              }}>
                Gerenciar Pagamentos ↗
              </button>
            </div>
          </div>

          {/* NOTIFICAÇÕES */}
          <div style={sectionCard}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Notificações</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Nova venda",        sub: "Receba um aviso quando alguém adquirir sua solução",   checked: notifVenda,    set: setNotifVenda },
                { label: "Nova avaliação",     sub: "Seja notificado quando um comprador deixar avaliação", checked: notifAvaliacao, set: setNotifAvaliacao },
                { label: "Solução aprovada",   sub: "Aviso quando uma solução for aprovada pelo time WePrompt", checked: notifAprovacao, set: setNotifAprovacao },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Toggle checked={item.checked} onChange={item.set} />
                </div>
              ))}
            </div>
          </div>

          {/* SEGURANÇA */}
          <div style={sectionCard}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Segurança</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={lbl}>Senha atual</label>
                <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" style={inp} onFocus={fi} onBlur={fb} />
              </div>
              <div>
                <label style={lbl}>Nova senha</label>
                <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Mínimo 8 caracteres" style={inp} onFocus={fi} onBlur={fb} />
              </div>
              <div>
                <label style={lbl}>Confirmar nova senha</label>
                <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repita a nova senha" style={inp} onFocus={fi} onBlur={fb} />
              </div>
              <button
                type="button"
                onClick={handleAlterarSenha}
                style={{
                  alignSelf: "flex-start", padding: "10px 20px", borderRadius: 8,
                  border: "1px solid #e5e7eb", background: "white",
                  fontSize: 14, fontWeight: 500, color: "#374151",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Alterar Senha
              </button>
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            padding: "12px 28px", borderRadius: 8,
            background: saving ? "rgba(17,24,39,0.5)" : "#111827",
            color: "white", border: "none", fontSize: 14, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>

        </form>

        {/* CONTA */}
        <div style={{ ...sectionCard, marginTop: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Conta</h3>
          {userEmail && (
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Conectado como <strong style={{ color: "#374151" }}>{userEmail}</strong></p>
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

      {/* TOAST */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#6366F1", color: "white",
          padding: "12px 20px", borderRadius: 8,
          fontSize: 14, zIndex: 100,
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
