using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NeuronBack.Models;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using NeuronBack.Helpers;
using NeuronBack.Controllers;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Cors;
using NeuronBack.Helpers;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NeuronBack.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("_myAllowSpecificOrigins")]
    public class ApplicationUserController : Controller
    {
        public enum UserRoles { Logged, Guest, Admin };

        private UserManager<ApplicationUser> _userManager; 
        private SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        public readonly AuthenticationContext _context;
        private IHttpContextAccessor _httpContextAccessor;
        private static List<string> guestUsernames = new List<string>();

        public ApplicationUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, AuthenticationContext context, IHttpContextAccessor httpContextAccessor) 
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        [Route("Register")]
        // POST : /api/ApplicationUser/Register
        public async Task<Object> PostApplicationUser(AppUserModel model)
        {
            // Potencijalni regex-i
            Regex usernameReg = new Regex(@"^[A-Za-z0-9_-]{4,16}$");
            Regex FirstLastNameReg = new Regex(@"^[^0-9]+$");
            Regex emailReg = new Regex(@"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
            Regex passReg = new Regex(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$");

            if (!(FirstLastNameReg.IsMatch(model.FullName) && emailReg.IsMatch(model.Email)
                    && usernameReg.IsMatch(model.UserName) && passReg.IsMatch(model.Password)))
                return BadRequest("ERROR: Neki od unetih podataka je neispravan.");

            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,

            }; 
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                return Ok(result); 
            }
            catch (Exception ex)
            {
                throw ex; 
            }
        }



        ////Register with email
        //[HttpPost]
        //[Route("RegisterEmail")]
        //public async Task<IActionResult> Create(AppUserModel user)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var appUser = new ApplicationUser
        //        {
        //            UserName = user.UserName,
        //            FullName = user.FullName,
        //            Email = user.Email
        //        };

        //        IdentityResult result = await _userManager.CreateAsync(appUser, user.Password);
        //        //Console.WriteLine(result);
        //        if (result.Succeeded)
        //        {
        //            string token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
        //            //Link se generise
        //            string link = "http://127.0.0.1:10033/api/Email/verifyEmail2/?token=" + token + "&email=" + user.Email;

        //            //var confirmationLink = Url.Action("ConfirmEmail", "Email", new { token, email = user.Email });
        //            EmailHelper emailHelper = new EmailHelper();
        //            bool emailResponse = emailHelper.SendEmail(user.Email, link);
        //            //Console.WriteLine(token);
        //            //Console.WriteLine(emailResponse);
        //            if (emailResponse)
        //            {
        //                //return RedirectToAction("Index");
        //                //return Ok("Na pocetnu");
        //                return Ok(user);
        //            }
        //            else
        //            {
        //                // log email failed
        //                return View("Error");
        //            }
        //        }
        //        else
        //        {
        //            foreach (IdentityError error in result.Errors)
        //                ModelState.AddModelError("", error.Description);
                    
        //        }
                
                
        //    }
        //    return BadRequest();
        //    //return Ok(user);
        //}

        //[HttpPost]
        //[Route("LoginEmail")]
        ////[ValidateAntiForgeryToken]
        //public async Task<IActionResult> LoginEmail(UserLogin model)
        //{
        //    var user = await _userManager.FindByNameAsync(model.Username);
        //    if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        //    {
        //        //bool emailStatus = await _userManager.IsEmailConfirmedAsync(user);
        //        Console.WriteLine("\n\n\n\n\n\n");
        //        Console.WriteLine(user.UserName);
        //        Console.WriteLine(user.EmailConfirmed);
        //        if (user.EmailConfirmed == false)
        //        {
        //            return BadRequest("Email is not confirmed");
        //        }

        //        var authClaims = new List<Claim>
        //        {
        //            new Claim(ClaimTypes.Name, user.UserName),
        //            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //            new Claim(ClaimTypes.Role, UserRoles.Logged.ToString())
        //        };
        //        var token = CreateToken(authClaims);
        //        var refreshtoken = GenerateRefreshToken();
        //        //Dodaj refresh token
        //        _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
        //        //var tokenModel = await _context.RefreshToken.ToListAsync();
        //        //Console.WriteLine(tokenModel);
        //        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
        //        user.RefreshToken = refreshtoken;
        //        //Pravimo refresh token
        //        RefreshToken rt = new RefreshToken();
        //        rt.Username = model.Username;
        //        rt.RefreshTokens = refreshtoken;
        //        rt.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
        //        //Update za bazu
        //        RefreshToken r = _context.refreshTokens.Where(x => x.Username == rt.Username).FirstOrDefault();
        //        //Console.WriteLine("\n\n\n\n\n\n\n\n\n");
        //        //Console.WriteLine(r.Username);
        //        if (r == null)
        //        {
        //            _context.refreshTokens.Add(rt);
        //        }
        //        else
        //        {
        //            r.RefreshTokens = rt.RefreshTokens;
        //            r.RefreshTokenExpiryTime = rt.RefreshTokenExpiryTime;
        //        }

        //        //await _context.refreshTokens.AddAsync(rt);
        //        _context.SaveChanges();
        //        //Updatuj usera u bazi
        //        await _userManager.UpdateAsync(user);

        //        return Ok(new
        //        {
        //            Token = new JwtSecurityTokenHandler().WriteToken(token),
        //            RefreshToken = user.RefreshToken
        //        });
        //    }
        //    else
        //    {
        //        return BadRequest(new { message = "Username or password is incorrect." });
        //    }
        //}

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            string username = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            string role = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            //string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];

            if (MLController.mlActiveUsers.ContainsKey(username))
            {
                MLController.mlActiveUsers[username].ClientDisconnect();
                MLController.mlActiveUsers.Remove(username);
            }

            if(role == UserRoles.Guest.ToString())
            {
                string path = Path.Combine(FileManager.UsersFolderPath, username);
                FileManager.DeleteFolder(path);
                guestUsernames.Remove(username);
            }
            else
            {
                string path = Path.Combine(FileManager.UsersFolderPath, username, FileManager.DefaultExperimentFolder);
                FileManager.DeleteFolder(path);
            }
                

            return Ok();
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(UserLogin model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                /*var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:ValidIssuer"]))
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                */
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, UserRoles.Logged.ToString())
                };
                var token = CreateToken(authClaims);
                var refreshtoken = GenerateRefreshToken();
                //Dodaj refresh token
                _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                //var tokenModel = await _context.RefreshToken.ToListAsync();
                //Console.WriteLine(tokenModel);
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
                user.RefreshToken = refreshtoken;
                //Pravimo refresh token
                RefreshToken rt = new RefreshToken();
                rt.Username = model.Username;
                rt.RefreshTokens = refreshtoken;
                rt.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
                //Update za bazu
                RefreshToken r = _context.refreshTokens.Where(x => x.Username == rt.Username).FirstOrDefault();
                //Console.WriteLine("\n\n\n\n\n\n\n\n\n");
                //Console.WriteLine(r.Username);
                if (r == null)
                {
                    _context.refreshTokens.Add(rt);
                }
                else
                {
                    r.RefreshTokens = rt.RefreshTokens;
                    r.RefreshTokenExpiryTime = rt.RefreshTokenExpiryTime;
                }
                
                //await _context.refreshTokens.AddAsync(rt);
                _context.SaveChanges();
                //Updatuj usera u bazi
                await _userManager.UpdateAsync(user);
                string generatedToken = new JwtSecurityTokenHandler().WriteToken(token);
                Console.WriteLine(model.Username);
                if (!MLController.mlActiveUsers.ContainsKey(model.Username))
                {
                    // filepath should be folder to current experiment ##############
                    string filepath = FileManager.CreateNewFolder(model.Username);
                    PythonCommunicator pythonConnection = new PythonCommunicator(filepath, generatedToken);
                    MLController.mlActiveUsers.Add(model.Username, pythonConnection);
                }
                else
                {
                    PythonCommunicator pythonConnection = MLController.mlActiveUsers[model.Username];
                    pythonConnection.SendNewToken(generatedToken);    // temp fix
                }

                return Ok(new {
                    Token = generatedToken,
                    RefreshToken = user.RefreshToken }) ;
            }
            else
            {
                return BadRequest(new { message = "Username or password is incorrect." });
            }
        }


        //[HttpGet]
        //[Route("getic")]
        //protected async Task<IActionResult> CheckIfExpired(string username)
        //{
        //    var user = await _userManager.FindByNameAsync(username);
        //    var userToken = _context.refreshTokens.Where(x => x.Username == username).FirstOrDefault();
        //    if (userToken.RefreshTokenExpiryTime < DateTime.Now)
        //    {
        //        //Brisem privremene foldere
        //        string path = Path.Combine(username, "temp");
        //        FileManager.DeleteFolder(path);
        //        //Sklanjam refresh token iz baze
        //        return await Revoke(username);

        //    }
        //    else
        //    {
        //        return BadRequest("Token did not expire");
        //    }
        //}

        [HttpGet]
        [Route("checkIfExpired")]
        public async Task<IActionResult> CheckIfExpired()
        {

            string  username = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            if (guestUsernames.Contains(username))
            {
                var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                var temp = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "exp").Value;

                if (CheckIfDateExpired(temp))
                {
                    //check for deleting temp folders
                    string path = Path.Combine(FileManager.UsersFolderPath, username);
                    FileManager.DeleteFolder(path);
                    guestUsernames.Remove(username);
                    Logout();
                    return Ok("Token expired, folders deleted");
                }

            }
            else
            {
                var user = await _userManager.FindByNameAsync(username);
                var userToken = _context.refreshTokens.Where(x => x.Username == username).FirstOrDefault();
                if (userToken.RefreshTokenExpiryTime < DateTime.Now)
                {
                    //Brisem privremene foldere
                    string path = Path.Combine(FileManager.UsersFolderPath, username, FileManager.DefaultExperimentFolder);
                    FileManager.DeleteFolder(path);
                    //Sklanjam refresh token iz baze
                    return await Revoke(username);

                }
                Console.WriteLine("Nije date expired");
            }

            return BadRequest("Token did not expire");

        }



        //[HttpPost]
        //[Route("createSession")]
        //public async Task<IActionResult> CreateSession([FromBody] SessionUser user)
        //{
        //    Trace.WriteLine(user.UserType);
        //    if(user.UserType == "guestUser")
        //    {
        //        HttpContext.Session.SetString("guestUser","guest");
        //    }
        //    else
        //    {
        //        HttpContext.Session.SetString("loggedUser", JsonConvert.SerializeObject(user));
        //    }

        //    return Ok(new {sid = HttpContext.Session.Id });
        //}

        [HttpPost]
        [Route("createSession")]
        public async Task<IActionResult> CreateSession()
        {
            string newUsername = GenerateGuestUsername();

            while (guestUsernames.Contains(newUsername))
                newUsername = GenerateGuestUsername();

            guestUsernames.Add(newUsername);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, newUsername),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, UserRoles.Guest.ToString())
            };
            var token = CreateToken(authClaims);

            string generatedToken = new JwtSecurityTokenHandler().WriteToken(token); 
            if (!MLController.mlActiveUsers.ContainsKey(newUsername))
            {
                // filepath should be folder to current experiment ##############
                string filepath = FileManager.CreateNewFolder(newUsername);
                PythonCommunicator pythonConnection = new PythonCommunicator(filepath, generatedToken);
                MLController.mlActiveUsers.Add(newUsername, pythonConnection);
            }
            else
            {
                PythonCommunicator pythonConnection = MLController.mlActiveUsers[newUsername];
                pythonConnection.SendNewToken(generatedToken);    // temp fix
            }

            return Ok(new { Token = generatedToken, Username = newUsername });
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }


            string username = principal.Identity.Name;

            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var newAccessToken = CreateToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            var newToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken);

            // Send new token to ML
            if(MLController.mlActiveUsers.ContainsKey(username))
            {
                PythonCommunicator pythonConnection = MLController.mlActiveUsers[username];
                pythonConnection.SendNewToken("Bearer " + newToken);
            }

            return new ObjectResult(new
            {
                accessToken = newToken,
                refreshToken = newRefreshToken
            });
        }

        //get user using token
        [HttpGet]
        [Route("current-user")]
        public IActionResult getCurrentUser(string str)
        {
            var jwt = str;
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt);
            //string user = token.Claims.First(claim => claim.Type == ).Value;
            //var user = Database.Instance.UserfromID(jti);
            return Ok(token.Claims.First(claim => claim.Type == ClaimTypes.Name).Value);
        }

        [Authorize]
        [HttpPost("aut")]
        public string getUser()
        {
            
            string tkn = Convert.ToString(Request.Headers["Authorization"]).Split(' ')[1];
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(tkn);
            //string jti = token.Claims.First(claim => claim.Type == "UserID").Value;
            //var user = Database.Instance.UserfromID(jti);
            return token.Claims.First(claim=>claim.Type == ClaimTypes.Name).Value;
        }
        

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }
        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        [Authorize]
        [HttpPost]
        [Route("revoke/{username}")]
        public async Task<IActionResult> Revoke(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            RefreshToken r = _context.refreshTokens.Where(x => x.Username == username).FirstOrDefault();
            if(r == null) return BadRequest("Invalid user name");
            if (user == null) return BadRequest("Invalid user name");

            _context.refreshTokens.Remove(r);
            //Stavi refreshtoken na null
            //r.RefreshTokens = null;
            _context.SaveChanges();
            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            var tokens = _context.refreshTokens.ToList();

            //Stavi tokene na null u refreshtokens tabeli
            /*foreach(var token in tokens)
            {
                token.RefreshTokens = null;
            }
            _context.SaveChanges();*/

            foreach (var token in tokens)
            {
                _context.refreshTokens.Remove(token);
            }
            _context.SaveChanges();

            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                user.RefreshToken = null;
                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        private string GenerateGuestUsername()
        {
            string guestUserPrefix = "Guest_";
            Random generator = new Random();
            String r = generator.Next(0, 999999).ToString("D6");

            return guestUserPrefix + r;
        }

        public static bool CheckIfDateExpired(string tokenExpDate)
        {
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(long.Parse(tokenExpDate));

            if (dateTimeOffset < DateTime.Now)
                return true;    // expired

            return false;   // didnt expire
        }
    }
}
