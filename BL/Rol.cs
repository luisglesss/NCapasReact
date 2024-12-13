using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Rol
    {
        public static ML.Result GetAllEFLinq()
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    var resultSelect = (from rolLinq in context.Rols
                                        select rolLinq).ToList();

                    if (resultSelect.Count > 0)
                    {
                        result.Objects = new List<object>();

                        foreach (DL_EF.Rol rol in resultSelect)
                        {
                            ML.Rol rolItem = new ML.Rol();
                            rolItem.IdRol = rol.IdRol;
                            rolItem.Nombre = rol.Nombre;

                            result.Objects.Add(rol);
                        }
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
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
