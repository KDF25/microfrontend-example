variable "environment" {
  type = string
}

variable "github_org" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "oidc_provider_arn" {
  type        = string
  description = "arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com — created once per account."
}

variable "site_bucket_arns" {
  type = list(string)
}

variable "distribution_arns" {
  type = list(string)
}

variable "tags" {
  type    = map(string)
  default = {}
}
