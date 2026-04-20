variable "bucket_name" {
  type        = string
  description = "Globally-unique S3 bucket name. e.g. mf-sandbox-host-dev."
}

variable "kind" {
  type        = string
  description = "One of: host, remote, monolith. Controls cache behaviors."
  validation {
    condition     = contains(["host", "remote", "monolith"], var.kind)
    error_message = "kind must be host, remote, or monolith."
  }
}

variable "allowed_origins" {
  type        = list(string)
  default     = ["*"]
  description = "CORS origins allowed to fetch this site's assets. Remotes should list the host domain(s) explicitly in prod."
}

variable "aliases" {
  type    = list(string)
  default = []
}

variable "acm_certificate_arn" {
  type    = string
  default = null
  description = "ACM cert ARN in us-east-1. Required if `aliases` is non-empty."
}

variable "force_destroy" {
  type    = bool
  default = false
}

variable "tags" {
  type    = map(string)
  default = {}
}
