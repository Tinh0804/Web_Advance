
using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Infrastructure.Services
{
    public class UserProfileService :IUserProfileService
    {
        private readonly IUserProfileRepository _userProfileRepository;
        public UserProfileService(IUserProfileRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<UserProfile?> GetByIdAsync(int userId)
        {
            // return await _context.UserProfiles
            //     .Include(up => up.User)              // Nếu muốn load luôn User
            //     .Include(up => up.UserLanguages)     // Nếu muốn load languages
            //     .FirstOrDefaultAsync(up => up.Id == userId);
            return await _userProfileRepository.GetByIdAsync(userId);
        }

        public async Task<IEnumerable<UserProfile>> GetAllAsync()
        {
            // return await _context.UserProfiles
            //     .Include(up => up.User)
            //     .ToListAsync();
            return await _userProfileRepository.GetAllAsync();
        }

       
        public async Task UpdateAsync(UserProfile profile)
        {
            await _userProfileRepository.UpdateAsync(profile);
        }

        public async Task DeleteAsync(int userId)
        {
            var profile = await _userProfileRepository.GetByIdAsync(userId);
            if (profile != null)
            {
               await  _userProfileRepository.DeleteAsync(userId);
            }
        }

        public Task AddAsync(UserProfile profile)
        {
            return _userProfileRepository.AddAsync(profile);
        }


        public async Task<UserProfile> GetUserProfileByAccountIdAsync(string accountId)
        {
              return await _userProfileRepository.GetUserProfileByAccountIdAsync(accountId);
        }
    }
}
