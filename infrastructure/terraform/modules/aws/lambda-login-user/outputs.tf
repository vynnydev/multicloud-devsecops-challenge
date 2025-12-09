output "function_name" {
  value = aws_lambda_function.login_user.function_name
}

output "function_arn" {
  value = aws_lambda_function.login_user.arn
}

output "invoke_arn" {
  value = aws_lambda_function.login_user.invoke_arn
}