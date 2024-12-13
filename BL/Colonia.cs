using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Colonia
    {
        public static ML.Result GetByIdMunicipio(int IdMunicipio)
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {

                    var query = context.Colonia.Where(c => c.IdMunicipio == IdMunicipio).Select(c => new { c.IdColonia, c.Nombre }).ToList();

                    if (query != null)
                    {
                        if (query.Count > 0)
                        {
                            result.Objects = new List<object>();
                            foreach (var obj in query)
                            {
                                ML.Colonia colonia = new ML.Colonia();
                                colonia.IdColonia = obj.IdColonia;
                                colonia.Nombre = obj.Nombre;

                                result.Objects.Add(colonia);
                            }
                            result.Correct = true;
                        }
                        else
                        {
                            result.Correct = false;
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
