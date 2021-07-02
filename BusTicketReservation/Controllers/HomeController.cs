using BusTicketReservation.Models;
using DataBaseAccessLayer.DAL;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Reflection;

namespace BusTicketReservation.Controllers
{
    public class HomeController : Controller
    {
        private string conStr = "";
        private DBAccess dac;
        public HomeController(AppSettings bps)
        {
            conStr = bps.ConnectionString;

            dac = new DBAccess(conStr);
        }

        public IActionResult Index()
        {
            return View("welcome");
        }

        [HttpGet]
        public IActionResult Displayindex()
        {
          
            return View("Index");
        }

        [HttpPost]
        public IActionResult DisplySheduleDetails(ScheduleCriteriaDto sch)
        {

            ViewBag.ScheduleID = sch.ScheduleID;
            return View("PersistsReservation");
        }

        //------------------------------getting Bus Schedule By date----------------------------------//

        [HttpPost]
        public string getBusScheduleByDate([FromBody] DateDto Ddto)
        {
            string result = "";
            string spName = "GetBusScheduleByDate";
            try
            {
                string dd = Ddto.getDate;
                SqlCommand sqlCommand = new SqlCommand(spName);
                DateTime tempDate = Convert.ToDateTime(dd);
                sqlCommand.Parameters.Add("@pScheduleDate", SqlDbType.Date).Value = tempDate;
                result = dac.ExecuteDatatableJSON(sqlCommand);
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + new StackFrame().GetMethod().Name, ex);
            }

            return result.ToString();
        }
        //------------------------------------Getting Schedule information----------------------------------//
        [HttpPost]
        public string getScheduleDetails([FromBody]ScheduleCriteriaDto sch)
        {
            string result = string.Empty;
            string spName = "GetRouteReservation";
            try
            {
                string ss = sch.ScheduleID;
                SqlCommand sqlCommand = new SqlCommand(spName);
                sqlCommand.Parameters.Add("@pScheduleId", SqlDbType.Int).Value = int.Parse(ss);
                result = dac.ExecuteDatatableJSON(sqlCommand);
               
            }
            catch (SqlException sqlex)
            {
                throw new Exception(sqlex.Message + spName + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, sqlex);
            }
            return result;

        }


        //------------------------------------persisting Customer info----------------------------------//
        [HttpPost]
        public string presistCustomerInfo([FromBody] persistInfoDto PerInfodto)
        {
            int result;
            string spName = "presistReservation";
            try
            {
                SqlCommand sqlCommand = new SqlCommand(spName);
                sqlCommand.Parameters.Add("@pScheduleID", SqlDbType.Int).Value = int.Parse(PerInfodto.ScheduleId);
                string resid = PerInfodto.ResID;
                int rr;
                if (resid == "")
                {
                    resid = "0";
                    rr = int.Parse(resid);
                }
                else
                {
                    rr = int.Parse(PerInfodto.ResID);
                }

                sqlCommand.Parameters.Add("@pReservationID", SqlDbType.Int).Value = rr;
                sqlCommand.Parameters.Add("@pName", SqlDbType.VarChar, 50).Value = (PerInfodto.Name);
                sqlCommand.Parameters.Add("@pEmail", SqlDbType.NVarChar, 255).Value = (PerInfodto.Email);
                sqlCommand.Parameters.Add("@pCNIC", SqlDbType.VarChar, 13).Value = (PerInfodto.CNIC);
                sqlCommand.Parameters.Add("@pContactNumber", SqlDbType.VarChar, 20).Value = (PerInfodto.ContactNo);
                sqlCommand.Parameters.Add("@pActive", SqlDbType.Bit).Value = int.Parse(PerInfodto.Active);
                result = dac.ExecuteNonQuery(sqlCommand);
            }
            catch (SqlException sqlex)
            {
                throw new Exception(sqlex.Message + spName + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, sqlex);
            }

            return result.ToString();
        }

    }
}
