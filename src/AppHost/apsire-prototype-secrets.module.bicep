targetScope = 'resourceGroup'

@description('')
param location string = resourceGroup().location

@description('')
param principalId string

@description('')
param principalType string


resource keyVault_7l6QMeFJy 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: toLower(take('apsire-prototype-secrets${uniqueString(resourceGroup().id)}', 24))
  location: location
  tags: {
    'aspire-resource-name': 'apsire-prototype-secrets'
  }
  properties: {
    tenantId: tenant().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
  }
}

resource roleAssignment_5wb5Vt413 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault_7l6QMeFJy
  name: guid(keyVault_7l6QMeFJy.id, principalId, subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '00482a5a-887f-4fb3-b363-3b7fe8e74483'))
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '00482a5a-887f-4fb3-b363-3b7fe8e74483')
    principalId: principalId
    principalType: principalType
  }
}

output vaultUri string = keyVault_7l6QMeFJy.properties.vaultUri
