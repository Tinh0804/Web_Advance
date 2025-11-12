using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMomoService _momoService;
        public PaymentController(IVnPayService vnPayService,IMomoService momoService)
        {
            _vnPayService = vnPayService;
            _momoService = momoService;
        }

        [HttpPost("create-vnpay")]
        public IActionResult CreatePaymentUrlVnPay([FromBody] PaymentRequestModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { paymentUrl = url });
        }

        // 2️⃣ API callback (frontend hoặc VNPay redirect về)
        [HttpGet("vnpay-callback")]
        public IActionResult PaymentCallbackVnPay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            if (response.Success && response.VnPayResponseCode == "00")
            {
                // Thanh toán thành công
                // Lưu thông tin giao dịch vào database
            }
            else
            {
                // Thanh toán thất bại
            }
            return Ok(response);
        }

        [HttpPost("create-momo")]
        public async Task<IActionResult> CreatePaymentUrlMomo([FromBody] OrderInfoModel model)
        {
            var url = await _momoService.CreatePaymentMomo(model);
            return Ok(new { paymentUrl = url.PayUrl });
        }

        [HttpGet("momo-callback")]
        public IActionResult PaymentCallbackMomo()
        {
            var response = _momoService.PaymentExecuteMomo(Request.Query); 

            if (response != null && response.ResultCode == "0") // "0" là thành công theo Momo
            {
                // Thanh toán thành công
                // Lưu thông tin giao dịch vào database
            }
            else
            {
                // Thanh toán thất bại
            }

            return Ok(response);
        }


    }
}