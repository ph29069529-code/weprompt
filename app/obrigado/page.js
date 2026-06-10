"use client";

export default function ObrigadoPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F7FF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <style>{`
        @keyframes checkIn {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* Logo */}
      <a href="/" style={{ display: "block", marginBottom: 52, textDecoration: "none" }}>
        <img src="/logo-white.png" alt="WePrompt" style={{ width: 130, height: "auto", display: "block" }} />
      </a>

      {/* Card content */}
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

        {/* Check icon */}
        <div style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
          boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
          animation: "checkIn 0.4s ease-out both",
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 900,
          color: "#1D1D1F",
          margin: "0 0 16px",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}>
          Compra realizada com sucesso!
        </h1>

        <p style={{
          fontSize: 16,
          color: "#6B7280",
          lineHeight: 1.65,
          margin: "0 0 40px",
        }}>
          Sua solução já está disponível no seu dashboard.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/dashboard/empresa"
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Acessar meu dashboard →
          </a>
          <a
            href="/solucoes"
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              border: "1.5px solid #6366F1",
              background: "transparent",
              color: "#6366F1",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Explorar mais soluções →
          </a>
        </div>

      </div>
    </div>
  );
}
