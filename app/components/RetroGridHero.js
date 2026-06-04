'use client'
import Link from 'next/link'

// ── RetroGrid ──────────────────────────────────────────────────────────
function RetroGrid({ className, angle = 65 }) {
  return (
    <div
      className={`pointer-events-none absolute w-full h-full overflow-hidden opacity-50 ${className || ''}`}
      style={{ perspective: '200px' }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className="animate-grid"
          style={{
            backgroundImage: [
              'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 0)',
              'linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 0)',
            ].join(', '),
            backgroundSize: '60px 60px',
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
        <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <span
            className="absolute inset-[-1000%]"
            style={{
              animation: 'spin 2s linear infinite',
              background:
                'conic-gradient(from 90deg at 50% 50%, #E2CBFF 0%, #393BB2 50%, #E2CBFF 100%)',
            }}
          />
          <Link
            href="/solucoes"
            className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl"
          >
            Explorar soluções
          </Link>
        </div>

        {/* Dashboard preview image */}
        <div className="relative mt-6 w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <img
            src="https://farmui.vercel.app/dashboard-light.png"
            alt="WePrompt platform preview"
            className="w-full block"
          />
          {/* Fade to background at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

      </div>
    </div>
  )
}
