'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/* ── Product card ───────────────────────────────────────────────── */
function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="parallax-card"
      style={{
        height: 280,
        width: 420,
        flexShrink: 0,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Link
        href={product.link}
        style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top',
            display: 'block',
          }}
        />
        <div
          className="parallax-card-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'black', opacity: 0,
            transition: 'opacity 0.3s',
          }}
        />
        <div
          className="parallax-card-title"
          style={{
            position: 'absolute', bottom: 12, left: 16,
            color: 'white', fontSize: 14, fontWeight: 600,
            opacity: 0, transition: 'opacity 0.3s',
            zIndex: 1,
          }}
        >
          {product.title}
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Header ─────────────────────────────────────────────────────── */
function Header() {
  const router = useRouter()

  return (
    <div
      className="parallax-header"
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '120px 24px 60px',
      }}
    >
      {/* Badge */}
      <div style={{
        display: 'inline-block',
        background: 'rgba(99,102,241,0.15)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 100,
        padding: '5px 14px',
        marginBottom: 20,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'inherit' }}>
          NOVO&nbsp;&nbsp;•&nbsp;&nbsp;O 1º marketplace de IA do Brasil
        </span>
      </div>

      {/* H1 */}
      <h1 style={{
        fontSize: 'clamp(40px, 6vw, 72px)',
        fontWeight: 800,
        color: '#ffffff',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        margin: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        Tudo que seu negócio<br />precisa de IA.
      </h1>

      {/* Accent line */}
      <div style={{
        fontSize: 'clamp(40px, 6vw, 72px)',
        fontWeight: 800,
        color: '#6366F1',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        Em um lugar só.
      </div>

      {/* Subtitle */}
      <p style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: 18,
        maxWidth: 520,
        marginTop: 16,
        marginBottom: 0,
        lineHeight: 1.6,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        Agentes de IA curados, testados e prontos para trabalhar pelo seu negócio.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
        <button
          className="parallax-btn-primary"
          onClick={() => router.push('/solucoes')}
          style={{
            background: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '14px 28px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            boxShadow: '0 0 40px rgba(99,102,241,0.35)',
            transition: 'background 0.2s, transform 0.15s',
          }}
        >
          Explorar soluções →
        </button>
        <button
          className="parallax-btn-secondary"
          onClick={() => router.push('/criadores')}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            borderRadius: 10,
            padding: '13px 24px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          Para criadores
        </button>
      </div>
    </div>
  )
}

/* ── HeroParallax ────────────────────────────────────────────────── */
export default function HeroParallax({ products }) {
  const firstRow  = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow  = products.slice(10, 15)

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX        = useSpring(useTransform(scrollYProgress, [0, 1],   [0,  1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1],   [0, -1000]), springConfig)
  const rotateX           = useSpring(useTransform(scrollYProgress, [0, 0.2], [15,  0]),   springConfig)
  const opacity           = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),   springConfig)
  const rotateZ           = useSpring(useTransform(scrollYProgress, [0, 0.2], [20,  0]),   springConfig)
  const translateY        = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)

  return (
    <div
      ref={ref}
      style={{ height: '280vh', background: '#0A0F1E' }}
    >
      <style>{`
        .parallax-card:hover .parallax-card-overlay { opacity: 0.6 !important; }
        .parallax-card:hover .parallax-card-title   { opacity: 1   !important; }
        .parallax-btn-primary:hover  { background: #4F46E5 !important; transform: translateY(-1px); }
        .parallax-btn-secondary:hover { border-color: rgba(255,255,255,0.5) !important; color: #fff !important; }
        @media (max-width: 768px) {
          .parallax-card    { width: 260px !important; height: 180px !important; }
          .parallax-header  { padding: 80px 24px 32px !important; }
        }
      `}</style>

      {/* Sticky viewport — clips overflowing card rows */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          perspective: '1000px',
        }}
      >
        {/* Centered header */}
        <Header />

        {/* 3-D card grid */}
        <motion.div style={{ rotateX, rotateZ, opacity, translateY }}>

          {/* Row 1 — scrolls right */}
          <motion.div style={{
            display: 'flex', gap: 24,
            padding: '0 24px', marginBottom: 24,
            translateX,
          }}>
            {firstRow.map(p => <ProductCard key={p.title} product={p} />)}
          </motion.div>

          {/* Row 2 — scrolls left */}
          <motion.div style={{
            display: 'flex', gap: 24,
            padding: '0 24px', marginBottom: 24,
            translateX: translateXReverse,
          }}>
            {secondRow.map(p => <ProductCard key={p.title} product={p} />)}
          </motion.div>

          {/* Row 3 — scrolls right */}
          <motion.div style={{
            display: 'flex', gap: 24,
            padding: '0 24px',
            translateX,
          }}>
            {thirdRow.map(p => <ProductCard key={p.title} product={p} />)}
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
