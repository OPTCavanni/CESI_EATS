using Newtonsoft.Json;

namespace Backoffice_APP.Models.Requests
{
    public class LoginRequest
    {
        [JsonProperty("username")]
        public string? Username { get; set; }

        [JsonProperty("password")]
        public string? Password { get; set; }
    }
}
