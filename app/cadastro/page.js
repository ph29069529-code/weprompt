"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signUp, supabase } from "../lib/supabase";
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
        maxWidth: 380,
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

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingUser, setExistingUser] = useState(null);
  const width = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setExistingUser(session.user);
        setEmail(session.user.email || "");
      }
    }
    checkSession();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!role) { setError("Selecione se você é Criador ou Empresa."); return; }
    if (!termsAccepted) { setError("Aceite os Termos de Uso para continuar."); return; }
    setLoading(true);

    if (existingUser) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: existingUser.id, nome, role });
      if (profileError) {
        setError(profileError.message || "Erro ao salvar perfil. Tente novamente.");
        setLoading(false);
        return;
      }
      router.replace(redirectTo || (role === "criador" ? "/dashboard/criador" : "/dashboard/empresa"));
      return;
    }

    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(email, senha, nome, role);
    if (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    // Fire-and-forget welcome email
    fetch("/api/emails/boas-vindas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nome, role }),
    }).catch(() => {});

    if (data.session) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.session.user.id, nome, role });
      if (profileError) console.error("[cadastro] profile insert error:", profileError);
      router.replace(redirectTo || (role === "criador" ? "/dashboard/criador" : "/dashboard/empresa"));
    } else {
      localStorage.setItem("weprompt_pending_profile", JSON.stringify({ nome, role }));
      setSuccess("Conta criada! Verifique seu email para confirmar o cadastro.");
      setLoading(false);
    }
  }

  const focusInput = e => {
    e.target.style.borderColor = BLUE;
    e.target.style.boxShadow = "0 0 0 3px rgba(3,105,161,0.1)";
  };
  const blurInput = e => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  const strengthSegments = Math.min(Math.floor(senha.length / 2), 4);
  const strengthColor = senha.length >= 8 ? "#15803D" : BLUE;

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
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 36 }}>
            <WePromptLogo id="cadastro-form" textColor={NEAR_BLACK} />
          </a>

          {/* Heading */}
          <h1 style={{
            fontSize: 30, fontWeight: 800, letterSpacing: "-0.8px",
            color: NEAR_BLACK, marginBottom: 8,
          }}>
            {existingUser ? "Complete seu perfil" : "Criar sua conta"}
          </h1>
          <p style={{ fontSize: 16, color: GRAY_TEXT, marginBottom: 28, lineHeight: 1.5 }}>
            {existingUser
              ? "Falta pouco! Preencha seu nome e escolha seu perfil."
              : "Junte-se ao 1º marketplace de IA da América Latina."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 10, display: "block" }}>
                Como você vai usar a WePrompt?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { value: "empresa", icon: "🏢", title: "Sou uma Empresa", sub: "Busco soluções de IA" },
                  { value: "criador", icon: "✦",  title: "Sou um Criador",  sub: "Publico soluções de IA" },
                ].map(opt => (
                  <button
                    key={opt.value} type="button"
                    onClick={() => setRole(opt.value)}
                    style={{
                      padding: "16px 14px", borderRadius: 14, textAlign: "left",
                      border: `2px solid ${role === opt.value ? BLUE : "#e5e7eb"}`,
                      background: role === opt.value ? "rgba(3,105,161,0.05)" : "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "rgba(3,105,161,0.4)"; }}
                    onMouseLeave={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{opt.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: role === opt.value ? BLUE : NEAR_BLACK, marginBottom: 3 }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: 12, color: GRAY_TEXT, lineHeight: 1.4 }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                Nome completo
              </label>
              <input
                type="text" required placeholder="Seu nome"
                value={nome} onChange={e => setNome(e.target.value)}
                style={inputBase}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                Email
              </label>
              <input
                type="email" required placeholder="seu@email.com"
                value={email}
                onChange={e => !existingUser && setEmail(e.target.value)}
                readOnly={!!existingUser}
                style={{
                  ...inputBase,
                  ...(existingUser ? { background: "#f9fafb", color: GRAY_TEXT, cursor: "default" } : {}),
                }}
                onFocus={e => { if (!existingUser) focusInput(e); }}
                onBlur={blurInput}
              />
            </div>

            {/* Password */}
            {!existingUser && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"} required placeholder="Mínimo 8 caracteres"
                    value={senha} onChange={e => setSenha(e.target.value)}
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
                {/* Password strength bar */}
                {senha.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: n <= strengthSegments ? strengthColor : "rgba(0,0,0,0.1)",
                        transition: "background 0.2s",
                      }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Terms checkbox */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 22 }}>
              <input
                type="checkbox" id="terms"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: BLUE, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.5, cursor: "pointer" }}>
                Li e aceito os{" "}
                <a href="/para-criadores/termos" style={{ color: BLUE, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="/para-empresas/termos" style={{ color: BLUE, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  Política de Privacidade
                </a>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#B91C1C", marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#15803D", marginBottom: 16,
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
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#0284C7"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = BLUE; }}
            >
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </form>

          {/* Already have account */}
          <p style={{ fontSize: 13, color: GRAY_TEXT, textAlign: "center", marginTop: 24 }}>
            Já tenho conta{" "}
            <a href="/login" style={{ color: BLUE, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              → Entrar
            </a>
          </p>

        </div>
      </div>

      {/* ── RIGHT: Decorative ── */}
      {!isMobile && <DecorativeSide />}

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
