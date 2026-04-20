# Infrastructure

Terraform for the AWS side of the sandbox.

## Layout

```
infra/
├── modules/
│   ├── static-site/          # S3 bucket + CloudFront + OAC per microfrontend
│   ├── github-oidc/          # IAM role trusted by GitHub Actions (per env)
│   └── ssm-config/           # SSM Parameter Store entries for app config
├── envs/
│   ├── dev/                  # dev environment composition
│   └── prod/                 # prod environment composition
└── docs/
    ├── bootstrap.md
    └── state-management.md
```

## Why S3 + CloudFront (and not ECS/App Runner)?

The host and every remote are **static JavaScript bundles**. They have no
server-side rendering, no database, no long-lived process. Module Federation
is a browser-time wiring: the host's runtime fetches `remoteEntry.js` from
each remote's origin, then loads the React trees into its own DOM.

S3 hosts static assets cheaply; CloudFront gives us edge caching, TLS, and
custom domains. Running a Fargate container per microfrontend would pay for
a process that just serves gzipped JS. Use ECS only if a remote grows an API
of its own.

## Key decisions

- **One bucket + one distribution per microfrontend.** Independent deploys
  = independent rollback blast radius. Host at `app.example.com`, catalog at
  `catalog-cdn.example.com`, account at `account-cdn.example.com`.
- **`remoteEntry.js` cache policy = no-cache.** Chunk files (hashed) cache
  for a year, but the manifest entry the host fetches must be fresh.
- **OAC, not public-read.** Buckets stay private; only CloudFront can read
  via Origin Access Control.
- **GitHub OIDC for CI.** No long-lived AWS keys in GitHub secrets.
- **SSM Parameter Store** for config the apps read at build time
  (feature flags, remote URLs). Not Secrets Manager — nothing here is a
  secret, only config.

## Usage

```bash
cd infra/envs/dev
terraform init
terraform plan
terraform apply
```

See `docs/bootstrap.md` for first-time setup (state bucket, OIDC provider).

## Outputs to wire into GitHub

After `apply`, record these and put them in GitHub as repo secrets / vars:

| Output                   | Repo secret/var             | Used by                          |
|--------------------------|-----------------------------|----------------------------------|
| `ci_role_arn`            | `AWS_ROLE_ARN_DEV` (secret) | All deploy workflows             |
| `host_bucket`            | `HOST_BUCKET_DEV` (var)     | `host.yml`                       |
| `host_distribution_id`   | `HOST_DIST_DEV` (var)       | `host.yml` (cache invalidation)  |
| `catalog_bucket`         | `CATALOG_BUCKET_DEV` (var)  | `catalog.yml`                    |
| `catalog_distribution_id`| `CATALOG_DIST_DEV` (var)    | `catalog.yml`                    |
| `account_bucket`         | `ACCOUNT_BUCKET_DEV` (var)  | `account.yml`                    |
| `account_distribution_id`| `ACCOUNT_DIST_DEV` (var)    | `account.yml`                    |
