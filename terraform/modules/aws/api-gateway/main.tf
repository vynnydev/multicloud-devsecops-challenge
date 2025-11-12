# API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.project_name}-${var.environment}-api"
  description = "API for machine activation"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.tags
}

# Resource: /machines
resource "aws_api_gateway_resource" "machines" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "machines"
}

# Resource: /machines/activate
resource "aws_api_gateway_resource" "activate" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.machines.id
  path_part   = "activate"
}

# Method: POST /machines/activate
resource "aws_api_gateway_method" "activate_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.activate.id
  http_method   = "POST"
  authorization = "NONE"
}

# CORS - OPTIONS
resource "aws_api_gateway_method" "activate_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.activate.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "activate_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.activate.id
  http_method = aws_api_gateway_method.activate_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "activate_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.activate.id
  http_method = aws_api_gateway_method.activate_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "activate_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.activate.id
  http_method = aws_api_gateway_method.activate_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.activate_options_200,
    aws_api_gateway_integration.activate_options
  ]
}

# Integration com Lambda
resource "aws_api_gateway_integration" "activate_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.activate.id
  http_method             = aws_api_gateway_method.activate_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_activate_invoke_arn
}

# Deployment
resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.activate.id,
      aws_api_gateway_method.activate_post.id,
      aws_api_gateway_integration.activate_lambda.id,
      aws_api_gateway_method.machines_post.id,              # ADICIONAR
      aws_api_gateway_integration.machines_register.id,     # ADICIONAR
      aws_api_gateway_method.machines_get.id,               # ADICIONAR
      aws_api_gateway_integration.machines_lambda.id,       # ADICIONAR
      aws_api_gateway_method.industry_get.id,               # ADICIONAR
      aws_api_gateway_integration.industry_lambda.id,       # ADICIONAR
      aws_api_gateway_method.machine_delete.id,             # ADICIONAR
      aws_api_gateway_integration.machine_delete.id,        # ADICIONAR
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Stage
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = "prod"

  tags = var.tags
}

# Lambda Permission
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_activate_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# Method: GET /machines
resource "aws_api_gateway_method" "machines_get" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.machines.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integration: Lambda List
resource "aws_api_gateway_integration" "machines_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.machines.id
  http_method             = aws_api_gateway_method.machines_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_list_invoke_arn
}

# CORS OPTIONS para /machines
resource "aws_api_gateway_method" "machines_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.machines.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "machines_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machines.id
  http_method = aws_api_gateway_method.machines_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "machines_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machines.id
  http_method = aws_api_gateway_method.machines_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "machines_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machines.id
  http_method = aws_api_gateway_method.machines_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.machines_options_200,
    aws_api_gateway_integration.machines_options
  ]
}

# Lambda Permission para a nova função
resource "aws_lambda_permission" "api_gateway_list" {
  statement_id  = "AllowAPIGatewayInvokeList"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_list_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ============================================================================
# NOVAS ROTAS: /machines/industry
# ============================================================================

# Resource: /machines/industry
resource "aws_api_gateway_resource" "industry" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.machines.id
  path_part   = "industry"
}

# Method: GET /machines/industry
resource "aws_api_gateway_method" "industry_get" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.industry.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integration: Lambda List Industry
resource "aws_api_gateway_integration" "industry_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.industry.id
  http_method             = aws_api_gateway_method.industry_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_list_industry_invoke_arn
}

# ============================================================================
# POST /machines (cadastrar MÁQUINA na indústria)
# ============================================================================

# Method: POST /machines
resource "aws_api_gateway_method" "machines_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.machines.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integration: Lambda Register MACHINE
resource "aws_api_gateway_integration" "machines_register" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.machines.id
  http_method             = aws_api_gateway_method.machines_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_register_machine_invoke_arn  # ← CORRIGIDO
}

# Lambda Permission para REGISTER MACHINE
resource "aws_lambda_permission" "api_gateway_register_machine" {  # ← NOME ÚNICO
  statement_id  = "AllowAPIGatewayInvokeRegisterMachine"  # ← NOME ÚNICO
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_register_machine_function_name  # ← CORRIGIDO
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_list_industry" {
  statement_id  = "AllowAPIGatewayInvokeListIndustry"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_list_industry_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ============================================================================
# ROTA DELETE: /machines/{machine_id}
# ============================================================================

# Resource: /machines/{machine_id}
resource "aws_api_gateway_resource" "machine_id" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.machines.id
  path_part   = "{machine_id}"
}

# Method: DELETE /machines/{machine_id}
resource "aws_api_gateway_method" "machine_delete" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.machine_id.id
  http_method   = "DELETE"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.machine_id" = true
  }
}

# Integration: Lambda Delete
resource "aws_api_gateway_integration" "machine_delete" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.machine_id.id
  http_method             = aws_api_gateway_method.machine_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_delete_invoke_arn
}

# CORS OPTIONS para /machines/{machine_id}
resource "aws_api_gateway_method" "machine_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.machine_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "machine_id_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machine_id.id
  http_method = aws_api_gateway_method.machine_id_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "machine_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machine_id.id
  http_method = aws_api_gateway_method.machine_id_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "machine_id_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.machine_id.id
  http_method = aws_api_gateway_method.machine_id_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.machine_id_options_200,
    aws_api_gateway_integration.machine_id_options
  ]
}

# Lambda Permission
resource "aws_lambda_permission" "api_gateway_delete" {
  statement_id  = "AllowAPIGatewayInvokeDelete"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_delete_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ============================================================================
# ROTAS DE AUTENTICAÇÃO
# ============================================================================

# Resource: /auth
resource "aws_api_gateway_resource" "auth" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "auth"
}

# ============================================================================
# ROTA: POST /auth/register (USUÁRIOS)
# ============================================================================

resource "aws_api_gateway_resource" "auth_register" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.auth.id
  path_part   = "register"
}

resource "aws_api_gateway_method" "auth_register_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.auth_register.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_register" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.auth_register.id
  http_method             = aws_api_gateway_method.auth_register_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_register_user_invoke_arn  # ← CORRIGIDO
}

# CORS OPTIONS
resource "aws_api_gateway_method" "auth_register_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.auth_register.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_register_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_register.id
  http_method = aws_api_gateway_method.auth_register_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "auth_register_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_register.id
  http_method = aws_api_gateway_method.auth_register_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "auth_register_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_register.id
  http_method = aws_api_gateway_method.auth_register_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.auth_register_options_200,
    aws_api_gateway_integration.auth_register_options
  ]
}

# Lambda Permission para REGISTER USER
resource "aws_lambda_permission" "api_gateway_register_user" {  # ← NOME ÚNICO
  statement_id  = "AllowAPIGatewayInvokeRegisterUser"  # ← NOME ÚNICO
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_register_user_function_name  # ← CORRIGIDO
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ============================================================================
# ROTA: POST /auth/login
# ============================================================================

resource "aws_api_gateway_resource" "auth_login" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.auth.id
  path_part   = "login"
}

resource "aws_api_gateway_method" "auth_login_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.auth_login.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_login" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.auth_login.id
  http_method             = aws_api_gateway_method.auth_login_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_login_invoke_arn
}

# CORS OPTIONS
resource "aws_api_gateway_method" "auth_login_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.auth_login.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_login_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_login.id
  http_method = aws_api_gateway_method.auth_login_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "auth_login_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_login.id
  http_method = aws_api_gateway_method.auth_login_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "auth_login_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.auth_login.id
  http_method = aws_api_gateway_method.auth_login_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.auth_login_options_200,
    aws_api_gateway_integration.auth_login_options
  ]
}

# Lambda Permission para LOGIN
resource "aws_lambda_permission" "api_gateway_login" {
  statement_id  = "AllowAPIGatewayInvokeLogin"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_login_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}