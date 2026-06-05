"use client";
import { useState } from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Mariana Costa",
    role: "CEO, Loja Virtual Bella",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    text: "Ativamos o chatbot de WhatsApp em menos de 20 minutos. O atendimento ficou 24h e as vendas subiram 40% no primeiro mês.",
    stars: 5,
    highlight: "+40% em vendas",
  },
  {
    id: 2,
    name: "Rafael Mendes",
    role: "Diretor de Marketing, Agência M+",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    text: "O Gerador de Conteúdo IA virou parte do nosso processo. Criamos o calendário editorial do mês inteiro em uma tarde.",
    stars: 5,
    highlight: "1 mês em 1 tarde",
  },
  {
    id: 3,
    name: "Juliana Ferreira",
    role: "Fundadora, Consultoria JF",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    text: "A Secretária Virtual cuida dos agendamentos enquanto eu foco no que importa. Economizo mais de 3h por dia.",
    stars: 5,
    highlight: "3h economizadas/dia",
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [hov, setHov] = useState(null);

  return (
    <section
      style={{
        padding: "100px 48px",
        background: "#ffffff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6366F1",
              marginBottom: 12,
            }}
          >
            Depoimentos
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#0A0F1E",
              marginBottom: 0,
            }}
          >
            Resultados reais.
          </h2>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              onMouseEnter={() => setHov(t.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: "#fff",
                border: `1px solid ${hov === t.id ? "rgba(99,102,241,0.25)" : "#E5E7EB"}`,
                borderRadius: 20,
                padding: 32,
                boxShadow: hov === t.id ? "0 16px 48px rgba(99,102,241,0.10)" : "0 2px 12px rgba(0,0,0,0.04)",
                transform: hov === t.id ? "translateY(-3px)" : "none",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Stars + highlight */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stars count={t.stars} />
                <span
                  style={{
                    background: "#EEF2FF",
                    color: "#6366F1",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {t.highlight}
                </span>
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#374151",
                  flex: 1,
                }}
              >
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0A0F1E" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div
          style={{
            marginTop: 64,
            background: "#0A0F1E",
            borderRadius: 20,
            padding: "40px 48px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            textAlign: "center",
          }}
        >
          {[
            { value: "1.200+", label: "Empresas ativas" },
            { value: "98%", label: "Taxa de satisfação" },
            { value: "4,9 ★", label: "Avaliação média" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
