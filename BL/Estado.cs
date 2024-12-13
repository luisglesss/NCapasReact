using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Estado
    {
        public static ML.Result GetAllEFLinqEstado()
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL_EF.LgaonaContext context = new DL_EF.LgaonaContext())
                {
                    var resultSelect = (from estadoLinq in context.Estados
                                        select estadoLinq).ToList();

                    if (resultSelect.Count > 0)
                    {
                        result.Objects = new List<object>();

                        foreach (DL_EF.Estado estado in resultSelect)
                        {
                            ML.Estado estadoItem = new ML.Estado();
                            estadoItem.IdEstado = estado.IdEstado;
                            estadoItem.Nombre = estado.Nombre;

                            result.Objects.Add(estadoItem);
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
