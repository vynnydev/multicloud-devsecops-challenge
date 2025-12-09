variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "iot_topic" {
  type    = string
  default = "factory/pumps/data"
}

variable "tags" {
  type    = map(string)
  default = {}
}