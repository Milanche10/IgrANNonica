using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using App;

namespace App.Data
{
    public class AppContext : DbContext
    {
        public AppContext (DbContextOptions<AppContext> options)
            : base(options)
        {
        }

        public DbSet<App.Student> Student { get; set; }
    }
}
