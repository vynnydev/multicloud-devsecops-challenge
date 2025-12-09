resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-${var.environment}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "location_id"
    type = "S"
  }

  # GSI para buscar por email
  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }

  # GSI para buscar por location_id
  global_secondary_index {
    name            = "LocationIndex"
    hash_key        = "location_id"
    projection_type = "ALL"
  }

  tags = var.tags
}