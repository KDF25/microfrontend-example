terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
  # Students: configure a real backend in docs/bootstrap.md before running apply.
  # backend "s3" { ... }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project     = "mf-infra"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  env    = "dev"
  prefix = "mf-sandbox"
  tags   = { Environment = local.env }
}

# --- Microfrontends ----------------------------------------------------------
module "host_site" {
  source      = "../../modules/static-site"
  bucket_name = "${local.prefix}-host-${local.env}"
  kind        = "host"
  force_destroy = true
  tags        = local.tags
}

module "catalog_site" {
  source        = "../../modules/static-site"
  bucket_name   = "${local.prefix}-catalog-${local.env}"
  kind          = "remote"
  force_destroy = true
  # In prod, lock this down to the host's CloudFront domain.
  allowed_origins = ["*"]
  tags            = local.tags
}

module "account_site" {
  source          = "../../modules/static-site"
  bucket_name     = "${local.prefix}-account-${local.env}"
  kind            = "remote"
  force_destroy   = true
  allowed_origins = ["*"]
  tags            = local.tags
}

# Baseline monolith bucket so students can compare the "before" state.
module "monolith_site" {
  source        = "../../modules/static-site"
  bucket_name   = "${local.prefix}-monolith-${local.env}"
  kind          = "monolith"
  force_destroy = true
  tags          = local.tags
}

# --- CI role -----------------------------------------------------------------
module "github_oidc" {
  source            = "../../modules/github-oidc"
  environment       = local.env
  github_org        = var.github_org
  github_repo       = var.github_repo
  oidc_provider_arn = var.github_oidc_provider_arn
  tags              = local.tags

  site_bucket_arns = [
    module.host_site.bucket_arn,
    module.catalog_site.bucket_arn,
    module.account_site.bucket_arn,
    module.monolith_site.bucket_arn,
  ]
  distribution_arns = [
    module.host_site.distribution_arn,
    module.catalog_site.distribution_arn,
    module.account_site.distribution_arn,
    module.monolith_site.distribution_arn,
  ]
}

# --- Runtime config ----------------------------------------------------------
module "ssm_config" {
  source      = "../../modules/ssm-config"
  environment = local.env
  tags        = local.tags
  parameters = {
    "host/catalog_url" = "https://${module.catalog_site.distribution_domain_name}"
    "host/account_url" = "https://${module.account_site.distribution_domain_name}"
    "features/promo_banner" = "false"
    "app_version"       = "dev"
  }
}
