using System;

namespace CustomPrometheusExporter
{
    public class EnvironmentConfiguration
    {
        private const string UriVariableName = "URI";
        private const string ClientIdVariableName = "CLIENTID";
        private const string ClientPasswordVariableName = "CLIENTPASSWORD";

        /// <summary>
        /// Url of of Endpoint.
        /// </summary>
        public string Uri { get; private set; }

        /// <summary>
        /// ClientId.
        /// </summary>
        public string ClientId { get; private set; }

        /// <summary>
        /// ClientSecret.
        /// </summary>
        public string ClientPassword { get; private set; }

        public static EnvironmentConfiguration Get()
        {
            return new EnvironmentConfiguration
            {
                Uri = Environment.GetEnvironmentVariable(UriVariableName) ?? throw new ArgumentException("Uri variable not set!"),
                ClientId = Environment.GetEnvironmentVariable(ClientIdVariableName) ?? throw new ArgumentException("ClientId variable not set!"),
                ClientPassword = Environment.GetEnvironmentVariable(ClientPasswordVariableName) ?? throw new ArgumentException("ClientPassword variable not set!")
           };
        }
    }
}
