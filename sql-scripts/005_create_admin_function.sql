-- ===================================
-- 005 - FUNÇÃO PARA COMPLETAR PERFIS DE USUÁRIOS (V2)
-- Data: 26/01/2025
-- Versão: 2.0 (Simplificada para Supabase)
-- Ordem: EXECUTAR QUINTO (após 004)
-- Descrição: Funções para completar perfis de usuários já criados pelo Supabase Auth
-- ===================================

-- IMPORTANTE: Execute apenas APÓS o script 004_initial_data.sql

-- NOTA IMPORTANTE:
-- Este script não cria usuários no auth.users do Supabase.
-- Os usuários devem ser criados via:
-- 1. Interface de registro da aplicação
-- 2. Supabase Dashboard > Authentication > Users
-- 3. API do Supabase Auth
-- 
-- As funções aqui servem para COMPLETAR o perfil após o usuário ser criado

-- 1. FUNÇÃO PARA COMPLETAR PERFIL ADMINISTRATIVO
-- ===================================

CREATE OR REPLACE FUNCTION public.complete_admin_profile(
    p_user_id UUID,
    p_name VARCHAR,
    p_role VARCHAR DEFAULT 'admin',
    p_department_name VARCHAR DEFAULT NULL,
    p_position VARCHAR DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL,
    p_permissions JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    dept_id UUID;
    user_email VARCHAR;
    perm JSONB;
    result JSONB;
BEGIN
    -- Verificar se o usuário existe no auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = p_user_id;
    
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado no sistema de autenticação: %', p_user_id;
    END IF;
    
    -- Validar entrada
    IF p_name IS NULL OR p_name = '' THEN
        RAISE EXCEPTION 'Nome é obrigatório';
    END IF;
    
    -- Validar role
    IF p_role NOT IN ('prefeito', 'admin') THEN
        RAISE EXCEPTION 'Role deve ser prefeito ou admin';
    END IF;
    
    -- Buscar department_id se fornecido
    IF p_department_name IS NOT NULL THEN
        SELECT id INTO dept_id 
        FROM public.departments 
        WHERE name = p_department_name AND is_active = true;
        
        IF dept_id IS NULL THEN
            RAISE EXCEPTION 'Departamento não encontrado ou inativo: %', p_department_name;
        END IF;
    END IF;
    
    -- Criar ou atualizar perfil administrativo
    INSERT INTO public.admin_users (
        id,
        email,
        name,
        role,
        department_id,
        position,
        phone,
        is_active
    ) VALUES (
        p_user_id,
        user_email,
        p_name,
        p_role,
        dept_id,
        p_position,
        p_phone,
        true
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        department_id = EXCLUDED.department_id,
        position = EXCLUDED.position,
        phone = EXCLUDED.phone,
        updated_at = NOW();
    
    -- Limpar permissões existentes se for admin
    IF p_role = 'admin' THEN
        DELETE FROM public.admin_permissions WHERE admin_id = p_user_id;
        
        -- Adicionar novas permissões se fornecidas
        IF jsonb_array_length(p_permissions) > 0 THEN
            FOR perm IN SELECT * FROM jsonb_array_elements(p_permissions)
            LOOP
                -- Verificar se o módulo existe
                IF NOT EXISTS (SELECT 1 FROM public.system_modules WHERE id = perm->>'module_id') THEN
                    RAISE EXCEPTION 'Módulo não encontrado: %', perm->>'module_id';
                END IF;
                
                INSERT INTO public.admin_permissions (
                    admin_id,
                    module_id,
                    create_permission,
                    read_permission,
                    update_permission,
                    delete_permission
                ) VALUES (
                    p_user_id,
                    perm->>'module_id',
                    COALESCE((perm->>'create')::boolean, false),
                    COALESCE((perm->>'read')::boolean, false),
                    COALESCE((perm->>'update')::boolean, false),
                    COALESCE((perm->>'delete')::boolean, false)
                );
            END LOOP;
        END IF;
    END IF;
    
    -- Log da operação
    PERFORM public.log_admin_operation(
        'complete_admin_profile',
        p_user_id,
        jsonb_build_object(
            'email', user_email,
            'name', p_name,
            'role', p_role,
            'department', p_department_name,
            'position', p_position
        )
    );
    
    -- Preparar resultado
    result := jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'email', user_email,
        'name', p_name,
        'role', p_role,
        'department', p_department_name,
        'message', 'Perfil administrativo completado com sucesso'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, retornar detalhes
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Erro ao completar perfil administrativo: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.complete_admin_profile IS 'Completa perfil administrativo de usuário já criado no Supabase Auth';

-- 2. FUNÇÃO PARA COMPLETAR PERFIL DE CIDADÃO
-- ===================================

CREATE OR REPLACE FUNCTION public.complete_citizen_profile(
    p_user_id UUID,
    p_name VARCHAR,
    p_cpf VARCHAR,
    p_phone VARCHAR DEFAULT NULL,
    p_street VARCHAR DEFAULT NULL,
    p_number VARCHAR DEFAULT NULL,
    p_complement VARCHAR DEFAULT NULL,
    p_neighborhood VARCHAR DEFAULT NULL,
    p_city VARCHAR DEFAULT 'Seu Município',
    p_state VARCHAR DEFAULT 'XX',
    p_zip_code VARCHAR DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    user_email VARCHAR;
    clean_cpf VARCHAR;
    result JSONB;
BEGIN
    -- Verificar se o usuário existe no auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = p_user_id;
    
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado no sistema de autenticação: %', p_user_id;
    END IF;
    
    -- Validar entrada
    IF p_name IS NULL OR p_name = '' THEN
        RAISE EXCEPTION 'Nome é obrigatório';
    END IF;
    
    IF p_cpf IS NULL OR p_cpf = '' THEN
        RAISE EXCEPTION 'CPF é obrigatório';
    END IF;
    
    -- Limpar e validar CPF
    clean_cpf := regexp_replace(p_cpf, '[^0-9]', '', 'g');
    
    IF NOT public.validate_cpf(clean_cpf) THEN
        RAISE EXCEPTION 'CPF inválido: %', p_cpf;
    END IF;
    
    -- Verificar se CPF já existe (exceto para o próprio usuário)
    IF EXISTS (
        SELECT 1 FROM public.citizen_users 
        WHERE cpf = clean_cpf AND id != p_user_id
    ) THEN
        RAISE EXCEPTION 'CPF já está cadastrado: %', p_cpf;
    END IF;
    
    -- Criar ou atualizar perfil de cidadão
    INSERT INTO public.citizen_users (
        id,
        email,
        name,
        cpf,
        phone,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code,
        is_active,
        email_verified
    ) VALUES (
        p_user_id,
        user_email,
        p_name,
        clean_cpf,
        p_phone,
        COALESCE(p_street, ''),
        COALESCE(p_number, ''),
        p_complement,
        COALESCE(p_neighborhood, ''),
        p_city,
        p_state,
        p_zip_code,
        true,
        true -- Assumir verificado se completando perfil
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        cpf = EXCLUDED.cpf,
        phone = EXCLUDED.phone,
        street = EXCLUDED.street,
        number = EXCLUDED.number,
        complement = EXCLUDED.complement,
        neighborhood = EXCLUDED.neighborhood,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        zip_code = EXCLUDED.zip_code,
        updated_at = NOW();
    
    -- Preparar resultado
    result := jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'email', user_email,
        'name', p_name,
        'cpf', clean_cpf,
        'message', 'Perfil de cidadão completado com sucesso'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, retornar detalhes
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Erro ao completar perfil de cidadão: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.complete_citizen_profile IS 'Completa perfil de cidadão de usuário já criado no Supabase Auth';

-- 3. FUNÇÃO PARA ATUALIZAR PERMISSÕES (Mantida do script original)
-- ===================================

CREATE OR REPLACE FUNCTION public.update_admin_permissions(
    p_admin_id UUID,
    p_permissions JSONB
)
RETURNS JSONB AS $$
DECLARE
    perm JSONB;
    result JSONB;
BEGIN
    -- Verificar se o usuário existe e é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = p_admin_id AND role = 'admin' AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Usuário admin não encontrado ou inativo';
    END IF;
    
    -- Verificar se quem está executando tem permissão (deve ser prefeito)
    IF NOT public.is_mayor() THEN
        RAISE EXCEPTION 'Apenas o prefeito pode alterar permissões';
    END IF;
    
    -- Remover permissões existentes
    DELETE FROM public.admin_permissions WHERE admin_id = p_admin_id;
    
    -- Adicionar novas permissões
    IF jsonb_array_length(p_permissions) > 0 THEN
        FOR perm IN SELECT * FROM jsonb_array_elements(p_permissions)
        LOOP
            -- Verificar se o módulo existe
            IF NOT EXISTS (SELECT 1 FROM public.system_modules WHERE id = perm->>'module_id') THEN
                RAISE EXCEPTION 'Módulo não encontrado: %', perm->>'module_id';
            END IF;
            
            INSERT INTO public.admin_permissions (
                admin_id,
                module_id,
                create_permission,
                read_permission,
                update_permission,
                delete_permission
            ) VALUES (
                p_admin_id,
                perm->>'module_id',
                COALESCE((perm->>'create')::boolean, false),
                COALESCE((perm->>'read')::boolean, false),
                COALESCE((perm->>'update')::boolean, false),
                COALESCE((perm->>'delete')::boolean, false)
            );
        END LOOP;
    END IF;
    
    -- Log da operação
    PERFORM public.log_admin_operation(
        'update_permissions',
        p_admin_id,
        jsonb_build_object('permissions', p_permissions)
    );
    
    result := jsonb_build_object(
        'success', true,
        'message', 'Permissões atualizadas com sucesso'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Erro ao atualizar permissões: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_admin_permissions IS 'Atualiza permissões de um usuário admin';

-- 4. VIEW PARA LISTAR USUÁRIOS SEM PERFIL COMPLETO
-- ===================================

CREATE OR REPLACE VIEW public.users_without_profile AS
SELECT 
    au.id,
    au.email,
    au.created_at,
    'admin' as missing_profile_type
FROM auth.users au
LEFT JOIN public.admin_users adu ON au.id = adu.id
LEFT JOIN public.citizen_users cu ON au.id = cu.id
WHERE adu.id IS NULL 
  AND cu.id IS NULL
  AND au.email_confirmed_at IS NOT NULL;

COMMENT ON VIEW public.users_without_profile IS 'Lista usuários autenticados que ainda não têm perfil completo';

-- ===================================
-- SCRIPT 005 V2 CONCLUÍDO
-- 
-- COMO USAR:
-- 1. Crie usuários pelo Supabase Dashboard > Authentication > Users
-- 2. Use complete_admin_profile() para completar perfil de admins
-- 3. Use complete_citizen_profile() para completar perfil de cidadãos
-- 4. Use a view users_without_profile para ver quem precisa completar perfil
-- 
-- PRÓXIMO: Execute o script 006_create_first_users_v2.sql
-- ===================================