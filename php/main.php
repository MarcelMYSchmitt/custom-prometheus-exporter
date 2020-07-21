<?php

#declare global variables
$hostname = "phpexporterscript";
$instanceName = "custom-prometheus-exporter-php";

$pushGatewayBasePath="http://prometheus-pushgateway:9091/metrics/job/endpointavailability";
$pushGatewayRelativePath ="/instance/$instanceName/hostname/$hostname";
$pushGatewayFullUrl=$pushGatewayBasePath.$pushGatewayRelativePath;
 
$metricsScriptStatusMetricName = "METRICS_SCRIPT_STATUS";
$endpointAvailabilityMetricName = "ENDPOINT_AVAILABILITY";

# check env variables
if($URL = getenv('URL')) {
  echo "URL: $URL";
  echo "\n";
} else {
    echo "URL variable not set!";
    exit;
}

if($CLIENTID = getenv('CLIENTID')) {
    echo "CLIENTID: $CLIENTID";
    echo "\n";
} else {
    echo "CLIENTID variable not set!";
    exit;
}

if($CLIENTPASSWORD = getenv('CLIENTPASSWORD')) {
    echo "CLIENTPASSWORD: $CLIENTPASSWORD";
    echo "\n";
} else {
    echo "CLIENTPASSWORD variable not set!";
    exit;
}
  
$options = array(
    'http' => array(    
        'header'  => "Authorization: Basic ".base64_encode($CLIENTID.':'.$CLIENTPASSWORD)."\r\n",
        'method'  => 'POST',
    )
);

while (1) {

    try {

        #call endpoint
        $context  = stream_context_create($options);
        $resultJson = file_get_contents($URL, false, $context);
        if ($resultJson === FALSE) { 
        }
        
        echo $resultJson;

        #parse
        $resultObject = json_decode($resultJson);
        
        echo "\n";
        
        #check
        $accessToken = $resultObject -> access_token;
        $tokenType = $resultObject -> token_type;
        $expiresIn = $resultObject -> expires_in;
        
        if ($accessToken && $tokenType && $expiresIn) {
            echo "AccessToken: $accessToken";
            echo "\n";
            echo "TokenType: $tokenType";
            echo "\n";
            echo "ExpiresIn: $expiresIn";    
            echo "\n";

            $endpointAvailabilityStatus = 1;
        } 

       #endpoint status
       $endpointAvailabilityMetric = $endpointAvailabilityMetricName." ".$endpointAvailabilityStatus;
       exec("echo $endpointAvailabilityMetric | curl --data-binary @- $pushGatewayFullUrl");

       echo "\n";

       #script status
       $metricsScriptStatus = 1;
       $metricsScriptStatusMetric = $metricsScriptStatusMetricName." ".$metricsScriptStatus;
       exec("echo $metricsScriptStatusMetric | curl --data-binary @- $pushGatewayFullUrl");

       echo "\n";

       #wait 10 seconds 
       sleep(10);

    } catch (Exception $e) {
        echo 'Exception abgefangen: ',  $e->getMessage(), "\n";

        #set script status to 0 for exception
        $metricsScriptStatus = 0;
        $metricsScriptStatusMetric = $metricsScriptStatusMetricName." ".$metricsScriptStatus;
        exec("echo $endpointAvailabilityMetric | curl --data-binary @- $pushGatewayFullUrl");

        exit;

    }
}

?>