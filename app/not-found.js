"use client";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

        {/* 404 gradient number */}
        <div style={{
          fontSize: 120,
          fontWeight: 900,
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          letterSpacing: "-4px",
          marginBottom: 32,
          userSelect: "none",
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 900,
          color: "#1D1D1F",
          margin: "0 0 16px",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}>
          Página não encontrada
        </h1>

        <p style={{
          fontSize: 16,
          color: "#6B7280",
          lineHeight: 1.65,
          margin: "0 0 40px",
        }}>
          A página que você procura não existe ou foi removida.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/"
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
            Voltar para o início →
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
            Explorar soluções →
          </a>
        </div>

      </div>
    </div>
  );
}
