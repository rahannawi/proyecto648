using System.Collections.Generic;

namespace NetInventory.API.Models
{
    /// <summary>
    /// MODELO DE PROVEEDOR (PROVIDER)
    /// Esta clase define la estructura de la tabla 'Providers' en la base de datos MariaDB.
    /// Registra las empresas que suministran o brindan soporte a los equipos de red.
    /// </summary>
    public class Provider
    {
        // Identificador único auto-incremental (Llave Primaria)
        public int Id { get; set; }
        
        // Nombre de la empresa o razón social (Ej: "TechSupply Co.")
        public string Name { get; set; } = string.Empty;
        
        // Nombre del representante o persona de contacto directo (Ej: "John Doe")
        public string ContactName { get; set; } = string.Empty;
        
        // Teléfono de contacto del proveedor
        public string Phone { get; set; } = string.Empty;
        
        // Correo electrónico corporativo del proveedor
        public string Email { get; set; } = string.Empty;

        // RELACIÓN CON EQUIPOS (Uno a Muchos):
        // Un proveedor puede suministrar muchos equipos de red.
        // Propiedad de navegación que lista los equipos asociados a este proveedor en MariaDB.
        public List<Equipment> Equipments { get; set; } = new();
    }
}
