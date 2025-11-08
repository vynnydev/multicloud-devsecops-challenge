output "db_instance_endpoint" {
  description = "Endpoint da instância RDS"
  value       = aws_db_instance.postgres.endpoint
}

output "db_instance_address" {
  description = "Address (hostname) do RDS"
  value       = aws_db_instance.postgres.address
}

output "db_instance_port" {
  description = "Porta do RDS"
  value       = aws_db_instance.postgres.port
}

output "db_instance_id" {
  description = "ID da instância RDS"
  value       = aws_db_instance.postgres.id
}

output "database_name" {
  description = "Nome do database"
  value       = aws_db_instance.postgres.db_name
}

output "master_username" {
  description = "Username master"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

output "security_group_id" {
  description = "ID do security group do RDS"
  value       = aws_security_group.rds.id
}

output "secret_arn" {
  description = "ARN do secret com credenciais"
  value       = aws_secretsmanager_secret.rds_password.arn
}