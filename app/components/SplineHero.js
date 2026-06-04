'use client'
import { useRef, useEffect, Suspense, lazy, useState } from 'react'
import { useRouter } from 'next/navigation'

const Spline = lazy(() => import('@splinetool/react-spline/next'))

export default function SplineHero() {
  const router = useRouter()
  const heroContentRef = useRef(null)
  const [hovPrimary, setHovPrimary] = useState(false)
  const [hovSecondary, setHovSecondary] = useState(false)

  // Scroll-fade effect on hero content
  useEffect(() => {
    const onScroll = () => {
      if (!heroContentRef.current) return
      const opacity = 1 - Math.min(window.scrollY / 400, 1)
      heroContentRef.current.style.opacity = opacity
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ position: 'relative', background: '#0A0F1E' }}>

      {/* ── Viewport hero ─────────────────────────────────── */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {/* Spline 3D background */}
        <Suspense fallback={<div style={{ width: '100%', height: '100vh', background: '#0A0F1E' }} />}>
          <Spline
            style={{ width: '100%', height: '100vh', pointerEvents: 'auto' }}
            scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
          />
        </Suspense>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(to right, rgba(0,0,0,0.8), transparent 30%, transparent 70%, rgba(0,0,0,0.8))',
              'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9))',
            ].join(', '),
            pointerEvents: 'none',
          }}
        />

        {/* Hero content */}
        <div
          ref={heroContentRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              width: '100%',
              padding: '0 24px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 40,
              pointerEvents: 'auto',
            }}
          >
            {/* LEFT — headline + tagline */}
            <div style={{ width: '50%' }}>
              <h1
                style={{
                  color: '#fff',
                  fontSize: 'clamp(40px, 5.5vw, 72px)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                  marginTop: 0,
                  fontFamily: "'Inter', -apple-system, sans-serif",
                }}
              >
                O marketplace de IA
                <br />
                para o seu negócio.
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  marginTop: 16,
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', -apple-system, sans-serif",
                }}
              >
                IA • Automação • Produtividade • Brasil
              </p>
            </div>

            {/* RIGHT — subtitle + buttons */}
            <div style={{ width: '45%' }}>
              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 17,
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 420,
                  fontFamily: "'Inter', -apple-system, sans-serif",
                }}
              >
                Soluções de IA curadas, testadas e prontas para trabalhar pelo
                seu negócio — com suporte em português.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {/* Primary — ghost white */}
                <button
                  onClick={() => router.push('/solucoes')}
                  onMouseEnter={() => setHovPrimary(true)}
                  onMouseLeave={() => setHovPrimary(false)}
                  style={{
                    border: '1.5px solid white',
                    color: hovPrimary ? '#0A0F1E' : 'white',
                    background: hovPrimary ? 'white' : 'transparent',
                    fontWeight: 600,
                    fontSize: 15,
                    padding: '12px 28px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                  }}
                >
                  Explorar soluções →
                </button>

                {/* Secondary — solid white */}
                <button
                  onClick={() => router.push('/cadastro')}
                  onMouseEnter={() => setHovSecondary(true)}
                  onMouseLeave={() => setHovSecondary(false)}
                  style={{
                    background: 'white',
                    color: '#0A0F1E',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '12px 28px',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'transform 0.2s',
                    transform: hovSecondary ? 'scale(1.03)' : 'scale(1)',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                  }}
                >
                  {/* Plus icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Começar grátis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Screenshot section ─────────────────────────────── */}
      <div
        style={{
          background: '#0A0F1E',
          position: 'relative',
          zIndex: 10,
          marginTop: '-10vh',
        }}
      >
        <div
          style={{
            maxWidth: '80%',
            margin: '0 auto',
            padding: '48px 0',
          }}
        >
          <div
            style={{
              background: '#1a1a2e',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src="https://www.launchuicomponents.com/app-dark.png"
              alt="WePrompt dashboard"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
