import matplotlib.pyplot as plt
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import Normalizer
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import shapiro
import main
import pandas as pd
import pickle

class CustomHistoryCallback(tf.keras.callbacks.Callback):
    def __init__(self, client):
        self.client = client
    def on_epoch_end(self, epoch, logs=None):
        temp = {k: round(v, 3) for k, v in logs.items()}        # round values to 3 decimals
        main.SendMessage(self.client, str(temp))
        
class CustomHistoryCallback2(tf.keras.callbacks.Callback):
    def __init__(self, path):
        self.history = []
        self.path = path
        plt.switch_backend('Agg')
    def on_epoch_end(self, epoch, logs=None):
        temp = {k: round(v, 3) for k, v in logs.items()}        # round values to 3 decimals
        self.history += [temp]
        df = pd.DataFrame(self.history)
        plt.clf()
        plt.plot([i for i in range (epoch+1)], df["loss"], linestyle='--', marker='o', label="loss")
        plt.plot([i for i in range (epoch+1)], df["val_loss"], linestyle='--', marker='o', label="val_loss")
        plt.legend()
        plt.savefig(self.path+ "/Loss_" + str(epoch+1) + ".png")
        # plt.clf()
        # for column in df.columns:
        #     if(column != "loss" and column != "val_loss"):
        #         plt.plot([i for i in range (epoch+1)], df[column], linestyle='--', marker='o', label=column)
        #         plt.legend()
        #         plt.savefig(self.path+ "/Metric_" + str(epoch+1) + ".png")
        
    def on_train_end(self, logs=None):
        pass
     
     

def CreateModel(settings):
    
    model = tf.keras.models.Sequential()
    firstInput = True
    
    for layer in settings["HiddenLayers"]:
        if(firstInput):
            model.add(tf.keras.layers.Dense(units=layer, activation=settings["HiddenLayerActivationFunc"], input_dim = settings["InputDim"]))
            firstInput = False
        else:
            model.add(tf.keras.layers.Dense(units=layer, activation=settings["HiddenLayerActivationFunc"]))
        
    model.add(tf.keras.layers.Dense(units=settings["OutputUnits"], activation=settings["OutputLayerActivationFunc"]))
    
    return model
    
def CompileModel(model, settings):
    metrics = []
    
    if("accuracy" in settings["Metrics"]):
        metrics += ['accuracy']
    if("mae" in settings["Metrics"]):
        metrics += ["mae"]
    if("mse" in settings["Metrics"]):
        metrics += ["mse"]
    if("rmse" in settings["Metrics"]):
        metrics += [tf.keras.metrics.RootMeanSquaredError()]
    if("auc" in settings["Metrics"]):
        metrics += [tf.keras.metrics.AUC()]
    
    model.compile(optimizer = "adam", loss = settings["LossFunction"], metrics = metrics)

def TrainModel(model, trainIn, trainOut, valIn, valOut, settings, client):
    custom = CustomHistoryCallback(client)
    callbacks = [custom]
    if("EarlyStopping" in settings and settings["EarlyStopping"] != 0):
        earlyStop = tf.keras.callbacks.EarlyStopping(monitor="loss", patience=settings["EarlyStopping"])
        callbacks += [earlyStop]
    
    if(valIn == [] or valOut == []):
        model.fit(trainIn, trainOut, batch_size=settings["BatchSize"], epochs=settings["NumOfEpochs"], callbacks=callbacks)
    else:
        model.fit(trainIn, trainOut, batch_size=settings["BatchSize"], epochs=settings["NumOfEpochs"], validation_data=(valIn, valOut), callbacks=callbacks)
    
def EvaluateModel(model, testIn, testOut, batchSize):
    return model.evaluate(testIn, testOut, batch_size=batchSize)
    
def MakeRegressionPredictions(model, dataIn):
    return model.predict(dataIn)

def MakeClassPredictions(model, dataIn):
    return model.predict_classes(dataIn)

def MakeProbabilityPredictions(model, dataIn):
    return model.predict_proba(dataIn)

def SaveModel(model, localPath, filename):
    model.save(localPath + "/" + filename + ".h5")

def LoadModel(filepath):
    return tf.keras.models.load_model(filepath)

def Standardization(data, columnsToScale, scaler = StandardScaler()):
    x = data[columnsToScale].values
    #scaler = StandardScaler()
    temp = scaler.fit_transform(x)
    dfNorm = pd.DataFrame(temp, columns = columnsToScale, index = data.index)
    data[columnsToScale] = dfNorm
    return data, scaler

def Normalization(data, columnsToScale, scaler = Normalizer()):
    x = data[columnsToScale].values
    #scaler = Normalizer()
    temp = scaler.fit_transform(x)
    dfNorm = pd.DataFrame(temp, columns = columnsToScale, index = data.index)
    data[columnsToScale] = dfNorm
    return data, scaler

def MinMaxScaling(data, columnsToScale, scaler = MinMaxScaler()):
    x = data[columnsToScale].values
    #scaler = MinMaxScaler()
    temp = scaler.fit_transform(x)
    dfNorm = pd.DataFrame(temp, columns = columnsToScale, index = data.index)
    data[columnsToScale] = dfNorm
    return data, scaler
    

def ScaleDataAutomaticly(data):        # After train_test_split         # DO NOT USE
    alpha = 0.05
    norm = []
    stand = []
    for column in data.columns:
        _ , p =shapiro(data[column])
        if(p > alpha):
            norm += [column]
        else:
            stand += [column]
    
    if(len(norm) > 0):
        data, normalizeScaler = Normalization(data, norm)
    if(len(stand) > 0):
        data, standardScaler = Standardization(data, stand)
    return data, standardScaler, normalizeScaler

def CloneModel(model, settings):
    clonedModel = tf.keras.models.clone_model(model)
    clonedModel.build((None, settings["InputDim"]))
    CompileModel(clonedModel, settings)
    clonedModel.set_weights(model.get_weights())
    
    return clonedModel

'''
import json

modelSettings = json.loads('{"HiddenLayers" : [6,5], "HiddenLayerActivationFunc" : "relu",  "OutputUnits" : 1, "OutputLayerActivationFunc" : "sigmoid"}')
#model = CreateModel(modelSettings)
#print(model.summary())
compileSettings = json.loads('{ "LossFunction" : "binary_crossentropy", "Metrics" : ["accuracy", "recall"] }')
#CompileModel(model, compileSettings)

temp = {'loss': 11.552939414978027, 'accuracy': 0.5249999761581421}

t = {k: round(v, 3) for k, v in temp.items()}
print(t)


data = pd.read_csv("data_ins.csv")
print(data)

colsNorm = ["CreditScore"]
stand = [x for x in list(data) if x not in colsNorm]

x = data[colsNorm].values
scaler = StandardScaler().fit_transform(x)
dfNorm = pd.DataFrame(scaler, columns = colsNorm, index = data.index)
data[colsNorm] = dfNorm

print(data)
'''