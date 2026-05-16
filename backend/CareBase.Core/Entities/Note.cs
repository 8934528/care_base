namespace CareBase.Core.Entities;

public class Note
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int? MedicalRecordId { get; set; }
    public int AuthorId { get; set; }
    public required string NoteType { get; set; }
    public required string NoteContent { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; } = null!;
    public MedicalRecord? MedicalRecord { get; set; }
    public User Author { get; set; } = null!;
}
