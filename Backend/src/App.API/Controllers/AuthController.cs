using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using src.API.Attributes;
using src.API.Extensions;
using src.Application.DTOs;
using src.Application.DTOs.ModelDto;
using src.Application.DTOs.Request;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly ITokenService _tokenService;

        public AuthController(
            IAuthService authService,
            IRefreshTokenService refreshTokenService,
            ITokenService tokenService)
        {
            _authService = authService;
            _refreshTokenService = refreshTokenService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
         [Transaction]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var response = await _authService.RegisterAsync(registerDto);
                SetRefreshTokenCookie(response.RefreshToken);
                
                return Ok(ApiResponse<AuthResponse>.SuccessResponse(
                    response,
                    "Register success"
                ));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred during registration"));
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var response = await _authService.LoginAsync(loginDto);
                SetRefreshTokenCookie(response.RefreshToken);

                return Ok(ApiResponse<AuthResponse>.SuccessResponse(
                    response,
                    "Login success"
                ));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred during login"));
            }
        }
        [HttpPost("external-login")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalLoginRequest request)
        {
            try
            {
                   if (string.IsNullOrEmpty(request.Provider) || string.IsNullOrEmpty(request.AccessToken))
                    {
                        return BadRequest(ApiResponse<string>.ErrorResponse("Provider and AccessToken are required"));
                    }

                var result = await _authService.ExternalLoginAsync(request);

                return Ok(ApiResponse<AuthResponse>.SuccessResponse(result));
            }catch(Exception e)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse(e.Message));
            }
        }

        [HttpPost("refresh-token")]
         [Transaction]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto? request = null)
        {
            try
            {
                // Try to get refresh token from cookie first, then from body
                var refreshToken = request?.RefreshToken ?? Request.Cookies["refreshToken"];
                
                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Refresh token is required"));
                }

                var ipAddress = GetIpAddress();
                var response = await _refreshTokenService.RefreshTokenAsync(refreshToken, ipAddress);
                
                SetRefreshTokenCookie(response.RefreshToken);
                
                return Ok(ApiResponse<AuthResponse>.SuccessResponse(
                    response,
                    "Token refreshed successfully"
                ));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while refreshing token"));
            }
        }

        [HttpPost("revoke-token")]
         [Transaction]
        [Authorize]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequestDto? request = null)
        {
            try
            {
                // Try to get refresh token from cookie first, then from body
                var refreshToken = request?.RefreshToken ?? Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Refresh token is required"));
                }

                var ipAddress = GetIpAddress();
                var result = await _refreshTokenService.RevokeTokenAsync(refreshToken, ipAddress);

                if (!result)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid refresh token"));
                }

                // Remove cookie
                Response.Cookies.Delete("refreshToken");

                return Ok(ApiResponse<string>.SuccessResponse("Token revoked successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while revoking token"));
            }
        }

        [HttpPost("validate-refresh-token")]
        public async Task<IActionResult> ValidateRefreshToken([FromBody] ValidateTokenRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Token is required"));
                }

                var isValid = await _tokenService.ValidateRefreshTokenAsync(request.Token);

                return Ok(ApiResponse<object>.SuccessResponse(
                    new { isValid = isValid },
                    isValid ? "Token is valid" : "Token is invalid or expired"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while validating token"));
            }
        }

        [HttpPost("validate-jwt-token")]
        public async Task<IActionResult> ValidateJwtToken([FromBody] ValidateTokenRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Token is required"));
                }

                var result = await _tokenService.ValidateJwtTokenAsync(request.Token);

                if (result.IsValid)
                {
                    return Ok(ApiResponse<TokenValidationResultDto>.SuccessResponse(
                        result,
                        "Token is valid"
                    ));
                }
                else
                {
                    return Unauthorized(ApiResponse<TokenValidationResultDto>.ErrorResponse(
                        result.ErrorMessage ?? "Token is invalid"
                    ));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while validating token"));
            }
        }

        [HttpGet("active-tokens")]
        [Authorize]
        public async Task<IActionResult> GetActiveTokens()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<string>.ErrorResponse("User not authenticated"));
                }

                var tokens = await _refreshTokenService.GetActiveTokensByUserIdAsync(userId);
                
                return Ok(ApiResponse<object>.SuccessResponse(
                    new { tokens = tokens.Select(t => new 
                    {
                        t.Token,
                        t.CreatedDate,
                        t.ExpiryDate
                    })},
                    "Active tokens retrieved successfully"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while retrieving tokens"));
            }
        }

        // Helper methods
        private void SetRefreshTokenCookie(string? refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken)) return;

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use HTTPS in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        private string? GetIpAddress()
        {
            // Try to get IP from X-Forwarded-For header (for proxies/load balancers)
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                return Request.Headers["X-Forwarded-For"]
                    .ToString()
                    .Split(',')
                    .FirstOrDefault()?
                    .Trim();
            }

            // Get IP from connection
            return HttpContext.Connection.RemoteIpAddress?.ToString();
        }
    }
}
