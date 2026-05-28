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

/* ─── Floating pill navbar ───────────────────────────────────────── */
const SOLUCOES_ITEMS = [
  { icon: "🤖", label: "Agentes de IA",    desc: "Automatize processos",   href: "/solucoes?categoria=agentes-de-ia"  },
  { icon: "⚡", label: "Automação",         desc: "Make, n8n e mais",       href: "/solucoes?categoria=automacao"      },
  { icon: "💬", label: "Chatbots",          desc: "Atendimento 24h",        href: "/solucoes?categoria=chatbots"       },
  { icon: "📣", label: "Marketing IA",      desc: "Copies e campanhas",     href: "/solucoes?categoria=marketing-ia"   },
  { icon: "📊", label: "Análise de Dados",  desc: "Insights rápidos",       href: "/solucoes?categoria=analise-de-dados" },
  { icon: "📱", label: "WhatsApp IA",       desc: "Vendas no WhatsApp",     href: "/solucoes?categoria=whatsapp-ia"   },
];

const EMPRESA_ITEMS = [
  { icon: "🏢", label: "Para Empresas",  desc: "Encontre soluções testadas", href: "/#como-funciona" },
  { icon: "💰", label: "Preços",         desc: "Planos e valores",           href: "/precos"         },
  { icon: "❓", label: "Como funciona",  desc: "Entenda a plataforma",       href: "/#como-funciona" },
];

function DropdownMenu({ items, seeAllHref, onMouseEnter, onMouseLeave }) {
  const [hovIdx, setHovIdx] = useState(null);
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute", top: "calc(100% + 12px)", left: 0,
        background: "#fff", borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        padding: 16, minWidth: 220, zIndex: 100,
        animation: "dropIn 0.15s ease forwards",
      }}
    >
      {items.map((item, i) => (
        <a key={item.label} href={item.href}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "8px 10px", borderRadius: 10, textDecoration: "none",
            background: hovIdx === i ? "#f8fafc" : "transparent",
            transition: "background 0.12s",
          }}
          onMouseEnter={() => setHovIdx(i)}
          onMouseLeave={() => setHovIdx(null)}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>{item.icon}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.3 }}>{item.desc}</div>
          </div>
        </a>
      ))}
      {seeAllHref && (
        <a href={seeAllHref} style={{
          display: "block", marginTop: 8,
          background: "#f8fafc", borderRadius: 10, padding: "9px 12px",
          fontSize: 13, fontWeight: 600, color: "#2563EB",
          textDecoration: "none",
        }}>
          Ver todas as soluções →
        </a>
      )}
    </div>
  );
}

function PageNavbar({ session, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const leaveTimer = useRef(null);

  const dashboardUrl = session?.user?.user_metadata?.tipo === "criador"
    ? "/dashboard/criador"
    : session?.user?.user_metadata?.tipo === "empresa"
    ? "/dashboard/empresa"
    : "/dashboard/admin";

  function openDropdown(key) {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveDropdown(key);
  }
  function closeDropdown() {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  const linkStyle = (hov) => ({
    fontSize: 14, fontWeight: 500,
    color: hov ? "#111827" : "#374151",
    textDecoration: "none", whiteSpace: "nowrap",
    transition: "color 0.15s", cursor: "pointer",
    background: "none", border: "none", padding: 0,
    fontFamily: "inherit",
  });

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Floating pill (desktop only) ── */}
      {!isMobile && (
        <nav style={{
          position: "fixed", top: 12, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          background: "#fff",
          borderRadius: 999,
          height: 68,
          overflow: "hidden",
          padding: "0 32px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", gap: 0,
          width: "calc(100% - 80px)", maxWidth: 1400,
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo-light.png" style={{ height: 160, width: "auto", objectFit: "contain", display: "block", margin: "auto 0" }} alt="WePrompt" />
          </a>

          {/* Center nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>

            {/* Explorar */}
            <NavPlainLink href="/solucoes">Explorar</NavPlainLink>

            {/* Soluções ▾ */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => openDropdown("solucoes")}
              onMouseLeave={closeDropdown}
            >
              <NavPlainLink href="/solucoes" chevron>Soluções</NavPlainLink>
              {activeDropdown === "solucoes" && (
                <DropdownMenu
                  items={SOLUCOES_ITEMS}
                  seeAllHref="/solucoes"
                  onMouseEnter={() => openDropdown("solucoes")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* Empresa ▾ */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => openDropdown("empresa")}
              onMouseLeave={closeDropdown}
            >
              <NavPlainLink href="/para-empresas/termos" chevron>Empresa</NavPlainLink>
              {activeDropdown === "empresa" && (
                <DropdownMenu
                  items={EMPRESA_ITEMS}
                  onMouseEnter={() => openDropdown("empresa")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* Para Criadores */}
            <NavPlainLink href="/criadores">Para Criadores</NavPlainLink>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            {session ? (
              <a href={dashboardUrl} style={{
                background: "#111827", color: "#fff", borderRadius: 999,
                padding: "10px 24px", fontSize: 15, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap",
              }}>
                Meu Dashboard →
              </a>
            ) : (
              <>
                <a href="/login" style={{ fontSize: 15, color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Falar conosco
                </a>
                <a href="/cadastro" style={{
                  background: "#111827", color: "#fff", borderRadius: 999,
                  padding: "10px 24px", fontSize: 15, fontWeight: 600,
                  textDecoration: "none", whiteSpace: "nowrap",
                }}>
                  Começar grátis
                </a>
              </>
            )}
          </div>
        </nav>
      )}

      {/* ── Mobile: hamburger button only ── */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            position: "fixed", top: 16, right: 16, zIndex: 50,
            background: "#fff", border: "1px solid #f1f5f9",
            borderRadius: 999, width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
          aria-label="Abrir menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      )}

      {/* ── Mobile full-screen overlay ── */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "#fff",
          display: "flex", flexDirection: "column", padding: "0 24px",
        }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <img src="/logo-light.png" style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }} alt="WePrompt" />
            </a>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
            {[
              { label: "Explorar",       href: "/solucoes"             },
              { label: "Soluções",       href: "/solucoes"             },
              { label: "Para Empresas",  href: "/para-empresas/termos" },
              { label: "Para Criadores", href: "/criadores"            },
              { label: "Preços",         href: "/precos"               },
            ].map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
                fontSize: 18, fontWeight: 600, color: "#111827", textDecoration: "none",
                padding: "14px 0", borderBottom: "1px solid #f1f5f9",
              }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            {session ? (
              <a href={dashboardUrl} style={{
                background: "#111827", color: "#fff", borderRadius: 12,
                padding: "14px 24px", fontSize: 15, fontWeight: 700,
                textDecoration: "none", textAlign: "center",
              }}>Meu Dashboard →</a>
            ) : (
              <>
                <a href="/login" style={{
                  border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 600,
                  textDecoration: "none", textAlign: "center",
                }}>Falar conosco</a>
                <a href="/cadastro" style={{
                  background: "#111827", color: "#fff", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", textAlign: "center",
                }}>Começar grátis</a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NavPlainLink({ href, children, chevron }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 15, fontWeight: 500,
      color: hov ? "#111827" : "#374151",
      textDecoration: "none", whiteSpace: "nowrap",
      transition: "color 0.15s",
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
      {chevron && <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>}
    </a>
  );
}

/* ─── Hero side panel (swap-animated circle grid) ───────────────── */
const LEFT_ICONS = [
  { src: "https://cdn.simpleicons.org/slack" },
  { src: "https://cdn.simpleicons.org/gmail" },
  { src: "https://cdn.simpleicons.org/googlecalendar" },
  { src: "https://cdn.simpleicons.org/microsoftteams" },
  { src: "https://cdn.simpleicons.org/microsoftexcel" },
  { src: "https://cdn.simpleicons.org/notion" },
  { src: "https://cdn.simpleicons.org/whatsapp" },
  { src: "https://cdn.simpleicons.org/googledrive" },
  { src: "https://cdn.simpleicons.org/telegram" },
  { src: "https://cdn.simpleicons.org/stripe" },
  { src: "https://cdn.simpleicons.org/zoom" },
  { src: "https://cdn.simpleicons.org/trello" },
  { src: "https://cdn.simpleicons.org/hubspot" },
  { src: "https://cdn.simpleicons.org/mailchimp" },
  { src: "https://cdn.simpleicons.org/zapier" },
  { src: "https://cdn.simpleicons.org/salesforce" },
];

const RIGHT_ICONS = [
  { type: "avatar", color: "#f97316", initials: "E", label: "Empresa"     },
  { type: "avatar", color: "#8b5cf6", initials: "C", label: "Criador"     },
  { type: "avatar", color: "#10b981", initials: "F", label: "Fundador"    },
  { type: "avatar", color: "#3b82f6", initials: "P", label: "Empresa PME" },
  { type: "avatar", color: "#ef4444", initials: "A", label: "Agência"     },
  { type: "avatar", color: "#f59e0b", initials: "S", label: "SaaS"        },
  { type: "avatar", color: "#06b6d4", initials: "M", label: "Marketing"   },
  { type: "avatar", color: "#6366f1", initials: "D", label: "Dev"         },
];

const TOTAL_CIRCLES = 25;

function makeInitialPositions(iconCount) {
  const arr = Array(TOTAL_CIRCLES).fill(null);
  const slots = [...Array(TOTAL_CIRCLES).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, iconCount);
  slots.forEach((slot, i) => { arr[slot] = i; });
  return arr;
}

/* Left panel cell: app logo image */
function LogoCircle({ icon }) {
  const [errored, setErrored] = useState(false);
  return (
    <div style={{
      width: 52, height: 52, borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      animation: "iconPop 0.4s ease forwards",
    }}>
      {!errored ? (
        <img
          src={icon.src}
          alt=""
          style={{ width: 30, height: 30, objectFit: "contain", display: "block" }}
          onError={() => setErrored(true)}
        />
      ) : (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "#e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#374151",
        }}>
          {icon.src.replace("https://", "").charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

/* Right panel cell: colored avatar with label */
function AvatarCircle({ icon }) {
  return (
    <div style={{ position: "relative", paddingTop: 24 }}>
      {/* Label above */}
      <span style={{
        position: "absolute", top: 2, left: "50%",
        fontSize: 11, fontWeight: 700, color: "#374151",
        whiteSpace: "nowrap",
        background: "#fff", borderRadius: 6, padding: "2px 8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        animation: "labelPop 0.4s ease forwards",
        zIndex: 5,
      }}>
        {icon.label}
      </span>
      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: icon.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        animation: "iconPop 0.4s ease forwards",
      }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          {icon.initials}
        </span>
      </div>
    </div>
  );
}

function HeroSidePanel({ side, isMobile }) {
  const icons = side === "right" ? RIGHT_ICONS : LEFT_ICONS;
  const [positions, setPositions] = useState(() => makeInitialPositions(icons.length));
  const isRight = side === "right";

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        const next = [...prev];
        const filled = next.map((v, i) => v !== null ? i : -1).filter(i => i >= 0);
        const empty  = next.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
        if (!filled.length || !empty.length) return next;
        const from = filled[Math.floor(Math.random() * filled.length)];
        const to   = empty[Math.floor(Math.random() * empty.length)];
        next[to]   = next[from];
        next[from] = null;
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (isMobile) return null;

  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0,
      [side]: 0, width: 280,
      overflow: "hidden", pointerEvents: "none",
    }}>
      <style>{`
        @keyframes iconPop {
          0%   { opacity: 0; transform: scale(0.5); }
          70%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes labelPop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.8); }
          70%  { opacity: 1; transform: translateX(-50%) scale(1.05); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>

      {/* Fade toward center */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: isRight
          ? "linear-gradient(to left,  transparent 55%, #fff 100%)"
          : "linear-gradient(to right, transparent 55%, #fff 100%)",
      }} />
      {/* Top + bottom fade */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to bottom, #fff 0%, transparent 14%, transparent 86%, #fff 100%)",
      }} />

      {/* Circle grid */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 56px)",
        gap: "16px",
        rowGap: isRight ? "40px" : "16px",
      }}>
        {positions.map((iconIdx, i) => {
          const icon = iconIdx !== null ? icons[iconIdx] : null;
          return isRight ? (
            /* Right panel cell — extra paddingTop baked into AvatarCircle */
            <div key={i} style={{ width: 52 }}>
              {icon ? (
                <AvatarCircle key={`${iconIdx}-${i}`} icon={icon} />
              ) : (
                <div style={{ paddingTop: 24 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f1f5f9" }} />
                </div>
              )}
            </div>
          ) : (
            /* Left panel cell */
            <div key={i} style={{
              width: 52, height: 52, borderRadius: "50%",
              background: icon ? "transparent" : "#f1f5f9",
              transition: "background 0.4s ease",
            }}>
              {icon && <LogoCircle key={`${iconIdx}-${i}`} icon={icon} />}
            </div>
          );
        })}
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
            {count === null ? "Em breve" : count === 0 ? "Nenhuma solução ainda" : count === 1 ? "1 solução disponível" : `${count} soluções disponíveis`}
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

  const [searchQuery, setSearchQuery] = useState("");

  // Tabbed showcase
  const [activeTab, setActiveTab] = useState(0);

  // Card hover states
  const [hov1, setHov1] = useState(false);
  const [hov2, setHov2] = useState(false);
  const [hov3, setHov3] = useState(false);
  const [hov4, setHov4] = useState(false);
  const [hov5, setHov5] = useState(false);
  const [hov6, setHov6] = useState(false);

  // Bar chart intersection animation
  const chartRef = useRef(null);
  const [chartAnimated, setChartAnimated] = useState(false);
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setChartAnimated(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter loop for chat messages
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setVisibleMsgs(prev => (prev >= 4 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/solucoes?busca=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  const HERO_TAGS = [
    "Atendimento IA", "Automação de E-mails", "Redes Sociais",
    "Geração de Leads", "Análise de Dados", "WhatsApp IA", "Chatbots",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: TEXT, background: WHITE }}>

      {/* ════════════════════════════════════
          SECTION 1 — NAVBAR
      ════════════════════════════════════ */}
      <PageNavbar session={session} isMobile={isMobile} />

      {/* ════════════════════════════════════
          SECTION 2 — HERO
      ════════════════════════════════════ */}
      <section style={{
        position: "relative", background: "#fff",
        minHeight: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Side panels */}
        <HeroSidePanel side="left" isMobile={isMobile} />
        <HeroSidePanel side="right" isMobile={isMobile} />

        {/* Center content */}
        <div style={{
          position: "relative", zIndex: 10,
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: isMobile ? "72px 24px 64px" : "100px 32px 80px",
          maxWidth: 760, margin: "0 auto", width: "100%",
        }}>
          {/* H1 */}
          <h1 style={{
            fontSize: isMobile ? 40 : 64,
            fontWeight: 700, color: "#111827",
            lineHeight: 1.15, letterSpacing: "-1.5px",
            margin: "0 0 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", marginBottom: 10 }}>Gerencie Seu Negócio</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
              <span>com&nbsp;</span>
              <span style={{
                display: "inline-flex", alignItems: "center",
                position: "relative",
              }}>
                {/* Main pill */}
                <span style={{
                  background: "linear-gradient(to right, #f97316, #f43f5e)",
                  borderRadius: "24px 24px 24px 6px",
                  padding: isMobile ? "8px 22px" : "10px 32px",
                  color: "#fff",
                  fontSize: isMobile ? 40 : 64,
                  fontWeight: 700,
                  letterSpacing: "-1.5px",
                  lineHeight: 1.15,
                  display: "inline-block",
                }}>
                  IA Curada
                </span>
                {/* Triangle tail — flush against bottom-left corner */}
                <span style={{
                  position: "absolute", bottom: -11, left: 18,
                  width: 0, height: 0,
                  borderLeft: "0px solid transparent",
                  borderRight: "16px solid transparent",
                  borderTop: "12px solid #f97316",
                  display: "block",
                }} />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: "#6b7280", lineHeight: 1.7,
            margin: "0 0 52px", maxWidth: 520,
            fontWeight: 400,
          }}>
            Cada solução foi testada e aprovada antes de chegar até você. Implemente com confiança, suporte em português.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            width: "100%", maxWidth: 640, margin: "0 auto 28px",
          }}>
            <div style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 999,
              padding: "8px 8px 8px 24px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07), 0 0 0 4px rgba(37,99,235,0.04)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar soluções de IA para o seu negócio..."
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 15, color: "#111827",
                  background: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  minWidth: 0,
                }}
              />
              <button type="submit" style={{
                background: "#111827", color: "#fff",
                borderRadius: 999, padding: "11px 22px",
                border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600, flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "-0.2px",
                whiteSpace: "nowrap",
              }}>
                Buscar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Category tags */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            justifyContent: "center",
          }}>
            {HERO_TAGS.map(tag => (
              <a
                key={tag}
                href={`/solucoes?busca=${encodeURIComponent(tag)}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "7px 16px",
                  fontSize: 13, fontWeight: 500, color: "#4b5563",
                  background: "#fff",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.15s, border-color 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.1px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.borderColor = "#94a3b8";
                  e.currentTarget.style.color = "#111827";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#4b5563";
                }}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 1 — DOIS CARDS GRANDES
      ════════════════════════════════════ */}
      <section style={{ background: WHITE }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: isMobile ? "32px 20px" : 48,
          display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16,
        }}>

          {/* LEFT CARD */}
          <div
            onMouseEnter={() => setHov1(true)}
            onMouseLeave={() => setHov1(false)}
            style={{
              flex: isMobile ? "none" : "1.2",
              background: WHITE, border: "1px solid #f0f0f0", borderRadius: 24,
              padding: 40, minHeight: isMobile ? "auto" : 520,
              position: "relative", overflow: "hidden",
              transform: hov1 ? "scale(1.02)" : "scale(1)",
              boxShadow: hov1 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}>
            <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "8px 16px", display: "inline-block" }}>
              <em style={{ color: "#2563EB", fontSize: 14 }}>"Quero economizar tempo com automação"</em>
            </div>
            <h3 style={{
              fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#111827",
              marginTop: 20, marginBottom: 0, maxWidth: 320, lineHeight: 1.2, letterSpacing: "-0.02em",
            }}>
              Automatize as Tarefas do Seu Negócio
            </h3>
            <a href="/solucoes" style={{
              border: "1.5px solid #e5e7eb", borderRadius: 999, padding: "12px 28px",
              fontSize: 14, fontWeight: 600, color: "#111827",
              marginTop: isMobile ? 24 : 280,
              display: "inline-block", textDecoration: "none",
            }}>
              Explorar soluções →
            </a>
            {/* Dark email mockup */}
            {!isMobile && (
              <div style={{
                position: "absolute", bottom: -1, right: -1, width: "58%",
                background: "#1a1a2e", borderRadius: "16px 0 24px 0",
                padding: 20, boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>Assistente de E-mail</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ color: "#10b981", fontSize: 11 }}>Ativo</span>
                  </div>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8 }}>Pronto para envio</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>Re: Confirmação de reunião</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>Olá, confirmo nossa reunião para quinta às 14h. Por favor...</div>
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8, marginTop: 12 }}>Na fila</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>Follow-up: Proposta #1042</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>Programado 09:00</div>
                  </div>
                  <div style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa", padding: "3px 8px", borderRadius: 999, fontSize: 10, flexShrink: 0, marginLeft: 8 }}>Agendado</div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CARD */}
          <div
            onMouseEnter={() => setHov2(true)}
            onMouseLeave={() => setHov2(false)}
            style={{
              flex: isMobile ? "none" : "1",
              background: "linear-gradient(160deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
              borderRadius: 24, padding: 40,
              minHeight: isMobile ? "auto" : 520,
              position: "relative", overflow: "hidden",
              transform: hov2 ? "scale(1.02)" : "scale(1)",
              boxShadow: hov2 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}>
            <h3 style={{
              fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "white",
              lineHeight: 1.2, maxWidth: 260, letterSpacing: "-0.02em", margin: 0,
            }}>
              Simplifique Suas Comunicações
            </h3>
            <div style={{
              position: isMobile ? "relative" : "absolute",
              bottom: isMobile ? "auto" : 20,
              left: isMobile ? "auto" : 20,
              right: isMobile ? "auto" : 20,
              marginTop: isMobile ? 24 : 0,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(20px)",
              borderRadius: 16, padding: 16,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/>
                  </svg>
                </div>
                <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>ChatBot Pro</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                  <span style={{ color: "#34d399", fontSize: 10 }}>Online</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { from: "user", text: "Quanto custa a solução de WhatsApp?" },
                  { from: "bot",  text: "Temos planos a partir de R$97/mês. Posso te mostrar?" },
                  { from: "user", text: "Sim, quero ver!" },
                  { from: "bot",  text: "Perfeito! Vou te encaminhar para o plano ideal." },
                ].map((msg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                    opacity: i < visibleMsgs ? 1 : 0,
                    transform: i < visibleMsgs ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}>
                    <div style={{
                      background: msg.from === "user" ? "white" : "rgba(255,255,255,0.15)",
                      color: msg.from === "user" ? "#111827" : "white",
                      borderRadius: msg.from === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      padding: "8px 14px", fontSize: 12, lineHeight: 1.4, maxWidth: "82%",
                    }}>{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 2 — TRÊS CARDS IGUAIS
      ════════════════════════════════════ */}
      <section style={{ background: WHITE }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: isMobile ? "0 20px 40px" : "0 48px 48px",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>

            {/* CARD 1 — Finances */}
            <div
              onMouseEnter={() => setHov3(true)}
              onMouseLeave={() => setHov3(false)}
              style={{
                background: WHITE, border: "1px solid #f0f0f0", borderRadius: 24, padding: 32,
                transform: hov3 ? "scale(1.02)" : "scale(1)",
                boxShadow: hov3 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}>
              <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "8px 16px", display: "inline-block" }}>
                <em style={{ color: "#2563EB", fontSize: 14 }}>"Quero automatizar minhas finanças"</em>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginTop: 16, marginBottom: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Gerencie Suas Finanças
              </h3>
              <div style={{ background: "#111827", borderRadius: 16, padding: 20, marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Visão Mensal</span>
                  <span style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>+12.4%</span>
                </div>
                <div style={{ color: "white", fontSize: 28, fontWeight: 800, marginTop: 8, letterSpacing: "-0.02em" }}>R$ 48.320</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>Receita total este mês</div>
                <div ref={chartRef} style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60, marginTop: 16 }}>
                  {[30, 40, 35, 50, 45, 55, 48, 70].map((h, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: chartAnimated ? `${h}%` : "0%",
                      borderRadius: "3px 3px 0 0",
                      background: i === 7 ? "#1d4ed8" : "#1e3a5f",
                      transition: `height 0.8s ease ${i * 0.08}s`,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  {[
                    { label: "142 Faturas", sub: "Total"    },
                    { label: "R$3.200",     sub: "Pendente" },
                    { label: "R$21.380",    sub: "Pago"     },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ color: "white", fontSize: 10, fontWeight: 600 }}>{stat.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/solucoes?categoria=analise-de-dados" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 16, color: "#2563EB", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver soluções →</a>
            </div>

            {/* CARD 2 — Campaigns */}
            <div
              onMouseEnter={() => setHov4(true)}
              onMouseLeave={() => setHov4(false)}
              style={{
                background: "linear-gradient(160deg, #a855f7, #ec4899, #f97316)", borderRadius: 24, padding: 32,
                transform: hov4 ? "scale(1.02)" : "scale(1)",
                boxShadow: hov4 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "white", marginTop: 32, marginBottom: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Gere Suas Campanhas
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 24 }}>
                {[
                  { name: "Promoção Verão", type: "Email + SMS",       metric: "2.4k enviados",   mc: "#86efac" },
                  { name: "Novo Produto",   type: "Instagram + Email", metric: "1.8k alcançados", mc: "#86efac" },
                  { name: "Flash Promo",    type: "Push + SMS",        metric: "3.1k enviados",   mc: "#fde68a" },
                  { name: "Fidelidade",     type: "Email + App",       metric: "1.2k abertos",    mc: "#fde68a" },
                ].map((c) => (
                  <div key={c.name} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: 14 }}>
                    <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>{c.type}</div>
                    <div style={{ color: c.mc, fontSize: 13, fontWeight: 800, marginTop: 8 }}>{c.metric}</div>
                  </div>
                ))}
              </div>
              <a href="/solucoes?categoria=marketing-ia" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 16, color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver soluções →</a>
            </div>

            {/* CARD 3 — Leads */}
            <div
              onMouseEnter={() => setHov5(true)}
              onMouseLeave={() => setHov5(false)}
              style={{
                background: WHITE, border: "1px solid #f0f0f0", borderRadius: 24, padding: 32,
                transform: hov5 ? "scale(1.02)" : "scale(1)",
                boxShadow: hov5 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}>
              <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "8px 16px", display: "inline-block" }}>
                <em style={{ color: "#2563EB", fontSize: 14 }}>"Quero encontrar novos clientes"</em>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginTop: 16, marginBottom: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Alcance Clientes Locais
              </h3>
              <div style={{ background: "#111827", borderRadius: 16, padding: 20, marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Pipeline de Leads</span>
                  <span style={{ color: "#2563EB", fontSize: 11, fontWeight: 600 }}>12 novos</span>
                </div>
                {[
                  { ini: "T", bg: "#2563EB", name: "Tech Solutions",    status: "Proposta", score: "92", sbg: "#fef3c7", sc: "#92400e" },
                  { ini: "I", bg: "#7c3aed", name: "Inova Varejo",      status: "Reunião",  score: "78", sbg: "#ede9fe", sc: "#6d28d9" },
                  { ini: "B", bg: "#059669", name: "Bem Estar Clinic",  status: "Contato",  score: "65", sbg: "#dcfce7", sc: "#166534" },
                  { ini: "C", bg: "#9ca3af", name: "Construtora Alpha", status: "Novo",     score: "44", sbg: "#f3f4f6", sc: "#374151" },
                ].map((lead, i) => (
                  <div key={lead.name} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: lead.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "white", flexShrink: 0 }}>{lead.ini}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "white", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{lead.status}</div>
                    </div>
                    <div style={{ background: lead.sbg, color: lead.sc, borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{lead.score}</div>
                  </div>
                ))}
                <div style={{ color: "#10b981", fontSize: 12, marginTop: 12 }}>Taxa de conversão: 34.2%</div>
              </div>
              <a href="/solucoes?categoria=agentes-de-ia" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 16, color: "#2563EB", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver soluções →</a>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — DASHBOARD AZUL
      ════════════════════════════════════ */}
      <section style={{ background: WHITE }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: isMobile ? "0 20px 48px" : "0 48px 48px",
        }}>
          <div
            onMouseEnter={() => setHov6(true)}
            onMouseLeave={() => setHov6(false)}
            style={{
              background: "#2563EB", borderRadius: 24,
              padding: isMobile ? "40px 24px" : 56,
              display: "flex", flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 32 : 48,
              transform: hov6 ? "scale(1.02)" : "scale(1)",
              boxShadow: hov6 ? "0 20px 40px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}>

            {/* Left: text */}
            <div style={{ flex: "1" }}>
              <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
                Tudo em Um Dashboard Simples.
              </h2>
              <a href="/solucoes" style={{
                background: "black", color: "white", borderRadius: 999,
                padding: "14px 32px", fontSize: 15, fontWeight: 700,
                marginTop: 28, display: "inline-block", textDecoration: "none",
              }}>
                Explorar soluções
              </a>
            </div>

            {/* Right: browser mockup */}
            <div style={{ flex: "1.5", width: isMobile ? "100%" : "auto" }}>
              <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
                <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 6, padding: "4px 12px", fontSize: 11, color: "#9ca3af", marginLeft: 12 }}>
                    weprompt.app.br/solucoes
                  </div>
                </div>
                <div style={{ display: "flex", height: isMobile ? 260 : 300 }}>
                  {/* Sidebar */}
                  <div style={{ width: 160, background: "#f9fafb", borderRight: "1px solid #e5e7eb", padding: 12, flexShrink: 0 }}>
                    {[
                      { label: "Todas",    active: true },
                      { label: "Chatbots"              },
                      { label: "Automação"             },
                      { label: "Marketing"             },
                      { label: "Finanças"              },
                      { label: "WhatsApp"              },
                    ].map((item) => (
                      <div key={item.label} style={{
                        padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: 2,
                        background: item.active ? "#eff6ff" : "transparent",
                        color: item.active ? "#2563EB" : "#6b7280",
                        fontWeight: item.active ? 700 : 400,
                      }}>{item.label}</div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div style={{ flex: 1, padding: 16, overflowY: "hidden" }}>
                    <div style={{
                      background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8,
                      padding: "8px 12px", fontSize: 12, color: "#9ca3af", marginBottom: 12,
                    }}>
                      Buscar soluções...
                    </div>
                    {[
                      { name: "ChatBot WhatsApp",  creator: "João Silva",     price: "R$97/mês",  color: "#7c3aed" },
                      { name: "Agente de E-mail",  creator: "Ana Lima",       price: "R$127/mês", color: "#2563EB" },
                      { name: "Análise de Dados",  creator: "Carlos Mendes",  price: "R$89/mês",  color: "#059669" },
                      { name: "Auto Vendas",        creator: "Sofia Rocha",    price: "R$147/mês", color: "#f97316" },
                      { name: "Gerador de Posts",  creator: "Bruno Ferreira", price: "R$59/mês",  color: "#ec4899" },
                      { name: "Atendimento IA",    creator: "Luisa Santos",   price: "R$79/mês",  color: "#0891b2" },
                    ].map((sol) => (
                      <div key={sol.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: sol.color + "18",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, fontSize: 11, fontWeight: 800, color: sol.color,
                        }}>{sol.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sol.name}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>por {sol.creator}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{sol.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
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
      <section style={{ background: WHITE, padding: isMobile ? "56px 24px" : "80px 48px" }}>
        <style>{`
          @keyframes fadeInTab {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* Top text */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block",
              background: "#EFF6FF", color: BLUE, borderRadius: 999,
              padding: "5px 14px", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
            }}>
              Como Funciona
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, color: "#111827", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              Uma Solução Para Cada Desafio
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 18, color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
              Explore por categoria e veja como cada solução resolve um problema real do seu negócio.
            </p>
          </div>

          {/* Big gradient card */}
          <div style={{
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 40%, #f97316 100%)",
            borderRadius: 24, overflow: "hidden", padding: isMobile ? 20 : 32,
          }}>

            {/* Tab pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {["Atendimento ao Cliente", "Vendas e Prospecção", "Marketing e Conteúdo", "Gestão Financeira"].map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} style={{
                  background: activeTab === i ? "white" : "rgba(255,255,255,0.15)",
                  color: activeTab === i ? "#111827" : "white",
                  borderRadius: 999, padding: "10px 20px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: activeTab === i ? 600 : 500,
                  cursor: "pointer",
                  border: activeTab === i ? "none" : "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.2s ease",
                }}>{tab}</button>
              ))}
            </div>

            {/* Mockup card — keyed so React remounts on tab change → triggers fadeInTab */}
            <div key={activeTab} style={{
              background: "white", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              animation: "fadeInTab 0.3s ease",
            }}>

              {/* ── TAB 0: Atendimento ao Cliente ── */}
              {activeTab === 0 && (
                <div style={{ display: "flex", height: isMobile ? "auto" : 380, flexDirection: isMobile ? "column" : "row" }}>
                  <div style={{ width: isMobile ? "100%" : 180, background: "#f9fafb", borderRight: isMobile ? "none" : "1px solid #e5e7eb", borderBottom: isMobile ? "1px solid #e5e7eb" : "none", padding: 16, flexShrink: 0 }}>
                    <div style={{ marginBottom: 12 }}>
                      <img src="/logo-light.png" style={{ height: 160, width: "auto", objectFit: "contain", display: "block", margin: "auto 0" }} alt="WePrompt" />
                    </div>
                    <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />
                    {[
                      { key: "home", label: "Home", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
                      { key: "novo-chat", label: "Novo Chat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
                      { key: "ferramentas", label: "Ferramentas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                    ].map(item => (
                      <div key={item.key} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", cursor: "pointer", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>{item.icon}{item.label}</div>
                    ))}
                    <div style={{ height: 1, background: "#e5e7eb", margin: "8px 0" }} />
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#111827", background: "#f0f0f0", fontWeight: 600, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>Chat</div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>Agente</div>
                  </div>
                  <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                    <div style={{ alignSelf: "flex-end", background: "#111827", color: "white", borderRadius: "16px 4px 16px 16px", padding: "12px 18px", maxWidth: "70%", fontSize: 14, lineHeight: 1.5 }}>
                      Tivemos um pico de tickets hoje. Consegue identificar o problema principal?
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: "4px 16px 16px 16px", padding: "12px 18px", maxWidth: "75%", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                        Analisando os tickets de hoje...
                      </div>
                    </div>
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Análise de Tickets</span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>76 analisados hoje</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#2563EB", marginTop: 4, marginBottom: 12 }}>Problemas de cobrança estão causando a maioria dos tickets.</div>
                      {[{ label: "Cobrança", pct: 85, n: 34 }, { label: "Login", pct: 52, n: 21 }, { label: "Entrega", pct: 28, n: 11 }].map(b => (
                        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: "#6b7280", width: 70, flexShrink: 0, textAlign: "right" }}>{b.label}</span>
                          <div style={{ flex: 1, height: 24, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                            <div style={{ width: `${b.pct}%`, height: "100%", background: "#2563EB", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{b.n}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 1: Vendas e Prospecção ── */}
              {activeTab === 1 && (
                <div style={{ display: "flex", height: isMobile ? "auto" : 380, flexDirection: isMobile ? "column" : "row" }}>
                  <div style={{ width: isMobile ? "100%" : 180, background: "#f9fafb", borderRight: isMobile ? "none" : "1px solid #e5e7eb", borderBottom: isMobile ? "1px solid #e5e7eb" : "none", padding: 16, flexShrink: 0 }}>
                    <div style={{ marginBottom: 12 }}>
                      <img src="/logo-light.png" style={{ height: 160, width: "auto", objectFit: "contain", display: "block", margin: "auto 0" }} alt="WePrompt" />
                    </div>
                    <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />
                    {[
                      { key: "home", label: "Home", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
                      { key: "novo-chat", label: "Novo Chat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
                      { key: "ferramentas", label: "Ferramentas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                    ].map(item => (
                      <div key={item.key} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", cursor: "pointer", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>{item.icon}{item.label}</div>
                    ))}
                    <div style={{ height: 1, background: "#e5e7eb", margin: "8px 0" }} />
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#111827", background: "#f0f0f0", fontWeight: 600, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>Chat</div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>Agente</div>
                  </div>
                  <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                    <div style={{ alignSelf: "flex-end", background: "#111827", color: "white", borderRadius: "16px 4px 16px 16px", padding: "12px 18px", maxWidth: "70%", fontSize: 14, lineHeight: 1.5 }}>
                      Quais leads do pipeline ainda não foram contatados esta semana?
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: "4px 16px 16px 16px", padding: "12px 18px", maxWidth: "75%", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                        Encontrei 8 leads sem contato nos últimos 7 dias.
                      </div>
                    </div>
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Pipeline de Leads</div>
                      {[
                        { ini: "T", bg: "#2563EB", name: "Tech Solutions",  status: "Sem contato",   sbg: "#fee2e2", sc: "#991b1b", score: 92 },
                        { ini: "M", bg: "#7c3aed", name: "Moda Express",    status: "Em negociação", sbg: "#ede9fe", sc: "#6d28d9", score: 78 },
                        { ini: "V", bg: "#059669", name: "Varejo Central",  status: "Novo",          sbg: "#dcfce7", sc: "#166534", score: 65 },
                      ].map((lead, idx) => (
                        <div key={lead.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: idx < 2 ? "1px solid #f3f4f6" : "none" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: lead.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{lead.ini}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                          </div>
                          <span style={{ background: lead.sbg, color: lead.sc, borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{lead.status}</span>
                          <span style={{ background: "#f3f4f6", color: "#374151", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{lead.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: Marketing e Conteúdo ── */}
              {activeTab === 2 && (
                <div style={{ display: "flex", height: isMobile ? "auto" : 380, flexDirection: isMobile ? "column" : "row" }}>
                  <div style={{ width: isMobile ? "100%" : 180, background: "#f9fafb", borderRight: isMobile ? "none" : "1px solid #e5e7eb", borderBottom: isMobile ? "1px solid #e5e7eb" : "none", padding: 16, flexShrink: 0 }}>
                    <div style={{ marginBottom: 12 }}>
                      <img src="/logo-light.png" style={{ height: 160, width: "auto", objectFit: "contain", display: "block", margin: "auto 0" }} alt="WePrompt" />
                    </div>
                    <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />
                    {[
                      { key: "home", label: "Home", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
                      { key: "novo-chat", label: "Novo Chat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
                      { key: "ferramentas", label: "Ferramentas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                    ].map(item => (
                      <div key={item.key} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", cursor: "pointer", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>{item.icon}{item.label}</div>
                    ))}
                    <div style={{ height: 1, background: "#e5e7eb", margin: "8px 0" }} />
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#111827", background: "#f0f0f0", fontWeight: 600, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>Chat</div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>Agente</div>
                  </div>
                  <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                    <div style={{ alignSelf: "flex-end", background: "#111827", color: "white", borderRadius: "16px 4px 16px 16px", padding: "12px 18px", maxWidth: "70%", fontSize: 14, lineHeight: 1.5 }}>
                      Cria uma campanha de email para o lançamento do novo produto.
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: "4px 16px 16px 16px", padding: "12px 18px", maxWidth: "75%", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                        Campanha gerada! Aqui está o rascunho:
                      </div>
                    </div>
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Novidade que vai transformar seu negócio</div>
                      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>Olá! Temos uma novidade incrível para você. Nossa nova solução de IA vai automatizar seus processos e...</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>Taxa de abertura estimada: 42%</span>
                        <span style={{ background: "#dbeafe", color: "#1e40af", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>Melhor horário: Terça 10h</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: Gestão Financeira ── */}
              {activeTab === 3 && (
                <div style={{ display: "flex", height: isMobile ? "auto" : 380, flexDirection: isMobile ? "column" : "row" }}>
                  <div style={{ width: isMobile ? "100%" : 180, background: "#f9fafb", borderRight: isMobile ? "none" : "1px solid #e5e7eb", borderBottom: isMobile ? "1px solid #e5e7eb" : "none", padding: 16, flexShrink: 0 }}>
                    <div style={{ marginBottom: 12 }}>
                      <img src="/logo-light.png" style={{ height: 160, width: "auto", objectFit: "contain", display: "block", margin: "auto 0" }} alt="WePrompt" />
                    </div>
                    <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />
                    {[
                      { key: "home", label: "Home", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
                      { key: "novo-chat", label: "Novo Chat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
                      { key: "ferramentas", label: "Ferramentas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                    ].map(item => (
                      <div key={item.key} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", cursor: "pointer", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>{item.icon}{item.label}</div>
                    ))}
                    <div style={{ height: 1, background: "#e5e7eb", margin: "8px 0" }} />
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#111827", background: "#f0f0f0", fontWeight: 600, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>Chat</div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#6b7280", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>Agente</div>
                  </div>
                  <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                    <div style={{ alignSelf: "flex-end", background: "#111827", color: "white", borderRadius: "16px 4px 16px 16px", padding: "12px 18px", maxWidth: "70%", fontSize: 14, lineHeight: 1.5 }}>
                      Como está o fluxo de caixa deste mês comparado ao anterior?
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: "4px 16px 16px 16px", padding: "12px 18px", maxWidth: "75%", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                        Crescimento de 23% vs mês anterior. Destaques:
                      </div>
                    </div>
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Este mês</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>R$ 48.320</div>
                          <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>+23%</span>
                        </div>
                        <div style={{ flex: 1, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Mês anterior</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#6b7280", letterSpacing: "-0.02em" }}>R$ 39.260</div>
                          <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>Base</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
                        {[30, 40, 35, 50, 45, 55, 48, 70, 62, 80, 73, 85].map((h, i) => (
                          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0", background: i >= 8 ? "#2563EB" : "#dbeafe" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
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
