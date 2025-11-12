#!/bin/bash

# ============================================================================
# SCRIPT DE TESTE - AUTENTICAÇÃO
# ============================================================================

set -e

# Pegar endpoints do Terraform
cd ../../../terraform/stacks/aws-core
REGISTER_URL=$(terraform output -raw auth_register_url)
LOGIN_URL=$(terraform output -raw auth_login_url)
cd ../../..

echo "======================================================================"
echo "🧪 TESTANDO API DE AUTENTICAÇÃO"
echo "======================================================================"
echo ""

# ============================================================================
# TESTE 1: REGISTRO
# ============================================================================

echo "📝 Teste 1: Registrar novo usuário..."
echo ""

REGISTER_RESPONSE=$(curl -s -X POST $REGISTER_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vinicius Prudencio",
    "email": "vini.test@example.com",
    "username": "vini_test",
    "location_id": "factory-001",
    "password": "SenhaSegura123"
  }')

echo "Response:"
echo $REGISTER_RESPONSE | jq '.'
echo ""

# ============================================================================
# TESTE 2: REGISTRO DUPLICADO (deve falhar)
# ============================================================================

echo "❌ Teste 2: Tentar registrar usuário duplicado..."
echo ""

DUPLICATE_RESPONSE=$(curl -s -X POST $REGISTER_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vinicius Prudencio",
    "email": "vini.test@example.com",
    "username": "vini_test",
    "location_id": "factory-001",
    "password": "SenhaSegura123"
  }')

echo "Response:"
echo $DUPLICATE_RESPONSE | jq '.'
echo ""

# ============================================================================
# TESTE 3: LOGIN (NOTA: Precisa verificar email primeiro!)
# ============================================================================

echo "🔐 Teste 3: Tentar fazer login..."
echo "⚠️  NOTA: O login só funcionará após verificar o email!"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST $LOGIN_URL \
  -H "Content-Type: application/json" \
  -d '{
    "username": "vini_test",
    "password": "SenhaSegura123"
  }')

echo "Response:"
echo $LOGIN_RESPONSE | jq '.'
echo ""

# ============================================================================
# TESTE 4: LOGIN COM SENHA ERRADA
# ============================================================================

echo "❌ Teste 4: Login com senha incorreta..."
echo ""

WRONG_PASSWORD_RESPONSE=$(curl -s -X POST $LOGIN_URL \
  -H "Content-Type: application/json" \
  -d '{
    "username": "vini_test",
    "password": "SenhaErrada123"
  }')

echo "Response:"
echo $WRONG_PASSWORD_RESPONSE | jq '.'
echo ""

# ============================================================================
# RESUMO
# ============================================================================

echo "======================================================================"
echo "✅ TESTES CONCLUÍDOS"
echo "======================================================================"
echo ""
echo "Para fazer login, você precisa:"
echo "1. Verificar o email (checar spam)"
echo "2. Clicar no link de verificação"
echo "3. Tentar login novamente"
echo ""
echo "OU usar o AWS Console para confirmar o usuário manualmente:"
echo "aws cognito-idp admin-confirm-sign-up \\"
echo "  --user-pool-id <USER_POOL_ID> \\"
echo "  --username vini_test"
echo ""