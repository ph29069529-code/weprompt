"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import WePromptLogo from "../../../components/WePromptLogo";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#0369A1";
const BORDER     = "#e5e7eb";

const STEPS = [
  {
    n: 1,
    title: "Análise pela equipe WePrompt",
    desc: "Verificamos qualidade, descrição e funcionamento",
    badge: "Até 48 horas",
  },
  {
    n: 2,
    title: "Notificação por email",
    desc: "Você recebe email com o resultado da análise",
    badge: null,
  },
  {
    n: 3,
    title: "Solução no catálogo",
    desc: "Se aprovada, aparece para todas as empresas imediatamente",
    badge: null,
  },
];

const TIPS = [
  "Descrição clara e detalhada do que a solução faz",
  "Print ou vídeo demonstrando o funcionamento",
  "Preço justo em relação ao valor entregue",
];

export default function SolucaoPublicadaPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setChecking(false);
    });
  }, [router]);

  if (checking) return null;

  return (
    <div style={{ minHeight: "100vh", background: BG_GRAY, fontFamily: "'DM Sans', sans-serif", color: NEAR_BLACK }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0);    opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      {/* Navbar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${BORDER}`, height: 60,
        display: "flex", alignItems: "center", padding: "0 32px",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <WePromptLogo id="pub-header" textColor={NEAR_BLACK} />
        </a>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Success animation */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "linear-gradient(135deg, #0369A1, #38BDF8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 12px 40px rgba(3,105,161,0.3)",
            animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
          }}>
            <span style={{ color: "#fff", fontSize: 56, lineHeight: 1, fontWeight: 300 }}>✓</span>
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, color: NEAR_BLACK,
            margin: 0, letterSpacing: "-0.8px", lineHeight: 1.15,
          }}>
            Solução enviada para análise! 🎉
          </h1>
          <p style={{ fontSize: 16, color: GRAY_TEXT, marginTop: 14, lineHeight: 1.65, maxWidth: 480, margin: "14px auto 0" }}>
            Nossa equipe vai revisar sua solução em até 48 horas. Você receberá uma notificação quando for aprovada.
          </p>
        </div>

        {/* What happens next */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: 32, marginTop: 36,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, margin: "0 0 28px" }}>
            O que acontece agora?
          </h2>

          {STEPS.map((step, i) => (
            <div key={step.n} style={{ display: "flex", gap: 16, position: "relative" }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute", left: 17, top: 38, bottom: -6,
                  width: 2, background: "#e0f2fe",
                }} />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: "#e0f2fe", border: "2px solid #bae6fd",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: BLUE, zIndex: 1,
              }}>
                {step.n}
              </div>
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 28 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK }}>{step.title}</span>
                  {step.badge && (
                    <span style={{
                      background: "rgba(217,119,6,0.1)", color: "#B45309",
                      fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99,
                    }}>
                      {step.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: GRAY_TEXT, margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{
          background: "#f0f9ff", border: "1px solid #bae6fd",
          borderRadius: 16, padding: 24, marginTop: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NEAR_BLACK, marginBottom: 14 }}>
            💡 Dicas para aprovação mais rápida
          </div>
          {TIPS.map(tip => (
            <div key={tip} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0, fontSize: 15 }}>✓</span>
              <span style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.55 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <a
            href="/dashboard/criador"
            style={{
              flex: 1, minWidth: 180, textAlign: "center",
              background: BLUE, color: "#fff", borderRadius: 12, padding: "14px 24px",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0284C7")}
            onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
          >
            Ver minhas soluções →
          </a>
          <a
            href="/dashboard/criador?nova=1"
            style={{
              flex: 1, minWidth: 180, textAlign: "center",
              background: "transparent", color: BLUE,
              border: `2px solid ${BLUE}`, borderRadius: 12, padding: "14px 24px",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(3,105,161,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Publicar outra solução
          </a>
        </div>
      </div>
    </div>
  );
}
