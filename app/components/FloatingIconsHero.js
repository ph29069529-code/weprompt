'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Icon data ────────────────────────────────────────────────────────
// 8 icons — all from upload.wikimedia.org (single DNS, already preconnected)
const icons = [
  { id: 1, src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",             name: "Slack",     className: "top-[8%] left-[8%]"      },
  { id: 2, src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",              name: "Notion",    className: "top-[15%] right-[10%]"   },
  { id: 3, src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",        name: "Gmail",     className: "top-[5%] left-[35%]"     },
  { id: 4, src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",                     name: "WhatsApp",  className: "top-[5%] right-[32%]"    },
  { id: 5, src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg",      name: "Sheets",    className: "top-[42%] left-[4%]"     },
  { id: 6, src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg", name: "Drive",     className: "bottom-[28%] left-[8%]"  },
  { id: 7, src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",       name: "LinkedIn",  className: "bottom-[8%] right-[28%]" },
  { id: 8, src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",               name: "Instagram", className: "bottom-[18%] right-[6%]" },
]

// ── Main hero ────────────────────────────────────────────────────────
export default function FloatingIconsHero() {
  const router   = useRouter()
  const iconRefs = useRef([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    // Single mousemove handler — no framer-motion spring overhead
    const handleMouseMove = (e) => {
      iconRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150) {
          const angle = Math.atan2(dy, dx)
          const force = (1 - distance / 150) * 40
          el.style.transform = `translate(${-Math.cos(angle) * force}px, ${-Math.sin(angle) * force}px)`
        } else {
          el.style.transform = 'translate(0, 0)'
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const visibleIcons = isMobile ? icons.slice(0, 5) : icons

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Keyframes for hero text entrance — scoped to this component */}
      <style>{`
        @keyframes heroWord {
          from { opacity: 0; transform: translateY(40px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Indigo radial glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '60%',
        background: 'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(99,102,241,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      {/* ── Floating icons ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {visibleIcons.map((icon, i) => (
          /*
           * Three-layer structure to avoid transform conflicts:
           *  1. Outer div  — JS mouse-repulsion writes transform here
           *  2. Middle div — CSS float-X animation (GPU layer)
           *  3. Inner div  — card styles + fadeInScale entrance
           */
          <div
            key={icon.id}
            ref={(el) => { iconRefs.current[i] = el }}
            className={icon.className}
            style={{ position: 'absolute', willChange: 'transform' }}
          >
            <div
              className="float-anim"
              style={{ animation: `float-${(i % 3) + 1} ${5 + (i % 3)}s ease-in-out infinite` }}
            >
              <div style={{
                width: 72, height: 72,
                borderRadius: 20,
                background: '#ffffff',
                border: '1px solid rgba(99,102,241,0.12)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 14,
                animation: `fadeInScale 0.6s ease-out ${i * 0.08}s both`,
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}>
                <img
                  src={icon.src}
                  alt={icon.name}
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Centre content ── */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 100, padding: '5px 16px', marginBottom: 24,
          fontSize: 12, color: '#6366F1', fontWeight: 600, letterSpacing: '0.05em',
          animation: 'fadeInScale 0.5s cubic-bezier(0.22,1,0.36,1) 0s both',
        }}>
          NOVO&nbsp;&nbsp;•&nbsp;&nbsp;O 1º marketplace de IA do Brasil
        </div>

        {/* H1 — word-by-word entrance */}
        <div style={{ marginBottom: 8 }}>
          {/* Line 1 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', lineHeight: 1.0 }}>
            {['O', 'marketplace', 'de', 'IA'].map((word, i) => (
              <span key={i} style={{
                fontSize: 'clamp(44px, 6.5vw, 80px)',
                fontWeight: 900, color: '#0A0F1E',
                letterSpacing: '-0.04em', lineHeight: 1.0,
                display: 'inline-block', marginRight: '0.25em',
                animation: `heroWord 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
              }}>
                {word}
              </span>
            ))}
          </div>
          {/* Line 2 — gradient */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', lineHeight: 1.0 }}>
            {['para', 'o', 'seu', 'negócio.'].map((word, i) => (
              <span key={i} style={{
                fontSize: 'clamp(44px, 6.5vw, 80px)',
                fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0,
                display: 'inline-block', marginRight: '0.25em',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 40%, #A855F7 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: `heroWord 0.7s cubic-bezier(0.22,1,0.36,1) ${(3 + i) * 0.08}s both`,
              }}>
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: 18, color: '#6B7280', maxWidth: 500,
          lineHeight: 1.65, margin: '16px auto 40px',
          animation: 'heroFadeUp 0.7s ease-out 0.6s both',
        }}>
          Soluções de IA curadas, testadas e prontas para usar — com suporte em português.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'heroFadeUp 0.6s ease-out 0.8s both',
        }}>
          <button
            onClick={() => router.push('/solucoes')}
            style={{
              background: '#0A0F1E', color: 'white',
              padding: '15px 32px', borderRadius: 10,
              fontWeight: 700, fontSize: 15, border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'background 0.2s, transform 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a2035'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0A0F1E'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Explorar soluções →
          </button>

          <button
            onClick={() => router.push('/criadores')}
            style={{
              background: 'white', color: '#374151',
              border: '1.5px solid #E5E7EB',
              padding: '14px 28px', borderRadius: 10,
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151' }}
          >
            Para criadores
          </button>
        </div>
      </div>
    </section>
  )
}
