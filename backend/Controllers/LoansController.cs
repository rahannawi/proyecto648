using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    /// <summary>
    /// CONTROLADOR DE PRÉSTAMOS (LOANS CONTROLLER)
    /// Este controlador expone los endpoints HTTP (/api/Loans) para realizar
    /// el control de préstamos de equipos de red de la organización.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor que recibe el contexto de base de datos listo para interactuar
        public LoansController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Obtener el listado de préstamos activos e históricos.
        /// Utiliza 'Include' de Entity Framework para cargar de forma óptima los detalles 
        /// completos del equipo, el usuario solicitante y el técnico aprobador.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            return await _context.Loans
                .Include(l => l.Equipment)
                .Include(l => l.Borrower)
                .Include(l => l.Approver)
                .ToListAsync();
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Registrar una nueva asignación de préstamo de equipo de red.
        /// Recibe el JSON del préstamo y lo inserta en la base de datos MariaDB.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Loan>> PostLoan(Loan loan)
        {
            _context.Loans.Add(loan); // Registra el préstamo en el contexto
            await _context.SaveChangesAsync(); // Guarda los cambios de forma asíncrona en MariaDB
            return CreatedAtAction(nameof(GetLoans), new { id = loan.Id }, loan);
        }

        /// <summary>
        /// ESTA FUNCIÓN SIRVE PARA: Actualizar un préstamo existente (Por ejemplo, cuando se devuelve un equipo).
        /// Establece la fecha de devolución ('endDate') y actualiza el estado a "Devuelto" o "Devuelto por Mantenimiento".
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoan(int id, Loan loan)
        {
            // Valida que el ID en la ruta URL coincida con el ID del préstamo a editar
            if (id != loan.Id)
            {
                return BadRequest();
            }

            // Marca el préstamo como modificado para el rastreador de Entity Framework
            _context.Entry(loan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // Ejecuta el UPDATE de forma asíncrona en MariaDB
            }
            catch (DbUpdateConcurrencyException)
            {
                // Control de concurrencia
                if (!_context.Loans.Any(l => l.Id == id))
                {
                    return NotFound(); // Retorna 404 si el préstamo ya no existe
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Retorna 204 en caso de éxito
        }
    }
}
