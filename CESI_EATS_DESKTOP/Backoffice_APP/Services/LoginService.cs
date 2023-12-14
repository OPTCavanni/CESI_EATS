using Backoffice_APP.Models.Requests;
using Backoffice_APP.Models.Responses;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Backoffice_APP.Services
{
    public class LoginService : BaseService
    {

        public async Task Login(string username, string password)
        {
            try
            {
                var loginRequest = new LoginRequest
                {
                    Username = username,
                    Password = password
                };

                string json = JsonConvert.SerializeObject(loginRequest);

                var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(await Post(ConfigurationManager.AppSettings["login_url"], json));

                AppUser.Username = username;
                AppUser.Token = loginResponse?.AccessToken;
                AppUser.RefreshToken = loginResponse?.RefreshToken;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
