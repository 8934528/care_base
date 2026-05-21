using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class PatientService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    private static string GeneratePatientRef()
    {
        return $"PAT-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<Patient> RegisterPatient(CreatePatientDto dto)
    {
        var now = DateTime.UtcNow;
        var patient = new Patient
        {
            PatientRef = GeneratePatientRef(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            IdNumber = dto.IdNumber,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth.HasValue
                ? DateTime.SpecifyKind(dto.DateOfBirth.Value, DateTimeKind.Utc)
                : null,
            CreatedAt = now,
            UpdatedAt = now,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            EmergencyContactName = dto.EmergencyContactName,
            EmergencyContactPhone = dto.EmergencyContactPhone,
            MedicalHistory = dto.MedicalHistory
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return patient;
    }

    public async Task<List<Patient>> SearchPatients(string keyword)
    {
        if (string.IsNullOrEmpty(keyword))
        {
            return await _context.Patients.Take(50).ToListAsync();
        }

        return await _context.Patients
            .Where(p =>
                p.FirstName.Contains(keyword) ||
                p.LastName.Contains(keyword) ||
                p.IdNumber.Contains(keyword) ||
                p.PatientRef.Contains(keyword))
            .ToListAsync();
    }

    public async Task<Patient?> GetByRef(string patientRef)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.PatientRef == patientRef);
    }
}
