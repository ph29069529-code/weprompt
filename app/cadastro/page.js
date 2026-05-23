"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signUp, supabase } from "../lib/supabase";
import WePromptLogo from "../components/WePromptLogo";

const PURPLE = "#6B5CE7";
const BORDER = "rgba(255,255,255,0.12)";
const TEXT2 = "rgba(255,255,255,0.55)";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: `1.5px solid ${BORDER}`,
  fontSize: 15,
  color: "#fff",
  background: "rgba(255,255,255,0.07)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "rgba(255,255,255,0.75)",
  marginBottom: 6,
  display: "block",
};

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingUser, setExistingUser] = useState(null);

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

  const strengthColor = senha.length >= 8 ? "#4ade80" : PURPLE;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <a href="/" style={{ textDecoration: "none", marginBottom: 32 }}>
        <WePromptLogo id="cadastro" />
      </a>

      <div style={{
        width: "100%", maxWidth: 460,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        padding: "36px 32px",
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.5px" }}>
          {existingUser ? "Complete seu perfil" : "Crie sua conta"}
        </h1>
        <p style={{ fontSize: 14, color: TEXT2, marginBottom: 28 }}>
          {existingUser
            ? "Falta pouco! Preencha seu nome e escolha seu perfil."
            : "Junte-se ao 1º marketplace de IA da América Latina."}
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

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email" required placeholder="seu@email.com"
              value={email}
              onChange={e => !existingUser && setEmail(e.target.value)}
              readOnly={!!existingUser}
              style={{
                ...inputStyle,
                ...(existingUser ? { background: "rgba(255,255,255,0.03)", color: TEXT2, cursor: "default" } : {}),
              }}
              onFocus={e => { if (!existingUser) e.target.style.borderColor = PURPLE; }}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>

          {!existingUser && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Senha</label>
              <input
                type="password" required placeholder="Mínimo 8 caracteres"
                value={senha} onChange={e => setSenha(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = PURPLE)}
                onBlur={e => (e.target.style.borderColor = BORDER)}
              />
              {senha.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} style={{
                      flex: 1, height: 3, borderRadius: 99,
                      background: senha.length >= n * 2 ? strengthColor : "rgba(255,255,255,0.1)",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

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
                    border: `2px solid ${role === opt.value ? PURPLE : "rgba(255,255,255,0.1)"}`,
                    background: role === opt.value ? "rgba(107,92,231,0.2)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.4 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.35)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#fca5a5", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.35)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#86efac", marginBottom: 16,
            }}>
              {success}
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
              boxShadow: loading ? "none" : "0 4px 20px rgba(107,92,231,0.4)",
            }}
          >
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: TEXT2, textAlign: "center", marginTop: 20 }}>
          Já tem conta?{" "}
          <a href="/login" style={{ color: PURPLE, fontWeight: 600, textDecoration: "none" }}>
            Entrar
          </a>
        </p>
      </div>

      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 24, textAlign: "center" }}>
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
