'use client'
import React from 'react'

const ICONS_ROW1 = [
  { name: "WhatsApp",      src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Gmail",         src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { name: "Google Sheets", src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg" },
  { name: "Slack",         src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "Notion",        src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "HubSpot",       src: "https://cdn.simpleicons.org/hubspot/FF7A59" },
  { name: "Zapier",        src: "https://cdn.simpleicons.org/zapier/FF4A00" },
  { name: "Instagram",     src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" },
]

const ICONS_ROW2 = [
  { name: "Google Drive",  src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" },
  { name: "Telegram",      src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" },
  { name: "Trello",        src: "https://cdn.simpleicons.org/trello/0052CC" },
  { name: "LinkedIn",      src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
  { name: "Airtable",      src: "https://cdn.simpleicons.org/airtable/18BFFF" },
  { name: "n8n",           src: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Make",          src: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Make_%28software%29_logo.svg" },
  { name: "YouTube",       src: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
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
      padding: '64px 0 64px',
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
