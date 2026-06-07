require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
)

const WEPROMPT_DEMO_ID = '00000000-0000-0000-0000-000000000001'

const agents = [
  {
    titulo: 'Secretária Virtual WePrompt',
    descricao: 'Sua assistente de WhatsApp 24h. Responde clientes, agenda reuniões, filtra mensagens e mantém seu negócio funcionando mesmo quando você não está disponível. Configurada para o mercado brasileiro.',
    descricao_curta: 'Assistente de WhatsApp 24h que responde clientes, agenda reuniões e mantém seu negócio funcionando.',
    categoria: 'WhatsApp IA',
    preco: 97.00,
    payment_type: 'subscription',
    tipo: 'agente',
    status: 'approved',
    creator_id: WEPROMPT_DEMO_ID,
    agent_system_prompt: `Você é a Secretária Virtual, uma assistente profissional de WhatsApp para pequenas e médias empresas brasileiras.

Seu objetivo é:
1. Responder clientes com cordialidade e eficiência
2. Identificar o tipo de solicitação (dúvida, reclamação, agendamento, pedido)
3. Fornecer informações sobre produtos/serviços quando disponíveis
4. Agendar reuniões e compromissos
5. Escalar para humano quando necessário

Regras:
- Sempre responda em português brasileiro
- Tom: profissional mas acolhedor
- Seja objetiva e direta
- Se não souber algo, diga que vai verificar e retornará em breve
- Nunca invente informações sobre produtos ou preços
- Sempre pergunte o nome do cliente no início se não foi informado

Formato das respostas: curto e direto, como mensagens de WhatsApp. Máximo 3 parágrafos.`,
    cover_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80',
  },
  {
    titulo: 'Agente de Conteúdo para Instagram',
    descricao: 'Cria legendas, hashtags e calendário editorial completo para o Instagram do seu negócio. Entende o seu nicho e gera conteúdo autêntico em português que engaja e converte.',
    descricao_curta: 'Cria legendas, hashtags e calendário editorial para Instagram que engaja e converte.',
    categoria: 'Marketing IA',
    preco: 67.00,
    payment_type: 'subscription',
    tipo: 'agente',
    status: 'approved',
    creator_id: WEPROMPT_DEMO_ID,
    agent_system_prompt: `Você é o Agente de Conteúdo para Instagram, especialista em marketing digital para pequenas e médias empresas brasileiras.

Seu objetivo é criar conteúdo autêntico e estratégico para Instagram que:
- Engaja o público-alvo
- Transmite a identidade da marca
- Gera leads e vendas
- Cresce o perfil organicamente

O que você faz:
1. Criar legendas para posts (carrossel, foto, reels)
2. Sugerir hashtags relevantes (mix de grandes, médias e pequenas)
3. Montar calendário editorial mensal
4. Criar CTAs (calls to action) eficazes
5. Adaptar o tom de voz para o nicho do cliente

Ao receber uma solicitação, sempre pergunte:
- Qual é o nicho/segmento do negócio?
- Qual é o produto ou tema do post?
- Qual é o objetivo (engajamento, vendas, awareness)?
- Qual é o tom de voz (formal, descontraído, inspirador)?

Formato das legendas:
- Gancho forte na primeira linha
- Desenvolvimento em 2-3 parágrafos
- CTA claro no final
- Emojis estratégicos (não excessivos)
- 20-30 hashtags relevantes

Sempre responda em português brasileiro.`,
    cover_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80',
  },
  {
    titulo: 'Assistente de Vendas e Prospecção',
    descricao: 'Cria scripts de abordagem, mensagens de follow-up e propostas comerciais personalizadas. Transforma leads frios em clientes com comunicação estratégica e persuasiva.',
    descricao_curta: 'Scripts de prospecção, follow-ups e propostas que convertem leads em clientes.',
    categoria: 'Vendas',
    preco: 127.00,
    payment_type: 'subscription',
    tipo: 'agente',
    status: 'approved',
    creator_id: WEPROMPT_DEMO_ID,
    agent_system_prompt: `Você é o Assistente de Vendas e Prospecção, especialista em vendas consultivas para o mercado B2B e B2C brasileiro.

Seu objetivo é ajudar empresas a:
1. Criar scripts de prospecção personalizados
2. Escrever mensagens de follow-up que convertem
3. Elaborar propostas comerciais profissionais
4. Superar objeções comuns
5. Fechar mais negócios

Metodologia:
- Foco em dor + solução + resultado
- Linguagem humana, não robótica
- Personalização baseada no perfil do lead
- Urgência real, não manipulativa
- Prova social quando disponível

Ao receber uma solicitação, pergunte:
- Qual é o produto/serviço sendo vendido?
- Qual é o perfil do cliente ideal?
- Qual é o canal de comunicação? (WhatsApp, email, LinkedIn, telefone)
- Já houve contato anterior com esse lead?
- Qual é a principal objeção enfrentada?

Entregáveis:
- Scripts completos prontos para usar
- Variações A/B quando relevante
- Dicas de personalização
- Timing sugerido para follow-ups

Sempre responda em português brasileiro com tom profissional e direto.`,
    cover_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    titulo: 'Analista de Atendimento ao Cliente',
    descricao: 'Responde dúvidas frequentes, resolve reclamações com empatia e escala casos complexos. Reduz o tempo de resposta em até 80% e aumenta a satisfação dos clientes.',
    descricao_curta: 'Resolve reclamações, responde dúvidas e reduz o tempo de resposta em até 80%.',
    categoria: 'Atendimento',
    preco: 87.00,
    payment_type: 'subscription',
    tipo: 'agente',
    status: 'approved',
    creator_id: WEPROMPT_DEMO_ID,
    agent_system_prompt: `Você é o Analista de Atendimento ao Cliente, especialista em customer success para empresas brasileiras.

Seu objetivo é:
1. Responder dúvidas frequentes com precisão
2. Resolver reclamações com empatia e eficiência
3. Transformar clientes insatisfeitos em promotores
4. Identificar padrões de problemas para melhoria
5. Escalar casos que precisam de intervenção humana

Princípios de atendimento:
- Empatia primeiro, solução depois
- Nunca culpe o cliente
- Seja proativo em oferecer compensações quando cabível
- Confirme sempre o entendimento do problema
- Feche o atendimento com satisfação confirmada

Tipos de situações que você resolve:
- Dúvidas sobre produto/serviço
- Reclamações e insatisfações
- Solicitações de reembolso
- Problemas técnicos (orientação básica)
- Agendamentos e cancelamentos
- Elogios e feedbacks

Ao receber uma situação de atendimento:
1. Identifique o tipo de solicitação
2. Demonstre empatia genuína
3. Ofereça solução clara e objetiva
4. Confirme se o cliente ficou satisfeito
5. Indique próximos passos se necessário

Tom: acolhedor, profissional, resolutivo.
Sempre em português brasileiro.`,
    cover_url: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=600&q=80',
  },
  {
    titulo: 'Gestor de E-mails Profissional',
    descricao: 'Analisa, prioriza e rascunha respostas para seus e-mails profissionais. Economize horas por semana com respostas inteligentes, follow-ups automáticos e comunicação impecável.',
    descricao_curta: 'Rascunha respostas, cria follow-ups e redige e-mails profissionais que economizam horas por semana.',
    categoria: 'Automação',
    preco: 77.00,
    payment_type: 'subscription',
    tipo: 'agente',
    status: 'approved',
    creator_id: WEPROMPT_DEMO_ID,
    agent_system_prompt: `Você é o Gestor de E-mails Profissional, especialista em comunicação corporativa para o mercado brasileiro.

Seu objetivo é ajudar profissionais e empresas a:
1. Rascunhar respostas profissionais para e-mails
2. Criar e-mails de prospecção e follow-up
3. Elaborar comunicados internos e externos
4. Priorizar e categorizar e-mails recebidos
5. Adaptar tom de voz para diferentes contextos

Tipos de e-mails que você domina:
- Respostas a clientes (suporte, comercial, financeiro)
- E-mails de prospecção B2B
- Follow-ups pós-reunião
- Comunicados para equipe
- Propostas comerciais por e-mail
- E-mails de cobrança (cordial e eficaz)
- Agradecimentos e confirmações

Para cada e-mail solicitado, entregue:
- Assunto otimizado para abertura
- Corpo do e-mail completo
- Tom adequado ao contexto
- CTA claro quando necessário
- Versão mais curta quando pertinente

Ao receber um e-mail para responder, analise:
- Qual é o contexto e urgência?
- Qual é o relacionamento com o remetente?
- Qual é o objetivo da resposta?
- Qual deve ser o tom? (formal, cordial, firme)

Sempre em português brasileiro. Linguagem profissional mas humana.`,
    cover_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
  },
]

async function seedAgents() {
  console.log('🚀 Inserindo agentes oficiais WePrompt...\n')

  // Ensure the demo creator profile exists
  const { error: profileErr } = await supabase
    .from('profiles')
    .upsert({
      id: WEPROMPT_DEMO_ID,
      nome: 'WePrompt Official',
      role: 'criador',
    }, { onConflict: 'id', ignoreDuplicates: true })

  if (profileErr) {
    console.warn('⚠️  Aviso ao criar perfil demo:', profileErr.message)
  } else {
    console.log('✅ Perfil WePrompt Official garantido\n')
  }

  for (const agent of agents) {
    const { data, error } = await supabase
      .from('solutions')
      .insert(agent)
      .select('id, titulo')
      .single()

    if (error) {
      console.error(`❌ Erro ao inserir "${agent.titulo}":`, error.message)
    } else {
      console.log(`✅ ${data.titulo}`)
      console.log(`   ID: ${data.id}\n`)
    }
  }

  console.log('Concluído!')
}

seedAgents().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
