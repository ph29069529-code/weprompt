'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ACCENT = '#6366F1'
const ACCENT_HOVER = '#4F46E5'
const ACCENT_MUTED = 'rgba(99,102,241,0.1)'
const BORDER = '#E5E7EB'
const BG = '#F8F9FB'

export default function SolucaoPublicadaPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      setChecking(false)
    })
  }, [router])

  if (checking) return null

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0);    opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px',
      }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

          {/* Checkmark circle */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: ACCENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: `0 12px 40px ${ACCENT_MUTED}`,
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
          }}>
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 style={{
            fontSize: 28, fontWeight: 800, color: '#111827',
            margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.2,
          }}>
            Solução enviada para aprovação!
          </h1>

          <p style={{
            fontSize: 16, color: '#6B7280', lineHeight: 1.6,
            margin: '0 auto 40px', maxWidth: 400,
          }}>
            Nossa equipe vai revisar em até 48h. Você será notificado por e-mail.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/dashboard/criador/solucoes"
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: ACCENT, color: 'white',
                borderRadius: 10, padding: '14px 28px',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
            >
              Ver minhas soluções
            </a>
            <a
              href="/dashboard/criador/nova-solucao"
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'transparent', color: '#374151',
                border: `1.5px solid ${BORDER}`,
                borderRadius: 10, padding: '14px 28px',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Publicar outra solução
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
