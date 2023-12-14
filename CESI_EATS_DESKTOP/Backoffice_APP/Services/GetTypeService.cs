using Backoffice_APP.Models.Responses;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backoffice_APP.Services
{
    public class GetTypeService : BaseService
    {
        public async Task<List<TypeResponse>> GetType()
        {
            try
            {
                List<TypeResponse> typeResponse = JsonConvert.DeserializeObject<List<TypeResponse>>(await Get(ConfigurationManager.AppSettings["type_url"]));
                return typeResponse;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
