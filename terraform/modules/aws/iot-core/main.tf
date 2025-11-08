# IoT Thing
resource "aws_iot_thing" "pump" {
  name = var.thing_name

  attributes = {
    DeviceType = "centrifugal_pump"
    Location   = "factory_floor_A"
    Model      = "PUMP-2024"
  }
}

# IoT Certificate
resource "aws_iot_certificate" "pump_cert" {
  active = true
}

# IoT Policy
resource "aws_iot_policy" "pump_policy" {
  name = "${var.project_name}-${var.environment}-pump-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["iot:Connect"]
        Resource = ["arn:aws:iot:*:*:client/${var.thing_name}"]
      },
      {
        Effect   = "Allow"
        Action   = ["iot:Publish"]
        Resource = [
          "arn:aws:iot:*:*:topic/factory/pumps/data",
          "arn:aws:iot:*:*:topic/factory/pumps/alerts"
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["iot:Subscribe"]
        Resource = ["arn:aws:iot:*:*:topicfilter/factory/pumps/commands/*"]
      },
      {
        Effect   = "Allow"
        Action   = ["iot:Receive"]
        Resource = ["arn:aws:iot:*:*:topic/factory/pumps/commands/*"]
      }
    ]
  })
}

# Attach policy to certificate
resource "aws_iot_policy_attachment" "pump_policy_attachment" {
  policy = aws_iot_policy.pump_policy.name
  target = aws_iot_certificate.pump_cert.arn
}

# Attach certificate to thing
resource "aws_iot_thing_principal_attachment" "pump_cert_attachment" {
  principal = aws_iot_certificate.pump_cert.arn
  thing     = aws_iot_thing.pump.name
}

# IAM Role for IoT to write to Kinesis
resource "aws_iam_role" "iot_kinesis_role" {
  name = "${var.project_name}-${var.environment}-iot-kinesis-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "iot.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = var.tags
}

# IAM Policy for Kinesis
resource "aws_iam_role_policy" "iot_kinesis_policy" {
  name = "${var.project_name}-${var.environment}-iot-kinesis-policy"
  role = aws_iam_role.iot_kinesis_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["kinesis:PutRecord", "kinesis:PutRecords"]
        Resource = var.kinesis_stream_arn
      }
    ]
  })
}

# IAM Role for IoT to publish to SNS
resource "aws_iam_role" "iot_sns_role" {
  name = "${var.project_name}-${var.environment}-iot-sns-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "iot.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = var.tags
}

# IAM Policy for SNS
resource "aws_iam_role_policy" "iot_sns_policy" {
  name = "${var.project_name}-${var.environment}-iot-sns-policy"
  role = aws_iam_role.iot_sns_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["sns:Publish"]
        Resource = var.sns_topic_arn
      }
    ]
  })
}

# IoT Rule: Dados → Kinesis
resource "aws_iot_topic_rule" "pump_data_to_kinesis" {
  name        = "${replace(var.project_name, "-", "_")}_${var.environment}_pump_kinesis"
  description = "Route pump sensor data to Kinesis"
  enabled     = true
  sql         = "SELECT * FROM 'factory/pumps/data'"
  sql_version = "2016-03-23"

  kinesis {
    stream_name   = var.kinesis_stream_name
    role_arn      = aws_iam_role.iot_kinesis_role.arn
    partition_key = "$${device_id}"
  }

  tags = var.tags
}

# IoT Rule: Anomalias → SNS (para Azure)
resource "aws_iot_topic_rule" "anomaly_to_sns" {
  name        = "${replace(var.project_name, "-", "_")}_${var.environment}_anomaly_sns"
  description = "Route anomalies to SNS for Azure"
  enabled     = true
  sql         = "SELECT * FROM 'factory/pumps/data' WHERE anomaly_detected = true"
  sql_version = "2016-03-23"

  sns {
    target_arn = var.sns_topic_arn
    role_arn   = aws_iam_role.iot_sns_role.arn
  }

  tags = var.tags
}

# IoT Endpoint
data "aws_iot_endpoint" "endpoint" {
  endpoint_type = "iot:Data-ATS"
}