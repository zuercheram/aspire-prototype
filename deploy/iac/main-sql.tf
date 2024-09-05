
# sql server and database
locals {
  sql_srv_name = replace(local.name_template, "<service>", "sql")
  sql_db_name  = "${var.solution_name_short}db"
}

## Permission and Role Groups
resource "azuread_group" "role_sql_admin" {
  display_name            = format("ra-%s-administrator", local.sql_srv_name)
  description             = "Role group which grants admininistrative access to SQL Server"
  security_enabled        = true
  members                 = [data.azurerm_client_config.current.object_id, azuread_service_principal.devops.object_id]
  prevent_duplicate_names = true
  lifecycle {
    # apart from setting initially; do not flag changes in members and owners as state change
    ignore_changes = [members, owners]
  }
}
resource "azuread_group" "perm_sql_admin" {
  display_name            = format("pm-%s-administrator", local.sql_srv_name)
  description             = "Permission group granting admininistrative rights to SQL Server"
  security_enabled        = true
  members                 = [azuread_group.role_sql_admin.id]
  prevent_duplicate_names = true
  lifecycle {
    # apart from setting initially; do not flag changes in owners as state change
    ignore_changes = [owners]
  }
}

resource "azuread_group" "role_sqldb_readwrite" {
  display_name            = format("ra-%s-%s-readwrite", local.sql_srv_name, local.sql_db_name)
  description             = "Role group which grants db_reader and db_writer access to SQL Database"
  security_enabled        = true
  members                 = [azurerm_linux_web_app.appsrv.identity.0.principal_id]
  prevent_duplicate_names = true
  lifecycle {
    # apart from setting initially; do not flag changes in members and owners as state change
    ignore_changes = [members, owners]
  }
}
resource "azuread_group" "perm_sqldb_readwrite" {
  display_name            = format("pm-%s-%s-readwrite", local.sql_srv_name, local.sql_db_name)
  description             = "Permission group granting reader/writer rights to SQL Database"
  security_enabled        = true
  members                 = [azuread_group.role_sqldb_readwrite.id]
  prevent_duplicate_names = true
  lifecycle {
    # apart from setting initially; do not flag changes in owners as state change
    ignore_changes = [owners]
  }
}

## SQL Server
resource "azurerm_mssql_server" "sql" {
  name                = local.sql_srv_name
  location            = var.default_location
  resource_group_name = azurerm_resource_group.rg.name
  version             = "12.0"
  azuread_administrator {
    login_username              = azuread_group.perm_sql_admin.display_name
    object_id                   = azuread_group.perm_sql_admin.id
    tenant_id                   = var.tenant_id
    azuread_authentication_only = true
  }
  minimum_tls_version = "1.2"
  tags                = merge(var.service_tags, { description = "App SQL Server" })
  lifecycle {
    ignore_changes = []
  }
}

## SQL Firewall Rule
data "external" "current_ip" {
  program = ["pwsh", "-Command", "curl -s 'https://api.ipify.org?format=json'"]
}

## The Azure feature 'Allow access to Azure services' can be enabled by setting start_ip_address and end_ip_address to 0.0.0.0
resource "azurerm_mssql_firewall_rule" "mssql-fw-rule" {
  name             = "Allow access to Azure services"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_mssql_firewall_rule" "mssql-fw-rule-current" {
  name             = "Deployment Host"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = data.external.current_ip.result.ip
  end_ip_address   = data.external.current_ip.result.ip
}

## SQL Database
resource "azurerm_mssql_database" "sqldb" {
  name           = local.sql_db_name
  server_id      = azurerm_mssql_server.sql.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb    = var.sql_sku_name != "Basic" ? 250 : 1
  read_scale     = false
  sku_name       = var.sql_sku_name
  min_capacity   = var.sql_capacity
  zone_redundant = false
  tags           = merge(var.service_tags, { description = "SQL Database" })
}

resource "null_resource" "sql_db_initialization" {
  triggers = {
    sqldb           = azurerm_mssql_database.sqldb.id
    sqldb_readwrite = azuread_group.perm_sqldb_readwrite.id
  }

  provisioner "local-exec" {
    command     = ".\\Initialize-SqlDatabase.ps1 -ServerInstance \"tcp:${azurerm_mssql_server.sql.name}.database.windows.net,1433\" -Database ${azurerm_mssql_database.sqldb.name} -ReadWriteGroupName ${format("pm-%s-%s-readwrite", local.sql_srv_name, local.sql_db_name)}"
    interpreter = ["pwsh", "-Command"]
  }

  depends_on = [
    azurerm_mssql_database.sqldb,
    azuread_group.perm_sqldb_readwrite,
    azuread_group.role_sqldb_readwrite
  ]
}

resource "azurerm_key_vault_secret" "connectionstring-secret" {
  key_vault_id = azurerm_key_vault.kv.id
  name         = "ConnectionStrings--Database"
  value = format("Server=tcp:%s.database.windows.net,1433;Database=%s;Authentication=Active Directory Default;Trusted_Connection=True;Integrated Security=false;",
  azurerm_mssql_server.sql.name, azurerm_mssql_database.sqldb.name)
}

output "sql_name" {
  value = azurerm_mssql_server.sql.name
}

output "sql_connection_string" {
  value     = azurerm_key_vault_secret.connectionstring-secret.value
  sensitive = true
}
