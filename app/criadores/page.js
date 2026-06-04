"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { Zap, DollarSign, Users } from "lucide-react";

const ACCENT      = "#6366F1";
const ACCENT_HOVER = "#4F46E5";
const NEAR_BLACK  = "#0A0F1E";
const GRAY_TEXT   = "#6B7280";
const BORDER      = "#E5E7EB";
const BG          = "#F8F9FB";

/* ── Plan cards ─────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: "Free",
    price: "R$0",
    period: "/mês",
    commission: "20% de comissão",
    features: ["Até 3 soluções publicadas", "Analytics básico", "Curadoria em 48h", "Suporte via e-mail"],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$97",
    period: "/mês",
    commission: "15% de comissão",
    features: ["Soluções ilimitadas", "Destaque na categoria", "Analytics completo", "Suporte prioritário"],
    cta: "Começar Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$297",
    period: "/mês",
    commission: "10% de comissão",
    features: ["Tudo do Pro", "Topo da categoria", "Destaque na homepage", "Suporte dedicado"],
    cta: "Começar Premium",
    highlight: false,
  },
];

/* ── FAQ accordion ───────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Como funciona a aprovação de soluções?",
    a: "Você submete sua solução pelo dashboard e nossa equipe revisa em até 48 horas úteis. Avaliamos qualidade, clareza e utilidade. Soluções aprovadas ficam visíveis no marketplace imediatamente.",
  },
  {
    q: "Quando recebo o pagamento?",
    a: "O repasse é realizado via PIX em até 30 dias após a confirmação de cada venda. O valor mínimo para saque é R$50. Abaixo disso, o saldo acumula para o próximo ciclo.",
  },
  {
    q: "Posso cancelar meu plano a qualquer momento?",
    a: "Sim. Você pode cancelar ou fazer downgrade quando quiser. No cancelamento, suas soluções permanecem no ar com as limitações do plano Free (até 3 soluções publicadas).",
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "20px 0", background: "none",
          border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: NEAR_BLACK }}>{item.q}</span>
        <svg width="20" height="20" fill="none" stroke={GRAY_TEXT} strokeWidth="2" viewBox="0 0 24 24"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function CriadoresPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: NEAR_BLACK }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", background: "rgba(99,102,241,0.1)",
            color: ACCENT, borderRadius: 999, padding: "6px 18px",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 28,
          }}>
            PARA CRIADORES
          </div>

          <h1 style={{
            fontSize: "clamp(36px,5vw,64px)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 8px",
            color: NEAR_BLACK,
          }}>
            Monetize suas soluções de IA.
          </h1>
          <h2 style={{
            fontSize: "clamp(28px,4vw,52px)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 28px",
            color: ACCENT,
          }}>
            Alcance milhares de empresas.
          </h2>

          <p style={{
            fontSize: 18, color: GRAY_TEXT, lineHeight: 1.7,
            maxWidth: 540, margin: "0 auto 40px",
          }}>
            Publique sua solução, defina seu preço e comece a receber. A WePrompt cuida da
            distribuição, dos pagamentos e do suporte.
          </p>

          <button
            onClick={() => router.push("/cadastro?role=criador")}
            style={{
              background: ACCENT, color: "#fff", border: "none",
              borderRadius: 12, padding: "16px 36px",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
          >
            Começar agora, é grátis →
          </button>
        </div>
      </section>

      {/* ── BENEFIT CARDS ────────────────────────────────────────────────── */}
      <section style={{ background: BG, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {[
              {
                Icon: Zap,
                title: "Publique em minutos",
                desc: "Formulário simples, sem burocracia. Sua solução no ar em menos de 24h após aprovação.",
              },
              {
                Icon: DollarSign,
                title: "Receba via PIX",
                desc: "Repasse em até 30 dias após venda confirmada. Saque mínimo de R$50.",
              },
              {
                Icon: Users,
                title: "Acesso a milhares de empresas",
                desc: "Sua solução exposta para compradores qualificados do mercado brasileiro.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{
                background: "#fff", borderRadius: 16,
                border: `1px solid ${BORDER}`, padding: "32px 28px",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(99,102,241,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <Icon size={22} color={ACCENT} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: NEAR_BLACK, marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: GRAY_TEXT, lineHeight: 1.7, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{
              fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
              letterSpacing: "-0.03em", color: NEAR_BLACK, margin: "0 0 12px",
            }}>
              Planos simples e transparentes
            </h2>
            <p style={{ fontSize: 17, color: GRAY_TEXT, margin: 0 }}>
              Comece grátis. Escale quando precisar.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24, alignItems: "start",
          }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: "#fff", borderRadius: 20,
                border: plan.highlight ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                padding: "36px 28px",
                boxShadow: plan.highlight ? "0 8px 32px rgba(99,102,241,0.15)" : "none",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%",
                    transform: "translateX(-50%)",
                    background: ACCENT, color: "#fff", borderRadius: 999,
                    padding: "4px 16px", fontSize: 11, fontWeight: 700,
                    whiteSpace: "nowrap", letterSpacing: "0.06em",
                  }}>
                    POPULAR
                  </div>
                )}

                <div style={{ fontSize: 20, fontWeight: 800, color: NEAR_BLACK, marginBottom: 4 }}>
                  {plan.name}
                </div>
                <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600, marginBottom: 20 }}>
                  {plan.commission}
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: NEAR_BLACK, lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: GRAY_TEXT, paddingBottom: 6 }}>
                    {plan.period}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="16" height="16" fill="none" stroke={ACCENT} strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ fontSize: 14, color: GRAY_TEXT }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push("/cadastro?role=criador")}
                  style={{
                    width: "100%", padding: "14px",
                    background: plan.highlight ? ACCENT : "transparent",
                    color: plan.highlight ? "#fff" : ACCENT,
                    border: plan.highlight ? "none" : `2px solid ${ACCENT}`,
                    borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => {
                    if (plan.highlight) { e.currentTarget.style.background = ACCENT_HOVER; }
                    else { e.currentTarget.style.background = "rgba(99,102,241,0.07)"; }
                  }}
                  onMouseLeave={e => {
                    if (plan.highlight) { e.currentTarget.style.background = ACCENT; }
                    else { e.currentTarget.style.background = "transparent"; }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: BG, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(24px,3vw,36px)", fontWeight: 800,
            letterSpacing: "-0.03em", color: NEAR_BLACK,
            textAlign: "center", marginBottom: 48,
          }}>
            Perguntas frequentes
          </h2>
          {FAQ.map(item => <FAQItem key={item.q} item={item} />)}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ background: NEAR_BLACK, padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
            letterSpacing: "-0.03em", color: "#fff", marginBottom: 24,
          }}>
            Pronto para monetizar suas soluções?
          </h2>
          <button
            onClick={() => router.push("/cadastro?role=criador")}
            style={{
              background: ACCENT, color: "#fff", border: "none",
              borderRadius: 12, padding: "16px 40px",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
          >
            Criar conta grátis →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`,
        padding: "24px", textAlign: "center",
        fontSize: 13, color: "#9CA3AF",
      }}>
        © 2026 WePrompt
      </footer>
    </div>
  );
}
