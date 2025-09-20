using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;

namespace CleanArchitectureApi.Api.Extensions
{
    public static class OAuth2Extensions
    {
        public static IServiceCollection AddOAuth2Authentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication()
                .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
                {
                    options.ClientId = configuration["OAuth2:Google:ClientId"]!;
                    options.ClientSecret = configuration["OAuth2:Google:ClientSecret"]!;
                    options.CallbackPath = "/auth/google-callback";
                })
                .AddFacebook(FacebookDefaults.AuthenticationScheme, options =>
                {
                    options.AppId = configuration["OAuth2:Facebook:AppId"]!;
                    options.AppSecret = configuration["OAuth2:Facebook:AppSecret"]!;
                    options.CallbackPath = "/auth/facebook-callback";
                });

            return services;
        }
    }
}