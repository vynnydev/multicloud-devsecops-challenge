variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "repository_names" {
  description = "Lista de nomes dos repositórios ECR"
  type        = list(string)
  default     = [
    "iot-ingestion-service",
    "frontend-monitor",
    "frontend-analysis"
  ]
}

variable "tags" {
  type    = map(string)
  default = {}
}