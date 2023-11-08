using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NeuronBack.Models;

namespace NeuronBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        public AdminController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("getUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = _userManager.Users.Select(x => new { x.Id, x.UserName, x.FullName, x.Email}).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("addUser")]
        public async Task<IActionResult> AddUser(AppUserModel User)
        {
            var applicationUser = new ApplicationUser()
            {
                UserName = User.UserName,
                Email = User.Email,
                FullName = User.FullName,
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, User.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        //[Route("deleteUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Ne postoji user sa tim imenom");
            try
            {
                await _userManager.DeleteAsync(user);
                return Ok(new { text = "Obrisan", user });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }  
        }

        [HttpPut("{id}")]
        //[Route("updateUser")]
        public async Task<IActionResult> EditUser(string id,AppUserModel newUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Ne postoji user sa tim id-om");
            try
            {
                user.UserName = newUser.UserName;
                user.FullName = newUser.FullName;
                user.Email = newUser.Email;
                await _userManager.UpdateAsync(user);
                return Ok(new { text = "Updated", user });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
