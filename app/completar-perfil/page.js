"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";
const BORDER = "rgba(0,0,0,0.1)";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: `1.5px solid ${BORDER}`,
  fontSize: 15,
  color: DARK,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: DARK,
  marginBottom: 6,
  display: "block",
};

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/login"); return; }
      setUser(session.user);
    }
    checkSession();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!role) { setError("Selecione se você é Criador ou Empresa."); return; }
    setLoading(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: user.id, nome, role });

    if (profileError) {
      setError(profileError.message || "Erro ao salvar perfil. Tente novamente.");
      setLoading(false);
      return;
    }

    router.replace(role === "criador" ? "/dashboard/criador" : "/dashboard/empresa");
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <a href="/" style={{ textDecoration: "none", marginBottom: 32 }}>
        <WePromptLogo id="completar-perfil" />
      </a>

      <div style={{
        width: "100%", maxWidth: 460,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        padding: "36px 32px",
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK, marginBottom: 4, letterSpacing: "-0.5px" }}>
          Complete seu perfil
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginBottom: 28 }}>
          Falta pouco! Preencha seu nome e escolha seu perfil.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nome completo</label>
            <input
              type="text" required placeholder="Seu nome"
              value={nome} onChange={e => setNome(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Como você vai usar a WePrompt?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { value: "criador", icon: "✦", title: "Sou Criador", sub: "Publico soluções de IA" },
                { value: "empresa", icon: "🏢", title: "Sou Empresa", sub: "Busco soluções de IA" },
              ].map(opt => (
                <button
                  key={opt.value} type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    padding: "16px 12px", borderRadius: 12, textAlign: "left",
                    border: `2px solid ${role === opt.value ? PURPLE : "rgba(0,0,0,0.1)"}`,
                    background: role === opt.value ? "rgba(107,92,231,0.07)" : "#fff",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 3 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.4 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#B91C1C", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "rgba(107,92,231,0.5)" : "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
              color: "#fff", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: loading ? "none" : "0 4px 20px rgba(107,92,231,0.3)",
            }}
          >
            {loading ? "Salvando…" : "Salvar perfil"}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: GRAY, marginTop: 24, textAlign: "center" }}>
        Ao continuar, você concorda com os{" "}
        <a href="#" style={{ color: PURPLE, textDecoration: "none" }}>Termos de Uso</a>{" "}
        e a{" "}
        <a href="#" style={{ color: PURPLE, textDecoration: "none" }}>Política de Privacidade</a>.
      </p>
    </div>
  );
}
