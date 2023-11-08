using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuronBack.Models;
using Newtonsoft.Json;
using System.Security.Claims;

namespace NeuronBack.Controllers
{
    [Authorize(Roles = "Logged, Admin")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("_myAllowSpecificOrigins")]
    public class ModelController : ControllerBase
    {
        private readonly AuthenticationContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public string userName = string.Empty;
        public ModelController(AuthenticationContext context, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            userName = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
        }

        [HttpGet]
        [Route("getModelById")]
        public IActionResult GetModel(int id)
        {
             var model = _context.Models.Where(x => x.Id == id).FirstOrDefault();
             return Ok(model);
        }

        [HttpPost]
        [Route("getModels")]
        public async Task<IActionResult> GetModelsAsync(ExperimentDto exp)
        {
            //var user = await _userManager.FindByNameAsync(userName);
            //var experiment = _context.Experiments.FirstOrDefault(x=>x.user_id==user.Id);
            var models = _context.Models.Where(x => x.experimentid == exp.Id).ToList();
            return Ok(models);
        }

        [HttpPost]
        [Route("saveModel")]
        public async Task<IActionResult> SaveModelDto(ModelDto model)
        {

            Model modelNew = new Model();
            modelNew.experimentid = model.experimentid;
            modelNew.modelName = model.modelName;
            modelNew.modelIDInExperiment = model.modelIDInExperiment;
            modelNew.modelProblemType = model.modelProblemType;
            modelNew.configuration = model.configuration;
            modelNew.trainingOnModel = model.trainingOnModel;
            modelNew.trainTestJSON = model.trainTestJSON; 
            modelNew.lastModificationDate = DateTime.Now.Date;
            modelNew.createDate = DateTime.Now.Date;
            modelNew.modelProblemType = model.modelProblemType;
            modelNew.path = "kjshdgkj";
            _context.Entry(modelNew).State = EntityState.Added;
            _context.SaveChanges();
            return Ok(modelNew);
        }

        [HttpDelete]
        [Route("deleteModel")]
        public IActionResult DeleteModel(int id)
        {
            var model = _context.Models.Where(x => x.Id == id).FirstOrDefault();
            if (model != null)
            {
                _context.Models.Remove(model);
                _context.SaveChanges();
                return Ok(model); //vracam model koji je izbrisan zbog confirm.
            }
            else
            {
                return BadRequest("Ne postoji model koji pokusava da se izbrise.");
            }
        }

        [HttpPut]
        [Route("updateModel")]
        public IActionResult UpdateModel(int id, ModelDto model)
        {
            var modelNew = _context.Models.Where(x => x.Id == id).FirstOrDefault();
            if (model != null)
            {
                //string path = model.path + ".h5";
                //string newModelName = modelName + ".h5";
                //Console.WriteLine(path); 
                /*if(model.path != "")
                {
                    FileSystem.RenameFile(path, newModelName);

                    string basePath = Path.GetDirectoryName(path);
                    string newPath = Path.Combine(basePath, modelName);
                    model.path = newPath;
                }*/
                    
                modelNew.modelName = model.modelName;
                modelNew.modelIDInExperiment = model.modelIDInExperiment;
                modelNew.modelProblemType = model.modelProblemType;
                modelNew.configuration = model.configuration;
                modelNew.trainingOnModel = model.trainingOnModel;
                modelNew.lastModificationDate = DateTime.Now.Date;
                //_context.Entry(model).State = EntityState.Added;
                _context.SaveChanges();


                return Ok(model);
            }
            else
            {
                return BadRequest("Ne postoji model koji pokusava da se promeni");
            }
        }
     }
}
