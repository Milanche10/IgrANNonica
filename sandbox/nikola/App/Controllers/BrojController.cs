using App;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace App.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrojController : ControllerBase
    {
      

        static List<Broj> brojs = new List<Broj>() {};
        static int counter = brojs.Count; 

        [HttpGet]
        public IEnumerable<Broj> Get()
        { 
            return brojs;
        }


        [HttpGet("{id}")]
        public Broj Get(int id)
        {
            Broj broj = brojs[id];
            return broj; 
        }

        [HttpPost]
        public void Post([FromBody] Broj value)
        {
            brojs.Add(value); 
        }

    }
}
