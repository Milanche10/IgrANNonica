using Aspose.Cells;
using Microsoft.VisualBasic.FileIO;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;

namespace NeuronBack.Helpers
{
    public static class FileManager
    {
        public static string UsersFolderPath = "..\\UsersData";
        public static string DefaultExperimentFolder = "CurrentSession";
        public static string PreviousVersionFilename = "prev_version";
        public static string Delimiter = ","; 
        public static string UploadFileToServer(string username, string experimentPath, IFormFile file)
        {
            var folderName = Path.Combine(UsersFolderPath, username, experimentPath);
            Console.WriteLine(folderName);
            if (file.Length > 0)
            {
                if (!Directory.Exists(folderName))
                {
                    Directory.CreateDirectory(folderName);
                }

                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(folderName, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);

                }

                return fullPath;
            }
            else
                return null;
        }

        public static byte[] DownloadFileFromServer(string username, string experimentPath, string filepath)
        {
            string path = Path.Combine(UsersFolderPath, username, experimentPath, filepath);
            Console.WriteLine(path);
            return System.IO.File.ReadAllBytes(path);
        }

        public static int GetFileMaxPaging(string filePath, int numOfRows)
        {
            string filename = Path.GetFileName(filePath);
            string ext = filename.Split('.')[1];

            int maxPages = 0;
            int numOfLines = 0;

            if (ext == "csv")
            {
                numOfLines = System.IO.File.ReadLines(filePath).Count() - 1;
                
            }
            else if (ext == "xls")
            {
                var wb = new Aspose.Cells.Workbook(filePath);
                Worksheet ws = wb.Worksheets[0];

                numOfLines = ws.Cells.Rows.Count;
            }
            else if (ext == "json")
            {
                List<dynamic> temp = JsonConvert.DeserializeObject<List<dynamic>>(System.IO.File.ReadAllText(filePath));
                
                numOfLines = temp.Count();
            }
            
            maxPages = numOfLines / numOfRows + 1;

            return maxPages;
        }

        public static string ReadFile(string filePath, int pageNum, int numOfRows)
        {
            string filename = Path.GetFileName(filePath);
            int count = 0; 
            var listObjResult = new List<Dictionary<string, string>>();

            string ext = filename.Split('.')[1];
            if (ext == "csv")
            {
                using (TextFieldParser parser = new TextFieldParser(filePath))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    string[] columnNames = parser.ReadFields();
                    if(columnNames.Length == 1)
                    {
                        columnNames = columnNames[0].Split(';');
                        parser.SetDelimiters(";");
                        Delimiter = ";";
                        if (columnNames.Length == 1)
                        {
                            columnNames = columnNames[0].Split('|');
                            parser.SetDelimiters("|");
                            Delimiter = "|";
                            if (columnNames.Length == 1)
                            {
                                columnNames = columnNames[0].Split('\t');
                                parser.SetDelimiters("\t");
                                Delimiter = "\t"; 
                            }
                        }
                    }
                    for(int i=0; i<columnNames.Length;i++)
                        if (columnNames[i] == "")
                        {
                            columnNames[i] = "Unnamed: " + count;
                            count++; 
                        }
                    while (!parser.EndOfData && parser.LineNumber <= (pageNum * numOfRows) + 1)
                    {
                        string[] fields = parser.ReadFields();
                        if (parser.LineNumber > ((pageNum - 1) * numOfRows) + 2)
                        {
                            
                            Dictionary<string, string> objResult = new Dictionary<string, string>();
                            
                            if (fields.Length <= columnNames.Length)
                                for (int i = 0; i < fields.Length; i++)
                                    objResult.Add(columnNames[i], fields[i]);
                            if (objResult.Count > 0)
                                listObjResult.Add(objResult);
                        }
                    }
                }
            }
            else if (ext == "xls")
            {
                var wb = new Aspose.Cells.Workbook(filePath);
                Worksheet ws = wb.Worksheets[0];

                int numOfColumns = ws.Cells.Count / ws.Cells.Rows.Count;        // Cells.Column.Count is 0 for some reason.. This was the only way
                string[] columnNames = new string[numOfColumns];

                for (int i = 0; i < numOfColumns; i++)
                    columnNames[i] = ws.Cells[0, i].Value.ToString();

                for (int i = 0; i < numOfRows; i++)
                {
                    int nullCount = 0;
                    var objResult = new Dictionary<string, string>();
                    for (int j = 0; j < columnNames.Length; j++)
                    {
                        if (ws.Cells[(((pageNum - 1) * numOfRows) + 1) + i, j].Type.ToString() != "IsNull")
                            objResult.Add(columnNames[j], ws.Cells[(((pageNum - 1) * numOfRows) + 1) + i, j].Value.ToString());
                        else
                        {
                            objResult.Add(columnNames[j], "");
                            nullCount++;
                        }
                    }

                    if (objResult.Count > 0 && nullCount != columnNames.Length)
                        listObjResult.Add(objResult);
                }

            }
            else if (ext == "json")
            {
                List<dynamic> temp = JsonConvert.DeserializeObject<List<dynamic>>(System.IO.File.ReadAllText(filePath));
                List<dynamic> res = new List<dynamic>();

                try
                {
                    for (int i = 1; i <= numOfRows && i < temp.Count(); i++)
                    {
                        //Console.WriteLine(temp[((pageNum - 1) * numOfRows) + i]);
                        res.Add(temp[((pageNum - 1) * numOfRows) + i]);
                    }
                }
                catch (ArgumentOutOfRangeException e)
                {

                }

                return JsonConvert.SerializeObject(res);
            }

            return JsonConvert.SerializeObject(listObjResult);
        }

        public static string CreateNewFolder(string path)
        {
            var pathToSave = Path.Combine(UsersFolderPath, path);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }

            return pathToSave;
        }

        public static void DeleteFolder(string folderName)
        {
            var pathToSave = Path.Combine(UsersFolderPath, folderName);
            if (Directory.Exists(pathToSave))
            {
                Directory.Delete(pathToSave, true);
            }
        }

        public static void CloneDirectory(string root, string dest)
        {
            foreach (var directory in Directory.GetDirectories(root))
            {
                string dirName = Path.GetFileName(directory);
                if (!Directory.Exists(Path.Combine(dest, dirName)))
                {
                    Directory.CreateDirectory(Path.Combine(dest, dirName));
                }
                CloneDirectory(directory, Path.Combine(dest, dirName));
            }

            foreach (var file in Directory.GetFiles(root))
            {
                File.Copy(file, Path.Combine(dest, Path.GetFileName(file)), true);
            }
        }

        public static bool UpdateFileVersion(string path, string newFilename)
        {
            if(File.Exists(path))
            {
                string filename = Path.GetFileName(path);
                string[] temp = filename.Split('.');
                temp[0] = newFilename;
                string newPath = Path.Combine(Path.GetDirectoryName(path), String.Concat(temp[0], ".", temp[1]));
                File.Copy(path, newPath, true);

                return true;
            }

            return false;
        }

        public static void RemoveOldVersions(string folderPath)
        {
            if(Directory.Exists(folderPath))
            {
                foreach(string file in Directory.GetFiles(folderPath))
                {
                    if(file.ToUpper().Contains(PreviousVersionFilename.ToUpper()))
                        File.Delete(file);
                }
            }
        }
    }

}
