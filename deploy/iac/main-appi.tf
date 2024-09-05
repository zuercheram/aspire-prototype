
# application insights in workspace mode

resource "azurerm_log_analytics_workspace" "log" {
  name                = replace(local.name_template, "<service>", "log")
  location            = var.default_location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appi" {
  name                = replace(local.name_template, "<service>", "appi")
  location            = var.default_location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.log.id
  application_type    = "web"
}

output "appi_connection_string" {
  value     = azurerm_application_insights.appi.connection_string
  sensitive = true
}

output "appi_app_id" {
  value = azurerm_application_insights.appi.app_id
}

