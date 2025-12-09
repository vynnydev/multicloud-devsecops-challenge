# Data source para AMI do FortiGate
data "aws_ami" "fortigate" {
  most_recent = true
  owners      = ["679593333241"]  # Fortinet AWS account

  filter {
    name   = "name"
    values = ["FortiGate-VM64-AWSONDEMAND*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group para FortiGate (Public Interface)
resource "aws_security_group" "fortigate_public" {
  name_prefix = "${var.project_name}-${var.environment}-fortigate-public-"
  description = "Security group for FortiGate public interface"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS from Internet"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP from Internet"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH for management"
  }

  ingress {
    from_port   = 8443
    to_port     = 8443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "FortiGate GUI"
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
      Name = "${var.project_name}-${var.environment}-fortigate-public-sg"
    }
  )
}

# Security Group para FortiGate (Private Interface)
resource "aws_security_group" "fortigate_private" {
  name_prefix = "${var.project_name}-${var.environment}-fortigate-private-"
  description = "Security group for FortiGate private interface"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
    description = "All traffic from VPC"
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
      Name = "${var.project_name}-${var.environment}-fortigate-private-sg"
    }
  )
}

# Network Interface - Public
resource "aws_network_interface" "fortigate_public" {
  subnet_id       = var.public_subnet_id
  security_groups = [aws_security_group.fortigate_public.id]
  source_dest_check = false

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-fortigate-public-eni"
    }
  )
}

# Network Interface - Private
resource "aws_network_interface" "fortigate_private" {
  subnet_id       = var.private_subnet_id
  security_groups = [aws_security_group.fortigate_private.id]
  source_dest_check = false

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-fortigate-private-eni"
    }
  )
}

# Elastic IP para FortiGate
resource "aws_eip" "fortigate" {
  domain = "vpc"
  network_interface = aws_network_interface.fortigate_public.id

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-fortigate-eip"
    }
  )

  depends_on = [aws_network_interface.fortigate_public]
}

# IAM Role para FortiGate (logs e S3)
resource "aws_iam_role" "fortigate" {
  name = "${var.project_name}-${var.environment}-fortigate-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = var.tags
}

# IAM Policy para FortiGate
resource "aws_iam_role_policy" "fortigate" {
  name = "${var.project_name}-${var.environment}-fortigate-policy"
  role = aws_iam_role.fortigate.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance Profile
resource "aws_iam_instance_profile" "fortigate" {
  name = "${var.project_name}-${var.environment}-fortigate-profile"
  role = aws_iam_role.fortigate.name

  tags = var.tags
}

# FortiGate EC2 Instance
resource "aws_instance" "fortigate" {
  ami           = data.aws_ami.fortigate.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.fortigate.key_name

  iam_instance_profile = aws_iam_instance_profile.fortigate.name

  network_interface {
    network_interface_id = aws_network_interface.fortigate_public.id
    device_index         = 0
  }

  network_interface {
    network_interface_id = aws_network_interface.fortigate_private.id
    device_index         = 1
  }

  user_data = <<-EOF
              config system global
                  set hostname "FortiGate-${var.environment}"
                  set admin-sport 8443
              end
              config system interface
                  edit "port1"
                      set mode dhcp
                      set allowaccess ping https ssh http
                  next
                  edit "port2"
                      set mode dhcp
                      set allowaccess ping
                  next
              end
              config firewall policy
                  edit 1
                      set name "Allow-All-Outbound"
                      set srcintf "port2"
                      set dstintf "port1"
                      set srcaddr "all"
                      set dstaddr "all"
                      set action accept
                      set schedule "always"
                      set service "ALL"
                      set nat enable
                  next
              end
              EOF

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-fortigate"
    }
  )
}

# Key Pair para FortiGate
resource "tls_private_key" "fortigate" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "fortigate" {
  key_name   = "${var.project_name}-${var.environment}-fortigate-key"
  public_key = tls_private_key.fortigate.public_key_openssh

  tags = var.tags
}

# CloudWatch Log Group para FortiGate
resource "aws_cloudwatch_log_group" "fortigate" {
  name              = "/aws/fortigate/${var.project_name}-${var.environment}"
  retention_in_days = 7

  tags = var.tags
}