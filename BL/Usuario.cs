using Microsoft.EntityFrameworkCore;

namespace BL
{
    public class Usuario
    {
        public static ML.Result GetAll()
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    // Realiza la consulta SQL utilizando FromSqlRaw
                    var query = context.Usuarios.FromSqlRaw("SELECT * FROM Usuario").ToList();

                    if (query != null && query.Count > 0)
                    {
                        result.Objects = new List<object>();
                        foreach (var item in query)
                        {
                            ML.Usuario usuario = new ML.Usuario
                            {
                                IdUsuario = item.IdUser,
                                Nombre = item.Nombre,
                                UserName = item.UserName,
                                ApellidoPaterno = item.ApellidoPaterno,
                                ApellidoMaterno = item.ApellidoMaterno,
                                Email = item.Email,
                                Sexo = item.Sexo,
                                Telefono = item.Telefono,
                                Celular = item.Celular
                            };

                            // Convertir la imagen a Base64 si está disponible
                            if (item.ImagenPerfil != null)
                            {
                                var base64String = Convert.ToBase64String(item.ImagenPerfil);
                                usuario.ImagenBase64 = String.Format("data:image/png;base64,{0}", base64String);
                            }

                            result.Objects.Add(usuario);
                        }
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se encontraron usuarios.";
                    }
                }
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }
            return result;
        }

        public static ML.Result UsuarioAddEF(ML.Usuario usuario)        
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            // Insertar usuario
                            DL_EF.Usuario usuarioEF = new DL_EF.Usuario
                            {
                                UserName = usuario.UserName,
                                Nombre = usuario.Nombre,
                                ApellidoPaterno = usuario.ApellidoPaterno,
                                ApellidoMaterno = usuario.ApellidoMaterno,
                                Email = usuario.Email,
                                Password = usuario.Password,
                                Sexo = usuario.Sexo,
                                Telefono = usuario.Telefono,
                                Celular = usuario.Celular,
                                FechaNacimiento = DateOnly.FromDateTime(DateTime.ParseExact(usuario.FechaNacimiento, "dd/MM/yyyy", null)),
                                Curp = usuario.CURP,
                                IdRol = usuario.Rol.IdRol,
                                ImagenPerfil = usuario.ImagenPerfil
                            };

                            // Agregar el usuario al contexto y guardar cambios
                            context.Usuarios.Add(usuarioEF);
                            context.SaveChanges(); // Esto persiste el usuario y genera un id para él.

                            // Obtener el id del usuario recién creado
                            int usuarioId = usuarioEF.IdUser;

                            // Insertar dirección asociada
                            DL_EF.Direccion direccionEF = new DL_EF.Direccion
                            {
                                Calle = usuario.Direccion.Calle,
                                NumeroInterior = usuario.Direccion.NumeroInterior,
                                NumeroExterior = usuario.Direccion.NumeroExterior,
                                IdColonia = usuario.Direccion.Colonia.IdColonia,
                                IdUsuario = usuarioId  // Relacionamos la dirección con el usuario insertado
                            };

                            // Agregar la dirección al contexto y guardar cambios
                            context.Direccions.Add(direccionEF);
                            context.SaveChanges(); // Guardamos la dirección, lo cual generará su IdDireccion automáticamente si está configurado como autoincremento.

                            // Verificar que la inserción fue exitosa
                            if (usuarioId > 0 && direccionEF.IdDireccion > 0)
                            {
                                result.Correct = true;
                                transaction.Commit(); // Confirmar la transacción
                            }
                            else
                            {
                                result.Correct = false;
                                transaction.Rollback(); // Revertir la transacción si no se insertaron correctamente los datos
                            }
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback(); // Revertir la transacción si ocurre un error
                            result.Correct = false;
                            result.ErrorMessage = ex.Message;
                            result.Ex = ex;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }

            return result;
        }
    }
}
