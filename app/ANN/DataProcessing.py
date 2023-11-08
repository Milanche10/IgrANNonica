import pandas as pd
import numpy as np
from scipy import stats
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
from pandas.api.types import is_numeric_dtype
import math

def SetEmptyToNaN(data, columnNames):
    for column in columnNames:
        data[column].replace(['', ' '], np.NaN, inplace=True)
        
    return data

# def RemoveNaNValues(data):      # Removes rows with NaN value
#     return data.dropna(subset = data.columns)

# def FillNaNValues(data):        # Replaces values with mean (numeric) or most frequent (string)
#     data.fillna(round(data.mean(), 2), inplace=True)
#     return data.fillna(data.mode().iloc[0])

def RemoveNaNValues(data, columnNames):      # Removes rows with NaN value
    return data.dropna(subset = columnNames)

def FillNaNValues(data, columnsMean, columnsMode):
    
    for column in columnsMean:
        data[column].fillna(round(data[column].mean(), 2), inplace=True)
        
    for column in columnsMode:
        data[column].fillna(data[column].mode().iloc[0], inplace=True)
        
    return data

def RemoveOutlier(data, columnNames):        # Removes outliers based on Zscore statistic
    for column in columnNames:
        data = data[(np.abs(stats.zscore(data[column])) < 3)]
        
    return data

# def ChangeDataValues(data, json):       # Changes values in given row and column(s) number
#     for row in json:
#         for column in json[row]:
#             data.iloc[int(row), int(column)] = json[row][column]
            
#     return data

def ChangeDataValues(data, json):       # Changes values in given row and column(s) number
    for cell in json:
        data.iloc[int(cell["Row"]), int(cell["Col"])] = cell["Value"]
            
    return data

def RemoveColumns(data, columnList):
    return data.drop(columnList, axis=1)

def RemoveRows(data, rowList):
    data = data.drop(rowList, axis = 0)
    data = data.reset_index(drop=True)
    return data

def ConvertColumnType(data, types):
    return data.astype(types)

def SuggestColumnType(data):
    formula = math.log2(data.shape[0]) + 0.1 * data.shape[0]
    
    temp = []

    for column in data.columns:
        if(data[column].nunique() > formula):
            if(is_numeric_dtype(data[column])):
                temp += ["Numerical"]
            else:
                temp += ["Not Recommended"]
        else:
            temp += ["Categorical"]
    
    res = pd.DataFrame([temp], columns = data.columns)
    
    return res

def GetColumnType(data):
    temp = []
    
    for column in data.columns:
        if(is_numeric_dtype(data[column])):
            temp += ["Numerical"]
        else:
            temp += ["Categorical"]
    
    res = pd.DataFrame([temp], columns = data.columns)
    
    return res

def CountColumnNan(data, columnName):
    return data[columnName].isna().sum()

def SplitEmptyAsOutputs(data, outputColumn):      # Retuns: for prediction, for train/test 
    return data[data[outputColumn].isna()], data[~data[outputColumn].isna()]

def LabelEncode(data, columnName):      # Returns column
    encoder = LabelEncoder()
    return np.array(encoder.fit_transform(data[columnName]))
    
def OneHotEncode(data, columnName):     # Returns new dataframe
    types = data[columnName].values.ravel()
    tempDf = pd.DataFrame(types, columns=["Cat_" + columnName])
    
    #dummy
    dummyDf = pd.get_dummies(tempDf, columns=["Cat_" + columnName], prefix=["Cat_" + columnName])
    
    data = data.join(dummyDf)
    data = data.drop(columnName, axis=1)
    return data, list(dummyDf.columns)

# Backward Difference Encoding?
# Leave One Out Encoding?


# For testing
'''
import json
#data = pd.read_csv("data.csv")
#print(data)

msg = json.loads('{"LabelEncode" : ["Geography", "Surname"] }')
print(msg)
print(str(msg))

for column in msg["LabelEncode"]:
    data[column] = LabelEncode(data, column)

print(data)

data.iloc[0,2] = ""
data.iloc[1,2] = " "
#print(data.iloc[0,2])
print(SetEmptyToNaN(data))

data["Geography"] = OrdinalEncode(data, "Geography")
print(data)


changes = json.loads('{"0" : {"3" : 700, "5" : "Male"}, "1" : {"4" : "France", "6" : 50} }')

data = ChangeData(data, changes)
print("#############")
print(data)

OneHotEncode(data, "Gender")
print(data)
data = RemoveOutlier(data)
print(data)


data.iloc[50,3] = np.NaN
data.iloc[50,4] = np.NaN

print(data.iloc[50,4])
print(data.iloc[50,3])
print(data.isnull().values.any())
data = FillNaNValues(data)
print(data.isnull().values.any())
print(data.iloc[50,3])
print(data.iloc[50,4])
'''


# import json, pandas as pd, math
# from pandas.api.types import is_numeric_dtype

# data = pd.read_csv("data.csv")


# formula = math.log2(data.shape[0]) + 0.1 * data.shape[0]

# res = dict()

# for column in data.columns:
#     if(data[column].nunique() > formula):
#         if(is_numeric_dtype(data[column])):
#             res[column] = "Numerical"
#         else:
#             res[column] = "Not Recommended"
#     else:
#         res[column] = "Categorical"
        
# print(res)