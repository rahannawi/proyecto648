namespace NetInventory.API.Models
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Status { get; set; } = "Disponible"; // Disponible, Prestado, Reparacion
        
        // Relación Proveedor
        public int? ProviderId { get; set; }
        public Provider? Provider { get; set; }
    }
}
