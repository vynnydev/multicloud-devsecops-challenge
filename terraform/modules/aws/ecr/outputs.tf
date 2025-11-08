output "repository_urls" {
  description = "URLs dos repositórios ECR"
  value = {
    for k, v in aws_ecr_repository.repositories : k => v.repository_url
  }
}

output "repository_arns" {
  value = {
    for k, v in aws_ecr_repository.repositories : k => v.arn
  }
}

output "ecr_pull_policy_arn" {
  value = aws_iam_policy.ecr_pull.arn
}

output "login_command" {
  description = "Comando para fazer login no ECR"
  value       = "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${split("/", values(aws_ecr_repository.repositories)[0].repository_url)[0]}"
}