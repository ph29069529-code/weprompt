'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, uploadSolutionImage } from '@/app/lib/supabase'
import Spinner from '@/app/components/Spinner'

const ACCENT = '#6366F1'
const ACCENT_HOVER = '#4F46E5'
const ACCENT_MUTED = 'rgba(99,102,241,0.1)'
const BORDER = '#E5E7EB'
const INPUT_BORDER = '#D1D5DB'
const ERROR = '#EF4444'
const LABEL_COLOR = '#374151'
const BG = '#F8F9FB'

const CATEGORIAS = [
  { value: 'atendimento', label: 'Atendimento ao Cliente' },
  { value: 'emails',      label: 'Automação de E-mails' },
  { value: 'vendas',      label: 'Vendas e Prospecção' },
  { value: 'dados',       label: 'Análise de Dados' },
  { value: 'whatsapp',    label: 'WhatsApp IA' },
  { value: 'marketing',   label: 'Marketing e Conteúdo' },
  { value: 'outro',       label: 'Outro' },
]

const CRIADOR_TABS = ['Dashboard', 'Minhas Soluções', 'Vendas', 'Configurações']

const lbl = {
  fontSize: 14, fontWeight: 600, color: LABEL_COLOR,
  marginBottom: 6, display: 'block',
}

function inputStyle(hasError) {
  return {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${hasError ? ERROR : INPUT_BORDER}`,
    fontSize: 15, color: '#111827', background: 'white',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
}

function FieldError({ msg }) {
  if (!msg) return null
  return <div style={{ fontSize: 13, color: ERROR, marginTop: 4 }}>{msg}</div>
}

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: 'white', border: `1px solid ${BORDER}`, borderRadius: 16,
      padding: 24, marginBottom: 20,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>{title}</h3>
      {children}
    </div>
  )
}

function onFocus(e) {
  e.target.style.borderColor = ACCENT
  e.target.style.boxShadow = `0 0 0 3px ${ACCENT_MUTED}`
}
function onBlur(e, hasError) {
  e.target.style.borderColor = hasError ? ERROR : INPUT_BORDER
  e.target.style.boxShadow = 'none'
}

export default function NovaSolucaoPage() {
  const router = useRouter()
  const [hoveredTab, setHoveredTab] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    descricao_curta: '',
    categoria: '',
    descricao: '',
    preco: '',
    payment_type: 'subscription',
    delivery_type: 'external_link',
    access_url: '',
    requirements: '',
    support_channel: 'email',
    demo_url: '',
  })
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [globalError, setGlobalError] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function handleCover(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setErrors(err => ({ ...err, cover: 'Arquivo muito grande. Máximo 2MB.' }))
      return
    }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setErrors(err => ({ ...err, cover: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório'
    else if (form.nome.trim().length < 5) errs.nome = 'Nome deve ter pelo menos 5 caracteres'
    if (!form.descricao_curta.trim()) errs.descricao_curta = 'Descrição curta é obrigatória'
    if (!form.categoria) errs.categoria = 'Selecione uma categoria'
    if (!form.descricao.trim()) errs.descricao = 'Descrição completa é obrigatória'
    else if (form.descricao.trim().length < 50) errs.descricao = 'Descrição deve ter pelo menos 50 caracteres'
    if (!form.preco) errs.preco = 'Preço é obrigatório'
    else if (Number(form.preco) < 1) errs.preco = 'Preço deve ser pelo menos R$ 1'
    return errs
  }

  async function handleSubmit(status) {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const setter = status === 'draft' ? setLoadingDraft : setLoadingSubmit
    setter(true)
    setGlobalError('')

    try {
      let cover_url = null
      if (coverFile) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          cover_url = await uploadSolutionImage(coverFile, session.user.id)
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const res = await fetch('/api/solucoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ ...form, cover_url, status }),
      })

      const json = await res.json()
      if (!res.ok) {
        setGlobalError(json.error || 'Erro ao salvar a solução.')
        return
      }

      if (status === 'draft') {
        router.push('/dashboard/criador/solucoes')
      } else {
        router.push('/dashboard/criador/solucao-publicada')
      }
    } catch (err) {
      setGlobalError('Erro inesperado. Tente novamente.')
    } finally {
      setter(false)
    }
  }

  const isLoading = loadingDraft || loadingSubmit

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{
        background: 'white', borderBottom: `1px solid ${BORDER}`,
        padding: '0 32px', height: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}><img src="/logo.png" alt="WePrompt" style={{ width: 160, height: "auto" }} /></Link>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: searchFocused ? 'white' : '#f3f4f6',
          borderRadius: 8, padding: '8px 16px', width: 360, gap: 8,
          border: searchFocused ? `1px solid ${ACCENT}` : '1px solid transparent',
          boxShadow: searchFocused ? `0 0 0 3px ${ACCENT_MUTED}` : 'none',
          transition: 'all 0.2s ease',
        }}>
          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input placeholder="Buscar soluções..."
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ fontSize: 14, border: 'none', background: 'transparent', outline: 'none', flex: 1, color: '#374151' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Marketplace ▾</button>
          <button style={{ fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Vender ▾</button>
          <div style={{ width: 1, height: 20, background: BORDER }} />
          <Link href="/dashboard/criador/configuracoes" style={{ textDecoration: 'none' }}><div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}>C</div></Link>
        </div>
      </nav>

      {/* TABS ROW */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px', display: 'flex', gap: 0 }}>
        {CRIADOR_TABS.map((tab, i) => (
          <button key={tab}
            onClick={() => {
              if (i === 0) router.push('/dashboard/criador')
              else if (i === 1) router.push('/dashboard/criador/solucoes')
              else if (i === 2) router.push('/dashboard/criador/vendas')
              else if (i === 3) router.push('/dashboard/criador/configuracoes')
            }}
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontSize: 14, padding: '14px 20px 14px 0', marginRight: 8, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', border: 'none',
              borderBottom: i === 1 ? `2px solid #111827` : '2px solid transparent',
              background: 'transparent',
              color: i === 1 ? '#111827' : hoveredTab === i ? '#374151' : '#6b7280',
              fontWeight: i === 1 ? 600 : 400,
              marginBottom: -1, transition: 'color 0.15s ease', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >{tab}</button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: '28px 32px', maxWidth: 760, margin: '0 auto' }}>

        {/* TITLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>Nova Solução</h1>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>Preencha os dados abaixo para publicar sua solução no marketplace.</p>
          </div>
          <button onClick={() => router.push('/dashboard/criador/solucoes')}
            style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>
            ← Voltar
          </button>
        </div>

        {/* SECTION 1 — Informações Básicas */}
        <SectionCard title="1. Informações Básicas">

          {/* Nome */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Nome da solução *</label>
            <input
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Ex: Agente de Atendimento WhatsApp"
              style={inputStyle(!!errors.nome)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.nome)}
            />
            <FieldError msg={errors.nome} />
          </div>

          {/* Descrição curta */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ ...lbl, marginBottom: 0 }}>Descrição curta *</label>
              <span style={{ fontSize: 12, color: form.descricao_curta.length > 110 ? (form.descricao_curta.length >= 120 ? ERROR : '#f59e0b') : '#9CA3AF' }}>
                {form.descricao_curta.length}/120
              </span>
            </div>
            <input
              value={form.descricao_curta}
              onChange={e => set('descricao_curta', e.target.value.slice(0, 120))}
              placeholder="Uma linha que resume o que sua solução faz"
              style={inputStyle(!!errors.descricao_curta)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.descricao_curta)}
            />
            <FieldError msg={errors.descricao_curta} />
          </div>

          {/* Categoria */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Categoria *</label>
            <select
              value={form.categoria}
              onChange={e => set('categoria', e.target.value)}
              style={{ ...inputStyle(!!errors.categoria), cursor: 'pointer' }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.categoria)}
            >
              <option value="">Selecione uma categoria…</option>
              {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <FieldError msg={errors.categoria} />
          </div>

          {/* Descrição completa */}
          <div>
            <label style={lbl}>Descrição completa *</label>
            <textarea
              rows={6}
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva em detalhes o que sua solução faz, como funciona e quais problemas resolve"
              style={{ ...inputStyle(!!errors.descricao), resize: 'vertical', lineHeight: 1.65 }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.descricao)}
            />
            <FieldError msg={errors.descricao} />
          </div>

        </SectionCard>

        {/* SECTION 2 — Precificação */}
        <SectionCard title="2. Precificação">

          {/* Preço */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Preço mensal (R$) *</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.preco}
              onChange={e => set('preco', e.target.value)}
              placeholder="97"
              style={{ ...inputStyle(!!errors.preco), maxWidth: 200 }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.preco)}
            />
            <FieldError msg={errors.preco} />
          </div>

          {/* Tipo de cobrança */}
          <div>
            <label style={lbl}>Tipo de cobrança</label>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { value: 'subscription', label: 'Assinatura mensal' },
                { value: 'one_time',     label: 'Pagamento único' },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                  <input
                    type="radio"
                    name="payment_type"
                    value={opt.value}
                    checked={form.payment_type === opt.value}
                    onChange={() => set('payment_type', opt.value)}
                    style={{ accentColor: ACCENT, width: 16, height: 16 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

        </SectionCard>

        {/* SECTION 3 — Entrega */}
        <SectionCard title="3. Entrega">

          {/* Como o comprador acessa */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Como o comprador acessa</label>
            <select
              value={form.delivery_type}
              onChange={e => set('delivery_type', e.target.value)}
              style={{ ...inputStyle(false), cursor: 'pointer' }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            >
              <option value="external_link">Link externo</option>
              <option value="in_platform">Dentro da WePrompt (em breve)</option>
            </select>
          </div>

          {/* Link de acesso — condicional */}
          {form.delivery_type === 'external_link' && (
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>Link de acesso</label>
              <input
                type="url"
                value={form.access_url}
                onChange={e => set('access_url', e.target.value)}
                placeholder="https://..."
                style={inputStyle(false)}
                onFocus={onFocus}
                onBlur={e => onBlur(e, false)}
              />
            </div>
          )}

          {/* Requisitos */}
          <div>
            <label style={lbl}>Requisitos</label>
            <textarea
              rows={3}
              value={form.requirements}
              onChange={e => set('requirements', e.target.value)}
              placeholder="O que o comprador precisa ter para usar (ex: conta no WhatsApp Business, acesso ao Make...)"
              style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.65 }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            />
          </div>

        </SectionCard>

        {/* SECTION 4 — Suporte e Demo */}
        <SectionCard title="4. Suporte e Demo">

          {/* Canal de suporte */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Canal de suporte</label>
            <select
              value={form.support_channel}
              onChange={e => set('support_channel', e.target.value)}
              style={{ ...inputStyle(false), cursor: 'pointer' }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            >
              <option value="email">E-mail</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="plataforma">Dentro da plataforma</option>
            </select>
          </div>

          {/* Demo URL */}
          <div>
            <label style={lbl}>Link de demonstração (opcional)</label>
            <input
              type="url"
              value={form.demo_url}
              onChange={e => set('demo_url', e.target.value)}
              placeholder="https://youtube.com/... ou https://..."
              style={inputStyle(false)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            />
          </div>

        </SectionCard>

        {/* SECTION 5 — Imagem de Capa */}
        <SectionCard title="5. Imagem de Capa">
          <label style={lbl}>Imagem de capa</label>
          <div
            onClick={() => document.getElementById('cover-upload').click()}
            style={{
              border: `2px dashed ${errors.cover ? ERROR : BORDER}`,
              borderRadius: 12, padding: '32px 24px',
              textAlign: 'center', cursor: 'pointer',
              background: coverPreview ? 'transparent' : '#fafafa',
              overflow: 'hidden', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
            onMouseLeave={e => e.currentTarget.style.borderColor = errors.cover ? ERROR : BORDER}
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Prévia da capa" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <>
                <svg width="36" height="36" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 10px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Clique para fazer upload</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>PNG, JPG ou WebP — máx. 2MB</div>
              </>
            )}
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCover}
            />
          </div>
          {coverPreview && (
            <button
              type="button"
              onClick={() => { setCoverFile(null); setCoverPreview(null) }}
              style={{ marginTop: 8, fontSize: 12, color: ERROR, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Remover imagem
            </button>
          )}
          <FieldError msg={errors.cover} />
        </SectionCard>

        {/* GLOBAL ERROR */}
        {globalError && (
          <div style={{
            background: 'rgba(239,68,68,0.07)', border: `1px solid rgba(239,68,68,0.2)`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
            fontSize: 14, color: ERROR,
          }}>
            {globalError}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 40 }}>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isLoading}
            style={{
              padding: '14px 28px', borderRadius: 10,
              border: `1.5px solid ${BORDER}`,
              background: 'transparent', fontSize: 14, fontWeight: 600,
              color: LABEL_COLOR, cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loadingDraft ? 0.6 : 1,
              transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#F3F4F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {loadingDraft && <Spinner />}
            {loadingDraft ? 'Salvando…' : 'Salvar rascunho'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('pending')}
            disabled={isLoading}
            style={{
              padding: '14px 28px', borderRadius: 10, border: 'none',
              background: loadingSubmit ? ACCENT_HOVER : ACCENT,
              color: 'white', fontSize: 14, fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loadingSubmit ? 0.8 : 1,
              transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = ACCENT_HOVER }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = ACCENT }}
          >
            {loadingSubmit && <Spinner />}
            {loadingSubmit ? 'Enviando…' : 'Enviar para aprovação →'}
          </button>
        </div>

      </div>
    </div>
  )
}
