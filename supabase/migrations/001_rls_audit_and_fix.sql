-- =============================================================
-- WEPROMPT — RLS AUDIT & FIX
-- Execute no Supabase SQL Editor (painel web do projeto)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- PASSO 1: VERIFICAR STATUS DE RLS EM TODAS AS TABELAS
-- Execute primeiro para ver o estado atual.
-- Todas as linhas devem ter rowsecurity = true.
-- ─────────────────────────────────────────────────────────────

SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;


-- ─────────────────────────────────────────────────────────────
-- PASSO 2: VERIFICAR POLICIES EXISTENTES NA TABELA solutions
-- ─────────────────────────────────────────────────────────────

SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'solutions'
ORDER BY cmd, policyname;


-- ─────────────────────────────────────────────────────────────
-- PASSO 3: HABILITAR RLS EM TODAS AS TABELAS (se não estiver)
-- Execute apenas as linhas das tabelas que têm rls_enabled = false
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
-- categories pode ser pública (leitura) se não tiver dados sensíveis:
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────
-- PASSO 4: POLICIES PARA solutions
-- Regra: select público apenas para approved+ativo,
--        SEM system_prompt/agent_system_prompt/conteudo_pack
-- ─────────────────────────────────────────────────────────────

-- Leitura pública das soluções aprovadas (catálogo)
-- A proteção de colunas sensíveis é feita na aplicação (select explícito).
-- RLS garante que apenas approved+ativo apareçam para anon/authenticated.
DROP POLICY IF EXISTS "Public read approved solutions" ON public.solutions;
CREATE POLICY "Public read approved solutions"
  ON public.solutions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' AND ativo = true);

-- Criadores podem ver todas as suas próprias soluções (qualquer status)
DROP POLICY IF EXISTS "Creators read own solutions" ON public.solutions;
CREATE POLICY "Creators read own solutions"
  ON public.solutions
  FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

-- Criadores podem inserir soluções (status forçado para pending na app)
DROP POLICY IF EXISTS "Creators insert solutions" ON public.solutions;
CREATE POLICY "Creators insert solutions"
  ON public.solutions
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Criadores podem atualizar suas próprias soluções (não o status)
DROP POLICY IF EXISTS "Creators update own solutions" ON public.solutions;
CREATE POLICY "Creators update own solutions"
  ON public.solutions
  FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- NOTA: approve/reject é feito pelo service_role (API route admin)
-- que bypassa RLS — sem necessidade de policy para admin aqui.


-- ─────────────────────────────────────────────────────────────
-- PASSO 5: POLICIES PARA subscriptions
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users read own subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

-- Insert e update via service_role (webhook Stripe) — sem policy necessária


-- ─────────────────────────────────────────────────────────────
-- PASSO 6: POLICIES PARA profiles
-- ─────────────────────────────────────────────────────────────

-- Perfis públicos (nome, bio) — leitura para authenticated
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Usuário atualiza apenas o próprio perfil
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ─────────────────────────────────────────────────────────────
-- PASSO 7: POLICIES PARA workspace_sessions
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users manage own sessions" ON public.workspace_sessions;
CREATE POLICY "Users manage own sessions"
  ON public.workspace_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ─────────────────────────────────────────────────────────────
-- PASSO 8: POLICIES PARA notifications
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- update (marcar como lido) via service_role na API


-- ─────────────────────────────────────────────────────────────
-- PASSO 9: POLICIES PARA reviews
-- ─────────────────────────────────────────────────────────────

-- Leitura pública de reviews
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert via service_role (API route valida subscription antes)


-- ─────────────────────────────────────────────────────────────
-- PASSO 10: POLICIES PARA categories (leitura pública)
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─────────────────────────────────────────────────────────────
-- VERIFICAÇÃO FINAL — execute após aplicar tudo
-- ─────────────────────────────────────────────────────────────

SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
