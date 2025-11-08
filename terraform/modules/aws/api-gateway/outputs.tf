output "api_endpoint" {
  value = aws_api_gateway_stage.prod.invoke_url
}

output "activate_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/machines/activate"
}

output "api_id" {
  value = aws_api_gateway_rest_api.main.id
}

output "list_machines_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/machines"
}

output "register_machine_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/machines"
}

output "list_industry_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/machines/industry"
}

output "delete_machine_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/machines/{machine_id}"
}