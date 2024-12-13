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

        public static ML.Result GetById(int id_user)
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    // Recuperar el usuario utilizando LINQ
                    var usuario = context.Usuarios
                        .SingleOrDefault(u => u.IdUser == id_user);

                    if (usuario != null)
                    {
                        // Recuperar el rol asociado si existe
                        var rol = context.Rols
                            .SingleOrDefault(r => r.IdRol == usuario.IdRol);

                        // Mapear el resultado a ML.Usuario
                        ML.Usuario mlUsuario = new ML.Usuario
                        {
                            IdUsuario = usuario.IdUser,
                            UserName = usuario.UserName,
                            Nombre = usuario.Nombre,
                            ApellidoPaterno = usuario.ApellidoPaterno,
                            ApellidoMaterno = usuario.ApellidoMaterno,
                            Email = usuario.Email,
                            Password = usuario.Password,
                            Sexo = usuario.Sexo,
                            Telefono = usuario.Telefono,
                            Celular = usuario.Celular,
                            // Convertir FechaNacimiento a string si tiene valor
                            FechaNacimiento = usuario.FechaNacimiento?.ToString("yyyy-MM-dd") ?? null,
                            CURP = usuario.Curp,
                            IdRol = rol != null ? rol.Nombre.ToString() : null
                        };

                        result.Object = mlUsuario;
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se encontró el usuario para el ID proporcionado.";
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

        public static ML.Result UsuarioUpdateEF(ML.Usuario usuario)
        {
            ML.Result result = new ML.Result();
            try
            {
                // Utilizar GetById para obtener el usuario actual
                var getUsuarioResult = GetById(usuario.IdUsuario);

                if (getUsuarioResult.Correct)
                {
                    // Recuperar el usuario desde el resultado de GetById
                    ML.Usuario usuarioExistente = (ML.Usuario)getUsuarioResult.Object;

                    // Iniciar transacción
                    using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                    {
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                // Obtener el usuario en la base de datos
                                var usuarioEF = context.Usuarios.FirstOrDefault(u => u.IdUser == usuarioExistente.IdUsuario);

                                if (usuarioEF != null)
                                {
                                    // Actualizar los campos del usuario con los nuevos valores
                                    usuarioEF.UserName = usuario.UserName;
                                    usuarioEF.Nombre = usuario.Nombre;
                                    usuarioEF.ApellidoPaterno = usuario.ApellidoPaterno;
                                    usuarioEF.ApellidoMaterno = usuario.ApellidoMaterno;
                                    usuarioEF.Email = usuario.Email;
                                    usuarioEF.Password = usuario.Password;
                                    usuarioEF.Sexo = usuario.Sexo;
                                    usuarioEF.Telefono = usuario.Telefono;
                                    usuarioEF.Celular = usuario.Celular;
                                    usuarioEF.FechaNacimiento = DateOnly.FromDateTime(DateTime.ParseExact(usuario.FechaNacimiento, "dd/MM/yyyy", null));
                                    usuarioEF.Curp = usuario.CURP;
                                    usuarioEF.IdRol = usuario.Rol.IdRol;
                                    if (usuario.ImagenPerfil != null && usuario.ImagenPerfil.Length > 0)
                                    {
                                        usuarioEF.ImagenPerfil = usuario.ImagenPerfil;
                                    }

                                    // Guardar los cambios en el usuario
                                    context.SaveChanges();

                                    // Obtener la dirección existente asociada al usuario
                                    var direccionEF = context.Direccions.FirstOrDefault(d => d.IdUsuario == usuario.IdUsuario);

                                    if (direccionEF != null)
                                    {
                                        // Actualizar los campos de la dirección
                                        direccionEF.Calle = usuario.Direccion.Calle;
                                        direccionEF.NumeroInterior = usuario.Direccion.NumeroInterior;
                                        direccionEF.NumeroExterior = usuario.Direccion.NumeroExterior;
                                        direccionEF.IdColonia = usuario.Direccion.Colonia.IdColonia;

                                        // Guardar los cambios en la dirección
                                        context.SaveChanges();

                                        result.Correct = true;
                                        transaction.Commit(); // Confirmar la transacción
                                    }
                                    else
                                    {
                                        result.Correct = false;
                                        result.ErrorMessage = "La dirección asociada no se encontró.";
                                        transaction.Rollback(); // Revertir si no se encuentra la dirección
                                    }
                                }
                                else
                                {
                                    result.Correct = false;
                                    result.ErrorMessage = "El usuario no se encontró.";
                                    transaction.Rollback(); // Revertir si no se encuentra el usuario
                                }
                            }
                            catch (Exception ex)
                            {
                                transaction.Rollback(); // Revertir la transacción en caso de error
                                result.Correct = false;
                                result.ErrorMessage = ex.Message;
                                result.Ex = ex;
                            }
                        }
                    }
                }
                else
                {
                    result.Correct = false;
                    result.ErrorMessage = "No se pudo obtener el usuario con el ID proporcionado.";
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

        public static ML.Result UsuarioDeleteEF(int idUsuario)
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
                            // Buscar la dirección asociada al usuario
                            var direccion = context.Direccions.FirstOrDefault(d => d.IdUsuario == idUsuario);

                            if (direccion != null)
                            {
                                // Eliminar la dirección asociada
                                context.Direccions.Remove(direccion);
                                context.SaveChanges(); // Persistir la eliminación de la dirección
                            }

                            // Buscar al usuario
                            var usuario = context.Usuarios.FirstOrDefault(u => u.IdUser == idUsuario);
                                
                            if (usuario != null)
                            {
                                // Eliminar al usuario
                                context.Usuarios.Remove(usuario);
                                context.SaveChanges(); // Persistir la eliminación del usuario

                                // Confirmar la transacción si ambas eliminaciones fueron exitosas
                                result.Correct = true;
                                transaction.Commit();
                            }
                            else
                            {
                                result.Correct = false;
                                result.ErrorMessage = "Usuario no encontrado.";
                                transaction.Rollback(); // Revertir si el usuario no existe
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
