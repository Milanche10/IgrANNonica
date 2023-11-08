using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using NeuronBack.Models;
using System.Data;

namespace NeuronBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public BaseController(IConfiguration configuration)
        { 
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            return Database.Instance.getUsers(); 
        }

        [HttpGet("{username},{password}")]
        public JsonResult GetUser(String username, String password) {
            return Database.Instance.getUser(username, password);
        }
        [HttpPost]
        public JsonResult Post(User user)
        {
            return new JsonResult(Database.Instance.addUser(user));
        }

        [HttpPut]
        public JsonResult Put(User user)
        {
            return new JsonResult(Database.Instance.updateUser(user)); 
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            return new JsonResult(Database.Instance.deleteUser(id)); 
        }
        [HttpDelete("{username},{password}")]
        public JsonResult DeleteUser(String username, String password)
        {
            return Database.Instance.deleteUser(username, password);
        }
    }
    
}
