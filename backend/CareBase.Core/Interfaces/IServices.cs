using CareBase.Core.Entities;

namespace CareBase.Core.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<Patient>> GetAllPatientsAsync(string search);
    Task<Patient> GetPatientByIdAsync(int id);
    Task<Patient> CreatePatientAsync(Patient patient);
}

public interface IAuthService
{
    Task<object> LoginAsync(string email, string password);
    Task<object> RegisterAsync(User user, string password, string role);
}
