# Bootstrap

One-time setup per AWS account before `terraform apply` will work.

## 1. Remote state bucket

Create a bucket to hold Terraform state (once per account):

```bash
aws s3api create-bucket \
  --bucket my-tfstate-bucket \
  --region us-east-1

aws s3api put-bucket-versioning \
  --bucket my-tfstate-bucket \
  --versioning-configuration Status=Enabled
```

Then uncomment and fill in the `backend "s3"` block in
`infra/envs/dev/main.tf` and `infra/envs/prod/main.tf`:

```hcl
backend "s3" {
  bucket  = "my-tfstate-bucket"
  key     = "mf-infra/dev.tfstate"   # prod.tfstate for the prod env
  region  = "us-east-1"
  encrypt = true
}
```

## 2. GitHub OIDC provider

Create the identity provider once per AWS account. Subsequent envs share it.

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

Record the returned ARN — it goes into `github_oidc_provider_arn` in
`terraform.tfvars`.

## 3. First apply

```bash
cd infra/envs/dev
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

## 4. Wire GitHub

Add the outputs from `terraform output` to your GitHub repo:
- **Secret** `AWS_ROLE_ARN_DEV` ← `ci_role_arn`
- **Variable** `HOST_BUCKET_DEV`, `HOST_DIST_DEV`, `CATALOG_BUCKET_DEV`,
  `CATALOG_DIST_DEV`, `ACCOUNT_BUCKET_DEV`, `ACCOUNT_DIST_DEV`,
  `MONOLITH_BUCKET_DEV`, `MONOLITH_DIST_DEV`
- **Variable** `CATALOG_URL_DEV` ← `https://<catalog_domain>`
- **Variable** `ACCOUNT_URL_DEV` ← `https://<account_domain>`

Repeat for prod with the `_PROD` suffix.
