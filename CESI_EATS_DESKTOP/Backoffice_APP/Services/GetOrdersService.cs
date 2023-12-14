using Backoffice_APP.Models.Requests;
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
    public class GetOrdersService : BaseService
    {
        public async Task<List<OrderResponse>> GetCommands()
        {
            try
            {
                await Get(ConfigurationManager.AppSettings["commands_url"]);
                List<OrderResponse> orderResponse = JsonConvert.DeserializeObject<List<OrderResponse>>(await Get(ConfigurationManager.AppSettings["commands_url"]));
                return orderResponse;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}