variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "thing_name" {
  type    = string
  default = "PUMP_001"
}

variable "kinesis_stream_arn" {
  type = string
}

variable "kinesis_stream_name" {
  type = string
}

variable "sns_topic_arn" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}