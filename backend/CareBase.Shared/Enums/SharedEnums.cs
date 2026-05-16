namespace CareBase.Shared.Enums;

public enum UserRole
{
    Admin,
    Doctor,
    Nurse,
    Clerk
}

public enum QueueStatus
{
    Waiting,
    InConsultation,
    Completed,
    Cancelled
}
