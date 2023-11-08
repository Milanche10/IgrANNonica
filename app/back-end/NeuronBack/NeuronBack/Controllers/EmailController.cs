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

    public class EmailController : Controller
    {
        private UserManager<ApplicationUser> _userManager;
        public EmailController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("verifyEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return View("Error");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }
        [HttpGet]
        [Route("verifyEmail2")]
        public async Task<IActionResult> ConfirmEmail2(string token, string email)
        {
            //Console.WriteLine(token);
            Console.WriteLine(email);
            var user = await _userManager.FindByEmailAsync(email);
            //Console.WriteLine(user.UserName);
            if(user == null)
            {
                return View("Error");
            }
            try
            {
                
                //var result = await _userManager.ConfirmEmailAsync(user, token);
                return View("ConfirmEmail");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return View("Error");
            }
        }
    }
}
