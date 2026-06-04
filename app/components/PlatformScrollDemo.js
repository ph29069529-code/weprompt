"use client";
import React from "react";
import { ContainerScroll } from "./ContainerScroll";

export default function PlatformScrollDemo() {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "#0A0F1E",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <ContainerScroll
        titleComponent={
          <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6366F1",
                marginBottom: 16,
              }}
            >
              Plataforma WePrompt
            </p>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#ffffff",
                marginBottom: 20,
              }}
            >
              Tudo que você precisa,
              <br />
              <span style={{ color: "#6366F1" }}>em um só lugar.</span>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 520,
                margin: "0 auto 32px",
                lineHeight: 1.65,
              }}
            >
              Ative, gerencie e acompanhe suas soluções de IA direto do
              painel WePrompt — sem precisar de equipe técnica.
            </p>
            <a
              href="/solucoes"
              style={{
                display: "inline-block",
                background: "#0A0F1E",
                color: "#fff",
                borderRadius: 10,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#6366F1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0F1E")}
            >
              Explorar soluções →
            </a>
          </div>
        }
      >
        <img
          src="https://www.launchuicomponents.com/app-light.png"
          alt="WePrompt dashboard"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top left",
            borderRadius: 12,
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85";
          }}
        />
      </ContainerScroll>
    </div>
  );
}
