using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    /// <summary>
    /// CONTROLADOR DE EQUIPOS (EQUIPMENTS CONTROLLER)
    /// Este controlador expone los endpoints HTTP (/api/Equipments) para realizar
    /// la consulta, creación y actualización de los equipos de red en el inventario.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor que recibe el contexto de base de datos listo para usar mediante inyección de dependencias
        public EquipmentsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Obtener la lista completa de todos los equipos del inventario.
        /// Realiza un 'Include' de la relación 'Provider' para que el frontend reciba también 
        /// los datos del proveedor que suministró cada equipo.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipments()
        {
            // Consulta los equipos en MariaDB incluyendo su proveedor asociado
            return await _context.Equipments.Include(e => e.Provider).ToListAsync();
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Registrar un nuevo equipo de red (Acción exclusiva del Admin).
        /// Recibe el JSON del nuevo equipo, lo agrega a la tabla y confirma los cambios en MariaDB.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Equipment>> PostEquipment(Equipment equipment)
        {
            _context.Equipments.Add(equipment); // Agrega el equipo al contexto
            await _context.SaveChangesAsync(); // Guarda de forma asíncrona en la base de datos
            return CreatedAtAction(nameof(GetEquipments), new { id = equipment.Id }, equipment);
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Modificar los detalles o estado físico de un equipo existente.
        /// Recibe el id en la URL y los datos en el cuerpo de la petición.
        /// Si el Técnico cambia el estado de un equipo de "En uso" a "Disponible", el frontend
        /// disparará el cierre automático de su préstamo correspondiente.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipment(int id, Equipment equipment)
        {
            // Valida que el ID especificado en la ruta coincida con el ID del objeto a modificar
            if (id != equipment.Id)
            {
                return BadRequest(); // Retorna error 400 (Petición incorrecta)
            }

            // Marca la entidad del equipo como modificada para que Entity Framework sepa qué actualizar
            _context.Entry(equipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // Ejecuta el UPDATE en MariaDB
            }
            catch (DbUpdateConcurrencyException)
            {
                // Controla errores si dos personas intentan actualizar el mismo equipo al mismo tiempo
                if (!EquipmentExists(id))
                {
                    return NotFound(); // Retorna error 404 si el equipo ya no existe
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Retorna código 204 (Éxito, sin contenido de respuesta)
        }

        // ESTA FUNCIÓN INTERNA SIRVE PARA: Verificar de manera rápida si existe un equipo por su ID en MariaDB.
        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.Id == id);
        }
    }
}
