variable "region" {
  type    = string
  default = "us-east-1"
}

variable "github_org" {
  type = string
}

variable "github_repo" {
  type    = string
  default = "mf-infra"
}

variable "github_oidc_provider_arn" {
  type        = string
  description = "ARN of the pre-existing token.actions.githubusercontent.com OIDC provider in this account."
}
