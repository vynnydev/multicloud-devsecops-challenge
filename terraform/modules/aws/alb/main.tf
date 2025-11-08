# Security Group for ALB
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-${var.environment}-alb-"
  description = "Security group for Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
      Name = "${var.project_name}-${var.environment}-alb-sg"
    }
  )

  lifecycle {
    create_before_destroy = true
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false
  enable_http2              = true

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-alb"
    }
  )
}

# Target Group (será usado pelo Kubernetes Ingress)
resource "aws_lb_target_group" "frontend" {
  name     = "${var.project_name}-${var.environment}-frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-frontend-tg"
    }
  )
}

# Listener HTTP
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  tags = var.tags
}