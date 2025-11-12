variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

# ============================================================================
# LAMBDAS DE MÁQUINAS
# ============================================================================

variable "lambda_activate_invoke_arn" {
  description = "ARN de invocação da Lambda Activate Machine"
  type        = string
}

variable "lambda_activate_function_name" {
  description = "Nome da função Lambda Activate Machine"
  type        = string
}

variable "lambda_list_invoke_arn" {
  description = "ARN de invocação da Lambda List Machines (manutenção)"
  type        = string
}

variable "lambda_list_function_name" {
  description = "Nome da função Lambda List Machines"
  type        = string
}

variable "lambda_register_machine_invoke_arn" {
  description = "ARN de invocação da Lambda Register Machine (cadastro na indústria)"
  type        = string
}

variable "lambda_register_machine_function_name" {
  description = "Nome da função Lambda Register Machine"
  type        = string
}

variable "lambda_list_industry_invoke_arn" {
  description = "ARN de invocação da Lambda List Industry"
  type        = string
}

variable "lambda_list_industry_function_name" {
  description = "Nome da função Lambda List Industry"
  type        = string
}

variable "lambda_delete_invoke_arn" {
  description = "ARN de invocação da Lambda Delete Machine"
  type        = string
}

variable "lambda_delete_function_name" {
  description = "Nome da função Lambda Delete Machine"
  type        = string
}

# ============================================================================
# LAMBDAS DE AUTENTICAÇÃO
# ============================================================================

variable "lambda_register_user_invoke_arn" {
  description = "ARN de invocação da Lambda Register User (autenticação)"
  type        = string
}

variable "lambda_register_user_function_name" {
  description = "Nome da função Lambda Register User"
  type        = string
}

variable "lambda_login_invoke_arn" {
  description = "ARN de invocação da Lambda Login"
  type        = string
}

variable "lambda_login_function_name" {
  description = "Nome da função Lambda Login"
  type        = string
}