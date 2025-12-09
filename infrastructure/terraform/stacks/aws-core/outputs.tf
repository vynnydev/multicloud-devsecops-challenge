# ============================================================================
# VPC OUTPUTS
# ============================================================================

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "database_subnets" {
  description = "Database subnet IDs"
  value       = module.vpc.database_subnet_ids
}

# ============================================================================
# EKS OUTPUTS
# ============================================================================

output "eks_cluster_name" {
  description = "⭐ Nome do cluster EKS"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "configure_kubectl" {
  description = "⭐ Comando para configurar kubectl"
  value       = module.eks.kubeconfig_command
}

# ============================================================================
# RDS OUTPUTS
# ============================================================================

output "rds_endpoint" {
  description = "⭐ RDS PostgreSQL endpoint"
  value       = module.rds.db_instance_endpoint
}

output "rds_address" {
  description = "RDS hostname"
  value       = module.rds.db_instance_address
}

output "rds_database_name" {
  description = "Nome do database"
  value       = module.rds.database_name
}

output "rds_secret_arn" {
  description = "ARN do secret com credenciais RDS"
  value       = module.rds.secret_arn
}

output "rds_credentials_command" {
  description = "Comando para ver credenciais do RDS"
  value       = "aws secretsmanager get-secret-value --secret-id ${module.rds.secret_arn} --query SecretString --output text | jq"
}

# ============================================================================
# S3 OUTPUTS
# ============================================================================

output "s3_bucket_name" {
  description = "Nome do bucket S3 Data Lake"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  value = module.s3.bucket_arn
}

# ============================================================================
# KINESIS OUTPUTS
# ============================================================================

output "kinesis_stream_name" {
  description = "Nome do Kinesis stream"
  value       = module.kinesis.stream_name
}

output "kinesis_stream_arn" {
  value = module.kinesis.stream_arn
}

# ============================================================================
# IOT CORE OUTPUTS
# ============================================================================

output "iot_endpoint" {
  description = "⭐ Endpoint do IoT Core"
  value       = module.iot.iot_endpoint
}

output "iot_thing_name" {
  description = "Nome do IoT Thing"
  value       = module.iot.thing_name
}

output "iot_certificate_pem" {
  description = "Certificado IoT (sensível)"
  value       = module.iot.certificate_pem
  sensitive   = true
}

output "iot_private_key" {
  description = "Chave privada IoT (sensível)"
  value       = module.iot.private_key
  sensitive   = true
}

output "save_iot_certificates_command" {
  description = "Comandos para salvar certificados IoT"
  value = <<-EOT
    # Salvar certificados IoT:
    terraform output -raw iot_certificate_pem > pump-certificate.pem.crt
    terraform output -raw iot_private_key > pump-private.pem.key
    wget https://www.amazontrust.com/repository/AmazonRootCA1.pem
  EOT
}

# ============================================================================
# SNS OUTPUTS
# ============================================================================

output "sns_topic_arn" {
  description = "ARN do SNS topic (para Azure)"
  value       = module.sns.topic_arn
}

output "sns_topic_name" {
  value = module.sns.topic_name
}

# ============================================================================
# ALB OUTPUTS
# ============================================================================

output "alb_dns_name" {
  description = "⭐ DNS do Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  value = module.alb.alb_arn
}

output "frontend_url" {
  description = "⭐ URL do Frontend (via ALB)"
  value       = "http://${module.alb.alb_dns_name}"
}

# ============================================================================
# FORTIGATE OUTPUTS
# ============================================================================

output "fortigate_public_ip" {
  description = "⭐ IP público do FortiGate"
  value       = module.fortinet.fortigate_public_ip
}

output "fortigate_gui_url" {
  description = "⭐ URL da interface web do FortiGate"
  value       = module.fortinet.fortigate_gui_url
}

output "fortigate_credentials" {
  description = "Credenciais do FortiGate"
  value       = module.fortinet.fortigate_default_password
  sensitive   = true
}

output "fortigate_ssh_key" {
  description = "Chave SSH do FortiGate"
  value       = module.fortinet.fortigate_private_key
  sensitive   = true
}

# ============================================================================
# CLOUDWATCH OUTPUTS
# ============================================================================

output "cloudwatch_dashboard_name" {
  description = "Nome do CloudWatch Dashboard"
  value       = module.cloudwatch.dashboard_name
}

output "cloudwatch_log_group" {
  value = module.cloudwatch.log_group_name
}

# ============================================================================
# LAMBDA SIMULATOR OUTPUTS
# ============================================================================

output "lambda_simulator_name" {
  description = "⭐ Lambda Simulador IoT (gera dados a cada 10s)"
  value       = module.lambda_simulator.function_name
}

output "lambda_simulator_logs" {
  description = "Comando para ver logs do simulador"
  value       = "aws logs tail ${module.lambda_simulator.log_group_name} --follow"
}

# ============================================================================
# LAMBDA ACTIVATE OUTPUTS
# ============================================================================

output "lambda_activate_name" {
  description = "Lambda para ativar máquinas"
  value       = module.lambda_activate.function_name
}

# ============================================================================
# API GATEWAY OUTPUTS
# ============================================================================

output "api_gateway_url" {
  description = "⭐ URL base da API Gateway"
  value       = module.api_gateway.api_endpoint
}

output "activate_machine_url" {
  description = "⭐ Endpoint para ativar máquinas (POST)"
  value       = module.api_gateway.activate_url
}

output "api_test_command" {
  description = "Comando para testar a API"
  value = <<-EOT
    curl -X POST ${module.api_gateway.activate_url} \
      -H "Content-Type: application/json" \
      -d '{"machine_id":"PUMP_001","machine_name":"Bomba Centrífuga","model":"BC-2500","action":"activate"}'
  EOT
}

# ============================================================================
# ECR OUTPUTS
# ============================================================================

output "ecr_repositories" {
  description = "⭐ URLs dos repositórios ECR"
  value       = module.ecr.repository_urls
}

output "ecr_login_command" {
  description = "⭐ Comando para login no ECR"
  value       = module.ecr.login_command
}

output "docker_build_and_push_commands" {
  description = "⭐ Comandos completos para build e push"
  value = <<-EOT
    # ===================================================================
    # PASSO 1: Login no ECR
    # ===================================================================
    ${module.ecr.login_command}
    
    # ===================================================================
    # PASSO 2: Build e Push - IoT Ingestion Service
    # ===================================================================
    cd applications/aws-iot-ingestion
    docker build -t ${module.ecr.repository_urls["iot-ingestion-service"]}:latest .
    docker push ${module.ecr.repository_urls["iot-ingestion-service"]}:latest
    
    # ===================================================================
    # PASSO 3: Build e Push - Frontend Monitor
    # ===================================================================
    cd ../frontend-monitor
    docker build -t ${module.ecr.repository_urls["frontend-monitor"]}:latest .
    docker push ${module.ecr.repository_urls["frontend-monitor"]}:latest
    
    # ===================================================================
    # PASSO 4: Build e Push - Frontend Analysis
    # ===================================================================
    cd ../frontend-analysis
    docker build -t ${module.ecr.repository_urls["frontend-analysis"]}:latest .
    docker push ${module.ecr.repository_urls["frontend-analysis"]}:latest
  EOT
}

# ============================================================================
# RESUMO GERAL
# ============================================================================

output "project_summary" {
  description = "⭐⭐⭐ RESUMO DO PROJETO ⭐⭐⭐"
  value = <<-EOT
    
    ╔══════════════════════════════════════════════════════════════════╗
    ║           IoT PREDICTIVE MAINTENANCE - AWS INFRASTRUCTURE        ║
    ╚══════════════════════════════════════════════════════════════════╝
    
    🎯 ENDPOINTS PRINCIPAIS:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    🌐 Frontend:              http://${module.alb.alb_dns_name}
    🔧 FortiGate GUI:         ${module.fortinet.fortigate_gui_url}
    📡 IoT Endpoint:          ${module.iot.iot_endpoint}
    🚀 API Gateway:           ${module.api_gateway.api_endpoint}
    📊 RDS Endpoint:          ${module.rds.db_instance_endpoint}
    
    🔐 ACESSO E CONFIGURAÇÃO:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Configurar kubectl:
    ${module.eks.kubeconfig_command}
    
    Login ECR:
    ${module.ecr.login_command}
    
    Ver credenciais RDS:
    aws secretsmanager get-secret-value --secret-id ${module.rds.secret_arn}
    
    Ver logs simulador:
    aws logs tail ${module.lambda_simulator.log_group_name} --follow
    
    📦 RECURSOS CRIADOS:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    ✅ VPC com subnets públicas/privadas/database
    ✅ EKS Cluster (${module.eks.cluster_name})
    ✅ RDS PostgreSQL (${module.rds.database_name})
    ✅ S3 Data Lake (${module.s3.bucket_name})
    ✅ Kinesis Stream (${module.kinesis.stream_name})
    ✅ IoT Core Thing (${module.iot.thing_name})
    ✅ SNS Topic (${module.sns.topic_name})
    ✅ Application Load Balancer
    ✅ FortiGate Firewall (${module.fortinet.fortigate_public_ip})
    ✅ CloudWatch Dashboard + Alarms
    ✅ Lambda IoT Simulator (${module.lambda_simulator.function_name})
    ✅ Lambda Machine Activator (${module.lambda_activate.function_name})
    ✅ API Gateway REST API
    ✅ 3 Repositórios ECR
    
    🎉 TUDO PRONTO PARA DEPLOY DAS APLICAÇÕES!
    
  EOT
}

output "list_machines_url" {
  description = "⭐ Endpoint para listar máquinas (GET)"
  value       = module.api_gateway.list_machines_url
}

output "register_machine_url" {
  description = "⭐ Endpoint para cadastrar máquina (POST)"
  value       = module.api_gateway.register_machine_url
}

output "list_industry_url" {
  description = "⭐ Endpoint para listar máquinas da indústria (GET)"
  value       = module.api_gateway.list_industry_url
}

output "dynamodb_industry_table" {
  value = module.dynamodb_industry.table_name
}

output "delete_machine_url" {
  description = "⭐ Endpoint para deletar máquina (DELETE)"
  value       = "DELETE ${module.api_gateway.api_endpoint}/machines/{machine_id}"
}

# ============================================================================
# COGNITO OUTPUTS
# ============================================================================

output "cognito_user_pool_id" {
  description = "🔐 Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "🔑 Cognito Client ID (usar no frontend)"
  value       = module.cognito.client_id
}

output "cognito_user_pool_endpoint" {
  description = "🌐 Cognito User Pool Endpoint"
  value       = module.cognito.user_pool_endpoint
}

output "cognito_domain" {
  description = "🌐 Cognito Hosted UI Domain"
  value       = "${module.cognito.domain}.auth.us-east-1.amazoncognito.com"
}

# ============================================================================
# AUTH API ENDPOINTS
# ============================================================================

output "auth_register_url" {
  description = "📝 Endpoint para registro (POST)"
  value       = "${module.api_gateway.api_endpoint}/auth/register"
}

output "auth_login_url" {
  description = "🔐 Endpoint para login (POST)"
  value       = "${module.api_gateway.api_endpoint}/auth/login"
}

# ============================================================================
# DYNAMODB USERS TABLE
# ============================================================================

output "users_table_name" {
  description = "📊 Nome da tabela DynamoDB de usuários"
  value       = module.dynamodb_users.table_name
}

# ============================================================================
# RESUMO DE AUTENTICAÇÃO
# ============================================================================

output "auth_summary" {
  description = "📋 Resumo completo da autenticação"
  value = {
    cognito_user_pool_id = module.cognito.user_pool_id
    cognito_client_id    = module.cognito.client_id
    register_endpoint    = "${module.api_gateway.api_endpoint}/auth/register"
    login_endpoint       = "${module.api_gateway.api_endpoint}/auth/login"
    users_table          = module.dynamodb_users.table_name
  }
}