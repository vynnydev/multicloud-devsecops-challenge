output "function_name" {
  value = aws_lambda_function.simulator.function_name
}

output "function_arn" {
  value = aws_lambda_function.simulator.arn
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.lambda_simulator.name
}