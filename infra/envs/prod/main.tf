terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.50" }
  }
  # backend "s3" { ... } — see docs/bootstrap.md
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project     = "mf-infra"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  env    = "prod"
  prefix = "mf-sandbox"
  tags   = { Environment = local.env }
}

module "host_site" {
  source              = "../../modules/static-site"
  bucket_name         = "${local.prefix}-host-${local.env}"
  kind                = "host"
  aliases             = var.host_aliases
  acm_certificate_arn = var.acm_certificate_arn
  tags                = local.tags
}

module "catalog_site" {
  source              = "../../modules/static-site"
  bucket_name         = "${local.prefix}-catalog-${local.env}"
  kind                = "remote"
  aliases             = var.catalog_aliases
  acm_certificate_arn = var.acm_certificate_arn
  # Lock CORS to the host domain — no wildcards in prod.
  allowed_origins     = [for h in var.host_aliases : "https://${h}"]
  tags                = local.tags
}

module "account_site" {
  source              = "../../modules/static-site"
  bucket_name         = "${local.prefix}-account-${local.env}"
  kind                = "remote"
  aliases             = var.account_aliases
  acm_certificate_arn = var.acm_certificate_arn
  allowed_origins     = [for h in var.host_aliases : "https://${h}"]
  tags                = local.tags
}

module "github_oidc" {
  source            = "../../modules/github-oidc"
  environment       = local.env
  github_org        = var.github_org
  github_repo       = var.github_repo
  oidc_provider_arn = var.github_oidc_provider_arn
  tags              = local.tags

  site_bucket_arns  = [module.host_site.bucket_arn, module.catalog_site.bucket_arn, module.account_site.bucket_arn]
  distribution_arns = [module.host_site.distribution_arn, module.catalog_site.distribution_arn, module.account_site.distribution_arn]
}

module "ssm_config" {
  source      = "../../modules/ssm-config"
  environment = local.env
  tags        = local.tags
  parameters = {
    "host/catalog_url"      = "https://${module.catalog_site.distribution_domain_name}"
    "host/account_url"      = "https://${module.account_site.distribution_domain_name}"
    "features/promo_banner" = "true"
    "app_version"           = var.app_version
  }
}
