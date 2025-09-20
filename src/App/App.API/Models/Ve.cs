using System;
using System.Collections.Generic;

namespace App.API.Models;

public partial class Ve
{
    public string MaVe { get; set; } = null!;

    public string? MaLichTrinh { get; set; }

    public string? MaKhachHang { get; set; }

    public int SoGhe { get; set; }

    public DateTime? NgayDat { get; set; }

    public decimal GiaTien { get; set; }

    public string? HinhThucThanhToan { get; set; }

    public virtual KhachHang? MaKhachHangNavigation { get; set; }

    public virtual LichTrinh? MaLichTrinhNavigation { get; set; }
}
