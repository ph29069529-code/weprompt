"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedGroup } from "@/components/ui/animated-group";

/* ─── Nav data ──────────────────────────────────────────────────────── */
const menuItems = [
  { name: "Explorar",       href: "/solucoes"             },
  { name: "Soluções",       href: "/solucoes"             },
  { name: "Preços",         href: "/precos"               },
  { name: "Para Criadores", href: "/criadores"            },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
function NavLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{
        fontSize: 15, fontWeight: 500,
        color: hov ? "#111827" : "#374151",
        textDecoration: "none", whiteSpace: "nowrap",
        transition: "color 0.15s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
}

/* ─── HeroHeader (floating pill navbar) ─────────────────────────────── */
function HeroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Desktop floating pill */}
      {!isMobile && (
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          style={{
            position: "fixed", top: 12, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 999,
            height: 68,
            padding: "0 32px",
            boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
            display: "flex", alignItems: "center",
            width: "calc(100% - 80px)", maxWidth: 1400,
            justifyContent: "space-between",
          }}
        >
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img
              src="/logo-light.png"
              style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }}
              alt="WePrompt"
            />
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {menuItems.map(item => (
              <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <a href="/login" style={{ fontSize: 15, color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
              Entrar
            </a>
            <a href="/cadastro" style={{
              background: "#111827", color: "#fff", borderRadius: 999,
              padding: "10px 24px", fontSize: 15, fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              Começar grátis
            </a>
          </div>
        </motion.nav>
      )}

      {/* Mobile: hamburger */}
      {isMobile && (
        <>
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

          {menuOpen && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 100, background: "#fff",
              display: "flex", flexDirection: "column", padding: "0 24px",
            }}>
              <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <a href="/"><img src="/logo-light.png" style={{ height: 36, width: "auto", objectFit: "contain" }} alt="WePrompt" /></a>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
                {menuItems.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontSize: 18, fontWeight: 600, color: "#111827",
                      textDecoration: "none", padding: "14px 0",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
                <a href="/login" style={{
                  border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 600,
                  textDecoration: "none", textAlign: "center",
                }}>Entrar</a>
                <a href="/cadastro" style={{
                  background: "#111827", color: "#fff", borderRadius: 12,
                  padding: "14px 24px", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", textAlign: "center",
                }}>Começar grátis</a>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ─── Stats row ──────────────────────────────────────────────────────── */
const STATS = [
  { label: "1º Marketplace de IA",   desc: "Pioneiro no Brasil"              },
  { label: "Soluções Testadas",       desc: "Aprovadas antes de publicar"     },
  { label: "Suporte em Português",    desc: "Time local, atendimento PT-BR"   },
];

/* ─── HeroSection ────────────────────────────────────────────────────── */
export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", position: "relative", overflow: "hidden" }}>
      <HeroHeader />

      {/* ── Animated background blobs ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
            width: 900, height: 600,
            background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 65%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute", top: 80, right: -160,
            width: 560, height: 560,
            background: "radial-gradient(ellipse at center, rgba(249,115,22,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            position: "absolute", top: 160, left: -180,
            width: 480, height: 480,
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── Hero content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        paddingTop: isMobile ? 100 : 148,
        paddingBottom: isMobile ? 56 : 72,
        paddingLeft: 24, paddingRight: 24,
        maxWidth: 900, margin: "0 auto",
        textAlign: "center",
      }}>
        <AnimatedGroup preset="slide">

          {/* Announcement badge */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#EFF6FF", color: "#2563EB",
              border: "1px solid #BFDBFE",
              borderRadius: 999, padding: "6px 16px",
              fontSize: 13, fontWeight: 600, letterSpacing: "-0.1px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB", display: "inline-block", flexShrink: 0 }} />
              Primeiro marketplace de IA do Brasil
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: isMobile ? 42 : 68,
            fontWeight: 700, color: "#111827",
            lineHeight: 1.12, letterSpacing: "-2px",
            margin: "0 0 28px",
          }}>
            <span style={{ display: "block", marginBottom: 10 }}>Gerencie Seu Negócio</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <span>com&nbsp;</span>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span style={{
                  background: "linear-gradient(to right, #f97316, #f43f5e)",
                  borderRadius: "24px 24px 24px 6px",
                  padding: isMobile ? "8px 22px" : "10px 32px",
                  color: "#fff",
                  fontSize: isMobile ? 42 : 68,
                  fontWeight: 700,
                  letterSpacing: "-2px",
                  lineHeight: 1.12,
                  display: "inline-block",
                }}>
                  IA Curada
                </span>
                {/* Speech bubble tail */}
                <span style={{
                  position: "absolute", bottom: -11, left: 18,
                  width: 0, height: 0,
                  borderRight: "16px solid transparent",
                  borderTop: "12px solid #f97316",
                  display: "block",
                }} />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? 16 : 19,
            color: "#6b7280", lineHeight: 1.7,
            margin: "0 auto 52px",
            maxWidth: 520,
          }}>
            Cada solução foi testada e aprovada antes de chegar até você. Implemente com confiança, suporte em português.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center", justifyContent: "center",
            gap: 16,
            marginBottom: isMobile ? 64 : 80,
          }}>
            <a
              href="/solucoes"
              style={{
                background: "#111827", color: "#fff", borderRadius: 999,
                padding: "14px 32px", fontSize: 16, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              Explorar Soluções
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a
              href="/criadores"
              style={{
                border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: 999,
                padding: "14px 32px", fontSize: 16, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap", background: "#fff",
              }}
            >
              Para Criadores
            </a>
          </div>

        </AnimatedGroup>

        {/* ── Product mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ marginBottom: 80, position: "relative" }}
        >
          {/* Browser frame */}
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.04), 0 32px 64px rgba(0,0,0,0.10)",
            background: "#fff",
          }}>
            {/* Browser chrome */}
            <div style={{
              background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
              padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, maxWidth: 280, margin: "0 auto",
                background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb",
                padding: "4px 12px", fontSize: 12, color: "#9ca3af", textAlign: "center",
              }}>
                weprompt.com.br
              </div>
            </div>

            {/* Content placeholder */}
            <div style={{
              aspectRatio: "16 / 7",
              background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 16,
            }}>
              <img
                src="/logo-light.png"
                style={{ height: 52, opacity: 0.12, display: "block" }}
                alt=""
              />
              <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 500, letterSpacing: "0.05em" }}>
                WEPROMPT MARKETPLACE
              </div>
            </div>
          </div>

          {/* Glow under mockup */}
          <div style={{
            position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)",
            width: "65%", height: 48,
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.14) 0%, transparent 70%)",
            filter: "blur(16px)",
            pointerEvents: "none",
          }} />
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 0,
            paddingBottom: 48,
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: isMobile ? "20px 0" : "24px 16px",
                borderLeft: !isMobile && i > 0 ? "1px solid #f1f5f9" : "none",
                borderTop: isMobile && i > 0 ? "1px solid #f1f5f9" : "none",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
