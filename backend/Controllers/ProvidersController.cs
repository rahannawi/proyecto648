// ESTE ARCHIVO SIRVE PARA:
// Definir el controlador de la API REST para los "Proveedores" (Providers).
// Un controlador es el encargado de recibir las peticiones HTTP que vienen desde el frontend (React),
// procesar la solicitud interactuando con la base de datos a través de Entity Framework, y devolver la respuesta adecuada.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    // [Route("api/[controller]")] define la ruta base de acceso para este controlador.
    // El token [controller] se reemplaza automáticamente por el nombre del controlador sin la palabra "Controller",
    // por lo tanto, la ruta para acceder a este controlador es: http://localhost:5219/api/Providers
    [Route("api/[controller]")]
    
    // [ApiController] es un atributo de ASP.NET Core que habilita comportamientos automáticos muy útiles,
    // como la validación automática de modelos (ModelState) y respuestas predeterminadas de error en formato JSON.
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        // Esta variable privada almacena la referencia al contexto de la base de datos (AppDbContext).
        // Se declara como 'readonly' para garantizar que solo se le asigne un valor en el constructor.
        private readonly AppDbContext _context;

        // ESTE CONSTRUCTOR SIRVE PARA:
        // Recibir por inyección de dependencias el contexto de base de datos 'AppDbContext' configurado.
        // La inyección de dependencias es un patrón de diseño donde el framework de .NET crea y administra
        // la instancia del contexto, y se la entrega a este controlador cuando se realiza una petición.
        public ProvidersController(AppDbContext context)
        {
            _context = context;
        }

        // ESTA FUNCIÓN SIRVE PARA:
        // Obtener la lista completa de todos los proveedores registrados en la base de datos.
        // Responde a peticiones HTTP GET a la ruta base: GET /api/Providers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Provider>>> GetProviders()
        {
            // Usamos 'ToListAsync()' de Entity Framework para consultar de manera asíncrona (sin bloquear el hilo de ejecución)
            // todos los registros de la tabla 'Providers' y devolverlos como una lista.
            return await _context.Providers.ToListAsync();
        }

        // ESTA FUNCIÓN SIRVE PARA:
        // Registrar un nuevo proveedor en el sistema.
        // Responde a peticiones HTTP POST a la ruta base: POST /api/Providers
        // Recibe en el cuerpo de la petición (Body) un objeto de tipo 'Provider' en formato JSON.
        [HttpPost]
        public async Task<ActionResult<Provider>> PostProvider(Provider provider)
        {
            // 1. Agregamos el objeto proveedor al conjunto 'Providers' en el contexto de Entity Framework.
            //    En este punto, el registro solo se prepara en memoria, aún no se guarda físicamente en la base de datos.
            _context.Providers.Add(provider);

            // 2. Guardamos de forma asíncrona los cambios en la base de datos MariaDB.
            //    Aquí se ejecuta la instrucción SQL INSERT real y se genera automáticamente el ID autoincremental para el proveedor.
            await _context.SaveChangesAsync();

            // 3. Devolvemos una respuesta HTTP 201 Created.
            //    Esta es una buena práctica en desarrollo de APIs REST. Incluye una cabecera de localización (Location)
            //    que apunta al endpoint para obtener los detalles de este proveedor específico, y devuelve el objeto creado (con su ID ya asignado).
            return CreatedAtAction(nameof(GetProviders), new { id = provider.Id }, provider);
        }
    }
}

