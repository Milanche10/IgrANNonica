using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuronBack.Models
{
    public class Experiment
    {
        public Experiment()
        {

        }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int id { get; set; }
        [MaxLength(50)]
        public string user_id { get; set; }
        [MaxLength(40)]
        public string? experimentName { get; set; }
        public DateTime createDate { get; set; }
        public DateTime modifiedDate { get; set; }
        [MaxLength(100)]
        //public string? statisticsPath { get; set; }
        public string currentModels { get; set; }
        public string Inputs { get; set; }
        public string Outputs { get; set; }

        public string Path { get; set; }
    }
}
