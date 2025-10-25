using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly IUnitOfWork _unitOfWork;

        public LanguageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<LanguageDto>> GetAllLanguagesAsync()
        {
            var languages = await _unitOfWork.Languages.GetAllAsync();
            return languages.Select(MapToDto);
        }

        public async Task<IEnumerable<LanguageDto>> GetSupportedLanguagesAsync()
        {
            var languages = await _unitOfWork.Languages.GetSupportedLanguagesAsync();
            return languages.Select(MapToDto);
        }

        public async Task<IEnumerable<LanguageDto>> GetPopularLanguagesAsync(int count = 10)
        {
            var languages = await _unitOfWork.Languages.GetPopularLanguagesAsync(count);
            return languages.Select(MapToDto);
        }

        public async Task<LanguageDto?> GetLanguageByIdAsync(int id)
        {
            var language = await _unitOfWork.Languages.GetByIdAsync(id);
            return language != null ? MapToDto(language) : null;
        }

        public async Task<LanguageDto?> GetLanguageByCodeAsync(string code)
        {
            var language = await _unitOfWork.Languages.GetByCodeAsync(code);
            return language != null ? MapToDto(language) : null;
        }

        public async Task<LanguageDto> CreateLanguageAsync(CreateLanguageDto dto)
        {
            var language = new Language
            {
                LanguageName = dto.LanguageName,
                LanguageCode = dto.LanguageCode,
                FlagIcon = dto.FlagIcon,
                IsSupported = dto.IsSupported
            };

            await _unitOfWork.Languages.AddAsync(language);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(language);
        }

        public async Task<bool> UpdateLanguageAsync(int id, CreateLanguageDto dto)
        {
            var language = await _unitOfWork.Languages.GetByIdAsync(id);
            if (language == null) return false;

            language.LanguageName = dto.LanguageName;
            language.LanguageCode = dto.LanguageCode;
            language.FlagIcon = dto.FlagIcon;
            language.IsSupported = dto.IsSupported;

            await _unitOfWork.Languages.UpdateAsync(language);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLanguageAsync(int id)
        {
            await _unitOfWork.Languages.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private LanguageDto MapToDto(Language language)
        {
            return new LanguageDto
            {
                LanguageId = language.LanguageId,
                LanguageName = language.LanguageName,
                LanguageCode = language.LanguageCode,
                FlagIcon = language.FlagIcon,
                IsSupported = language.IsSupported,
                TotalCourses = language.ToCourses?.Count ?? 0
            };
        }
    }
}