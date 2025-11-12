data "archive_file" "lambda_login" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_login.zip"
}

resource "aws_iam_role" "lambda_login" {
  name = "${var.project_name}-${var.environment}-lambda-login-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "lambda_login" {
  name = "${var.project_name}-${var.environment}-lambda-login-policy"
  role = aws_iam_role.lambda_login.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:InitiateAuth",
          "cognito-idp:GetUser",
          "cognito-idp:AdminGetUser"
        ]
        Resource = var.cognito_user_pool_arn
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ]
        Resource = [
          var.dynamodb_table_arn,
          "${var.dynamodb_table_arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "login_user" {
  filename         = data.archive_file.lambda_login.output_path
  function_name    = "${var.project_name}-${var.environment}-login-user"
  role            = aws_iam_role.lambda_login.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_login.output_base64sha256
  runtime         = "python3.11"
  timeout         = 30

  environment {
    variables = {
      USER_POOL_ID  = var.cognito_user_pool_id
      CLIENT_ID     = var.cognito_client_id
      DYNAMODB_TABLE = var.dynamodb_table_name
    }
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "lambda_login" {
  name              = "/aws/lambda/${aws_lambda_function.login_user.function_name}"
  retention_in_days = 7

  tags = var.tags
}