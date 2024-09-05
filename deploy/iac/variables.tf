variable "env_code" {
  type        = string
  description = "Environment Code (e.g. abcd-09)"
}
variable "default_location" {
  type        = string
  description = "Default Azure resource location"
}
variable "resource_group_tags" {
  type        = map(string)
  default     = {}
  description = "Base set of tags to apply to the Azure resource group."
}
variable "service_tags" {
  type        = map(string)
  default     = {}
  description = "Base set of tags to apply to Azure services."
}
variable "stage" {
  type        = string
  description = "Deployment stage"
  validation {
    condition     = contains(["prod", "int", "test", "dev"], var.stage)
    error_message = "Deployment stage must be one of 'prod', 'int', 'test', 'dev'."
  }
}
variable "customer" {
  type        = string
  description = "Customer Alias"
}
variable "subscription_id" {
  type        = string
  description = "Azure subscription ID"
}
variable "tenant_id" {
  type        = string
  description = "Azure AD tenant ID"
}
variable "solution_name" {
  type        = string
  description = "Solution name"
}
variable "solution_name_short" {
  type        = string
  description = "Solution Name (short)"
}
# variable "secret_reset" {
#   type        = bool
#   default     = false
#   description = "terraform will reset admin passwords and secrets if set to 'true'"
# }
variable "sql_sku_name" {
  type        = string
  description = "SQL Server SKU"
}
variable "sql_capacity" {
  type        = number
  description = "SQL Server capacity / DTUs"
}
variable "app_worker_count" {
  type        = number
  description = "Number of App Instances/Workers"
}
variable "app_sku_name" {
  type        = string
  description = "App Plan SKU e.g B1, S1, P1v2, I1v1, P1v3, I1v2 (1-3)"
}
variable "custom_domain_name" {
  type        = string
  description = "Custom Domain Name for App Srvice"
}
