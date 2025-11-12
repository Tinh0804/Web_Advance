using AutoMapper;
using Microsoft.AspNetCore.Identity;
using src.Application.DTOs.ModelDto;
using src.Application.DTOs.Request;
using src.Application.DTOs.Response;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Enums;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly SignInManager<UserAccount> _signInManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        // private readonly IRefreshTokenService _refreshTokenService;
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IExternalAuthService _externalAuthService;

        public AuthService(
            UserManager<UserAccount> userManager,
            SignInManager<UserAccount> signInManager,
            IMapper mapper,
            ITokenService tokenService,
            // IRefreshTokenService refreshTokenService,
            IUserProfileRepository userProfileRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IExternalAuthService externalAuthService

            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;
            // _refreshTokenService = refreshTokenService;
            _userProfileRepository = userProfileRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _externalAuthService = externalAuthService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByNameAsync(registerDto.Username);
            if (existingUser != null)
                throw new InvalidOperationException("Username already exists");

            var user = new UserAccount
            {
                UserName = registerDto.Username,
                Email = registerDto.Username,
                PhoneNumber = registerDto.PhoneNumber,
                LockoutEnabled = false,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, SystemRoles.Student);

            var profile = new UserProfile
            {
                FullName = registerDto.FullName,
                NativeLanguageId = registerDto.NativeLanguagueId,
                PhoneNumber = registerDto.PhoneNumber,
                // Avatar = string.Empty,
                UserAccountId = user.Id,

            };
            await _userProfileRepository.AddAsync(profile);

            var token = await _tokenService.GenerateJwtTokenAsync(user.Id);
            var refreshToken = await _tokenService.CreateRefreshTokenAsync(user.Id);
            await _refreshTokenRepository.AddAsync(refreshToken);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken.Token,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, loginDto.Password, lockoutOnFailure: false);
            
            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Invalid credentials");

            var token = await _tokenService.GenerateJwtTokenAsync(user.Id);
            var refreshToken = await _tokenService.CreateRefreshTokenAsync(user.Id);
            await _refreshTokenRepository.AddAsync(refreshToken);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken.Token,
                User = _mapper.Map<UserDto>(user)
            };
        }

      public async Task<AuthResponse> ExternalLoginAsync(ExternalLoginRequest request)
    {
       ExternalUserInfoDto externalUserInfo;

        switch (request.Provider)
        {
            case "Google":
                externalUserInfo = await _externalAuthService.ValidateGoogleTokenAsync(request.AccessToken);
                break;

            case "Facebook":
                externalUserInfo = await _externalAuthService.ValidateFacebookTokenAsync(request.AccessToken);
                break;

            default:
                throw new InvalidOperationException($"Unsupported external provider: {request.Provider}");
        }

        if (externalUserInfo == null)
            throw new UnauthorizedAccessException("Invalid external token");

        // 2️⃣ Tìm user theo provider hoặc email
        var user = await _userManager.FindByLoginAsync(externalUserInfo.Provider, externalUserInfo.ProviderKey)
                ?? await _userManager.FindByEmailAsync(externalUserInfo.Email);

        // 3️⃣ Nếu chưa có user → tạo mới
        if (user == null)
        {
            user = new UserAccount
            {
                Id = Guid.NewGuid().ToString(),
                UserName = externalUserInfo.Email ?? $"{externalUserInfo.ProviderKey}@{externalUserInfo.Provider}.local",
                Email = externalUserInfo.Email,
                EmailConfirmed = true, // ✅ Facebook & Google đã xác thực email
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"User creation failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, SystemRoles.Student);

            await _userProfileRepository.AddAsync(new UserProfile
            {
                UserAccountId = user.Id,
                FullName = externalUserInfo.FullName ?? user.Email,
                Avatar = externalUserInfo.Avatar
            });
        }

        // 4️⃣ Gắn external login
        var loginInfo = new UserLoginInfo(
            externalUserInfo.Provider,
            externalUserInfo.ProviderKey,
            externalUserInfo.Provider);

        var existingLogins = await _userManager.GetLoginsAsync(user);
        if (!existingLogins.Any(l => l.LoginProvider == externalUserInfo.Provider && l.ProviderKey == externalUserInfo.ProviderKey))
        {
            await _userManager.AddLoginAsync(user, loginInfo);
        }

        // 5️⃣ Sinh JWT và refresh token
        var jwtToken = await _tokenService.GenerateJwtTokenAsync(user.Id);
        var refreshToken = await _tokenService.CreateRefreshTokenAsync(user.Id);
        await _refreshTokenRepository.AddAsync(refreshToken);

        // 6️⃣ Trả về kết quả
        return new AuthResponse
        {
            Token = jwtToken,
            RefreshToken = refreshToken.Token,
            User = _mapper.Map<UserDto>(user)
        };
    }



    }
}
