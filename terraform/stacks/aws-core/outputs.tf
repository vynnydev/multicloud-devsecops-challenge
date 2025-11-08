# terraform/stacks/aws-core/outputs.tf

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_instance_endpoint
}

output "rds_address" {
  description = "RDS hostname"
  value       = module.rds.db_instance_address
}

output "rds_secret_arn" {
  description = "ARN do secret com credenciais RDS"
  value       = module.rds.secret_arn
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "sns_topic_arn" {
  value = module.sns.topic_arn
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "configure_kubectl" {
  value = module.eks.kubeconfig_command
}

output "alb_dns_name" {
  description = "⭐ URL do Load Balancer"
  value       = module.alb.alb_dns_name
}

output "frontend_url" {
  description = "⭐ Acesse o frontend aqui"
  value       = "http://${module.alb.alb_dns_name}"
}