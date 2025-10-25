using Microsoft.AspNetCore.Mvc;
using src.API.Extensions;

namespace src.API.Attributes
{
    public class TransactionAttribute : TypeFilterAttribute
    {
        public TransactionAttribute() : base(typeof(TransactionFilter))
        {
        }
    }
}
