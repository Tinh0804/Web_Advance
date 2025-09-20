using System;
using System.Collections.Generic;

namespace App.API.Models;

public partial class LichTrinh
{
    public string MaLichTrinh { get; set; } = null!;

    public string TenTau { get; set; } = null!;

    public string GaDi { get; set; } = null!;

    public string GaDen { get; set; } = null!;

    public decimal? KhoangCach { get; set; }

    public TimeOnly ThoiGianKhoiHanh { get; set; }

    public decimal TongGioDi { get; set; }

    public virtual ICollection<Ve> Ves { get; set; } = new List<Ve>();
}
