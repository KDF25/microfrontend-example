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
  type = string
}

variable "host_aliases" {
  type    = list(string)
  default = []
}

variable "catalog_aliases" {
  type    = list(string)
  default = []
}

variable "account_aliases" {
  type    = list(string)
  default = []
}

variable "acm_certificate_arn" {
  type        = string
  default     = null
  description = "ACM cert in us-east-1 covering every alias."
}

variable "app_version" {
  type    = string
  default = "prod"
}
