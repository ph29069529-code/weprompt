"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MessageSquare,
  Mail,
  TrendingUp,
  BarChart2,
  Smartphone,
  Megaphone,
  CheckCircle,
  Menu,
  X,
  Globe,
  Link,
  Share2,
} from "lucide-react";
import WaitlistHero from "./components/WaitlistHero";
import IntegrationMarquee from "./components/IntegrationMarquee";
import PlatformScrollDemo from "./components/PlatformScrollDemo";
import SolutionsShowcase from "./components/SolutionsShowcase";
import Testimonials from "./components/Testimonials";

/* ─── Animation helpers ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const vp = { once: true, margin: "-80px" };

/* ─── Navbar ─────────────────────────────────────────────────────── */
function getDashboardUrl(user) {
  if (!user) return "/dashboard/empresa";
  if (user.email === "ph29069529@gmail.com") return "/dashboard/admin";
  const role = user.user_metadata?.role;
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovLink, setHovLink] = useState(null);
  const [hovCta, setHovCta] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: "Soluções", href: "/solucoes" },
    { label: "Preços", href: "/precos" },
    { label: "Para Criadores", href: "/criadores" },
    { label: "Como Funciona", href: "/#como-funciona" },
  ];

  return (
    <>
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
        .nav-links { display: flex; }
        .nav-right { display: flex; }
        .nav-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-right { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .hero-h1 { font-size: clamp(40px,10vw,64px) !important; }
          .section-pad { padding: 80px 24px !important; }
          .two-col { flex-direction: column !important; gap: 40px !important; }
          .two-col-rev { flex-direction: column-reverse !important; gap: 40px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; }
          .hero-pad { padding: 100px 24px 64px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
        height: 64,
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 48px", height: "100%",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src={scrolled ? "/logo.png" : "/logo-white.png"} alt="WePrompt" style={{ width: 140, height: 'auto', display: 'block', transition: 'all 0.3s' }} />
          </a>

          {/* Center */}
          <div className="nav-links" style={{ alignItems: "center", gap: 32 }}>
            {links.map((l) => (
              <a key={l.label} href={l.href}
                onMouseEnter={() => setHovLink(l.label)}
                onMouseLeave={() => setHovLink(null)}
                style={{
                  color: hovLink === l.label
                    ? (scrolled ? "#0A0F1E" : "#fff")
                    : (scrolled ? "#6B7280" : "rgba(255,255,255,0.85)"),
                  fontSize: 14, textDecoration: "none", transition: "color 0.2s",
                }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="nav-right" style={{ alignItems: "center", gap: 16 }}>
            {user ? (
              <a href={getDashboardUrl(user)}
                onMouseEnter={() => setHovCta(true)}
                onMouseLeave={() => setHovCta(false)}
                style={{
                  background: scrolled ? (hovCta ? "#4F46E5" : "#6366F1") : "rgba(255,255,255,0.12)",
                  color: "#fff", textDecoration: "none",
                  border: scrolled ? "none" : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8, padding: "10px 20px",
                  fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                }}>
                Meu Dashboard →
              </a>
            ) : (
              <>
                <a href="/login"
                  style={{ color: scrolled ? "#6B7280" : "rgba(255,255,255,0.8)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = scrolled ? "#0A0F1E" : "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "#6B7280" : "rgba(255,255,255,0.8)")}>
                  Entrar
                </a>
                <button
                  onClick={() => router.push("/cadastro")}
                  onMouseEnter={() => setHovCta(true)}
                  onMouseLeave={() => setHovCta(false)}
                  style={{
                    background: scrolled ? (hovCta ? "#4F46E5" : "#6366F1") : (hovCta ? "rgba(255,255,255,0.9)" : "#fff"),
                    color: scrolled ? "#fff" : "#0A0F1E",
                    border: "none", borderRadius: 8,
                    padding: "10px 20px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  Começar grátis →
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", color: scrolled ? "#6B7280" : "white", cursor: "pointer", padding: 4, alignItems: "center", transition: "color 0.2s" }}>
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile overlay */}
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#fff", display: "flex", flexDirection: "column", padding: "0 24px",
          }}>
            <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <img src="/logo.png" alt="WePrompt" style={{ height: 28 }} />
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                  style={{ fontSize: 18, fontWeight: 600, color: "#0A0F1E", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
                  {l.label}
                </a>
              ))}
            </nav>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              {user ? (
                <a href={getDashboardUrl(user)} onClick={() => setMenuOpen(false)} style={{ background: "#6366F1", color: "#fff", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>Meu Dashboard →</a>
              ) : (
                <>
                  <a href="/login" onClick={() => setMenuOpen(false)} style={{ border: "1.5px solid #E5E7EB", color: "#0A0F1E", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>Entrar</a>
                  <a href="/cadastro" onClick={() => setMenuOpen(false)} style={{ background: "#0A0F1E", color: "#fff", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>Começar grátis →</a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── How It Works ───────────────────────────────────────────────── */
function HowItWorks() {
  const [hov, setHov] = useState(null);
  const steps = [
    { num: "01", title: "Encontre", desc: "Navegue pelo catálogo curado por categoria ou desafio do seu negócio." },
    { num: "02", title: "Ative", desc: "Sem instalação, sem equipe técnica. Configure em minutos e comece a usar." },
    { num: "03", title: "Execute", desc: "Tudo dentro da WePrompt. Histórico, suporte e atualizações centralizados." },
  ];

  return (
    <section id="como-funciona" className="section-pad" style={{ background: "#09090b", padding: "80px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={vp}
          variants={fadeUp}
          style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6366F1", textTransform: "uppercase" }}>
            COMO FUNCIONA
          </div>
          <h2 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 0 }}>
            Três passos.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, marginTop: 16 }}>
            Do catálogo ao seu negócio funcionando.
          </p>
        </motion.div>

        <motion.div
          className="grid-3"
          initial="hidden" whileInView="visible" viewport={vp}
          variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${hov === i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, padding: 40,
                boxShadow: hov === i ? "0 8px 32px rgba(99,102,241,0.1)" : "none",
                transform: hov === i ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.25s",
              }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: "rgba(99,102,241,0.6)", lineHeight: 1, marginBottom: 24, fontFamily: "monospace" }}>
                {step.num}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>{step.title}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{step.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Categories ─────────────────────────────────────────────────── */
function Categories() {
  const router = useRouter();
  const [hov, setHov] = useState(null);

  const cats = [
    { icon: <MessageSquare size={22} color="#6366F1" />, name: "Atendimento ao Cliente", desc: "Chatbots 24/7", slug: "atendimento" },
    { icon: <Mail size={22} color="#6366F1" />, name: "Automação de E-mails", desc: "Respostas e campanhas", slug: "automacao-emails" },
    { icon: <TrendingUp size={22} color="#6366F1" />, name: "Vendas e Prospecção", desc: "Geração de leads", slug: "vendas" },
    { icon: <BarChart2 size={22} color="#6366F1" />, name: "Análise de Dados", desc: "Insights em segundos", slug: "analise-dados" },
    { icon: <Smartphone size={22} color="#6366F1" />, name: "WhatsApp IA", desc: "Vendas pelo WhatsApp", slug: "whatsapp-ia" },
    { icon: <Megaphone size={22} color="#6366F1" />, name: "Marketing e Conteúdo", desc: "Criação automatizada", slug: "marketing" },
  ];

  return (
    <section className="section-pad" style={{ background: "#0A0F1E", padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6366F1", textTransform: "uppercase" }}>CATEGORIAS</div>
          <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 0 }}>
            Uma solução para cada desafio.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, marginTop: 12 }}>Curadas para o mercado brasileiro.</p>
        </motion.div>

        <motion.div
          className="grid-2"
          initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cats.map((cat, i) => (
            <motion.div
              key={cat.slug} variants={fadeUp}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => router.push(`/solucoes?categoria=${cat.slug}`)}
              style={{
                background: hov === i ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${hov === i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16, padding: 28, cursor: "pointer",
                boxShadow: hov === i ? "0 8px 24px rgba(99,102,241,0.15)" : "none",
                transform: hov === i ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.2s",
              }}>
              <div style={{ width: 44, height: 44, background: "rgba(99,102,241,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginTop: 14 }}>{cat.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{cat.desc}</div>
              <div style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, marginTop: 18 }}>Ver soluções →</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── For Companies ──────────────────────────────────────────────── */
function ForCompanies() {
  const router = useRouter();
  const [hovCta, setHovCta] = useState(false);
  const solutions = ["Agente de Atendimento", "ChatBot WhatsApp", "Gerador de E-mails"];

  return (
    <section className="section-pad" style={{ background: "#09090b", padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="two-col" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — mockup */}
        <motion.div
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={vp}
          style={{ flex: "0 0 50%" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>Meu Painel</span>
              <div style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Empresa</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
              {[{ val: "3", label: "Soluções ativas" }, { val: "R$291", label: "Este mês" }, { val: "24h", label: "Suporte" }].map((m) => (
                <div key={m.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                  <div style={{ color: "#ffffff", fontSize: 20, fontWeight: 800 }}>{m.val}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              {solutions.map((name, i) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: i < solutions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{name}</span>
                  </div>
                  <div style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>Ativo</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — text */}
        <motion.div
          initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={vp}
          style={{ flex: "0 0 50%" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6366F1", textTransform: "uppercase" }}>PARA EMPRESAS</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: "#ffffff", marginTop: 12, marginBottom: 0, lineHeight: 1.15 }}>
            IA que trabalha pelo seu negócio. Em português.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Encontre, ative e use soluções de IA — tudo dentro da WePrompt, sem precisar de equipe técnica.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Soluções testadas e aprovadas pela nossa equipe", "Ative sem precisar de TI", "Suporte em português incluído", "Cancele quando quiser"].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/solucoes")}
            onMouseEnter={() => setHovCta(true)}
            onMouseLeave={() => setHovCta(false)}
            style={{
              marginTop: 36,
              background: hovCta ? "#4F46E5" : "#6366F1",
              color: "#fff",
              border: "none", borderRadius: 10,
              padding: "14px 28px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", transition: "background 0.2s",
            }}>
            Explorar o catálogo →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── For Creators ───────────────────────────────────────────────── */
function ForCreators() {
  const router = useRouter();
  const [hovCta, setHovCta] = useState(false);
  const sales = [
    { name: "Agente de Atendimento", value: "R$ 97", time: "2h atrás" },
    { name: "ChatBot WhatsApp", value: "R$ 147", time: "ontem" },
    { name: "Gerador de Posts", value: "R$ 67", time: "3 dias atrás" },
  ];
  const bars = [20, 28, 22, 36, 48];

  return (
    <section className="section-pad" style={{ background: "#0A0F1E", padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="two-col-rev" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={vp}
          style={{ flex: "0 0 50%" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6366F1", textTransform: "uppercase" }}>PARA CRIADORES</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: "#ffffff", marginTop: 12, marginBottom: 0, lineHeight: 1.15 }}>
            Monetize suas soluções. Alcance milhares.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Publique, defina seu preço e comece a receber. Cuidamos da distribuição e dos pagamentos.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Comece grátis — publique até 3 soluções", "Receba via PIX em até 30 dias", "Apenas 20% de comissão sobre o que você vende"].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/cadastro")}
            onMouseEnter={() => setHovCta(true)}
            onMouseLeave={() => setHovCta(false)}
            style={{
              marginTop: 36,
              background: hovCta ? "rgba(255,255,255,0.15)" : "transparent",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: 10, padding: "14px 28px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "background 0.2s",
            }}>
            Quero ser um criador →
          </button>
        </motion.div>

        {/* Right — revenue card */}
        <motion.div
          initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={vp}
          style={{ flex: "0 0 50%" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>Minha receita</span>
              <div style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Criador Pro</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#ffffff", fontSize: 36, fontWeight: 800 }}>R$ 2.840</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>Este mês</div>
              <div style={{ color: "#6366F1", fontSize: 13, fontWeight: 600, marginTop: 8 }}>↑ +34% vs. mês anterior</div>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 6, alignItems: "flex-end", height: 48 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: 20, height: h,
                  background: i === bars.length - 1 ? "#6366F1" : "rgba(255,255,255,0.1)",
                  borderRadius: "4px 4px 0 0",
                }} />
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              {sales.map((sale, i) => (
                <div key={sale.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < sales.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{sale.name}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#6366F1", fontSize: 13, fontWeight: 600 }}>{sale.value}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: 8 }}>{sale.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────── */
function FinalCTA() {
  const router = useRouter();

  return (
    <section className="section-pad" style={{ background: "#09090b", padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div
        initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
        style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          color: "#fff",
          fontSize: "clamp(32px,4vw,52px)",
          fontWeight: 800, letterSpacing: "-0.03em", margin: 0,
        }}>
          Seu negócio não pode esperar.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginTop: 16, lineHeight: 1.6 }}>
          Comece hoje. É grátis. Suporte em português.
        </p>
        <button
          onClick={() => router.push("/cadastro")}
          style={{
            marginTop: 40,
            background: "#6366F1", color: "#fff",
            border: "none", borderRadius: 10,
            padding: "18px 40px", fontSize: 16, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
          }}>
          Começar agora, é grátis →
        </button>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ background: "#060609",
    borderTop: "1px solid rgba(255,255,255,0.06)" }}>

    {/* Top section — large brand statement */}
    <div style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "72px 48px 48px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap", gap: 40,
      }}>
        {/* Left: brand */}
        <div style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 20 }}>
            <img src="/logo-white.png" alt="WePrompt" style={{ width: 140, height: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
          </div>
          <p style={{
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            O futuro do trabalho<br />
            <span style={{ color: "#6366F1" }}>
              já chegou ao Brasil.
            </span>
          </p>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 15, lineHeight: 1.6,
            marginTop: 16, marginBottom: 0,
          }}>
            O 1º marketplace de soluções de IA
            da América Latina.
          </p>
        </div>

        {/* Right: CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href="/cadastro" style={{
            display: "inline-flex",
            alignItems: "center", gap: 8,
            background: "#6366F1",
            color: "white",
            padding: "14px 28px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}>
            Começar grátis →
          </a>
          <span style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 13, textAlign: "center",
          }}>
            Sem cartão de crédito
          </span>
        </div>
      </div>
    </div>

    {/* Middle section — links grid */}
    <div style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "48px 48px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 40,
    }}>
      {[
        { title: "Plataforma", links: ["Catálogo", "Preços", "Como funciona", "Blog"] },
        { title: "Para você", links: ["Para Empresas", "Para Criadores", "Sobre nós", "Contato"] },
        { title: "Legal", links: ["Privacidade", "Termos Empresas", "Termos Criadores", "Cookies"] },
        { title: "Comunidade", links: ["Instagram", "LinkedIn", "YouTube", "Newsletter"] },
      ].map(col => (
        <div key={col.title}>
          <p style={{
            color: "white", fontSize: 13,
            fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20, marginTop: 0,
          }}>
            {col.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {col.links.map(link => (
              <a key={link} href="#" style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 14, textDecoration: "none",
                transition: "color 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "24px 48px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <span style={{
        color: "rgba(255,255,255,0.25)",
        fontSize: 13,
      }}>
        © 2026 WePrompt. Todos os direitos reservados.
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 13,
        }}>
          Feito no Brasil 🇧🇷
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 999, padding: "4px 12px",
        }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#6366F1",
            boxShadow: "0 0 6px #6366F1",
          }} />
          <span style={{
            color: "#6366F1",
            fontSize: 12, fontWeight: 600,
          }}>
            Online
          </span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "#09090b", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Navbar />
      <WaitlistHero />
      <IntegrationMarquee />
      <PlatformScrollDemo />
      <SolutionsShowcase />
      <Testimonials />
      <HowItWorks />
      <ForCompanies />
      <ForCreators />
      <FinalCTA />
      <Footer />
    </div>
  );
}
