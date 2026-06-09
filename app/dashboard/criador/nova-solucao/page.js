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

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return "https://www.youtube.com/embed/" + ytMatch[1];
  const loomMatch = url.match(/loom\.com\/share\/([^?\s]+)/);
  if (loomMatch) return "https://www.loom.com/embed/" + loomMatch[1];
  return url;
}

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
  return (
    <p style={{
      color: '#EF4444', fontSize: 13, margin: '4px 0 0',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      ⚠ {msg}
    </p>
  )
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
    tipo: 'agente',
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
    conteudo_pack: '',
    agent_system_prompt: '',
    como_funciona: '',
    video_demo: '',
    video_tutorial: '',
    video_curadoria: '',
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
    if (!form.nome.trim()) errs.nome = 'Nome deve ter pelo menos 5 caracteres'
    else if (form.nome.trim().length < 5) errs.nome = 'Nome deve ter pelo menos 5 caracteres'
    if (!form.descricao_curta.trim()) errs.descricao_curta = 'Descrição curta deve ter pelo menos 10 caracteres'
    else if (form.descricao_curta.trim().length < 10) errs.descricao_curta = 'Descrição curta deve ter pelo menos 10 caracteres'
    if (!form.categoria) errs.categoria = 'Selecione uma categoria'
    if (!form.descricao.trim()) errs.descricao = 'Descrição deve ter pelo menos 50 caracteres'
    else if (form.descricao.trim().length < 50) errs.descricao = 'Descrição deve ter pelo menos 50 caracteres'
    if (!form.preco || Number(form.preco) < 1) errs.preco = 'Informe um preço válido (mínimo R$1)'
    if (!form.como_funciona.trim()) errs.como_funciona = 'Explique como funciona na prática (obrigatório)'
    else if (form.como_funciona.trim().length < 20) errs.como_funciona = 'Use pelo menos 20 caracteres'
    return errs
  }

  async function handleSubmit(status) {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]')
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 0)
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

        {/* ── Tipo de Produto ── */}
        {/* SQL (run once in Supabase):
            ALTER TABLE solutions ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'agente';
            ALTER TABLE solutions ADD COLUMN IF NOT EXISTS conteudo_pack TEXT; */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ ...lbl, marginBottom: 10, display: 'block' }}>Tipo de Produto *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'agente',      icon: '🤖', title: 'Agente IA',    desc: 'Solução que roda dentro do Workspace WePrompt', badge: 'Requer Workspace' },
              { key: 'prompt_pack', icon: '📄', title: 'Prompt Pack',  desc: 'Coleção de prompts para usar em qualquer IA',   badge: 'Entrega digital' },
            ].map(opt => (
              <button key={opt.key} type="button" onClick={() => set('tipo', opt.key)}
                style={{
                  border: form.tipo === opt.key ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                  background: form.tipo === opt.key ? 'rgba(99,102,241,0.04)' : 'white',
                  borderRadius: 12, padding: 20, textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{opt.icon}</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: 15, marginBottom: 4 }}>{opt.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{opt.desc}</div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: form.tipo === opt.key ? '#EEF2FF' : '#f3f4f6',
                  color: form.tipo === opt.key ? ACCENT : '#6b7280',
                }}>{opt.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Conteúdo do Pack (only for prompt_pack) ── */}
        {form.tipo === 'prompt_pack' && (
          <SectionCard title="Conteúdo do Pack">
            <div style={{ marginBottom: 4 }}>
              <label style={lbl}>Cole aqui os seus prompts *</label>
              <textarea
                value={form.conteudo_pack}
                onChange={e => set('conteudo_pack', e.target.value)}
                placeholder={"## Prompt 1 — Nome do Prompt\n\nDescrição do prompt...\n\n[PROMPT]\nCole aqui o prompt completo\n\n---\n\n## Prompt 2..."}
                style={{ ...inputStyle(false), minHeight: 220, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={onFocus}
                onBlur={e => onBlur(e, false)}
              />
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                Este conteúdo será exibido para o comprador após a compra. Use ## para títulos, [PROMPT] para blocos de prompt e --- para separadores.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ── System Prompt (only for agente) ── */}
        {/* SQL: ALTER TABLE solutions ADD COLUMN IF NOT EXISTS agent_system_prompt TEXT; */}
        {form.tipo === 'agente' && (
          <SectionCard title="Prompt do Sistema (System Prompt)">
            <div style={{ marginBottom: 4 }}>
              <label style={lbl}>Defina o comportamento do agente</label>
              <textarea
                value={form.agent_system_prompt}
                onChange={e => set('agent_system_prompt', e.target.value)}
                placeholder={"Você é [nome do agente], um assistente especializado em [área].\nSeu objetivo é [objetivo principal].\nSempre responda em português brasileiro.\nTom de voz: [profissional/amigável/técnico].\n\nInstruções específicas:\n- [instrução 1]\n- [instrução 2]"}
                style={{ ...inputStyle(false), minHeight: 150, resize: 'vertical', lineHeight: 1.7, fontFamily: 'monospace' }}
                onFocus={onFocus}
                onBlur={e => onBlur(e, false)}
              />
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                Este é o prompt que define o comportamento do seu agente. Quanto mais detalhado, melhor o resultado. Sem um system prompt, o agente usará um padrão genérico.
              </p>
            </div>
          </SectionCard>
        )}

        {/* SECTION 1 — Informações Básicas */}
        <SectionCard title="1. Informações Básicas">

          {/* Nome */}
          <div data-error={errors.nome ? "true" : undefined} style={{ marginBottom: 18 }}>
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
          <div data-error={errors.descricao_curta ? "true" : undefined} style={{ marginBottom: 18 }}>
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
          <div data-error={errors.categoria ? "true" : undefined} style={{ marginBottom: 18 }}>
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
          <div data-error={errors.descricao ? "true" : undefined}>
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

        {/* ── Como Funciona e Vídeos ── */}
        <SectionCard title="Como Funciona e Vídeos">

          {/* Como funciona na prática */}
          <div data-error={errors.como_funciona ? "true" : undefined} style={{ marginBottom: 20 }}>
            <label style={lbl}>Como funciona na prática *</label>
            <textarea
              rows={5}
              value={form.como_funciona}
              onChange={e => set('como_funciona', e.target.value)}
              placeholder="Explique passo a passo como a empresa vai usar esta solução."
              style={{ ...inputStyle(!!errors.como_funciona), resize: 'vertical', lineHeight: 1.65, minHeight: 120 }}
              onFocus={onFocus}
              onBlur={e => onBlur(e, !!errors.como_funciona)}
            />
            <FieldError msg={errors.como_funciona} />
          </div>

          {/* Vídeo de demonstração */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Vídeo de demonstração (opcional)</label>
            <input
              type="url"
              value={form.video_demo}
              onChange={e => set('video_demo', e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou https://loom.com/share/..."
              style={inputStyle(false)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            />
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
              Vídeo curto mostrando o que sua solução faz. Aparece na página pública antes da compra. YouTube ou Loom.
            </p>
          </div>

          {/* Vídeo tutorial */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Vídeo tutorial de integração (opcional)</label>
            <input
              type="url"
              value={form.video_tutorial}
              onChange={e => set('video_tutorial', e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou https://loom.com/share/..."
              style={inputStyle(false)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            />
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
              Vídeo ensinando como integrar a solução no negócio. Aparece no Workspace após a compra.
            </p>
          </div>

          {/* Vídeo de curadoria */}
          <div>
            <label style={lbl}>Vídeo para curadoria (opcional mas recomendado)</label>
            <input
              type="url"
              value={form.video_curadoria}
              onChange={e => set('video_curadoria', e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou https://loom.com/share/..."
              style={inputStyle(false)}
              onFocus={onFocus}
              onBlur={e => onBlur(e, false)}
            />
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6, lineHeight: 1.5 }}>
              Vídeo explicando sua solução e como ela funciona na prática. Enviado apenas para a equipe WePrompt avaliar. Aumenta muito a chance de aprovação.
            </p>
          </div>

        </SectionCard>

        {/* SECTION 2 — Precificação */}
        <SectionCard title="2. Precificação">

          {/* Preço */}
          <div data-error={errors.preco ? "true" : undefined} style={{ marginBottom: 20 }}>
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
