
locals {
  dev_redirect_uris    = ["https://localhost:7083/signin-oidc", "https://${replace(local.name_template, "<service>", "appsrv")}.azurewebsites.net/signin-oidc"]
  nondev_redirect_uris = var.custom_domain_name != "" ? ["https://${var.custom_domain_name}/signin-oidc", "https://${replace(local.name_template, "<service>", "appsrv")}.azurewebsites.net/signin-oidc"] : ["https://${replace(local.name_template, "<service>", "appsrv")}.azurewebsites.net/signin-oidc"]
}

resource "azuread_application" "aadapp" {
  display_name     = format("%s Application %s", var.solution_name, var.stage)
  identifier_uris  = []
  sign_in_audience = "AzureADMyOrg"
  logo_image       = filebase64("icon-192.png")
  web {
    redirect_uris = var.stage == "dev" ? local.dev_redirect_uris : local.nondev_redirect_uris
    logout_url    = var.custom_domain_name != "" ? "https://${var.custom_domain_name}/signout-callback-oidc" : "https://${replace(local.name_template, "<service>", "appsrv")}.azurewebsites.net/signout-callback-oidc"
  }
  api {
    requested_access_token_version = 2
  }
  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000"
    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d" // User.Read
      type = "Scope"
    }
  }
}

resource "azuread_application_password" "aadapppwd" {
  display_name          = "apppwd"
  application_object_id = azuread_application.aadapp.object_id
  end_date_relative     = "17520h"
}

resource "azurerm_key_vault_secret" "aadapppwd-secret" {
  key_vault_id = azurerm_key_vault.kv.id
  name         = "AzureAd--ClientSecret"
  value        = azuread_application_password.aadapppwd.value
}
