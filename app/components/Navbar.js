"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WePromptLogo from "./WePromptLogo";
import { supabase } from "../lib/supabase";
import {
  TrendingUp, Sparkles, Star,
  Bot, Zap, MessageCircle, Megaphone, BarChart2, Smartphone,
  Building2, Palette, HelpCircle,
  Rocket, CreditCard, LayoutDashboard,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPLORAR_CATS = [
  { Icon: Bot,           label: "Agentes de IA",    desc: "Automatize processos completos",        href: "/solucoes?categoria=agentes" },
  { Icon: Zap,           label: "Automação",         desc: "Make, n8n e integrações",              href: "/solucoes?categoria=automacao" },
  { Icon: MessageCircle, label: "Chatbots",          desc: "Atendimento 24h no piloto automático", href: "/solucoes?categoria=chatbots" },
  { Icon: Megaphone,     label: "Marketing IA",      desc: "Copies, criativos e campanhas",        href: "/solucoes?categoria=marketing" },
  { Icon: BarChart2,     label: "Análise de Dados",  desc: "Insights em segundos",                 href: "/solucoes?categoria=analytics" },
  { Icon: Smartphone,    label: "WhatsApp IA",       desc: "Vendas e suporte no WhatsApp",         href: "/solucoes?categoria=whatsapp" },
];

const EXPLORAR_HIGHLIGHTS = [
  { Icon: TrendingUp, label: "Soluções em Alta", href: "/solucoes?filter=alta" },
  { Icon: Sparkles,   label: "Lançamentos",      href: "/solucoes?filter=novos" },
  { Icon: Star,       label: "Mais Vendidas",     href: "/solucoes?filter=mais-vendidas" },
];

const COMO_FUNCIONA_ITEMS = [
  { Icon: Building2,  label: "Para Empresas",    desc: "Encontre e implemente soluções de IA", href: "/#como-funciona" },
  { Icon: Palette,    label: "Para Criadores",   desc: "Publique e monetize suas soluções",    href: "/criadores" },
  { Icon: HelpCircle, label: "Dúvidas frequentes", desc: "Perguntas e respostas",             href: "/precos" },
];

const PARA_CRIADORES_ITEMS = [
  { Icon: Rocket,          label: "Publicar Solução",    desc: "Comece a vender agora",         href: "/cadastro?role=criador" },
  { Icon: CreditCard,      label: "Planos para Criadores", desc: "Free, Pro e Premium",         href: "/precos" },
  { Icon: Zap,             label: "Criadores Fundadores", desc: "100 vagas com 1 mês grátis",  href: "/criadores", badge: true },
  { Icon: LayoutDashboard, label: "Meu Dashboard",       desc: "Acesse suas ferramentas",      href: "/dashboard/criador" },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DropdownItem({ Icon, label, desc, href, badge, onClose }) {
  return (
    <a
      href={href}
      onClick={onClose}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="#6366F1" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{label}</span>
          {badge && (
            <span
              style={{
                background: "#FEF3C7",
                color: "#92400E",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 999,
              }}
            >
              Novo
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#6E6E73", lineHeight: 1.4, marginTop: 1 }}>{desc}</div>
      </div>
    </a>
  );
}

function ChevronDown({ open }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s",
        display: "block",
      }}
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={3} y1={6} x2={21} y2={6} />
      <line x1={3} y1={12} x2={21} y2={12} />
      <line x1={3} y1={18} x2={21} y2={18} />
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDashboardUrl(session) {
  if (!session) return "/dashboard/empresa";
  const email = session.user?.email;
  const role = session.user?.user_metadata?.role;
  if (email === "ph29069529@gmail.com") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  // On homepage: always transparent. On other pages: solid white.
  const transparent = isHomepage;

  const [session, setSession] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Click outside
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Body overflow lock
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Scroll detection — transparent over hero (100vh), solid past it
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openDropdown(key) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(key);
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }

  const dashboardUrl = getDashboardUrl(session);

  // ── Explorar megamenu ──
  const explorarDropdown = (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        minWidth: 640,
        overflow: "hidden",
        animation: "navDropIn 0.2s ease",
        zIndex: 100,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
        {/* Left col */}
        <div style={{ padding: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6E6E73",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Categorias
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {EXPLORAR_CATS.map((item) => (
              <DropdownItem
                key={item.href}
                {...item}
                onClose={() => setActiveDropdown(null)}
              />
            ))}
          </div>
        </div>
        {/* Right col */}
        <div
          style={{
            padding: "24px 16px",
            background: "#FAFAFA",
            borderLeft: "1px solid #F0F0F0",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6E6E73",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Destaques
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {EXPLORAR_HIGHLIGHTS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveDropdown(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F0F0F0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <item.Icon size={16} color="#6366F1" style={{ flexShrink: 0 }} />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom CTA */}
      <div
        style={{
          background: "#E0F2FE",
          padding: "12px 24px",
          borderTop: "1px solid #BAE6FD",
        }}
      >
        <a
          href="/solucoes"
          onClick={() => setActiveDropdown(null)}
          style={{
            color: "#6366F1",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Ver todas as soluções →
        </a>
      </div>
    </div>
  );

  // ── Generic small dropdown ──
  function smallDropdown(items) {
    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: 16,
          minWidth: 300,
          animation: "navDropIn 0.2s ease",
          zIndex: 100,
        }}
      >
        {items.map((item) => (
          <DropdownItem
            key={item.href}
            {...item}
            onClose={() => setActiveDropdown(null)}
          />
        ))}
      </div>
    );
  }

  // ── Nav trigger button style ──
  const triggerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: transparent ? "rgba(255,255,255,0.85)" : "#374151",
    borderRadius: 8,
    transition: "background 0.15s, color 0.3s",
    fontFamily: "inherit",
  };
  const triggerHoverBg = transparent ? "rgba(255,255,255,0.1)" : "#F5F5F7";

  return (
    <>
      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Desktop header ── */}
      <header
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: transparent ? "transparent" : "rgba(255,255,255,0.95)",
          backdropFilter: transparent ? "none" : "blur(16px)",
          WebkitBackdropFilter: transparent ? "none" : "blur(16px)",
          borderBottom: transparent ? "none" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: transparent ? "none" : "0 1px 20px rgba(0,0,0,0.06)",
          height: 64,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img
              src={transparent ? "/logo-white.png" : "/logo.png"}
              alt="WePrompt"
              style={{ width: 140, height: "auto", display: "block", transition: "opacity 0.3s" }}
            />
          </Link>

          {/* Center nav — desktop only */}
          {!isMobile && (
            <nav
              style={{
                display: "flex",
                gap: 2,
                flex: 1,
                justifyContent: "center",
              }}
            >
              {/* Explorar */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => openDropdown("explorar")}
                onMouseLeave={scheduleClose}
              >
                <button
                  style={triggerStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = triggerHoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Explorar <ChevronDown open={activeDropdown === "explorar"} />
                </button>
                {activeDropdown === "explorar" && explorarDropdown}
              </div>

              {/* Preços — direct link */}
              <a
                href="/precos"
                style={{
                  ...triggerStyle,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = triggerHoverBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Preços
              </a>

              {/* Como funciona */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => openDropdown("como-funciona")}
                onMouseLeave={scheduleClose}
              >
                <button
                  style={triggerStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = triggerHoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Como funciona <ChevronDown open={activeDropdown === "como-funciona"} />
                </button>
                {activeDropdown === "como-funciona" && smallDropdown(COMO_FUNCIONA_ITEMS)}
              </div>

              {/* Para Criadores */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => openDropdown("para-criadores")}
                onMouseLeave={scheduleClose}
              >
                <button
                  style={triggerStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = triggerHoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Para Criadores <ChevronDown open={activeDropdown === "para-criadores"} />
                </button>
                {activeDropdown === "para-criadores" && smallDropdown(PARA_CRIADORES_ITEMS)}
              </div>
            </nav>
          )}

          {/* Right CTAs — desktop only */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              {session ? (
                <a
                  href={dashboardUrl}
                  style={{
                    background: transparent ? "rgba(255,255,255,0.12)" : "#6366F1",
                    color: "white",
                    border: transparent ? "1px solid rgba(255,255,255,0.2)" : "none",
                    borderRadius: 999,
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                    transition: "background 0.3s, border 0.3s",
                  }}
                >
                  Meu Dashboard →
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    style={{
                      color: transparent ? "rgba(255,255,255,0.8)" : "#374151",
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    Entrar
                  </a>
                  <a
                    href="/cadastro"
                    style={{
                      background: transparent ? "white" : "#6366F1",
                      color: transparent ? "#0A0F1E" : "white",
                      borderRadius: 999,
                      padding: "10px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "background 0.3s, color 0.3s",
                    }}
                  >
                    Começar grátis
                  </a>
                </>
              )}
            </div>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 8,
                color: transparent ? "white" : "#1D1D1F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.3s",
              }}
              aria-label="Abrir menu"
            >
              <HamburgerIcon />
            </button>
          )}
        </div>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      {isMobile && mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "white",
            display: "flex",
            flexDirection: "column",
            fontFamily: "DM Sans, sans-serif",
            animation: "mobileIn 0.18s ease",
          }}
        >
          {/* Mobile header */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <a href="/" style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
              <div style={{ height: 40, overflow: "hidden" }}>
                <WePromptLogo id="navbar-logo-mobile" />
              </div>
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 24,
                color: "#1D1D1F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {/* Explorar accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileExpanded(mobileExpanded === "explorar" ? null : "explorar")
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  borderBottom: "1px solid #e5e7eb",
                  fontFamily: "inherit",
                }}
              >
                Explorar
                <ChevronDown open={mobileExpanded === "explorar"} />
              </button>
              {mobileExpanded === "explorar" && (
                <div
                  style={{
                    borderLeft: "2px solid #E0F2FE",
                    marginLeft: 8,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {EXPLORAR_CATS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        textDecoration: "none",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <item.Icon size={18} color="#6366F1" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: "#6E6E73" }}>{item.desc}</div>
                      </div>
                    </a>
                  ))}
                  {EXPLORAR_HIGHLIGHTS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        textDecoration: "none",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <item.Icon size={16} color="#6366F1" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Preços direct link */}
            <a
              href="/precos"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "16px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "#1D1D1F",
                textDecoration: "none",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Preços
            </a>

            {/* Como funciona accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileExpanded(mobileExpanded === "como-funciona" ? null : "como-funciona")
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  borderBottom: "1px solid #e5e7eb",
                  fontFamily: "inherit",
                }}
              >
                Como funciona
                <ChevronDown open={mobileExpanded === "como-funciona"} />
              </button>
              {mobileExpanded === "como-funciona" && (
                <div
                  style={{
                    borderLeft: "2px solid #E0F2FE",
                    marginLeft: 8,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {COMO_FUNCIONA_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        textDecoration: "none",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <item.Icon size={18} color="#6366F1" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: "#6E6E73" }}>{item.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Para Criadores accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileExpanded(mobileExpanded === "para-criadores" ? null : "para-criadores")
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  borderBottom: "1px solid #e5e7eb",
                  fontFamily: "inherit",
                }}
              >
                Para Criadores
                <ChevronDown open={mobileExpanded === "para-criadores"} />
              </button>
              {mobileExpanded === "para-criadores" && (
                <div
                  style={{
                    borderLeft: "2px solid #E0F2FE",
                    marginLeft: 8,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {PARA_CRIADORES_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        textDecoration: "none",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <item.Icon size={18} color="#6366F1" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</span>
                          {item.badge && (
                            <span
                              style={{
                                background: "#FEF3C7",
                                color: "#92400E",
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 999,
                              }}
                            >
                              Novo
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#6E6E73" }}>{item.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile footer CTAs */}
          <div
            style={{
              flexShrink: 0,
              padding: "20px 24px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {session ? (
              <a
                href={dashboardUrl}
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "#6366F1",
                  color: "white",
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Meu Dashboard →
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    border: "2px solid #6366F1",
                    color: "#6366F1",
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Entrar
                </a>
                <a
                  href="/cadastro"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    background: "#6366F1",
                    color: "white",
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Começar grátis
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
