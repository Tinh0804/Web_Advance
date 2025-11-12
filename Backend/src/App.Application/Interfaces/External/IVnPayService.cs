using Microsoft.AspNetCore.Http;
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentRequestModel model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);
    }
}