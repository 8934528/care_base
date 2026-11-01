using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CareBase.Core.Services;

public class MedicalRecordService(AppDbContext context, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly AuditService _audit = audit;

    private static string GenerateVisitRef()
    {
        return $"VIS-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<MedicalRecord> CreateRecord(CreateMedicalRecordDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var record = new MedicalRecord
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId > 0 ? dto.DoctorId : currentUserId,
            QueueId = dto.QueueId,

            VisitReference = GenerateVisitRef(),
            VisitDate = DateTime.UtcNow,

            Subjective = dto.Subjective,
            Objective = dto.Objective,
            Assessment = dto.Assessment,
            Plan = dto.Plan,

            DiagnosisCode = dto.DiagnosisCode,
            Prescription = dto.Prescription,

            BloodPressure = dto.BloodPressure,
            HeartRate = dto.HeartRate,
            Temperature = dto.Temperature,
            OxygenLevel = dto.OxygenLevel,

            Weight = dto.Weight,
            Height = dto.Height,

            FollowUpDate = dto.FollowUpDate.HasValue 
                ? DateTime.SpecifyKind(dto.FollowUpDate.Value, DateTimeKind.Utc) 
                : null,
            Status = "Finalised",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.MedicalRecords.Add(record);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "MedicalRecordCreated",
            "Clinical",
            $"Created medical record {record.VisitReference} for patient ID {record.PatientId}",
            resourceId: record.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return record;
    }

    public async Task<List<MedicalRecord>> GetPatientHistory(int patientId, int currentUserId, string currentUserName, string currentUserRole)
    {
        var list = await _context.MedicalRecords
            .Include(x => x.Doctor)
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.VisitDate)
            .ToListAsync();

        await _audit.LogAsync(
            "PatientHistoryAccessed",
            "Clinical",
            $"Viewed clinical history for patient ID {patientId}",
            resourceId: patientId.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return list;
    }

    public async Task<MedicalRecord?> GetRecord(int id, int currentUserId, string currentUserName, string currentUserRole)
    {
        var record = await _context.MedicalRecords
            .Include(x => x.Doctor)
            .Include(x => x.Patient)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (record != null)
        {
            await _audit.LogAsync(
                "MedicalRecordViewed",
                "Clinical",
                $"Viewed medical record {record.VisitReference} (Patient {record.PatientId})",
                resourceId: record.Id.ToString(),
                userId: currentUserId,
                userName: currentUserName,
                userRole: currentUserRole
            );
        }

        return record;
    }

    public async Task<MedicalRecord> AmendRecord(
        int id, 
        CreateMedicalRecordDto dto, 
        string reason, 
        int currentUserId, 
        string currentUserName, 
        string currentUserRole)
    {
        var existing = await _context.MedicalRecords.FindAsync(id)
            ?? throw new KeyNotFoundException("Medical record not found.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new InvalidOperationException("A valid clinical reason is required to amend a medical record.");

        // Archive prior state for non-repudiation / audit compliance
        var priorSnapshot = new
        {
            existing.Subjective,
            existing.Objective,
            existing.Assessment,
            existing.Plan,
            existing.DiagnosisCode,
            existing.Prescription,
            existing.BloodPressure,
            existing.HeartRate,
            existing.Temperature,
            existing.OxygenLevel,
            existing.Weight,
            existing.Height,
            existing.FollowUpDate,
            existing.UpdatedAt
        };

        var historyEntry = $"[Amended on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC by Dr. {currentUserName} - Reason: {reason}]\nPrevious: {JsonSerializer.Serialize(priorSnapshot)}\n\n";
        existing.AmendmentHistory = (existing.AmendmentHistory ?? "") + historyEntry;

        existing.Subjective = dto.Subjective;
        existing.Objective = dto.Objective;
        existing.Assessment = dto.Assessment;
        existing.Plan = dto.Plan;
        existing.DiagnosisCode = dto.DiagnosisCode;
        existing.Prescription = dto.Prescription;
        existing.BloodPressure = dto.BloodPressure;
        existing.HeartRate = dto.HeartRate;
        existing.Temperature = dto.Temperature;
        existing.OxygenLevel = dto.OxygenLevel;
        existing.Weight = dto.Weight;
        existing.Height = dto.Height;
        existing.FollowUpDate = dto.FollowUpDate.HasValue 
            ? DateTime.SpecifyKind(dto.FollowUpDate.Value, DateTimeKind.Utc) 
            : null;
        existing.AmendedReason = reason;
        existing.AmendedAt = DateTime.UtcNow;
        existing.AmendedByDoctorId = currentUserId;
        existing.Status = "Amended";
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "MedicalRecordAmended",
            "Clinical",
            $"Amended medical record {existing.VisitReference}. Reason: {reason}",
            resourceId: existing.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return existing;
    }
}
