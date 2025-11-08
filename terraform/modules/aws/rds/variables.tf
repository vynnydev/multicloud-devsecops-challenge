variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "database_subnet_ids" {
  description = "IDs das subnets de database"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security groups que podem acessar o RDS"
  type        = list(string)
  default     = []
}

variable "instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.medium"
}

variable "master_username" {
  description = "Username do master"
  type        = string
  default     = "postgres"
}

variable "database_name" {
  description = "Nome do database inicial"
  type        = string
  default     = "iot_predictive"
}

variable "tags" {
  type    = map(string)
  default = {}
}