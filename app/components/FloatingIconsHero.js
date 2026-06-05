'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ── Icon data ────────────────────────────────────────────────────────
const icons = [
  { id: 1,  src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",          name: "Slack",     className: "top-[8%] left-[8%]"     },
  { id: 2,  src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",           name: "Notion",    className: "top-[15%] right-[10%]"  },
  { id: 3,  src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",     name: "Gmail",     className: "top-[5%] left-[35%]"    },
  { id: 4,  src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",                  name: "WhatsApp",  className: "top-[5%] right-[32%]"   },
  { id: 5,  src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg",   name: "Sheets",    className: "top-[42%] left-[4%]"    },
  { id: 6,  src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg", name: "Drive", className: "bottom-[28%] left-[8%]" },
  { id: 7,  src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",             name: "Telegram",  className: "bottom-[12%] left-[28%]" },
  { id: 8,  src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",    name: "LinkedIn",  className: "bottom-[8%] right-[28%]" },
  { id: 9,  src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",            name: "Instagram", className: "bottom-[18%] right-[6%]" },
  { id: 10, src: "https://cdn.simpleicons.org/hubspot/FF7A59",                                        name: "HubSpot",   className: "top-[42%] right-[4%]"   },
  { id: 11, src: "https://cdn.simpleicons.org/zapier/FF4A00",                                         name: "Zapier",    className: "top-[22%] left-[20%]"   },
  { id: 12, src: "https://cdn.simpleicons.org/airtable/18BFFF",                                       name: "Airtable",  className: "top-[22%] right-[22%]"  },
]

// ── Single floating icon ─────────────────────────────────────────────
function FloatingIcon({ iconData, index, mouseX, mouseY }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  // Register per-icon mousemove listener for repulsion
  const handleMouseMove = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const distance = Math.sqrt(
      Math.pow(mouseX.current - cx, 2) + Math.pow(mouseY.current - cy, 2)
    )
    if (distance < 150) {
      const angle = Math.atan2(mouseY.current - cy, mouseX.current - cx)
      const force = (1 - distance / 150) * 50
      x.set(-Math.cos(angle) * force)
      y.set(-Math.sin(angle) * force)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  // Attach to window mousemove so it fires even when not hovering the icon
  const onMount = (node) => {
    if (!node) return
    const listener = () => handleMouseMove()
    window.addEventListener('mousemove', listener)
    // Store cleanup on ref object
    node._cleanup = () => window.removeEventListener('mousemove', listener)
  }

  return (
    <motion.div
      ref={(node) => {
        ref.current = node
        onMount(node)
      }}
      style={{ x: springX, y: springY, position: 'absolute' }}
      className={iconData.className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
        }}
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 5, 0, -5, 0],
          rotate: [0, 4, 0, -4, 0],
        }}
        transition={{
          duration: 5 + (iconData.id % 5),
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <img
          src={iconData.src}
          alt={iconData.name}
          style={{ width: 40, height: 40, objectFit: 'contain' }}
        />
      </motion.div>
    </motion.div>
  )
}

// ── Main hero ────────────────────────────────────────────────────────
export default function FloatingIconsHero() {
  const router = useRouter()
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  const onMouseMove = (e) => {
    mouseX.current = e.clientX
    mouseY.current = e.clientY
  }

  return (
    <section
      onMouseMove={onMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'white',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Indigo radial glow at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '60%',
          background: 'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(99,102,241,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating icons */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {icons.map((icon, index) => (
          <FloatingIcon
            key={icon.id}
            iconData={icon}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      {/* Centre content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 100,
          padding: '5px 16px',
          marginBottom: 24,
          fontSize: 12,
          color: '#6366F1',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}>
          NOVO&nbsp;&nbsp;•&nbsp;&nbsp;O 1º marketplace de IA do Brasil
        </div>

        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#0A0F1E',
          marginBottom: 8,
          marginTop: 0,
        }}>
          O marketplace de IA
          <br />
          para o seu negócio.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18,
          color: '#6B7280',
          maxWidth: 500,
          lineHeight: 1.65,
          margin: '16px auto 40px',
        }}>
          Soluções de IA curadas, testadas e prontas para usar — com suporte em português.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => router.push('/solucoes')}
            style={{
              background: '#0A0F1E',
              color: 'white',
              padding: '15px 32px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'background 0.2s, transform 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a2035'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0A0F1E'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Explorar soluções →
          </button>

          <button
            onClick={() => router.push('/criadores')}
            style={{
              background: 'white',
              color: '#374151',
              border: '1.5px solid #E5E7EB',
              padding: '14px 28px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366F1'
              e.currentTarget.style.color = '#6366F1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.color = '#374151'
            }}
          >
            Para criadores
          </button>
        </div>
      </div>
    </section>
  )
}
