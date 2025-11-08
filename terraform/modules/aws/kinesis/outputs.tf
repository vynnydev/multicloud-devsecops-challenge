output "stream_name" {
  value = aws_kinesis_stream.pump_data.name
}

output "stream_arn" {
  value = aws_kinesis_stream.pump_data.arn
}

output "stream_id" {
  value = aws_kinesis_stream.pump_data.id
}