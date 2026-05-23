"use client";

import Link from "next/link";
import WePromptLogo from "../../../components/WePromptLogo";

export default function SuccessPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#F7F7FC",
      padding: "24px",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: 24 }}>
          <WePromptLogo />
        </div>

        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#DCFCE7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
            stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0A0A1A",
          marginBottom: 12,
          letterSpacing: "-0.3px",
        }}>
          Compra realizada com sucesso!
        </h1>

        <p style={{
          fontSize: 15,
          color: "#6B7280",
          marginBottom: 32,
          lineHeight: 1.6,
        }}>
          Acesse sua solução no dashboard.
        </p>

        <Link href="/dashboard/empresa" style={{
          display: "inline-block",
          background: "#6B5CE7",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          padding: "12px 32px",
          borderRadius: 10,
          textDecoration: "none",
        }}>
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
