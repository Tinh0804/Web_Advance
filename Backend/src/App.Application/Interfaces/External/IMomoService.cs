using Microsoft.AspNetCore.Http;
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IMomoService
    {
         Task<MomoCreatePaymentResponseModel> CreatePaymentMomo(OrderInfoModel model);
        MomoExecuteResponseModel PaymentExecuteMomo(IQueryCollection collection);

    }
}