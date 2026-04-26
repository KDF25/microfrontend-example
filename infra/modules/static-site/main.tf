terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

# --- Bucket ------------------------------------------------------------------
resource "aws_s3_bucket" "site" {
  bucket        = var.bucket_name
  force_destroy = var.force_destroy

  tags = merge(var.tags, {
    Name = var.bucket_name
    Role = "mf-static-site"
  })
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Enabled"
  }
}

# --- Origin Access Control ---------------------------------------------------
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# --- Cache policies ----------------------------------------------------------
# remoteEntry.js must NEVER be cached at the edge — it's the manifest the host
# fetches on every page load to discover which chunks make up the remote.
# If it's stale, users see a broken pairing between host and remote chunks.
resource "aws_cloudfront_cache_policy" "no_cache" {
  name        = "${var.bucket_name}-no-cache"
  default_ttl = 0
  min_ttl     = 0
  max_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = false
    enable_accept_encoding_brotli = false
    cookies_config { cookie_behavior = "none" }
    headers_config { header_behavior = "none" }
    query_strings_config { query_string_behavior = "none" }
  }
}

# --- Distribution ------------------------------------------------------------
locals {
  origin_id = "s3-${var.bucket_name}"
  is_remote = var.kind == "remote"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.bucket_name} (${var.kind})"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = var.aliases

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = local.origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  # Default behavior: cache hashed assets aggressively.
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id
    viewer_protocol_policy = "redirect-to-https"
    # Managed "CachingOptimized" policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    compress        = true
    response_headers_policy_id = local.is_remote ? aws_cloudfront_response_headers_policy.cors[0].id : null
  }

  # Remotes: carve out remoteEntry.js with a no-cache behavior + CORS headers.
  dynamic "ordered_cache_behavior" {
    for_each = local.is_remote ? [1] : []
    content {
      path_pattern           = "/remoteEntry.js"
      allowed_methods        = ["GET", "HEAD"]
      cached_methods         = ["GET", "HEAD"]
      target_origin_id       = local.origin_id
      viewer_protocol_policy = "redirect-to-https"
      cache_policy_id        = aws_cloudfront_cache_policy.no_cache.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.cors[0].id
      compress               = true
    }
  }

  # SPA fallback: any 403/404 from S3 becomes a 200 with index.html so
  # react-router can resolve client-side. Only the host needs this; remotes
  # are not browsed to directly.
  dynamic "custom_error_response" {
    for_each = var.kind == "host" ? [403, 404] : []
    content {
      error_code            = custom_error_response.value
      response_code         = 200
      response_page_path    = "/index.html"
      error_caching_min_ttl = 0
    }
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == null
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = var.acm_certificate_arn == null ? null : "sni-only"
    minimum_protocol_version       = var.acm_certificate_arn == null ? "TLSv1" : "TLSv1.2_2021"
  }

  tags = merge(var.tags, {
    Name = var.bucket_name
    Kind = var.kind
  })
}

# CORS on the remote so the host (different origin) can fetch remoteEntry.js.
resource "aws_cloudfront_response_headers_policy" "cors" {
  count = local.is_remote ? 1 : 0
  name  = "${var.bucket_name}-cors"

  cors_config {
    access_control_allow_credentials = false
    access_control_allow_headers { items = ["*"] }
    access_control_allow_methods { items = ["GET", "HEAD"] }
    access_control_allow_origins { items = var.allowed_origins }
    origin_override = true
  }
}

# --- Bucket policy: allow the distribution to read --------------------------
data "aws_iam_policy_document" "bucket" {
  statement {
    sid     = "AllowCloudFrontRead"
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.bucket.json
}
