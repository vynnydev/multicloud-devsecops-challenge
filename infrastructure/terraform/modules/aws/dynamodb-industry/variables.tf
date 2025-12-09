variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "table_name" {
  type    = string
  default = "industry-machines"
}

variable "tags" {
  type    = map(string)
  default = {}
}