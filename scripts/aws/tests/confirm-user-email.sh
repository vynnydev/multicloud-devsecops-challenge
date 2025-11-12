#!/bin/bash

# ============================================================================
# CONFIRMAR USUÁRIO MANUALMENTE (PARA TESTES)
# ============================================================================

if [ -z "$1" ]; then
  echo "Uso: ./confirm-user.sh <username>"
  echo "Exemplo: ./confirm-user.sh vini_test"
  exit 1
fi

USERNAME=$1

cd ../../../terraform/stacks/aws-core
USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
cd ../../..

echo "🔐 Confirmando usuário: $USERNAME"
echo "User Pool ID: $USER_POOL_ID"
echo ""

aws cognito-idp admin-confirm-sign-up \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --region us-east-1

echo ""
echo "✅ Usuário confirmado com sucesso!"
echo ""
echo "Agora você pode fazer login normalmente."