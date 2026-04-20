variable "environment" {
  type = string
}

variable "parameters" {
  type        = map(string)
  description = "Map of parameter path suffix -> value. Key 'host/catalog_url' becomes /mf/<env>/host/catalog_url."
}

variable "tags" {
  type    = map(string)
  default = {}
}
