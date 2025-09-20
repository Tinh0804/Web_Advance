using System;
using System.Collections.Generic;

namespace App.API.Models;

public partial class KhachHang
{
    public string MaKhachHang { get; set; } = null!;

    public string HoTen { get; set; } = null!;

    public bool? GioiTinh { get; set; }

    public string? SoDienThoai { get; set; }

    public virtual ICollection<Ve> Ves { get; set; } = new List<Ve>();
}
