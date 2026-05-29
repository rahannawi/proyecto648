namespace NetInventory.API.Models
{
    /// <summary>
    /// MODELO DE EQUIPO (EQUIPMENT)
    /// Esta clase define la estructura de la tabla 'Equipments' en la base de datos MariaDB.
    /// Representa un equipo de red físico (router, switch, laptop, AP, etc.) en el inventario.
    /// </summary>
    public class Equipment
    {
        // Identificador único auto-incremental (Llave Primaria)
        public int Id { get; set; }
        
        // Nombre descriptivo del equipo (Ej: "Router Cisco C1111", "Laptop ThinkPad")
        public string Name { get; set; } = string.Empty;
        
        // Marca del fabricante (Ej: "Cisco", "Lenovo", "Dell")
        public string Brand { get; set; } = string.Empty;
        
        // Modelo exacto del equipo (Ej: "Gen 2", "FG-60F")
        public string Model { get; set; } = string.Empty;
        
        // Número de serie único del fabricante para auditoría física y control de inventario
        public string SerialNumber { get; set; } = string.Empty;
        
        // Estado físico actual del equipo. Valores posibles: "Disponible", "En uso" o "Mantenimiento".
        public string Status { get; set; } = "Disponible";
        
        // RELACIÓN CON PROVEEDORES (Llave Foránea Opcional / Nullable)
        // Almacena el ID del proveedor que suministró o da soporte al equipo.
        public int? ProviderId { get; set; }
        
        // Propiedad de navegación de Entity Framework para consultar el objeto completo del Proveedor
        public Provider? Provider { get; set; }
    }
}
