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

variable "lambda_list_invoke_arn" {
  type = string
}

variable "lambda_list_function_name" {
  type = string
}

variable "lambda_register_invoke_arn" {
  type = string
}

variable "lambda_register_function_name" {
  type = string
}

variable "lambda_list_industry_invoke_arn" {
  type = string
}

variable "lambda_list_industry_function_name" {
  type = string
}

variable "lambda_delete_invoke_arn" {
  type = string
}

variable "lambda_delete_function_name" {
  type = string
}