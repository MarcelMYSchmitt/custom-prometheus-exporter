var express = require("express");
const kubeProbe = require('kube-probe');
const promClient = require('prom-client');
var request = require('request');
var sleep = require('system-sleep');


/*
#########################################################

Example HTTP SERVER

#########################################################
*/

var app = express();
var router = express.Router();

var path = __dirname + '/';

router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.use(express.static(path));
app.use("/", router);

app.listen(8080, function () {
  console.log('HTTP Web Server is running on internal port 8080!')
})


/*
#########################################################

MONITORING SERVER
https://github.com/siimon/prom-client


#########################################################
*/

const URL = process.env.URL;
checkIfNullOrEmpty('URL', URL);

const CLIENTID = process.env.CLIENTID;
checkIfNullOrEmpty('CLIENTID', CLIENTID);

const CLIENTPASSWORD = process.env.CLIENTPASSWORD;
checkIfNullOrEmpty('CLIENTPASSWORD', CLIENTPASSWORD);

const metricServer = express();
const register = new promClient.Registry();

const gauge = new promClient.Gauge({ name: 'ENDPOINT_AVAILABILITY', help: 'Shows Availability of Endpoint.' });
register.registerMetric(gauge);

metricServer.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});


console.log('Server listening to 3001, metrics exposed on "/metrics" endpoint');
metricServer.listen(3001)

/*
#########################################################

LIVENESS AND READINESS PROBES IN K8S
https://github.com/nodeshift/kube-probe

#########################################################
*/

const options = {
  readinessURL: '/health/readiness',
  livenessURL: '/health/liveness'
}

console.log('Server listening to 3001, liveness and readiness exposed via "/health/readiness" and "/health/liveness" endpoints');
kubeProbe(metricServer, options);

while (1) {
  CallEndpointAndSetAvailabilityMetric();
  sleep(10000);
}


// CHECK ENV VARIABLES
function checkIfNullOrEmpty(parameterName, parameterValue) {
  if (!parameterValue) {
    throw new Error(`${parameterName} is null or empty!`);
  }

  console.log(`${parameterName}: ${parameterValue}`);
}


// CALL AND SET ENDPOINT AVAILABILITY METRIC
function CallEndpointAndSetAvailabilityMetric() {
  $pair = CLIENTID + ":" + CLIENTPASSWORD;
  basicAuth = "Basic " + Buffer.from($pair).toString('base64');

  try {
    request.post(
      {
        url: URL,
        headers: {
          "Authorization": basicAuth
        }
      },
      function (error, response, body) {
        console.log(body);

        var jsonObj = JSON.parse(body);

        if (jsonObj.access_token && jsonObj.token_type && jsonObj.expires_in) {
          console.log(`AccessToken: ${jsonObj.access_token} `);
          console.log(`TokenType: ${jsonObj.token_type} `);
          console.log(`ExpiresIn: ${jsonObj.expires_in} `);

          console.log("Set Status of Metric to 1");

          gauge.set(1);
        } else {

          console.log("Set Status of Metric to 0");

          gauge.set(0);
        }
      }
    );
  } catch{

    console("Set Status of Metric to 0");

    gauge.set(0);
  }
}