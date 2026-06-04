'use client'
import { useRef, useEffect, Suspense, lazy } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline/next'))

export default function GalaxyHero() {
  const router = useRouter()
  const heroContentRef = useRef(null)

  useEffect(() => {
    const maxScroll = 400
    function onScroll() {
      if (!heroContentRef.current) return
      const y = window.scrollY
      const opacity = Math.max(0, 1 - y / maxScroll)
      heroContentRef.current.style.opacity = opacity
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#0A0F1E',
      }}
    >
      {/* Spline 3D background */}
      <Suspense
        fallback={
          <div
            style={{ width: '100%', height: '100vh', background: '#0A0F1E' }}
          />
        }
      >
        <Spline
          style={{ width: '100%', height: '100vh', pointerEvents: 'auto' }}
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
      </Suspense>

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(to right, rgba(10,15,30,0.85), transparent 30%, transparent 70%, rgba(10,15,30,0.85))',
            'linear-gradient(to bottom, transparent 50%, rgba(10,15,30,0.95))',
          ].join(', '),
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Hero content */}
      <div
        ref={heroContentRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 'clamp(40px, 8vw, 120px)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: 560,
            pointerEvents: 'auto',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 100,
              padding: '5px 14px',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#6366F1',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
              }}
            >
              O 1º marketplace de IA do Brasil
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            Tudo que seu negócio
            <br />
            precisa de IA.
          </h1>

          {/* Accent line */}
          <div
            style={{
              color: '#6366F1',
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Em um lugar só.
          </div>

          {/* Subtitle */}
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 17,
              lineHeight: 1.65,
              maxWidth: 460,
              marginTop: 20,
              marginBottom: 36,
            }}
          >
            Agentes de IA curados, testados e prontos para trabalhar pelo seu
            negócio — com suporte em português.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/solucoes')}
              style={{
                background: '#6366F1',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 32px rgba(99,102,241,0.4)',
                transition: 'background 0.2s, transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#4F46E5'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#6366F1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Explorar soluções
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => router.push('/criadores')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                padding: '13px 24px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
            >
              Para criadores
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: 'linear-gradient(to bottom, transparent, #f9fafb)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
    </section>
  )
}
