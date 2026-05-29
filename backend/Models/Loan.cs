using System;

namespace NetInventory.API.Models
{
    /// <summary>
    /// MODELO DE PRÉSTAMO (LOAN)
    /// Esta clase define la estructura de la tabla 'Loans' en la base de datos MariaDB.
    /// Registra el préstamo de un equipo a un usuario y quién (técnico) lo aprobó.
    /// </summary>
    public class Loan
    {
        // Identificador único auto-incremental (Llave Primaria)
        public int Id { get; set; }
        
        // Fecha y hora exactas en que inicia el préstamo (Por defecto la fecha actual UTC)
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        
        // Fecha y hora de devolución del equipo (Es nullable: nulo mientras el préstamo esté "Activo")
        public DateTime? EndDate { get; set; }
        
        // Estado del préstamo. Valores: "Activo", "Devuelto", "Devuelto por Mantenimiento".
        public string Status { get; set; } = "Activo";

        // RELACIONES DE BASE DE DATOS:

        // 1. Relación con el Equipo prestado (Llave Foránea obligatoria hacia 'Equipments')
        public int EquipmentId { get; set; }
        // Propiedad de navegación de Entity Framework para consultar el objeto completo del Equipo
        public Equipment? Equipment { get; set; }

        // 2. Relación con el Usuario que recibe el equipo prestado (Llave Foránea hacia 'Users')
        public int BorrowerId { get; set; }
        // Propiedad de navegación para consultar los datos del Solicitante / Beneficiario
        public User? Borrower { get; set; }

        // 3. Relación con el Técnico que aprueba y registra el préstamo (Llave Foránea hacia 'Users')
        public int ApproverId { get; set; }
        // Propiedad de navegación para consultar los datos del Técnico que aprueba el préstamo
        public User? Approver { get; set; }
    }
}
