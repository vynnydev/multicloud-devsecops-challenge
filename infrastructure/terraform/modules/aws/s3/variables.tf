variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "bucket_name_suffix" {
  description = "Sufixo do bucket (será: project-env-suffix)"
  type        = string
  default     = "data-lake"
}

variable "tags" {
  type    = map(string)
  default = {}
}