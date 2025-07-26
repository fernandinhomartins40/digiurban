-- ===================================
-- 004 - DADOS INICIAIS
-- Data: 26/01/2025
-- Versão: 1.0
-- Ordem: EXECUTAR QUARTO (após 003)
-- Descrição: Inserir dados iniciais (departamentos e módulos)
-- ===================================

-- IMPORTANTE: Execute apenas APÓS o script 003_functions_utilities.sql

-- 1. DEPARTAMENTOS PADRÃO
-- ===================================

INSERT INTO public.departments (name, description, color) VALUES
('Gabinete', 'Gabinete do Prefeito', '#9333ea'),
('Administração', 'Administração Geral', '#3b82f6'),
('Recursos Humanos', 'Gestão de Pessoas', '#10b981'),
('Finanças', 'Gestão Financeira', '#f59e0b'),
('Educação', 'Secretaria de Educação', '#ef4444'),
('Saúde', 'Secretaria de Saúde', '#06b6d4'),
('Assistência Social', 'Assistência Social', '#8b5cf6'),
('Obras Públicas', 'Obras e Infraestrutura', '#f97316'),
('Meio Ambiente', 'Secretaria de Meio Ambiente', '#22c55e'),
('Cultura', 'Secretaria de Cultura', '#ec4899'),
('Esportes', 'Secretaria de Esportes', '#14b8a6'),
('Transporte', 'Secretaria de Transporte', '#6366f1'),
('Agricultura', 'Secretaria de Agricultura', '#84cc16'),
('Segurança Pública', 'Gestão de Segurança', '#f43f5e'),
('Turismo', 'Secretaria de Turismo', '#06b6d4'),
('Habitação', 'Secretaria de Habitação', '#8b5cf6'),
('Ouvidoria', 'Ouvidoria Municipal', '#64748b')
ON CONFLICT (name) DO NOTHING;

-- 2. MÓDULOS DO SISTEMA
-- ===================================

INSERT INTO public.system_modules (id, name, description, group_name, icon) VALUES
-- Administração
('administracao', 'Administração Geral', 'Módulo de administração geral', 'Administração', 'Settings'),
('financas', 'Finanças', 'Gestão financeira e orçamentária', 'Administração', 'DollarSign'),
('rh', 'Recursos Humanos', 'Gestão de recursos humanos', 'Administração', 'Users'),
('compras', 'Compras e Licitações', 'Gestão de compras e licitações', 'Administração', 'ShoppingCart'),

-- Social
('educacao', 'Educação', 'Gestão da educação municipal', 'Social', 'GraduationCap'),
('saude', 'Saúde', 'Gestão da saúde pública', 'Social', 'Heart'),
('assistencia', 'Assistência Social', 'Programas de assistência social', 'Social', 'HandHeart'),

-- Infraestrutura
('obras', 'Obras Públicas', 'Gestão de obras e infraestrutura', 'Infraestrutura', 'Construction'),
('servicos', 'Serviços Públicos', 'Gestão de serviços públicos', 'Infraestrutura', 'Wrench'),
('meioambiente', 'Meio Ambiente', 'Gestão ambiental', 'Infraestrutura', 'Leaf'),
('transporte', 'Transporte', 'Gestão de transporte público', 'Infraestrutura', 'Bus'),

-- Comunicação
('correio', 'Correio Interno', 'Sistema de correio interno', 'Comunicação', 'Mail'),
('chat', 'Chat', 'Sistema de chat interno', 'Comunicação', 'MessageCircle'),
('ouvidoria', 'Ouvidoria', 'Canal de ouvidoria', 'Comunicação', 'Megaphone'),

-- Gabinete
('gabinete', 'Gabinete', 'Gestão do gabinete', 'Gabinete', 'Crown'),
('solicitacoes', 'Solicitações', 'Gestão de solicitações', 'Gabinete', 'FileText'),

-- Outros
('cultura', 'Cultura', 'Gestão cultural', 'Outros', 'Music'),
('esportes', 'Esportes', 'Gestão de esportes', 'Outros', 'Trophy'),
('turismo', 'Turismo', 'Gestão do turismo', 'Outros', 'MapPin'),
('habitacao', 'Habitação', 'Gestão habitacional', 'Outros', 'Home'),
('agricultura', 'Agricultura', 'Gestão agrícola', 'Outros', 'Wheat'),
('seguranca', 'Segurança Pública', 'Gestão de segurança', 'Outros', 'Shield')
ON CONFLICT (id) DO NOTHING;

-- 3. VERIFICAÇÃO DOS DADOS INSERIDOS
-- ===================================

-- Verificar departamentos criados
SELECT 
    COUNT(*) as total_departments,
    COUNT(CASE WHEN is_active THEN 1 END) as active_departments
FROM public.departments;

-- Verificar módulos criados
SELECT 
    group_name,
    COUNT(*) as modules_count
FROM public.system_modules 
WHERE is_active = true
GROUP BY group_name
ORDER BY group_name;

-- Listar todos os módulos por grupo
SELECT 
    group_name as "Grupo",
    id as "ID do Módulo",
    name as "Nome",
    icon as "Ícone"
FROM public.system_modules 
WHERE is_active = true
ORDER BY group_name, name;

-- ===================================
-- SCRIPT 004 CONCLUÍDO
-- PRÓXIMO: Execute o script 005_create_admin_function.sql
-- ===================================