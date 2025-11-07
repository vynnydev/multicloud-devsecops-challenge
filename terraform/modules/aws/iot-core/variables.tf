# terraform/modules/aws/iot/variables.tf

variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
}

variable "kinesis_stream_arn" {
  description = "ARN do Kinesis Data Stream"
  type        = string
}

variable "kinesis_stream_name" {
  description = "Nome do Kinesis Data Stream"
  type        = string
}

variable "thing_name" {
  description = "Nome do IoT Thing"
  type        = string
  default     = "PUMP_001"
}

variable "tags" {
  description = "Tags comuns"
  type        = map(string)
  default     = {}
}