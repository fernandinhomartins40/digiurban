# 📋 Scripts SQL - DigiUrban

## 🎯 Visão Geral

Esta pasta contém todos os scripts SQL necessários para configurar o sistema de autenticação, login, registro e níveis de acesso no Supabase.

## ✅ SCRIPTS CORRIGIDOS

**ERRO CORRIGIDO**: Removida dependência da extensão `pg_crypto` que não estava disponível no Supabase.

**ABORDAGEM ATUALIZADA**: Scripts adaptados para funcionar com o sistema de autenticação nativo do Supabase.

## 🔢 Ordem de Execução

**IMPORTANTE**: Execute os scripts **NA ORDEM NUMÉRICA** indicada nos nomes dos arquivos.

### 1️⃣ `001_setup_auth_complete.sql`
- **O que faz**: Cria todas as tabelas principais (corrigida para Supabase)
- **Conteúdo**: 
  - Extensões necessárias
  - Tabelas de usuários (admin e cidadão)
  - Tabelas de departamentos e módulos
  - Tabelas de permissões e logs
  - Índices para performance
  - Triggers para updated_at
- **Tempo estimado**: 2-3 minutos

### 2️⃣ `002_setup_security.sql`
- **O que faz**: Configura segurança (RLS e Policies)
- **Conteúdo**:
  - Habilita Row Level Security
  - Cria políticas de acesso
  - Configura permissões por tabela
- **Tempo estimado**: 1-2 minutos

### 3️⃣ `003_functions_utilities.sql`
- **O que faz**: Cria funções auxiliares
- **Conteúdo**:
  - Funções de verificação de usuário
  - Funções de verificação de permissões
  - Funções de log e auditoria
  - Função de validação de CPF
- **Tempo estimado**: 1-2 minutos

### 4️⃣ `004_initial_data.sql`
- **O que faz**: Insere dados iniciais
- **Conteúdo**:
  - Departamentos padrão
  - Módulos do sistema
  - Dados de configuração inicial
- **Tempo estimado**: 1 minuto

### 5️⃣ `005_create_admin_function.sql`
- **O que faz**: Cria funções para completar perfis de usuários (adaptada para Supabase)
- **Conteúdo**:
  - Função para completar perfil administrativo
  - Função para completar perfil de cidadão
  - Função para atualizar permissões
  - View para usuários sem perfil
- **Tempo estimado**: 1-2 minutos

### 6️⃣ `006_create_first_users.sql`
- **O que faz**: Instruções para criar primeiros usuários (adaptada para Supabase)
- **Conteúdo**:
  - Instruções para criar usuários via Dashboard
  - Exemplos de completar perfis
  - Verificações e testes
  - **NOVO**: Não cria usuários automaticamente, usa Dashboard do Supabase
- **Tempo estimado**: 5-10 minutos (incluindo criação manual)

## 🚀 Como Executar

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para seu projeto no [Supabase](https://app.supabase.com)
   - Clique em "SQL Editor" no menu lateral

2. **Execute Script por Script**
   ```sql
   -- Cole o conteúdo do script 001_setup_auth_complete.sql
   -- Clique em "Run" ou pressione Ctrl+Enter
   -- Aguarde a execução terminar
   
   -- Repita para cada script na ordem numérica
   ```

3. **Verificar Execução**
   - Cada script deve executar sem erros
   - Verifique as mensagens de retorno
   - Se houver erro, corrija antes de continuar

4. **Alterar Dados do Script 006**
   - **OBRIGATÓRIO**: Edite os dados marcados com ✏️
   - Use email, senha e informações reais
   - Execute apenas após alterar os dados

## ⚙️ Configurações Importantes

### Script 006 - Dados para Alterar:

```sql
-- ✏️ ALTERE ESTES DADOS:
p_email := 'seu-email@municipio.gov.br',
p_password := 'SuaSenhaSegura123!',
p_name := 'Nome Completo do Prefeito',
p_phone := '(11) 99999-9999'
```

### Requisitos de Senha:
- Mínimo 6 caracteres
- Recomendado: letras, números e símbolos
- Evite senhas óbvias

### Requisitos de Email:
- Email válido e único
- Preferencialmente do domínio oficial

## 🔍 Verificações Pós-Execução

Após executar todos os scripts:

### 1. Verificar Tabelas Criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%users%' 
OR table_name LIKE '%departments%'
OR table_name LIKE '%modules%';
```

### 2. Verificar Usuário Prefeito
```sql
SELECT email, name, role, is_active 
FROM public.admin_users 
WHERE role = 'prefeito';
```

### 3. Verificar Módulos Instalados
```sql
SELECT group_name, COUNT(*) as modules_count
FROM public.system_modules 
GROUP BY group_name;
```

### 4. Testar Login na Aplicação
- Acesse a aplicação React
- Use email e senha do prefeito criado
- Verifique se o login funciona

## 🛠️ Troubleshooting

### Problemas Comuns:

**1. Erro "relation already exists"**
- ✅ Normal se executar script novamente
- ✅ Use `IF NOT EXISTS` (já incluído)

**2. Erro "permission denied"**
- ❌ Verifique se é proprietário do projeto
- ❌ Use service role key se necessário

**3. Usuário não consegue fazer login**
- ✅ Confirme email com comando da seção 7 do script 006
- ✅ Verifique se senha está correta
- ✅ Verifique se `is_active = true`

**4. Permissões não funcionam**
- ✅ Execute script 003 (funções)
- ✅ Verifique RLS no script 002
- ✅ Teste com função `has_permission()`

## 📊 Estrutura Final

Após execução completa, você terá:

- ✅ **7 tabelas** principais criadas
- ✅ **25+ módulos** do sistema configurados
- ✅ **17 departamentos** padrão criados
- ✅ **1 usuário prefeito** com todas as permissões
- ✅ **Sistema de permissões** completo funcionando
- ✅ **Row Level Security** configurado
- ✅ **Logs de auditoria** ativos

## 🔐 Segurança

- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Policies configuradas** por tipo de usuário
- ✅ **Validações** de CPF, email e dados
- ✅ **Logs de auditoria** para operações admin
- ✅ **Senhas criptografadas** com bcrypt

## 📞 Suporte

Em caso de problemas:

1. **Verifique os logs** do Supabase
2. **Confira a ordem** de execução dos scripts
3. **Valide os dados** alterados no script 006
4. **Teste as funções** individualmente

---

## ✅ Checklist de Execução

- [ ] Script 001 executado sem erros
- [ ] Script 002 executado sem erros  
- [ ] Script 003 executado sem erros
- [ ] Script 004 executado sem erros
- [ ] Script 005 executado sem erros
- [ ] Dados alterados no script 006
- [ ] Script 006 executado sem erros
- [ ] Usuário prefeito criado com sucesso
- [ ] Login testado na aplicação
- [ ] Permissões funcionando

**🎉 Parabéns! Seu sistema de autenticação está pronto!**