"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "pwa_prompt_dismissed_until";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only show on mobile
    if (window.innerWidth >= 768) return;

    // Check dismiss cooldown (7 days)
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if (outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    }
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 16, left: 16, right: 16,
      zIndex: 9999,
      background: "#fff",
      borderRadius: 16,
      padding: "14px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      borderLeft: "4px solid #0369A1",
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "'DM Sans', sans-serif",
      animation: "pwaSlideUp 0.25s ease",
    }}>
      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>🤖</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 2 }}>
          Instale o WePrompt
        </div>
        <div style={{ fontSize: 12, color: "#6E6E73", lineHeight: 1.4 }}>
          Acesse mais rápido pela tela inicial
        </div>
      </div>

      <button
        onClick={install}
        style={{
          padding: "8px 16px",
          borderRadius: 10,
          background: "#0369A1",
          color: "#fff",
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#0284C7")}
        onMouseLeave={e => (e.currentTarget.style.background = "#0369A1")}
      >
        Instalar
      </button>

      <button
        onClick={dismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6E6E73",
          fontSize: 18,
          lineHeight: 1,
          padding: "4px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}
