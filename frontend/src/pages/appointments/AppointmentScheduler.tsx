import { useState } from "react";
import { createAppointment } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, AlertTriangle, ShieldCheck, Check } from "lucide-react";

export default function AppointmentScheduler() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    appointmentType: "Routine Checkup",
    reason: "",
    priority: "Normal",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createAppointment(form);
      alert(`Appointment Created: ${result.appointmentRef}`);
      navigate("/appointments/daily");
    } catch (err: any) {
      alert(err.response?.data?.message || "Appointment creation failed. Check for conflicts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Appointment Scheduler</h1>

      <div className="row">
        <div className="col-7">
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Calendar size={20} strokeWidth={1.5} color="var(--primary)" />
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>Booking Details</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Patient ID</label>
                    <input className="form-input" name="patientId" placeholder="Patient ID" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Doctor ID</label>
                    <input className="form-input" name="doctorId" placeholder="Doctor ID" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input type="date" className="form-input" name="appointmentDate" onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={16} strokeWidth={1.5} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--border)' }} />
                      <input type="time" className="form-input" name="startTime" onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={16} strokeWidth={1.5} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--border)' }} />
                      <input type="time" className="form-input" name="endTime" onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Type</label>
                <select className="form-input" name="appointmentType" onChange={handleChange}>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea className="form-input" name="reason" placeholder="Brief reason for the appointment..." rows={2} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                  <Check size={18} strokeWidth={2} />
                  {loading ? "Checking Conflicts..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-5">
          <div className="glass-panel" style={{ height: '100%', background: 'rgba(var(--secondary-rgb), 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <ShieldCheck size={20} strokeWidth={1.5} color="var(--secondary)" />
              <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Booking Policy</h3>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>System automatically detects doctor time conflicts and prevents overlapping bookings.</span>
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>Ensure a minimum 15-minute buffer between consultations for clinical cleaning.</span>
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>Emergency bookings bypass routine slots and trigger high-priority queue alerts.</span>
              </li>
            </ul>
            
            <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)' }}>
              <FileText size={48} color="var(--border)" strokeWidth={1} style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)' }}>Slot Availability</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full interactive availability grid coming in next update.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
