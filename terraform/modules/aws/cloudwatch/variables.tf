variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "eks_cluster_name" {
  type = string
}

variable "rds_instance_id" {
  type = string
}

variable "kinesis_stream_name" {
  type = string
}

variable "alb_arn_suffix" {
  description = "ARN suffix do ALB"
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}