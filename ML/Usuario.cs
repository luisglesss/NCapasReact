using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class Usuario
    {
        public int IdUsuario { get; set; }

        [Required]
        [Display(Name = "Nombre de usuario")]
        [Compare("UserName", ErrorMessage = "El campo es obligatorio.")]
        public string? UserName { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$")]
        [Display(Name = "Nombre")]
        [Compare("Nombre", ErrorMessage = "El campo es obligatorio.")]
        public string Nombre { get; set; }

        [Required]
        [Display(Name = "Apellido Paterno")]
        [Compare("ApellidoPaterno", ErrorMessage = "El campo es obligatorio.")]
        public string? ApellidoPaterno { get; set; }

        [Required]
        [Display(Name = "Apellido Materno")]
        [Compare("ApellidoMaterno", ErrorMessage = "El campo es obligatorio.")]
        public string? ApellidoMaterno { get; set; }

        [Required]
        [Display(Name = "Correo electrónico")]
        public string? Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña")]
        [Compare("Password", ErrorMessage = "El campo Contraseña es obligatorio.")]
        public string? Password { get; set; }
        public string? Sexo { get; set; }

        [Required]
        public string? Telefono { get; set; }
        public string Celular { get; set; }

        [Display(Name = "Fecha de Nacimiento")]
        public string FechaNacimiento { get; set; }

        [Required]
        [Display(Name = "Ingrese su CURP")]
        [Compare("CURP", ErrorMessage = "El campo es obligatorio.")]
        public string? CURP { get; set; }

        public string? IdRol { get; set; }
        public List<object>? Usuarios { get; set; }

        public ML.Rol Rol { get; set; }

        // Id de la dirección asignada al usuario
        public int IdDireccion { get; set; }

        // Relación con la dirección
        public ML.Direccion Direccion { get; set; }

        // Propiedad para la imagen de perfil
        public byte[]? ImagenPerfil { get; set; }

        public string? ImagenBase64 { get; set; }

        public bool Status { get; set; }
    }
}
