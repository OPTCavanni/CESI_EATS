using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backoffice_APP.Models.Responses
{
    public class LoginResponse
    {
        public string? AccessToken;
        public string? RefreshToken;
        public string? Message;
    }
}
