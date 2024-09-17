targetScope = 'resourceGroup'

@description('')
param location string = resourceGroup().location

@description('')
param sku string = 'Standard'

@description('')
param principalId string

@description('')
param principalType string


resource serviceBusNamespace_cuh6MPJ70 'Microsoft.ServiceBus/namespaces@2021-11-01' = {
  name: toLower(take('messaging${uniqueString(resourceGroup().id)}', 24))
  location: location
  tags: {
    'aspire-resource-name': 'messaging'
  }
  sku: {
    name: sku
  }
  properties: {
    disableLocalAuth: true
  }
}

resource roleAssignment_jYG2YI4sx 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: serviceBusNamespace_cuh6MPJ70
  name: guid(serviceBusNamespace_cuh6MPJ70.id, principalId, subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '090c5cfd-751d-490a-894a-3ce6f1109419'))
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '090c5cfd-751d-490a-894a-3ce6f1109419')
    principalId: principalId
    principalType: principalType
  }
}

output serviceBusEndpoint string = serviceBusNamespace_cuh6MPJ70.properties.serviceBusEndpoint
