variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "lambda_activate_invoke_arn" {
  type = string
}

variable "lambda_activate_function_name" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}