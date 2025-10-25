using src.Application.DTOs.ModelDto;

namespace src.Application.Interfaces
{
    public interface IExternalAuthService{
        Task<ExternalUserInfoDto?> ValidateGoogleTokenAsync(string accessToken);
        Task<ExternalUserInfoDto?> ValidateFacebookTokenAsync(string accessToken);
    }
}