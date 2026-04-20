terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

# Plain config values the apps read at build/runtime. None of these are
# secrets. If something *is* a secret (API keys, DB creds) put it in Secrets
# Manager instead.
resource "aws_ssm_parameter" "entries" {
  for_each = var.parameters

  name        = "/mf/${var.environment}/${each.key}"
  type        = "String"
  value       = each.value
  description = "mf-infra config ${each.key}"
  tags        = var.tags
}
