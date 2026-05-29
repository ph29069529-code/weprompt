"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalDrawers() {
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    window.__openCart = () => setCartOpen(true);
    window.__openNotif = () => setNotifOpen(true);
    return () => {
      delete window.__openCart;
      delete window.__openNotif;
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const cartItems = [
    { name: "Pack de Prompts WhatsApp", category: "Agentes de IA", price: "R$ 47,00", gradient: "linear-gradient(135deg, #1e3a5f, #2563EB)" },
    { name: "Agente de Atendimento", category: "Agentes de IA", price: "R$ 197,00", gradient: "linear-gradient(135deg, #14532d, #16a34a)" },
  ];

  const notifications = [
    { icon: <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>, bg: "#dcfce7", title: "Compra confirmada", desc: "Pack de Prompts WhatsApp adquirido.", time: "Agora mesmo", unread: true },
    { icon: <svg width="16" height="16" fill="none" stroke="#2563EB" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>, bg: "#dbeafe", title: "Nova avaliação", desc: "Sua solução recebeu uma avaliação 5★", time: "2h atrás", unread: true },
    { icon: <svg width="16" height="16" fill="none" stroke="#f97316" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>, bg: "#ffedd5", title: "Solução aprovada", desc: "Agente de Atendimento foi aprovado.", time: "Ontem", unread: false },
    { icon: <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01"/></svg>, bg: "#f3f4f6", title: "Bem-vindo à WePrompt", desc: "Complete seu perfil para começar.", time: "3 dias atrás", unread: false },
  ];

  return (
    <>
      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, height: "100vh", width: 420, background: "white", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Carrinho</span>
              <button onClick={() => setCartOpen(false)} style={{ fontSize: 24, color: "#6b7280", cursor: "pointer", background: "none", border: "none", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, padding: "16px 24px", overflowY: "auto" }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, background: item.gradient, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.category}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 6 }}>{item.price}</div>
                  </div>
                  <button style={{ fontSize: 20, color: "#9ca3af", cursor: "pointer", background: "none", border: "none" }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: "#6b7280" }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>R$ 244,00</span>
              </div>
              <button onClick={() => { setCartOpen(false); router.push("/checkout"); }} style={{ width: "100%", background: "#111827", color: "white", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none" }}>
                Finalizar compra →
              </button>
              <span onClick={() => setCartOpen(false)} style={{ textAlign: "center", display: "block", marginTop: 10, fontSize: 13, color: "#6b7280", cursor: "pointer" }}>
                Continuar comprando
              </span>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER */}
      {notifOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
          <div onClick={() => setNotifOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, height: "100vh", width: 380, background: "white", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Notificações</span>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#0369A1", cursor: "pointer" }}>Marcar todas como lidas</span>
                <button onClick={() => setNotifOpen(false)} style={{ fontSize: 24, color: "#6b7280", cursor: "pointer", background: "none", border: "none", lineHeight: 1 }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "14px 24px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: n.unread ? "#fafbff" : "white" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{n.title}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{n.desc}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width: 8, height: 8, borderRadius: 999, background: "#2563EB", flexShrink: 0, marginTop: 6 }} />}
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "#0369A1", cursor: "pointer" }}>Ver todas as notificações →</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
