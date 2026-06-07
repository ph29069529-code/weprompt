# WePrompt — Guia do Projeto para Claude Code

## O que é a WePrompt
Marketplace de soluções de IA para o Brasil (Model B — workspace integrado).
Criadores publicam agentes e prompt packs. Empresas compram e usam dentro da plataforma.
Tudo acontece DENTRO da WePrompt — sem links externos.

## Stack Técnica
- Framework: Next.js 14 (App Router, arquivos .js — NUNCA TypeScript)
- Banco de dados: Supabase (PostgreSQL) — região São Paulo
- Pagamentos: Stripe (produção)
- Emails: Resend (contato@weprompt.app.br)
- Deploy: Vercel
- Auth: Supabase Auth com @supabase/auth-helpers-nextjs

## Estrutura de Pastas
app/
  page.js                    # Homepage
  layout.js                  # Layout global
  components/                # Componentes compartilhados
    Navbar.js                # Navbar pública (scroll effect)
    NavbarDashboard.js       # Navbar simplificada (dashboards)
    Footer.js                # Footer animado (páginas públicas)
    FloatingIconsHero.js     # Hero da homepage
  dashboard/
    admin/page.js            # Dashboard admin (11 abas)
    criador/page.js          # Dashboard criador
    empresa/page.js          # Dashboard empresa
    empresa/workspace/[id]/  # Workspace do agente
  solucoes/
    page.js                  # Catálogo público
    [id]/page.js             # Página da solução
  criadores/[id]/page.js     # Perfil público do criador
  api/
    workspace/chat/route.js  # API Anthropic
  lib/
    email.js                 # Funções Resend

## Banco de Dados (Supabase)
- profiles: id, nome, role (admin/criador/empresa), cidade, bio
- solutions: id, titulo, descricao, categoria, preco, tipo (agente/prompt_pack), status (pending/approved/rejected), creator_id, system_prompt, conteudo_pack, imagem_capa
- subscriptions: id, business_id, solution_id, status (active), created_at
- reviews: id, reviewer_id, creator_id, solution_id, rating, comment
- workspace_sessions: id, user_id, solution_id, messages (JSONB)

## Identidade Visual (NUNCA mudar)
- Cor primária: #6366F1 (índigo)
- Cor escura: #0A0F1E
- Fonte: Inter
- Logo: /logo.png (escura), /logo-white.png (clara)
- Ícone: /logo-icon.png, /logo-icon-white.png
- Botões primários: bg #0A0F1E ou #6366F1, borderRadius 10px
- Badge oficial WePrompt: creator_id = 00000000-0000-0000-0000-000000000001

## Roles de Usuário
- admin: acesso total, dashboard em /dashboard/admin
- criador: publica soluções, dashboard em /dashboard/criador
- empresa: compra e usa soluções, dashboard em /dashboard/empresa

## Regras de Código (SEMPRE seguir)
- SEMPRE usar .js, NUNCA .ts ou .tsx
- SEMPRE 'use client' em componentes com hooks
- NUNCA usar localStorage ou sessionStorage
- NUNCA usar framer-motion (causa lentidão — usar CSS animations)
- Imagens: usar loading="lazy" abaixo do fold
- Supabase client: createClientComponentClient() no cliente
- Commits: sempre em inglês, descritivos
- Antes de criar RLS policies: verificar se já existem

## Erros Comuns (NUNCA repetir)
- NÃO usar TypeScript — projeto é 100% JavaScript
- NÃO modificar logo ou identidade visual sem instrução explícita
- NÃO hardcodar dados fictícios — sempre buscar do Supabase
- NÃO criar policies RLS duplicadas
- NÃO usar email como coluna em profiles — email está em auth.users
- Subscriptions: filtrar por business_id, não user_id
- Email dos usuários: usar função RPC get_users_with_email()

## Fluxo de Aprovação de Soluções
1. Criador publica → status = pending
2. Admin aprova/rejeita em /dashboard/admin → aba Solicitações
3. Email automático enviado via Resend ao criador
4. Se aprovada → aparece em /solucoes

## Workspace (Fase 3)
- Empresa compra solução do tipo agente
- Acessa /dashboard/empresa/workspace/[solution_id]
- Chat chama /api/workspace/chat → Anthropic API (claude-sonnet-4-5)
- ANTHROPIC_API_KEY necessária no Vercel
- Sessões salvas em workspace_sessions

## Variáveis de Ambiente
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- ANTHROPIC_API_KEY
