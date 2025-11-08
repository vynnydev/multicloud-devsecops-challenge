# SNS Topic
resource "aws_sns_topic" "iot_events" {
  name = "${var.project_name}-${var.environment}-${var.topic_name}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-sns-topic"
    }
  )
}

# SNS Topic Policy (permite IoT publicar)
resource "aws_sns_topic_policy" "iot_events" {
  arn = aws_sns_topic.iot_events.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "iot.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.iot_events.arn
      }
    ]
  })
}