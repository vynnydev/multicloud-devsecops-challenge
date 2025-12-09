# S3 Bucket para Data Lake
resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project_name}-${var.environment}-${var.bucket_name_suffix}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-data-lake"
    }
  )
}

# Bloquear acesso público
resource "aws_s3_bucket_public_access_block" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versionamento
resource "aws_s3_bucket_versioning" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Criptografia
resource "aws_s3_bucket_server_side_encryption_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle para economizar (move dados antigos para Glacier)
resource "aws_s3_bucket_lifecycle_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    id     = "archive-old-data"
    status = "Enabled"

    filter {
      prefix = ""  # Aplica a todos os objetos
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 365
    }
  }
}

# Organização de pastas (via prefixos)
resource "aws_s3_object" "folders" {
  for_each = toset([
    "raw-data/",
    "processed-data/",
    "backups/",
    "logs/"
  ])

  bucket  = aws_s3_bucket.data_lake.id
  key     = each.value
  content = ""
}