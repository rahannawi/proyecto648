using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;

namespace NetInventory.API.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.Migrate();

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User { Name = "Juan Perez (Operador)", Email = "operador@test.com", PasswordHash = "123", Role = Role.USUARIO },
                    new User { Name = "Carlos Martinez (Técnico)", Email = "tecnico@test.com", PasswordHash = "123", Role = Role.TECNICO },
                    new User { Name = "Ana Gomez (Admin)", Email = "admin@test.com", PasswordHash = "123", Role = Role.ADMIN }
                );
                context.SaveChanges();
            }

            if (!context.Providers.Any())
            {
                var provider = new Provider
                {
                    Name = "TechSupply Co.",
                    ContactName = "John Doe",
                    Phone = "555-0192",
                    Email = "john@techsupply.com"
                };
                context.Providers.Add(provider);
                context.SaveChanges();

                if (!context.Equipments.Any())
                {
                    context.Equipments.AddRange(
                        new Equipment { Name = "Router C1111", Brand = "Cisco", Model = "C1111-4P", SerialNumber = "SN-9823741", Status = "Disponible", ProviderId = provider.Id },
                        new Equipment { Name = "Switch Catalyst 2960", Brand = "Cisco", Model = "WS-C2960-24TC-L", SerialNumber = "SN-1029384", Status = "Disponible", ProviderId = provider.Id },
                        new Equipment { Name = "ThinkPad T14", Brand = "Lenovo", Model = "Gen 2", SerialNumber = "PF-2B3C4D", Status = "Disponible", ProviderId = provider.Id }
                    );
                    context.SaveChanges();
                }
            }
        }
    }
}
