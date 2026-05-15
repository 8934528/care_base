namespace CareBase.Core.Entities;

public class Note
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int AuthorId { get; set; } // Doctor or Nurse ID
    public string Content { get; set; }
    public string NoteType { get; set; } // DoctorNote, NurseNote
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; }
    public User Author { get; set; }
}
