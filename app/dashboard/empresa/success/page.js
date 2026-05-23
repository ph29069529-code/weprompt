"use client";

import Link from "next/link";
import WePromptLogo from "../../../components/WePromptLogo";

const PURPLE = "#6B5CE7";

export default function SuccessPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: 24 }}>
          <WePromptLogo />
        </div>

        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(74,222,128,0.15)",
          border: "1px solid rgba(74,222,128,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
            stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 800, color: "#fff",
          marginBottom: 12, letterSpacing: "-0.3px",
        }}>
          Compra realizada com sucesso!
        </h1>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 32, lineHeight: 1.6 }}>
          Acesse sua solução no dashboard.
        </p>

        <Link href="/dashboard/empresa" style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #6B5CE7, #8B5CF6)",
          color: "#fff", fontWeight: 700, fontSize: 15,
          padding: "12px 32px", borderRadius: 10,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(107,92,231,0.4)",
        }}>
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
