import { useState } from "react";
import { registerPatient } from "../../services/patientService";
import { useNavigate } from "react-router-dom";

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    gender: "Male",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalHistory: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerPatient(form);
      alert(`Patient Registered: ${res.patientRef}`);
      navigate("/patients");
    } catch (err: unknown) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-user-add"></i> Patient Registration</h1>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <div className="section-header">
                <i className="fi fi-rr-user section-icon"></i>
                <h3 className="section-title">Personal Information</h3>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" placeholder="First Name" className="form-input" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" placeholder="Last Name" className="form-input" onChange={handleChange} required />
              </div>
              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="idNumber">ID Number</label>
                    <input id="idNumber" name="idNumber" placeholder="ID Number" className="form-input" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" className="form-input" onChange={handleChange} aria-label="Select gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
                <input id="dateOfBirth" name="dateOfBirth" type="date" className="form-input" onChange={handleChange} aria-label="Date of birth" />
              </div>
            </div>

            <div className="col-6">
              <div className="section-header">
                <i className="fi fi-rr-phone-call section-icon"></i>
                <h3 className="section-title">Contact & Emergency</h3>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input id="phone" name="phone" placeholder="Phone" className="form-input" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="Email" className="form-input" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address</label>
                <div className="input-with-icon">
                  <i className="fi fi-rr-marker input-icon-right"></i>
                  <textarea id="address" name="address" placeholder="Physical Address" className="form-input" rows={2} onChange={handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="emergencyContactName">Emergency Name</label>
                    <input id="emergencyContactName" name="emergencyContactName" placeholder="Name" className="form-input" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="emergencyContactPhone">Emergency Phone</label>
                    <input id="emergencyContactPhone" name="emergencyContactPhone" placeholder="Phone" className="form-input" onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group mt-4">
            <div className="section-header-compact">
              <i className="fi fi-rr-interrogation section-icon-warning"></i>
              <label className="form-label mb-0" htmlFor="medicalHistory">Medical History (Allergies, Chronic Conditions, etc.)</label>
            </div>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              placeholder="Enter medical history..."
              className="form-input"
              rows={4}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <i className="fi fi-rr-disk"></i>
              <span>{loading ? "Registering..." : "Register Patient"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
