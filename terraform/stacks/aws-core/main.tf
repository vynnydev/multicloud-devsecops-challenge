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

# Kinesis Module
module "kinesis" {
  source           = "../../modules/aws/kinesis"
  project_name     = var.project_name
  environment      = var.environment
  stream_name      = "pump-data-stream"
  shard_count      = 1
  retention_period = 24
}

# IoT Core Module
module "iot" {
  source              = "../../modules/aws/iot-core"
  project_name        = var.project_name
  environment         = var.environment
  thing_name          = "PUMP_001"
  kinesis_stream_arn  = module.kinesis.stream_arn
  kinesis_stream_name = module.kinesis.stream_name
  sns_topic_arn       = module.sns.topic_arn

  depends_on = [module.kinesis, module.sns]
}

# EKS Module
module "eks" {
  source = "../../modules/aws/eks"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_instance_type  = "t3.medium"
  node_desired_size   = 2
  node_min_size       = 2
  node_max_size       = 3

  depends_on = [module.vpc]
}

# RDS Aurora Module
module "rds" {
  source = "../../modules/aws/rds"

  project_name               = var.project_name
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  database_subnet_ids        = module.vpc.database_subnet_ids
  allowed_security_group_ids = [module.eks.node_security_group_id]  # ADICIONAR ISSO
  
  instance_class  = "db.t3.micro"
  master_username = "postgres"
  database_name   = "iot_predictive"

  depends_on = [module.vpc, module.eks]
}
# S3 Module
module "s3" {
  source       = "../../modules/aws/s3"
  project_name = var.project_name
  environment  = var.environment
}

# SNS Module
module "sns" {
  source       = "../../modules/aws/sns"
  project_name = var.project_name
  environment  = var.environment
  topic_name   = "iot-events"
}

module "alb" {
  source = "../../modules/aws/alb"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids

  depends_on = [module.vpc]
}