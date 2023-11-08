using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Security.Principal;
using System.Text;

namespace NeuronBack.Helpers
{
    public class PythonCommunicator
    {
        private static IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json").Build();
        
        static IPAddress ipAddr = IPAddress.Parse(config.GetSection("PythonServer").GetValue<string>("IpAddress"));
        static IPEndPoint localEndPoint = new IPEndPoint(ipAddr, config.GetSection("PythonServer").GetValue<int>("Port"));
        private Socket socket = null;

        public PythonCommunicator(string userFolderPath, string token)
        {
            ClientConnect(userFolderPath, token);
        }


        // Connects client to python server
        // Requires path to clients folder on backend
        // Example: UserData/User1
        private void ClientConnect(string userFolderPath, string token)
        {
            try
            {
                socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

                socket.Connect(localEndPoint);
                SendMessage(userFolderPath);
                SendMessage(token);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        // Disconnects client from python server
        // Should be done on user logout
        public void ClientDisconnect()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Disconnect");
                    socket.Shutdown(SocketShutdown.Both);
                    socket.Close();
                }
                catch (SocketException ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");

        }

        public void SendNewToken(string token)
        {
            if(SocketConnection(socket))
            {
                try
                {
                    SendMessage("New token");
                    SendMessage(token);
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Check if client is connected to python server
        public bool IfConnected()
        {
            return SocketConnection(socket);
        }

        private bool SocketConnection(Socket s)
        {
            if (socket == null)
                return false;

            bool part1 = s.Poll(1000, SelectMode.SelectRead);
            bool part2 = (s.Available == 0);

            if (part1 && part2)
                return false;

            return true;
        }

        // Upload data file and load it to Python server
        // Requires link to dataset on backend
        public string LoadData(string url)
        {
            if(SocketConnection(socket))
            {
                try
                {
                    SendMessage("Load data");
                    SendMessage(url);

                    string msg = RecieveMessage();
                    if (!msg.Equals("Data loaded successfully"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Returns correlation matrix and statistics of columns
        // Requires data to be loaded first
        public string[] GetStatistics()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Get data statistics");

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Data not loaded"))
                        throw new Exception(msg);
                    else
                    {
                        string corrMatrix = msg;
                        msg = RecieveMessage();
                        return new string[] { corrMatrix, msg };
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Returns type of columns in dataset
        // Requires data to be loaded first
        public string GetColumnTypes()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Get column types");

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Data not loaded"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Returns suggestions on which data type column should be
        // Requires data to be loaded first
        public string SuggestColumnTypes()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Suggest column types");

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Data not loaded"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Removes/fills NaN values, removes outliers and sets empty cells do NaN
        // json can contain: "SetEmptyToNaN", "RemoveOutlier", "RemoveNaN", "FillNaN"
        // json["RemoveNaN"] = ["ColumnName1" , "ColumnName2" ...]
        // json["FillNaN"] must contain : FillWithMean, FillWithMode
        // jso["FillNaN"] = {"FillWithMode" : ["ColumnName1" , "ColumnName2" ...], "FillWithMean" : []}
        // FillWithMean and FillWithMode can empty lists
        // Example json = { "RemoveOutlier" : ["ColumnName1"],  "SetEmptyToNaN" : ["ColumnName1"], "RemoveNaN" : ["ColumnName1" , "ColumnName2"], "FillNaN" : {"FillWithMode" : ["ColumnName1" , "ColumnName2" ...], "FillWithMean" : []} }
        // Uploads new version of dataset to backend with originalFileName + "_cleaned"
        // Requires data to be loaded first
        // Returns path where file was saved on backend
        public string CleanData(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Clean data");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload _cleaned file"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");

        }

        // User manually changes values in dataset
        // Needs row and column NUMBER
        // Can use: RemoveColumns, RemoveRows, UpdateCells
        // json["RemoveColumns"] = ["ColumnName1/ColumnNumber1" , "ColumnName2/ColumnNumber2"]
        // json["RemoveRows"] = ["RowNumber1" , "RowNumber2"]
        // json["UpdateCells"] = {"rowNumber1" : {"columnName1" : "value1", "columnName2" : "value2"}, "rowNumber5" : {"columnName2" : "value2"}}
        // Example: json["UpdateCells"] = 
        // Example json = {"UpdateCells" : {"0" : {"3" : 700, "5" : "Male"}, "1" : {"4" : "France", "6" : 50} }, "RemoveRows" : ["RowNumber1" , "RowNumber2", "RowNumber5"]}
        // Uploads new version of dataset to backend with originalFileName + "_updated"
        // Requires data to be loaded first
        // Returns path where file was saved on backend
        public string UpdateDataValues(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Update data");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload _updated file") || msg.Equals("ERROR: Data not loaded"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Encodes columns. Must be done before input_output split
        // Must have column name and columns cant appear twice
        // Can use: LabelEncode, OneHotEncode
        // Example: json = {"LabelEncode" : ["ColumnName1" , "ColumnName2"], "OneHotEncode" : ["ColumnName3"]}
        // Uploads new version of dataset to backend with originalFileName + "_encoded"
        // Requires data to be loaded first
        // Returns path where file was saved on backend
        public string EncodeData(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Encode data");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    //if (!msg.Equals("Data encoded successfully"))
                    if (msg.Equals("ERROR: Failed to upload _encoded file") || msg.Equals("ERROR: Data not loaded") || msg.Equals("ERROR: Inputs and outputs are not defined"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Scales data with Standardization, Normalization or MinMax scaling
        // Must have column name and columns cant appear twice
        // Can use: Standardize, Normalize, MinMaxScale
        // Example: json = "{"Standardize" : ["ColumnName1" , "ColumnName2"], "Normalize" : ["ColumnName5"], "MinMaxScale" : ["ColumnName3"]}"
        // Column names SHOULD BE from encoded dataset
        // Uploads new version of dataset to backend with originalFileName + "_scaled"
        // Data scaling doesnt have to be used
        // Requires data to be loaded first
        public string ScaleData(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Scale data");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload _scaled file") || msg.Equals("ERROR: Data not loaded") || msg.Equals("ERROR: Inputs and outputs are not defined") || msg.Equals("ERROR: One of the selected columns is not numeric"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }


        // Scales all data automaticly with Standardization or Normalization
        // Uploads new version of dataset to backend with originalFileName + "_scaled"
        // Data scaling doesnt have to be used
        // Requires data to be loaded first
        public string ScaleDataAutomaticly()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Scale data automaticly");
                    //SendMessage(json);

                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload _scaled file") || msg.Equals("ERROR: Data not loaded") || msg.Equals("ERROR: Inputs and outputs are not defined"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Splits data into inputs and outputs
        // Requires row and column NUMBERS
        // Can use: SplitData
        // Example: json["SplitData"] = {"Inputs" : ["ColumnName1", "ColumnName2", "ColumnName5"], "Outputs" : ["ColumnName7"]}
        // Requires data to be loaded first
        public void SplitInputOutput(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Split input output");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (!msg.Equals("Input output split successful"))
                        throw new Exception(msg);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Splits data into training and test
        // json must contain: TrainSize, ValidationSize, TestSize, Shuffle, SplitSeed
        // json["Shuffle"] can use: True, False
        // json["SplitSeed"]: Must be int
        // if "SplitSeed" is not added, it uses default seed (100)
        // Example: json = {"TrainSize" : 0.7, "ValidationSize" : 0.15, "TestSize" : 0.15, "Shuffle" : "True", "SplitSeed" : 50}
        // TrainSize + ValidationSize + TestSize = 1.0 <- MUST equal 1.0
        // Requires data to be split into inputs and outputs first
        public void CreateTrainTestData(string json)
        {
            if(SocketConnection(socket))
            {
                try
                {
                    SendMessage("Create train_test data");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (!msg.Equals("Data split successful"))
                        throw new Exception(msg);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Creates and compiles model based on users settings
        // Can use Metrics : accuracy, mse, mae, recall, precision, rmse, auc
        // Can use HiddenLayerActivationFunc: relu, sigmoid, tahn
        // Can use OutputLayerActivationFunc: linear, sigmoid, softmax
        // Can use LossFunction: binary_crossentropy, mean_absolute_error, mean_squared_error, categorical_crossentropy
        // json["HiddenLayers"] containts number of neurons in each layer. [6,5] means that there are 2 layers, 1st layer has 6, 2nd layer has 5 neurons
        // Example: {"HiddenLayers" : [6,5], "HiddenLayerActivationFunc" : "relu",  "OutputUnits" : 1, "OutputLayerActivationFunc" : "sigmoid", "LossFunction" : "binary_crossentropy", "Metrics" : ["accuracy", "recall"]}
        public void CreateModel(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Create model");
                    SendMessage(json);

                    string msg = RecieveMessage();
                    if (!msg.Equals("Model created successufully"))
                        throw (new Exception(msg));
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Trains model
        // json must have: BatchSize, NumOfEpochs
        // EarlyStopping can use: Any number (Number of epochs with no changes) -> Suggested for larger number of epochs
        // Example: json = {"BatchSize" : 30, "NumOfEpochs" : 50, "EarlyStopping" : 3}
        // Required model to be created and compiled
        public void TrainModel(string json, Hubs hub, string token)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Train model");
                    SendMessage(json);
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Model not created or compiled") || msg.Equals("ERROR: Training data is not split"))
                        throw new Exception(msg);
                    
                    do
                    {
                        msg = RecieveMessage();
                        //Console.WriteLine(msg);
                        var res = JsonConvert.SerializeObject(msg);
                        hub.SendData(Hubs.activeUsers[token], res);
                    } while (!msg.Equals("Model training completed"));
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Returns evaluation of currently active model. Returns final metrics and loss function used for training
        // Example: json = {"BatchSize" : 30}
        // Requires model to be trained
        public string EvaluateModel(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Evaluate model");
                    SendMessage(json);
                    // Return evaluations
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Model not created or compiled") || msg.Equals("ERROR: No test data available"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Predicts data
        // json["PredictDataType"] can use: Test, Input.. Dont use this if user uploaded new dataset only for predictions
        // if json["PredictDataType"] == Input THEN must have json["PredictDataInput"] = [{"ColumnName1" : "Value1", "ColumnName2" : "Value2" ..}, {"ColumnName1" : "Value1"....}, ...]
        // json["PredictDataInput"] contains json array of columns that user inserted manually. Must be same columns that are defined as input
        // json["Type"] Can use: Regression, Class, Probability
        // Example: json = {"Type" : "Regression", "PredictDataType" : "Test"}
        // Example: json = {"Type" : "Class", "PredictDataType" : "Input", "PredictDataInput" : [{"ColumnName1" : "Value1", "ColumnName2" : "Value2" ..}, {"ColumnName1" : "Value1"....}, ...]}
        // Returns confusion matrix if "PredictDataType" == "Test"
        // Returns array of predicted output values for each row
        // Requires model to be created or loaded
        public string PredictModel(string prediction)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Predict model");
                    SendMessage(prediction);
                    // Return predictions
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Model not created or compiled") || msg.Equals("ERROR: Classification metrics can't handle a mix of binary and continuous targets"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Saves currently active model
        // Filename : User needs to name the model. No extentions needed
        // Example: json = {"Filename" : "MyModel"}
        // Uploads saved model to users folder on backend
        // Requires model to be trained
        // Returns path where model was saved on backend
        public string SaveModel(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Save model");
                    SendMessage(json);
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload model file") || msg.Equals("ERROR: Model not created or compiled"))
                        throw new Exception(msg);

                    //string path = RecieveMessage();
                    //if (path.Equals("ERROR: Failed to upload model file") || path.Equals("ERROR: Model not created or compiled"))
                    //    throw new Exception(path);

                    //return new string[] {path, IOSplit};

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Loads model from given link on backend
        // Must have: Model, Scalers
        // json["Scalers"] can be empty if no scalers are saved
        // json["Scalers"] can be: StandardScaler, NormalizeScaler, MinMaxScaler
        // Example: json = {"Model" : "modelURL", "Scalers" : {"StandardScaler" : "StandardScalerURL", "NormalizeScaler" : "NormalizeScalerURL"}}
        // Example: json = {"Model" : "modelURL", "Scalers" : { } }     - If no scalers saved
        // Returns number of neurons per layer in csv format
        public string LoadModel(string json)
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Load model");
                    SendMessage(json);
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Model couldn't be loaded"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        public string SaveExperiment()
        {
            if (SocketConnection(socket))
            {
                try
                {
                    SendMessage("Save experiment");
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Data not loaded") || msg.Equals("ERROR: Inputs and outputs are not defined"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Draws plot and uploads it to the server
        // must contain: X, Y OR X, Type
        // Use X, Y to show graph of Scatterplot if both columns are numeric; Boxplot if only one is numeric; Barplot if both are not numeric
        // Use X, Type to show statistics plot of column X
        // json["Type"] can use: Hist, Violin, Boxplot
        // Example: json = {"X" : "ColumnName1", "Y" : "ColumnName2"}
        // Example: json = {"X" : "ColumnName1", "Type" : "Boxplot"}
        // IMPORTANT NOTE: This function/command doesnt check what type given data is if only X and Type is sent
        public string DrawPlot(string json)
        {
            if(SocketConnection(socket))
            {
                try
                {
                    SendMessage("Draw plot");
                    SendMessage(json);
                    string msg = RecieveMessage();
                    if (msg.Equals("ERROR: Failed to upload plot file") || msg.Equals("ERROR: Data not loaded") || msg.Equals("ERROR: Failed to create a plot"))
                        throw new Exception(msg);

                    return msg;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Connection doesn't exist");
        }

        // Helper functions
        ////////////////
        private DataTable CsvToDataTable(string data)
        {
            DataTable table = new DataTable();
            string[] tableData = data.Split("\r\n".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            var col = from cl in tableData[0].Split(",".ToCharArray())
                      select new DataColumn(cl);
            table.Columns.AddRange(col.ToArray());

            (from st in tableData.Skip(1)
             select table.Rows.Add(st.Split(",".ToCharArray()))).ToList();

            return table;
        }

        public string PrintDataTable(DataTable dt)
        {
            string res = string.Join(";",
                dt.Columns.OfType<DataColumn>().Select(x => string.Join(" ; ", x.ColumnName)));

            res += "\n" + string.Join(Environment.NewLine,
                dt.Rows.OfType<DataRow>().Select(x => string.Join(" ; ", x.ItemArray)));

            return res;
        }

        private void SendMessage(string message)
        {
            byte[] messageSend = Encoding.UTF8.GetBytes(message);
            string temp = messageSend.Length.ToString();
            byte[] array = Encoding.UTF8.GetBytes(temp.PadRight(10, ' '));
            int byteSend = socket.Send(array);
            byteSend = socket.Send(messageSend);
            //Thread.Sleep(10);
        }

        private string RecieveMessage(int numOfBytes = 4*1024)
        {
            try
            {
                byte[] recvBuffer = new byte[10];
                int byteRecv = socket.Receive(recvBuffer);
                string temp = Encoding.UTF8.GetString(recvBuffer, 0, byteRecv);
                recvBuffer = new byte[int.Parse(temp)];
                byteRecv = socket.Receive(recvBuffer);
                return Encoding.UTF8.GetString(recvBuffer, 0, byteRecv);
            }
            catch(SocketException se)
            {
                if(se.ErrorCode == 10054)
                    Console.WriteLine("Connection lost");
            }

            return null;
        }

       

        ///////////////////////////
    }
}
