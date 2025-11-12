namespace src.Application.DTOs
{
    public class PaymentRequestModel
    {
        public string OrderType { get; set; } = "other";
        public double Amount { get; set; }
        public string OrderDescription { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
    public class PaymentResponseModel
    {
        public string OrderDescription { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "VnPay";
        public string PaymentId { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string VnPayResponseCode { get; set; } = string.Empty;
    }

}