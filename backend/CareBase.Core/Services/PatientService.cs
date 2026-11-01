using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class PatientService(AppDbContext context, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly AuditService _audit = audit;

    private static string GeneratePatientRef()
    {
        return $"PAT-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<Patient> RegisterPatient(CreatePatientDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var now = DateTime.UtcNow;
        var patient = new Patient
        {
            PatientRef = GeneratePatientRef(),
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            IdNumber = dto.IdNumber.Trim(),
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth.HasValue
                ? DateTime.SpecifyKind(dto.DateOfBirth.Value, DateTimeKind.Utc)
                : null,
            CreatedAt = now,
            UpdatedAt = now,
            Phone = dto.Phone.Trim(),
            Email = dto.Email?.Trim(),
            Address = dto.Address?.Trim(),
            EmergencyContactName = dto.EmergencyContactName?.Trim(),
            EmergencyContactPhone = dto.EmergencyContactPhone?.Trim(),
            MedicalHistory = dto.MedicalHistory?.Trim()
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "PatientRegistered",
            "Patients",
            $"Registered patient {patient.FirstName} {patient.LastName} ({patient.PatientRef})",
            resourceId: patient.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return patient;
    }

    public async Task<Patient> UpdatePatient(int id, CreatePatientDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var patient = await _context.Patients.FindAsync(id)
            ?? throw new KeyNotFoundException("Patient not found.");

        patient.FirstName = dto.FirstName.Trim();
        patient.LastName = dto.LastName.Trim();
        patient.IdNumber = dto.IdNumber.Trim();
        patient.Gender = dto.Gender;
        patient.DateOfBirth = dto.DateOfBirth.HasValue
            ? DateTime.SpecifyKind(dto.DateOfBirth.Value, DateTimeKind.Utc)
            : null;
        patient.Phone = dto.Phone.Trim();
        patient.Email = dto.Email?.Trim();
        patient.Address = dto.Address?.Trim();
        patient.EmergencyContactName = dto.EmergencyContactName?.Trim();
        patient.EmergencyContactPhone = dto.EmergencyContactPhone?.Trim();
        patient.MedicalHistory = dto.MedicalHistory?.Trim();
        patient.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "PatientUpdated",
            "Patients",
            $"Updated details for patient {patient.FirstName} {patient.LastName} ({patient.PatientRef})",
            resourceId: patient.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return patient;
    }

    public async Task<List<Patient>> SearchPatients(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await _context.Patients
                .OrderByDescending(p => p.CreatedAt)
                .Take(50)
                .ToListAsync();
        }

        var term = keyword.Trim().ToLower();
        return await _context.Patients
            .Where(p =>
                p.FirstName.ToLower().Contains(term) ||
                p.LastName.ToLower().Contains(term) ||
                p.IdNumber.Contains(term) ||
                p.PatientRef.ToLower().Contains(term) ||
                p.Phone.Contains(term))
            .OrderByDescending(p => p.CreatedAt)
            .Take(50)
            .ToListAsync();
    }

    public async Task<Patient?> GetPatientByRef(string patientRef, int currentUserId, string currentUserName, string currentUserRole)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientRef == patientRef);
        if (patient != null)
        {
            await _audit.LogAsync(
                "PatientProfileViewed",
                "Patients",
                $"Viewed patient profile for {patient.FirstName} {patient.LastName} ({patient.PatientRef})",
                resourceId: patient.Id.ToString(),
                userId: currentUserId,
                userName: currentUserName,
                userRole: currentUserRole
            );
        }
        return patient;
    }

    public async Task<Patient?> GetPatientById(int id)
    {
        return await _context.Patients.FindAsync(id);
    }
}
