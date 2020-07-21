Function CheckEnvironmentVariables($URL, $CLIENTID, $CLIENTPASSWORD) {
    if ($URL -eq "should_be_replaced_from_the_outside") {
        throw "'URL' value is not replaced: " + $URL

        exit 
    }

    if ($CLIENTID -eq "should_be_replaced_from_the_outside") {
        throw "'CLIENTID' value is not replaced: " + $CLIENTID

        exit
    }

    if ($CLIENTPASSWORD -eq "should_be_replaced_from_the_outside") {
        throw "'CLIENTPASSWORD' value is not replaced: " + $CLIENTPASSWORD

        exit
    }
}

Function GetAndSendMetrics($URL, $CLIENTID, $CLIENTPASSWORD) {

    $pair = "$($CLIENTID):$($CLIENTPASSWORD)"
    $encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
    $basicAuthValue = "Basic $encodedCreds"

    $Headers = @{
        Authorization = $basicAuthValue
    }

    Write-Host $basicAuthValue 

    try {
        $rawResponseBody = Invoke-WebRequest -Uri $URL -Method Post -Headers $Headers
        $body = ConvertFrom-Json $rawResponseBody 

        # default availability status is 0
        $EndpointAvailabilityStatus = 0

        if ($body.access_token -And $body.token_type -And $body.expires_in) {
            Write-Host ""
            Write-Host "AccessToken: " $body.access_token
            Write-Host "TokenType: " $body.token_type
            Write-Host "ExpiresIn: " $body.expires_in
            
            $EndpointAvailabilityStatus = 1
        }

        #build metrics
        $EndpointAvailabilityMetricName = MetricBuilder -MetricName "ENDPOINT_AVAILABILITY" -MetricValue $EndpointAvailabilityStatus
        Write-Host $EndpointAvailabilityStatus

        #send metrics
        SendMetric -Metric $EndpointAvailabilityMetricName
        
    } catch {
        Write-Host("Could not call or failed calling endpoint.")
        
        #exit container 
        exit
    }
}

Function MetricBuilder($MetricName, $MetricValue) {
    begin {
        $results = New-Object System.Text.StringBuilder
        $hostname = "powershellexporterscript"
        $instanceName = "custom-prometheus-exporter-powershell"
    }
    process {
        try {
            $result = "{0}{{host=`"{1}`",instance=`"{2}`"}} {3}`n" -f @($MetricName, $hostname, $instanceName, $MetricValue)
            $null = $results.Append($result)
        }
        catch {
            $PSCmdlet.WriteError($PSItem.Exception.ToString())
        }
    }
    end {
        return $results.ToString()
    }
}

Function SendMetric($Metric) {
    # retry mechanism if pushgateway is not reachable -> try 10 times and wait between every request 3 seconds
    $Retries = 10
    $SecondsDelay = 3
    $retryCount = 0
    $completed = $false
    $response = $null

    while (-not $completed) {
        try {
            Write-Host("Sending metric:  $Metric")
            $response = Invoke-WebRequest -Uri "http://prometheus-pushgateway:9091/metrics/job/endpointavailability" -Method Post -Body $Metric
            if ($response.StatusCode -ne 200) {
                throw "Expecting reponse code 200, was: $($response.StatusCode)"
            }
            $completed = $true
        }
        catch {
            if ($retrycount -ge $Retries) {
                Write-Warning "Request to pushgateway failed the maximum number of $retryCount times."
                throw
            }
            else {
                Write-Warning "Request to pushgateway failed. Retrying in $SecondsDelay seconds."
                Start-Sleep $SecondsDelay
                $retrycount++
            }
        }
    }

    Write-Host "OK ($($response.StatusCode))"
    return $response
}

Function SendStatusCode($Error) {
    $ScriptStatus = "METRICS_SCRIPT_STATUS"

    if ($Error) {
        #send status = 0
        $ScriptStatusMetric = MetricBuilder -MetricName $ScriptStatus -MetricValue 0
        SendMetric -Metric $ScriptStatusMetric
    }
    else {
        #send status = 1
        $ScriptStatusMetric = MetricBuilder -MetricName $ScriptStatus -MetricValue 1
        SendMetric -Metric $ScriptStatusMetric
    }
}