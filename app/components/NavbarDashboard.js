"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

function getDashboardUrl(session) {
  if (!session) return "/dashboard/empresa";
  const role = session.user?.user_metadata?.role;
  if (role === "admin") return "/dashboard/admin";
  if (role === "criador") return "/dashboard/criador";
  return "/dashboard/empresa";
}

function initials(session) {
  const name = session?.user?.user_metadata?.nome || session?.user?.email || "";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function NavbarDashboard({ onProfileClick }) {
  const [session, setSession] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data?.session ?? null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => { setSession(sess); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const dashboardUrl = getDashboardUrl(session);
  const userInitials = initials(session);
  const userName = session?.user?.user_metadata?.nome || session?.user?.email || "";

  return (
    <>
      <style>{`
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Spacer pushes page content below the fixed navbar */}
      <div style={{ height: 60, flexShrink: 0 }} />

      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: scrolled ? "12px 16px 0" : 0,
        transition: "padding 0.3s ease-out",
        pointerEvents: "none",
      }}>
        <header style={{
          pointerEvents: "auto",
          background: scrolled ? "rgba(255,255,255,0.95)" : "white",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "none" : "1px solid #E5E7EB",
          border: scrolled ? "1px solid rgba(0,0,0,0.08)" : undefined,
          borderRadius: scrolled ? 12 : 0,
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
          height: scrolled ? 52 : 60,
          maxWidth: scrolled ? 1100 : "100%",
          margin: "0 auto",
          transition: "all 0.3s ease-out",
        }}>
          <div style={{
            height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px",
          }}>
            {/* Logo */}
            <Link href={dashboardUrl} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <img src="/logo.png" alt="WePrompt" style={{ width: 130, height: "auto", display: "block" }} />
            </Link>

            {/* Right: user info + logout */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {session ? (
                <>
                  {/* User avatar + name — calls onProfileClick to open settings in the host dashboard */}
                  <button
                    onClick={onProfileClick}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "none", border: "none", cursor: onProfileClick ? "pointer" : "default",
                      padding: 0, fontFamily: "inherit",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {userInitials}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#374151", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {userName.split(" ")[0] || "Conta"}
                    </span>
                  </button>

                  {/* Divider */}
                  <div style={{ width: 1, height: 20, background: "#E5E7EB" }} />

                  {/* Logout */}
                  <button onClick={handleLogout} style={{
                    background: "none", border: "1px solid #E5E7EB", borderRadius: 8,
                    padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#6B7280",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}>
                    Sair
                  </button>
                </>
              ) : (
                <a href="/login" style={{
                  background: "#0A0F1E", color: "white", borderRadius: 8,
                  padding: "8px 18px", fontSize: 14, fontWeight: 600, textDecoration: "none",
                }}>
                  Entrar
                </a>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
                style={{
                  display: "none", border: "none", background: "transparent",
                  cursor: "pointer", padding: 4, color: "#374151",
                }}
                className="dash-hamburger">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <line x1={3} y1={6} x2={21} y2={6} />
                  <line x1={3} y1={12} x2={21} y2={12} />
                  <line x1={3} y1={18} x2={21} y2={18} />
                </svg>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "white",
          display: "flex", flexDirection: "column",
          animation: "mobileNavIn 0.18s ease",
        }}>
          <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #e5e7eb" }}>
            <img src="/logo.png" alt="WePrompt" style={{ width: 130, height: "auto" }} />
            <button onClick={() => setMobileOpen(false)} style={{ border: "none", background: "transparent", fontSize: 22, cursor: "pointer", color: "#374151" }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {session && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>
                  {userInitials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{userName.split(" ")[0]}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{session.user?.email}</div>
                </div>
              </div>
            )}
            <a href={dashboardUrl} onClick={() => setMobileOpen(false)} style={{ fontSize: 16, fontWeight: 600, color: "#111827", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
              Dashboard
            </a>
            <button onClick={() => { setMobileOpen(false); handleLogout(); }}
              style={{ fontSize: 16, fontWeight: 600, color: "#DC2626", border: "none", background: "none", textAlign: "left", cursor: "pointer", padding: "12px 0", fontFamily: "inherit" }}>
              Sair
            </button>
          </div>
        </div>
      )}
    </>
  );
}
