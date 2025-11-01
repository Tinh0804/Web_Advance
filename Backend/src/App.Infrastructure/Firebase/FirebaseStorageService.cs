using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Firebase
{
    public class FirebaseStorageService
    {
        private readonly StorageClient _storageClient;
        private readonly string _bucketName;

        public FirebaseStorageService(string credentialsPath, string bucketName)
        {
            var credential = GoogleCredential.FromFile(credentialsPath);
            _storageClient = StorageClient.Create(credential);
            _bucketName = bucketName;
        }
       public async Task<Stream> GetFileAsync(string fileName)
    {
        try
        {
            var ms = new MemoryStream();
            await _storageClient.DownloadObjectAsync(_bucketName, fileName, ms);
            ms.Position = 0;
            return ms;
        }
        catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
        {
            return null; // để Controller trả về NotFound
        }
    }


        public async Task<string> UploadFileAsync(Stream fileStream, string contentType)
        {
            // Đổi tên file cho unique
            var newFileName = $"{Guid.NewGuid()}";

            // Upload file
            await _storageClient.UploadObjectAsync(
                bucket: _bucketName,
                objectName: newFileName,
                contentType: contentType,
                source: fileStream
            );

            // Trả về URL công khai
            return $"https://firebasestorage.googleapis.com/v0/b/{_bucketName}/o/{Uri.EscapeDataString(newFileName)}?alt=media";
        }

        public async Task DeleteFileAsync(string fileName)
        {
            await _storageClient.DeleteObjectAsync(_bucketName, fileName);
        }
    }
}
