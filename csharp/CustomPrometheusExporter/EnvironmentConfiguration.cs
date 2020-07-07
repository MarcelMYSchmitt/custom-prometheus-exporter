using System;

namespace CustomPrometheusExporter
{
    public class EnvironmentConfiguration
    {
        private const string UriVariableName = "URI";
        private const string UsernameVariableName = "USERNAME";
        private const string PasswordVariableName = "PASSWORD";

        /// <summary>
        /// Url of of Endpoint.
        /// </summary>
        public string Uri { get; private set; }

        /// <summary>
        /// ClientId.
        /// </summary>
        public string Username { get; private set; }

        /// <summary>
        /// ClientSecret.
        /// </summary>
        public string Password { get; private set; }

        public static EnvironmentConfiguration Get()
        {
            return new EnvironmentConfiguration
            {
                Uri = Environment.GetEnvironmentVariable(UriVariableName) ?? throw new ArgumentException("Uri variable not set!"),
                Username = Environment.GetEnvironmentVariable(UsernameVariableName) ?? throw new ArgumentException("Username variable not set!"),
                Password = Environment.GetEnvironmentVariable(PasswordVariableName) ?? throw new ArgumentException("Password variable not set!")
           };
        }
    }
}
