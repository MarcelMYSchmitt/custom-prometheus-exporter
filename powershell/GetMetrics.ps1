
#Requires -Version 3.0

Param(
    [Parameter(Mandatory = $True)]
    [string]
    $URL,

    [Parameter(Mandatory = $True)]
    [string]
    $CLIENTID,

    [Parameter(Mandatory = $True)]
    [string]
    $CLIENTPASSWORD
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/Functions.ps1"

#output for debug 
Write-Host "Using URL: $URL"
Write-Host "Using CLIENTID: $CLIENTID"
Write-Host "Using CLIENTPASSWORD: $CLIENTPASSWORD"

CheckEnvironmentVariables -URL $URL -CLIENTID $CLIENTID -CLIENTPASSWORD $CLIENTPASSWORD

try {

    while ($true) {
            
        #get metric and send it to pushgateway
        GetAndSendMetrics -URL $URL -CLIENTID $CLIENTID -CLIENTPASSWORD $CLIENTPASSWORD
           
        #send status code for running script
        SendStatusCode -Error $false

        #wait seconds 
        Start-Sleep -s 10
    }
} catch {
    #send status code for error in running script
    SendStatusCode -Error $true
    throw "Error on executing 'GetMetrics.ps1' script. Is Pushgateway running?"        
}