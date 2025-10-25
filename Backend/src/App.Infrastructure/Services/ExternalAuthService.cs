using System.Text.Json;

using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;

namespace Infrastructure.Services;

public class ExternalAuthService : IExternalAuthService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public ExternalAuthService(IConfiguration configuration, HttpClient httpClient)
    {
        _configuration = configuration;
        _httpClient = httpClient;
    }

    public async Task<ExternalUserInfoDto?> ValidateGoogleTokenAsync(string accessToken)
    {
        try
        {
            // Cách 1: Sử dụng Google.Apis.Auth library (khuyến nghị - an toàn hơn)
            var googleClientId = _configuration["Authentication:Google:ClientId"];

            if (string.IsNullOrEmpty(googleClientId))
            {
                throw new InvalidOperationException("Google ClientId not configured");
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(
                accessToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                });

            return new ExternalUserInfoDto
            {
                Email = payload.Email,
                FullName = payload.Name,
                Avatar = payload.Picture,
                Provider = "Google",
                ProviderKey = payload.Subject // Subject là Google User ID
            };
        }
        catch (InvalidJwtException)
        {
            // Token không hợp lệ hoặc đã expire
            try
            {
                // Cách 2: Backup - Gọi Google API để verify token
                // Chỉ dùng khi cách 1 fail
                var response = await _httpClient.GetAsync(
                    $"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={accessToken}");

                if (!response.IsSuccessStatusCode)
                    return null;

                var content = await response.Content.ReadAsStringAsync();
                var googleUser = JsonSerializer.Deserialize<GoogleTokenInfo>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
                    return null;

                return new ExternalUserInfoDto
                {
                    Email = googleUser.Email,
                    FullName = googleUser.Name,
                    Avatar = googleUser.Picture,
                    Provider = "Google",
                    ProviderKey = googleUser.Sub
                };
            }
            catch
            {
                return null;
            }
        }
        catch
        {
            return null;
        }
    }

    public async Task<ExternalUserInfoDto?> ValidateFacebookTokenAsync(string accessToken)
    {
        try
        {
            var appId = _configuration["Authentication:Facebook:AppId"];
            var appSecret = _configuration["Authentication:Facebook:AppSecret"];

            if (string.IsNullOrEmpty(appId) || string.IsNullOrEmpty(appSecret))
            {
                throw new InvalidOperationException("Facebook AppId or AppSecret not configured");
            }

            // Bước 1: Verify token với Facebook Debug Token API
            var verifyUrl = $"https://graph.facebook.com/debug_token?input_token={accessToken}&access_token={appId}|{appSecret}";
            var verifyResponse = await _httpClient.GetAsync(verifyUrl);

            if (!verifyResponse.IsSuccessStatusCode)
                return null;

            var verifyContent = await verifyResponse.Content.ReadAsStringAsync();
            var verifyData = JsonSerializer.Deserialize<FacebookTokenVerification>(verifyContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Kiểm tra token có hợp lệ không
            if (verifyData?.Data?.IsValid != true)
                return null;

            // Bước 2: Lấy thông tin user từ Facebook Graph API
            var userInfoUrl = $"https://graph.facebook.com/me?fields=id,email,name,picture&access_token={accessToken}";
            var userResponse = await _httpClient.GetAsync(userInfoUrl);

            if (!userResponse.IsSuccessStatusCode)
                return null;

            var userContent = await userResponse.Content.ReadAsStringAsync();
            var facebookUser = JsonSerializer.Deserialize<FacebookUserInfo>(userContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (facebookUser == null || string.IsNullOrEmpty(facebookUser.Email))
                return null;

            return new ExternalUserInfoDto
            {
                Email = facebookUser.Email,
                FullName = facebookUser.Name,
                Avatar = facebookUser.Picture?.Data?.Url,
                Provider = "Facebook",
                ProviderKey = facebookUser.Id
            };
        }
        catch
        {
            return null;
        }
    }
}