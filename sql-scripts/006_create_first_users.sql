-- ===================================
-- 006 - INSTRUÇÕES PARA CRIAR PRIMEIROS USUÁRIOS (V2)
-- Data: 26/01/2025
-- Versão: 2.0 (Adaptado para Supabase)
-- Ordem: EXECUTAR SEXTO (após 005)
-- Descrição: Instruções e exemplos para criar primeiros usuários
-- ===================================

-- IMPORTANTE: Execute apenas APÓS o script 005_create_admin_function_v2.sql

-- ===================================
-- INSTRUÇÕES IMPORTANTES
-- ===================================

/*
COMO CRIAR USUÁRIOS NO SUPABASE:

1. MÉTODO RECOMENDADO - Via Supabase Dashboard:
   - Acesse: https://app.supabase.com
   - Vá em Authentication > Users
   - Clique em "Add User"
   - Preencha email e senha
   - Defina email_confirmed_at = agora
   - Adicione metadata se necessário

2. MÉTODO ALTERNATIVO - Via SQL (Exemplo):
   - Use a função auth.email() do Supabase
   - Ou integre com a aplicação React

3. COMPLETAR PERFIL:
   - Use as funções complete_admin_profile() ou complete_citizen_profile()
   - Execute após criar o usuário no auth.users
*/

-- ===================================
-- 1. LISTAR USUÁRIOS SEM PERFIL
-- ===================================

-- Ver usuários que precisam completar perfil
SELECT * FROM public.users_without_profile;

-- ===================================
-- 2. EXEMPLO: COMPLETAR PERFIL DE PREFEITO
-- ===================================

-- ⚠️ SUBSTITUA 'UUID_DO_USUARIO' pelo ID real do usuário criado no Dashboard
-- ⚠️ ALTERE os dados conforme necessário

/*
SELECT public.complete_admin_profile(
    p_user_id := 'UUID_DO_USUARIO',                    -- ✏️ ALTERE O UUID
    p_name := 'Nome Completo do Prefeito',             -- ✏️ ALTERE O NOME
    p_role := 'prefeito',
    p_department_name := 'Gabinete',
    p_position := 'Prefeito Municipal',
    p_phone := '(11) 99999-9999'                       -- ✏️ ALTERE O TELEFONE
);
*/

-- ===================================
-- 3. EXEMPLO: COMPLETAR PERFIL DE ADMIN
-- ===================================

-- ⚠️ SUBSTITUA 'UUID_DO_USUARIO' pelo ID real do usuário criado no Dashboard
-- ⚠️ ALTERE os dados conforme necessário

/*
SELECT public.complete_admin_profile(
    p_user_id := 'UUID_DO_USUARIO',                    -- ✏️ ALTERE O UUID
    p_name := 'Nome do Administrador',                 -- ✏️ ALTERE O NOME
    p_role := 'admin',
    p_department_name := 'Administração',
    p_position := 'Administrador do Sistema',
    p_phone := '(11) 88888-8888',                      -- ✏️ ALTERE O TELEFONE
    p_permissions := '[
        {"module_id": "administracao", "create": true, "read": true, "update": true, "delete": false},
        {"module_id": "financas", "create": false, "read": true, "update": false, "delete": false},
        {"module_id": "rh", "create": true, "read": true, "update": true, "delete": false},
        {"module_id": "solicitacoes", "create": false, "read": true, "update": true, "delete": false}
    ]'::jsonb
);
*/

-- ===================================
-- 4. EXEMPLO: COMPLETAR PERFIL DE CIDADÃO
-- ===================================

-- ⚠️ SUBSTITUA 'UUID_DO_USUARIO' pelo ID real do usuário criado no Dashboard
-- ⚠️ ALTERE os dados conforme necessário

/*
SELECT public.complete_citizen_profile(
    p_user_id := 'UUID_DO_USUARIO',                    -- ✏️ ALTERE O UUID
    p_name := 'João da Silva Santos',                  -- ✏️ ALTERE O NOME
    p_cpf := '12345678909',                            -- ✏️ ALTERE O CPF (apenas números)
    p_phone := '(11) 77777-7777',                      -- ✏️ ALTERE O TELEFONE
    p_street := 'Rua das Flores',                      -- ✏️ ALTERE O ENDEREÇO
    p_number := '123',
    p_complement := 'Apto 45',
    p_neighborhood := 'Centro',
    p_city := 'Seu Município',                         -- ✏️ ALTERE O MUNICÍPIO
    p_state := 'SP',                                   -- ✏️ ALTERE O ESTADO
    p_zip_code := '12345678'
);
*/

-- ===================================
-- 5. VERIFICAR USUÁRIOS CRIADOS
-- ===================================

-- Verificar usuários prefeito
SELECT 
    'PREFEITOS:' as tipo,
    au.id,
    au.email,
    au.name,
    au.role,
    d.name as department,
    au.position,
    au.is_active,
    au.created_at
FROM public.admin_users au
LEFT JOIN public.departments d ON au.department_id = d.id
WHERE au.role = 'prefeito'
ORDER BY au.created_at DESC;

-- Verificar usuários admin
SELECT 
    'ADMINS:' as tipo,
    au.id,
    au.email,
    au.name,
    au.role,
    d.name as department,
    au.position,
    COUNT(ap.id) as permissions_count
FROM public.admin_users au
LEFT JOIN public.departments d ON au.department_id = d.id
LEFT JOIN public.admin_permissions ap ON au.id = ap.admin_id
WHERE au.role = 'admin'
GROUP BY au.id, au.email, au.name, au.role, d.name, au.position
ORDER BY au.created_at DESC;

-- Verificar usuários cidadãos
SELECT 
    'CIDADÃOS:' as tipo,
    cu.id,
    cu.email,
    cu.name,
    cu.cpf,
    cu.city,
    cu.is_active,
    cu.email_verified
FROM public.citizen_users cu
ORDER BY cu.created_at DESC;

-- ===================================
-- 6. VERIFICAR AUTH.USERS
-- ===================================

-- Verificar usuários no sistema de autenticação
SELECT 
    'AUTH USERS:' as status,
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data->>'name' as metadata_name,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Email não confirmado'
        ELSE 'Email confirmado'
    END as status_email
FROM auth.users 
ORDER BY created_at DESC;

-- ===================================
-- 7. TESTAR FUNÇÕES DE PERMISSÃO
-- ===================================

-- ⚠️ Substitua 'UUID_DO_PREFEITO' pelo ID real do prefeito

-- Testar se é prefeito
-- SELECT public.is_mayor('UUID_DO_PREFEITO') as is_mayor_test;

-- Testar se é admin
-- SELECT public.is_admin_user('UUID_DO_PREFEITO') as is_admin_test;

-- Testar permissão específica
-- SELECT public.has_permission('administracao', 'create', 'UUID_DO_PREFEITO') as has_permission_test;

-- Listar todas as permissões
-- SELECT * FROM public.get_user_permissions('UUID_DO_PREFEITO');

-- ===================================
-- 8. LOG DAS OPERAÇÕES
-- ===================================

-- Ver últimas operações registradas
SELECT 
    'ÚLTIMAS OPERAÇÕES:' as status,
    aol.operation_type,
    au.name as performed_by,
    aol.details,
    aol.created_at
FROM public.admin_operations_log aol
LEFT JOIN public.admin_users au ON aol.performed_by = au.id
ORDER BY aol.created_at DESC
LIMIT 10;

-- ===================================
-- 9. COMANDOS ÚTEIS PARA MANUTENÇÃO
-- ===================================

-- Confirmar email de um usuário específico
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'usuario@email.com';

-- Ativar/desativar usuário admin
-- UPDATE public.admin_users SET is_active = true WHERE email = 'admin@email.com';

-- Ativar/desativar usuário cidadão
-- UPDATE public.citizen_users SET is_active = true WHERE email = 'cidadao@email.com';

-- Ver usuários sem perfil completo
-- SELECT * FROM public.users_without_profile;

-- ===================================
-- INSTRUÇÕES FINAIS:
-- ===================================

/*
PASSO A PASSO COMPLETO:

1. ✅ Execute todos os scripts SQL anteriores (001 a 005)

2. 🔐 CRIAR USUÁRIO PREFEITO:
   - Vá ao Supabase Dashboard > Authentication > Users
   - Clique "Add User"
   - Email: prefeito@seumunicipio.gov.br
   - Senha: (senha segura)
   - Email Confirmed At: (data atual)
   - Copie o UUID gerado

3. 👤 COMPLETAR PERFIL DO PREFEITO:
   - Descomente o exemplo da seção 2 acima
   - Substitua UUID_DO_USUARIO pelo UUID copiado
   - Altere nome, telefone e outros dados
   - Execute o SQL

4. 🧪 TESTAR LOGIN:
   - Acesse a aplicação React
   - Faça login com email e senha do prefeito
   - Verifique se todas as funcionalidades estão acessíveis

5. 👥 CRIAR OUTROS USUÁRIOS:
   - Repita o processo para admins e cidadãos
   - Use as funções complete_admin_profile() e complete_citizen_profile()
   - Configure permissões conforme necessário

6. ✅ VERIFICAR FUNCIONAMENTO:
   - Execute as queries de verificação acima
   - Teste permissões na aplicação
   - Verifique logs de operações
*/

-- ===================================
-- SCRIPT 006 V2 CONCLUÍDO
-- SETUP DE AUTENTICAÇÃO FINALIZADO! 🎉
-- 
-- Agora você tem:
-- ✅ Estrutura de banco completa
-- ✅ Sistema de permissões funcionando
-- ✅ Funções para gerenciar usuários
-- ✅ Logs de auditoria ativos
-- ✅ Instruções para criar primeiros usuários
-- ===================================