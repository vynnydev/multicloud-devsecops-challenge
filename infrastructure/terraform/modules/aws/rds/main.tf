# Senha aleatória para o RDS
resource "random_password" "master_password" {
  length  = 16
  special = true
}

# Secrets Manager para guardar a senha
resource "aws_secretsmanager_secret" "rds_password" {
  name                    = "${var.project_name}-${var.environment}-rds-password-v2"  # ← ADICIONAR -v2
  description             = "RDS master password"
  recovery_window_in_days = 0  # ← IMPORTANTE: Permite deletar imediatamente

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "rds_password" {
  secret_id = aws_secretsmanager_secret.rds_password.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master_password.result
    engine   = "postgres"
    host     = aws_db_instance.postgres.address
    port     = 5432
    dbname   = var.database_name
  })
}

# Subnet Group
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-${var.environment}-postgres-subnet-group"
  subnet_ids = var.database_subnet_ids

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-postgres-subnet-group"
    }
  )
}

# Security Group para RDS
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-${var.environment}-rds-"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "PostgreSQL from EKS"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-rds-sg"
    }
  )

  lifecycle {
    create_before_destroy = true
  }
}

# RDS PostgreSQL Instance (FREE TIER)
resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-${var.environment}-postgres"
  
  # Engine
  engine         = "postgres"
  engine_version = "15"
  
  # Instance
  instance_class    = "db.t3.micro"  # FREE TIER ELIGIBLE
  allocated_storage = 20              # FREE TIER: até 20GB
  storage_type      = "gp2"
  storage_encrypted = true
  
  # Database
  db_name  = var.database_name
  username = var.master_username
  password = random_password.master_password.result
  port     = 5432
  
  # Network
  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  
  # Backup
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  # Options
  skip_final_snapshot       = true  # Para facilitar destroy no festival
  deletion_protection       = false
  auto_minor_version_upgrade = true
  
  # Performance Insights (opcional, desabilitar para economizar)
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-postgres"
    }
  )
}