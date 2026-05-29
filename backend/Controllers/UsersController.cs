using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        /// <summary>
        /// REGISTRO DE USUARIO (SOLO ADMINISTRADOR)
        /// Este endpoint recibe un objeto 'User' en el cuerpo de la solicitud (JSON)
        /// enviado desde el frontend. Guarda al nuevo usuario directamente en la base
        /// de datos MariaDB e incluye su contraseña en texto plano en la columna 'PasswordHash'.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Agrega el nuevo usuario al contexto de la base de datos
            _context.Users.Add(user);
            
            // Confirma y guarda los cambios de forma asíncrona en MariaDB
            await _context.SaveChangesAsync();
            
            // Retorna un código 201 (Created) indicando éxito y devolviendo el usuario creado
            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        /// <summary>
        /// AUTENTICACIÓN / INICIO DE SESIÓN
        /// Recibe las credenciales (Email y Contraseña) en un objeto 'LoginRequest'.
        /// Busca en la base de datos un registro que coincida de forma exacta.
        /// Si lo encuentra, retorna los datos del usuario (id, nombre, email, rol) 
        /// pero limpia el campo PasswordHash por seguridad antes de enviarlo.
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            // Busca el primer usuario que coincida exactamente con el correo y contraseña ingresados
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == request.Password);
            
            // Si no coincide ningún registro, retorna un código de error 401 (No Autorizado)
            if (user == null)
            {
                return Unauthorized(new { message = "Credenciales incorrectas" });
            }

            // Instancia de retorno segura: evitamos exponer la contraseña hacia el cliente
            var userResponse = new User
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PasswordHash = "" // Limpiamos la clave por seguridad en la respuesta HTTP
            };

            return Ok(userResponse);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
