"use client";

const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT  = "#6E6E73";
const BG_GRAY    = "#F5F5F7";
const BLUE       = "#6366F1";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG_GRAY,
      fontFamily: "'DM Sans', sans-serif",
      color: NEAR_BLACK,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 80px",
      }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center", position: "relative" }}>
          {/* Watermark 404 */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            fontSize: 180,
            fontWeight: 900,
            color: BLUE,
            opacity: 0.07,
            letterSpacing: "-8px",
            userSelect: "none",
            lineHeight: 1,
            pointerEvents: "none",
          }}>
            404
          </div>

          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: NEAR_BLACK,
            margin: "0 0 16px",
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
          }}>
            Página não encontrada
          </h1>

          <p style={{
            fontSize: 16,
            color: GRAY_TEXT,
            lineHeight: 1.65,
            margin: "0 0 40px",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            A página que você procura não existe ou foi movida.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/"
              style={{
                background: BLUE,
                color: "#fff",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4F46E5")}
              onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
            >
              Voltar ao início →
            </a>
            <a
              href="/solucoes"
              style={{
                background: BLUE,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4F46E5")}
              onMouseLeave={e => (e.currentTarget.style.background = BLUE)}
            >
              Explorar soluções
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
