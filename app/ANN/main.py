import random, threading, socket, json, requests, time, os, shutil, io, pickle
import NeuralNetwork, DataProcessing
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from pandas.api.types import is_numeric_dtype
from sklearn.metrics import confusion_matrix



# Global 

# Server settings
numOfBytes = 8 * 1024
charEncoding = "UTF-8"
serverAdress = ''
port = 10036

# local settings
sendFileURL = "http://127.0.0.1:10033/api/ML/getFilePython"
userFolders = "Users"

########

def SendDataStatistics(client, data):
    SendMessage(client, data.corr().round(5).to_csv())
    temp = data.describe(include="all").round(3)
    temp = temp.append(pd.Series(data.isnull().sum(axis=0), name="NaN"))
    SendMessage(client, temp.to_csv())
    
def RecieveMessage(client):
    try:
        temp = client.recv(10).decode(charEncoding)
        return client.recv(int(temp)).decode(charEncoding)
    except Exception as e:
        pass

def SendMessage(client, msg):
    try:
        encMsg = msg.encode(charEncoding)
        msgLen = bytes(str(len(encMsg)), charEncoding)
        msgLen = b'0' * (10-len(msgLen)) + msgLen
        client.send(msgLen)
        client.send(encMsg)
    except Exception as e:
        pass
    
def SaveDfToFile(data, filename):
    ext = filename.split('.')[-1]
    try:
        if(ext == "csv"):               # csv
            data.to_csv(filename, index=False)
        elif(ext == "xls"):             # excel
            data.to_excel(filename, index=False)
        elif(ext == "json"):             # json
            data.to_json(filename, index=False)
    except:
        print( "Unable to save file")
    
    
def UploadFileToServer(url, localFilepath, token):
    with open(localFilepath, "rb") as file:
        resp = requests.post(url, files={"modifiedDataset" : file}, headers={"Authorization" : token})
        
        if(resp.ok):
            print("File uploaded")
            return resp.text
        else:
            print("ERROR: uploading file failed", resp)
            return None
        
def CreateUserFolder(userId):
    if(os.path.exists(userFolders + "/" + userId) == False):
         os.makedirs(userFolders + "/" + userId)
            
def SendFile(data, filename, addToName, url, localFilePath, token):
    
    if(addToName != None):
        newFilename = filename.split('.')[0] + "_" + addToName + "." + filename.split('.')[-1]
    else:
        newFilename = filename
    
    CreateUserFolder(localFilePath)
    SaveDfToFile(data, userFolders + "/" + localFilePath+"/"+newFilename)
    success = UploadFileToServer(url, userFolders + "/" + localFilePath+"/"+newFilename, token)
    os.remove(userFolders + "/" + localFilePath+"/" + newFilename)
    
    return success

def RequestFile(url, token, path):
    try:
        req = requests.post(url, allow_redirects=True, headers={"Authorization" : token})
        with open(path, 'wb') as file:
            file.write(req.content)
    except Exception as ex:
        print(ex)
    
def LoadData(url, token):
    filename = url.split('=')[-1]
    #filename = json["Url"].split('=')[1]
    ext = filename.split('.')[-1]
    data = pd.DataFrame()
    try:
        req = requests.post(url, headers={"Authorization" : token})
        #req = requests.post(json["Url"], headers={"Authorization" : token})
        
        if(ext == "csv"):               # csv
            data = pd.read_csv(io.StringIO(req.text), sep=",|;|\||\t")
            #data = pd.read_csv(io.StringIO(req.text), delimiter=json["Delimiter"])
        elif(ext == "xls"):             # excel
            data = pd.read_excel(io.StringIO(req.text))
        elif(ext == "json"):             # json
            data = pd.read_json(io.StringIO(req.text))
    except Exception as e:
        raise Exception("ERROR: file format is not supported or file doesn't exist")
    
    return filename, data

def CreateInputAndOutputs(data, json):
    inputs = pd.DataFrame()
    inputs = data[json["Inputs"]].copy()
            
    outputs = pd.DataFrame()
    outputs = data[json["Outputs"]].copy()     
    
    return inputs, outputs

def DrawPlotTwo(data, x, y):
    
    try:
        if(is_numeric_dtype(data[x]) and is_numeric_dtype(data[y])):
            sns.scatterplot(data[x], data[y])
        elif(not is_numeric_dtype(data[x]) and not is_numeric_dtype(data[y])):
            pd.crosstab(data[x], data[y]).plot.bar()
        else:
            sns.boxplot(data[x], data[y])
        
        return plt
    except:
        return None

def DrawPlotSingle(data, x, plotType):
    
    try:
        if(plotType == "Hist"):
            plt.hist(data[x], linewidth=0.5)
        elif(plotType == "Boxplot"):
            plt.boxplot(data[x], showmeans=True)
        elif(plotType == "Violin"):
            plt.violinplot(data[x])
           
        return plt
    except:
        return None
        
        

def UpdateInputOutputList(inputsOutputsJson, originalColumn, encodedColumns, encodedDict):      # Used for encoded columns
    
    for l in inputsOutputsJson["SplitData"]:
        for column in inputsOutputsJson["SplitData"][l]:
            if(column == originalColumn):
                inputsOutputsJson["SplitData"][l].remove(originalColumn)
                inputsOutputsJson["SplitData"][l] += encodedColumns
                encodedDict[column] = encodedColumns
                
    return inputsOutputsJson, encodedDict

def EncodeToScalePrep(encodedDict, scaleList):
    
    for column in encodedDict:
        if(column in scaleList):
            scaleList.remove(column)
            scaleList += encodedDict[column]
            
    return scaleList
            

def TrainThread(client, jsonString, model, xtrain, ytrain, hasVal, trainTestSplit, xval = None, yval = None):
    
    print("LOG: Training model")
            
    if(model == None):
        SendMessage(client, "ERROR: Model not created or compiled")
    elif(trainTestSplit == False):
        SendMessage(client, "ERROR: Training data is not split")
    else:
        try:
            if(hasVal == True):
                NeuralNetwork.TrainModel(model, xtrain, ytrain, xval, yval, jsonString, client)
            else:
                NeuralNetwork.TrainModel(model, xtrain, ytrain, [], [], jsonString, client)
                        
            SendMessage(client, "Model training completed")
            print("LOG: Training model completed")
            
        except Exception as e:
            print(str(e))
            SendMessage(client, str(e))
            
    

def Fork(client, myId):
    data = pd.DataFrame()
    
    inputOutputSplit = False
    trainTestSplit = False
    
    splitDatajson = None
    encodedColumnsDict = {}
    
    model = None
    compileModelData = None
    
    standardScaler = None
    normalizeScaler = None
    minMaxScaler = None
    
    hasTest = False
    hasVal = False
    
    clientPath = RecieveMessage(client)
    myToken = RecieveMessage(client)
    
    while True:
        msg = RecieveMessage(client)
        
        if(msg == "Load data"):
            msg = RecieveMessage(client)
            
            #jsonString = json.loads(msg)
            
            try:
                filename, data = LoadData(msg, myToken)
            except Exception as e:
                SendMessage(client, str(e))
            
            if(data.empty):
                SendMessage(client, "ERROR: This file format is not supported or file doesn't exist")
            else:
                splitDatajson = None
                standardScaler = None
                normalizeScaler = None
                minMaxScaler = None
                trainTestSplit = False
                inputOutputSplit = False    # Reset to false when new data is loaded
                SendMessage(client, "Data loaded successfully")
                print("LOG: Data loaded successfully")
            
    
        if(msg == "Get data statistics"):
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else: 
                SendDataStatistics(client, data)
                
        if(msg == "Get column types"):
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else:
                res = DataProcessing.GetColumnType(data)
                SendMessage(client, res.to_csv())
                
        if(msg == "Suggest column types"):
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else:
                res = DataProcessing.SuggestColumnType(data)
                SendMessage(client, res.to_csv())
            
        if(msg == "Clean data"):
            msg = RecieveMessage(client)
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else:
                jsonString = json.loads(msg)
                if("SetEmptyToNaN" in jsonString):
                    data = DataProcessing.SetEmptyToNaN(data, jsonString["SetEmptyToNaN"]) 
                if("RemoveNaN" in jsonString):
                    data = DataProcessing.RemoveNaNValues(data, jsonString["RemoveNaN"])
                if("FillNaN" in jsonString):
                    data = DataProcessing.FillNaNValues(data, jsonString["FillNaN"]["FillWithMean"], jsonString["FillNaN"]["FillWithMode"])
                if("RemoveOutlier" in jsonString):
                    data = DataProcessing.RemoveOutlier(data, jsonString["RemoveOutlier"])
                if("ConvertColumns" in jsonString):
                    data = DataProcessing.ConvertColumnType(data, jsonString["ConvertColumns"])
                
                uploadSuccess = SendFile(data, filename, "cleaned", sendFileURL, str(myId), myToken)
                if(uploadSuccess != None):
                    SendMessage(client, uploadSuccess)
                    print("LOG: Data cleaned successfully")
                else:
                    SendMessage(client, "ERROR: Failed to upload _cleaned file")
                
            # Send new df to frontend
                
        if(msg == "Update data"):
            msg = RecieveMessage(client)
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else:
                jsonString = json.loads(msg)
                if("UpdateCells" in jsonString):
                    data = DataProcessing.ChangeDataValues(data, jsonString["UpdateCells"])
                if("RemoveColumns" in jsonString):
                    data = DataProcessing.RemoveColumns(data, jsonString["RemoveColumns"])
                if("RemoveRows" in jsonString):
                    data = DataProcessing.RemoveRows(data, jsonString["RemoveRows"])
                
                uploadSuccess = SendFile(data, filename, "updated", sendFileURL, str(myId), myToken)
                if(uploadSuccess != None):
                    SendMessage(client, uploadSuccess)
                    print("LOG: Data updated successfully")
                else:
                    SendMessage(client, "ERROR: Failed to upload _updated file")

            # Send new df to frontend
            
        if(msg == "Split input output"):
            msg = RecieveMessage(client)
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            elif(data.isnull().sum().sum() != 0):
                SendMessage(client, "ERROR: NaN values are present in dataset")
            else:
                jsonString = json.loads(msg)
                ins, outs = CreateInputAndOutputs(data, jsonString["SplitData"])
                splitDatajson = jsonString

                inputOutputSplit = True
                SendMessage(client, "Input output split successful")
                print("LOG: Input output split successful")
                
        if(msg == "Encode data"):
            msg = RecieveMessage(client)
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            elif(inputOutputSplit == True):
                jsonString = json.loads(msg)
                
                if("LabelEncode" in jsonString):
                    for column in jsonString["LabelEncode"]:
                        data[column] = DataProcessing.LabelEncode(data, column)
                
                if("OneHotEncode" in jsonString):
                    for column in jsonString["OneHotEncode"]:
                        data, encodedColumnsNames = DataProcessing.OneHotEncode(data, column)
                        splitDatajson, encodedColumnsDict = UpdateInputOutputList(splitDatajson, column, encodedColumnsNames, encodedColumnsDict)
                
                uploadSuccess = SendFile(data, filename, "encoded", sendFileURL, str(myId), myToken)
                if(uploadSuccess != None):
                    SendMessage(client, uploadSuccess)
                    print("LOG: Data encoded successfully")
                else:
                    SendMessage(client, "ERROR: Failed to upload _encoded file")
                    print("LOG: Failed to upload _encoded file")
            else:
                SendMessage(client, "ERROR: Inputs and outputs are not defined")
                
                
            # Send new df to frontend
        
        if(msg == "Scale data"):
            msg = RecieveMessage(client)
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            elif(inputOutputSplit == True):
                jsonString = json.loads(msg)
                
                columnsCheck = set(jsonString["Standardize"] + jsonString["Normalize"] + jsonString["MinMaxScale"])
                temp = data[data.columns.intersection(columnsCheck)].apply(lambda s: pd.to_numeric(s, errors='coerce').notnull().all())
                
                if(False in list(temp)):
                    SendMessage(client, "ERROR: One of the selected columns is not numeric")
                else:
                    if("Standardize" in jsonString and len(jsonString["Standardize"]) > 0):
                        jsonString["Standardize"] = EncodeToScalePrep(encodedColumnsDict, jsonString["Standardize"])
                        data, standardScaler = NeuralNetwork.Standardization(data, jsonString["Standardize"])
                    if("Normalize" in jsonString and len(jsonString["Normalize"])> 0):
                        jsonString["Normalize"] = EncodeToScalePrep(encodedColumnsDict, jsonString["Normalize"])
                        data, normalizeScaler = NeuralNetwork.Normalization(data, jsonString["Normalize"])
                    if("MinMaxScale" in jsonString and len(jsonString["MinMaxScale"]) > 0):
                        jsonString["MinMaxScale"] = EncodeToScalePrep(encodedColumnsDict, jsonString["MinMaxScale"])
                        data, minMaxScaler = NeuralNetwork.MinMaxScaling(data, jsonString["MinMaxScale"])
                        
                    uploadSuccess = SendFile(data, filename, "scaled", sendFileURL, str(myId), myToken)
                    if(uploadSuccess != None):
                        SendMessage(client, uploadSuccess)
                        print("LOG: Data scaled successfully")
                    else:
                        SendMessage(client, "ERROR: Failed to upload _scaled file")     # Send new df to frontend
                        print("LOG: Failed to upload _scaled file")
            else:
                SendMessage(client, "ERROR: Inputs and outputs are not defined")
            
        if(msg == "Scale data automaticly"):        # DO NOT USE
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            elif(inputOutputSplit == True):
                
                data, standardScaler, normalizeScaler = NeuralNetwork.ScaleDataAutomaticly(data)
                
                uploadSuccess = SendFile(data, filename, "scaled", sendFileURL, str(myId), myToken)
                if(uploadSuccess != None):
                    SendMessage(client, uploadSuccess)
                    print("LOG: Data scaled successfully")
                else:
                    SendMessage(client, "ERROR: Failed to upload _scaled file")     # Send new df to frontend
            else:
                SendMessage(client, "ERROR: Inputs and outputs are not defined")            

        if(msg == "Create train_test data"):
            msg = RecieveMessage(client)
            trainTestSplit = False
            
            if(inputOutputSplit == False):
                SendMessage(client, "ERROR: Input and output not defined")
            else:
                numCheck = data.apply(lambda s: pd.to_numeric(s, errors='coerce').notnull().all()) 
                if(False in numCheck or data.isnull().values.any() == True):
                    SendMessage(client, "ERROR: You can't use non-numeric or null values")
                    
                ins, outs = CreateInputAndOutputs(data, splitDatajson["SplitData"])
                jsonString = json.loads(msg)
                
                if("SplitSeed" in jsonString):
                    seed = jsonString["SplitSeed"]
                else:
                    seed = 100
                    
                tempIns = ins.to_numpy()
                tempOuts = outs.to_numpy()
                
                hasTest = False
                hasVal = False
                
                if(jsonString["ValidationSize"] > 0 and jsonString["TestSize"] > 0):
                    xtrain, x_val_test, ytrain, y_val_test = train_test_split(tempIns, tempOuts, test_size= (1 - jsonString["TrainSize"]), random_state = seed, shuffle=bool(jsonString["Shuffle"]))
                    xtest, xval, ytest, yval = train_test_split(x_val_test, y_val_test, test_size=(jsonString["ValidationSize"] / (jsonString["TestSize"] + jsonString["ValidationSize"])), random_state = seed, shuffle=bool(jsonString["Shuffle"]))
                    hasTest = True
                    hasVal = True
                elif(jsonString["TestSize"] > 0):
                    xtrain, xtest, ytrain, ytest = train_test_split(tempIns, tempOuts, test_size= jsonString["TestSize"], random_state = seed, shuffle=bool(jsonString["Shuffle"]))
                    hasTest = True
                elif(jsonString["ValidationSize"] > 0):
                    xtrain, xval, ytrain, yval = train_test_split(tempIns, tempOuts, test_size= jsonString["ValidationSize"], random_state = seed, shuffle=bool(jsonString["Shuffle"]))
                    hasVal = True
                else:
                    xtrain = np.array(tempIns)
                    ytrain = np.array(tempOuts)
                
                trainTestSplit = True
                SendMessage(client, "Data split successful")
                print("LOG: Data split successful")
        
        if(msg == "Create model"):
            msg = RecieveMessage(client)
            jsonString = json.loads(msg)
            
            if(inputOutputSplit == False):
                SendMessage(client, "Inputs and outputs are not defined")
            else:
                jsonString["InputDim"] = ins.shape[1]
                jsonString["OutputUnits"] = outs.shape[1]

                try:
                    compileModelData = jsonString
                    model = NeuralNetwork.CreateModel(jsonString)
                    print("LOG: Model created")
                    NeuralNetwork.CompileModel(model, jsonString)
                    print("LOG: Model compiled")
                    SendMessage(client, "Model created successufully")
                except Exception as e:
                    SendMessage(client, "ERROR: Failed to create model")
                
        # if(msg == "Train model"):
        #     msg = RecieveMessage(client)
        #     jsonString = json.loads(msg)
        #     print("LOG: Training model")
            
        #     if(model == None):
        #         SendMessage(client, "ERROR: Model not created or compiled")
        #     elif(trainTestSplit == False):
        #         SendMessage(client, "ERROR: Training data is not split")
        #     else:
        #         try:
        #             if(hasVal == True):
        #                 NeuralNetwork.TrainModel(model, xtrain, ytrain, xval, yval, jsonString, client)
        #             else:
        #                 NeuralNetwork.TrainModel(model, xtrain, ytrain, [], [], jsonString, client)
                        
        #             SendMessage(client, "Model training completed")
        #             print("LOG: Training model completed")
        #         except Exception as e:
        #             SendMessage(client, str(e))
        
        if(msg == "Train model"):
            
            try:
                msg = RecieveMessage(client)
                jsonString = json.loads(msg)

                #localModel = NeuralNetwork.CloneModel(model, compileModelData)
                
                if(hasVal == True):
                    t = threading.Thread(target=TrainThread, args=(client, jsonString, model, xtrain, ytrain, hasVal, trainTestSplit, xval, yval))
                else:
                    t = threading.Thread(target=TrainThread, args=(client, jsonString, model, xtrain, ytrain, hasVal, trainTestSplit))
            
                t.start()

            except Exception as e:
                 SendMessage(client, str(e))
                 print(e)
            
            
        if(msg == "Evaluate model"):
            msg = RecieveMessage(client)
            
            if(model == None):
                SendMessage(client, "ERROR: Model not created or compiled")
            elif(hasTest == False):
                SendMessage(client, "ERROR: No test data available")
            else:
                jsonString = json.loads(msg)
                evaluation = NeuralNetwork.EvaluateModel(model, xtest, ytest, jsonString["BatchSize"])
                
                if(jsonString["Type"] == "Regression"):
                    prediction = NeuralNetwork.MakeRegressionPredictions(model, xtest)
                elif(jsonString["Type"] == "Class"):
                    prediction = NeuralNetwork.MakeClassPredictions(model, xtest)
                elif(jsonString["Type"] == "Probability"):
                    prediction = NeuralNetwork.MakeProbabilityPredictions(model, xtest)

                #resDf = pd.DataFrame(ytest, columns=["Actual"])
                #resDf.insert(1, "Predicted", prediction)

                #res = {"Evaluation" : evaluation, "PredictionResult" : resDf.to_json()}
                res = {"Evaluation" : evaluation, "Actual" : ytest.reshape(-1).tolist(), "Predicted" : prediction.reshape(-1).tolist()}
                
                SendMessage(client, json.dumps(res))
                print("LOG: Model evaluation completed")
                
        if(msg == "Predict model"):
            msg = RecieveMessage(client)
            
            if(model == None):
                SendMessage(client, "ERROR: Model not created or compiled") 
            else:
                jsonString = json.loads(msg) 
                
                if(jsonString["PredictDataType"] == "Data" and data.empty):
                    SendMessage(client, "ERROR: Data is not loaded") 
                else:
                    if(jsonString["PredictDataType"] == "Input"):
                        data = pd.read_json(jsonString["PredictDataInput"])
                        
                    if(jsonString["Type"] == "Regression"):
                        prediction = NeuralNetwork.MakeRegressionPredictions(model, data)
                    elif(jsonString["Type"] == "Class"):
                        prediction = NeuralNetwork.MakeClassPredictions(model, data)
                    elif(jsonString["Type"] == "Probability"):
                        prediction = NeuralNetwork.MakeProbabilityPredictions(model, data)

                    SendMessage(client, prediction)
                
                # if(jsonString["PredictDataType"] == "Test"):
                #     data = xtest
                # elif(jsonString["PredictDataType"] == "Input"):
                #     data = pd.read_json(jsonString["PredictDataInput"])
                
                # if(jsonString["Type"] == "Regression"):
                #     prediction = NeuralNetwork.MakeRegressionPredictions(model, data)
                # elif(jsonString["Type"] == "Class"):
                #     prediction = NeuralNetwork.MakeClassPredictions(model, data)
                # elif(jsonString["Type"] == "Probability"):
                #     prediction = NeuralNetwork.MakeProbabilityPredictions(model, data)

                # if(jsonString["PredictDataType"] == "Test"):
                #     try:
                #         cm = confusion_matrix(ytest, prediction)
                #         SendMessage(client, str(cm.ravel())) #################
                #     except Exception as e:
                #         SendMessage(client, "ERROR:" + str(e))
                # else:  
                #     SendMessage(client, prediction)
                    
                # Send predictions back
                    
        if(msg == "Save model"):
            msg = RecieveMessage(client)
            if(model == None):
                SendMessage(client, "ERROR: Model not created or compiled")
            else:
                jsonString = json.loads(msg)
                
                try:
                    NeuralNetwork.SaveModel(model, userFolders +"/" + str(myId), jsonString["Filename"])
                
                    # Upload model to backend
                    filepath = userFolders + "/" + str(myId) + "/"
                    url = sendFileURL + "?path="
                    
                    # if(standardScaler != None):
                    #     pickle.dump(standardScaler, open(filepath+"standardScaler.pkl", "wb"))
                    #     UploadFileToServer(url + jsonString["Filename"], filepath + "standardScaler.pkl", myToken)
                    # if(normalizeScaler != None):
                    #     pickle.dump(normalizeScaler, open(filepath+"normalizeScaler.pkl", "wb"))
                    #     UploadFileToServer(url + jsonString["Filename"], filepath + "normalizeScaler.pkl", myToken)
                    # if(minMaxScaler != None):
                    #     pickle.dump(minMaxScaler, open(filepath+"minMaxScaler.pkl", "wb"))
                    #     UploadFileToServer(url + jsonString["Filename"], filepath + "minMaxScaler.pkl", myToken)
                    
                    uploadSuccess = UploadFileToServer(url + jsonString["Filename"], filepath + jsonString["Filename"] + ".h5", myToken)
                    
                    if(uploadSuccess != None):
                        #SendMessage(client, splitDatajson)
                        SendMessage(client, uploadSuccess)
                        print("LOG: Model saved")
                    else:
                        SendMessage(client, "ERROR: Failed to upload model file")
                except Exception as e:
                    SendMessage(client, str(e))
        
        if(msg == "Load model"):
            msg = RecieveMessage(client)
            
            jsonString = json.loads(msg)
            #print(jsonString)
            temp = jsonString["Model"].split('=')[-1]
            filename = temp.split('/')[-1]
            filepath = userFolders + "/" + str(myId)# + "/" + filename
            RequestFile(jsonString["Model"], myToken, filepath)
            model = NeuralNetwork.LoadModel(filepath)
            
            # for scaler in jsonString["Scalers"]:
            #     temp = jsonString["Scalers"][scaler].split('=')[-1]
            #     filename = temp.split('/')[-1]
            #     filepath = userFolders + "/" + str(myId)# + "/" + filename
            #     RequestFile(jsonString["Scalers"][scaler], myToken, filepath)
            #     if(scaler == "StandardScaler"):
            #         standardScaler = pickle.load(open(filepath, "rb"))
            #         print("standardScaler loaded")
            #     elif(scaler == "NormalizeScaler"):
            #         normalizeScaler = pickle.load(open(filepath, "rb"))
            #         print("normalizeScaler loaded")
            #     else:
            #         minMaxScaler = pickle.load(open(filepath, "rb"))
            #         print("minMaxScaler loaded")
            
            if(model != None):
                neuronsPerLayer = []
                for i in range(len(model.layers)):
                    neuronsPerLayer.append(model.layers[i].output.shape[1])
                
                temp = pd.DataFrame({"HiddenLayers" : neuronsPerLayer, "HiddenLayerActivationFunc" : model.layers[0].get_config()['activation'], "OutputLayerActivationFunc" : model.layers[-1].get_config()['activation']}).to_csv()
                SendMessage(client, temp)
                print("LOG: Model loaded")
            else:
                SendMessage(client, "ERROR: Model couldn't be loaded")
                
        if(msg == "Save experiment"):
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            if(inputOutputSplit == True):
                SendMessage(client, str(splitDatajson))
                print("LOG: Experiment saved")
            else:
                SendMessage(client, "ERROR: Inputs and outputs are not defined")
                
        if(msg == "Disconnect"):
            print("LOG: Client disconnected")
            client.close()
            try:
                shutil.rmtree(userFolders + "/" + str(myId))
            except:
                pass
            break
        
        if(msg == "New token"):
            msg = RecieveMessage(client)
            myToken = msg
        
        if(msg == "Draw plot"):
            msg = RecieveMessage(client)
            
            if(data.empty):
                SendMessage(client, "ERROR: Data not loaded")
            else:
                jsonString = json.loads(msg)
                
                try:
                    plt.clf()
                    
                    if("Y" in jsonString):
                        plot = DrawPlotTwo(data, jsonString["X"], jsonString["Y"])
                        plt.xlabel(jsonString["X"])
                        plt.ylabel(jsonString["Y"])
                        plt.title(jsonString["X"] + " vs " + jsonString["Y"])
                    else:
                        plot = DrawPlotSingle(data, jsonString["X"], jsonString["Type"])    
                        plt.xlabel(jsonString["X"])
                        plt.ylabel("Count")
                        plt.title(jsonString["X"])
                    
                    if(plot == None):
                        SendMessage(client, "ERROR: Failed to create a plot")
                    else:
                        plt.tight_layout()
                        plt.xticks(rotation = 45, ha = 'right')
                        #legend = plt.legend(loc="best", mode="expand", bbox_to_anchor = (1, 1))
                        #plt.legend(loc="best")
                        plt.legend(loc="upper center")
                        filepath = userFolders + "/" + str(myId) + "/plot.png"
                        CreateUserFolder(str(myId))
                        plot.savefig(filepath)
                        
                        uploadSuccess = UploadFileToServer(sendFileURL, filepath, myToken)
                        if(uploadSuccess != None):
                            SendMessage(client, uploadSuccess)
                            print("LOG: Plot uploaded")
                        else:
                            SendMessage(client, "ERROR: Failed to upload plot file")
                except Exception as e:
                    SendMessage(client, str(e))
                
        
def ServerStartup():
    try:
        shutil.rmtree(userFolders)
    except:
        pass
    
    os.makedirs(userFolders)

def main():
    
    ServerStartup()
    
    plt.switch_backend('Agg')
    plt.style.use('ggplot') 
    
    userId = 0
    server = socket.socket()
    server.bind((serverAdress, port))
    server.listen()
    print("Waiting for connection")

    while True:
        client, address = server.accept()
        print("Client connected")
        
        t = threading.Thread(target=Fork, args=(client, userId), daemon = True)
        t.start()
        
        userId += 1

###################
if __name__ == "__main__":
    main()