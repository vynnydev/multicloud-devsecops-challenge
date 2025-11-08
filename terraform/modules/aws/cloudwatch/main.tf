# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/EKS", "cluster_failed_node_count", { stat = "Average", label = "EKS Failed Nodes" }],
            [".", "cluster_node_count", { stat = "Average", label = "EKS Total Nodes" }]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "EKS Cluster Health"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", { stat = "Average", label = "RDS CPU" }],
            [".", "DatabaseConnections", { stat = "Average", label = "RDS Connections" }]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "RDS Performance"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/Kinesis", "IncomingRecords", { stat = "Sum", label = "Kinesis Records" }],
            [".", "GetRecords.IteratorAgeMilliseconds", { stat = "Maximum", label = "Iterator Age" }]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "Kinesis Stream"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", { stat = "Sum", label = "ALB Requests" }],
            [".", "TargetResponseTime", { stat = "Average", label = "Response Time" }]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "Load Balancer"
        }
      }
    ]
  })
}

# Alarm: EKS High CPU
resource "aws_cloudwatch_metric_alarm" "eks_high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-eks-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "node_cpu_utilization"
  namespace           = "ContainerInsights"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "EKS node CPU > 80%"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = var.eks_cluster_name
  }

  tags = var.tags
}

# Alarm: RDS High CPU
resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "RDS CPU > 80%"

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }

  tags = var.tags
}

# Alarm: Kinesis High Iterator Age
resource "aws_cloudwatch_metric_alarm" "kinesis_high_iterator_age" {
  alarm_name          = "${var.project_name}-${var.environment}-kinesis-iterator-age"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "GetRecords.IteratorAgeMilliseconds"
  namespace           = "AWS/Kinesis"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "60000"
  alarm_description   = "Kinesis iterator age > 1 min"

  dimensions = {
    StreamName = var.kinesis_stream_name
  }

  tags = var.tags
}

# Alarm: ALB 5xx Errors
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "ALB 5xx errors > 10"

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  tags = var.tags
}

# Log Group para aplicações
resource "aws_cloudwatch_log_group" "applications" {
  name              = "/aws/${var.project_name}/${var.environment}/applications"
  retention_in_days = 7

  tags = var.tags
}