terraform {
  required_version = "~> 1.4.0"
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.35.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.45.0"
    }
    external = {
      source  = "hashicorp/external"
      version = "~> 2.2.3"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.1"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.4.3"
    }
  }
}
