using System.Text.Json.Serialization;
using src.Domain.Entities;

namespace src.Application.DTOs.Response
{
    public class ApiResponse<T>
    {
        public bool Status { get; set; } = true;
        public string Message { get; set; } 

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public T Data { get; set; }
         public List<string>? Errors { get; set; }

        public static ApiResponse<T> SuccessResponse(T? data, string? message = "Success")
        => new ApiResponse<T> { Status = true, Data = data, Message = message };

        public static ApiResponse<T> ErrorResponse(string message = "Fail",List<string>? errors = null)
            => new ApiResponse<T> { Status =  false, Message = message ,Errors = errors};


    }

}