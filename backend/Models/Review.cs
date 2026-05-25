using System;

namespace NetInventory.API.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pendiente"; // Pendiente, Resuelta

        // Relaciones
        public int EquipmentId { get; set; }
        public Equipment? Equipment { get; set; }

        public int AuthorId { get; set; }
        public User? Author { get; set; }
    }
}
