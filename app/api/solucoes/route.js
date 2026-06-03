import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('solutions')
    .insert({
      creator_id: user.id,
      titulo: body.nome,
      descricao: body.descricao,
      descricao_curta: body.descricao_curta,
      categoria: body.categoria,
      preco: Number(body.preco),
      payment_type: body.payment_type || 'subscription',
      cover_url: body.cover_url,
      delivery_type: body.delivery_type || 'external_link',
      access_url: body.access_url,
      requirements: body.requirements,
      support_channel: body.support_channel,
      demo_url: body.demo_url,
      agent_system_prompt: body.agent_system_prompt,
      status: body.status || 'pending'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, solution: data })
}
