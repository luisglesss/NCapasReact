using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class Rol
    {
        [Display(Name = "Nombre Del Rol")]
        public int IdRol { get; set; }
        public string? Nombre { get; set; }
        public List<object>? Rols { get; set; }
    }
}
