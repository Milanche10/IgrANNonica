namespace NeuronBack.Models
{
    public class ModelDto
    {
        public int Id { get; set; }
        public int experimentid { get; set; }
        public String modelName { get; set; }
        public string modelIDInExperiment { get; set; }
        public string modelProblemType { get; set; }
        public string configuration { get; set; }
        public string trainingOnModel { get; set; }
        public string trainTestJSON { get; set;  }
    }
}
