output "topic_arn" {
  value = aws_sns_topic.iot_events.arn
}

output "topic_name" {
  value = aws_sns_topic.iot_events.name
}