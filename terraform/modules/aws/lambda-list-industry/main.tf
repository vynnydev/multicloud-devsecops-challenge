data "archive_file" "lambda_list_industry" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_list_industry.zip"
}

resource "aws_iam_role" "lambda_list_industry" {
  name = "${var.project_name}-${var.environment}-lambda-list-industry-role"

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

resource "aws_iam_role_policy" "lambda_list_industry" {
  name = "${var.project_name}-${var.environment}-lambda-list-industry-policy"
  role = aws_iam_role.lambda_list_industry.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:Query",
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

resource "aws_lambda_function" "list_industry" {
  filename         = data.archive_file.lambda_list_industry.output_path
  function_name    = "${var.project_name}-${var.environment}-list-industry"
  role            = aws_iam_role.lambda_list_industry.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_list_industry.output_base64sha256
  runtime         = "python3.11"
  timeout         = 10

  environment {
    variables = {
      DYNAMODB_TABLE = var.dynamodb_table_name
    }
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "lambda_list_industry" {
  name              = "/aws/lambda/${aws_lambda_function.list_industry.function_name}"
  retention_in_days = 7

  tags = var.tags
}