using System;

namespace NetInventory.API.Models
{
    public class Loan
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = "Activo"; // Activo, Devuelto, Revocado

        // Relaciones
        public int EquipmentId { get; set; }
        public Equipment? Equipment { get; set; }

        public int BorrowerId { get; set; } // Usuario que recibe el equipo
        public User? Borrower { get; set; }

        public int ApproverId { get; set; } // Técnico que aprueba el préstamo
        public User? Approver { get; set; }
    }
}
