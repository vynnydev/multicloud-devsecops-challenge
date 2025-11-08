output "table_name" {
  value = aws_dynamodb_table.machines_status.name
}

output "table_arn" {
  value = aws_dynamodb_table.machines_status.arn
}