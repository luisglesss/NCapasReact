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
                // Verificar si la cadena Base64 tiene el prefijo 'data:image/...;base64,'
                if (usuario.ImagenBase64.Contains("data:image"))
                {
                    // Eliminar el prefijo 'data:image/...;base64,' si existe
                    var base64Data = usuario.ImagenBase64.Substring(usuario.ImagenBase64.IndexOf("base64,") + 7);
                    usuario.ImagenBase64 = base64Data;
                }

                // Log para verificar la cadena Base64 recibida
                Console.WriteLine("Imagen Base64 recibida (primeros 100 caracteres): " + usuario.ImagenBase64.Substring(0, Math.Min(100, usuario.ImagenBase64.Length)));

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

        [HttpPut]
        [Route("Update/{IdUsuario}")]
        public IActionResult UsuarioUpdate(int IdUsuario, [FromForm] ML.Usuario usuario)
        {
            if (usuario.IdUsuario != IdUsuario)
            {
                return BadRequest(new { success = false, message = "El ID del usuario no coincide." });
            }

            ML.Result result = BL.Usuario.UsuarioUpdateEF(usuario);

            if (result.Correct)
            {
                return Ok(result);
            }
            else
            {
                return NotFound(result);
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
