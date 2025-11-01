using Infrastructure.Firebase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly FirebaseStorageService _firebaseStorage;

        public FileController()
        {
            // Đường dẫn tới file service account JSON
            var credentialsPath = Path.Combine(Directory.GetCurrentDirectory(), "../App.Infrastructure/Configs/firebase-adminsdk.json");
            var bucketName = "learninglanguageapp-18d06.firebasestorage.app";

            _firebaseStorage = new FirebaseStorageService(credentialsPath, bucketName);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            using var stream = file.OpenReadStream();
            var url = await _firebaseStorage.UploadFileAsync(stream, file.ContentType);

            return Ok(new { FileUrl = url });
        }
        [HttpGet("get/{fileName}")]
        public async Task<IActionResult> GetFile(string fileName)
        {
            var stream = await _firebaseStorage.GetFileAsync(fileName);
            if (stream == null)
                return NotFound();

            return File(stream, "application/octet-stream", fileName);
        }


        [HttpDelete("delete/{fileName}")]
        public async Task<IActionResult> Delete(string fileName)
        {
            await _firebaseStorage.DeleteFileAsync(fileName);
            return Ok("Deleted successfully.");
        }
    }
}
