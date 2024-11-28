using System;
using System.Collections.Generic;

namespace DL_EF;

public partial class Usuario
{
    public int IdUser { get; set; }

    public string UserName { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string ApellidoPaterno { get; set; } = null!;

    public string ApellidoMaterno { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Sexo { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string? Celular { get; set; }

    public DateOnly? FechaNacimiento { get; set; }

    public string? Curp { get; set; }

    public int? IdRol { get; set; }

    public int? Direccion { get; set; }

    public byte[]? ImagenPerfil { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Direccion> Direccions { get; set; } = new List<Direccion>();

    public virtual Rol? IdRolNavigation { get; set; }
}
