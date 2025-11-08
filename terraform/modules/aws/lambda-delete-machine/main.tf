data "archive_file" "lambda_delete" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_delete.zip"
}

resource "aws_iam_role" "lambda_delete" {
  name = "${var.project_name}-${var.environment}-lambda-delete-role"

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

resource "aws_iam_role_policy" "lambda_delete" {
  name = "${var.project_name}-${var.environment}-lambda-delete-policy"
  role = aws_iam_role.lambda_delete.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DeleteItem",
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

resource "aws_lambda_function" "delete_machine" {
  filename         = data.archive_file.lambda_delete.output_path
  function_name    = "${var.project_name}-${var.environment}-delete-machine"
  role            = aws_iam_role.lambda_delete.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_delete.output_base64sha256
  runtime         = "python3.11"
  timeout         = 10

  environment {
    variables = {
      DYNAMODB_TABLE = var.dynamodb_table_name
    }
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "lambda_delete" {
  name              = "/aws/lambda/${aws_lambda_function.delete_machine.function_name}"
  retention_in_days = 7

  tags = var.tags
}