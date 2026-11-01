namespace CareBase.Shared.Permissions;

public static class AppPermissions
{
    // Patients
    public const string PatientsView = "patients.view";
    public const string PatientsCreate = "patients.create";
    public const string PatientsUpdate = "patients.update";

    // Appointments
    public const string AppointmentsView = "appointments.view";
    public const string AppointmentsCreate = "appointments.create";
    public const string AppointmentsUpdate = "appointments.update";
    public const string AppointmentsCancel = "appointments.cancel";

    // Queue
    public const string QueueView = "queue.view";
    public const string QueueManage = "queue.manage";

    // Medical Records
    public const string RecordsView = "records.view";
    public const string RecordsCreate = "records.create";
    public const string RecordsUpdate = "records.update";
    public const string RecordsAmend = "records.amend";

    // Notes
    public const string NotesView = "notes.view";
    public const string NotesCreate = "notes.create";

    // Employees
    public const string EmployeesView = "employees.view";
    public const string EmployeesCreate = "employees.create";
    public const string EmployeesUpdate = "employees.update";
    public const string EmployeesStatus = "employees.status";
    public const string EmployeesResetCredentials = "employees.reset_credentials";

    // Administration
    public const string DepartmentsManage = "departments.manage";
    public const string RolesManage = "roles.manage";
    public const string ReportsView = "reports.view";
    public const string AuditView = "audit.view";
    public const string SettingsManage = "settings.manage";

    public static readonly string[] AllPermissions =
    [
        PatientsView, PatientsCreate, PatientsUpdate,
        AppointmentsView, AppointmentsCreate, AppointmentsUpdate, AppointmentsCancel,
        QueueView, QueueManage,
        RecordsView, RecordsCreate, RecordsUpdate, RecordsAmend,
        NotesView, NotesCreate,
        EmployeesView, EmployeesCreate, EmployeesUpdate, EmployeesStatus, EmployeesResetCredentials,
        DepartmentsManage, RolesManage, ReportsView, AuditView, SettingsManage
    ];

    public static string[] GetRolePermissions(string roleName) => roleName switch
    {
        "Admin" or "System Administrator" => AllPermissions,
        "Manager" or "Healthcare Manager" =>
        [
            EmployeesView, EmployeesCreate, EmployeesUpdate, EmployeesStatus, EmployeesResetCredentials,
            DepartmentsManage, ReportsView, AuditView,
            PatientsView, AppointmentsView, QueueView
        ],
        "Doctor" =>
        [
            PatientsView,
            AppointmentsView, AppointmentsUpdate,
            QueueView,
            RecordsView, RecordsCreate, RecordsUpdate, RecordsAmend,
            NotesView, NotesCreate,
            ReportsView
        ],
        "Nurse" =>
        [
            PatientsView,
            AppointmentsView,
            QueueView, QueueManage,
            RecordsView,
            NotesView, NotesCreate
        ],
        "Clerk" or "Receptionist" =>
        [
            PatientsView, PatientsCreate, PatientsUpdate,
            AppointmentsView, AppointmentsCreate, AppointmentsUpdate, AppointmentsCancel,
            QueueView, QueueManage
        ],
        _ => [PatientsView, AppointmentsView]
    };
}

