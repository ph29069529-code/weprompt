"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MessageCircle,
  Users,
  MessageSquare,
  Mail,
  TrendingUp,
  BarChart2,
  Smartphone,
  Megaphone,
  CheckCircle,
  Send,
  Globe,
  Link,
  Share2,
  Menu,
  X,
} from "lucide-react";

/* ─── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovLink, setHovLink] = useState(null);

  const navLinks = [
    { label: "Soluções", href: "/solucoes" },
    { label: "Preços", href: "/precos" },
    { label: "Para Criadores", href: "/criadores" },
    { label: "Como Funciona", href: "/#como-funciona" },
  ];

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        .nav-center-links { display: flex; }
        .nav-right-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .hero-inner { flex-direction: column !important; padding: 48px 24px 64px !important; }
          .hero-left { flex: none !important; width: 100% !important; }
          .hero-right { flex: none !important; width: 100% !important; margin-top: 48px; }
          .trust-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .cats-grid { grid-template-columns: 1fr !important; }
          .companies-inner { flex-direction: column !important; gap: 40px !important; padding: 64px 24px !important; }
          .companies-left, .companies-right { flex: none !important; width: 100% !important; }
          .creators-inner { flex-direction: column-reverse !important; gap: 40px !important; padding: 64px 24px !important; }
          .creators-left, .creators-right { flex: none !important; width: 100% !important; }
          .final-cta-card { padding: 48px 24px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .cats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,22,40,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #1E3550",
        height: 64,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 48px", height: "100%",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "#00D4AA",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>W</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>WePrompt</span>
          </a>

          {/* Center links — desktop */}
          <div className="nav-center-links" style={{ alignItems: "center", gap: 32 }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovLink(link.label)}
                onMouseLeave={() => setHovLink(null)}
                style={{
                  color: hovLink === link.label ? "#FFFFFF" : "#A8B8CC",
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right — desktop */}
          <div className="nav-right-desktop" style={{ alignItems: "center", gap: 16 }}>
            <a href="/login" style={{ color: "#A8B8CC", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A8B8CC")}>
              Entrar
            </a>
            <button
              onClick={() => router.push("/cadastro")}
              style={{
                background: "#00D4AA", color: "#0A1628",
                border: "none", borderRadius: 8,
                padding: "10px 20px", fontSize: 14, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Começar grátis →
            </button>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="nav-hamburger"
            style={{
              background: "none", border: "none",
              color: "#A8B8CC", cursor: "pointer", padding: 4,
            }}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#0A1628",
            display: "flex", flexDirection: "column",
            padding: "0 24px",
          }}>
            <div style={{
              height: 64, display: "flex",
              alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: "#00D4AA", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>W</span>
                </div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>WePrompt</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#A8B8CC", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 18, fontWeight: 600, color: "#fff",
                    textDecoration: "none", padding: "14px 0",
                    borderBottom: "1px solid #1E3550",
                  }}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              <a href="/login" style={{ border: "1.5px solid #1E3550", color: "#fff", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                Entrar
              </a>
              <a href="/cadastro" style={{ background: "#00D4AA", color: "#0A1628", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                Começar grátis →
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  const router = useRouter();

  return (
    <section style={{
      background: "radial-gradient(ellipse at 70% -10%, rgba(0,212,170,0.07) 0%, transparent 60%), #0A1628",
      minHeight: "90vh",
      display: "flex", alignItems: "center",
    }}>
      <div className="hero-inner" style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "80px 48px",
        display: "flex", alignItems: "center",
        gap: 64, width: "100%",
      }}>
        {/* Left */}
        <div className="hero-left" style={{ flex: "0 0 52%" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: "rgba(0,212,170,0.1)",
            color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}>
            ✦ O 1º MARKETPLACE DE IA DO BRASIL
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: "clamp(36px, 4.5vw, 64px)",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginTop: 20,
            marginBottom: 0,
          }}>
            Tudo que seu negócio<br />
            precisa de IA.<br />
            <span style={{ color: "#00D4AA" }}>Em um lugar só.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18,
            color: "#A8B8CC",
            lineHeight: 1.7,
            marginTop: 24,
            maxWidth: 460,
          }}>
            Agentes de IA curados, testados e prontos para trabalhar
            pelo seu negócio — com suporte em português.
          </p>

          {/* CTAs */}
          <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/solucoes")}
              style={{
                background: "#00D4AA", color: "#0A1628",
                border: "none", borderRadius: 10,
                padding: "16px 32px", fontSize: 15, fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,212,170,0.35)",
              }}
            >
              Explorar soluções
            </button>
            <button
              onClick={() => router.push("/cadastro")}
              style={{
                background: "transparent", color: "#FFFFFF",
                border: "1.5px solid #1E3550",
                borderRadius: 10, padding: "15px 28px",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}
            >
              Sou criador de IA →
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {[
                { bg: "#00D4AA", initial: "A" },
                { bg: "#3B82F6", initial: "B" },
                { bg: "#F59E0B", initial: "C" },
                { bg: "#EF4444", initial: "D" },
                { bg: "#8B5CF6", initial: "E" },
              ].map((av, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: av.bg,
                  border: "2px solid #0A1628",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginLeft: i === 0 ? 0 : -8,
                  fontSize: 11, fontWeight: 700, color: "#fff",
                  flexShrink: 0,
                }}>
                  {av.initial}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: "#5A7A99" }}>
              Mais de 200 empresas já na lista de espera
            </span>
          </div>
        </div>

        {/* Right — workspace mockup */}
        <div className="hero-right" style={{ flex: "0 0 48%", position: "relative", display: "flex", justifyContent: "center" }}>
          {/* Chip 1 */}
          <div style={{
            position: "absolute", top: -16, left: -16,
            background: "#0F1E30", border: "1px solid #1E3550",
            borderRadius: 12, padding: "8px 14px",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            zIndex: 2,
          }}>
            <CheckCircle size={14} color="#00D4AA" />
            <span style={{ color: "#A8B8CC", fontSize: 12 }}>Curadoria aprovada</span>
          </div>

          {/* Main card */}
          <div style={{
            background: "#0F1E30",
            border: "1px solid #1E3550",
            borderRadius: 20,
            padding: 24,
            width: "100%", maxWidth: 380,
            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            animation: "float 4s ease-in-out infinite",
          }}>
            {/* Card top */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{
                background: "rgba(0,212,170,0.1)", color: "#00D4AA",
                fontSize: 10, fontWeight: 700, borderRadius: 999,
                padding: "2px 8px",
              }}>
                WORKSPACE
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#00D4AA",
                  boxShadow: "0 0 8px #00D4AA",
                }} />
                <span style={{ color: "#A8B8CC", fontSize: 12 }}>Online</span>
              </div>
            </div>

            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
              Agente de Atendimento
            </div>

            {/* Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                alignSelf: "flex-end",
                background: "#00D4AA", color: "#0A1628",
                borderRadius: "12px 12px 4px 12px",
                padding: "10px 14px", fontSize: 13, maxWidth: 220, fontWeight: 500,
              }}>
                Quantos pedidos estão em aberto?
              </div>

              <div style={{
                alignSelf: "flex-start",
                background: "#132438", color: "#fff",
                borderRadius: "12px 12px 12px 4px",
                padding: "10px 14px", fontSize: 13, maxWidth: 240, lineHeight: 1.5,
              }}>
                Encontrei 12 pedidos em aberto. 3 precisam de atenção urgente.
              </div>

              <div style={{
                alignSelf: "flex-start",
                background: "#132438", color: "#fff",
                borderRadius: "12px 12px 12px 4px",
                padding: "10px 14px", fontSize: 13, maxWidth: 240, lineHeight: 1.5,
              }}>
                Deseja que eu envie um resumo para sua equipe agora?
              </div>

              {/* Typing indicator */}
              <div style={{
                alignSelf: "flex-start",
                background: "#132438", borderRadius: 12,
                padding: "10px 14px",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#00D4AA",
                    opacity: i === 0 ? 0.6 : i === 1 ? 0.8 : 1,
                    animation: "bounce 1s ease-in-out infinite",
                    animationDelay: `${delay}s`,
                  }} />
                ))}
              </div>
            </div>

            {/* Input row */}
            <div style={{
              marginTop: 12, background: "#112840",
              borderRadius: 8, padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: "#5A7A99", fontSize: 12 }}>Digite sua mensagem...</span>
              <Send size={14} color="#00D4AA" />
            </div>
          </div>

          {/* Chip 2 */}
          <div style={{
            position: "absolute", bottom: -16, right: -16,
            background: "#0F1E30", border: "1px solid #1E3550",
            borderRadius: 12, padding: "8px 14px",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            zIndex: 2,
          }}>
            <span style={{ color: "#A8B8CC", fontSize: 12 }}>🇧🇷 Suporte em português</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust bar ──────────────────────────────────────────────────── */
function TrustBar() {
  const items = [
    {
      icon: <ShieldCheck size={22} color="#00D4AA" />,
      title: "Curadoria especializada",
      desc: "Toda solução é testada antes de entrar na plataforma.",
    },
    {
      icon: <MessageCircle size={22} color="#00D4AA" />,
      title: "Suporte em português",
      desc: "Time real, em português, pronto para ajudar.",
    },
    {
      icon: <Users size={22} color="#00D4AA" />,
      title: "Comunidade exclusiva",
      desc: "Criadores e empresas que levam IA a sério.",
    },
  ];

  return (
    <section style={{
      background: "#070F1A",
      borderTop: "1px solid #1E3550",
      borderBottom: "1px solid #1E3550",
      padding: "56px 48px",
    }}>
      <div className="trust-grid" style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 40,
      }}>
        {items.map((item) => (
          <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 44, height: 44, flexShrink: 0,
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.15)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: "#A8B8CC", fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── How it works ───────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Encontre a solução certa", desc: "Navegue pelo catálogo por categoria ou desafio do negócio." },
    { num: "02", title: "Ative em minutos", desc: "Sem instalação, sem configuração técnica complexa." },
    { num: "03", title: "Use dentro da WePrompt", desc: "Histórico, suporte e atualizações em um só lugar." },
  ];

  return (
    <section id="como-funciona" style={{ padding: "96px 48px", background: "#0A1628" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,212,170,0.1)", color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 999, padding: "6px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          }}>
            COMO FUNCIONA
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800,
            color: "#fff", marginTop: 16, marginBottom: 0,
          }}>
            Simples assim.
          </h2>
          <p style={{ color: "#A8B8CC", fontSize: 16, marginTop: 12 }}>
            Sem curva de aprendizado. Sem precisar de TI.
          </p>
        </div>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {steps.map((step) => (
            <div key={step.num} style={{
              background: "#0F1E30",
              border: "1px solid #1E3550",
              borderRadius: 16, padding: 32,
            }}>
              <div style={{
                width: 40, height: 40,
                background: "rgba(0,212,170,0.1)",
                border: "1px solid rgba(0,212,170,0.2)",
                borderRadius: 10, color: "#00D4AA",
                fontSize: 18, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {step.num}
              </div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginTop: 20 }}>{step.title}</div>
              <div style={{ color: "#A8B8CC", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{step.desc}</div>
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

  const cats = [
    { icon: <MessageSquare size={22} color="#00D4AA" />, name: "Atendimento ao Cliente", desc: "Chatbots e agentes para suporte 24/7", slug: "atendimento" },
    { icon: <Mail size={22} color="#00D4AA" />, name: "Automação de E-mails", desc: "Respostas automáticas e campanhas", slug: "automacao-emails" },
    { icon: <TrendingUp size={22} color="#00D4AA" />, name: "Vendas e Prospecção", desc: "Geração de leads automatizada", slug: "vendas" },
    { icon: <BarChart2 size={22} color="#00D4AA" />, name: "Análise de Dados", desc: "Relatórios e insights em segundos", slug: "analise-dados" },
    { icon: <Smartphone size={22} color="#00D4AA" />, name: "WhatsApp IA", desc: "Atendimento e vendas pelo WhatsApp", slug: "whatsapp-ia" },
    { icon: <Megaphone size={22} color="#00D4AA" />, name: "Marketing e Conteúdo", desc: "Criação e distribuição automatizada", slug: "marketing" },
  ];

  return (
    <section style={{ padding: "96px 48px", background: "#070F1A", borderTop: "1px solid #1E3550" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#fff", margin: 0 }}>
            Uma solução para cada desafio.
          </h2>
          <p style={{ color: "#A8B8CC", fontSize: 16, marginTop: 12 }}>
            Categorias curadas para o mercado brasileiro.
          </p>
        </div>

        <div className="cats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cats.map((cat, i) => (
            <div
              key={cat.slug}
              onClick={() => router.push(`/solucoes?categoria=${cat.slug}`)}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: "#0F1E30",
                border: `1px solid ${hov === i ? "rgba(0,212,170,0.35)" : "#1E3550"}`,
                borderRadius: 16, padding: 28,
                cursor: "pointer",
                transform: hov === i ? "translateY(-2px)" : "translateY(0)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: "rgba(0,212,170,0.08)",
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cat.icon}
              </div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginTop: 14 }}>{cat.name}</div>
              <div style={{ color: "#A8B8CC", fontSize: 13, marginTop: 6 }}>{cat.desc}</div>
              <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600, marginTop: 18 }}>Ver soluções →</div>
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
  const solutions = ["Agente de Atendimento", "ChatBot WhatsApp", "Gerador de E-mails"];

  return (
    <section style={{ padding: "96px 48px", background: "#0A1628", borderTop: "1px solid #1E3550" }}>
      <div className="companies-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — mockup */}
        <div className="companies-left" style={{ flex: "0 0 50%" }}>
          <div style={{ background: "#0F1E30", border: "1px solid #1E3550", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Meu Painel</span>
              <div style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA", borderRadius: 999, padding: "3px 10px", fontSize: 11 }}>
                Empresa
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
              {[
                { val: "3", label: "Soluções ativas" },
                { val: "R$291", label: "Este mês" },
                { val: "24h", label: "Suporte" },
              ].map((m) => (
                <div key={m.label} style={{ background: "#132438", borderRadius: 10, padding: 14 }}>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{m.val}</div>
                  <div style={{ color: "#A8B8CC", fontSize: 12, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
              {solutions.map((name, i) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < solutions.length - 1 ? "1px solid #1E3550" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D4AA", flexShrink: 0 }} />
                    <span style={{ color: "#fff", fontSize: 14 }}>{name}</span>
                  </div>
                  <div style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA", fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>
                    Ativo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — text */}
        <div className="companies-right" style={{ flex: "0 0 50%" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,212,170,0.1)", color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 999, padding: "6px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          }}>
            PARA EMPRESAS
          </div>

          <h2 style={{
            fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#fff",
            marginTop: 16, marginBottom: 0, lineHeight: 1.15,
          }}>
            IA que trabalha pelo seu negócio. Em português.
          </h2>

          <p style={{ color: "#A8B8CC", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Encontre, ative e use soluções de IA — tudo dentro da WePrompt,
            sem precisar de equipe técnica.
          </p>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Soluções testadas e aprovadas pela nossa equipe",
              "Ative sem precisar de TI",
              "Suporte em português incluído",
              "Cancele quando quiser",
            ].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#00D4AA" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "#fff", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/solucoes")}
            style={{
              marginTop: 36,
              background: "#00D4AA", color: "#0A1628",
              border: "none", borderRadius: 10,
              padding: "14px 28px", fontSize: 15, fontWeight: 700,
              cursor: "pointer",
            }}
          >
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

  const sales = [
    { name: "Agente de Atendimento", value: "R$ 97", time: "2h atrás" },
    { name: "ChatBot WhatsApp", value: "R$ 147", time: "ontem" },
    { name: "Gerador de Posts", value: "R$ 67", time: "3 dias atrás" },
  ];

  const bars = [20, 28, 22, 36, 48];

  return (
    <section style={{ padding: "96px 48px", background: "#070F1A", borderTop: "1px solid #1E3550" }}>
      <div className="creators-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left — text */}
        <div className="creators-left" style={{ flex: "0 0 50%" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,212,170,0.1)", color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 999, padding: "6px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          }}>
            PARA CRIADORES
          </div>

          <h2 style={{
            fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: "#fff",
            marginTop: 16, marginBottom: 0, lineHeight: 1.15,
          }}>
            Monetize suas soluções. Alcance milhares de empresas.
          </h2>

          <p style={{ color: "#A8B8CC", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Publique, defina seu preço e comece a receber.
            A WePrompt cuida da distribuição e dos pagamentos.
          </p>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Comece grátis — publique até 3 soluções",
              "Receba via PIX em até 30 dias",
              "Apenas 20% de comissão sobre o que você vende",
            ].map((b) => (
              <div key={b} style={{ display: "flex", gap: 12 }}>
                <CheckCircle size={18} color="#00D4AA" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "#fff", fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/cadastro")}
            style={{
              marginTop: 36,
              background: "transparent", color: "#fff",
              border: "1.5px solid #1E3550",
              borderRadius: 10, padding: "14px 28px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            Quero ser um criador →
          </button>
        </div>

        {/* Right — revenue mockup */}
        <div className="creators-right" style={{ flex: "0 0 50%" }}>
          <div style={{ background: "#0F1E30", border: "1px solid #1E3550", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Minha receita</span>
              <div style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA", borderRadius: 999, padding: "3px 10px", fontSize: 11 }}>
                Criador Pro
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#fff", fontSize: 36, fontWeight: 800 }}>R$ 2.840</div>
              <div style={{ color: "#A8B8CC", fontSize: 13, marginTop: 4 }}>Este mês</div>
              <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600, marginTop: 8 }}>↑ +34% vs. mês anterior</div>
            </div>

            {/* Bar chart */}
            <div style={{ marginTop: 20, display: "flex", gap: 6, alignItems: "flex-end", height: 48 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: 20, height: h,
                  background: i === bars.length - 1 ? "#00D4AA" : "#1E3550",
                  borderRadius: "4px 4px 0 0",
                }} />
              ))}
            </div>

            {/* Recent sales */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
              {sales.map((sale, i) => (
                <div key={sale.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < sales.length - 1 ? "1px solid #1E3550" : "none",
                }}>
                  <span style={{ color: "#fff", fontSize: 13 }}>{sale.name}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600 }}>{sale.value}</span>
                    <span style={{ color: "#5A7A99", fontSize: 12, marginLeft: 8 }}>{sale.time}</span>
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

/* ─── Final CTA ──────────────────────────────────────────────────── */
function FinalCTA() {
  const router = useRouter();

  return (
    <section style={{ padding: "80px 48px", background: "#0A1628", borderTop: "1px solid #1E3550" }}>
      <div className="final-cta-card" style={{
        maxWidth: 700, margin: "0 auto",
        background: "linear-gradient(135deg, rgba(0,212,170,0.07) 0%, rgba(10,22,40,0) 100%)",
        border: "1px solid rgba(0,212,170,0.18)",
        borderRadius: 24,
        padding: "72px 64px",
        textAlign: "center",
      }}>
        <h2 style={{
          color: "#fff",
          fontSize: "clamp(28px, 3vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: 0,
        }}>
          Seu negócio não pode esperar.
        </h2>
        <p style={{ color: "#A8B8CC", fontSize: 17, lineHeight: 1.6, marginTop: 16 }}>
          Comece hoje. É grátis. Suporte em português.
        </p>
        <button
          onClick={() => router.push("/cadastro")}
          style={{
            marginTop: 36,
            background: "#00D4AA", color: "#0A1628",
            border: "none", borderRadius: 10,
            padding: "18px 40px", fontSize: 16, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,212,170,0.3)",
          }}
        >
          Começar agora, é grátis →
        </button>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Plataforma", links: ["Catálogo", "Preços", "Como funciona", "Blog"] },
    { title: "Para você", links: ["Para Empresas", "Para Criadores", "Sobre nós", "Contato"] },
    { title: "Legal", links: ["Privacidade", "Termos Empresas", "Termos Criadores"] },
  ];

  return (
    <footer style={{ background: "#070F1A", borderTop: "1px solid #1E3550", padding: "56px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", gap: 40 }}>
          {/* Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28,
                background: "#00D4AA", borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>W</span>
              </div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>WePrompt</span>
            </div>
            <p style={{ color: "#A8B8CC", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              O 1º marketplace de soluções de IA da América Latina.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {[Globe, Link, Share2].map((Icon, i) => (
                <a key={i} href="#" style={{ color: "#5A7A99", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5A7A99")}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Cols 2-4 */}
          {cols.map((col) => (
            <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{col.title}</div>
              {col.links.map((link) => (
                <a key={link} href="#"
                  style={{ color: "#A8B8CC", fontSize: 14, textDecoration: "none", lineHeight: 2, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#A8B8CC")}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          borderTop: "1px solid #1E3550",
          paddingTop: 32, marginTop: 40,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "#5A7A99", fontSize: 13 }}>© 2026 WePrompt. Todos os direitos reservados.</span>
          <span style={{ color: "#5A7A99", fontSize: 13 }}>Feito no Brasil 🇧🇷</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "#0A1628", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Categories />
      <ForCompanies />
      <ForCreators />
      <FinalCTA />
      <Footer />
    </div>
  );
}
