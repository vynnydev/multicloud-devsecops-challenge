# Kinesis Data Stream (SIMPLES - SEM KMS)
resource "aws_kinesis_stream" "pump_data" {
  name             = "${var.project_name}-${var.environment}-${var.stream_name}"
  shard_count      = var.shard_count
  retention_period = var.retention_period

  shard_level_metrics = [
    "IncomingBytes",
    "IncomingRecords",
    "OutgoingBytes",
    "OutgoingRecords"
  ]

  stream_mode_details {
    stream_mode = "PROVISIONED"
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-${var.stream_name}"
    }
  )
}

# CloudWatch Alarm - High Iterator Age
resource "aws_cloudwatch_metric_alarm" "high_iterator_age" {
  alarm_name          = "${var.project_name}-${var.environment}-kinesis-high-iterator-age"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "GetRecords.IteratorAgeMilliseconds"
  namespace           = "AWS/Kinesis"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "60000"
  alarm_description   = "Kinesis iterator age is too high"
  treat_missing_data  = "notBreaching"

  dimensions = {
    StreamName = aws_kinesis_stream.pump_data.name
  }

  tags = var.tags
}