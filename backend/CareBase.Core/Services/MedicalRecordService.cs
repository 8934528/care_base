using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class MedicalRecordService(AppDbContext context)
{
    private static string GenerateVisitRef()
    {
        return $"VIS-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<MedicalRecord> CreateRecord(CreateMedicalRecordDto dto)
    {
        var record = new MedicalRecord
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            QueueId = dto.QueueId,

            VisitReference = GenerateVisitRef(),

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

            FollowUpDate = dto.FollowUpDate
        };

        context.MedicalRecords.Add(record);
        await context.SaveChangesAsync();

        return record;
    }

    public async Task<List<MedicalRecord>> GetPatientHistory(int patientId)
    {
        return await context.MedicalRecords
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.VisitDate)
            .ToListAsync();
    }

    public async Task<MedicalRecord?> GetRecord(int id)
    {
        return await context.MedicalRecords
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
