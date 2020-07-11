using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace CustomPrometheusExporter
{
    class MetricClient
    {
        private HttpClient _httpClient;
        private EnvironmentConfiguration _environmentConfiguration;

        public MetricClient(HttpClient httpClient, EnvironmentConfiguration environmentConfiguration)
        {
            _environmentConfiguration = environmentConfiguration;

            _httpClient = httpClient;
        }

        /// <summary>
        /// Check general availability of endpoint.
        /// </summary>
        public async Task<HttpResponseMessage> CheckEndpointAvailabilityClientAsync()
        {
            string authInfo = _environmentConfiguration.ClientId + ":" + _environmentConfiguration.ClientPassword;
            authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

            var request = new HttpRequestMessage(HttpMethod.Post, new Uri(_environmentConfiguration.Uri, UriKind.Absolute));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authInfo);
            
            var response = await _httpClient.SendAsync(request);
            return response;
        }

    }
}
