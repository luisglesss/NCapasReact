using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Municipio
    {
        public static ML.Result GetMunicipioByIdEstado(int IdEstado)
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    // Recuperar el municipio utilizando LINQ
                    var municipios = context.Municipios.Where(m => m.IdEstado == IdEstado)
                                                       .Select(m => new { m.IdMunicipio, m.Nombre })
                                                       .ToList();

                    if (municipios != null && municipios.Count > 0)
                    {
                        result.Objects = new List<object>();
                        foreach (var obj in municipios)
                        {
                            ML.Municipio municipioItem = new ML.Municipio
                            {
                                IdMunicipio = obj.IdMunicipio,
                                Nombre = obj.Nombre
                            };

                            result.Objects.Add(municipioItem);
                        }
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se encontraron municipios para el estado proporcionado.";
                    }
                }
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }
    }
}
