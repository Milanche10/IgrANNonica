using System.ComponentModel.DataAnnotations;

namespace NeuronBack.Models
{
    public class Model
    {
       
        public Model()
        {

        }
        [Key]
        public int Id { get; set; }
        public int experimentid { get; set; }
        [StringLength(100)]
        public String modelName { get; set; }
        public DateTime createDate { get; set; }
        public DateTime lastModificationDate { get; set; }
        public string path { get; set; }
        public string modelIDInExperiment { get; set; }
        public string modelProblemType { get; set; }
        public string configuration { get; set; }
        public string trainingOnModel { get; set; }

        public string trainTestJSON { get; set; }
    }
}
