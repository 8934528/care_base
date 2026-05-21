namespace CareBase.Shared.DTOs;

public class CreateNoteDto
{
    public int PatientId { get; set; }
    public required string NoteContent { get; set; }
    public string NoteType { get; set; } = "Clinical";
}

public class NoteResponseDto
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public required string AuthorName { get; set; }
    public required string AuthorRole { get; set; }
    public DateTime CreatedAt { get; set; }
}
