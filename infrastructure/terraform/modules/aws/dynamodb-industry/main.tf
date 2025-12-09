resource "aws_dynamodb_table" "industry_machines" {
  name           = "${var.project_name}-${var.environment}-${var.table_name}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "machine_id"

  attribute {
    name = "machine_id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = false
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-industry-machines"
    }
  )
}