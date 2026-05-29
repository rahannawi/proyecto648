// ESTE ARCHIVO SIRVE PARA:
// Alimentar o poblar (Seed) la base de datos MariaDB con datos de prueba estructurados y coherentes.
// También realiza automáticamente las migraciones pendientes del Entity Framework y crea una vista personalizada SQL.
// Esto permite garantizar que, cada vez que se ejecute la aplicación, la base de datos se limpie y tenga datos impecables para pruebas inmediatas.

using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;

namespace NetInventory.API.Data
{
    public static class DbSeeder
    {
        // ESTA FUNCIÓN SIRVE PARA:
        // Inicializar el proceso de migración, vista SQL, limpieza y sembrado de registros.
        // Recibe el contexto de base de datos 'AppDbContext' para realizar las transacciones.
        public static void Seed(AppDbContext context)
        {
            // 1. APLICAR MIGRACIONES AUTOMÁTICAS:
            // .Database.Migrate() detecta si hay esquemas o tablas pendientes de crear en la base de datos de MariaDB
            // y los ejecuta automáticamente en el inicio de la app. Así no hace falta ejecutar comandos manuales en la consola de comandos.
            context.Database.Migrate();

            // 2. CREACIÓN DE VISTA SQL (PUNTO CLAVE PARA LA DEFENSA):
            // Ejecutamos código SQL puro (Raw SQL) para crear o reemplazar una vista relacional.
            // Una vista es una tabla virtual basada en una consulta SQL predefinida. No almacena datos físicamente,
            // sino que combina de manera eficiente información de múltiples tablas (Préstamos, Equipos y Usuarios) mediante JOINs.
            try
            {
                context.Database.ExecuteSqlRaw(@"
                    CREATE OR REPLACE VIEW v_prestamos_detalles AS
                    SELECT 
                        l.Id AS Prestamo_Id,
                        e.Name AS Equipo,
                        e.Brand AS Marca,
                        e.Model AS Modelo,
                        e.SerialNumber AS Nro_Serie,
                        u_borrower.Name AS Solicitante,
                        u_approver.Name AS Aprobador,
                        l.StartDate AS Fecha_Inicio,
                        l.EndDate AS Fecha_Fin,
                        l.Status AS Estado_Prestamo
                    FROM loans l
                    INNER JOIN equipments e ON l.EquipmentId = e.Id
                    INNER JOIN users u_borrower ON l.BorrowerId = u_borrower.Id
                    INNER JOIN users u_approver ON l.ApproverId = u_approver.Id;
                ");
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("Error creando la Vista SQL: " + ex.Message);
            }

            // 3. LIMPIEZA TOTAL DE TABLAS BASE:
            // Borra todos los registros previos en orden jerárquico inverso de dependencias para evitar colisiones de llaves foráneas.
            // Primero se eliminan reseñas e historiales de préstamos (tablas dependientes), luego equipos físicos y finalmente proveedores y usuarios (tablas maestras).
            try
            {
                context.Reviews.RemoveRange(context.Reviews);
                context.Loans.RemoveRange(context.Loans);
                context.Equipments.RemoveRange(context.Equipments);
                context.Providers.RemoveRange(context.Providers);
                context.Users.RemoveRange(context.Users);
                context.SaveChanges();
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("Error limpiando las tablas base: " + ex.Message);
            }

            // 4. REGISTRO DE USUARIOS DE PRUEBA:
            // Creamos 3 usuarios con roles diferentes y credenciales simples ("123") para que el profesor y compañeros prueben la seguridad.
            var user = new User { Name = "Juan Perez", Email = "usuario@test.com", PasswordHash = "123", Role = Role.USUARIO };
            var tecnico = new User { Name = "Carlos Martinez", Email = "tecnico@test.com", PasswordHash = "123", Role = Role.TECNICO };
            var admin = new User { Name = "Ana Gomez", Email = "admin@test.com", PasswordHash = "123", Role = Role.ADMIN };
            
            // Agrega los usuarios a la colección en memoria y guarda físicamente.
            context.Users.AddRange(user, tecnico, admin);
            context.SaveChanges();

            // 5. REGISTRO DE PROVEEDORES DE PRUEBA:
            // Creamos dos empresas proveedoras de tecnología para asociar a los equipos físicos del inventario.
            var provider1 = new Provider
            {
                Name = "TechSupply Co.",
                ContactName = "John Doe",
                Phone = "555-0192",
                Email = "john@techsupply.com"
            };
            var provider2 = new Provider
            {
                Name = "NetConnect Solutions",
                ContactName = "Jane Smith",
                Phone = "555-0481",
                Email = "jane@netconnect.com"
            };
            context.Providers.AddRange(provider1, provider2);
            context.SaveChanges();

            // 6. REGISTRO DE EQUIPOS DEL INVENTARIO:
            // Registramos diferentes equipos de red y computadoras. Asociamos la clave foránea 'ProviderId'
            // con el ID de los proveedores creados anteriormente (relación 1 a muchos).
            var eq1 = new Equipment { Name = "Router C1111", Brand = "Cisco", Model = "C1111-4P", SerialNumber = "SN-9823741", Status = "Disponible", ProviderId = provider1.Id };
            var eq2 = new Equipment { Name = "Switch Catalyst 2960", Brand = "Cisco", Model = "WS-C2960-24TC-L", SerialNumber = "SN-1029384", Status = "En uso", ProviderId = provider1.Id };
            var eq3 = new Equipment { Name = "ThinkPad T14", Brand = "Lenovo", Model = "Gen 2", SerialNumber = "PF-2B3C4D", Status = "Disponible", ProviderId = provider1.Id };
            var eq4 = new Equipment { Name = "Access Point Aironet 2800", Brand = "Cisco", Model = "AIR-AP2802I-E-K9", SerialNumber = "SN-2048591", Status = "Disponible", ProviderId = provider2.Id };
            var eq5 = new Equipment { Name = "Firewall FortiGate 60F", Brand = "Fortinet", Model = "FG-60F", SerialNumber = "SN-3049182", Status = "Disponible", ProviderId = provider1.Id };
            var eq6 = new Equipment { Name = "Servidor PowerEdge R750", Brand = "Dell", Model = "PE-R750", SerialNumber = "SN-4029481", Status = "Mantenimiento", ProviderId = provider1.Id };
            
            context.Equipments.AddRange(eq1, eq2, eq3, eq4, eq5, eq6);
            context.SaveChanges();

            // 7. REGISTRO DE PRÉSTAMOS DE DEMOSTRACIÓN:
            // Creamos préstamos históricos:
            // - Uno "Activo" (prestado a 'user', aprobado por 'tecnico', sin fecha fin 'EndDate').
            // - Uno "Devuelto" (prestado a 'user', aprobado por 'admin', con fecha fin hace 1 día).
            context.Loans.AddRange(
                new Loan 
                { 
                    EquipmentId = eq2.Id, 
                    BorrowerId = user.Id, 
                    ApproverId = tecnico.Id, 
                    StartDate = System.DateTime.UtcNow.AddDays(-3), 
                    Status = "Activo" 
                },
                new Loan 
                { 
                    EquipmentId = eq3.Id, 
                    BorrowerId = user.Id, 
                    ApproverId = admin.Id, 
                    StartDate = System.DateTime.UtcNow.AddDays(-7), 
                    EndDate = System.DateTime.UtcNow.AddDays(-1), 
                    Status = "Devuelto" 
                }
            );
            context.SaveChanges();

            // 8. REGISTRO DE RESEÑAS DE PRUEBA:
            // Añadimos reseñas iniciales a nivel general de la empresa hechas por el usuario y el técnico de prueba.
            context.Reviews.AddRange(
                new Review
                {
                    Comment = "Excelente ambiente de trabajo y los equipos son de última tecnología.",
                    Status = "Resuelta",
                    AuthorId = user.Id,
                    Date = System.DateTime.UtcNow.AddDays(-2),
                    EquipmentId = null // Al ser general no se vincula a ningún equipo específico
                },
                new Review
                {
                    Comment = "Me gustaría contar con más stock de laptops ThinkPad disponibles en el inventario.",
                    Status = "Pendiente",
                    AuthorId = tecnico.Id,
                    Date = System.DateTime.UtcNow.AddDays(-5),
                    EquipmentId = null
                }
            );
            context.SaveChanges();
        }
    }
}

