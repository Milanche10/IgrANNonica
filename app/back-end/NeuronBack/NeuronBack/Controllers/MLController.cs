using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using NeuronBack.Helpers;
using System.Data;
using System.Net.Http.Headers;
using System.IO;
using Newtonsoft.Json;
using NeuronBack.Controllers;
using NeuronBack.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Routing;
using System.Net.Http;
using System.IdentityModel.Tokens.Jwt;
using NeuronBack.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Cors;
using Aspose.Cells;
using System.Text;

namespace NeuronBack.Controllers
{

    public delegate void CreateDictionary(string user);
    public delegate string getUser();

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [EnableCors("_myAllowSpecificOrigins")]
    public class MLController : ControllerBase
    {
        public const string GLOBAL_DOWNLOAD_URL = "http://127.0.0.1:10033/api/ML/downloadFileP?filename=";


        PythonCommunicator pythonConnection;
        static string globalPath = "";
        public string userName = string.Empty;
        public string currentExperimentFolder = "CurrentSession";        // Temporary empty param
        public readonly AuthenticationContext _context;
        private IHubContext<Hubs> _hub;
        IHttpContextAccessor _httpContextAccessor;

        public static Dictionary<string, PythonCommunicator> mlActiveUsers = new Dictionary<string, PythonCommunicator>();
        public static Dictionary<string, string> usersCurrentActiveFile = new Dictionary<string, string>();

        public MLController(IHttpContextAccessor httpContextAccessor, AuthenticationContext context, IHubContext<Hubs> hub)
        {
            _context = context;
            _hub = hub;
            _httpContextAccessor = httpContextAccessor;
            //  Get username from token
            userName = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            CreateDictionary cd = delegate (string user)
            {
                if (!mlActiveUsers.ContainsKey(user))
                {
                    // filepath should be folder to current experiment ##############
                    string filepath = FileManager.CreateNewFolder(user);
                    pythonConnection = new PythonCommunicator(filepath, httpContextAccessor.HttpContext.Request.Headers["Authorization"]);
                    mlActiveUsers.Add(user, pythonConnection);
                }
                else
                {
                    pythonConnection = mlActiveUsers[user];
                    pythonConnection.SendNewToken(httpContextAccessor.HttpContext.Request.Headers["Authorization"]);    // temp fix
                }
            };
            //Pravljenje dictionary sa trenutnim username-om
            cd(userName);
            
        }

        [HttpPost]
        [Route("test")]
        public IActionResult Test([FromBody] object jsonobj)
        {

            string filename = "data.csv";
            string url = GLOBAL_DOWNLOAD_URL + filename;
            //string del = FileManager.GetCsvDelimiter(Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename));
            //string json = "{\"Url\" : \"" + url + "\", \"Delimiter\" : \"" + del + "\"}";
            //Console.WriteLine(json);
            //dynamic jsonS = new System.Dynamic.ExpandoObject();
            //jsonS.Url = url;
            //jsonS.Delimiter = del;
            //string json = JsonConvert.SerializeObject(jsonS);

            string newPath = pythonConnection.LoadData(url);
            usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
            string json = "{\"ProcessData\" : [\"SetEmptyToNaN\", \"RemoveOutlier\"]}";
            string t = pythonConnection.CleanData(json);
            json = "{\"SplitData\" : {\"Inputs\" : [\"CreditScore\",\"Geography\",\"Gender\", \"Age\", \"Tenure\", \"Balance\", \"NumOfProducts\", \"HasCrCard\", \"IsActiveMember\", \"EstimatedSalary\"], \"Outputs\" : [\"Exited\"]}}";
            pythonConnection.SplitInputOutput(json);
            json = "{\"LabelEncode\" : [], \"OneHotEncode\" : [\"Geography\", \"Gender\"]}";
            FileManager.UpdateFileVersion(usersCurrentActiveFile[userName], FileManager.PreviousVersionFilename);
            string path = pythonConnection.EncodeData(json);
            string ioSplit = pythonConnection.SaveExperiment();
            dynamic temp = JsonConvert.DeserializeObject(ioSplit);

            string inputs = JsonConvert.SerializeObject(temp.SplitData.Inputs);
            inputs = inputs.Substring(1, inputs.Length - 2);
            inputs = inputs.Replace("\"", "");

            Console.WriteLine(inputs);

           

            //json = "{\"Standardize\" : [\"CreditScore\", \"Balance\", \"EstimatedSalary\", \"Geography\"], \"Normalize\" : [], \"MinMaxScale\" : []}";
            //pythonConnection.ScaleData(json);
            //Console.WriteLine(temp["SplitData"]["Inputs"][0]);
            //json = "{\"TrainSize\" : 0.7, \"ValidationSize\" : 0.1, \"TestSize\" : 0.2, \"Shuffle\" : \"True\", \"SplitSeed\" : 300}";
            //pythonConnection.CreateTrainTestData(json);
            //json = "{\"HiddenLayers\" : [6,5], \"HiddenLayerActivationFunc\" : \"relu\",  \"OutputUnits\" : 1, \"OutputLayerActivationFunc\" : \"sigmoid\", \"LossFunction\" : \"binary_crossentropy\", \"Metrics\" : [\"mse\"]}";
            //pythonConnection.CreateModel(json);
            //json = "{\"BatchSize\": 32, \"NumOfEpochs\" : 20, \"EarlyStopping\" : 3}";
            //pythonConnection.TrainModel(json, new Hubs(_hub), userName);
            //json = "{\"BatchSize\": 32, \"Type\" : \"Class\"}";
            //string temp = pythonConnection.EvaluateModel(json);
            //json = "{\"Type\" : \"Regression\", \"PredictDataType\" : \"Test\"}";
            //string temp = pythonConnection.PredictModel(json);
            //json = "{\"Filename\" : \"MyModel\"}";
            //temp = pythonConnection.SaveModel(json);
            //Console.WriteLine(pythonConnection.IfConnected());
            //pythonConnection.ClientDisconnect();
            //Console.WriteLine(pythonConnection.IfConnected());
            //filename = path.Split('\\').Last();
            //string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
            //usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
            //return Ok(newFile);
            //string res = pythonConnection.SuggestColumnTypes();
            //string file = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
            //string[] stats = pythonConnection.GetStatistics();
            return Ok();
        }

        // jsonobj must contain: pageNum, numOfRows
        [HttpPost]
        [Route("readFile")]
        public IActionResult ReadFileByPage([FromBody] dynamic jsonobj)
        {
            string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], int.Parse(JsonConvert.SerializeObject(jsonobj["pageNum"])), int.Parse(JsonConvert.SerializeObject(jsonobj["numOfRows"])));
            int maxPages = FileManager.GetFileMaxPaging(usersCurrentActiveFile[userName], int.Parse(JsonConvert.SerializeObject(jsonobj["numOfRows"])));
            
            return Ok(new { MaxPages = maxPages, Data = newFile });
        }

        [HttpPost]
        [Route("clientDisconnect")]
        public IActionResult ClientDisconnect()
        {
            pythonConnection.ClientDisconnect();
            return Ok("Client disconnected");
        }

        /////////////////
        [HttpPost]
        [Route("getStatistics")]
        public IActionResult UploadAndStatistics()
        {
            try
            {
                var file = Request.Form.Files[0];
                string newPath = FileManager.UploadFileToServer(userName, FileManager.DefaultExperimentFolder, file);
                if (newPath != null)
                {
                    //GET STATISTICS

                    string fileNameS = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string url = GLOBAL_DOWNLOAD_URL + fileNameS;
                    //string del = FileManager.GetCsvDelimiter(Path.Combine(FileManager.UsersFolderPath, newPath));
                    //string json = "{\"Url\" : \"" + url + "\", \"Delimiter\" : \"" + del + "\"}";
                    //dynamic jsonS = new System.Dynamic.ExpandoObject();
                    //jsonS.Url = url;
                    //jsonS.Delimiter = del;
                    //string json = JsonConvert.SerializeObject(jsonS);
                    pythonConnection.LoadData(url);

                    usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, file.FileName);

                    string[] stats = pythonConnection.GetStatistics();
                    //Console.WriteLine(stats[0]); 
                    return Ok(stats);
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }

        [HttpPost]
        [Route("getColumnTypes")]
        public IActionResult GetColumnTypes()
        {
            try
            {
                string res = pythonConnection.GetColumnTypes();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("suggestColumnTypes")]
        public IActionResult SuggestColumnTypes([FromBody] object mm)
        {
            try
            {
                string res = pythonConnection.SuggestColumnTypes();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("cleanData")]
        public IActionResult CleanData([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                FileManager.UpdateFileVersion(usersCurrentActiveFile[userName], FileManager.PreviousVersionFilename);
                string path = pythonConnection.CleanData(json);

                // ovu liniju otkomentarisati kada se radi u lokalu, a zakomentarisati trenutnu koja je aktuelna zbog pokretanja na Linuxu
                // string filename = path.Split('\\').Last();
                string filename = path.Split('/').Last();
                filename = Path.GetFileName(path);
                usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
                string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
                int maxPages = FileManager.GetFileMaxPaging(usersCurrentActiveFile[userName], 50);

                return Ok(new { MaxPages = maxPages, Data = newFile });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        //Sa fronta jsonobjekat na ML
        [HttpPost]
        [Route("updateData")]
        public IActionResult UpdateData([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                FileManager.UpdateFileVersion(usersCurrentActiveFile[userName], FileManager.PreviousVersionFilename);
                string path = pythonConnection.UpdateDataValues(json);
                // ovu liniju otkomentarisati kada se radi u lokalu, a zakomentarisati trenutnu koja je aktuelna zbog pokretanja na Linuxu
                //  string filename = path.Split('\\').Last(); 
                string filename = path.Split('/').Last();
                usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
                string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
                int maxPages = FileManager.GetFileMaxPaging(usersCurrentActiveFile[userName],50);

                return Ok(new { MaxPages = maxPages, Data = newFile });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }


        [HttpPost]
        [Route("encodeData")]
        public IActionResult EncodeData([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                FileManager.UpdateFileVersion(usersCurrentActiveFile[userName], FileManager.PreviousVersionFilename);
                string path = pythonConnection.EncodeData(json);
                // ovu liniju otkomentarisati kada se radi u lokalu, a zakomentarisati trenutnu koja je aktuelna zbog pokretanja na Linuxu
                //string filename = path.Split('\\').Last();
                string filename = path.Split('/').Last();
                filename = Path.GetFileName(path); 
                usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
                string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
                return Ok(newFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        [HttpPost]
        [Route("scaleData")]        // Potencijalno dodati slanje nove verzije fajla na frontend?
        public IActionResult ScaleData([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                string path = pythonConnection.ScaleData(json);
                // ovu liniju otkomentarisati kada se radi u lokalu, a zakomentarisati trenutnu koja je aktuelna zbog pokretanja na Linuxu
                //string filename = path.Split('\\').Last();
                string filename = path.Split('/').Last();
                filename = Path.GetFileName(path);
                usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
                string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
                return Ok(newFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("scaleDataAutomaticly")]        // Potencijalno dodati slanje nove verzije fajla na frontend?
        public IActionResult ScaleDataAutomaticly()
        {
            try
            {
                string path = pythonConnection.ScaleDataAutomaticly();
                // ovu liniju otkomentarisati kada se radi u lokalu, a zakomentarisati trenutnu koja je aktuelna zbog pokretanja na Linuxu
                //string filename = path.Split('\\').Last();
                string filename = path.Split('/').Last();
                filename = Path.GetFileName(path); 
                usersCurrentActiveFile[userName] = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, filename);
                string newFile = FileManager.ReadFile(usersCurrentActiveFile[userName], 1, 50);
                return Ok(newFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("splitInputsOutputs")]
        public IActionResult SplitInputsOutputs([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                pythonConnection.SplitInputOutput(json);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("splitTrainTest")]
        public IActionResult splitTrainTest([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                pythonConnection.CreateTrainTestData(json);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("createModel")]
        public IActionResult CreateModel([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                pythonConnection.CreateModel(json);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("trainModel")]
        public IActionResult TrainModel([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                string temp = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                temp = temp.Split(" ")[1];
                pythonConnection.TrainModel(json, new Hubs(_hub), temp);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("evaluateModel")]
        public IActionResult EvaluateModel([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                string res = pythonConnection.EvaluateModel(json);
                var temp = JsonConvert.SerializeObject(res);
                return Ok(temp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("predictModel")]
        public IActionResult PredictModel([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                string res = pythonConnection.PredictModel(json);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("saveModel")]
        public async Task<IActionResult> SaveModel([FromBody]dynamic mod)
        {
            try
            {
                string temp = JsonConvert.SerializeObject(mod.Filename); 
                string path = pythonConnection.SaveModel(temp);       // {path, IOSplitJson}
                // SERVER
                // string filename = path.Split('/').Last();
                
                string filename = path.Split("/").Last();
                filename = Path.GetFileName(path);
                //string path = "putanja";
                DateTime createDate = DateTime.Now;
                DateTime lastModificationDate = DateTime.Now;

                Model model = new Model();
                model.modelName = mod.modelName;
                model.experimentid = mod.experimentid;
                model.createDate = createDate;
                model.lastModificationDate = lastModificationDate;
                model.path = filename;
                model.trainTestJSON = mod.trainTestJSON;
                model.configuration = mod.configuration;
                model.modelIDInExperiment = mod.modelIDInExperiment;
                model.modelProblemType = mod.modelProblemType;
                model.trainingOnModel = mod.trainingOnModel; 
                _context.Add(model);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }

        [HttpPost]
        [Route("loadModel")]
        [Authorize(Roles = "Logged, Admin")]
        public IActionResult LoadModel([FromBody] dynamic mode)
        {
            try
            {
                int modelId = mode.modelId; 
                Model model = _context.Models.Where(model => model.Id == modelId).FirstOrDefault();

                if (model == null)
                    return NotFound();

                string baseUrl = GLOBAL_DOWNLOAD_URL;
                string json = "{ \"Model\" : \"" + baseUrl + model.path + "\"}";
                //string json = "{ \"Model\" : \"" + baseUrl + model.path + "\", \"Scalers\" : { ";

                //// Add scalers paths to json
                //string temp = String.Join("\\", model.path.Split("/").SkipLast(1));    // Removes model.format from path
                //string defPath = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, temp);

                //bool first = true;
                //if (System.IO.File.Exists(Path.Combine(defPath, "standardScaler.pkl")))
                //{
                //    json += "\"StandardScaler\" : \"" + baseUrl + temp + "/standardScaler.pkl\"";
                //    first = false;
                //}
                //if (System.IO.File.Exists(defPath + "/NormalizeScaler.pkl"))
                //{
                //    if (!first)
                //        json += ",";
                //    json += "\"NormalizeScaler\" : \"" + baseUrl + temp + "/normalizeScaler.pkl\"";
                //    first = false;
                //}
                //if (System.IO.File.Exists(defPath + "/MinMaxScaler.pkl"))
                //{
                //    if (!first)
                //        json += ",";
                //    json += "\"MinMaxScaler\" : \"" + baseUrl + temp + "/minMaxScaler.pkl\"";
                //    first = false;
                //}

                //json += " } }";
                pythonConnection.CreateTrainTestData(model.trainTestJSON);
                Console.WriteLine(model.trainTestJSON); 
                string temp = pythonConnection.LoadModel(json);

                return Ok(temp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("drawPlot")]
        public IActionResult DrawPlot([FromBody] object jsonobj)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jsonobj);
                Console.WriteLine(json);
                string path = pythonConnection.DrawPlot(json);

                Byte[] b = System.IO.File.ReadAllBytes(path);         
                return File(b, "image/jpeg");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Route("loadPreviousFileVersion")]
        public IActionResult LoadPreviousFileVersion()
        {
            try
            {
                string oldFilename = Path.GetFileName(usersCurrentActiveFile[userName]);
                string[] temp = oldFilename.Split('.');
                string filepath = Path.Combine(FileManager.UsersFolderPath, userName, FileManager.DefaultExperimentFolder, String.Concat(FileManager.PreviousVersionFilename, ".", temp[1]));
                string newFile = FileManager.ReadFile(filepath, 1, 50);

                FileManager.UpdateFileVersion(filepath, temp[0]);
                string url = GLOBAL_DOWNLOAD_URL + oldFilename;
                //string del = FileManager.GetCsvDelimiter(filepath);
                //string json = "{\"Url\" : \"" + url + "\", \"Delimiter\" : \"" + del + "\"}";
                //dynamic jsonS = new System.Dynamic.ExpandoObject();
                //jsonS.Url = url;
                //jsonS.Delimiter = del;
                //string json = JsonConvert.SerializeObject(jsonS);
                pythonConnection.LoadData(url);

                return Ok(newFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        // Downloads file from server
        [HttpPost]
        [Route("downloadFileP")]
        public FileResult DownloadFile(string filename)
        {
            byte[] bytes = FileManager.DownloadFileFromServer(userName, FileManager.DefaultExperimentFolder, filename);

            return File(bytes, "application/octet-stream", filename);
        }


        // Uploads file to server
        [HttpPost]
        [Route("getFilePython")]
        public IActionResult UploadFilePython(string? path = null)
        {

            try
            {
                var file = Request.Form.Files[0];
                string newPath;
                
                if (path != null)
                    newPath = FileManager.UploadFileToServer(userName, Path.Combine(FileManager.DefaultExperimentFolder, path), file);
                else
                    newPath = FileManager.UploadFileToServer(userName, FileManager.DefaultExperimentFolder, file);
                    
                if (newPath != null)
                    return Ok(newPath);
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

    }
}
