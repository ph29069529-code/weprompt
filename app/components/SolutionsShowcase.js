"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot, Zap, MessageCircle, Megaphone,
  BarChart2, Smartphone, ArrowRight,
} from "lucide-react";

const CATEGORIES = ["Todos", "Agentes IA", "Automação", "Marketing", "Analytics", "WhatsApp"];

const SOLUTIONS = [
  {
    id: 1,
    name: "Secretária Virtual IA",
    category: "Agentes IA",
    desc: "Atende clientes, agenda reuniões e responde dúvidas 24h por dia automaticamente.",
    price: "R$ 97/mês",
    badge: "Mais vendido",
    badgeColor: "#6366F1",
    icon: Bot,
    color: "#EEF2FF",
    iconColor: "#6366F1",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  },
  {
    id: 2,
    name: "Automação Make + n8n",
    category: "Automação",
    desc: "Conecte todos os seus sistemas em fluxos automatizados sem escrever código.",
    price: "R$ 147/mês",
    badge: "Novo",
    badgeColor: "#10B981",
    icon: Zap,
    color: "#F0FDF4",
    iconColor: "#10B981",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  },
  {
    id: 3,
    name: "Chatbot WhatsApp Pro",
    category: "WhatsApp",
    desc: "Venda e faça suporte no WhatsApp com um agente inteligente personalizado.",
    price: "R$ 67/mês",
    badge: null,
    icon: Smartphone,
    color: "#F0FDF4",
    iconColor: "#22C55E",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
  },
  {
    id: 4,
    name: "Gerador de Conteúdo IA",
    category: "Marketing",
    desc: "Posts, copies e campanhas completas em segundos para qualquer plataforma.",
    price: "R$ 47/mês",
    badge: "Popular",
    badgeColor: "#F59E0B",
    icon: Megaphone,
    color: "#FFFBEB",
    iconColor: "#F59E0B",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
  },
  {
    id: 5,
    name: "Dashboard de Analytics",
    category: "Analytics",
    desc: "Visualize métricas do negócio em tempo real com insights gerados por IA.",
    price: "R$ 127/mês",
    badge: null,
    icon: BarChart2,
    color: "#EFF6FF",
    iconColor: "#3B82F6",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    id: 6,
    name: "Agente de Prospecção",
    category: "Agentes IA",
    desc: "Encontra e qualifica leads automaticamente, envia follow-ups personalizados.",
    price: "R$ 197/mês",
    badge: "Premium",
    badgeColor: "#8B5CF6",
    icon: MessageCircle,
    color: "#F5F3FF",
    iconColor: "#8B5CF6",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
  },
];

function SolutionCard({ solution, router }) {
  const [hov, setHov] = useState(false);
  const Icon = solution.icon;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => router.push("/solucoes")}
      style={{
        background: "#fff",
        borderRadius: 20,
        border: `1px solid ${hov ? "rgba(99,102,241,0.3)" : "#E5E7EB"}`,
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img
          src={solution.img}
          alt={solution.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hov ? "scale(1.05)" : "scale(1)",
          }}
        />
        {solution.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: solution.badgeColor,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            {solution.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: solution.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={solution.iconColor} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E" }}>{solution.name}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{solution.category}</div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
          {solution.desc}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#0A0F1E" }}>{solution.price}</span>
          <button
            style={{
              background: hov ? "#4F46E5" : "#0A0F1E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s",
            }}
          >
            Ativar <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SolutionsShowcase() {
  const router = useRouter();
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? SOLUTIONS
      : SOLUTIONS.filter((s) => s.category === active);

  return (
    <section
      style={{
        padding: "100px 48px",
        background: "#F8F9FB",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
            Catálogo
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#0A0F1E",
              marginBottom: 16,
            }}
          >
            Soluções prontas para usar.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
            Escolha, ative e comece a usar em minutos.
          </p>
        </div>

        {/* Category filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                background: active === cat ? "#0A0F1E" : "#fff",
                color: active === cat ? "#fff" : "#374151",
                border: `1px solid ${active === cat ? "#0A0F1E" : "#E5E7EB"}`,
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: active === cat ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (active !== cat) {
                  e.currentTarget.style.borderColor = "#0A0F1E";
                  e.currentTarget.style.color = "#0A0F1E";
                }
              }}
              onMouseLeave={(e) => {
                if (active !== cat) {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((s) => (
            <SolutionCard key={s.id} solution={s} router={router} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <button
            onClick={() => router.push("/solucoes")}
            style={{
              background: "#0A0F1E",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 40px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6366F1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0F1E")}
          >
            Ver todas as soluções →
          </button>
        </div>
      </div>
    </section>
  );
}
