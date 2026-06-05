'use client'
import { useRouter } from 'next/navigation'

export default function WaitlistHero() {
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
      `}</style>

      {/* Main container */}
      <div
        className="relative w-full h-screen overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#09090b',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Rotating background rings */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            perspective: '1200px',
            transform: 'perspective(1200px) rotateX(15deg)',
            transformOrigin: 'center bottom',
            opacity: 1,
          }}
        >
          {/* Outer ring — clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: '2000px',
                height: '2000px',
                transform: 'translate(-50%, -50%) rotate(279.05deg)',
                zIndex: 0,
              }}
            >
              <img
                src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
                alt=""
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          </div>

          {/* Middle ring — counter-clockwise */}
          <div className="absolute inset-0 animate-spin-slow-reverse">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: '1000px',
                height: '1000px',
                transform: 'translate(-50%, -50%) rotate(304.42deg)',
                zIndex: 1,
              }}
            >
              <img
                src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
                alt=""
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </div>

          {/* Inner ring — clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: '800px',
                height: '800px',
                transform: 'translate(-50%, -50%) rotate(48.33deg)',
                zIndex: 2,
              }}
            >
              <img
                src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #09090b 10%, rgba(9,9,11,0.8) 40%, transparent 100%)',
          }}
        />

        {/* Content — bottom-aligned */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-end pb-24 gap-6">

          {/* Logo icon */}
          <div className="w-16 h-16 rounded-2xl shadow-lg overflow-hidden mb-2 ring-1 ring-white/10"
            style={{ background: '#18181b' }}
          >
            <img
              src="/logo-icon-white.png"
              alt="WePrompt"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
              onError={(e) => {
                // fallback to logo-icon.png if white variant missing
                if (!e.currentTarget.src.endsWith('/logo-icon.png')) {
                  e.currentTarget.src = '/logo-icon.png'
                }
              }}
            />
          </div>

          {/* H1 */}
          <h1
            className="text-center tracking-tight px-4"
            style={{
              fontSize: 'clamp(44px, 6vw, 64px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            O marketplace de IA
            <br />
            para o seu negócio.
          </h1>

          {/* Subtitle */}
          <p
            className="text-center px-4"
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 18,
              lineHeight: 1.65,
              maxWidth: 480,
              margin: 0,
            }}
          >
            Soluções de IA curadas, testadas e prontas para usar — com suporte em português.
          </p>

          {/* Two buttons */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Primary */}
            <button
              onClick={() => router.push('/solucoes')}
              style={{
                height: 60,
                paddingLeft: 32,
                paddingRight: 32,
                borderRadius: 9999,
                background: '#6366F1',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 32px rgba(99,102,241,0.4)',
                transition: 'filter 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
            >
              Explorar soluções →
            </button>

            {/* Secondary */}
            <button
              onClick={() => router.push('/criadores')}
              style={{
                height: 60,
                paddingLeft: 32,
                paddingRight: 32,
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            >
              Para criadores
            </button>
          </div>
        </div>

        {/* Bottom fade to page background */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            zIndex: 30,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
          }}
        />
      </div>
    </div>
  )
}
