<?php

require __DIR__ . '/vendor/autoload.php';

use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;
use Prometheus\Storage\InMemory;

$adapter = new InMemory();
$registry = new CollectorRegistry($adapter);


$renderer = new RenderTextFormat();
$result = $renderer->render($registry->getMetricFamilySamples());

header('Content-type: ' . RenderTextFormat::MIME_TYPE);
echo $result;

while(1) {

    $gauge = $registry->getOrRegisterGauge('test', 'some_gauge', 'it sets', ['type']);
    $gauge->set(2.5, ['blue']);
    
    echo "OK\n";

    sleep(10);
}
