using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using IOFile = System.IO.File;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Project4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZaposleniController : ControllerBase
    {
        public static List<Zaposleni> zaposleni = new List<Zaposleni>()
            {
                new Zaposleni(){ Id=1, Ime="Ime1", Prezime="Prezime1", Kompanija="Kompanija1", Zanimanje="Zanimanje1"},
                new Zaposleni(){ Id=2, Ime="Ime2", Prezime="Prezime2", Kompanija="Kompanija2", Zanimanje="Zanimanje2"},
                new Zaposleni(){ Id=3, Ime="Ime3", Prezime="Prezime3", Kompanija="Kompanija3", Zanimanje="Zanimanje3"}
            };
        // GET: api/<KupacController>
        [HttpGet]
        public IEnumerable<Zaposleni> Get()
        {
            if (zaposleni == null)
            {
                setZaposleni();
            }
            return zaposleni;


        }
        private void setZaposleni()
        {
            zaposleni = new List<Zaposleni>()
            {
                new Zaposleni(){ Id=1, Ime="Ime1", Prezime="Prezime1", Kompanija="Kompanija1", Zanimanje="Zanimanje1"},
                new Zaposleni(){ Id=2, Ime="Ime2", Prezime="Prezime2", Kompanija="Kompanija2", Zanimanje="Zanimanje2"},
                new Zaposleni(){ Id=3, Ime="Ime3", Prezime="Prezime3", Kompanija="Kompanija3", Zanimanje="Zanimanje3"}
            };
        }

      
        // POST api/<KupacController>
        [HttpPost]
        public string Post([FromBody] Zaposleni model)
        {
            Zaposleni k = new Zaposleni() { Id = model.Id, Ime = model.Ime, Prezime=model.Prezime, Zanimanje=model.Zanimanje,Kompanija=model.Kompanija };
            zaposleni.Add(k);

            return "Zaposleni je uspesno ubacen!";

        }
    }
       
}
