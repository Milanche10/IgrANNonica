using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuronBack.Models
{
    public class ApplicationUser :IdentityUser
    {
        [Column(TypeName = "nvarchar(50)")]
        public string FullName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
