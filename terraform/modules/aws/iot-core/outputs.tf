output "thing_name" {
  value = aws_iot_thing.pump.name
}

output "thing_arn" {
  value = aws_iot_thing.pump.arn
}

output "certificate_arn" {
  value = aws_iot_certificate.pump_cert.arn
}

output "certificate_pem" {
  value     = aws_iot_certificate.pump_cert.certificate_pem
  sensitive = true
}

output "private_key" {
  value     = aws_iot_certificate.pump_cert.private_key
  sensitive = true
}

output "public_key" {
  value     = aws_iot_certificate.pump_cert.public_key
  sensitive = true
}

output "iot_endpoint" {
  value = data.aws_iot_endpoint.endpoint.endpoint_address
}

output "kinesis_rule_arn" {
  value = aws_iot_topic_rule.pump_data_to_kinesis.arn
}

output "sns_rule_arn" {
  value = aws_iot_topic_rule.anomaly_to_sns.arn
}