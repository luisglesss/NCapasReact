using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class Direccion
    {
        public int IdDireccion { get; set; }
        public string Calle { get; set; }

        [Display(Name = "Numero Interior")]
        public string NumeroInterior { get; set; }

        [Display(Name = "Numero Exterior")]
        public string NumeroExterior { get; set; }
        public ML.Colonia Colonia { get; set; }
        public string IdUsuario { get; set; }
        public List<object> Direcciones { get; set; }
    }
}
