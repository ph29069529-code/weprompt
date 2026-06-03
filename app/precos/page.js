"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function CheckIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" fill="#92400e" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const CRIADOR_PLANS = (billing) => [
  {
    name: "Free",
    monthly: 0, annualMonthly: 0, annualTotal: 0,
    commission: "20%",
    tagline: "Para começar a publicar soluções sem custo algum.",
    cta: "Começar grátis", ctaRoute: "/cadastro?role=criador",
    popular: false, founder: false, premium: false,
    features: [
      "Até 3 soluções publicadas",
      "Analytics básico",
      "Curadoria e aprovação WePrompt",
      "Badge de perfil de criador",
      "Suporte via e-mail",
    ],
  },
  {
    name: "Pro",
    monthly: 97, annualMonthly: 77, annualTotal: 924,
    commission: "15%",
    tagline: "Para criadores que querem crescer e profissionalizar sua presença.",
    cta: "Começar Pro", ctaRoute: "/cadastro?role=criador",
    popular: true, founder: true, premium: false,
    features: [
      "Soluções ilimitadas",
      "Destaque na categoria",
      "Analytics completo com métricas",
      'Badge "Criador Verificado" ✦',
      "Suporte prioritário",
    ],
  },
  {
    name: "Premium",
    monthly: 297, annualMonthly: 237, annualTotal: 2844,
    commission: "10%",
    tagline: "Para criadores que querem o máximo de visibilidade e receita.",
    cta: "Começar Premium", ctaRoute: "/cadastro?role=criador",
    popular: false, founder: true, premium: true,
    features: [
      "Tudo do plano Pro",
      "Topo da categoria (destaque máximo)",
      "Destaque na homepage da WePrompt",
      "Suporte prioritário dedicado",
      "Gestão de afiliados",
    ],
  },
];

const EMPRESA_PLANS = (billing) => [
  {
    name: "Free",
    monthly: 0, annualMonthly: 0, annualTotal: 0,
    commission: null,
    tagline: "Explore o marketplace e descubra soluções de IA sem compromisso.",
    cta: "Começar grátis", ctaRoute: "/cadastro",
    popular: false, founder: false, premium: false,
    features: [
      "Acesso ao catálogo completo",
      "Compra e assinatura de soluções",
      "Filtros e busca avançada",
      "Avaliações verificadas",
      "Suporte via e-mail",
    ],
  },
  {
    name: "Business",
    monthly: 197, annualMonthly: 157, annualTotal: 1884,
    commission: null,
    tagline: "Para equipes que querem as melhores soluções de IA com economia.",
    cta: "Começar Business", ctaRoute: "/cadastro",
    popular: true, founder: false, premium: false,
    features: [
      "10% de desconto em todas as soluções",
      "Suporte prioritário em PT-BR",
      "Curadoria personalizada mensal",
      "Até 3 usuários na conta",
      "Onboarding guiado",
      "Acesso a soluções em pré-lançamento",
    ],
  },
  {
    name: "Enterprise",
    monthly: 497, annualMonthly: 397, annualTotal: 4764,
    commission: null,
    tagline: "Para grandes empresas com alto volume e necessidades dedicadas.",
    cta: "Falar com a equipe", ctaRoute: "/contato",
    popular: false, founder: false, premium: true,
    features: [
      "20% de desconto em todas as soluções",
      "Suporte dedicado via WhatsApp",
      "Curadoria personalizada semanal",
      "Usuários ilimitados",
      "Onboarding completo da equipe",
      "Relatório de ROI mensal",
    ],
  },
];

const EMPRESA_COMPARE = [
  { feature: "Acesso ao catálogo",      free: "✓",      business: "✓",                   enterprise: "✓" },
  { feature: "Desconto nas soluções",   free: "–",      business: "10%",                  enterprise: "20%" },
  { feature: "Suporte",                 free: "E-mail", business: "Prioritário PT-BR",    enterprise: "WhatsApp dedicado" },
  { feature: "Curadoria personalizada", free: "–",      business: "Mensal",               enterprise: "Semanal" },
  { feature: "Usuários na conta",       free: "1",      business: "Até 3",                enterprise: "Ilimitados" },
  { feature: "Onboarding",             free: "–",      business: "Guiado",               enterprise: "Completo" },
  { feature: "Relatório de ROI",        free: "–",      business: "–",                   enterprise: "Mensal" },
];

const FAQ_ITEMS = [
  {
    q: "Posso mudar de plano a qualquer momento?",
    a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A cobrança é ajustada proporcionalmente ao tempo restante do período.",
  },
  {
    q: "O que acontece se eu cancelar?",
    a: "Ao cancelar, você retorna ao plano Free automaticamente. Suas soluções publicadas permanecem ativas, mas sujeitas às regras do plano Free (até 3 soluções para criadores).",
  },
  {
    q: "Há cobrança de taxa de setup ou taxas escondidas?",
    a: "Não. Nenhum plano possui taxa de setup ou cobranças adicionais surpresa. Você paga apenas a mensalidade do plano escolhido.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartão de crédito, boleto bancário e PIX para os planos mensais e anuais. O repasse para criadores é feito exclusivamente via PIX.",
  },
  {
    q: "Quando os criadores recebem o repasse das vendas?",
    a: "O repasse é realizado via PIX em até 30 dias após a confirmação da venda. O valor mínimo para saque é R$ 50. Abaixo disso, o saldo fica acumulado para o próximo ciclo.",
  },
];

function PlanCard({ plan, billing, router }) {
  const [hovered, setHovered] = useState(false);
  const isFree = plan.monthly === 0;
  const price = billing === "anual" ? plan.annualMonthly : plan.monthly;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 16,
        border: plan.popular ? "2px solid #111827" : "1px solid #e5e7eb",
        padding: 32,
        position: "relative",
        boxShadow: plan.popular
          ? "0 8px 32px rgba(0,0,0,0.1)"
          : hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        display: "flex", flexDirection: "column",
      }}
    >
      {plan.popular && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: "#111827", color: "white", borderRadius: 999,
          padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
        }}>POPULAR</div>
      )}

      {/* Founder badge */}
      {plan.founder && (
        <div style={{
          background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 700,
          borderRadius: 999, padding: "4px 12px", display: "inline-flex",
          alignItems: "center", gap: 5, marginBottom: 8, alignSelf: "flex-start",
        }}>
          <StarIcon />
          Criador Fundador — 1º mês grátis
        </div>
      )}

      {/* Plan name + tagline */}
      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{plan.name}</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>{plan.tagline}</div>

      {/* Commission (criadores only) */}
      {plan.commission && (
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#0369A1" }}>{plan.commission}</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>de comissão</span>
        </div>
      )}

      {/* Price */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
        {isFree ? (
          <span style={{ fontSize: 48, fontWeight: 900, color: "#111827", lineHeight: 1 }}>Grátis</span>
        ) : (
          <>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#6b7280", paddingBottom: 7 }}>R$</span>
            <span style={{ fontSize: 48, fontWeight: 900, color: "#111827", lineHeight: 1 }}>{price.toLocaleString("pt-BR")}</span>
            <span style={{ fontSize: 14, color: "#6b7280", paddingBottom: 9 }}>/mês</span>
          </>
        )}
      </div>

      {/* Founder Pro note */}
      {plan.founder && !plan.premium && (
        <div style={{ fontSize: 13, color: "#059669", fontWeight: 600, marginBottom: 4 }}>
          Primeiro mês gratuito para os 100 primeiros criadores
        </div>
      )}

      {/* Annual note */}
      {!isFree && (
        <div style={{ marginBottom: 16, minHeight: 20 }}>
          {billing === "anual" ? (
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Cobrado anualmente · R$ {plan.annualTotal.toLocaleString("pt-BR")}/ano
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(22,163,74,0.1)", color: "#15803D",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
            }}>
              Economize 20% no anual
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => router.push(plan.ctaRoute)}
        style={{
          width: "100%", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 600,
          marginTop: 8, marginBottom: 24, cursor: "pointer",
          background: plan.popular || (!isFree && !plan.popular) ? "#111827" : "white",
          color: plan.popular || (!isFree && !plan.popular) ? "white" : "#374151",
          border: isFree ? "1.5px solid #e5e7eb" : "none",
          fontFamily: "inherit",
        }}
      >{plan.cta}</button>

      {/* Divider */}
      <div style={{ height: 1, background: "#f3f4f6", marginBottom: 20 }} />

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <CheckIcon />
            <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 32, marginBottom: 48 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Perguntas frequentes</div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #f3f4f6" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{item.q}</span>
            <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"
              style={{ flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div style={{ fontSize: 14, color: "#6b7280", paddingBottom: 16, lineHeight: 1.7 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PrecosPage() {
  const router = useRouter();
  const [activeAudience, setActiveAudience] = useState("criadores");
  const [billing, setBilling] = useState("mensal");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const plans = activeAudience === "criadores" ? CRIADOR_PLANS(billing) : EMPRESA_PLANS(billing);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: "#111827" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <img src="/logo.png" alt="WePrompt" onClick={() => router.push("/")} style={{ width: 160, height: "auto", cursor: "pointer" }} />
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
          <input
            placeholder="Buscar soluções..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: "none", background: "transparent", outline: "none", flex: 1, color: "#374151" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/solucoes")} style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>Marketplace</button>
          <button onClick={() => router.push("/para-criadores")} style={{ fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>Vender</button>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          <button onClick={() => window.__openCart?.()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </button>
          <button onClick={() => window.__openNotif?.()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: 999, position: "absolute", top: -2, right: -2 }} />
          </button>
          <div
            onClick={() => router.push("/dashboard")}
            style={{ width: 32, height: 32, background: "#0369A1", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >W</div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "40px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ background: "#f3f4f6", color: "#374151", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, display: "inline-block" }}>
            PLANOS E PREÇOS
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: "#111827", marginTop: 16, marginBottom: 0 }}>Simples e transparente</h1>
          <p style={{ fontSize: 18, color: "#6b7280", marginTop: 12, marginBottom: 0 }}>Comece gratuitamente. Escale quando precisar.</p>
        </div>

        {/* Audience toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ background: "#f3f4f6", borderRadius: 999, padding: 4, display: "inline-flex" }}>
            {[{ key: "criadores", label: "Para Criadores" }, { key: "empresas", label: "Para Empresas" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveAudience(key)}
                style={{
                  padding: "8px 24px", fontSize: 14, fontWeight: activeAudience === key ? 600 : 400,
                  color: activeAudience === key ? "#111827" : "#6b7280",
                  background: activeAudience === key ? "white" : "transparent",
                  borderRadius: 999, border: "none", cursor: "pointer",
                  boxShadow: activeAudience === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease", fontFamily: "inherit",
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <div style={{ background: "#f3f4f6", borderRadius: 999, padding: 4, display: "inline-flex", alignItems: "center" }}>
            {[{ key: "mensal", label: "Mensal" }, { key: "anual", label: "Anual" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBilling(key)}
                style={{
                  padding: "8px 24px", fontSize: 14, fontWeight: billing === key ? 600 : 400,
                  color: billing === key ? "#111827" : "#6b7280",
                  background: billing === key ? "white" : "transparent",
                  borderRadius: 999, border: "none", cursor: "pointer",
                  boxShadow: billing === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {label}
                {key === "anual" && (
                  <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "2px 6px" }}>-20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {plans.map(plan => (
            <PlanCard key={plan.name} plan={plan} billing={billing} router={router} />
          ))}
        </div>

        {/* Founder offer banner — criadores only */}
        {activeAudience === "criadores" && (
          <div style={{
            marginBottom: 48, padding: "16px 24px",
            background: "rgba(3,105,161,0.05)", border: "1px solid rgba(3,105,161,0.15)",
            borderRadius: 14, textAlign: "center", fontSize: 13, color: "#6b7280", lineHeight: 1.8,
          }}>
            <strong style={{ color: "#0369A1" }}>
              <StarIcon /> Oferta de Criadores Fundadores:
            </strong>{" "}
            Os primeiros 100 criadores ganham 1 mês grátis no plano Pro.
            Aplicado automaticamente no cadastro. Sem cartão de crédito no primeiro mês.
          </div>
        )}

        {/* Commission table — criadores only */}
        {activeAudience === "criadores" && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 48, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Como funciona a comissão?
            </div>
            <p style={{ padding: "12px 24px 0", fontSize: 14, color: "#6b7280", margin: 0 }}>
              A WePrompt retém uma comissão sobre cada venda. O valor varia conforme o seu plano.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead>
                <tr>
                  {["PLANO", "COMISSÃO", "EXEMPLO R$ 100", "VOCÊ RECEBE"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", fontSize: 12, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Free",    commission: "20%", example: "R$ 100,00", receive: "R$ 80,00" },
                  { plan: "Pro",     commission: "15%", example: "R$ 100,00", receive: "R$ 85,00" },
                  { plan: "Premium", commission: "10%", example: "R$ 100,00", receive: "R$ 90,00" },
                ].map((row, i) => (
                  <tr key={row.plan} style={{ background: i % 2 === 1 ? "#f9fafb" : "white" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6", fontWeight: 600 }}>Plano {row.plan}</td>
                    <td style={{ padding: "14px 24px", fontSize: 22, color: "#0369A1", borderBottom: "1px solid #f3f4f6", fontWeight: 800 }}>{row.commission}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#6b7280", borderBottom: "1px solid #f3f4f6" }}>{row.example}</td>
                    <td style={{ padding: "14px 24px", fontSize: 15, color: "#15803d", borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>{row.receive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ padding: "12px 24px", fontSize: 13, color: "#9ca3af", margin: 0, textAlign: "center" }}>
              Repasse via PIX em até 30 dias após venda confirmada. Saque mínimo de R$ 50.
            </p>
          </div>
        )}

        {/* Comparison table — empresas only */}
        {activeAudience === "empresas" && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 48, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Compare os planos</div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Escolha o plano ideal para o tamanho e necessidades da sua empresa.</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Funcionalidade", "Free", "Business", "Enterprise"].map((h, i) => (
                    <th key={h} style={{
                      padding: "12px 24px", fontSize: 12, fontWeight: 600, textAlign: i === 0 ? "left" : "center",
                      borderBottom: "1px solid #f3f4f6", background: "#f9fafb",
                      color: h === "Business" ? "#0369A1" : "#9ca3af",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EMPRESA_COMPARE.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 1 ? "#f9fafb" : "white" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600, color: "#374151", borderBottom: "1px solid #f3f4f6" }}>{row.feature}</td>
                    {[row.free, row.business, row.enterprise].map((val, idx) => (
                      <td key={idx} style={{
                        padding: "14px 24px", fontSize: 13, textAlign: "center",
                        borderBottom: "1px solid #f3f4f6",
                        fontWeight: val !== "–" && val !== "✓" ? 600 : 400,
                        color: val === "–" ? "#d1d5db" : val === "✓" ? "#15803d" : "#374151",
                      }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ */}
        <FAQAccordion />

        {/* Bottom CTA */}
        <div style={{ background: "#111827", borderRadius: 16, padding: 48, textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>Ainda tem dúvidas?</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
            Nossa equipe está pronta para ajudar você a escolher o melhor plano.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push(activeAudience === "criadores" ? "/cadastro?role=criador" : "/cadastro")}
              style={{ background: "white", color: "#111827", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "inherit" }}
            >Começar grátis</button>
            <button
              onClick={() => router.push("/contato")}
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", background: "transparent", fontFamily: "inherit" }}
            >Falar com a equipe</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER (same as homepage) ── */}
      <div style={{ position: "relative" }}>
        <div style={{ background: "#f9fafb", borderRadius: "0 0 48px 48px", height: 80, position: "relative", zIndex: 2 }} />
        <footer style={{
          background: "#0a0a0a",
          paddingTop: 80, paddingBottom: 60,
          paddingLeft: isMobile ? 24 : 48, paddingRight: isMobile ? 24 : 48,
          marginTop: -40, position: "relative",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 40 : 0 }}>
            <div style={{ maxWidth: 320 }}>
              <img src="/logo-white.png" alt="WePrompt" style={{ height: 96, width: "auto" }} />
              <p style={{ color: "#9ca3af", fontSize: 16, marginTop: 12, lineHeight: 1.6, marginBottom: 0 }}>
                O 1º marketplace de soluções de IA da América Latina.
              </p>
            </div>
            <div style={{ display: "flex", gap: isMobile ? 40 : 64 }}>
              <div>
                <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: "uppercase" }}>Seguir</div>
                {[{ label: "Instagram", href: "https://instagram.com" }, { label: "LinkedIn", href: "https://linkedin.com" }, { label: "Twitter/X", href: "https://x.com" }].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ color: "white", fontSize: 18, fontWeight: 500, display: "block", marginBottom: 14, textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>
              <div>
                <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: "uppercase" }}>Recursos</div>
                <a href="/blog" style={{ color: "white", fontSize: 18, fontWeight: 500, display: "block", marginBottom: 14, textDecoration: "none" }}>Blog</a>
              </div>
              <div>
                <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: "uppercase" }}>Empresa</div>
                {[{ label: "Sobre nós", href: "/sobre" }, { label: "FAQ", href: "/faq" }, { label: "Contato", href: "/contato" }].map(l => (
                  <a key={l.label} href={l.href} style={{ color: "white", fontSize: 18, fontWeight: 500, display: "block", marginBottom: 14, textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1f2937", paddingTop: 24, marginTop: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
            <span style={{ color: "#6b7280", fontSize: 14 }}>© 2026 WePrompt. Todos os direitos reservados.</span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/privacidade" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none" }}>Privacidade</a>
              <a href="/para-empresas/termos" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none" }}>Termos</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
