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

        [HttpPost]
        [Route("Add/")]
        public IActionResult UsuarioAdd([FromBody] ML.Usuario usuario)
        {
            // Llama al método en la capa BL para agregar el usuario
            ML.Result result = BL.Usuario.UsuarioAddEF(usuario);

            if (result.Correct)
            {
                return Ok(result.Objects); // Retorna la respuesta exitosa con el nuevo usuario
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
    }
}
