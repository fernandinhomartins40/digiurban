-- ===================================
-- 002 - CONFIGURAÇÃO DE SEGURANÇA (RLS e POLICIES)
-- Data: 26/01/2025
-- Versão: 1.0
-- Ordem: EXECUTAR SEGUNDO (após 001)
-- Descrição: Configurar Row Level Security e Políticas de acesso
-- ===================================

-- IMPORTANTE: Execute apenas APÓS o script 001_setup_auth_complete.sql

-- 1. ROW LEVEL SECURITY (RLS)
-- ===================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_operations_log ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS DE SEGURANÇA (POLICIES)
-- ===================================

-- Policies para departments
CREATE POLICY "departments_select" ON public.departments FOR SELECT USING (true);
CREATE POLICY "departments_admin_all" ON public.departments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('prefeito', 'admin')
    )
);

-- Policies para system_modules
CREATE POLICY "system_modules_select" ON public.system_modules FOR SELECT USING (true);
CREATE POLICY "system_modules_admin_all" ON public.system_modules FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role = 'prefeito'
    )
);

-- Policies para admin_users
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "admin_users_select_all" ON public.admin_users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('prefeito', 'admin')
    )
);
CREATE POLICY "admin_users_update_own" ON public.admin_users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "admin_users_admin_all" ON public.admin_users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role = 'prefeito'
    )
);

-- Policies para citizen_users
CREATE POLICY "citizen_users_select_own" ON public.citizen_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "citizen_users_update_own" ON public.citizen_users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "citizen_users_admin_select" ON public.citizen_users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('prefeito', 'admin')
    )
);

-- Policies para citizen_family_members
CREATE POLICY "family_members_select_own" ON public.citizen_family_members FOR SELECT USING (
    citizen_id = auth.uid()
);
CREATE POLICY "family_members_crud_own" ON public.citizen_family_members FOR ALL USING (
    citizen_id = auth.uid()
);
CREATE POLICY "family_members_admin_select" ON public.citizen_family_members FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('prefeito', 'admin')
    )
);

-- Policies para admin_permissions
CREATE POLICY "permissions_select_own" ON public.admin_permissions FOR SELECT USING (admin_id = auth.uid());
CREATE POLICY "permissions_admin_all" ON public.admin_permissions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role = 'prefeito'
    )
);

-- Policies para admin_operations_log
CREATE POLICY "operations_log_admin_select" ON public.admin_operations_log FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('prefeito', 'admin')
    )
);
CREATE POLICY "operations_log_insert" ON public.admin_operations_log FOR INSERT WITH CHECK (
    performed_by = auth.uid()
);

-- ===================================
-- SCRIPT 002 CONCLUÍDO
-- PRÓXIMO: Execute o script 003_functions_utilities.sql
-- ===================================