"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BLUE       = "#0369A1";

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

const inputBase = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  fontSize: 15,
  color: NEAR_BLACK,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

function DecorativeSide() {
  return (
    <div style={{
      width: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "flex-start", justifyContent: "center",
      padding: "64px 56px",
    }}>
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-24px); }
        }
      `}</style>

      {/* Floating orbs */}
      <div style={{
        position: "absolute", top: "8%", right: "8%",
        width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(3,105,161,0.12) 0%, transparent 70%)",
        animation: "floatOrb 7s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "12%", left: "-4%",
        width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
        animation: "floatOrb 9s ease-in-out infinite 1.5s",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "45%", right: "2%",
        width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(3,105,161,0.08) 0%, transparent 70%)",
        animation: "floatOrb 5s ease-in-out infinite 3s",
        pointerEvents: "none",
      }} />

      {/* WePrompt mark */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: BLUE,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 36,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Quote */}
      <blockquote style={{
        fontSize: "clamp(22px, 2.4vw, 34px)",
        fontWeight: 800, letterSpacing: "-1px",
        color: NEAR_BLACK, lineHeight: 1.2,
        margin: "0 0 48px",
        maxWidth: 380, position: "relative",
      }}>
        "O 1º marketplace de soluções de IA da América Latina"
      </blockquote>

      {/* Stat chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "500+",    sub: "Soluções publicadas" },
          { label: "180+",    sub: "Criadores ativos" },
          { label: "10.000+", sub: "Empresas alcançadas" },
        ].map(({ label, sub }) => (
          <div key={sub} style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            background: "#fff", borderRadius: 999, padding: "12px 22px",
            boxShadow: "0 4px 20px rgba(3,105,161,0.1)",
            alignSelf: "flex-start",
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: BLUE }}>{label}</span>
            <span style={{ fontSize: 13, color: GRAY_TEXT }}>{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const width = useWindowSize();
  const isMobile = width < 768;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await signIn(email, password);
    if (error) {
      setError("Email ou senha incorretos. Tente novamente.");
      setLoading(false);
      return;
    }

    setSuccess("Login realizado com sucesso! Redirecionando…");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      const pending = localStorage.getItem("weprompt_pending_profile");
      if (pending) {
        const { nome, role: pendingRole } = JSON.parse(pending);
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({ id: data.user.id, nome, role: pendingRole });
        if (profileError) {
          console.error("[login] profile insert error:", profileError);
        } else {
          localStorage.removeItem("weprompt_pending_profile");
        }
        router.push(redirectTo || (pendingRole === "empresa" ? "/dashboard/empresa" : "/dashboard/criador"));
      } else {
        router.push("/completar-perfil");
      }
      return;
    }

    const role = profile.role;
    if (redirectTo) {
      router.push(redirectTo);
    } else if (role === "criador" || role === "creator") {
      router.push("/dashboard/criador");
    } else if (role === "empresa" || role === "business") {
      router.push("/dashboard/empresa");
    } else {
      router.push("/dashboard/criador");
    }

    setLoading(false);
  }

  const focusInput = e => {
    e.target.style.borderColor = BLUE;
    e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)";
  };
  const blurInput = e => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT: Form ── */}
      <div style={{
        flex: 1, background: "#fff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: isMobile ? "40px 24px" : "48px 64px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 40 }}>
            <WePromptLogo id="login-form" textColor={NEAR_BLACK} />
          </a>

          {/* Heading */}
          <h1 style={{
            fontSize: 30, fontWeight: 800, letterSpacing: "-0.8px",
            color: NEAR_BLACK, marginBottom: 8,
          }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 16, color: GRAY_TEXT, marginBottom: 32, lineHeight: 1.5 }}>
            Entre na sua conta WePrompt
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                Email
              </label>
              <input
                type="email" required placeholder="seu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputBase}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK }}>Senha</label>
                <a href="#" style={{ fontSize: 13, color: BLUE, textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 48 }}
                  onFocus={focusInput} onBlur={blurInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: GRAY_TEXT, display: "flex", alignItems: "center", padding: 0,
                  }}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#B91C1C", marginBottom: 16, marginTop: 10,
              }}>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#15803D", marginBottom: 16, marginTop: 10,
              }}>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(3,105,161,0.5)" : BLUE,
                color: "#fff", border: "none",
                borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                marginTop: 18,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#0284C7"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = BLUE; }}
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 13, color: GRAY_TEXT }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          {/* Ghost: create account */}
          <a href="/cadastro" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "13px",
            background: "transparent", color: BLUE,
            border: "2px solid " + BLUE,
            borderRadius: 12, fontSize: 15, fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
            boxSizing: "border-box",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(3,105,161,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Criar conta grátis →
          </a>

          {/* Back to home */}
          <a href="/" style={{
            display: "block", textAlign: "center", marginTop: 24,
            fontSize: 13, color: GRAY_TEXT, textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
            onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
          >
            ← Voltar ao início
          </a>

        </div>
      </div>

      {/* ── RIGHT: Decorative ── */}
      {!isMobile && <DecorativeSide />}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
