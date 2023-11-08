using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuronBack.Models
{
    public class RefreshToken
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int RefreshTokenId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Username { get; set; }
        public string? RefreshTokens { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
