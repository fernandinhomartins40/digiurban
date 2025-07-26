-- ===================================
-- 001 - SETUP COMPLETO DE AUTENTICAÇÃO - DIGIURBAN (V2)
-- Data: 26/01/2025
-- Versão: 2.0 (Corrigida para Supabase)
-- Ordem: EXECUTAR PRIMEIRO
-- Descrição: Scripts para configurar sistema completo de login, registro e níveis de acesso
-- ===================================

-- 1. EXTENSÕES NECESSÁRIAS
-- ===================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Nota: Supabase tem funções crypto nativas, não precisa pg_crypto

-- 2. TABELAS DE USUÁRIOS
-- ===================================

-- Tabela de departamentos/setores
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1', -- Cor hexadecimal para UI
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.departments IS 'Departamentos/setores da prefeitura';

-- Tabela de módulos do sistema
CREATE TABLE IF NOT EXISTS public.system_modules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_name VARCHAR(100) NOT NULL, -- Administração, Social, Infraestrutura, etc.
    icon VARCHAR(50), -- Nome do ícone para UI
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.system_modules IS 'Módulos disponíveis no sistema';

-- Tabela de usuários administrativos (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('prefeito', 'admin')),
    department_id UUID REFERENCES public.departments(id),
    position VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users IS 'Usuários administrativos (prefeito e admins)';

-- Tabela de usuários cidadãos (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.citizen_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    phone VARCHAR(20),
    -- Endereço
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL DEFAULT 'Seu Município',
    state VARCHAR(2) NOT NULL DEFAULT 'XX',
    zip_code VARCHAR(10) NOT NULL,
    -- Controle
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.citizen_users IS 'Usuários cidadãos';

-- Tabela de familiares dos cidadãos
CREATE TABLE IF NOT EXISTS public.citizen_family_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    citizen_id UUID REFERENCES public.citizen_users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    cpf VARCHAR(14),
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.citizen_family_members IS 'Membros da família dos cidadãos';

-- Tabela de permissões administrativas
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    module_id VARCHAR(50) REFERENCES public.system_modules(id) ON DELETE CASCADE,
    create_permission BOOLEAN DEFAULT false,
    read_permission BOOLEAN DEFAULT false,
    update_permission BOOLEAN DEFAULT false,
    delete_permission BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(admin_id, module_id)
);

COMMENT ON TABLE public.admin_permissions IS 'Permissões de acesso dos usuários administrativos';

-- Tabela de log de operações administrativas
CREATE TABLE IF NOT EXISTS public.admin_operations_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    performed_by UUID REFERENCES public.admin_users(id),
    operation_type VARCHAR(100) NOT NULL,
    target_user_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.admin_operations_log IS 'Log de operações administrativas para auditoria';

-- 3. ÍNDICES PARA PERFORMANCE
-- ===================================

-- Índices para admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_department ON public.admin_users(department_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);

-- Índices para citizen_users
CREATE INDEX IF NOT EXISTS idx_citizen_users_email ON public.citizen_users(email);
CREATE INDEX IF NOT EXISTS idx_citizen_users_cpf ON public.citizen_users(cpf);
CREATE INDEX IF NOT EXISTS idx_citizen_users_active ON public.citizen_users(is_active);
CREATE INDEX IF NOT EXISTS idx_citizen_users_city ON public.citizen_users(city);

-- Índices para permissões
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin ON public.admin_permissions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_module ON public.admin_permissions(module_id);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_admin_operations_log_performed_by ON public.admin_operations_log(performed_by);
CREATE INDEX IF NOT EXISTS idx_admin_operations_log_created_at ON public.admin_operations_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_operations_log_operation_type ON public.admin_operations_log(operation_type);

-- 4. TRIGGERS PARA UPDATED_AT
-- ===================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas com updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_modules_updated_at BEFORE UPDATE ON public.system_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_citizen_users_updated_at BEFORE UPDATE ON public.citizen_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_permissions_updated_at BEFORE UPDATE ON public.admin_permissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. FUNÇÃO PARA CRIAR PERFIL AO REGISTRAR USUÁRIO
-- ===================================

-- Trigger function para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Verificar se é admin baseado no email domain ou metadata
  IF NEW.raw_user_meta_data ? 'user_type' AND NEW.raw_user_meta_data->>'user_type' = 'admin' THEN
    INSERT INTO public.admin_users (
      id,
      email,
      name,
      role
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
    );
  ELSE
    -- Assumir que é cidadão se não especificado
    INSERT INTO public.citizen_users (
      id,
      email,
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      state,
      zip_code
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
      COALESCE(NEW.raw_user_meta_data->>'street', ''),
      COALESCE(NEW.raw_user_meta_data->>'number', ''),
      COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
      COALESCE(NEW.raw_user_meta_data->>'city', 'Seu Município'),
      COALESCE(NEW.raw_user_meta_data->>'state', 'XX'),
      COALESCE(NEW.raw_user_meta_data->>'zip_code', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger para executar a função quando novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================
-- SCRIPT 001 V2 CONCLUÍDO
-- PRÓXIMO: Execute o script 002_setup_security.sql (sem alterações)
-- ===================================