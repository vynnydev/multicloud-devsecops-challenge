variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_id" {
  description = "Subnet pública para FortiGate"
  type        = string
}

variable "private_subnet_id" {
  description = "Subnet privada para FortiGate"
  type        = string
}

variable "alb_security_group_id" {
  description = "Security group do ALB"
  type        = string
}

variable "instance_type" {
  type    = string
  default = "t3.small"  # Mínimo para FortiGate
}

variable "tags" {
  type    = map(string)
  default = {}
}