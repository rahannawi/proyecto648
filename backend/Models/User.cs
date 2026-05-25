namespace NetInventory.API.Models
{
    public enum Role
    {
        ADMIN,
        TECNICO,
        USUARIO
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Role Role { get; set; }
    }
}
