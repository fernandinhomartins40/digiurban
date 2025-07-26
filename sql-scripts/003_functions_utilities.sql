-- ===================================
-- 003 - FUNÇÕES UTILITÁRIAS
-- Data: 26/01/2025
-- Versão: 1.0
-- Ordem: EXECUTAR TERCEIRO (após 002)
-- Descrição: Funções auxiliares para autenticação e permissões
-- ===================================

-- IMPORTANTE: Execute apenas APÓS o script 002_setup_security.sql

-- 1. FUNÇÕES DE VERIFICAÇÃO DE USUÁRIO
-- ===================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND role IN ('prefeito', 'admin') AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin_user IS 'Verifica se o usuário é administrador';

-- Função para verificar se usuário é prefeito
CREATE OR REPLACE FUNCTION public.is_mayor(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND role = 'prefeito' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_mayor IS 'Verifica se o usuário é prefeito';

-- Função para verificar se usuário é cidadão
CREATE OR REPLACE FUNCTION public.is_citizen_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.citizen_users 
        WHERE id = user_id AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_citizen_user IS 'Verifica se o usuário é cidadão';

-- 2. FUNÇÕES DE VERIFICAÇÃO DE PERMISSÕES
-- ===================================

-- Função para verificar permissão específica
CREATE OR REPLACE FUNCTION public.has_permission(
    module_name VARCHAR,
    permission_type VARCHAR,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Prefeito tem todas as permissões
    IF public.is_mayor(user_id) THEN
        RETURN true;
    END IF;
    
    -- Verificar permissão específica
    RETURN EXISTS (
        SELECT 1 FROM public.admin_permissions ap
        JOIN public.admin_users au ON ap.admin_id = au.id
        WHERE ap.admin_id = user_id 
        AND ap.module_id = module_name
        AND au.is_active = true
        AND (
            (permission_type = 'create' AND ap.create_permission = true) OR
            (permission_type = 'read' AND ap.read_permission = true) OR
            (permission_type = 'update' AND ap.update_permission = true) OR
            (permission_type = 'delete' AND ap.delete_permission = true)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.has_permission IS 'Verifica se o usuário tem permissão específica';

-- Função para obter todas as permissões de um usuário
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
    module_id VARCHAR,
    module_name VARCHAR,
    group_name VARCHAR,
    create_permission BOOLEAN,
    read_permission BOOLEAN,
    update_permission BOOLEAN,
    delete_permission BOOLEAN
) AS $$
BEGIN
    -- Se é prefeito, retorna todas as permissões
    IF public.is_mayor(user_id) THEN
        RETURN QUERY
        SELECT 
            sm.id,
            sm.name,
            sm.group_name,
            true,
            true,
            true,
            true
        FROM public.system_modules sm
        WHERE sm.is_active = true;
    ELSE
        -- Retorna apenas as permissões específicas
        RETURN QUERY
        SELECT 
            sm.id,
            sm.name,
            sm.group_name,
            COALESCE(ap.create_permission, false),
            COALESCE(ap.read_permission, false),
            COALESCE(ap.update_permission, false),
            COALESCE(ap.delete_permission, false)
        FROM public.system_modules sm
        LEFT JOIN public.admin_permissions ap ON sm.id = ap.module_id AND ap.admin_id = user_id
        WHERE sm.is_active = true;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_permissions IS 'Retorna todas as permissões do usuário';

-- 3. FUNÇÕES DE LOG
-- ===================================

-- Função para registrar operação no log
CREATE OR REPLACE FUNCTION public.log_admin_operation(
    operation_type VARCHAR,
    target_user_id UUID DEFAULT NULL,
    details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.admin_operations_log (
        performed_by,
        operation_type,
        target_user_id,
        details
    ) VALUES (
        auth.uid(),
        operation_type,
        target_user_id,
        details
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.log_admin_operation IS 'Registra operação administrativa no log';

-- 4. FUNÇÕES DE VALIDAÇÃO
-- ===================================

-- Função para validar CPF
CREATE OR REPLACE FUNCTION public.validate_cpf(cpf_input VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    cpf VARCHAR(11);
    sum_val INTEGER;
    remainder INTEGER;
    digit1 INTEGER;
    digit2 INTEGER;
    i INTEGER;
BEGIN
    -- Remove caracteres não numéricos
    cpf := regexp_replace(cpf_input, '[^0-9]', '', 'g');
    
    -- Verifica se tem 11 dígitos
    IF length(cpf) != 11 THEN
        RETURN false;
    END IF;
    
    -- Verifica se não são todos iguais
    IF cpf IN ('00000000000', '11111111111', '22222222222', '33333333333', 
               '44444444444', '55555555555', '66666666666', '77777777777',
               '88888888888', '99999999999') THEN
        RETURN false;
    END IF;
    
    -- Calcula primeiro dígito verificador
    sum_val := 0;
    FOR i IN 1..9 LOOP
        sum_val := sum_val + (substring(cpf, i, 1)::INTEGER * (11 - i));
    END LOOP;
    
    remainder := sum_val % 11;
    IF remainder < 2 THEN
        digit1 := 0;
    ELSE
        digit1 := 11 - remainder;
    END IF;
    
    -- Verifica primeiro dígito
    IF digit1 != substring(cpf, 10, 1)::INTEGER THEN
        RETURN false;
    END IF;
    
    -- Calcula segundo dígito verificador
    sum_val := 0;
    FOR i IN 1..10 LOOP
        sum_val := sum_val + (substring(cpf, i, 1)::INTEGER * (12 - i));
    END LOOP;
    
    remainder := sum_val % 11;
    IF remainder < 2 THEN
        digit2 := 0;
    ELSE
        digit2 := 11 - remainder;
    END IF;
    
    -- Verifica segundo dígito
    IF digit2 != substring(cpf, 11, 1)::INTEGER THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.validate_cpf IS 'Valida CPF brasileiro';

-- 5. FUNÇÕES PARA GERENCIAR SESSÕES
-- ===================================

-- Função para atualizar último login
CREATE OR REPLACE FUNCTION public.update_last_login(user_id UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
    -- Atualizar admin_users
    UPDATE public.admin_users 
    SET last_login = NOW() 
    WHERE id = user_id;
    
    -- Atualizar citizen_users
    UPDATE public.citizen_users 
    SET last_login = NOW() 
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_last_login IS 'Atualiza timestamp do último login';

-- ===================================
-- SCRIPT 003 CONCLUÍDO
-- PRÓXIMO: Execute o script 004_initial_data.sql
-- ===================================