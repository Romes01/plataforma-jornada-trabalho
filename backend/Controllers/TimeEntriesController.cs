
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TimeEntriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TimeEntriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyEntries()
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

var entries = await _context.TimeEntries
    .Where(entry => entry.UserId == userId)
.Select(entry => new
{
    entry.Id,
    entry.StartedAt,
    entry.EndedAt,
    entry.CreatedAt,
    DurationMinutes = entry.EndedAt.HasValue
        ? (double?)(
            entry.EndedAt.Value - entry.StartedAt
        ).TotalMinutes
        : null
})
    .ToListAsync();

var orderedEntries = entries
    .OrderByDescending(entry => entry.StartedAt);

return Ok(orderedEntries);
    }
    
    [HttpPost("start")]
    public async Task<IActionResult> StartWorkday()
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var hasOpenEntry = await _context.TimeEntries
            .AnyAsync(entry =>
                entry.UserId == userId &&
                entry.EndedAt == null);

        if (hasOpenEntry)
        {
            return Conflict(new
            {
                message = "Você já possui uma jornada em andamento."
            });
        }

        var entry = new backend.Models.TimeEntry
        {
            UserId = userId,
            StartedAt = DateTimeOffset.UtcNow
        };

        _context.TimeEntries.Add(entry);
        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            entry.Id,
            entry.StartedAt,
            entry.EndedAt,
            message = "Entrada registrada com sucesso."
        });
    }
[HttpPost("end")]
public async Task<IActionResult> EndWorkday()
{
    var userIdClaim = User.FindFirstValue(
        ClaimTypes.NameIdentifier);

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized();
    }

var entry = await _context.TimeEntries
    .FirstOrDefaultAsync(entry =>
        entry.UserId == userId &&
        entry.EndedAt == null);

    if (entry is null)
    {
        return Conflict(new
        {
            message = "Você não possui uma jornada em andamento."
        });
    }

    entry.EndedAt = DateTimeOffset.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        entry.Id,
        entry.StartedAt,
        entry.EndedAt,
        message = "Jornada encerrada com sucesso."
    });
}
}
