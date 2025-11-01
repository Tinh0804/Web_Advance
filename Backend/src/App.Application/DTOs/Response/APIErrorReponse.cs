namespace src.Application.DTOs.Response
{
    public class ApiErrorResponse
    {
        public bool Status { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public object? Details { get; set; }

        public ApiErrorResponse(int statusCode, string message, object? details = null)
        {
            Message = message;
            Details = details;
        }
    }
}
