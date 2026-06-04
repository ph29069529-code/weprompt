'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, ChevronDown } from 'lucide-react'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: 'easeInOut' },
  }),
}

export default function ParticleHero() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: null, y: null })
  const animRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    function init() {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
        })
      }
    }

    function connect() {
      const mx = mouse.current.x
      const my = mouse.current.y
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const pa = particles[a]
          const pb = particles[b]
          const dist = Math.hypot(pa.x - pb.x, pa.y - pb.y)
          if (dist > 140) continue

          const nearMouse =
            mx !== null &&
            my !== null &&
            Math.hypot(pa.x - mx, pa.y - my) < 200

          const alpha = 1 - dist / 140
          ctx.strokeStyle = nearMouse
            ? `rgba(255,255,255,${alpha * 0.5})`
            : `rgba(99,102,241,${alpha * 0.35})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.stroke()
        }
      }
    }

    function animate() {
      animRef.current = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y

      for (const p of particles) {
        // Repulsion
        if (mx !== null && my !== null) {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.hypot(dx, dy)
          if (dist < 200 && dist > 0) {
            const force = (200 - dist) / 200
            p.x += (dx / dist) * force * 1.5
            p.y += (dy / dist) * force * 1.5
          }
        }

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99,102,241,0.8)'
        ctx.fill()
      }

      connect()
    }

    resize()
    animate()

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    function onMouseOut() {
      mouse.current = { x: null, y: null }
    }

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseout', onMouseOut)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#0A0F1E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        maxWidth: 860,
        margin: '0 auto',
      }}>
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 100, padding: '6px 16px',
            marginBottom: 28,
          }}
        >
          <Zap size={14} color="#6366F1" />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'inherit' }}>
            O 1º marketplace de IA do Brasil
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: 0,
            background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Tudo que seu negócio<br />precisa de IA.
        </motion.h1>

        {/* Accent line */}
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#6366F1',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Em um lugar só.
        </motion.div>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 18,
            maxWidth: 520,
            lineHeight: 1.6,
            marginTop: 16,
            marginBottom: 0,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Agentes de IA curados, testados e prontos para trabalhar pelo seu negócio.
        </motion.p>

        {/* Buttons */}
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={() => router.push('/solucoes')}
            onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)' }}
            style={{
              background: '#6366F1', color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '15px 28px', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)',
              transition: 'background 0.2s, transform 0.15s',
            }}
          >
            Explorar soluções →
          </button>
          <button
            onClick={() => router.push('/criadores')}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: 10, padding: '14px 24px',
              fontWeight: 600, fontSize: 15,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            Para criadores
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 6,
        marginBottom: 32, zIndex: 10,
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.3)', fontSize: 11,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
          DESCUBRA COMO FUNCIONA
        </span>
        <ChevronDown size={18} color="rgba(255,255,255,0.3)" />
      </div>

      {/* Transition gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 80, pointerEvents: 'none', zIndex: 5,
        background: 'linear-gradient(to bottom, transparent, #f9fafb)',
      }} />
    </section>
  )
}
