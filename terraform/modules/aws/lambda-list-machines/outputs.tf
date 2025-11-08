output "function_name" {
  value = aws_lambda_function.list_machines.function_name
}

output "function_arn" {
  value = aws_lambda_function.list_machines.arn
}

output "invoke_arn" {
  value = aws_lambda_function.list_machines.invoke_arn
}