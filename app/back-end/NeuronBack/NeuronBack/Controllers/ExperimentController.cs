using Microsoft.AspNetCore.Mvc;
using NeuronBack.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using NeuronBack.Helpers;
using Microsoft.AspNetCore.Cors;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NeuronBack.Controllers
{
    [Authorize(Roles = "Logged, Admin")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("_myAllowSpecificOrigins")]
    public class ExperimentController : ControllerBase
    {
        public readonly AuthenticationContext _context;
        private UserManager<ApplicationUser> _userManager;
        public string userName = string.Empty;
        
        public ExperimentController(AuthenticationContext context, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            userName = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
        }

        [HttpPost]
        [Route("GetExperiment")]
        public async Task<ActionResult<IEnumerable<Experiment>>> Get(ExperimentDto exp)
        {
            var experiment = _context.Experiments.Where(x => x.id == exp.Id).First(); 
            return Ok(experiment);
        }


        // GET: api/<ExperimentController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        [HttpGet]

        [Route("getAllExperiments")]
        public async Task<ActionResult<IEnumerable<Experiment>>> GetAllExperiments()
        {
            return await _context.Experiments.ToListAsync();
        }

        [HttpGet]
        [Route("GetUserExperiments")]
        public async Task<ActionResult> GetUserExperiments()
        {
            var user = await _userManager.FindByNameAsync(userName);
            var exp = _context.Experiments.Where(x => x.user_id == user.Id).ToList();
            return Ok(exp);
        }

        // POST api/<ExperimentController>
        [HttpPost]
        [Route("saveExperiment")]
        public async Task<IActionResult> SaveExperimentDto(ExperimentDto exp)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userName);

                // Uncomment when rest is implemented   ///////////////////////////
                string source = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder);
                string target = Path.Combine(FileManager.UsersFolderPath, userName, exp.experimentName);
                FileManager.CreateNewFolder(Path.Combine(userName, exp.experimentName));
                FileManager.CloneDirectory(source, target);

                string ioSplit = MLController.mlActiveUsers[userName].SaveExperiment();
                dynamic temp = JsonConvert.DeserializeObject(ioSplit);

                string inputs = JsonConvert.SerializeObject(temp.SplitData.Inputs);
                inputs = inputs.Substring(1, inputs.Length - 2);
                inputs = inputs.Replace("\"", "");

                string outputs = JsonConvert.SerializeObject(temp.SplitData.Outputs);
                outputs = outputs.Substring(1, outputs.Length - 2);
                outputs = outputs.Replace("\"", "");

                string path = MLController.usersCurrentActiveFile[userName];
                //string filename = path.Split("\\").Last();
                // za server 
                string filename = path.Split('/').Last();
                filename = Path.GetFileName(path);


                Experiment experiment = new Experiment();
                experiment.user_id = user.Id;
                experiment.createDate = DateTime.Now.Date;
                experiment.modifiedDate = DateTime.Now.Date;
                experiment.experimentName = exp.experimentName;
                experiment.currentModels = exp.currentModels;
                experiment.Inputs = inputs;
                experiment.Outputs = outputs;
                experiment.Path = filename;
                //_context.Experiments.Add(experiment);

                _context.Entry(experiment).State = EntityState.Added;
                _context.SaveChanges();

                return Ok(experiment);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        /*
        [Route("saveExperiment2")]
        public async Task<IActionResult> SaveExperimentJson([FromBody] string json)
        {
            var user = await _userManager.FindByNameAsync(userName);
            dynamic exp = JsonConvert.DeserializeObject(json);

            Experiment experiment = new Experiment();
            experiment.user_id = Convert.ToInt32(user.Id);
            experiment.createDate = Convert.ToDateTime(exp.createDate);
            experiment.modifiedDate = Convert.ToDateTime(exp.modifiedDate);
            experiment.experimentName = exp.experimentName;
            experiment.statisticsPath = exp.statisticsPath;
            //_context.Experiments.Add(exp);
            _context.Entry(experiment).State = EntityState.Added;
            _context.SaveChanges();
            return Ok(experiment);
        }
        */

        // PUT api/<ExperimentController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExperiment(int id, ExperimentDto exp)
        {
            var experiment = await _context.Experiments.FindAsync(id);
            experiment.experimentName = exp.experimentName;
            experiment.modifiedDate = DateTime.Now.Date;
            experiment.currentModels = exp.currentModels;
            //experiment.statisticsPath = exp.statisticsPath;
            //_context.Entry(experiment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExperimentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE api/<ExperimentController>/5
        [HttpDelete]
        [Route("deleteExperiment")]
        public async Task<IActionResult> Delete(int id)
        {
            var experiment = await _context.Experiments.FindAsync(id);
            if(experiment == null)
            {
                return NotFound();
            }
            var models = _context.Models.Where(x => x.experimentid == id).ToList();
            foreach(var m in models)
            {
                _context.Models.Remove(m);
            }
            _context.Experiments.Remove(experiment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExperimentExists(int id)
        {
            return _context.Experiments.Any(e => e.id == id);
        }


        [HttpPost]
        [Route("loadExperiment")]
        [Authorize(Roles = "Logged, Admin")]
        public IActionResult LoadExperiment(ExperimentDto searchExp)
        {
            var experiment = _context.Experiments.Where(x => x.id == searchExp.Id).FirstOrDefault();
            if (experiment != null)
            {

                string[] inputsNew = experiment.Inputs.Split(",");
                //for (int i = 0; i < inputsNew.Length; i++)
                //{
                //    inputsNew[i] = inputsNew[i].Insert(0, "\"");
                //    inputsNew[i] = inputsNew[i] + "\"";
                //}

                //string In = "[" + string.Join(",", inputsNew) + "]";

                string[] outputsNew = experiment.Outputs.Split(",");
                //for (int i = 0; i < outputsNew.Length; i++)
                //{
                //    outputsNew[i] = outputsNew[i].Insert(0, "\"");
                //    outputsNew[i] = outputsNew[i] + "\"";
                //}

                //string Out = "[" + string.Join(",", inputsNew) + "]";

                dynamic res = new System.Dynamic.ExpandoObject();
                res.SplitData = new System.Dynamic.ExpandoObject();
                res.SplitData.Inputs = new System.Dynamic.ExpandoObject();
                res.SplitData.Outputs = new System.Dynamic.ExpandoObject();
                res.SplitData.Inputs = inputsNew;
                res.SplitData.Outputs = outputsNew;

                try
                {
                    string target = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder);
                    string source = Path.Combine(FileManager.UsersFolderPath, userName, experiment.experimentName);
                    FileManager.DeleteFolder(Path.Combine(userName, FileManager.DefaultExperimentFolder));
                    FileManager.CreateNewFolder(Path.Combine(userName, FileManager.DefaultExperimentFolder));
                    FileManager.CloneDirectory(source, target);

                    string url = MLController.GLOBAL_DOWNLOAD_URL + experiment.Path;
                    Console.WriteLine(url);
                    MLController.mlActiveUsers[userName].LoadData(url);
                    MLController.usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, experiment.Path);
                    MLController.mlActiveUsers[userName].SplitInputOutput(JsonConvert.SerializeObject(res));

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex}");
                }
            }
                
            return BadRequest("Experiment does not exist");
        }
    }
}
