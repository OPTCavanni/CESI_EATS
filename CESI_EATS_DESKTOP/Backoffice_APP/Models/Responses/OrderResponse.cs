using System;
using System.Collections.Generic;

namespace Backoffice_APP.Models.Responses
{
    public class OrderResponse
    {
        public string _id { get; set; }
        public string id_restaurant { get; set; }
        public string username { get; set; }
        public string status { get; set; }
        public DateTime created_at { get; set; }
    }
}
