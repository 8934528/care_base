import { useState } from "react";
import { registerPatient } from "../../services/patientService";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, AlertCircle, Save } from "lucide-react";

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerPatient(form);
      alert(`Patient Registered: ${res.patientRef}`);
      navigate("/patients");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Patient Registration</h1>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <User size={20} strokeWidth={1.5} color="var(--primary)" />
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Personal Information</h3>
              </div>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input name="firstName" placeholder="First Name" className="form-input" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input name="lastName" placeholder="Last Name" className="form-input" onChange={handleChange} required />
              </div>
              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">ID Number</label>
                    <input name="idNumber" placeholder="ID Number" className="form-input" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-input" onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input name="dateOfBirth" type="date" className="form-input" onChange={handleChange} />
              </div>
            </div>

            <div className="col-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Phone size={20} strokeWidth={1.5} color="var(--primary)" />
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Contact & Emergency</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" placeholder="Phone" className="form-input" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" placeholder="Email" className="form-input" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} strokeWidth={1.5} style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--border)' }} />
                  <textarea name="address" placeholder="Physical Address" className="form-input" rows={2} onChange={handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Emergency Name</label>
                    <input name="emergencyContactName" placeholder="Name" className="form-input" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Emergency Phone</label>
                    <input name="emergencyContactPhone" placeholder="Phone" className="form-input" onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <AlertCircle size={18} strokeWidth={1.5} color="var(--warning)" />
              <label className="form-label" style={{ margin: 0 }}>Medical History (Allergies, Chronic Conditions, etc.)</label>
            </div>
            <textarea
              name="medicalHistory"
              placeholder="Enter medical history..."
              className="form-input"
              rows={4}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
              <Save size={18} strokeWidth={1.5} />
              {loading ? "Registering..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
