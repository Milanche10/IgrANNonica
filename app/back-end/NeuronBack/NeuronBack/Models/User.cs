using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace NeuronBack.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public bool Confirmed { get; set; }

        /** Obrisi posle ako ovo radi **/
        public string Password { get; set; }

        
    }
}
