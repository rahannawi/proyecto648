// ESTE ARCHIVO SIRVE PARA:
// Definir el controlador de la API REST para las "Reseñas" (Reviews) o comentarios corporativos.
// Este componente recibe peticiones HTTP para que los usuarios (con privilegios autorizados) puedan dejar reseñas
// sobre la empresa o equipos, y los demás roles puedan visualizarlas en tiempo real.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    // [Route("api/[controller]")] mapea este controlador a la ruta base: http://localhost:5219/api/Reviews
    [Route("api/[controller]")]
    
    // Habilita validaciones automáticas del modelo de datos de entrada y comportamiento REST.
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        // Variable para almacenar el contexto de acceso a datos.
        private readonly AppDbContext _context;

        // ESTE CONSTRUCTOR SIRVE PARA:
        // Recibir por inyección de dependencias el contexto 'AppDbContext' para interactuar con MariaDB.
        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // ESTA FUNCIÓN SIRVE PARA:
        // Obtener todas las reseñas registradas en la base de datos, incluyendo la información de sus entidades relacionadas.
        // Responde a: GET /api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            // Usamos '.Include()' para indicarle a Entity Framework Core que realice operaciones de carga ansiosa (Eager Loading).
            // Mediante INNER/LEFT JOINs en SQL, carga simultáneamente el Equipo ('Equipment') asociado a la reseña (si existe)
            // y el Autor ('Author') de la reseña, evitando el problema clásico de consultas múltiples (N+1 queries).
            return await _context.Reviews
                .Include(r => r.Equipment)
                .Include(r => r.Author)
                .ToListAsync();
        }

        // ESTA FUNCIÓN SIRVE PARA:
        // Agregar una nueva reseña o crítica en la base de datos.
        // Responde a: POST /api/Reviews
        // Recibe en el body un JSON con los campos de la reseña (Comment, AuthorId, EquipmentId, etc.)
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            // 1. Añadimos el objeto de reseña al conjunto en memoria de Entity Framework Core.
            _context.Reviews.Add(review);

            // 2. Guardamos físicamente los datos en la base de datos de manera asíncrona.
            //    Esto genera el ID autoincrementable y establece la fecha del registro correspondiente.
            await _context.SaveChangesAsync();

            // 3. Devolvemos respuesta HTTP 201 Created con la ubicación de consulta del recurso.
            return CreatedAtAction(nameof(GetReviews), new { id = review.Id }, review);
        }
    }
}

