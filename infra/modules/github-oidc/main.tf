terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

# The OIDC provider is AWS-account-wide — create it once, reuse across envs.
# This module creates the *role* each env assumes.

data "aws_caller_identity" "current" {}

locals {
  # GitHub issues tokens with sub = repo:<org>/<repo>:ref:refs/heads/<branch>
  # or repo:<org>/<repo>:environment:<env>. Both are accepted below.
  trust_subject = "repo:${var.github_org}/${var.github_repo}:*"
}

data "aws_iam_policy_document" "trust" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [var.oidc_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [local.trust_subject]
    }
  }
}

resource "aws_iam_role" "ci" {
  name               = "mf-ci-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.trust.json
  tags               = var.tags
}

# Minimal CI policy: push to the three site buckets + create CloudFront
# invalidations + read SSM config. No IAM, no EC2, no broad permissions.
data "aws_iam_policy_document" "ci" {
  statement {
    sid    = "S3Sync"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = concat(
      [for b in var.site_bucket_arns : b],
      [for b in var.site_bucket_arns : "${b}/*"],
    )
  }
  statement {
    sid    = "CloudFrontInvalidate"
    effect = "Allow"
    actions = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = var.distribution_arns
  }
  statement {
    sid       = "SSMReadConfig"
    effect    = "Allow"
    actions   = ["ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath"]
    resources = ["arn:aws:ssm:*:${data.aws_caller_identity.current.account_id}:parameter/mf/${var.environment}/*"]
  }
}

resource "aws_iam_role_policy" "ci" {
  role   = aws_iam_role.ci.id
  name   = "mf-ci-${var.environment}"
  policy = data.aws_iam_policy_document.ci.json
}
