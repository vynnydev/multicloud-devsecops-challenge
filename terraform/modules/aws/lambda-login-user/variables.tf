variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "cognito_user_pool_id" {
  type = string
}

variable "cognito_user_pool_arn" {
  type = string
}

variable "cognito_client_id" {
  type = string
}

variable "dynamodb_table_name" {
  type = string
}

variable "dynamodb_table_arn" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}