using src.Application.DTOs.Request;
using src.Application.DTOs.Response;
using src.Application.DTOs.ModelDto;

namespace src.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponse> LoginAsync(LoginDto loginDto);

        Task<AuthResponse> ExternalLoginAsync(ExternalLoginRequest request);
       

        
       

    }
}