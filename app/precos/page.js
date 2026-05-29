"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function CheckIcon({ color = "#16a34a" }) {
  return (
    <svg width="16" height="16" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const CRIADORES_PLANS = (billing) => [
  {
    name: "Free",
    commission: "20% de comissão",
    price: "Grátis",
    priceSuffix: null,
    description: "Ideal para começar a vender suas soluções de IA.",
    cta: "Começar grátis",
    ctaRoute: "/cadastro",
    ctaStyle: "outline",
    popular: false,
    features: [
      "Publique até 3 soluções",
      "20% de comissão por venda",
      "Pagamentos via Stripe",
      "Suporte por email",
    ],
  },
  {
    name: "Pro",
    commission: "15% de comissão",
    price: billing === "mensal" ? "R$ 97" : "R$ 77",
    priceSuffix: "/mês",
    description: "Para criadores sérios que querem escalar suas vendas.",
    cta: "Assinar Pro",
    ctaRoute: "/cadastro",
    ctaStyle: "dark",
    popular: true,
    features: [
      "Soluções ilimitadas",
      "15% de comissão por venda",
      "Analytics avançado",
      "Destaque no marketplace",
      "Suporte prioritário",
    ],
  },
  {
    name: "Premium",
    commission: "10% de comissão",
    price: billing === "mensal" ? "R$ 297" : "R$ 237",
    priceSuffix: "/mês",
    description: "Para criadores top com volume alto de vendas.",
    cta: "Assinar Premium",
    ctaRoute: "/cadastro",
    ctaStyle: "dark",
    popular: false,
    features: [
      "Tudo do Pro",
      "10% de comissão por venda",
      "Badge de criador verificado",
      "Posição privilegiada nas buscas",
      "Gerente de conta dedicado",
    ],
  },
];

const EMPRESAS_PLANS = (billing) => [
  {
    name: "Starter",
    commission: null,
    price: "Grátis",
    priceSuffix: null,
    description: "Acesso ao catálogo completo de soluções.",
    cta: "Começar grátis",
    ctaRoute: "/cadastro",
    ctaStyle: "outline",
    popular: false,
    features: [
      "Acesso ao catálogo",
      "Compras avulsas",
      "Suporte email",
    ],
  },
  {
    name: "Business",
    commission: null,
    price: billing === "mensal" ? "R$ 197" : "R$ 157",
    priceSuffix: "/mês",
    description: "Para times que precisam de múltiplas soluções.",
    cta: "Assinar Business",
    ctaRoute: "/cadastro",
    ctaStyle: "dark",
    popular: true,
    features: [
      "Até 10 soluções ativas",
      "Desconto 10% nas compras",
      "Suporte prioritário",
    ],
  },
  {
    name: "Enterprise",
    commission: null,
    price: billing === "mensal" ? "R$ 597" : "R$ 477",
    priceSuffix: "/mês",
    description: "Para empresas com alto volume de uso.",
    cta: "Falar com vendas",
    ctaRoute: "/contato",
    ctaStyle: "dark",
    popular: false,
    features: [
      "Soluções ilimitadas",
      "Desconto 20% nas compras",
      "API access",
      "Gerente dedicado",
    ],
  },
];

const FAQ_ITEMS = [
  { q: "Posso mudar de plano?", a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento." },
  { q: "Como funciona o período de teste?", a: "O plano Free é gratuito para sempre. Os planos pagos têm 14 dias de teste grátis." },
  { q: "Como recebo meus pagamentos?", a: "Através do Stripe, direto na sua conta bancária, com depósitos semanais." },
  { q: "A comissão é sobre o valor bruto?", a: "Sim, a comissão é calculada sobre o valor total da venda antes de impostos." },
  { q: "Posso cancelar quando quiser?", a: "Sim, sem multa ou fidelidade. Cancele a qualquer momento pelo dashboard." },
];

function PlanCard({ plan, router }) {
  const [hovered, setHovered] = useState(false);
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
      }}
    >
      {plan.popular && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: "#111827", color: "white", borderRadius: 999,
          padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
        }}>POPULAR</div>
      )}

      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{plan.name}</div>

      {plan.commission && (
        <div style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontSize: 12, fontWeight: 600, padding: "4px 12px", marginTop: 8, display: "inline-block" }}>
          {plan.commission}
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 48, fontWeight: 900, color: "#111827", lineHeight: 1 }}>{plan.price}</span>
        {plan.priceSuffix && <span style={{ fontSize: 16, color: "#6b7280" }}>{plan.priceSuffix}</span>}
      </div>

      <div style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>{plan.description}</div>

      <button
        onClick={() => router.push(plan.ctaRoute)}
        style={{
          width: "100%", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 600,
          marginTop: 24, cursor: "pointer",
          background: plan.ctaStyle === "dark" ? "#111827" : "white",
          color: plan.ctaStyle === "dark" ? "white" : "#374151",
          border: plan.ctaStyle === "dark" ? "none" : "1.5px solid #e5e7eb",
          fontFamily: "inherit",
        }}
      >{plan.cta}</button>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <CheckIcon />
            <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
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

  const plans = activeAudience === "criadores" ? CRIADORES_PLANS(billing) : EMPRESAS_PLANS(billing);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: "#111827" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <img
          src="/logo-icon.png" alt="WePrompt"
          onClick={() => router.push("/")}
          style={{ height: 32, width: 160, objectFit: "cover", objectPosition: "center", cursor: "pointer" }}
        />
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
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
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
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}>
          {plans.map(plan => (
            <PlanCard key={plan.name} plan={plan} router={router} />
          ))}
        </div>

        {/* Commission table — criadores only */}
        {activeAudience === "criadores" && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 48, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Como funciona a comissão?
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["PLANO", "COMISSÃO", "EXEMPLO R$100", "VOCÊ RECEBE"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", fontSize: 12, color: "#9ca3af", fontWeight: 600, textAlign: "left", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Free", commission: "20%", example: "R$ 20,00", receive: "R$ 80,00" },
                  { plan: "Pro", commission: "15%", example: "R$ 15,00", receive: "R$ 85,00" },
                  { plan: "Premium", commission: "10%", example: "R$ 10,00", receive: "R$ 90,00" },
                ].map(row => (
                  <tr key={row.plan}>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb", fontWeight: 600 }}>{row.plan}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.commission}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>{row.example}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#16a34a", borderBottom: "1px solid #f9fafb", fontWeight: 700 }}>{row.receive}</td>
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
          <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>Pronto para começar?</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
            Junte-se a centenas de criadores que já vendem na WePrompt.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/cadastro")}
              style={{ background: "white", color: "#111827", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "inherit" }}
            >Criar conta grátis</button>
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
              <img src="/logo-icon.png" style={{ height: 224, width: "auto", filter: "brightness(0) invert(1)" }} alt="WePrompt" />
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
