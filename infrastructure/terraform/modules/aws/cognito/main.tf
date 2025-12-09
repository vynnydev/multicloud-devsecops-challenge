resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}-user-pool"

  # Configurações de senha
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # Atributos do usuário
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = false
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  # Atributos customizados
  schema {
    name                     = "location_id"
    attribute_data_type      = "String"
    required                 = false
    mutable                  = true
    developer_only_attribute = false
    
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  # Auto verificação por email
  auto_verified_attributes = ["email"]

  # Configurações de email
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Permitir que usuários se cadastrem sozinhos
  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  # Configurações de conta
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = var.tags
}

# User Pool Client (para o frontend)
resource "aws_cognito_user_pool_client" "web_client" {
  name         = "${var.project_name}-${var.environment}-web-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # Fluxos de autenticação
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  # Configurações de token
  refresh_token_validity = 30 # dias
  access_token_validity  = 1  # hora
  id_token_validity      = 1  # hora

  token_validity_units {
    refresh_token = "days"
    access_token  = "hours"
    id_token      = "hours"
  }

  # Callbacks (para OAuth - opcional)
  prevent_user_existence_errors = "ENABLED"

  # Não precisamos de secret para aplicação web
  generate_secret = false

  # Atributos de leitura e escrita
  read_attributes = [
    "email",
    "email_verified",
    "name",
    "custom:location_id"
  ]

  write_attributes = [
    "email",
    "name",
    "custom:location_id"
  ]
}

# User Pool Domain (para hosted UI - opcional)
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}