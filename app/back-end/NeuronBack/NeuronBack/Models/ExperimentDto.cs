namespace NeuronBack.Models
{
    public class ExperimentDto
    {
        public int Id { get; set; }
        public String? experimentName { get; set; }
        public DateTime createDate { get; set; }
        public DateTime modifiedDate { get; set; }
        //public String? statisticsPath { get; set; }
        public String? currentModels { get; set; }


    }
}
