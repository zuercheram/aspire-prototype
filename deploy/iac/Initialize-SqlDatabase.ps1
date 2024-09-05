param (
    [string] $ServerInstance,
    [string] $Database,
    [string] $ReadWriteGroupName
)

Import-Module SqlServer

# get token from current az cli context
$access_token = (az account get-access-token --resource=https://database.windows.net --query accessToken --output tsv)

# query to grant permissions, etc.
$sql = "
CREATE USER [$ReadWriteGroupName] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [$ReadWriteGroupName]
ALTER ROLE db_datawriter ADD MEMBER [$ReadWriteGroupName]
"

Invoke-SqlCmd -ServerInstance $ServerInstance -Database $Database -AccessToken $access_token -Query $sql
