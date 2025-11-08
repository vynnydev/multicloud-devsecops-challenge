# Guia de Deploy com Docker

## Construir e Executar a Aplicação

### Opção 1: Usando Docker diretamente

\`\`\`bash
# Construir a imagem
docker build -t monitor-maquinas .

# Executar o container
docker run -p 3000:3000 monitor-maquinas
\`\`\`

### Opção 2: Usando Docker Compose

\`\`\`bash
# Construir e executar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
\`\`\`

## Configuração Next.js para Docker

Para o build standalone funcionar corretamente, certifique-se de que o `next.config.mjs` tem a seguinte configuração:

\`\`\`javascript
const nextConfig = {
  output: 'standalone',
};
\`\`\`

## Variáveis de Ambiente

Se sua aplicação usa variáveis de ambiente, crie um arquivo `.env.local` e descomente as linhas relevantes no `docker-compose.yml`.

## Acesso

Após iniciar o container, acesse: http://localhost:3000
