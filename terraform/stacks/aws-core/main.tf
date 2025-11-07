# terraform/stacks/aws-core/main.tf

# VPC Module
module "vpc" {
  source = "../../modules/aws/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]

  tags = {
    Project = "IoT-Predictive-Maintenance"
  }
}