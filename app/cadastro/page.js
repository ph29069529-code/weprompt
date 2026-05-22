"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signUp } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const DARK = "#0A0A1A";
const GRAY = "#6B7280";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid rgba(0,0,0,0.12)",
  fontSize: 15,
  color: DARK,
  background: "#FAFAFA",
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

function CadastroForm() {
  const searchParams = useSearchParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState(""); // "criador" | "empresa"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!role) {
      setError("Selecione se você é Criador ou Empresa.");
      return;
    }
    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email, senha, nome, role);

    if (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } else {
      setSuccess("Conta criada! Verifique seu email para confirmar o cadastro.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F0F0FF 0%, #E8E8F8 30%, #EEF0FF 60%, #F5F0FF 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", marginBottom: 32 }}>
        <WePromptLogo id="cadastro" textColor={DARK} />
      </a>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 460,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.08)",
        padding: "36px 32px",
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK, marginBottom: 4, letterSpacing: "-0.5px" }}>
          Crie sua conta
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginBottom: 28 }}>
          Junte-se ao 1º marketplace de IA da América Latina.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Nome */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nome completo</label>
            <input
              type="text"
              required
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = PURPLE)}
              onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
            />
            {senha.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: senha.length >= n * 2
                      ? (senha.length >= 8 ? "#16A34A" : PURPLE)
                      : "rgba(0,0,0,0.1)",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Como você vai usar a WePrompt?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

              <button
                type="button"
                onClick={() => setRole("criador")}
                style={{
                  padding: "16px 12px",
                  borderRadius: 12,
                  border: `2px solid ${role === "criador" ? PURPLE : "rgba(0,0,0,0.1)"}`,
                  background: role === "criador" ? `${PURPLE}0D` : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>✦</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 3 }}>
                  Sou Criador
                </div>
                <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.4 }}>
                  Publico soluções de IA
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("empresa")}
                style={{
                  padding: "16px 12px",
                  borderRadius: 12,
                  border: `2px solid ${role === "empresa" ? PURPLE : "rgba(0,0,0,0.1)"}`,
                  background: role === "empresa" ? `${PURPLE}0D` : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>🏢</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 3 }}>
                  Sou Empresa
                </div>
                <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.4 }}>
                  Busco soluções de IA
                </div>
              </button>

            </div>
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#DC2626", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#16A34A", marginBottom: 16,
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "#9B8DE8" : PURPLE,
              color: "#fff", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 20 }}>
          Já tem conta?{" "}
          <a href="/login" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
            Entrar
          </a>
        </p>
      </div>

      <p style={{ fontSize: 12, color: GRAY, marginTop: 24, textAlign: "center" }}>
        Ao criar conta, você concorda com os{" "}
        <a href="#" style={{ color: PURPLE, textDecoration: "none" }}>Termos de Uso</a>{" "}
        e a{" "}
        <a href="#" style={{ color: PURPLE, textDecoration: "none" }}>Política de Privacidade</a>.
      </p>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroForm />
    </Suspense>
  );
}
