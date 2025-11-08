output "fortigate_public_ip" {
  description = "IP público do FortiGate"
  value       = aws_eip.fortigate.public_ip
}

output "fortigate_instance_id" {
  value = aws_instance.fortigate.id
}

output "fortigate_gui_url" {
  description = "URL da interface web do FortiGate"
  value       = "https://${aws_eip.fortigate.public_ip}:8443"
}

output "fortigate_private_key" {
  description = "Chave privada SSH do FortiGate"
  value       = tls_private_key.fortigate.private_key_pem
  sensitive   = true
}

output "fortigate_default_password" {
  description = "Senha padrão (Instance ID)"
  value       = "Default password is the instance ID: ${aws_instance.fortigate.id}"
}

output "fortigate_security_group_id" {
  value = aws_security_group.fortigate_public.id
}