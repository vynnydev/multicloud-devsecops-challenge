# ZIP do código Lambda
data "archive_file" "lambda_simulator" {
  type        = "zip"
  source_file = "${path.module}/lambda/lambda_function.py"
  output_path = "${path.module}/lambda/lambda_simulator.zip"
}

# IAM Role para Lambda
resource "aws_iam_role" "lambda_simulator" {
  name = "${var.project_name}-${var.environment}-lambda-simulator-role"

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
resource "aws_iam_role_policy" "lambda_simulator" {
  name = "${var.project_name}-${var.environment}-lambda-simulator-policy"
  role = aws_iam_role.lambda_simulator.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iot:Publish"
        ]
        Resource = "arn:aws:iot:*:*:topic/${var.iot_topic}"
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
resource "aws_lambda_function" "simulator" {
  filename         = data.archive_file.lambda_simulator.output_path
  function_name    = "${var.project_name}-${var.environment}-iot-simulator"
  role            = aws_iam_role.lambda_simulator.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.lambda_simulator.output_base64sha256
  runtime         = "python3.11"
  timeout         = 10

  environment {
    variables = {
      IOT_TOPIC = var.iot_topic
    }
  }

  tags = var.tags
}

# CloudWatch Event Rule (trigger a cada 10 segundos)
resource "aws_cloudwatch_event_rule" "simulator_trigger" {
  name                = "${var.project_name}-${var.environment}-simulator-trigger"
  description         = "Trigger IoT simulator every 10 seconds"
  schedule_expression = "rate(1 minute)"

  tags = var.tags
}

# Event Target
resource "aws_cloudwatch_event_target" "simulator" {
  rule      = aws_cloudwatch_event_rule.simulator_trigger.name
  target_id = "lambda"
  arn       = aws_lambda_function.simulator.arn
}

# Permission para EventBridge invocar Lambda
resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulator.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.simulator_trigger.arn
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_simulator" {
  name              = "/aws/lambda/${aws_lambda_function.simulator.function_name}"
  retention_in_days = 7

  tags = var.tags
}