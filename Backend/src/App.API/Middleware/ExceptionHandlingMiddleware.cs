using System.Net;
using System.Text.Json;
using src.Application.DTOs;
using src.Application.DTOs.Response;

namespace src.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = context.Response;
            ApiErrorResponse apiErrorReponse;
            switch (exception)
            {
                case UnauthorizedAccessException:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode, "Unauthorized access", exception.Message);

                    break;
                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode, "Resource not found", exception.Message);
                    break;
                case ArgumentException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode, "Invalid request", exception.Message);

                    break;
                case TimeoutException:
                    response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode, "Request timeout", exception.Message);
                    break;
                case InvalidOperationException:
                    response.StatusCode = (int)HttpStatusCode.Conflict;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode,  "Conflict", exception.Message);
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    apiErrorReponse =  new ApiErrorResponse(response.StatusCode,  "Internal server error", "Something went wrong" );

                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(apiErrorReponse);
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}