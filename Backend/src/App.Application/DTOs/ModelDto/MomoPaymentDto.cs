namespace src.Application.DTOs
{
    public class MomoCreatePaymentResponseModel
    {
        public string RequestId { get; set; }
        public int ErrorCode { get; set; }
        public string OrderId { get; set; }
        public string Message { get; set; }
        public string LocalMessage { get; set; }
        public string RequestType { get; set; }
        public string PayUrl { get; set; }
        public string Signature { get; set; }
        public string QrCodeUrl { get; set; }
        public string Deeplink { get; set; }
        public string DeeplinkWebInApp { get; set; }
    }
    public class MomoExecuteResponseModel
    {
        public string OrderId { get; set; } = string.Empty;       // Mã đơn hàng của bạn
        public string OrderInfo { get; set; } = string.Empty;     // Thông tin đơn hàng
        public long Amount { get; set; }                          // Số tiền thanh toán
        public string TransId { get; set; } = string.Empty;       // Mã giao dịch từ Momo
        public string ResultCode { get; set; } = string.Empty;    // 0: thành công, khác 0: thất bại
        public string Message { get; set; } = string.Empty;       // Thông báo trạng thái
        public string PayType { get; set; } = string.Empty;       // Hình thức thanh toán
    }

    public class MomoOptionModel
    {
        public string MomoApiUrl { get; set; }
        public string SecretKey { get; set; }
        public string AccessKey { get; set; }
        public string ReturnUrl { get; set; }
        public string NotifyUrl { get; set; }
        public string PartnerCode { get; set; }
        public string RequestType { get; set; }
    }
    public class OrderInfoModel
    {
         public string OrderId { get; set; }
         public string OrderInfo { get; set; }
          public string FullName { get; set; }
          public long Amount { get; set; }
    }


}