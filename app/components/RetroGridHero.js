'use client'
import { useState } from 'react'

// ── RetroGrid ──────────────────────────────────────────────────────────
function RetroGrid({ className, angle = 65 }) {
  return (
    <div
      className={`pointer-events-none absolute w-full h-full overflow-hidden ${className || ''}`}
      style={{ perspective: '200px', opacity: 0.4 }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className="animate-grid"
          style={{
            backgroundImage: [
              `linear-gradient(to right, #4a4a4a 1px, transparent 0)`,
              `linear-gradient(to bottom, #4a4a4a 1px, transparent 0)`,
            ].join(', '),
            backgroundSize: '50px 50px',
            height: '300vh',
            position: 'absolute',
            inset: '0% 0px',
            marginLeft: '-50%',
            transformOrigin: '100% 0 0',
            width: '600vw',
          }}
        />
      </div>
      {/* Fade grid into background at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────
export default function RetroGridHero() {
  const [imgSrc, setImgSrc] = useState('https://www.launchuicomponents.com/app-light.png')
  const [imgFailed, setImgFailed] = useState(false)

  function handleImgError() {
    if (imgSrc === 'https://www.launchuicomponents.com/app-light.png') {
      setImgSrc('https://www.launchuicomponents.com/app-dark.png')
    } else {
      setImgFailed(true)
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950">

      {/* Radial purple/violet glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3) 0%, transparent 75%)',
        }}
      />

      {/* Animated retro grid */}
      <RetroGrid />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5 text-center px-4 max-w-4xl mx-auto pb-10">

        {/* Title pill */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
            <span className="font-semibold text-purple-400">Novo</span>
            <span className="text-white/30">•</span>
            <span className="text-white/70">Marketplace de IA para o Brasil</span>
          </div>
        </div>

        {/* H2 — top part plain gradient white, accent phrase in purple→zinc */}
        <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
          <span
            style={{
              background: 'linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.45))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            O marketplace de IA{' '}
          </span>
          <span
            style={{
              background: 'linear-gradient(to right, #a78bfa, #71717a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            para o seu negócio.
          </span>
        </h2>

        {/* Description */}
        <p className="max-w-xl text-base text-zinc-400 sm:text-lg leading-relaxed">
          Soluções de IA curadas, testadas e prontas para trabalhar pelo seu
          negócio — com suporte em português.
        </p>

        {/* CTA — spinning conic-gradient border */}
        <span style={{
          position: 'relative',
          display: 'inline-block',
          overflow: 'hidden',
          borderRadius: '9999px',
          padding: '1.5px',
        }}>
          <span style={{
            position: 'absolute',
            inset: '-1000%',
            animation: 'spin 2s linear infinite',
            background: 'conic-gradient(from 90deg at 50% 50%, #E2CBFF 0%, #393BB2 50%, #E2CBFF 100%)',
          }} />
          <div style={{
            display: 'inline-flex',
            height: '100%',
            width: '100%',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            background: 'white',
            fontSize: '13px',
            fontWeight: 500,
            backdropFilter: 'blur(24px)',
          }}>
            <a href="/solucoes" style={{
              display: 'inline-flex',
              borderRadius: '9999px',
              textAlign: 'center',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              background: 'linear-gradient(to right, rgba(212,196,255,0.2), rgba(167,139,250,0.3), transparent)',
              color: '#111827',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '16px 40px',
              textDecoration: 'none',
            }}>
              Explorar soluções
            </a>
          </div>
        </span>

        {/* Dashboard preview — farmui light → dark → scroll indicator */}
        {!imgFailed ? (
          <div className="relative mt-6 w-full max-w-3xl">
            <img
              src={imgSrc}
              alt="WePrompt platform preview"
              onError={handleImgError}
              style={{
                width: '100%',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                display: 'block',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent rounded-xl" />
          </div>
        ) : (
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <p style={{
              color: 'rgba(0,0,0,0.2)',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Descubra como funciona
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
