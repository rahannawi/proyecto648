namespace NetInventory.API.Models
{
    /// <summary>
    /// ENUMERACIÓN DE ROLES (ROLE)
    /// Define los 3 niveles de acceso que puede tener un usuario en el sistema.
    /// ADMIN = 0 (Administrador)
    /// TECNICO = 1 (Técnico de Redes)
    /// USUARIO = 2 (Usuario General / Solicitante)
    /// </summary>
    public enum Role
    {
        ADMIN,
        TECNICO,
        USUARIO
    }

    /// <summary>
    /// MODELO DE USUARIO (USER)
    /// Esta clase define la estructura de la tabla 'Users' en la base de datos MariaDB.
    /// Almacena las cuentas registradas en el sistema para control de accesos e inicios de sesión.
    /// </summary>
    public class User
    {
        // Identificador único auto-incremental (Llave Primaria)
        public int Id { get; set; }
        
        // Nombre completo de la persona (Ej: "Juan Perez")
        public string Name { get; set; } = string.Empty;
        
        // Correo electrónico utilizado para iniciar sesión y contacto (Ej: "usuario@test.com")
        public string Email { get; set; } = string.Empty;
        
        // Contraseña en texto plano para verificar la autenticación (Ej: "123")
        public string PasswordHash { get; set; } = string.Empty;
        
        // Rol asignado al usuario para el control estricto de accesos y visualizaciones
        public Role Role { get; set; }
    }
}
