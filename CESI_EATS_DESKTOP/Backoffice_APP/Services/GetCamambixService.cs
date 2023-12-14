using Backoffice_APP.Models.Responses;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Threading.Tasks;

namespace Backoffice_APP.Services
{
    public class GetCamambixService : BaseService
    {
        public async Task<CamambixResponse> GetCamambix()
        {
            try
            {
                CamambixResponse camambixResponse = JsonConvert.DeserializeObject<CamambixResponse>(await Get(ConfigurationManager.AppSettings["camambix_url"]));
                return camambixResponse;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
