using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NCapasReact.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        /// <summary>
        /// Obtiene todos los usuarios en formato JSON.
        /// </summary>
        /// <returns>Lista de usuarios o un mensaje de error.</returns>
        [HttpGet]
        public IActionResult GetAll()
        {
            // Llama al método en la capa BL para obtener los datos
            ML.Result result = BL.Usuario.GetAll();

            // Devuelve los datos o un mensaje de error en base al resultado
            if (result.Correct)
            {
                return Ok(result.Objects); // Retorna solo la lista de usuarios
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.ErrorMessage,
                    exception = result.Ex?.Message
                });
            }
        }

        [HttpPost("Add")]
        public IActionResult AddUsuario([FromBody] ML.Usuario usuario)
        {
            // Verificar si la imagen Base64 está presente
            if (string.IsNullOrEmpty(usuario.ImagenBase64))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Imagen no proporcionada."
                });
            }

            try
            {
                // Convertir la cadena Base64 a byte[]
                byte[] imageBytes = Convert.FromBase64String(usuario.ImagenBase64);
                usuario.ImagenPerfil = imageBytes; // Asignar el arreglo de bytes a la propiedad de imagen

                // Llamar al método en la capa BL para agregar el usuario
                ML.Result result = BL.Usuario.UsuarioAddEF(usuario);

                if (result.Correct)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Usuario agregado con éxito.",
                        idUsuario = usuario.IdUsuario
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.ErrorMessage,
                        exception = result.Ex?.Message
                    });
                }
            }
            catch (FormatException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Error en la conversión de la imagen.",
                    exception = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor.",
                    exception = ex.Message
                });
            }
        }

        [HttpGet("GetAllRoles")]
        public IActionResult GetAllRol()
        {
            try
            {
                ML.Result result = BL.Rol.GetAllEFLinq();

                if (result.Correct)
                {
                    return Ok(new
                    {
                        success = true,
                        roles = result.Objects
                    });
                } else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.ErrorMessage,
                        exception = result.Ex?.Message
                    });
                }

            } catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor.",
                    exception = ex.Message
                });
            }
        }


        /// <summary>
        /// DropDownList Enn Cascada
        /// </summary>
        /// <returns></returns>
        [HttpGet("Estados")]
        public IActionResult GetEstados()
        {
            ML.Result result = BL.Estado.GetAllEFLinqEstado();
            if (result.Correct)
            {
                return Ok(new
                {
                    success = true,
                    data = result.Objects // Lista de estados
                });
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.ErrorMessage
                });
            }
        }

        // Obtener municipios por idEstado
        [HttpGet("Municipios/{idEstado}")]
        public IActionResult GetMunicipios(int idEstado)
        {
            ML.Result result = BL.Municipio.GetMunicipioByIdEstado(idEstado);
            if (result.Correct)
            {
                return Ok(new
                {
                    success = true,
                    data = result.Objects // Lista de municipios
                });
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.ErrorMessage
                });
            }
        }

        // Obtener colonias por idMunicipio
        [HttpGet("Colonias/{idMunicipio}")]
        public IActionResult GetColonias(int idMunicipio)
        {
            ML.Result result = BL.Colonia.GetByIdMunicipio(idMunicipio);
            if (result.Correct)
            {
                return Ok(new
                {
                    success = true,
                    data = result.Objects // Lista de colonias
                });
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.ErrorMessage
                });
            }
        }

        [HttpPut]
        [Route("Update/{IdUsuario}")]
        public IActionResult UsuarioUpdate(int IdUsuario, [FromForm] ML.Usuario usuario)
        {
            if (usuario.IdUsuario != IdUsuario)
            {
                return BadRequest(new { success = false, message = "El ID del usuario no coincide." });
            }

            // Verificar si la imagen Base64 está presente y no es vacía
            if (!string.IsNullOrEmpty(usuario.ImagenBase64))
            {
                try
                {
                    // Verificar si la cadena Base64 tiene el prefijo 'data:image/...;base64,'
                    if (usuario.ImagenBase64.Contains("data:image"))
                    {
                        // Eliminar el prefijo
                        var base64Data = usuario.ImagenBase64.Substring(usuario.ImagenBase64.IndexOf("base64,") + 7);
                        usuario.ImagenBase64 = base64Data;
                    }

                    // Log para verificar la cadena Base64 recibida
                    Console.WriteLine("Imagen Base64 recibida (primeros 100 caracteres): " + usuario.ImagenBase64.Substring(0, Math.Min(100, usuario.ImagenBase64.Length)));

                    // Convertir la cadena Base64 a byte[]
                    byte[] imageBytes = Convert.FromBase64String(usuario.ImagenBase64);
                    usuario.ImagenPerfil = imageBytes; // Asignar el arreglo de bytes a la propiedad de imagen
                }
                catch (FormatException ex)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Error en la conversión de la imagen.",
                        exception = ex.Message
                    });
                }
            }

            // Llamar al método en la capa BL para actualizar el usuario
            ML.Result result = BL.Usuario.UsuarioUpdateEF(usuario);

            if (result.Correct)
            {
                return Ok(new
                {
                    success = true,
                    message = "Usuario actualizado con éxito.",
                    idUsuario = usuario.IdUsuario
                });
            }
            else
            {
                return NotFound(new
                {
                    success = false,
                    message = result.ErrorMessage,
                    exception = result.Ex?.Message
                });
            }
        }

        [HttpDelete("Delete/{idUsuario}")]
        public IActionResult DeleteUsuario(int idUsuario)
        {
            ML.Result result = BL.Usuario.UsuarioDeleteEF(idUsuario);

            if (result.Correct)
            {
                // Asegurarse de que la respuesta siempre sea JSON válido
                return Ok(new { success = true, message = "Usuario eliminado correctamente." });
            }
            else
            {
                // Enviar la respuesta de error en formato JSON
                return BadRequest(new
                {
                    success = false,
                    message = result.ErrorMessage,
                    exception = result.Ex?.Message
                });
            }
        }
    }
}
