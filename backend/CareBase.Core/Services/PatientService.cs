using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class PatientService
{
    private readonly AppDbContext _context;

    public PatientService(AppDbContext context)
    {
        _context = context;
    }

    private string GeneratePatientRef()
    {
        return $"PAT-{DateTime.Now.Year}-{Guid.NewGuid().ToString().Substring(0, 5).ToUpper()}";
    }

    public async Task<Patient> RegisterPatient(CreatePatientDto dto)
    {
        var patient = new Patient
        {
            PatientRef = GeneratePatientRef(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            IdNumber = dto.IdNumber,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
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
