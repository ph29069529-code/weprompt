'use client'
import {
  Bell,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'

const navItems = [
  { icon: <LayoutDashboard size={14} />, label: 'Dashboard', active: true },
  { icon: <Package size={14} />, label: 'Soluções' },
  { icon: <ShoppingCart size={14} />, label: 'Vendas' },
  { icon: <BarChart2 size={14} />, label: 'Analytics' },
  { icon: <Settings size={14} />, label: 'Configurações' },
]

const kpis = [
  {
    label: 'Receita Total',
    value: 'R$ 12.480',
    delta: '+18% este mês',
    icon: <TrendingUp size={16} color="#6366F1" />,
  },
  {
    label: 'Soluções Ativas',
    value: '47',
    delta: '+5 novos',
    icon: <Package size={16} color="#6366F1" />,
  },
  {
    label: 'Usuários',
    value: '1.284',
    delta: '+124 esta semana',
    icon: <Users size={16} color="#6366F1" />,
  },
  {
    label: 'Taxa Conversão',
    value: '8,4%',
    delta: '+2.1% vs mês ant.',
    icon: <Zap size={16} color="#6366F1" />,
  },
]

const rows = [
  {
    dot: '#22C55E',
    name: 'Secretária de WhatsApp',
    creator: 'por Pedro S.',
    price: 'R$29,90',
    status: 'approved',
  },
  {
    dot: '#6366F1',
    name: 'Agente de Prospecção',
    creator: 'por Ana L.',
    price: 'R$97,00',
    status: 'approved',
  },
  {
    dot: '#F59E0B',
    name: 'Gerador de Conteúdo',
    creator: 'por Carlos M.',
    price: 'R$47,00',
    status: 'pending',
  },
]

export default function HeroDashboard() {
  return (
    <div
      style={{
        background: '#0D1117',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        width: '100%',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        height: 380,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 48,
          background: '#0A0F1E',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: '#6366F1',
              borderRadius: 5,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
            WePrompt
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bell size={16} color="rgba(255,255,255,0.3)" />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#fff',
              fontWeight: 600,
            }}
          >
            P
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22C55E',
            }}
          />
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 180,
            background: '#080C14',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flexShrink: 0,
          }}
        >
          {navItems.map((item) => (
            <div
              key={item.label}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: item.active ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: item.active ? '#6366F1' : 'rgba(255,255,255,0.35)',
                cursor: 'default',
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: 20,
            background: '#0D1117',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>
              Visão Geral
            </span>
            <div
              style={{
                background: 'rgba(34,197,94,0.1)',
                color: '#22C55E',
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 100,
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              Ao vivo
            </div>
          </div>

          {/* KPI grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 14,
            }}
          >
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: '#0A0F1E',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {kpi.label}
                  </span>
                  {kpi.icon}
                </div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    marginTop: 6,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {kpi.value}
                </div>
                <div style={{ color: '#22C55E', fontSize: 10, marginTop: 4 }}>
                  {kpi.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Recent solutions */}
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Soluções Recentes
            </div>
            {rows.map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom:
                    i < rows.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                }}
              >
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: row.dot,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.3 }}>
                      {row.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: 10,
                        lineHeight: 1.3,
                      }}
                    >
                      {row.creator}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      color: '#6366F1',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {row.price}
                  </span>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background:
                        row.status === 'approved'
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(245,158,11,0.1)',
                      color:
                        row.status === 'approved' ? '#22C55E' : '#F59E0B',
                      border:
                        row.status === 'approved'
                          ? '1px solid rgba(34,197,94,0.2)'
                          : '1px solid rgba(245,158,11,0.2)',
                    }}
                  >
                    {row.status === 'approved' ? 'aprovado' : 'pendente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
