using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Reflection;

namespace DataBaseAccessLayer.DAL
{
    public class DBAccess
    {
        private string conStr;
        public DBAccess(string connectionString)
        {
            conStr = connectionString;
        }
        public DataTable ExecuteDataTable(string spName)
        {
            SqlCommand sqlCommand = new SqlCommand(spName);
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 30;
            DataTable dataTable = new DataTable();
            try
            {
                SqlConnection con = new SqlConnection(conStr);
                sqlCommand.Connection = con;
                sqlCommand.Connection.Open();
                SqlDataAdapter da = new SqlDataAdapter(sqlCommand);
                da.Fill(dataTable);
            }
            catch (SqlException sqlex)
            {
                throw new Exception(sqlex.Message + spName + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, sqlex);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + new StackFrame().GetMethod().Name, ex);
            }
            finally
            {
                if (sqlCommand.Connection != null)
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Connection.Dispose();
                    sqlCommand.Dispose();
                }
            }
            return dataTable;
        }

        public DataTable ExecuteDataTable(SqlCommand sqlCommand)
        {
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 30;
            DataTable dataTable = new DataTable();
            try
            {
                SqlConnection con = new SqlConnection(conStr);
                sqlCommand.Connection = con;
                sqlCommand.Connection.Open();
                SqlDataAdapter da = new SqlDataAdapter(sqlCommand);
                da.Fill(dataTable);
            }
            catch (SqlException sqlex)
            {
                throw new Exception(sqlex.Message + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, sqlex);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + new StackFrame().GetMethod().Name, ex);
            }
            finally
            {
                if (sqlCommand.Connection != null)
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Connection.Dispose();
                    sqlCommand.Dispose();
                }
            }
            return dataTable;
        }

        public int ExecuteNonQuery(SqlCommand sqlCommand)
        {
            int result = 0;
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 30;
            try
            {
                SqlConnection con = new SqlConnection(conStr);
                sqlCommand.Connection = con;
                sqlCommand.Connection.Open();
                result = sqlCommand.ExecuteNonQuery();
            }
            catch (SqlException sqlex)
            {
                throw new Exception(sqlex.Message + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, sqlex);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + new StackFrame().GetMethod().Name, ex);
            }
            finally
            {
                if (sqlCommand.Connection != null)
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Connection.Dispose();
                    sqlCommand.Dispose();
                }
            }
            return result;
        }

        public string ExecuteDatatableJSON(string spName)
        {
            string jsonString;
            try
            {
                DataTable dataTable = ExecuteDataTable(spName);
                jsonString = JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, ex);
            }
            return jsonString;
        }

        public string ExecuteDatatableJSON(SqlCommand sqlCommand)
        {
            string jsonString;
            try
            {
                DataTable dataTable = ExecuteDataTable(sqlCommand);
                jsonString = JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ", Method: " + MethodBase.GetCurrentMethod().DeclaringType.Name, ex);
            }
            return jsonString;
        }
    }
}
