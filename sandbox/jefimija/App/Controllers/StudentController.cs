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
    public class StudentController : ControllerBase
    {
        static List<Student> students = new List<Student>() {
                new Student(){Name = "Mija", Surname = "Petrovic"},
                new Student(){Name = "Mina", Surname = "Jankovic"},
                new Student(){Name = "Nina", Surname = "Nikolic"},
        };
        static int counter = students.Count; 
        // GET: api/<StudentController>
        [HttpGet]
        public IEnumerable<Student> Get()
        { 
            return students;
        }

        // GET api/<StudentController>/5
        [HttpGet("{id}")]
        public Student Get(int id)
        {
            Student student = students[id];
            return student; 
        }

        // POST api/<StudentController>
        [HttpPost]
        public void Post([FromBody] Student value)
        {
            students.Add(value); 
        }

        // PUT api/<StudentController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<StudentController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
