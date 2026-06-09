# Next.js 14 Patterns — WePrompt

## Regras de arquivo
- SEMPRE `.js` — NUNCA `.ts` ou `.tsx`
- SEMPRE `'use client'` em componentes com hooks (`useState`, `useEffect`, `useRouter`, etc.) ou event handlers
- Server Components (sem 'use client'): apenas para páginas estáticas sem interatividade

## Estado e storage
- NUNCA `localStorage` ou `sessionStorage` — causa hydration mismatch
- NUNCA `window.*` diretamente em render — envolva em `useEffect` ou verifique `typeof window !== 'undefined'`
- Estado de UI: `useState`
- Estado de servidor/autenticação: buscar via Supabase em `useEffect` com `getSession()`

## Animações
- NUNCA `framer-motion` — causa lentidão e bundle desnecessário
- SEMPRE CSS animations via `@keyframes` em bloco `<style>`:
  ```js
  <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
  ```
- Transitions: `transition: "all 0.2s ease"` inline

## Imagens
- `loading="lazy"` em TODAS as imagens abaixo do fold
- `loading="eager"` apenas para imagens above-the-fold críticas (hero, logo)
- Sempre `alt` descritivo
- `objectFit: "cover"` em imagens com dimensão fixa

## Imports dinâmicos
Para componentes pesados que não precisam de SSR:
```js
import dynamic from 'next/dynamic'
const HeavyChart = dynamic(() => import('../components/HeavyChart'), { ssr: false })
```

## Roteamento
- `useRouter()` de `next/navigation` (App Router)
- `router.push()` para navegação programática
- `router.replace()` para redirects (sem voltar no histórico)
- `<Link href>` para links estáticos no JSX

## API Routes
- Arquivo: `app/api/[rota]/route.js`
- Export named: `export async function GET(request) {}` / `POST` / `PUT` / `DELETE`
- Retorno: `NextResponse.json(data, { status: 200 })`
- SEMPRE verificar auth antes de qualquer operação

## Build e deploy
- Build confirmado (`npm run build`) antes de qualquer commit de feature
- Uma feature por commit — commits atômicos e descritivos
- Commits sempre em inglês
- Mensagem formato: `feat:`, `fix:`, `refactor:`, `docs:`
- Plan Mode obrigatório antes de feature nova significativa

## Estrutura de componentes
- Componentes compartilhados: `app/components/`
- Componentes de página: junto com o arquivo de página
- NUNCA criar componentes `.tsx` — sempre `.js`
- `'use client'` sempre na primeira linha quando necessário

## Performance
- `Promise.all()` para queries paralelas no `useEffect`
- Skeleton states com CSS animation para loading
- `limit()` em queries Supabase — nunca buscar tudo sem paginação
- Evitar re-renders desnecessários: `useCallback` em handlers passados como props
