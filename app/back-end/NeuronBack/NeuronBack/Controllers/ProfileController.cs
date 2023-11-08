using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NeuronBack.Models;

namespace NeuronBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("_myAllowSpecificOrigins")]
    public class ProfileController : ControllerBase
    {
        private UserManager<User> _userManager;
        public ProfileController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        [Authorize(Roles = "Logged, Admin")]
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.FirstName,
                user.LastName,
                user.Username

            };
        
        }
    }
}
