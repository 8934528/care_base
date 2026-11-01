namespace CareBase.Shared.Enums;

public enum UserRole
{
    Admin,
    Manager,
    Doctor,
    Nurse,
    Clerk
}

public enum AccountStatus
{
    Active,
    Inactive,
    Suspended,
    Locked,
    Deactivated,
    Pending
}

public enum RecordStatus
{
    Draft,
    Open,
    Finalised,
    Amended,
    Cancelled
}

public enum AppointmentStatus
{
    Scheduled,
    Confirmed,
    CheckedIn,
    InConsultation,
    Completed,
    Cancelled,
    Missed
}

public enum QueueStatus
{
    Waiting,
    InProgress,
    InConsultation,
    Completed,
    Skipped,
    Cancelled
}
