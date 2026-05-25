using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetInventory.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProvidersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Provider>>> GetProviders()
        {
            return await _context.Providers.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Provider>> PostProvider(Provider provider)
        {
            _context.Providers.Add(provider);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProviders), new { id = provider.Id }, provider);
        }
    }
}
