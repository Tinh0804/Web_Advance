namespace src.Application.DTOs.Response
{
    public class ApiErrorResponse
    {
        public bool status { get; set; } = false;
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Details { get; set; }

        public ApiErrorResponse(int statusCode, string message, object? details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }
    }
}
