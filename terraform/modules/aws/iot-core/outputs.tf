# terraform/modules/aws/iot/outputs.tf

output "thing_name" {
  description = "Nome do IoT Thing"
  value       = aws_iot_thing.pump.name
}

output "thing_arn" {
  description = "ARN do IoT Thing"
  value       = aws_iot_thing.pump.arn
}

output "certificate_arn" {
  description = "ARN do certificado"
  value       = aws_iot_certificate.pump_cert.arn
}

output "certificate_pem" {
  description = "Certificado em formato PEM"
  value       = aws_iot_certificate.pump_cert.certificate_pem
  sensitive   = true
}

output "private_key" {
  description = "Chave privada"
  value       = aws_iot_certificate.pump_cert.private_key
  sensitive   = true
}

output "public_key" {
  description = "Chave pública"
  value       = aws_iot_certificate.pump_cert.public_key
  sensitive   = true
}

output "iot_endpoint" {
  description = "Endpoint do IoT Core"
  value       = data.aws_iot_endpoint.endpoint.endpoint_address
}

output "topic_rule_arn" {
  description = "ARN da IoT Rule"
  value       = aws_iot_topic_rule.pump_data_to_kinesis.arn
}