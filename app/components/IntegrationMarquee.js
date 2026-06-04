'use client'
import React from 'react'

const ICONS_ROW1 = [
  { name: "WhatsApp", src: "https://cdn-icons-png.flaticon.com/512/5968/5968854.png" },
  { name: "Excel",    src: "https://cdn-icons-png.flaticon.com/512/732/732221.png" },
  { name: "LinkedIn", src: "https://cdn-icons-png.flaticon.com/512/733/733609.png" },
  { name: "Outlook",  src: "https://cdn-icons-png.flaticon.com/512/732/732084.png" },
  { name: "Slack",    src: "https://cdn-icons-png.flaticon.com/512/733/733585.png" },
  { name: "Gmail",    src: "https://cdn-icons-png.flaticon.com/512/281/281763.png" },
  { name: "Sheets",   src: "https://cdn-icons-png.flaticon.com/512/888/888879.png" },
]

const ICONS_ROW2 = [
  { name: "LinkedIn", src: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
  { name: "Notion",   src: "https://cdn-icons-png.flaticon.com/512/906/906324.png" },
  { name: "Drive",    src: "https://cdn-icons-png.flaticon.com/512/888/888841.png" },
  { name: "Figma",    src: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png" },
  { name: "Zoom",     src: "https://cdn-icons-png.flaticon.com/512/906/906361.png" },
  { name: "Teams",    src: "https://cdn-icons-png.flaticon.com/512/732/732190.png" },
  { name: "Docs",     src: "https://cdn-icons-png.flaticon.com/512/888/888847.png" },
]

const row1Items = [...ICONS_ROW1, ...ICONS_ROW1, ...ICONS_ROW1, ...ICONS_ROW1]
const row2Items = [...ICONS_ROW2, ...ICONS_ROW2, ...ICONS_ROW2, ...ICONS_ROW2]

function IconPill({ name, src }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: 100,
      padding: '10px 20px 10px 12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      <img
        src={src}
        alt={name}
        width={32}
        height={32}
        style={{ width: 32, height: 32, objectFit: 'contain', display: 'block' }}
      />
      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{name}</span>
    </div>
  )
}

export default function IntegrationMarquee() {
  return (
    <section style={{
      background: 'white',
      padding: '80px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes im-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes im-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .im-track-left  { display: flex; width: max-content; gap: 16px; animation: im-scroll-left  30s linear infinite; }
        .im-track-right { display: flex; width: max-content; gap: 16px; animation: im-scroll-right 30s linear infinite; margin-top: 16px; }
        @media (prefers-reduced-motion: reduce) {
          .im-track-left, .im-track-right { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 100,
          padding: '5px 14px',
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 11, letterSpacing: '0.12em',
            color: '#6366F1', fontWeight: 700,
            textTransform: 'uppercase',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}>
            Integrações
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 800,
          color: '#0A0F1E',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
          Conecta com as ferramentas<br />que você já usa.
        </h2>

        <p style={{
          color: '#6B7280',
          fontSize: 16,
          marginTop: 8,
          marginBottom: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
          Mais de 50 integrações disponíveis.
        </p>
      </div>

      {/* Marquee rows */}
      <div style={{ position: 'relative' }}>

        {/* Row 1 — scrolls left */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="im-track-left">
            {row1Items.map((item, i) => (
              <IconPill key={i} name={item.name} src={item.src} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="im-track-right">
            {row2Items.map((item, i) => (
              <IconPill key={i} name={item.name} src={item.src} />
            ))}
          </div>
        </div>

        {/* Left fade overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '100%', width: 120,
          background: 'linear-gradient(to right, white, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Right fade overlay */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          height: '100%', width: 120,
          background: 'linear-gradient(to left, white, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      </div>
    </section>
  )
}
