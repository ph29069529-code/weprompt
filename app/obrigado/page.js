'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

function SuccessContent() {
  const router = useRouter()
  const params = useSearchParams()
  // session_id is available for future use (e.g. fetching order details from Stripe)
  // eslint-disable-next-line no-unused-vars
  const sessionId = params.get('session_id')

  const STEPS = [
    'Acesse seu dashboard para usar sua nova solução',
    'Você receberá um e-mail de confirmação em breve',
    'O suporte em português está disponível se precisar',
  ]

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-icon { animation: scaleIn 0.5s ease-out forwards; }
        .btn-primary {
          width: 100%;
          padding: 16px 32px;
          borderRadius: 10px;
          background: #6366F1;
          color: #fff;
          border: none;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #4F46E5; }
        .btn-secondary {
          width: 100%;
          padding: 15px 32px;
          border-radius: 10px;
          background: transparent;
          color: #6B7280;
          border: 1.5px solid #E5E7EB;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-secondary:hover { background: #F8F9FB; border-color: #D1D5DB; }
        .support-link { color: #6366F1; text-decoration: none; }
        .support-link:hover { text-decoration: underline; }
      `}</style>

      <main style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>

          {/* 1 — Animated checkmark */}
          <div className="success-icon" style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.1)',
            border: '2px solid rgba(99,102,241,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
          }}>
            <CheckCircle size={40} color="#6366F1" />
          </div>

          {/* 2 — Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 800,
            color: '#0A0F1E',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Pagamento confirmado!
          </h1>

          {/* 3 — Subtitle */}
          <p style={{
            fontSize: 18,
            color: '#6B7280',
            lineHeight: 1.6,
            marginTop: 12,
            marginBottom: 0,
          }}>
            Sua solução já está disponível no seu dashboard.
          </p>

          {/* 4 — Divider */}
          <div style={{ borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

          {/* 5 — Info box */}
          <div style={{
            background: '#F8F9FB',
            borderRadius: 12,
            padding: '20px 24px',
            textAlign: 'left',
            border: '1px solid #E5E7EB',
          }}>
            <p style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#374151',
              marginBottom: 12,
              marginTop: 0,
            }}>
              O que acontece agora?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STEPS.map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#6366F1',
                    marginTop: 6,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 — CTA buttons */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="btn-primary"
              onClick={() => router.push('/dashboard/empresa')}
            >
              Acessar meu dashboard →
            </button>
            <button
              className="btn-secondary"
              onClick={() => router.push('/solucoes')}
            >
              Explorar mais soluções
            </button>
          </div>

          {/* 7 — Support note */}
          <p style={{ marginTop: 24, fontSize: 13, color: '#6B7280' }}>
            Dúvidas?{' '}
            <a href="mailto:contato@weprompt.app.br" className="support-link">
              Fale com o suporte
            </a>
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #F3F4F6',
        padding: 24,
        textAlign: 'center',
        fontSize: 13,
        color: '#9CA3AF',
      }}>
        © 2026 WePrompt
      </footer>
    </>
  )
}

export default function ObrigadoPage() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', background: '#fff' }}>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
