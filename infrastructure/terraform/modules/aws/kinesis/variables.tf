variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "stream_name" {
  type    = string
  default = "pump-data-stream"
}

variable "shard_count" {
  type    = number
  default = 1
}

variable "retention_period" {
  type    = number
  default = 24
}

variable "tags" {
  type    = map(string)
  default = {}
}