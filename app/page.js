"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Mail,
  TrendingUp,
  BarChart2,
  Smartphone,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import FloatingIconsHero from "./components/FloatingIconsHero";
import Navbar from "./components/Navbar";

const SolutionsShowcase = dynamic(() => import("./components/SolutionsShowcase"), {
  ssr: false,
  loading: () => <div style={{ height: 500 }} />,
});

/* ─── CSS animation hook (replaces framer-motion) ───────────────── */
function useFadeIn(dir = 'up') {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '-60px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const from = dir === 'left' ? 'translateX(-32px)' : dir === 'right' ? 'translateX(32px)' : 'translateY(24px)';
  return [ref, {
    opacity: vis ? 1 : 0,
    transform: vis ? 'translate(0,0)' : from,
    transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
  }];
}

/* ─── Page-level styles ───────────────────────────────────────────── */
function PageStyles() {
  return (
    <style>{`
      @keyframes blob1 {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(60px,40px) scale(1.1)}
        66%{transform:translate(-30px,20px) scale(0.95)}
      }
      @keyframes blob2 {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(-50px,30px) scale(1.05)}
        66%{transform:translate(40px,-20px) scale(0.9)}
      }
      @keyframes blob3 {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(30px,-40px) scale(1.08)}
        66%{transform:translate(-60px,10px) scale(0.97)}
      }
      @keyframes bounce-arrow {
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(6px)}
      }
      @keyframes marquee-left {
        0%{transform:translateX(0)}
        100%{transform:translateX(-50%)}
      }
      @keyframes marquee-right {
        0%{transform:translateX(-50%)}
        100%{transform:translateX(0)}
      }
      @media (max-width: 768px) {
        .hero-h1 { font-size: clamp(40px,10vw,64px) !important; }
        .section-pad { padding: 80px 24px !important; }
        .two-col { flex-direction: column !important; gap: 40px !important; }
        .two-col-rev { flex-direction: column-reverse !important; gap: 40px !important; }
        .grid-3 { grid-template-columns: 1fr !important; }
        .grid-2 { grid-template-columns: 1fr !important; }
        .hero-pad { padding: 100px 24px 64px !important; }
      }
    `}</style>
  );
}

/* ─── How It Works ───────────────────────────────────────────────── */
function HowItWorks() {
  const [hov, setHov] = useState(null);
  const [headerRef, headerAnim] = useFadeIn();
  const [gridRef, gridVis] = useFadeIn();
  const steps = [
    { num: "01", title: "Encontre", desc: "Navegue pelo catálogo curado por categoria ou desafio do seu negócio." },
    { num: "02", title: "Ative", desc: "Sem instalação, sem equipe técnica. Configure em minutos e comece a usar." },
    { num: "03", title: "Execute", desc: "Tudo dentro da WePrompt. Histórico, suporte e atualizações centralizados." },
  ];

  return (
    <section id="como-funciona" className="section-pad" style={{ background: "#fff", padding: "80px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={headerRef} style={{ ...headerAnim, textAlign: "center", marginBottom: 80 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#6366F1",
            borderRadius: 100,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            COMO FUNCIONA
          </div>
          <h2 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 800, color: "#0A0F1E", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 0 }}>
            Três{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
            }}>passos.</span>
          </h2>
          <p style={{ color: "#6B7280", fontSize: 18, marginTop: 16 }}>
            Do catálogo ao seu negócio funcionando.
          </p>
        </div>

        <div ref={gridRef} className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: "#fff",
                border: `1px solid ${hov === i ? "rgba(99,102,241,0.2)" : "#E5E7EB"}`,
                borderRadius: 20, padding: 40,
                boxShadow: hov === i ? "0 20px 40px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
                transform: gridVis ? (hov === i ? "translateY(-4px)" : "translateY(0)") : "translateY(24px)",
                opacity: gridVis ? 1 : 0,
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
              }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: "#F3F4F6", lineHeight: 1, marginBottom: 24, fontFamily: "monospace" }}>
                {step.num}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", marginBottom: 12 }}>{step.title}</div>
              <div style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Categories ─────────────────────────────────────────────────── */
function Categories() {
  const router = useRouter();
  const [hov, setHov] = useState(null);
  const [headerRef, headerAnim] = useFadeIn();
  const [gridRef, gridVis] = useFadeIn();

  const cats = [
    { icon: <MessageSquare size={22} color="#6366F1" />, name: "Atendimento ao Cliente", desc: "Chatbots 24/7", slug: "atendimento" },
    { icon: <Mail size={22} color="#6366F1" />, name: "Automação de E-mails", desc: "Respostas e campanhas", slug: "automacao-emails" },
    { icon: <TrendingUp size={22} color="#6366F1" />, name: "Vendas e Prospecção", desc: "Geração de leads", slug: "vendas" },
    { icon: <BarChart2 size={22} color="#6366F1" />, name: "Análise de Dados", desc: "Insights em segundos", slug: "analise-dados" },
    { icon: <Smartphone size={22} color="#6366F1" />, name: "WhatsApp IA", desc: "Vendas pelo WhatsApp", slug: "whatsapp-ia" },
    { icon: <Megaphone size={22} color="#6366F1" />, name: "Marketing e Conteúdo", desc: "Criação automatizada", slug: "marketing" },
  ];

  return (
    <section className="section-pad" style={{ background: "#F8F9FB", padding: "80px 48px", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={headerRef} style={{ ...headerAnim, textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#6366F1",
            borderRadius: 100,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>CATEGORIAS</div>
          <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, color: "#0A0F1E", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 0 }}>
            Uma solução para{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
            }}>cada desafio.</span>
          </h2>
          <p style={{ color: "#6B7280", fontSize: 18, marginTop: 12 }}>Curadas para o mercado brasileiro.</p>
        </div>

        <div ref={gridRef} className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cats.map((cat, i) => (
            <div
              key={cat.slug}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => router.push(`/solucoes?categoria=${cat.slug}`)}
              style={{
                background: "#fff",
                border: `1px solid ${hov === i ? "rgba(99,102,241,0.2)" : "#E5E7EB"}`,
                borderRadius: 16, padding: 28, cursor: "pointer",
                boxShadow: hov === i ? "0 20px 40px rgba(0,0,0,0.08)" : "none",
                opacity: gridVis ? 1 : 0,
                transform: gridVis ? (hov === i ? "translateY(-4px)" : "translateY(0)") : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s, box-shadow 0.3s ease, border-color 0.3s ease`,
              }}>
              <div style={{ width: 44, height: 44, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0A0F1E", marginTop: 14 }}>{cat.name}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>{cat.desc}</div>
              <div style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, marginTop: 18 }}>Ver soluções →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── For Companies ──────────────────────────────────────────────── */
function ForCompanies() {
  const router = useRouter();
  const [hovCta, setHovCta] = useState(false);
  const [leftRef, leftAnim] = useFadeIn('left');
  const [rightRef, rightAnim] = useFadeIn('right');
  const solutions = ["Agente de Atendimento", "ChatBot WhatsApp", "Gerador de E-mails"];

  return (
    <section className="section-pad" style={{ backgroundColor: "#FAFAFA", backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.03), transparent)", padding: "80px 48px", borderTop: "1px solid #E5E7EB" }}>
      <div className="two-col" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — mockup */}
        <div ref={leftRef} style={{ ...leftAnim, flex: "0 0 50%" }}>
          <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 20, padding: 28,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#0A0F1E", fontWeight: 700, fontSize: 16 }}>Meu Painel</span>
              <div style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Empresa</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
              {[{ val: "3", label: "Soluções ativas" }, { val: "R$291", label: "Este mês" }, { val: "24h", label: "Suporte" }].map((m) => (
                <div key={m.label} style={{ background: "#F8F9FB", borderRadius: 12, padding: 16 }}>
                  <div style={{ color: "#0A0F1E", fontSize: 20, fontWeight: 800 }}>{m.val}</div>
                  <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              {solutions.map((name, i) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: i < solutions.length - 1 ? "1px solid #F3F4F6" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", flexShrink: 0 }} />
                    <span style={{ color: "#0A0F1E", fontSize: 14 }}>{name}</span>
                  </div>
                  <div style={{ background: "#EEF2FF", color: "#4F46E5", fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>Ativo</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — text */}
        <div ref={rightRef} style={{ ...rightAnim, flex: "0 0 50%" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#6366F1",
            borderRadius: 100,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>PARA EMPRESAS</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: "#0A0F1E", marginTop: 12, marginBottom: 0, lineHeight: 1.15 }}>
            IA que trabalha pelo seu negócio.
            <br />
            <span style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
            }}>Em português.</span>
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Encontre, ative e use soluções de IA — tudo dentro da WePrompt, sem precisar de equipe técnica.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Soluções testadas e aprovadas pela nossa equipe", "Ative sem precisar de TI", "Suporte em português incluído", "Cancele quando quiser"].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "#0A0F1E", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/solucoes")}
            onMouseEnter={() => setHovCta(true)}
            onMouseLeave={() => setHovCta(false)}
            style={{
              marginTop: 36,
              background: hovCta ? "#1a2035" : "#0A0F1E",
              color: "#fff",
              border: "none", borderRadius: 10,
              padding: "14px 28px", fontSize: 15, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              transition: "all 0.2s",
            }}>
            Explorar o catálogo →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── For Creators ───────────────────────────────────────────────── */
function ForCreators() {
  const router = useRouter();
  const [hovCta, setHovCta] = useState(false);
  const [leftRef, leftAnim] = useFadeIn('left');
  const [rightRef, rightAnim] = useFadeIn('right');
  const sales = [
    { name: "Agente de Atendimento", value: "R$ 97", time: "2h atrás" },
    { name: "ChatBot WhatsApp", value: "R$ 147", time: "ontem" },
    { name: "Gerador de Posts", value: "R$ 67", time: "3 dias atrás" },
  ];
  const bars = [20, 28, 22, 36, 48];

  return (
    <section className="section-pad" style={{ background: "#fff", padding: "80px 48px", borderTop: "1px solid #E5E7EB" }}>
      <div className="two-col-rev" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — text */}
        <div ref={leftRef} style={{ ...leftAnim, flex: "0 0 50%" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#6366F1",
            borderRadius: 100,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>PARA CRIADORES</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: "#0A0F1E", marginTop: 12, marginBottom: 0, lineHeight: 1.15 }}>
            Monetize suas soluções.
            <br />
            <span style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
            }}>Alcance milhares.</span>
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Publique, defina seu preço e comece a receber. Cuidamos da distribuição e dos pagamentos.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Comece grátis — publique até 3 soluções", "Receba via PIX em até 30 dias", "Apenas 20% de comissão sobre o que você vende"].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "#0A0F1E", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/cadastro")}
            onMouseEnter={() => setHovCta(true)}
            onMouseLeave={() => setHovCta(false)}
            style={{
              marginTop: 36,
              background: hovCta ? "#0A0F1E" : "transparent",
              color: hovCta ? "#fff" : "#0A0F1E",
              border: "2px solid #0A0F1E",
              borderRadius: 10, padding: "14px 28px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}>
            Quero ser um criador →
          </button>
        </div>

        {/* Right — revenue card */}
        <div ref={rightRef} style={{ ...rightAnim, flex: "0 0 50%" }}>
          <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 20, padding: 28,
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#0A0F1E", fontWeight: 700, fontSize: 16 }}>Minha receita</span>
              <div style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Criador Pro</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#0A0F1E", fontSize: 36, fontWeight: 800 }}>R$ 2.840</div>
              <div style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>Este mês</div>
              <div style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, marginTop: 8 }}>↑ +34% vs. mês anterior</div>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 6, alignItems: "flex-end", height: 48 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: 20, height: h,
                  background: i === bars.length - 1 ? "#6366F1" : "#E5E7EB",
                  borderRadius: "4px 4px 0 0",
                }} />
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              {sales.map((sale, i) => (
                <div key={sale.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < sales.length - 1 ? "1px solid #F3F4F6" : "none",
                }}>
                  <span style={{ color: "#0A0F1E", fontSize: 13 }}>{sale.name}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#6366F1", fontSize: 13, fontWeight: 600 }}>{sale.value}</span>
                    <span style={{ color: "#9CA3AF", fontSize: 12, marginLeft: 8 }}>{sale.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Page ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden" }}>
      <PageStyles />
      <Navbar />
      <FloatingIconsHero />
      <SolutionsShowcase />

      <HowItWorks />
      <ForCompanies />
      <ForCreators />
    </div>
  );
}
