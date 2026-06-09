# Supabase Patterns — WePrompt

## Email dos usuários
- Email está em `auth.users`, NUNCA na tabela `profiles`
- Para buscar email junto com profile: usar RPC `get_users_with_email()`
- NUNCA adicionar coluna `email` em `profiles`

```js
// Correto
const { data } = await supabase.rpc("get_users_with_email").order("created_at", { ascending: false });

// Errado
const { data } = await supabase.from("profiles").select("email"); // email não existe aqui
```

## Subscriptions
- Filtrar SEMPRE por `business_id`, nunca por `user_id`
- `business_id` é o ID da empresa (role === 'empresa')

```js
// Correto
.from("subscriptions").select("*").eq("business_id", session.user.id)

// Errado
.from("subscriptions").select("*").eq("user_id", session.user.id)
```

## Clients
- Componente client-side: `createClientComponentClient()` de `@supabase/auth-helpers-nextjs`
- Route Handler (API): `createRouteHandlerClient({ cookies })` de `@supabase/auth-helpers-nextjs`
- Server Component: `createServerComponentClient({ cookies })` de `@supabase/auth-helpers-nextjs`
- Alternativa simplificada no projeto: `import { supabase } from "@/app/lib/supabase"`

## Queries
- Usar `.single()` quando espera exatamente um resultado (lança erro se não encontrar)
- Usar `.maybeSingle()` quando o resultado pode ser null (retorna null sem erro)
- Sempre fazer `SELECT` apenas das colunas necessárias — evitar `select("*")` em tabelas grandes
- Ordenar com `.order("created_at", { ascending: false })` como padrão

## RLS Policies
- Antes de criar: verificar se já existe com:
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'nome_da_tabela';
  ```
- NUNCA criar duplicata — causa erros silenciosos
- RLS deve estar ativa em todas as tabelas: `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`

## Schema das tabelas principais
- `profiles`: id, nome, role (admin/criador/empresa), cidade, bio, avatar_url, created_at
- `solutions`: id, titulo, descricao, descricao_curta, categoria, preco, tipo (agente/prompt_pack/agente_integracao), status (pending/approved/rejected), creator_id, system_prompt, conteudo_pack, imagem_capa, como_funciona, video_demo, video_tutorial, video_curadoria, apps_integrados, ferramenta_automacao, instrucoes_configuracao, requisitos_tecnicos, ativo, cover_url, payment_type
- `subscriptions`: id, business_id, solution_id, status (active), created_at
- `reviews`: id, reviewer_id, creator_id, solution_id, rating, comment, created_at
- `workspace_sessions`: id, user_id, solution_id, messages (JSONB), created_at, updated_at

## ALTER TABLE seguro
```sql
-- Verificar constraints antes de alterar tipo/valores
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'solutions'::regclass;

-- Adicionar coluna com segurança
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS nova_coluna text;
```

## Performance
- Usar índices em colunas frequentemente filtradas: `status`, `creator_id`, `business_id`, `solution_id`
- JSONB para dados flexíveis (`messages` no workspace_sessions)
- `text` para strings simples
- `limit()` sempre que não precisa de todos os registros
