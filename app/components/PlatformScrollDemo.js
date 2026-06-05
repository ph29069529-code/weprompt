"use client";
import React from "react";
import { ContainerScroll } from "./ContainerScroll";

export default function PlatformScrollDemo() {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "#ffffff",
        backgroundImage: "radial-gradient(circle, #00000010 1px, transparent 1px)",
        backgroundSize: "24px 24px",
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
                color: "#0A0F1E",
                marginBottom: 20,
              }}
            >
              Tudo que você precisa,
              <br />
              <span style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
              }}>em um só lugar.</span>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#6B7280",
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              Ative, gerencie e acompanhe suas soluções de IA direto do
              painel WePrompt — sem precisar de equipe técnica.
            </p>
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
