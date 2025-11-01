namespace Application.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
        Task<string> UpdateAsync(string oldFileName, Stream newFileStream, string newFileName, string contentType);
        Task DeleteAsync(string fileName);
    }
}
