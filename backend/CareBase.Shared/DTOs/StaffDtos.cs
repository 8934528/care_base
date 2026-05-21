namespace CareBase.Shared.DTOs;

public class DoctorListItemDto
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
}

public class DoctorAvailableDatesDto
{
    public int DoctorId { get; set; }
    public required string DoctorName { get; set; }
    public List<string> AvailableDates { get; set; } = [];
}
