using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using src.Application.DTOs;
using src.Application.Interfaces;
using src.Infrastructure.Payments.VNPay;

namespace src.Infrastructure.Services
{
    public class VNPayService : IVnPayService
    {
        private readonly VNPaySetting _settings;
        private readonly IConfiguration _configuration;

        public VNPayService(IOptions<VNPaySetting> settings,IConfiguration configuration)
        {
            _settings = settings.Value;
            _configuration = configuration;
        }

        public string CreatePaymentUrl(PaymentRequestModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VNPayLibrary();
            var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl =
                pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

            return paymentUrl;

        }

       

        public PaymentResponseModel PaymentExecute(IQueryCollection collection)
        {
            var vnPay = new VNPayLibrary();
            var response = vnPay.GetFullResponseData(collection, _settings.HashSecret);
            return response;
        }
    }
}