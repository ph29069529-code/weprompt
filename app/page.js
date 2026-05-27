"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

/* ─── Design tokens ──────────────────────────────────────────────── */
const BLUE      = "#2563EB";
const DARK      = "#0F172A";
const TEXT      = "#1E293B";
const MUTED     = "#64748B";
const BG        = "#F8FAFC";
const WHITE     = "#FFFFFF";
const ACCENT    = "#3B82F6";
const BORDER    = "#e2e8f0";
const CARD_R    = 20;
const SHADOW    = "0 4px 24px rgba(0,0,0,0.08)";

/* ─── Hooks ──────────────────────────────────────────────────────── */
function useWindowSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    function onResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

/* ─── Tiny helpers ───────────────────────────────────────────────── */
const FooterLink = ({ href, children }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{ fontSize: 14, color: hov ? WHITE : "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.15s", display: "block", marginBottom: 10 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
};

const NavLink = ({ href, children, active }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: hov || active ? BLUE : MUTED,
        textDecoration: "none",
        paddingBottom: 2,
        borderBottom: active ? `2px solid ${BLUE}` : "2px solid transparent",
        transition: "color 0.15s, border-color 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
};

/* ─── Inline Navbar ──────────────────────────────────────────────── */
function PageNavbar({ session, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardUrl = session?.user?.user_metadata?.tipo === "criador"
    ? "/dashboard/criador"
    : session?.user?.user_metadata?.tipo === "empresa"
    ? "/dashboard/empresa"
    : "/dashboard/admin";

  const NAV_LINKS = [
    { label: "Home",      href: "/" },
    { label: "Sobre",     href: "/#sobre" },
    { label: "Soluções",  href: "/solucoes" },
    { label: "Preços",    href: "/precos" },
    { label: "Criadores", href: "/criadores" },
    { label: "Contato",   href: "mailto:contato@weprompt.app.br" },
  ];

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: WHITE,
        borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow 0.2s, border-color 0.2s",
        height: 64,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo-light.png" height={36} style={{ height: 36, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }} alt="WePrompt" />
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <NavLink key={label} href={href}>{label}</NavLink>
              ))}
            </nav>
          )}

          {/* Right actions */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              {session ? (
                <a href={dashboardUrl} style={{
                  background: DARK, color: WHITE, borderRadius: 999,
                  padding: "10px 20px", fontSize: 14, fontWeight: 600,
                  textDecoration: "none", whiteSpace: "nowrap",
                }}>
                  Meu Dashboard →
                </a>
              ) : (
                <>
                  <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: MUTED, textDecoration: "none" }}>
                    Entrar
                  </a>
                  <a href="/cadastro" style={{
                    background: DARK, color: WHITE, borderRadius: 999,
                    padding: "10px 20px", fontSize: 14, fontWeight: 600,
                    textDecoration: "none", whiteSpace: "nowrap",
                  }}>
                    Começar grátis →
                  </a>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              aria-label="Abrir menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: WHITE,
          display: "flex", flexDirection: "column",
          padding: "0 24px",
        }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <img src="/logo-light.png" height={36} style={{ height: 36, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }} alt="WePrompt" />
            </a>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                fontSize: 18, fontWeight: 600, color: TEXT, textDecoration: "none",
                padding: "14px 0", borderBottom: `1px solid ${BORDER}`,
              }}>
                {label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            {session ? (
              <a href={dashboardUrl} style={{
                background: DARK, color: WHITE, borderRadius: 12,
                padding: "14px 24px", fontSize: 15, fontWeight: 700,
                textDecoration: "none", textAlign: "center",
              }}>
                Meu Dashboard →
              </a>
            ) : (
              <>
                <a href="/login" style={{
                  border: `1.5px solid ${BORDER}`, color: TEXT, borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 600,
                  textDecoration: "none", textAlign: "center",
                }}>
                  Entrar
                </a>
                <a href="/cadastro" style={{
                  background: BLUE, color: WHITE, borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", textAlign: "center",
                }}>
                  Começar grátis →
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero right visual ──────────────────────────────────────────── */
function HeroVisual() {
  return (
    <div style={{ position: "relative", height: 480, width: "100%" }}>
      {/* Grid dots background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        borderRadius: 32,
        opacity: 0.5,
      }} />

      {/* Main gradient card */}
      <div style={{
        position: "absolute", inset: "16px 0 16px 32px",
        background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 55%, #06B6D4 100%)",
        borderRadius: 32,
        overflow: "hidden",
      }}>
        {/* Inner shimmer */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 240, height: 240,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 180, height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
      </div>

      {/* Floating glass card 1 — top right: Agentes de IA */}
      <div style={{
        position: "absolute", top: 24, right: -16,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 20,
        padding: "18px 22px",
        color: WHITE,
        width: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em" }}>01</div>
        <div style={{ fontSize: 24, marginBottom: 4 }}>🤖</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Agentes de IA</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Automatize processos completos</div>
      </div>

      {/* Floating glass card 2 — bottom left: Solução Verificada */}
      <div style={{
        position: "absolute", bottom: 48, left: 16,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 20,
        padding: "18px 22px",
        color: WHITE,
        width: 210,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.25)", borderRadius: 999,
          padding: "3px 10px", marginBottom: 10,
          fontSize: 11, fontWeight: 700, color: "#6EE7B7",
        }}>
          ✓ Solução Verificada
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Agente de Vendas WhatsApp</div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>R$ 97,00</div>
      </div>

      {/* Floating white card — center: mini dashboard */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-30%, -50%)",
        background: WHITE,
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        width: 200,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Dashboard WePrompt
        </div>
        {[
          { name: "Agente Vendas",   status: "Ativo" },
          { name: "Auto Proposta",   status: "Ativo" },
          { name: "Suporte 24h",     status: "Ativo" },
        ].map(({ name, status }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE }} />
              <span style={{ fontSize: 11, color: TEXT, fontWeight: 500 }}>{name}</span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#059669",
              background: "#D1FAE5", borderRadius: 999, padding: "2px 6px",
            }}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Category card ─────────────────────────────────────────────── */
function CategoryCard({ name, icon, color, count, slug }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={`/solucoes?categoria=${slug || name}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        background: WHITE,
        borderRadius: CARD_R,
        overflow: "hidden",
        cursor: "pointer",
        transform: hov ? "scale(1.02)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.14)" : SHADOW,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}>
        {/* Top gradient */}
        <div style={{
          height: 140,
          background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 8,
        }}>
          <span style={{ fontSize: 48 }}>{icon}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: WHITE }}>{name}</span>
        </div>
        {/* Bottom */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
            {count !== null ? `${count} solução${count !== 1 ? "ões" : ""} disponível${count !== 1 ? "is" : ""}` : "Em breve"}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Explorar →</span>
        </div>
      </div>
    </a>
  );
}

/* ─── Step card ─────────────────────────────────────────────────── */
function StepCard({ num, icon, title, desc }) {
  return (
    <div style={{
      background: WHITE,
      borderRadius: CARD_R,
      padding: 32,
      border: `1px solid ${BORDER}`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 16, right: 20,
        fontSize: 56, fontWeight: 900, color: "#EFF6FF",
        lineHeight: 1, userSelect: "none",
      }}>{num}</div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: BLUE,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 20,
      }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function Home() {
  const width = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data?.session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      const { data: cats } = await supabase.from("categories").select("*").order("nome");
      if (!cats || cats.length === 0) { setCategories([]); return; }
      const withCounts = await Promise.all(cats.map(async (cat) => {
        const { count } = await supabase
          .from("solutions")
          .select("id", { count: "exact", head: true })
          .eq("categoria", cat.nome)
          .eq("status", "ativo");
        return { ...cat, count: count ?? 0 };
      }));
      setCategories(withCounts);
    }
    loadCategories();
  }, []);

  const PLACEHOLDER_CATS = [
    { nome: "Agentes de IA",    icone: "🤖", cor: "#2563EB", slug: "agentes-ia",     count: null },
    { nome: "Automação",        icone: "⚡", cor: "#7C3AED", slug: "automacao",       count: null },
    { nome: "Chatbots",         icone: "💬", cor: "#059669", slug: "chatbots",        count: null },
    { nome: "Marketing IA",     icone: "📈", cor: "#D97706", slug: "marketing-ia",    count: null },
    { nome: "Análise de Dados", icone: "📊", cor: "#DC2626", slug: "analise-dados",   count: null },
    { nome: "WhatsApp IA",      icone: "📱", cor: "#0891B2", slug: "whatsapp-ia",     count: null },
  ];

  const displayCats = (categories && categories.length > 0) ? categories : PLACEHOLDER_CATS;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: TEXT, background: WHITE }}>

      {/* ════════════════════════════════════
          SECTION 1 — NAVBAR
      ════════════════════════════════════ */}
      <PageNavbar session={session} isMobile={isMobile} />

      {/* ════════════════════════════════════
          SECTION 2 — HERO
      ════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 24px 72px" : "80px 48px" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : 64,
          alignItems: "center",
        }}>
          {/* Left: text */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: "#EFF6FF", color: BLUE,
              borderRadius: 999, padding: "6px 14px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 24,
            }}>
              ✦ 1º Marketplace de IA do Brasil
            </div>

            {/* H1 */}
            <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, color: DARK, lineHeight: 1.08, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Encontre Soluções de IA Que
            </h1>
            <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, color: DARK, lineHeight: 1.08, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Transformam Seu Negócio
            </h1>
            <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, color: BLUE, lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-0.02em", fontStyle: "italic" }}>
              Em Resultados Reais
            </h1>

            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, margin: "0 0 32px", maxWidth: 480 }}>
              O primeiro marketplace brasileiro de soluções de inteligência artificial. Curadoria especializada, suporte em português e pagamentos em reais.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
              <a href="/solucoes" style={{
                background: BLUE, color: WHITE, borderRadius: 12,
                padding: "14px 28px", fontSize: 15, fontWeight: 700,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.35)"; }}
              >
                Explorar Soluções →
              </a>
              <a href="/criadores" style={{
                background: "transparent", border: `1.5px solid ${BORDER}`, color: TEXT,
                borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                transition: "border-color 0.15s, color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT; }}
              >
                Para Criadores ↗
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
              gap: isMobile ? "20px 32px" : "0 40px",
              justifyContent: isMobile ? "start" : "start",
            }}>
              {[
                { num: "1º",     label: "Marketplace de IA" },
                { num: "48h",    label: "Aprovação de soluções" },
                { num: "100",    label: "Vagas de fundador" },
                { num: "7 dias", label: "Garantia de reembolso" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: DARK, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          {!isMobile && <HeroVisual />}
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — CATEGORIAS
      ════════════════════════════════════ */}
      <section style={{ background: BG, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "340px 1fr",
            gap: isTablet ? 40 : 64,
            alignItems: "start",
          }}>
            {/* Left sticky */}
            <div style={{ position: isTablet ? "static" : "sticky", top: 80 }}>
              <div style={{
                display: "inline-block",
                background: "#EFF6FF", color: BLUE, borderRadius: 999,
                padding: "5px 14px", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
              }}>
                Nossas Soluções
              </div>
              <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: DARK, lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Soluções de IA Para Cada Necessidade
              </h2>
              <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: BLUE, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Do Seu Negócio
              </span>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, margin: "16px 0 28px", maxWidth: 300 }}>
                Trabalhamos com criadores talentosos para trazer as melhores ferramentas de IA ao mercado brasileiro.
              </p>
              <a href="/solucoes" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: `1.5px solid ${BLUE}`, color: BLUE, borderRadius: 12,
                padding: "12px 24px", fontSize: 14, fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = WHITE; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BLUE; }}
              >
                Ver todas as soluções →
              </a>
            </div>

            {/* Right: category grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 20,
            }}>
              {displayCats.map((cat) => (
                <CategoryCard
                  key={cat.nome}
                  name={cat.nome}
                  icon={cat.icone || "🔮"}
                  color={cat.cor || BLUE}
                  count={cat.count ?? null}
                  slug={cat.slug || cat.nome}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 4 — COMO FUNCIONA
      ════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block",
              background: "#EFF6FF", color: BLUE, borderRadius: 999,
              padding: "5px 14px", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Como Funciona
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: DARK, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Simples de Usar,
            </h2>
            <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: BLUE, margin: 0, letterSpacing: "-0.02em" }}>
              Poderoso nos Resultados
            </h2>
          </div>

          {/* Steps */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 24,
          }}>
            <StepCard
              num="01"
              icon="🔍"
              title="Explore o catálogo"
              desc="Navegue por centenas de soluções de IA organizadas por categoria e necessidade."
            />
            <StepCard
              num="02"
              icon="⚡"
              title="Adquira com 1 clique"
              desc="Pagamento seguro em reais via cartão ou PIX. Acesso imediato após confirmação."
            />
            <StepCard
              num="03"
              icon="🚀"
              title="Implemente e escale"
              desc="Suporte em português incluído. Coloque sua solução rodando no mesmo dia."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 5 — SOBRE NÓS
      ════════════════════════════════════ */}
      <section id="sobre" style={{ background: DARK, padding: isMobile ? "72px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 48 : 64,
            alignItems: "center",
          }}>
            {/* Left: text */}
            <div>
              <div style={{
                display: "inline-block",
                background: "rgba(59,130,246,0.2)", color: ACCENT, borderRadius: 999,
                padding: "5px 14px", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24,
              }}>
                Sobre Nós
              </div>
              <h2 style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800, color: WHITE, lineHeight: 1.15, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Feitos Para Quem Cria.
              </h2>
              <h2 style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800, color: ACCENT, lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.02em" }}>
                E Para Quem Precisa Crescer.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 16px" }}>
                A WePrompt nasceu com um propósito simples: conectar criadores talentosos de soluções de IA com empresas que precisam de ferramentas que realmente funcionam.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 16px" }}>
                Para as empresas, cada solução dentro da WePrompt passou por uma curadoria especializada e foi testada antes de chegar até você. Aqui você não arrisca — você simplesmente escolhe, adquire e implementa com confiança.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 32px" }}>
                Para os criadores, a WePrompt é o espaço construído 100% para vocês. Um lugar onde suas soluções chegam a milhares de empresas, onde você faz dinheiro de verdade e onde o crescimento da plataforma é o seu crescimento.
              </p>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
                {[
                  { icon: "🏢", title: "PMEs atendidas",  sub: "Crescendo todo dia" },
                  { icon: "✅", title: "Curadoria 100%",  sub: "Toda solução é testada" },
                  { icon: "🌎", title: "América Latina",  sub: "Nossa visão de alcance" },
                ].map(({ icon, title, sub }) => (
                  <div key={title} style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "20px 18px",
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dark card */}
            <div style={{
              background: "#1E293B",
              borderRadius: 24,
              padding: isMobile ? "32px 24px" : "40px",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: WHITE, marginBottom: 28, letterSpacing: "-0.02em" }}>Nossa Missão</div>

              {[
                "✅ Soluções 100% testadas e aprovadas",
                "🎯 Espaço feito para criadores venderem",
                "🌎 A maior plataforma de IA da América Latina",
              ].map((item, i) => (
                <div key={item} style={{
                  padding: "18px 0",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  fontSize: 15, fontWeight: 600, color: WHITE,
                }}>
                  {item}
                </div>
              ))}

              <a href="/cadastro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: WHITE, color: BLUE,
                borderRadius: 12, padding: "12px 24px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                marginTop: 28,
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Fazer parte da história →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 6 — CTA FINAL
      ════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
        padding: isMobile ? "72px 24px" : "80px 48px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: WHITE, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Pronto Para Transformar Seu Negócio Com IA?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 36px" }}>
            Junte-se às empresas que já descobriram o poder das soluções de IA da WePrompt.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <a href="/solucoes" style={{
              background: WHITE, color: BLUE, borderRadius: 12,
              padding: "14px 28px", fontSize: 15, fontWeight: 700,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Explorar Soluções →
            </a>
            <a href="/cadastro" style={{
              background: "transparent", border: "1.5px solid rgba(255,255,255,0.5)", color: WHITE,
              borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = WHITE}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"}
            >
              Quero ser Criador
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 7 — FOOTER
      ════════════════════════════════════ */}
      <footer style={{ background: DARK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "56px 24px 40px" : "64px 48px 48px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
            gap: isMobile ? 40 : 40,
          }}>
            {/* Col 1: Brand */}
            <div>
              <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: 16 }}>
                <img src="/logo-dark.png" height={36} style={{ height: 36, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }} alt="WePrompt" />
              </a>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 240 }}>
                O 1º marketplace de soluções de IA da América Latina.
              </p>
              <a href="mailto:contato@weprompt.app.br" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>
                contato@weprompt.app.br
              </a>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {[
                  { label: "Instagram", href: "https://instagram.com/weprompt", icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  )},
                  { label: "LinkedIn", href: "https://linkedin.com/company/weprompt", icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )},
                ].map(({ label, href, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,0.5)", textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = WHITE; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Plataforma */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Plataforma
              </h4>
              <FooterLink href="/solucoes">Explorar</FooterLink>
              <FooterLink href="/precos">Preços</FooterLink>
              <FooterLink href="/#como-funciona">Como Funciona</FooterLink>
              <FooterLink href="/criadores">Para Criadores</FooterLink>
              <FooterLink href="/cadastro">Cadastrar</FooterLink>
            </div>

            {/* Col 3: Criadores */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Criadores
              </h4>
              <FooterLink href="/dashboard/criador">Publicar Solução</FooterLink>
              <FooterLink href="/precos">Planos</FooterLink>
              <FooterLink href="/criadores">Fundadores</FooterLink>
              <FooterLink href="/dashboard/criador">Dashboard</FooterLink>
              <FooterLink href="/para-criadores/termos">Termos</FooterLink>
            </div>

            {/* Col 4: Ajuda */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                Ajuda
              </h4>
              <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
              <FooterLink href="/ajuda#faq">FAQ</FooterLink>
              <FooterLink href="/privacidade">Privacidade</FooterLink>
              <FooterLink href="mailto:contato@weprompt.app.br">Contato</FooterLink>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 48, paddingTop: 24, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 8 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              © 2026 WePrompt — O 1º marketplace de soluções de IA da América Latina.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
