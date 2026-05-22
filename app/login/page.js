"use client";

import { useState } from "react";
import { signIn } from "../lib/supabase";
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

export default function LoginPage() {
  const [tab, setTab] = useState("entrar"); // "entrar" | "criar"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (tab === "entrar") {
      const { error } = await signIn(email, password);
      if (error) {
        setError("Email ou senha incorretos. Tente novamente.");
      } else {
        setSuccess("Login realizado com sucesso! Redirecionando…");
      }
    } else {
      // Quick signup — redirect to full cadastro for nome/role
      window.location.href = `/cadastro?email=${encodeURIComponent(email)}`;
      return;
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
        <WePromptLogo id="login" textColor={DARK} />
      </a>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.08)",
        padding: "36px 32px",
      }}>

        {/* Tab toggle */}
        <div style={{
          display: "flex",
          background: "#F3F4F6",
          borderRadius: 10,
          padding: 4,
          marginBottom: 28,
        }}>
          {[["entrar", "Entrar"], ["criar", "Criar conta"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(""); setSuccess(""); }}
              style={{
                flex: 1, padding: "8px 0",
                borderRadius: 8, border: "none",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
                background: tab === key ? "#ffffff" : "transparent",
                color: tab === key ? DARK : GRAY,
                boxShadow: tab === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: DARK, marginBottom: 4, letterSpacing: "-0.4px" }}>
          {tab === "entrar" ? "Bem-vindo de volta" : "Comece gratuitamente"}
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginBottom: 24 }}>
          {tab === "entrar"
            ? "Entre na sua conta WePrompt."
            : "Preencha seu email para criar sua conta."}
        </p>

        <form onSubmit={handleSubmit}>
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

          {tab === "entrar" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Senha</label>
                <a href="#" style={{ fontSize: 12, color: PURPLE, textDecoration: "none", fontWeight: 500 }}>
                  Esqueci minha senha
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = PURPLE)}
                onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
              />
            </div>
          )}

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
            {loading ? "Aguarde…" : tab === "entrar" ? "Entrar" : "Continuar →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 12, color: GRAY }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>

        {/* OAuth placeholder */}
        <button style={{
          width: "100%", padding: "11px",
          background: "#fff", border: "1.5px solid rgba(0,0,0,0.12)",
          borderRadius: 10, fontSize: 14, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          color: DARK, transition: "background 0.15s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuar com Google
        </button>

        <p style={{ fontSize: 13, color: GRAY, textAlign: "center", marginTop: 20 }}>
          {tab === "entrar" ? "Não tem conta? " : "Já tem conta? "}
          <a
            href={tab === "entrar" ? "/cadastro" : "/login"}
            style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}
          >
            {tab === "entrar" ? "Criar conta" : "Entrar"}
          </a>
        </p>
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
