using System;

namespace NetInventory.API.Models
{
    /// <summary>
    /// MODELO DE RESEÑA (REVIEW)
    /// Esta clase define la estructura de la tabla 'Reviews' en la base de datos MariaDB.
    /// Registra las opiniones, comentarios o críticas de los usuarios sobre la empresa.
    /// </summary>
    public class Review
    {
        // Identificador único auto-incremental (Llave Primaria)
        public int Id { get; set; }
        
        // El contenido escrito de la reseña u opinión
        public string Comment { get; set; } = string.Empty;
        
        // Fecha y hora en que se redactó la opinión (Por defecto el instante actual UTC)
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        // Estado de moderación/atención. Por defecto "Pendiente".
        public string Status { get; set; } = "Pendiente";

        // RELACIONES:

        // 1. Relación con un Equipo de red (Llave Foránea Opcional / Nullable)
        // Establecido en null representa que es una crítica/reseña general hacia la empresa.
        public int? EquipmentId { get; set; }
        // Propiedad de navegación para consultar el Equipo asociado
        public Equipment? Equipment { get; set; }

        // 2. Relación con el Usuario que redacta la reseña (Llave Foránea obligatoria hacia 'Users')
        public int AuthorId { get; set; }
        // Propiedad de navegación para acceder a los datos completos del Autor
        public User? Author { get; set; }
    }
}
