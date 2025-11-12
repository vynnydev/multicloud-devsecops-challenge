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

# FortiGate Module
module "fortinet" {
  source = "../../modules/aws/fortinet"

  project_name           = var.project_name
  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  public_subnet_id       = module.vpc.public_subnet_ids[0]
  private_subnet_id      = module.vpc.private_subnet_ids[0]
  alb_security_group_id  = module.alb.alb_security_group_id
  instance_type          = "t3.small"

  depends_on = [module.vpc, module.alb]
}

# CloudWatch Module
module "cloudwatch" {
  source = "../../modules/aws/cloudwatch"

  project_name        = var.project_name
  environment         = var.environment
  eks_cluster_name    = module.eks.cluster_name
  rds_instance_id     = module.rds.db_instance_id
  kinesis_stream_name = module.kinesis.stream_name
  alb_arn_suffix      = split("/", module.alb.alb_arn)[1]

  depends_on = [module.eks, module.rds, module.kinesis, module.alb]
}

# ECR Module
module "ecr" {
  source = "../../modules/aws/ecr"

  project_name = var.project_name
  environment  = var.environment
  
  repository_names = [
    "iot-ingestion-service",
    "frontend-monitor",
    "frontend-analysis"
  ]
}

# DynamoDB Industry Machines
module "dynamodb_industry" {
  source = "../../modules/aws/dynamodb-industry"

  project_name = var.project_name
  environment  = var.environment
  table_name   = "industry-machines"
}

# DynamoDB Machines Status (para manutenção)
module "dynamodb_maintenance" {
  source = "../../modules/aws/dynamodb-maintenance"

  tags = local.common_tags
}

# ============================================================================
# COGNITO
# ============================================================================

module "cognito" {
  source = "../../modules/aws/cognito"

  project_name = var.project_name
  environment  = var.environment
  tags         = local.common_tags
}

# ============================================================================
# DYNAMODB USERS
# ============================================================================

module "dynamodb_users" {
  source = "../../modules/aws/dynamodb-users"

  project_name = var.project_name
  environment  = var.environment
  tags         = local.common_tags
}

# Lambda Activate Machine Module
module "lambda_activate" {
  source = "../../modules/aws/lambda-activate"

  project_name = var.project_name
  environment  = var.environment
  iot_topic    = "factory/pumps/data"

  depends_on = [module.iot]
}

module "lambda_list_machines" {
  source = "../../modules/aws/lambda-list-machines"

  project_name = var.project_name
  environment  = var.environment
}

# Lambda Register Machine
module "lambda_register_machine" {
  source = "../../modules/aws/lambda-register-machine"

  project_name        = var.project_name
  environment         = var.environment
  dynamodb_table_name = module.dynamodb_industry.table_name

  depends_on = [module.dynamodb_industry]
}

# Lambda List Industry
module "lambda_list_industry" {
  source = "../../modules/aws/lambda-list-industry"

  project_name        = var.project_name
  environment         = var.environment
  dynamodb_table_name = module.dynamodb_industry.table_name

  depends_on = [module.dynamodb_industry]
}

# Lambda Delete Machine
module "lambda_delete_machine" {
  source = "../../modules/aws/lambda-delete-machine"

  project_name        = var.project_name
  environment         = var.environment
  dynamodb_table_name = module.dynamodb_industry.table_name

  depends_on = [module.dynamodb_industry]
}

# ============================================================================
# LAMBDAS DE AUTENTICAÇÃO
# ============================================================================

module "lambda_register_user" {
  source = "../../modules/aws/lambda-register-user"

  project_name           = var.project_name
  environment            = var.environment
  cognito_user_pool_id   = module.cognito.user_pool_id
  cognito_user_pool_arn  = module.cognito.user_pool_arn
  cognito_client_id      = module.cognito.client_id
  dynamodb_table_name    = module.dynamodb_users.table_name
  dynamodb_table_arn     = module.dynamodb_users.table_arn
  tags                   = local.common_tags

  depends_on = [module.cognito, module.dynamodb_users]
}

module "lambda_login_user" {
  source = "../../modules/aws/lambda-login-user"

  project_name           = var.project_name
  environment            = var.environment
  cognito_user_pool_id   = module.cognito.user_pool_id
  cognito_user_pool_arn  = module.cognito.user_pool_arn
  cognito_client_id      = module.cognito.client_id
  dynamodb_table_name    = module.dynamodb_users.table_name
  dynamodb_table_arn     = module.dynamodb_users.table_arn
  tags                   = local.common_tags

  depends_on = [module.cognito, module.dynamodb_users]
}

# ============================================================================
# API GATEWAY
# ============================================================================


# API Gateway Module
module "api_gateway" {
  source = "../../modules/aws/api-gateway"

  project_name = var.project_name
  environment  = var.environment
  
  # Lambdas de máquinas
  lambda_activate_invoke_arn            = module.lambda_activate.invoke_arn
  lambda_activate_function_name         = module.lambda_activate.function_name
  lambda_list_invoke_arn                = module.lambda_list_machines.invoke_arn
  lambda_list_function_name             = module.lambda_list_machines.function_name
  lambda_register_machine_invoke_arn    = module.lambda_register_machine.invoke_arn  # ← CORRIGIDO
  lambda_register_machine_function_name = module.lambda_register_machine.function_name  # ← CORRIGIDO
  lambda_list_industry_invoke_arn       = module.lambda_list_industry.invoke_arn
  lambda_list_industry_function_name    = module.lambda_list_industry.function_name
  lambda_delete_invoke_arn              = module.lambda_delete_machine.invoke_arn
  lambda_delete_function_name           = module.lambda_delete_machine.function_name
  
  # Lambdas de autenticação
  lambda_register_user_invoke_arn       = module.lambda_register_user.invoke_arn  # ← CORRIGIDO
  lambda_register_user_function_name    = module.lambda_register_user.function_name  # ← CORRIGIDO
  lambda_login_invoke_arn               = module.lambda_login_user.invoke_arn
  lambda_login_function_name            = module.lambda_login_user.function_name

  depends_on = [
    module.lambda_activate,
    module.lambda_list_machines,
    module.lambda_register_machine,
    module.lambda_list_industry,
    module.lambda_delete_machine,
    module.lambda_register_user,
    module.lambda_login_user
  ]
}

# Attach ECR Policy to EKS Node Role
resource "aws_iam_role_policy_attachment" "eks_ecr_pull" {
  policy_arn = module.ecr.ecr_pull_policy_arn
  role       = module.eks.node_role_name 
}