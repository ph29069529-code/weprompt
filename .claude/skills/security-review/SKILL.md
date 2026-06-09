# Security Review — WePrompt Checklist

## Autenticação em API Routes
Toda rota de API DEVE verificar autenticação com `getUser()` antes de qualquer operação:

```js
// Correto
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

// Errado — getSession() pode ser spoofed
const { data: { session } } = await supabase.auth.getSession()
```

## Verificação de Role Admin
Dashboard admin e rotas admin DEVEM verificar `role === 'admin'` no servidor:

```js
const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single()
if (!prof || prof.role !== "admin") return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
```

## System Prompt protegido
- `system_prompt` e `conteudo_pack` NUNCA devem ser expostos ao cliente antes da compra
- API de workspace deve verificar subscription ativa antes de usar system_prompt
- Em queries públicas (catálogo), NUNCA incluir `system_prompt` no SELECT

## Preços do banco, nunca do cliente
```js
// Correto — preço vem do banco via solution_id
const { data: sol } = await supabase.from("solutions").select("preco").eq("id", solutionId).single()
const price = sol.preco

// Errado — nunca confiar em preço enviado pelo client
const price = req.body.price
```

## Validação de inputs
- Validar tipo e formato antes de inserir no banco
- Strings: `.trim()`, checar comprimento mínimo/máximo
- Números: `Number()` + checar `isNaN` e limites
- UUIDs: validar formato antes de usar em queries
- URLs: validar formato antes de salvar

## Stripe Webhook
- SEMPRE verificar assinatura: `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`
- NUNCA processar evento sem verificação de assinatura
- Usar `raw body` (não parsed) para verificação

## Variáveis de ambiente sensíveis
- `SUPABASE_SERVICE_ROLE_KEY`: apenas no servidor, NUNCA em `NEXT_PUBLIC_`
- `STRIPE_SECRET_KEY`: apenas no servidor
- `ANTHROPIC_API_KEY`: apenas no servidor
- `RESEND_API_KEY`: apenas no servidor
- Apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` podem ir ao cliente

## RLS
- RLS ativa em TODAS as tabelas com dados de usuário
- Policies: usuário só acessa seus próprios dados
- Verificar que SELECT público do catálogo não expõe system_prompt

## Logs
- NUNCA logar tokens de autenticação
- NUNCA logar dados de cartão ou pagamento
- NUNCA logar system_prompts dos criadores
- `console.log` de debug deve ser removido antes do deploy

## Checklist pré-deploy
- [ ] Rotas de API têm `getUser()` antes de qualquer operação
- [ ] Admin routes verificam `role === 'admin'`
- [ ] `system_prompt` não exposto sem compra ativa
- [ ] Preços vêm do banco, não do cliente
- [ ] Webhook Stripe verifica assinatura
- [ ] Nenhuma key sensível em `NEXT_PUBLIC_`
- [ ] Inputs validados antes do banco
- [ ] RLS ativa nas tabelas afetadas
