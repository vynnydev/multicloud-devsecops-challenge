variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "topic_name" {
  type    = string
  default = "iot-events"
}

variable "tags" {
  type    = map(string)
  default = {}
}