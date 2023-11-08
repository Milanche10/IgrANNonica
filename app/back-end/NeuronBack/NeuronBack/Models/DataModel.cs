namespace NeuronBack.Models
{
    public class DataModel
    {
        public List<int> Data { get; set; }
        public string Label { get; set; }
        public DataModel()
        {
            Data = new List<int>();
        }
    }
}
