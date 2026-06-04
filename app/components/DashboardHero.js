'use client'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import HeroDashboard from './HeroDashboard'

export default function DashboardHero() {
  const router = useRouter()

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '100px 24px 0',
        background: '#0A0F1E',
        animation: 'fadeIn 0.6s ease-out',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      {/* 1. Badge */}
      <div
        onClick={() => router.push('/solucoes')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 100,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          marginBottom: 32,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        }}
      >
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#6366F1',
          flexShrink: 0,
        }} />
        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
        }}>
          Nova versão disponível — explore o catálogo
        </span>
        <ArrowRight size={12} color='rgba(255,255,255,0.4)' />
      </div>

      {/* 2. H1 */}
      <h1 style={{
        fontSize: 'clamp(36px, 5.5vw, 64px)',
        fontWeight: 600,
        textAlign: 'center',
        maxWidth: 700,
        lineHeight: 1.15,
        letterSpacing: '-0.05em',
        marginBottom: 24,
        marginTop: 0,
        background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0.6))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Tudo que seu negócio<br />precisa de IA.
      </h1>

      {/* 3. Subtitle */}
      <p style={{
        fontSize: 15,
        textAlign: 'center',
        maxWidth: 520,
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.45)',
        marginBottom: 40,
        marginTop: 0,
      }}>
        Marketplace de soluções de IA para o Brasil.{' '}
        Curadas, testadas e prontas para usar.
      </p>

      {/* 4. CTA Button */}
      <button
        onClick={() => router.push('/solucoes')}
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.85), rgba(255,255,255,0.6))',
          color: '#0A0F1E',
          padding: '14px 36px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 15,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 64,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
      >
        Começar agora
        <ArrowRight size={16} />
      </button>

      {/* 5. Dashboard Preview */}
      <div style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        position: 'relative',
        paddingBottom: 80,
      }}>
        {/* Amber/orange glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: 300,
          background: 'radial-gradient(ellipse, rgba(251,146,60,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Dashboard component */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.7)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <HeroDashboard />
        </div>
      </div>

      {/* Transition to white */}
      <div style={{ height: 2, background: '#f9fafb', width: '100%' }} />
    </section>
  )
}
