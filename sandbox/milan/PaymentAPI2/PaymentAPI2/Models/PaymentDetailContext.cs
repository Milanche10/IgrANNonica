using Microsoft.EntityFrameworkCore;

namespace PaymentAPI2.Models
{
    public class PaymentDetailContext:DbContext
    {
        public PaymentDetailContext(DbContextOptions<PaymentDetailContext> options):base(options)
        {

        }

        public DbSet<PaymentDetail> PaymentDetails { get; set; }
    }
}
