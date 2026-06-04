'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Bot,
  Zap,
  MessageSquare,
  BarChart2,
  Mail,
  Smartphone,
  TrendingUp,
  Globe,
  Brain,
  Sparkles,
} from 'lucide-react'

// ─── Icons config ────────────────────────────────────────────────────
const ICONS = [
  { id: 1,  icon: Bot,            pos: 'top-[12%]  left-[6%]'   },
  { id: 2,  icon: Sparkles,       pos: 'top-[7%]   left-[23%]'  },
  { id: 3,  icon: Brain,          pos: 'top-[5%]   right-[20%]' },
  { id: 4,  icon: Zap,            pos: 'top-[12%]  right-[5%]'  },
  { id: 5,  icon: MessageSquare,  pos: 'top-[42%]  left-[4%]'   },
  { id: 6,  icon: Globe,          pos: 'top-[42%]  right-[4%]'  },
  { id: 7,  icon: Mail,           pos: 'bottom-[28%] left-[8%]' },
  { id: 8,  icon: BarChart2,      pos: 'bottom-[28%] right-[8%]'},
  { id: 9,  icon: Smartphone,     pos: 'bottom-[12%] left-[22%]'},
  { id: 10, icon: TrendingUp,     pos: 'bottom-[12%] right-[22%]'},
]

// ─── Single floating icon ─────────────────────────────────────────────
function FloatingIcon({ iconData, index, mouseX, mouseY }) {
  const ref = React.useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  React.useEffect(() => {
    const onMouseMove = () => {
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
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [x, y, mouseX, mouseY])

  const IconComponent = iconData.icon

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${iconData.pos}`}
    >
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        }}
        animate={{
          y:      [0, -8,  0,  8,  0],
          x:      [0,  6,  0, -6,  0],
          rotate: [0,  5,  0, -5,  0],
        }}
        transition={{
          duration: 5 + (iconData.id % 5),
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <IconComponent
          size={32}
          style={{ color: '#6366F1', strokeWidth: 1.5 }}
        />
      </motion.div>
    </motion.div>
  )
}

// ─── Main hero ────────────────────────────────────────────────────────
export default function FloatingIconsHero() {
  const router = useRouter()
  const mouseX = React.useRef(0)
  const mouseY = React.useRef(0)
  const [hovPrimary, setHovPrimary] = React.useState(false)
  const [hovSecondary, setHovSecondary] = React.useState(false)

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
        background: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Subtle radial glow in center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating icons layer */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {ICONS.map((iconData, index) => (
          <FloatingIcon
            key={iconData.id}
            iconData={iconData}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      {/* Foreground content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: 700,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 100,
            padding: '5px 14px',
            marginBottom: 28,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1' }} />
          <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 500 }}>
            O 1º marketplace de IA do Brasil
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 20,
            marginTop: 0,
            background: 'linear-gradient(to bottom, #0A0F1E 0%, rgba(10,15,30,0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          O marketplace de IA<br />para o seu negócio.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: '#6B7280',
            maxWidth: 520,
            margin: '0 auto 40px',
          }}
        >
          Soluções de IA curadas, testadas e prontas para usar —
          com suporte em português.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => router.push('/solucoes')}
            onMouseEnter={() => setHovPrimary(true)}
            onMouseLeave={() => setHovPrimary(false)}
            style={{
              background: hovPrimary ? '#4F46E5' : '#6366F1',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '14px 32px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s',
              transform: hovPrimary ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
            }}
          >
            Explorar soluções →
          </button>

          <button
            onClick={() => router.push('/criadores')}
            onMouseEnter={() => setHovSecondary(true)}
            onMouseLeave={() => setHovSecondary(false)}
            style={{
              background: 'transparent',
              color: hovSecondary ? '#0A0F1E' : '#6B7280',
              border: `1.5px solid ${hovSecondary ? '#0A0F1E' : '#E5E7EB'}`,
              borderRadius: 10,
              padding: '13px 28px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Para criadores
          </button>
        </motion.div>
      </div>
    </section>
  )
}
