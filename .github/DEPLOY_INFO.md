# 🚀 DigiUrban Deploy Information

## Deploy Único Ativo

Este repositório possui **APENAS UM** workflow de deploy ativo:

- **Arquivo**: `.github/workflows/deploy-incremental.yml`
- **Nome**: Deploy DigiUrban React App
- **Porta**: 3002
- **Tipo**: Deploy incremental inteligente

## Configuração de Deploy

### Variáveis de Ambiente
- `VPS_HOST`: 31.97.85.98
- `VPS_USER`: root
- `APP_DIR`: /root/digiurban
- `APP_PORT`: 3002

### Secret Necessária
- `VPS_PASSWORD`: Senha SSH da VPS

## Triggers de Deploy

O deploy é executado automaticamente quando:
- Push para branch `main`
- Mudanças em:
  - `src/**` (código React)
  - `package*.json` (dependências)
  - `.github/workflows/**` (configuração de deploy)

## Deploy Manual
Também pode ser executado manualmente via GitHub Actions UI usando `workflow_dispatch`.

## URL da Aplicação
Após o deploy: `http://31.97.85.98:3002`

---

⚠️ **IMPORTANTE**: Este é o ÚNICO workflow de deploy. Não adicione outros workflows de deploy para evitar conflitos.