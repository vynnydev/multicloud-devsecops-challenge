resource "aws_dynamodb_table" "machines_status" {
  name           = "machines-status"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "machine_id"
  range_key      = "timestamp"

  attribute {
    name = "machine_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = var.tags
}