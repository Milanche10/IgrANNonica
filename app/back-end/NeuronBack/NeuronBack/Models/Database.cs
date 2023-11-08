using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using MySql.Data; 
using System.Data;

namespace NeuronBack.Models
{
    public class Database
    {
        private readonly String _connString = "Data Source=localhost;Initial Catalog=neuronhorizon;User Id=root;password =  ;port = 3306;"; 
        private static Database _instance = null;
        private MySqlConnection _conn = null; 
        private Database()
        {
            _conn = new MySqlConnection(_connString); 
        }

        public static Database Instance { 
            get
            {
                if( _instance == null )
                    _instance = new Database();
                return _instance;
            } 
        }

        public JsonResult getUsers()
        {
            MySqlDataReader reader;
            String query = @"SELECT * FROM Users";
            DataTable table = new DataTable();

            using (_conn)
            {
                _conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, _conn))
                {
                    reader = cmd.ExecuteReader();
                    table.Load(reader);

                    reader.Close();
                    _conn.Close();
                }
            }

            return new JsonResult(table);
        }
        public JsonResult getUser(String username, String password)
        {
            MySqlDataReader reader;
            String query = @"SELECT * FROM Users WHERE username = @username AND pass = @pass";
            DataTable table = new DataTable();

            using (_conn)
            {
                _conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@username", username);
                    cmd.Parameters.AddWithValue("@pass", password);
                    reader = cmd.ExecuteReader();
                    table.Load(reader);

                    reader.Close();
                    _conn.Close();
                }
            }

            return new JsonResult(table);
        }

        public JsonResult addUser(User user)
        {
            String query = @"INSERT INTO users(username,pass, FirstName, LastName, Email, Confirmed)  
                             VALUES (@username, @pass, @firstName, @lastName, @email, @confirmed)";

            MySqlDataReader reader;
            DataTable table = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(_connString))
            {
                conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@username", user.Username);
                    cmd.Parameters.AddWithValue("@pass", user.Password);
                    cmd.Parameters.AddWithValue("@firstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@lastName", user.LastName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@confirmed", user.Confirmed);

                    reader = cmd.ExecuteReader();
                    table.Load(reader);
                    reader.Close();
                    conn.Close();
                }
            }

            return new JsonResult(table); 
        }
        public JsonResult updateUser(User user)
        {
            String query = @"UPDATE users SET 
                            username = @username,
                            pass = @pass,
                            firstName = @firstName,
                            lastName = @lastName,
                            email = @email, 
                            confirmed = @confirmed
                            WHERE userID = @userID";

            MySqlDataReader reader;
            DataTable table = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(_connString))
            {
                conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userID", user.Id);
                    cmd.Parameters.AddWithValue("@username", user.Username);
                    cmd.Parameters.AddWithValue("@pass", user.Password);
                    cmd.Parameters.AddWithValue("@firstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@lastName", user.LastName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@confirmed", user.Confirmed);

                    reader = cmd.ExecuteReader();
                    table.Load(reader);
                    reader.Close();
                    conn.Close();
                }
            }
            return new JsonResult(table); 
        }
        public JsonResult deleteUser(int userID)
        {
            String query = @"DELETE FROM users 
                            WHERE userID = @userID";

            MySqlDataReader reader;
            DataTable table = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(_connString))
            {
                conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userID", userID);

                    reader = cmd.ExecuteReader();
                    table.Load(reader);
                    reader.Close();
                    conn.Close();
                }
            }
            return new JsonResult(table);
        }
        public JsonResult deleteUser(String username, String password)
        {
            String query = @"DELETE FROM users 
                            WHERE username = @username AND pass = @password";

            MySqlDataReader reader;
            DataTable table = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(_connString))
            {
                conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@username", username);
                    cmd.Parameters.AddWithValue("@password", password);
                    reader = cmd.ExecuteReader();
                    table.Load(reader);
                    reader.Close();
                    conn.Close();
                }
            }
            return new JsonResult(table);
        }

        //Tabela je stavljena po tome kako je uradjena migracija
        public string UserfromID(string id)
        {
            MySqlDataReader reader;
            String query = @"SELECT * FROM aspnetusers WHERE Id = @id";
            DataTable table = new DataTable();
            string username = string.Empty;

            using (_conn)
            {
                _conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
    
                    reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        username = reader["UserName"].ToString();
                    }
                    
                    reader.Close();
                    _conn.Close();
                }
            }

            return username;
        }
    }
}
