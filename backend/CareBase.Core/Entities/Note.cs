namespace CareBase.Core.Entities;

public class Note
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int? MedicalRecordId { get; set; }
    public int AuthorId { get; set; }
    public string NoteType { get; set; }
    public string NoteContent { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; }
    public MedicalRecord MedicalRecord { get; set; }
    public User Author { get; set; }
}
