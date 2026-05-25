"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BLUE = "#0369A1";
const NEAR_BLACK = "#1D1D1F";
const GRAY_TEXT = "#6E6E73";
const BORDER = "#e5e7eb";

const TYPE_ICON = {
  nova_compra: "🛍️",
  nova_venda: "💰",
  nova_avaliacao: "⭐",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}m atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  return `${days}d atrás`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [token, setToken]                 = useState(null);
  const [dropdownPos, setDropdownPos]     = useState({ top: 0, right: 0 });
  const bellRef                           = useRef(null);
  const panelRef                          = useRef(null);
  const intervalRef                       = useRef(null);

  const fetchNotifications = useCallback(async (accessToken) => {
    if (!accessToken) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {}
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return;
      setToken(session.access_token);
      fetchNotifications(session.access_token);
      intervalRef.current = setInterval(() => fetchNotifications(session.access_token), 30000);
    });
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  async function markAllRead() {
    if (!token) return;
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ all: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    setUnreadCount(0);
  }

  async function markRead(id) {
    if (!token) return;
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notification_id: id }),
    }).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  function handleNotificationClick(n) {
    if (!n.read_at) markRead(n.id);
    if (n.link) window.location.href = n.link;
    setOpen(false);
  }

  function handleToggle() {
    if (!open && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(o => !o);
  }

  return (
    <div style={{ display: "inline-flex" }}>
      {/* Bell button */}
      <button
        ref={bellRef}
        onClick={handleToggle}
        style={{
          background: open ? "#F5F5F7" : "transparent",
          border: "none",
          borderRadius: 10,
          padding: "6px 8px",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
        }}
        aria-label="Notificações"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NEAR_BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: 3,
            right: 3,
            background: "#DC2626",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: "50%",
            minWidth: 17,
            height: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 3px",
            lineHeight: 1,
            border: "2px solid #fff",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            border: `1px solid ${BORDER}`,
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px 12px",
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: NEAR_BLACK }}>
              Notificações
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  color: BLUE,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 18px", textAlign: "center", color: GRAY_TEXT, fontSize: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                Nenhuma notificação ainda.
              </div>
            ) : (
              notifications.slice(0, 20).map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "13px 18px",
                    background: n.read_at ? "#fff" : "#EFF6FF",
                    borderBottom: `1px solid ${BORDER}`,
                    cursor: n.link ? "pointer" : "default",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { if (!n.read_at || n.link) e.currentTarget.style.background = n.read_at ? "#F9FAFB" : "#DBEAFE"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = n.read_at ? "#fff" : "#EFF6FF"; }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#F5F5F7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}>
                    {TYPE_ICON[n.type] || "🔔"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontWeight: n.read_at ? 500 : 700, fontSize: 13, color: NEAR_BLACK }}>
                        {n.title}
                      </span>
                      {!n.read_at && (
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: BLUE,
                          flexShrink: 0,
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: GRAY_TEXT, marginTop: 2, lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

