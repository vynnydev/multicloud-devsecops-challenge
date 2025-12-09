# ZIP do código
data "archive_file" "lambda_activate" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_activate.zip"
}

# IAM Role
resource "aws_iam_role" "lambda_activate" {
  name = "${var.project_name}-${var.environment}-lambda-activate-role"

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

# IAM Policy
resource "aws_iam_role_policy" "lambda_activate" {
  name = "${var.project_name}-${var.environment}-lambda-activate-policy"
  role = aws_iam_role.lambda_activate.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["iot:Publish"]
        Resource = "arn:aws:iot:*:*:topic/${var.iot_topic}"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem"
        ]
        Resource = "*"
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

# Lambda Function
resource "aws_lambda_function" "activate" {
  filename         = data.archive_file.lambda_activate.output_path
  function_name    = "${var.project_name}-${var.environment}-activate-machine"
  role            = aws_iam_role.lambda_activate.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_activate.output_base64sha256
  runtime         = "python3.11"
  timeout         = 10

  environment {
    variables = {
      IOT_TOPIC      = var.iot_topic
      DYNAMODB_TABLE = "machines-status"
    }
  }

  tags = var.tags
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_activate" {
  name              = "/aws/lambda/${aws_lambda_function.activate.function_name}"
  retention_in_days = 7

  tags = var.tags
}