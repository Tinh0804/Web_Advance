using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using src.Infrastructure.Data;
using System.Threading.Tasks;

namespace src.API.Extensions
{
    public class TransactionFilter : IAsyncActionFilter
    {
        private readonly ApplicationDbContext _dbContext;

        public TransactionFilter(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Bắt đầu transaction
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            var resultContext = await next(); // Gọi action

            if (resultContext.Exception == null)
            {
                // Nếu không lỗi => commit
                await transaction.CommitAsync();
            }
            else
            {
                // Nếu có lỗi => rollback
                await transaction.RollbackAsync();
            }
        }
    }
}
