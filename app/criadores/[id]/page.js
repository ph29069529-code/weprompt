"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── DATA ────────────────────────────────────────────────────────────────────

const GRADIENTS = {
  Automação:    "linear-gradient(135deg, #1e3a5f, #2563EB)",
  Chatbots:     "linear-gradient(135deg, #1a1a2e, #7c3aed)",
  Marketing:    "linear-gradient(135deg, #1e3a5f, #0891b2)",
  Vendas:       "linear-gradient(135deg, #14532d, #16a34a)",
};

const SOLUTIONS = [
  { name: "Assistente de E-mails Pro", category: "Automação", price: "R$ 97,00",  sales: 34, rating: 4.9, reviews: 89,  badge: "🏆 Top Seller" },
  { name: "ChatBot WhatsApp",          category: "Chatbots",  price: "R$ 147,00", sales: 28, rating: 4.8, reviews: 67,  badge: "🏆 Top Seller" },
  { name: "Gerador de Conteúdo IA",    category: "Marketing", price: "R$ 67,00",  sales: 21, rating: 4.7, reviews: 43,  badge: null },
  { name: "CRM Inteligente",           category: "Vendas",    price: "R$ 197,00", sales: 15, rating: 4.9, reviews: 31,  badge: "🏆 Top Seller" },
  { name: "Bot de Prospecção",         category: "Vendas",    price: "R$ 87,00",  sales: 12, rating: 4.6, reviews: 24,  badge: null },
  { name: "Analytics Dashboard",       category: "Automação", price: "R$ 127,00", sales: 9,  rating: 4.8, reviews: 18,  badge: null },
];

const REVIEWS = [
  { name: "João S.",     solution: "Assistente de E-mails Pro", stars: 5, date: "28 mai 2026", text: "Solução incrível! Economizei horas por semana. A automação funciona perfeitamente com o Gmail e o Outlook.", helpful: 12, color: "#2563EB" },
  { name: "Maria L.",    solution: "ChatBot WhatsApp",          stars: 5, date: "27 mai 2026", text: "O chatbot superou minhas expectativas. Meus clientes adoraram o atendimento mais rápido. Recomendo muito!", helpful: 8,  color: "#7c3aed" },
  { name: "Pedro R.",    solution: "Gerador de Conteúdo IA",    stars: 4, date: "26 mai 2026", text: "Muito bom! Gera conteúdo de qualidade. Às vezes preciso de pequenos ajustes mas no geral é excelente.",   helpful: 5,  color: "#ea580c" },
  { name: "Ana C.",      solution: "CRM Inteligente",           stars: 5, date: "25 mai 2026", text: "Transformou nossa operação de vendas. A equipe se adaptou rápido e os resultados apareceram em semanas.",  helpful: 19, color: "#16a34a" },
  { name: "Lucas M.",    solution: "Assistente de E-mails Pro", stars: 5, date: "24 mai 2026", text: "Melhor investimento que fiz para o meu negócio. Suporte do criador é excelente.",                          helpful: 7,  color: "#0891b2" },
  { name: "Carla B.",    solution: "ChatBot WhatsApp",          stars: 4, date: "23 mai 2026", text: "Funciona muito bem. Integração com WhatsApp Business foi simples e rápida.",                               helpful: 4,  color: "#d97706" },
  { name: "Rafael N.",   solution: "Analytics Dashboard",       stars: 5, date: "22 mai 2026", text: "Dashboard muito completo. Agora tenho visibilidade total do meu negócio em tempo real.",                   helpful: 11, color: "#4f46e5" },
  { name: "Fernanda S.", solution: "Bot de Prospecção",         stars: 4, date: "21 mai 2026", text: "Aumentou minha taxa de resposta em 40%. Vale muito o investimento.",                                       helpful: 6,  color: "#dc2626" },
];

const RATING_BARS = [
  { star: 5, pct: 78, count: 123 },
  { star: 4, pct: 14, count: 22  },
  { star: 3, pct: 5,  count: 8   },
  { star: 2, pct: 2,  count: 3   },
  { star: 1, pct: 1,  count: 1   },
];

const ABOUT_TAGS = ["Automação", "IA Aplicada", "Chatbots", "CRM", "Marketing Digital"];

const CATEGORIES = [
  { id: "all",       label: "Todas 40" },
  { id: "Automação", label: "Automação 15" },
  { id: "Chatbots",  label: "Chatbots 12" },
  { id: "Marketing", label: "Marketing 8" },
  { id: "Vendas",    label: "Vendas 5" },
];

const TABS = ["Soluções 40", "Avaliações 157", "Sobre"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Stars({ rating, size = 16 }) {
  const full = Math.floor(rating);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= full ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// ─── SOLUTION CARD ────────────────────────────────────────────────────────────

function SolutionCard({ sol }) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white", borderRadius: 16, border: "1px solid #e5e7eb",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{
        height: 160, background: GRADIENTS[sol.category] || GRADIENTS.Automação,
        position: "relative", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20,
      }}>
        {sol.badge && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.3)", color: "white",
            fontSize: 11, padding: "4px 10px", borderRadius: 999,
          }}>{sol.badge}</div>
        )}
        <span style={{ color: "white", fontSize: 14, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
          {sol.name}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <span style={{ background: "#eff6ff", color: "#2563EB", borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "3px 8px" }}>
          {sol.category}
        </span>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 8 }}>{sol.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Stars rating={sol.rating} size={14} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{sol.rating}</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>({sol.reviews} reviews)</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sol.sales} vendas</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginTop: 10 }}>{sol.price}</div>
        <button
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: "100%", background: btnHovered ? "#374151" : "#111827",
            color: "white", borderRadius: 8, padding: "10px",
            fontSize: 14, fontWeight: 600, marginTop: 12,
            border: "none", cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit",
          }}
        >
          Adquirir Solução →
        </button>
      </div>
    </div>
  );
}

// ─── REVIEW CARD ─────────────────────────────────────────────────────────────

function ReviewCard({ rev }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 999, background: rev.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 16, fontWeight: 700, flexShrink: 0,
          }}>
            {rev.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{rev.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Comprou: {rev.solution}</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{rev.date}</span>
      </div>
      <div style={{ marginTop: 12 }}><Stars rating={rev.stars} size={15} /></div>
      <p style={{ fontSize: 14, color: "#374151", marginTop: 8, lineHeight: 1.6, margin: "8px 0 0" }}>
        {rev.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>Útil?</span>
        <button style={{
          border: "1px solid #e5e7eb", borderRadius: 999, padding: "3px 10px",
          fontSize: 12, color: "#6b7280", cursor: "pointer", background: "none", fontFamily: "inherit",
        }}>
          👍 Sim ({rev.helpful})
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CriadorProfilePage() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSolutions = activeCategory === "all"
    ? SOLUTIONS
    : SOLUTIONS.filter(s => s.category === activeCategory);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 32px", height: 60, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <img src="/logo-icon.png" alt="WePrompt" style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center" }} />
        <div style={{
          display: "flex", alignItems: "center",
          background: searchFocused ? "white" : "#f3f4f6",
          borderRadius: 8, padding: "8px 16px", width: 360, gap: 8,
          border: searchFocused ? "1px solid #2563EB" : "1px solid transparent",
          boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          transition: "all 0.2s ease",
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input placeholder="Buscar soluções..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/solucoes")} style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Marketplace ▾</button>
          <button onClick={() => router.push("/para-criadores")} style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Vender ▾</button>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: 999, position: "absolute", top: -2, right: -2 }} />
          </button>
          <div onClick={() => router.push("/dashboard/criador")} style={{
            width: 32, height: 32, background: "#7c3aed", borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>C</div>
        </div>
      </nav>

      {/* ── PROFILE BANNER ────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "48px 48px 0", position: "relative",
      }}>
        {/* Edit + Share */}
        <div style={{ position: "absolute", top: 48, right: 48, display: "flex", gap: 12 }}>
          {["✏ Editar Perfil", "Compartilhar ↗"].map(label => (
            <button key={label} style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8,
              padding: "8px 16px", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          {/* Avatar */}
          <div style={{
            width: 120, height: 120, borderRadius: 999,
            border: "4px solid white", background: "#dbeafe",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#2563EB" }}>C</span>
          </div>

          {/* Name + stats */}
          <div style={{ paddingBottom: 24, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "white" }}>Carlos Mendes</span>
              <span style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white", borderRadius: 999, padding: "4px 14px",
                fontSize: 12, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>⭐ Criador Pro</span>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>@carlosmendes</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              Membro desde jan. 2025 · São Paulo, Brasil
            </div>

            {/* Stats row */}
            <div style={{
              display: "inline-flex", marginTop: 16,
              background: "rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden",
            }}>
              {[
                { value: "40",    sub: "Soluções",  extra: null },
                { value: "14.719", sub: "Vendas",   extra: null },
                { value: "4.8",   sub: "Avaliação", extra: "★" },
                { value: "157",   sub: "Reviews",   extra: null },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "14px 28px", textAlign: "center", color: "white",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    {s.value}
                    {s.extra && <span style={{ color: "#f59e0b", fontSize: 18 }}>{s.extra}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────────────────────── */}
      <div style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 48px", display: "flex", gap: 0,
        position: "sticky", top: 60, zIndex: 10,
      }}>
        {TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => setActiveTab(i)}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: "16px 24px 16px 0", marginRight: 8,
              cursor: "pointer", display: "inline-flex", alignItems: "center",
              border: "none",
              borderBottom: activeTab === i ? "2px solid #2563EB" : "2px solid transparent",
              background: "transparent",
              color: activeTab === i ? "#2563EB" : hoveredTab === i ? "#374151" : "#6b7280",
              fontWeight: activeTab === i ? 600 : 400,
              marginBottom: -1, transition: "color 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div style={{ background: "#f9fafb", padding: "32px 48px" }}>

        {/* ═══ SOLUÇÕES ═══ */}
        {activeTab === 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
                    borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 500,
                    cursor: "pointer",
                    border: activeCategory === c.id ? "none" : "1px solid #e5e7eb",
                    background: activeCategory === c.id ? "#2563EB" : "white",
                    color: activeCategory === c.id ? "white" : "#374151",
                    transition: "all 0.15s ease", fontFamily: "inherit",
                  }}>{c.label}</button>
                ))}
              </div>
              <select style={{
                border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px",
                fontSize: 13, color: "#374151", background: "white", cursor: "pointer", fontFamily: "inherit",
              }}>
                <option>Mais Vendidos ▾</option>
                <option>Melhor Avaliados</option>
                <option>Mais Recentes</option>
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {filteredSolutions.map((sol, i) => <SolutionCard key={i} sol={sol} />)}
            </div>
          </>
        )}

        {/* ═══ AVALIAÇÕES ═══ */}
        {activeTab === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "flex-start" }}>
            {/* Summary */}
            <div style={{
              background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
              padding: 24, position: "sticky", top: 120,
            }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: "#111827", textAlign: "center", lineHeight: 1 }}>4.8</div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <Stars rating={5} size={28} />
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 8 }}>
                Baseado em 157 avaliações
              </div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {RATING_BARS.map(rb => (
                  <div key={rb.star} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "#374151", width: 24 }}>{rb.star}★</span>
                    <div style={{ flex: 1, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${rb.pct}%`, height: "100%", background: "#f59e0b", borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 13, color: "#6b7280", width: 28, textAlign: "right" }}>{rb.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Reviews */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {REVIEWS.map((rev, i) => <ReviewCard key={i} rev={rev} />)}
            </div>
          </div>
        )}

        {/* ═══ SOBRE ═══ */}
        {activeTab === 2 && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Sobre o Criador</h3>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                Olá! Sou Carlos Mendes, especialista em automação e inteligência artificial aplicada a negócios. Com mais de 5 anos de experiência desenvolvendo soluções de IA, já ajudei mais de 200 empresas a economizarem tempo e aumentarem receita com automação inteligente.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {ABOUT_TAGS.map(tag => (
                  <span key={tag} style={{ background: "#eff6ff", color: "#2563EB", borderRadius: 999, padding: "4px 14px", fontSize: 13 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Informações</h3>
              {[
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                  text: "São Paulo, Brasil",
                },
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
                  text: "Membro desde janeiro de 2025",
                },
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  text: "Identidade verificada",
                },
                {
                  icon: <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
                  text: "Responde em menos de 2 horas",
                },
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                  fontSize: 14, color: "#374151",
                }}>
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
