"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signUp, supabase } from "../lib/supabase";
import { ShieldCheck, MessageCircle, Users } from "lucide-react";
import Spinner from "../components/Spinner";

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
  border: "1px solid #D1D5DB",
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
          color: "#fff", fontSize: 32, fontWeight: 800,
          lineHeight: 1.2, margin: "32px 0 0", letterSpacing: "-0.03em",
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
    setError(""); setSuccess("");
    if (!role) { setError("Selecione se você é Criador ou Empresa."); return; }
    if (!termsAccepted) { setError("Aceite os Termos de Uso para continuar."); return; }
    setLoading(true);

    if (existingUser) {
      const { error: profileError } = await supabase
        .from("profiles").insert({ id: existingUser.id, nome, role });
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

    if (data.session) {
      fetch("/api/emails/boas-vindas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ nome, role }),
      }).catch(() => {});
    }

    if (data.session) {
      const { error: profileError } = await supabase
        .from("profiles").insert({ id: data.session.user.id, nome, role });
      if (profileError) console.error("[cadastro] profile insert error:", profileError);
      router.replace(redirectTo || (role === "criador" ? "/dashboard/criador" : "/dashboard/empresa"));
    } else {
      localStorage.setItem("weprompt_pending_profile", JSON.stringify({ nome, role }));
      setSuccess("Conta criada! Verifique seu email para confirmar o cadastro.");
      setLoading(false);
    }
  }

  const focusInput = e => {
    e.target.style.borderColor = ACCENT;
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
  };
  const blurInput = e => {
    e.target.style.borderColor = "#D1D5DB";
    e.target.style.boxShadow = "none";
  };

  const strengthSegments = Math.min(Math.floor(senha.length / 2), 4);
  const strengthColor = senha.length >= 8 ? "#15803D" : ACCENT;

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
        <div style={{ width: "100%", maxWidth: 420 }}>

          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 36 }}>
            <img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} />
          </a>

          <h1 style={{
            fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em",
            color: NEAR_BLACK, marginBottom: 8,
          }}>
            {existingUser ? "Complete seu perfil" : "Crie sua conta"}
          </h1>
          <p style={{ fontSize: 16, color: GRAY_TEXT, marginBottom: 28, lineHeight: 1.5 }}>
            {existingUser
              ? "Falta pouco! Preencha seu nome e escolha seu perfil."
              : "Grátis para começar. Sem cartão de crédito."}
          </p>

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
                      border: `2px solid ${role === opt.value ? ACCENT : "#E5E7EB"}`,
                      background: role === opt.value ? "rgba(99,102,241,0.04)" : "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                    onMouseLeave={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "#E5E7EB"; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8, color: role === opt.value ? ACCENT : "#9CA3AF" }}>
                      {opt.icon}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: role === opt.value ? ACCENT : NEAR_BLACK, marginBottom: 3 }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: 12, color: GRAY_TEXT, lineHeight: 1.4 }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Founder banner */}
            {role === "criador" && (
              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🏅</span>
                <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
                  <strong>Você está se cadastrando como Criador Fundador</strong> — 1 mês grátis no plano Pro liberado automaticamente após cadastro.
                </div>
              </div>
            )}

            {/* Full name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: NEAR_BLACK, marginBottom: 8, display: "block" }}>
                Nome completo
              </label>
              <input
                type="text" required placeholder="Seu nome"
                value={nome} onChange={e => setNome(e.target.value)}
                style={inputBase} onFocus={focusInput} onBlur={blurInput}
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
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: GRAY_TEXT, display: "flex", alignItems: "center", padding: 0,
                  }}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
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

            {/* Terms */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 22 }}>
              <input
                type="checkbox" id="terms"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: ACCENT, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.5, cursor: "pointer" }}>
                Li e aceito os{" "}
                <a href="/para-criadores/termos" style={{ color: ACCENT, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >Termos de Uso</a>{" "}
                e a{" "}
                <a href="/para-empresas/termos" style={{ color: ACCENT, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >Política de Privacidade</a>
              </label>
            </div>

            {error && (
              <div style={{
                background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#B91C1C", marginBottom: 16,
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)",
                borderRadius: 10, padding: "11px 14px",
                fontSize: 13, color: "#15803D", marginBottom: 16,
              }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(99,102,241,0.5)" : ACCENT,
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = ACCENT_HOVER; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = ACCENT; }}
            >
              {loading && <Spinner />}
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: GRAY_TEXT, textAlign: "center", marginTop: 24 }}>
            Já tenho conta{" "}
            <a href="/login" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              → Entrar
            </a>
          </p>

        </div>
      </div>

      {!isMobile && <BrandSide />}
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
