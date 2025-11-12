using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;
using src.Application.DTOs;
using src.Application.Interfaces;

namespace src.Infrastructure.Services
{
    public class MomoService : IMomoService
    {
        private readonly IOptions<MomoOptionModel> _options;

        public MomoService(IOptions<MomoOptionModel> options)
        {
            _options = options;
        }

        public async Task<MomoCreatePaymentResponseModel> CreatePaymentMomo(OrderInfoModel model)
        {
            // Tạo OrderId dựa trên ticks
            model.OrderId = DateTime.UtcNow.Ticks.ToString();

            // Ghép thông tin khách hàng vào orderInfo
            model.OrderInfo = $"Khách hàng: {model.FullName}. Nội dung: {model.OrderInfo}";

            // Chuỗi rawData dùng để tính signature
            var rawData =
                $"partnerCode={_options.Value.PartnerCode}" +
                $"&accessKey={_options.Value.AccessKey}" +
                $"&requestId={model.OrderId}" +
                $"&amount={model.Amount}" +
                $"&orderId={model.OrderId}" +
                $"&orderInfo={model.OrderInfo}" +
                $"&returnUrl={_options.Value.ReturnUrl}" +
                $"&notifyUrl={_options.Value.NotifyUrl}" +
                $"&extraData=";

            var signature = ComputeHmacSha256(rawData, _options.Value.SecretKey);

            // Tạo request body
            var requestData = new
            {
                partnerCode = _options.Value.PartnerCode,
                accessKey = _options.Value.AccessKey,
                requestType = _options.Value.RequestType,
                notifyUrl = _options.Value.NotifyUrl,
                returnUrl = _options.Value.ReturnUrl,
                orderId = model.OrderId,
                amount = model.Amount.ToString(),
                orderInfo = model.OrderInfo,
                requestId = model.OrderId,
                extraData = "",
                signature = signature
            };

            var client = new RestClient(_options.Value.MomoApiUrl);
            var request = new RestRequest() { Method = Method.Post };
            request.AddHeader("Content-Type", "application/json; charset=UTF-8");
            request.AddParameter("application/json", JsonConvert.SerializeObject(requestData), ParameterType.RequestBody);

            var response = await client.ExecuteAsync(request);

            if (!response.IsSuccessful)
            {
                throw new Exception($"Momo API call failed: {response.StatusCode} - {response.Content}");
            }

            var momoResponse = JsonConvert.DeserializeObject<MomoCreatePaymentResponseModel>(response.Content);
            return momoResponse;
        }
        public MomoExecuteResponseModel PaymentExecuteMomo(IQueryCollection collection)
        {
            // Lấy dữ liệu callback
            var partnerCode = collection["partnerCode"].ToString();
            var accessKey = collection["accessKey"].ToString();
            var orderId = collection["orderId"].ToString();
            var requestId = collection["requestId"].ToString();
            var amount = collection["amount"].ToString();
            var orderInfo = collection["orderInfo"].ToString();
            var orderType = collection["orderType"].ToString();
            var transId = collection["transId"].ToString();
            var resultCode = collection["resultCode"].ToString();
            var message = collection["message"].ToString();
            var payType = collection["payType"].ToString();
            var extraData = collection["extraData"].ToString();
            var signature = collection["signature"].ToString();

            // Kiểm tra signature
            var rawData =
                $"partnerCode={partnerCode}&accessKey={accessKey}&requestId={requestId}&amount={amount}&orderId={orderId}&orderInfo={orderInfo}&orderType={orderType}&transId={transId}&resultCode={resultCode}&message={message}&payType={payType}&extraData={extraData}";

            var computedSignature = ComputeHmacSha256(rawData, _options.Value.SecretKey);

            if (signature != computedSignature)
            {
                throw new Exception("Invalid signature from Momo callback!");
            }

            // Trả dữ liệu đã verify
            return new MomoExecuteResponseModel
            {
                OrderId = orderId,
                OrderInfo = orderInfo,
                Amount = long.Parse(amount),
                TransId = transId,
                ResultCode = resultCode,
                Message = message,
                PayType = payType
            };
        }

        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(message);

            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(messageBytes);

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
