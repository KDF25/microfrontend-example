# Terraform state

## What's in state
- VPC-less infra: buckets, distributions, OAC, IAM role, SSM params.
- No secrets — SSM entries here are non-sensitive config.

## Why remote state
- Multiple students/mentors apply from different laptops.
- Prevents "I ran apply on my machine" drift.
- State bucket is versioned, so a bad apply is recoverable.

## Locking
For this sandbox we skip DynamoDB locking (single-writer workflows are
fine for a study environment). In production, add it:

```hcl
backend "s3" {
  bucket         = "my-tfstate-bucket"
  key            = "mf-infra/prod.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "my-tfstate-lock"
}
```

## Drift discipline
- GitHub Actions is the only writer for content in S3 (via `aws s3 sync`).
- Terraform is the only writer for infra shape.
- Never change cache behaviors or IAM by hand — it drifts silently.
