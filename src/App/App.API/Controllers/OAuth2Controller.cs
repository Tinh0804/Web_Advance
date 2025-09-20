using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitectureApi.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OAuth2Controller : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet("google")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/auth/google-callback"
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [HttpGet("facebook")]
        public IActionResult FacebookLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/auth/facebook-callback"
            };
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            
            if (result.Succeeded)
            {
                var claims = result.Principal!.Claims;
                var email = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var name = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
                
                // Here you would typically create or find the user in your database
                // and generate a JWT token
                
                return Ok(new { 
                    message = "Google authentication successful", 
                    email = email, 
                    name = name 
                });
            }

            return BadRequest("Google authentication failed");
        }

        [AllowAnonymous]
        [HttpGet("facebook-callback")]
        public async Task<IActionResult> FacebookCallback()
        {
            var result = await HttpContext.AuthenticateAsync(FacebookDefaults.AuthenticationScheme);
            
            if (result.Succeeded)
            {
                var claims = result.Principal!.Claims;
                var email = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var name = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
                
                return Ok(new { 
                    message = "Facebook authentication successful", 
                    email = email, 
                    name = name 
                });
            }

            return BadRequest("Facebook authentication failed");
        }
    }
}