using CareBase.Core.Entities;
using CareBase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Infrastructure.Repositories;

public class PatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync(string search)
    {
        var query = _context.Patients.AsQueryable();
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.FirstName.Contains(search) || p.LastName.Contains(search) || p.IdNumber.Contains(search));
        }
        return await query.ToListAsync();
    }
}
