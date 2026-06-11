"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { ShieldCheck, MessageCircle, Users } from "lucide-react";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

const NEAR_BLACK = "#0A0F1E";
const GRAY_TEXT  = "#6B7280";
const ACCENT     = "#6366F1";
const ACCENT_HOVER = "#4F46E5";

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
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
  border: "1.5px solid #E5E7EB",
  fontSize: 15,
  color: NEAR_BLACK,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const PILLS = [
  { Icon: ShieldCheck, label: "Soluções testadas e curadas" },
  { Icon: MessageCircle, label: "Suporte em português" },
  { Icon: Users, label: "Comunidade exclusiva" },
];

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

function BrandSide() {
  return (
    <div style={{
      width: "50%", flexShrink: 0, background: "#0A0F1E",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "64px 56px",
    }}>
      <div style={{ maxWidth: 360, width: "100%" }}>
        <img src="/logo-white.png" alt="WePrompt" style={{ width: 140, height: "auto" }} />
        <p style={{
          color: "#fff", fontSize: 32, fontWeight: 900,
          lineHeight: 1.2, margin: "32px 0 0", letterSpacing: "-0.04em",
        }}>
          IA que trabalha pelo seu negócio.
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 16, lineHeight: 1.6 }}>
          Marketplace de soluções de IA para o Brasil.
        </p>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {PILLS.map(({ Icon, label }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Icon size={20} color={ACCENT} />
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const msg        = searchParams.get("msg");
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
    setError(""); setSuccess(""); setLoading(true);

    let res, data;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      data = await res.json();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
      return;
    }

    if (res.status === 429) {
      setError("Muitas tentativas. Tente novamente em 15 minutos.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError("Email ou senha incorretos. Tente novamente.");
      setLoading(false);
      return;
    }

    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    setSuccess("Login realizado com sucesso! Redirecionando…");

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", data.user.id).single();

    if (!profile) {
      const pending = localStorage.getItem("weprompt_pending_profile");
      if (pending) {
        const { nome, role: pendingRole } = JSON.parse(pending);
        const { error: profileError } = await supabase
          .from("profiles").insert({ id: data.user.id, nome, role: pendingRole });
        if (profileError) console.error("[login] profile insert error:", profileError);
        else localStorage.removeItem("weprompt_pending_profile");
        router.push(redirectTo || (pendingRole === "empresa" ? "/dashboard/empresa" : "/dashboard/criador"));
      } else {
        router.push("/completar-perfil");
      }
      return;
    }

    const role = profile.role;
    if (redirectTo) {
      router.push(redirectTo);
    } else if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "criador" || role === "creator") {
      router.push("/dashboard/criador");
    } else if (role === "empresa" || role === "business") {
      router.push("/dashboard/empresa");
    } else {
      router.push("/dashboard/empresa");
    }
    setLoading(false);
  }

  const focusInput = e => {
    e.target.style.borderColor = ACCENT;
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
  };
  const blurInput = e => {
    e.target.style.borderColor = "#E5E7EB";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* LEFT: Form */}
      <div style={{
        flex: 1, background: "#fff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: isMobile ? "40px 24px" : "48px 64px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 40 }}>
            <img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} />
          </a>

          {(msg === "ver-solucao" || msg === "catalogo") && (
            <div style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 24,
              fontSize: 14, color: "#4F46E5", lineHeight: 1.5,
            }}>
              {msg === "catalogo"
                ? "🔒 Faça login para explorar as soluções disponíveis."
                : "🔒 Crie sua conta gratuita para ver os detalhes desta solução."}
            </div>
          )}

          <h1 style={{
            fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em",
            color: NEAR_BLACK, marginBottom: 8,
          }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 16, color: GRAY_TEXT, marginBottom: 32, lineHeight: 1.5 }}>
            Entre na sua conta WePrompt
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                Email
              </label>
              <input
                type="email" required placeholder="seu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputBase} onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK }}>Senha</label>
                <a href="#" style={{ fontSize: 13, color: ACCENT, textDecoration: "none", fontWeight: 500 }}
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
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: GRAY_TEXT, display: "flex", alignItems: "center", padding: 0,
                }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#B91C1C", marginBottom: 16, marginTop: 10,
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#15803D", marginBottom: 16, marginTop: 10,
              }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
              color: "#fff", border: "none", borderRadius: 999,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", marginTop: 18,
              boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
              transition: "opacity 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
            >
              {loading && <Spinner />}
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 13, color: GRAY_TEXT }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          <a href="/cadastro" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "13px",
            background: "transparent", color: "#6366F1",
            border: "1.5px solid #6366F1",
            borderRadius: 999, fontSize: 15, fontWeight: 600,
            textDecoration: "none", transition: "background 0.15s", boxSizing: "border-box",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Criar conta grátis →
          </a>

          <a href="/" style={{
            display: "block", textAlign: "center", marginTop: 24,
            fontSize: 13, color: GRAY_TEXT, textDecoration: "none", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = NEAR_BLACK}
            onMouseLeave={e => e.currentTarget.style.color = GRAY_TEXT}
          >
            ← Voltar ao início
          </a>
        </div>
      </div>

      {!isMobile && <BrandSide />}
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
