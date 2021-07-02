using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusTicketReservation.Models
{
    public class persistInfoDto
    {
        public string  ResID { get; set; }
        public string Active { get; set; }
        public string ScheduleId { get; set; }
        public string CNIC { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }

    }
}
