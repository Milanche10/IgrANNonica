using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NeuronBack.Helpers;
using System.Data;
using System.Net.Sockets;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NeuronBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private PythonCommunicator pythonConnection;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;
        private IHubContext<Hubs> _hub;

        public TestController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment, IHubContext<Hubs> hub)
        {
            pythonConnection = new PythonCommunicator("temp", "string");
            Environment = _environment;
            _hub = hub;
        }

        [HttpGet]
        [Route("copyFolder")]
        public IActionResult Copy(string newName)
        {
            string source = Path.Combine(FileManager.UsersFolderPath, "test", "CurrentSession");
            string target = Path.Combine(FileManager.UsersFolderPath, "test", newName);
            FileManager.CreateNewFolder(Path.Combine("test", newName));
            FileManager.CloneDirectory(source, target);
            return Ok("Done");
        }

        [HttpGet]
        [Route("download")]
        public FileResult DownloadFile(string fileName)
        {
            //Build the File Path.
            string path = Path.Combine("Experiments/") + fileName;

            //Read the File data into Byte Array.
            byte[] bytes = System.IO.File.ReadAllBytes(path);

            //Send the File to Download.
            return File(bytes, "application/octet-stream", fileName);
        }

        [HttpGet]
        [Route("train")]
        public IActionResult Train()
        {
            //string filepath = "C:\\Users\\xXx-PC\\Desktop\\Projects\\data.csv";
            string filename = "data.csv";
            string url = "http://127.0.0.1:5013/api/ml/downloadFileP?filename=" + filename;
            Console.WriteLine(pythonConnection.LoadData(url));
            string json = "{\"LabelEncode\" : [\"Gender\"], \"OneHotEncode\" : [\"Geography\"]}";
            pythonConnection.EncodeData(json);
            json = "{\"Standardize\" : [\"CreditScore\", \"Balance\", \"EstimatedSalary\"]}";
            pythonConnection.ScaleData(json);
            json = "{\"SplitData\" : {\"Inputs\" : [\"CreditScore\",\"Cat_Geography_France\", \"Cat_Geography_Germany\", \"Cat_Geography_Spain\",\"Gender\", \"Age\", \"Tenure\", \"Balance\", \"NumOfProducts\", \"HasCrCard\", \"IsActiveMember\", \"EstimatedSalary\"], \"Outputs\" : [\"Exited\"]}}";
            pythonConnection.SplitInputOutput(json);
            json = "{\"TrainSize\" : 0.7, \"ValidationSize\" : 0.1, \"TestSize\" : 0.2, \"Shuffle\" : \"True\"}";
            pythonConnection.CreateTrainTestData(json);
            json = "{\"HiddenLayers\" : [6,5], \"HiddenLayerActivationFunc\" : \"relu\",  \"OutputUnits\" : 1, \"OutputLayerActivationFunc\" : \"sigmoid\", \"LossFunction\" : \"binary_crossentropy\", \"Metrics\" : [\"accuracy\"]}";
            pythonConnection.CreateModel(json);
            json = "{\"BatchSize\": 32, \"NumOfEpochs\" : 100, \"EarlyStopping\" : \"Yes\"}";
            //List<string> res = pythonConnection.TrainModel(json);
            json = "{\"Filename\" : \"MyModel\"}";
            string temp = pythonConnection.SaveModel(json);
            //Console.WriteLine(pythonConnection.IfConnected());
            pythonConnection.ClientDisconnect();
            //Console.WriteLine(pythonConnection.IfConnected());
            return Ok(temp);
        }

        [HttpGet]
        [Route("train2")]
        public IActionResult Train2()
        {
            //string filepath = "C:\\Users\\xXx-PC\\Desktop\\Projects\\data.csv";
            string filename = "data2.csv";
            string url = "http://127.0.0.1:5013/api/ml/downloadFileP?filename=" + filename;
            Console.WriteLine(pythonConnection.LoadData(url));
            string json = "{\"LabelEncode\" : [\"Gender\"], \"OneHotEncode\" : [\"Geography\"]}";
            pythonConnection.EncodeData(json);
            json = "{\"Standardize\" : [\"CreditScore\", \"Balance\", \"EstimatedSalary\"]}";
            pythonConnection.ScaleData(json);
            json = "{\"SplitData\" : {\"Inputs\" : [\"CreditScore\",\"Cat_Geography_France\", \"Cat_Geography_Germany\", \"Cat_Geography_Spain\",\"Gender\", \"Age\", \"Tenure\", \"Balance\", \"NumOfProducts\", \"HasCrCard\", \"IsActiveMember\", \"EstimatedSalary\"], \"Outputs\" : [\"Exited\"]}}";
            pythonConnection.SplitInputOutput(json);
            json = "{\"TrainSize\" : 0.7, \"ValidationSize\" : 0.1, \"TestSize\" : 0.2, \"Shuffle\" : \"True\"}";
            pythonConnection.CreateTrainTestData(json);
            //json = "{\"HiddenLayers\" : [6,5], \"HiddenLayerActivationFunc\" : \"relu\",  \"OutputUnits\" : 1, \"OutputLayerActivationFunc\" : \"sigmoid\", \"LossFunction\" : \"binary_crossentropy\", \"Metrics\" : [\"accuracy\"]}";
            //pythonConnection.CreateModel(json);
            url = "http://127.0.0.1:5013/api/ml/downloadFileP?filename=" + "MyModel.h5";
            pythonConnection.LoadModel(url);
            json = "{\"BatchSize\": 32, \"NumOfEpochs\" : 100, \"EarlyStopping\" : \"Yes\"}";
            //List<string> res = pythonConnection.TrainModel(json);
            json = "{\"Filename\" : \"MyModel\"}";
            pythonConnection.SaveModel(json);
            //Console.WriteLine(pythonConnection.IfConnected());
            pythonConnection.ClientDisconnect();
            //Console.WriteLine(pythonConnection.IfConnected());
            return Ok();
        }

        //[HttpGet]
        //[Route("hub")]
        //public IActionResult Hub()
        //{
        //    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", DataManager.GetData()));
        //    return Ok(new { Message = "Request Completed" });
        //}

        [HttpGet]
        [Route("loadModel")]
        public string LoadModel()
        {
            //string filepath = "C:\\Users\\xXx-PC\\Desktop\\Projects\\data.csv";
            string filename = "User1/MyModel.h5";
            string url = "http://127.0.0.1:5013/api/test/download?filename=" + filename;
            pythonConnection.LoadModel(url);
            filename = "data.csv";
            url = "http://127.0.0.1:5013/api/test/download?filename=" + filename;
            Console.WriteLine(pythonConnection.LoadData(url));
            string json = "{\"LabelEncode\" : [\"Gender\"], \"OneHotEncode\" : [\"Geography\"]}";
            pythonConnection.EncodeData(json);
            json = "{\"SplitData\" : {\"Inputs\" : [\"CreditScore\",\"Geography\",\"Gender\", \"Age\", \"Tenure\", \"Balance\", \"NumOfProducts\", \"HasCrCard\", \"IsActiveMember\", \"EstimatedSalary\"], \"Outputs\" : [\"Exited\"]}}";
            pythonConnection.SplitInputOutput(json);
            json = "{\"TestSize\" : 0.2}";
            pythonConnection.CreateTrainTestData(json);
            json = "{\"Standardize\" : [\"CreditScore\", \"Balance\", \"EstimatedSalary\"]}";
            pythonConnection.ScaleData(json);
            string path = "img";
            json = "{\"BatchSize\": 32, \"NumOfEpochs\" : 10, \"Path\" : \"" + path + "\"}";
            //pythonConnection.TrainModel(json);
            return "Done";
        }

        [HttpGet]
        [Route("saveModel")]
        public string SaveModel()
        {
            string json = "{\"Filename\" : \"MyModel2\"}";
            pythonConnection.SaveModel(json);
            return "Done";
        }

        [HttpGet]
        [Route("predict")]
        public string Predict(string prediction)
        {
            return pythonConnection.PredictModel(prediction);
        }

        // GET: api/<TestController>
        [HttpGet]
        [Route("stats")]
        public string Get()
        {
            string filepath = "data.csv";
            Console.WriteLine(pythonConnection.LoadData(filepath));
            string[] dt = pythonConnection.GetStatistics();

            //return pythonConnection.PrintDataTable(dt[0]);
            return dt[0];

        }

        [HttpGet]
        [Route("updateData")]
        public string UpdateData()
        {
            string filepath = "data.csv";
            Console.WriteLine(pythonConnection.LoadData(filepath));
            pythonConnection.UpdateDataValues("{\"0\" : {\"3\" : 700, \"5\" : \"Male\"}, \"1\" : {\"4\" : \"France\", \"6\" : 50} }");

            return "Done";

        }

        [HttpGet]
        [Route("check")]
        public bool Check()
        {
            return pythonConnection.IfConnected();
        }

        // GET api/<TestController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TestController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<TestController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TestController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
