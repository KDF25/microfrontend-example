output "ci_role_arn" {
  value = module.github_oidc.ci_role_arn
}

output "host_bucket"            { value = module.host_site.bucket_name }
output "host_distribution_id"   { value = module.host_site.distribution_id }
output "host_domain"            { value = module.host_site.distribution_domain_name }

output "catalog_bucket"         { value = module.catalog_site.bucket_name }
output "catalog_distribution_id"{ value = module.catalog_site.distribution_id }
output "catalog_domain"         { value = module.catalog_site.distribution_domain_name }

output "account_bucket"         { value = module.account_site.bucket_name }
output "account_distribution_id"{ value = module.account_site.distribution_id }
output "account_domain"         { value = module.account_site.distribution_domain_name }

output "monolith_bucket"        { value = module.monolith_site.bucket_name }
output "monolith_distribution_id" { value = module.monolith_site.distribution_id }
output "monolith_domain"        { value = module.monolith_site.distribution_domain_name }
