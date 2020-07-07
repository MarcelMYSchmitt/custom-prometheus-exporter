using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Prometheus;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace CustomPrometheusExporter
{
    public class MetricService
    {
        private static MetricClient _metricClient;

        private static Gauge _endpointGeneralAvailabilityStatus;

        const int ok = 1;
        const int error = 0;

        public void Initialize(EnvironmentConfiguration environmentConfiguration)
        {

            var httpClient = new HttpClient();
            _metricClient = new MetricClient(httpClient, environmentConfiguration);


            _endpointGeneralAvailabilityStatus = Metrics.CreateGauge($"ENDPOINT_AVAILABILITY", "Shows Availability of Endpoint.");
        }

        public async Task CheckEndpointAvailabilityServiceAsync()
        {
            var response = await _metricClient.CheckEndpointAvailabilityClientAsync();
            Console.WriteLine($"Received response code {response.StatusCode} from CheckEndpointAvailabilityClientAsync function.");

            if (!response.IsSuccessStatusCode)
            {
                _endpointGeneralAvailabilityStatus.Set(error);
            }
            else
            {
                var httpResponseResult = response.Content.ReadAsStringAsync().ContinueWith(task => task.Result).Result;
                var data = JObject.Parse(httpResponseResult);
                
                var accessTokenJToken = data.SelectToken("access_token");
                var accessToken = accessTokenJToken.ToObject<string>();

                var tokenTypeJToken= data.SelectToken("token_type");
                var tokenType = tokenTypeJToken.ToObject<string>();

                if (accessToken != null && tokenType != null)
                {
                    _endpointGeneralAvailabilityStatus.Set(ok);
                } else
                {
                    _endpointGeneralAvailabilityStatus.Set(error);
                }
            }
        }
    }
}
