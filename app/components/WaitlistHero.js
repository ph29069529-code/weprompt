'use client'
import { useRouter } from 'next/navigation'

export default function WaitlistHero() {
  const router = useRouter()

  return (
    <section
      style={{
        position: 'relative',
        background: 'white',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Radial indigo accent at top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <img
          src="/logo-icon.png"
          alt="WePrompt"
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
        />
      </div>

      {/* H1 */}
      <h1
        style={{
          fontSize: 'clamp(44px, 6vw, 64px)',
          fontWeight: 800,
          color: '#0A0F1E',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          margin: 0,
          marginBottom: 20,
          padding: '0 16px',
        }}
      >
        O marketplace de IA
        <br />
        para o seu negócio.
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: '#6B7280',
          fontSize: 18,
          lineHeight: 1.65,
          maxWidth: 480,
          textAlign: 'center',
          margin: 0,
          marginBottom: 40,
          padding: '0 16px',
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
            boxShadow: '0 0 32px rgba(99,102,241,0.3)',
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
            background: 'transparent',
            border: '1px solid #E5E7EB',
            color: '#374151',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          Para criadores
        </button>
      </div>

      {/* Bottom fade to page background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          zIndex: 10,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, #f9fafb)',
        }}
      />
    </section>
  )
}
