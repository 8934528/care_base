namespace CareBase.Core.Entities;

public class Patient
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string IdNumber { get; set; }
    public string ReferenceNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string ContactNumber { get; set; }
    public string Address { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
