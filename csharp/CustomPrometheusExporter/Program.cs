using Prometheus;
using System;
using System.Threading.Tasks;

namespace CustomPrometheusExporter
{
    class Program
    {
        static void Main(string[] args)
        {
            Go().Wait();
        }

        private static async Task Go()
        {
            var environmentConfiguration = EnvironmentConfiguration.Get();

            var metricsServiceHandler = new MetricService();
            metricsServiceHandler.Initialize(environmentConfiguration);

            var metricServer = new MetricServer(8070);
            metricServer.Start();

            while (true)
            {
                await metricsServiceHandler.CheckEndpointAvailabilityServiceAsync();

                await Task.Delay(TimeSpan.FromSeconds(10));
            }

        }
    }
}
