'use client'
import Link from 'next/link'
function InstagramIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function LinkedinIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

const socialLinks = [
  { icon: <InstagramIcon />, href: 'https://instagram.com/weprompt.app', label: 'Instagram' },
  { icon: <LinkedinIcon />, href: 'https://linkedin.com/company/weprompt', label: 'LinkedIn' },
  { icon: <YoutubeIcon />, href: 'https://youtube.com/@weprompt', label: 'YouTube' },
  { icon: <MailIcon />, href: 'mailto:contato@weprompt.app.br', label: 'Email' },
]

const navLinks = [
  { label: 'Catálogo', href: '/solucoes' },
  { label: 'Preços', href: '/precos' },
  { label: 'Para Criadores', href: '/criadores' },
  { label: 'Como Funciona', href: '/#como-funciona' },
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos', href: '/termos' },
  { label: 'Contato', href: 'mailto:contato@weprompt.app.br' },
]

export default function Footer() {
  return (
    <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <footer style={{
        borderTop: '1px solid #E5E7EB',
        background: 'white',
        position: 'relative',
        marginTop: 0,
      }}>
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          minHeight: 480,
          position: 'relative',
          padding: '48px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>

          {/* Top content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 80,
          }}>
            {/* Brand name */}
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0A0F1E',
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}>
              WePrompt
            </div>

            {/* Tagline */}
            <p style={{
              color: '#6B7280',
              fontSize: 15,
              textAlign: 'center',
              maxWidth: 360,
              marginBottom: 24,
              lineHeight: 1.6,
            }}>
              O 1º marketplace de soluções de IA do Brasil.
              Em português, para o seu negócio.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.href}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    color: '#9CA3AF',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'block',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {link.icon}
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Nav links */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px 20px',
              fontSize: 14,
              color: '#6B7280',
            }}>
              {navLinks.map((link, i) => (
                <Link key={i} href={link.href}
                  style={{
                    color: '#6B7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0A0F1E'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            paddingTop: 16,
            borderTop: '1px solid #F3F4F6',
            fontSize: 13,
            color: '#9CA3AF',
          }}>
            <span>© {new Date().getFullYear()} WePrompt. Todos os direitos reservados.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Feito no Brasil 🇧🇷
            </span>
          </div>
        </div>

        {/* Large background WEPROMPT text */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 120,
          fontSize: 'clamp(3rem, 12vw, 9rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}>
          WEPROMPT
        </div>

        {/* Logo icon floating */}
        <div style={{
          position: 'absolute',
          bottom: 64,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 24,
          border: '2px solid #E5E7EB',
          padding: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'border-color 0.3s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        >
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <img src="/logo-icon-white.png" alt="WePrompt"
              style={{ width: 40, height: 40, objectFit: 'contain' }} />
          </div>
        </div>

        {/* Gradient overlay above logo */}
        <div style={{
          position: 'absolute',
          bottom: 96,
          width: '100%',
          height: 80,
          background: 'linear-gradient(to top, white, transparent)',
          pointerEvents: 'none',
        }} />

      </footer>
    </section>
  )
}
