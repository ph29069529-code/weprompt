# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build (run before every commit)
npm run start    # Start production server
npm run lint     # ESLint check
```

No test runner is configured. Validation is done via `npm run build` — a clean build is the gate before committing.

## Stack

- **Framework**: Next.js 16 with App Router — all files are `.js`, never `.ts`/`.tsx`
- **Database**: Supabase (PostgreSQL, São Paulo region)
- **Auth**: Supabase Auth via `@supabase/auth-helpers-nextjs`
- **Payments**: Stripe (subscription + one-time)
- **Email**: Resend (`contato@weprompt.app.br`)
- **AI**: Anthropic SDK (`claude-sonnet-4-5` in workspace chat)
- **Deploy**: Vercel

## Architecture

### App structure
- `app/page.js` — Homepage (all sections inline: `HowItWorks`, `ForCompanies`, `ForCreators`, `Categories`)
- `app/layout.js` — Root layout: loads Inter font, injects `FooterController`, `PWAInstallPrompt`, `GlobalDrawers`
- `app/components/` — Shared components used across pages
- `app/lib/` — `supabase.js`, `stripe.js`, `resend.js`, `email.js`
- `app/api/` — Route handlers (Next.js App Router)
- `app/dashboard/` — Three role-based dashboards: `admin/`, `criador/`, `empresa/`

### Routing and layout controllers
`FooterController` and `NavbarController` check `usePathname()` and suppress their component on dashboard/checkout/auth routes. `GlobalDrawers` is always present for app-wide modals. These controllers belong in `layout.js` and should not be added to individual pages.

### Homepage component pattern
Homepage sections live directly in `app/page.js`. Heavy components (`SolutionsShowcase`) are lazy-loaded with `dynamic(() => import(...), { ssr: false })`. Intersection-observer animations use the local `useFadeIn(dir)` hook — it returns `[ref, style]` and requires no external library.

### Supabase client usage
- **Client components**: `import { supabase } from "@/app/lib/supabase"` (simple client, no cookies)
- **Route handlers that need user JWT**: pass `Authorization` header and instantiate with `createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })`, then call `supabase.auth.getUser()`
- **Route handlers needing service-role access** (e.g., workspace chat): `createClient(url, SUPABASE_SERVICE_ROLE_KEY)` + `supabaseAdmin.auth.getUser(token)`
- **Never**: use `getSession()` for auth verification in API routes — always `getUser()`

### API routes pattern
Every route handler verifies auth before any DB operation. Route files are in `app/api/<name>/route.js`, exported as named async functions (`GET`, `POST`, etc.), and return `NextResponse.json()`.

## Database schema

Tables in Supabase:

| Table | Key columns |
|---|---|
| `profiles` | `id` (= auth.users id), `nome`, `role` (admin/criador/empresa), `bio`, `avatar_url`, `cidade`, `created_at` — confirmed schema; `telefone` does NOT exist |
| `solutions` | `id`, `titulo`, `descricao`, `descricao_curta`, `categoria`, `preco`, `tipo` (agente/prompt_pack/agente_integracao), `status` (pending/approved/rejected), `creator_id`, `system_prompt`, `conteudo_pack`, `cover_url`, `como_funciona`, `video_demo`, `video_tutorial`, `video_curadoria`, `apps_integrados`, `ferramenta_automacao`, `instrucoes_configuracao`, `requisitos_tecnicos`, `ativo`, `payment_type` |
| `subscriptions` | `id`, `business_id` (empresa user), `solution_id`, `status` (active) |
| `reviews` | `id`, `reviewer_id`, `creator_id`, `solution_id`, `rating`, `comment` |
| `workspace_sessions` | `id`, `user_id`, `solution_id`, `messages` (JSONB array) |
| `categories` | `nome`, `icone`, `cor` |

**Critical rules:**
- Email is in `auth.users`, never in `profiles` — use RPC `get_users_with_email()` when you need it
- Always filter `subscriptions` by `business_id`, not `user_id`
- Always check for existing constraints before `ALTER TABLE`: `SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'table'::regclass`
- Always check for existing RLS policies before creating: `SELECT policyname FROM pg_policies WHERE tablename = 'table'`

## Identidade visual

- Primary: `#6366F1` (indigo) — CTAs, icons, active states
- Dark: `#0A0F1E` — primary buttons, headings
- Background alt: `#F8F9FB`
- Text secondary: `#6B7280`
- Border: `#E5E7EB`
- Logo files: `/logo.png` (dark bg), `/logo-white.png` (light bg), `/logo-icon.png`
- Official WePrompt badge: `creator_id === "00000000-0000-0000-0000-000000000001"`
- Section max-width: `1100px` (content), `1200px` (navbar/footer)

> Note: `PRODUCT.md` in the repo root contains outdated brand specs (`#2563EB`, "no purple"). Ignore it — the actual codebase and `BRAND.md` use `#6366F1`.

## Code rules

- `'use client'` required on any file using hooks or event handlers
- Inline styles only — no Tailwind utility classes, no framer-motion
- CSS animations via `@keyframes` in JSX `<style>` blocks
- Responsive layout: media queries in `<style>` blocks, never `isMobile = useState(window.innerWidth < 768)` (hydration mismatch). Use CSS classes + media queries, or a `useWindowWidth` hook initialized to `1200` and set in `useEffect`.
- `loading="lazy"` on all images below the fold
- All clickable elements: `minHeight: 44` (tap targets)
- Button border-radius: `10px`; card border-radius: `12px`–`20px`
- Commits in English, one feature per commit, build must pass before pushing
- NUNCA usar travessão (—) em nenhum texto da plataforma — substituir sempre por vírgula ou ponto

## Roles and dashboards

| Role | Dashboard | Access |
|---|---|---|
| `admin` | `/dashboard/admin` | Full platform management (11 tabs) |
| `criador` | `/dashboard/criador` | Publish and manage solutions |
| `empresa` | `/dashboard/empresa` | Browse and use purchased solutions |

Auth check pattern in dashboard pages: `supabase.auth.getSession()` → if no session, `router.replace('/login')` → fetch profile → check role.

## Solution types

| `tipo` | Workspace behavior |
|---|---|
| `agente` | Full chat interface powered by `system_prompt` via Anthropic API |
| `prompt_pack` | Content delivery — `conteudo_pack` shown after purchase |
| `agente_integracao` | Setup panel showing `instrucoes_configuracao`, `apps_integrados`, help mailto |

## Skills disponíveis (.claude/skills/)

| Skill | Quando usar |
|---|---|
| `weprompt-design` | Cores, tipografia, botões, cards, badges |
| `mobile-first` | Responsividade, tap targets, media queries |
| `supabase-patterns` | Queries, RLS, schema, migrations |
| `security-review` | API routes, autenticação, env vars |
| `nextjs-patterns` | Arquivos .js, 'use client', build patterns |

## Subagents disponíveis (.claude/agents/)

| Agente | Quando usar |
|---|---|
| `ui-reviewer` | Revisar componentes visuais, responsividade, acessibilidade |
| `security-agent` | API routes, autenticação, RLS, pré-deploy |
| `db-agent` | Queries complexas, migrations, RLS policies |
| `qa-agent` | Testar fluxos críticos antes de deploy |

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # server-only
STRIPE_SECRET_KEY              # server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET          # server-only
RESEND_API_KEY                 # server-only
ANTHROPIC_API_KEY              # server-only
CRON_SECRET                    # server-only — protege /api/cron/* de chamadas não autorizadas
```

## Segurança

### Rate Limiting
`app/lib/rateLimiter.js` — Map em memória com cleanup a cada 5 min.
- `workspace/chat`: 20 req/usuário/hora
- `api/auth/login`: 5 tentativas/IP/15 min
- Em produção Vercel, instâncias quentes compartilham estado; cold starts resetam o Map (best-effort).

### Audit Log
`app/lib/auditLog.js` — Função `logAction()` grava na tabela `audit_logs` via service-role.
Nunca lança erro. Actions registradas: `login`, `logout`, `purchase_initiated`, `workspace_access`,
`solution_approved`, `solution_rejected`, `profile_updated`, `rate_limit_hit`.

### Cron Jobs (Vercel — `vercel.json`)
| Rota | Horário | Função |
|---|---|---|
| `/api/cron/security-check` | 08:00 BRT (11:00 UTC) | Detecta anomalias nas últimas 24h e envia email |
| `/api/cron/backup-check`   | 09:00 BRT (12:00 UTC) | Verifica conectividade e conta registros nas tabelas críticas |

Ambas as rotas exigem header `Authorization: Bearer $CRON_SECRET`. Na Vercel, isso é injetado automaticamente.

### Política de Backup (Supabase)
- **Free tier**: backup diário automático com retenção de 7 dias.
- **Pro tier**: Point-in-Time Recovery (PITR) com retenção de 30 dias.
- Para verificar status de backup: `app.supabase.com > Project > Database > Backups`
- O cron `backup-check` valida conectividade diariamente e alerta via email se o banco estiver inacessível.
- Nunca dependa apenas do backup do Supabase — considere exportar `pg_dump` semanalmente para S3/GCS em produção crítica.
