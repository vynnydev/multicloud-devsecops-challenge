data "archive_file" "lambda_list" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_list.zip"
}

resource "aws_iam_role" "lambda_list" {
  name = "${var.project_name}-${var.environment}-lambda-list-role"

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

resource "aws_iam_role_policy" "lambda_list" {
  name = "${var.project_name}-${var.environment}-lambda-list-policy"
  role = aws_iam_role.lambda_list.id

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

resource "aws_lambda_function" "list_machines" {
  filename         = data.archive_file.lambda_list.output_path
  function_name    = "${var.project_name}-${var.environment}-list-machines"
  role            = aws_iam_role.lambda_list.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_list.output_base64sha256
  runtime         = "python3.11"
  timeout         = 10

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "lambda_list" {
  name              = "/aws/lambda/${aws_lambda_function.list_machines.function_name}"
  retention_in_days = 7

  tags = var.tags
}