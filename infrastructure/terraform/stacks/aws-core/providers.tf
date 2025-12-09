terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "IoT-Predictive-Maintenance"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Vini"
    }
  }
}

# Lambda Simulator Module
module "lambda_simulator" {
  source = "../../modules/aws/lambda-simulator"

  project_name = var.project_name
  environment  = var.environment
  iot_topic    = "factory/pumps/data"

  depends_on = [module.iot]
}