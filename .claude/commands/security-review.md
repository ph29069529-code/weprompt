Faça uma revisão completa de segurança do projeto WePrompt.

Verifique:
1. Autenticação — todas as rotas protegidas exigem sessão válida?
2. RLS policies no Supabase — todas as tabelas têm policies corretas?
3. API routes — estão validando o usuário antes de executar?
4. Variáveis de ambiente — alguma chave exposta no frontend?
5. Inputs do usuário — estão sendo sanitizados?
6. ANTHROPIC_API_KEY — está sendo usada apenas no servidor?
7. SUPABASE_SERVICE_ROLE_KEY — está sendo usada apenas no servidor?

Reporte cada problema encontrado com: arquivo, linha, descrição do risco e sugestão de correção.
