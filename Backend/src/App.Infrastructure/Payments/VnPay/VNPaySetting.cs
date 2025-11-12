namespace src.Infrastructure.Payments.VNPay
{
    public class VNPaySetting
    {
        public string TmnCode { get; set; }      // Mã website trên VNPay
        public string HashSecret { get; set; }   // Chuỗi bí mật dùng để mã hóa
        public string BaseUrl { get; set; }      // URL gọi đến VNPay
        public string ReturnUrl { get; set; }    // URL redirect sau khi thanh toán
    }
}