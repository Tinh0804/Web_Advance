// WordService.cs
using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class WordService : IWordService
    {
        private readonly IWordRepository _wordRepository;
        private readonly ILanguageRepository _languageRepository;
        private readonly ILessonRepository _lessonRepository;

        public WordService(
            IWordRepository wordRepository,
            ILanguageRepository languageRepository,
            ILessonRepository lessonRepository)
        {
            _wordRepository = wordRepository;
            _languageRepository = languageRepository;
            _lessonRepository = lessonRepository;
        }

        public async Task<IEnumerable<WordDto>> GetAllWordsAsync()
        {
            var words = await _wordRepository.GetAllAsync();
            return words.Select(MapToDto);
        }

        public async Task<WordDetailDto?> GetWordByIdAsync(int id)
        {
            var word = await _wordRepository.GetWordWithDetailsAsync(id);
            if (word == null) return null;

            return new WordDetailDto
            {
                WordId = word.WordId,
                LanguageId = word.LanguageId,
                LanguageName = word.Language?.LanguageName ?? "",
                LessonId = word.LessonId,
                LessonName = word.Lesson?.LessonName ?? "",
                WordName = word.WordName ?? "",
                Translation = word.Translation,
                Pronunciation = word.Pronunciation,
                WordType = word.WordType,
                AudioFile = word.AudioFile,
                ImageUrl = word.ImageUrl,
                ExampleSentence = word.ExampleSentence
            };
        }

        public async Task<IEnumerable<WordDto>> GetWordsByLessonIdAsync(int lessonId)
        {
            var words = await _wordRepository.GetWordsByLessonIdAsync(lessonId);
            return words.Select(MapToDto);
        }

        public async Task<IEnumerable<WordDto>> GetWordsByLanguageIdAsync(int languageId)
        {
            var words = await _wordRepository.GetWordsByLanguageIdAsync(languageId);
            return words.Select(MapToDto);
        }

        public async Task<WordDto> CreateWordAsync(CreateWordDto dto)
        {
            // Validate language exists
            var languageExists = await _languageRepository.ExistsAsync(dto.LanguageId);
            if (!languageExists)
                throw new ArgumentException("Language not found");

            // Validate lesson exists (cần parse lessonId về int nếu cần)
            // var lessonExists = await _lessonRepository.ExistsAsync(int.Parse(dto.LessonId));
            // if (!lessonExists)
            //     throw new ArgumentException("Lesson not found");

            var word = new Word
            {
                LanguageId = dto.LanguageId,
                LessonId = dto.LessonId,
                WordName = dto.WordName,
                Translation = dto.Translation,
                Pronunciation = dto.Pronunciation,
                WordType = dto.WordType,
                AudioFile = dto.AudioFile,
                ImageUrl = dto.ImageUrl,
                ExampleSentence = dto.ExampleSentence
            };

            var created = await _wordRepository.AddAsync(word);
            return MapToDto(created);
        }

        public async Task<bool> UpdateWordAsync(int id, UpdateWordDto dto)
        {
            var word = await _wordRepository.GetByIdAsync(id);
            if (word == null) return false;

            if (dto.WordName != null) word.WordName = dto.WordName;
            if (dto.Translation != null) word.Translation = dto.Translation;
            if (dto.Pronunciation != null) word.Pronunciation = dto.Pronunciation;
            if (dto.WordType != null) word.WordType = dto.WordType;
            if (dto.AudioFile != null) word.AudioFile = dto.AudioFile;
            if (dto.ImageUrl != null) word.ImageUrl = dto.ImageUrl;
            if (dto.ExampleSentence != null) word.ExampleSentence = dto.ExampleSentence;

            await _wordRepository.UpdateAsync(word);
            return true;
        }

        public async Task<bool> DeleteWordAsync(int id)
        {
            if (!await _wordRepository.ExistsAsync(id))
                return false;

            await _wordRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<WordDto>> SearchWordsAsync(string searchTerm, int languageId)
        {
            var words = await _wordRepository.SearchWordsAsync(searchTerm, languageId);
            return words.Select(MapToDto);
        }

        private WordDto MapToDto(Word word)
        {
            return new WordDto
            {
                WordId = word.WordId,
                LanguageId = word.LanguageId,
                LessonId = word.LessonId,
                WordName = word.WordName ?? "",
                Translation = word.Translation,
                Pronunciation = word.Pronunciation,
                WordType = word.WordType,
                AudioFile = word.AudioFile,
                ImageUrl = word.ImageUrl,
                ExampleSentence = word.ExampleSentence
            };
        }
    }
}