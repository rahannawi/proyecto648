using Microsoft.EntityFrameworkCore;

namespace NetInventory.API.Models
{
    /// <summary>
    /// CONTEXTO DE BASE DE DATOS (APPDBCONTEXT)
    /// Esta es la clase más importante del acceso a datos en Entity Framework Core.
    /// Sirve para conectar nuestras clases de C# con las tablas reales en la base de datos MariaDB
    /// y configurar reglas estrictas de integridad referencial.
    /// </summary>
    public class AppDbContext : DbContext
    {
        // Constructor que inyecta la configuración (por ejemplo, la cadena de conexión) al DbContext
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DBSETS: Cada DbSet representa una tabla real en MariaDB administrada por EF Core.
        
        // Tabla de Cuentas de Usuarios
        public DbSet<User> Users { get; set; }
        
        // Tabla del Catálogo de Equipos de Red
        public DbSet<Equipment> Equipments { get; set; }
        
        // Tabla de Proveedores de Equipos
        public DbSet<Provider> Providers { get; set; }
        
        // Tabla de Control de Préstamos
        public DbSet<Loan> Loans { get; set; }
        
        // Tabla de Reseñas y Críticas constructivas
        public DbSet<Review> Reviews { get; set; }

        // ESTA FUNCIÓN SIRVE PARA: Configurar de forma avanzada el mapeo y las relaciones físicas
        // en la base de datos MariaDB al momento de construirse el esquema (Fluent API).
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // EVITAR CONFLICTOS DE BORRADO EN CASCADA CON MÚLTIPLES RUTAS (Cascade Delete Restrict):
            // Si eliminamos un usuario, no queremos que se elimine automáticamente toda la base de datos.
            
            // 1. Evita borrado en cascada al eliminar al beneficiario (Borrower) de un préstamo
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Borrower)
                .WithMany()
                .HasForeignKey(l => l.BorrowerId)
                .OnDelete(DeleteBehavior.Restrict);

            // 2. Evita borrado en cascada al eliminar al técnico aprobador (Approver) de un préstamo
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Approver)
                .WithMany()
                .HasForeignKey(l => l.ApproverId)
                .OnDelete(DeleteBehavior.Restrict);

            // 3. Evita borrado en cascada al eliminar al autor (Author) de una opinión o reseña
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Author)
                .WithMany()
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
