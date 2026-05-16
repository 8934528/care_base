import { useState } from "react";
import { createAppointment } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createAppointment(form);
      alert(`Appointment Created: ${result.appointmentRef}`);
      navigate("/appointments/daily");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Appointment creation failed. Check for conflicts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-calendar-clock"></i> Appointment Scheduler</h1>
      </div>

      <div className="row">
        <div className="col-7">
          <div className="glass-panel">
            <div className="section-header">
              <i className="fi fi-rr-calendar section-icon"></i>
              <h3 className="section-title">Booking Details</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="patientId">Patient ID</label>
                    <input id="patientId" className="form-input" name="patientId" placeholder="Patient ID" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="doctorId">Doctor ID</label>
                    <input id="doctorId" className="form-input" name="doctorId" placeholder="Doctor ID" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="appointmentDate">Appointment Date</label>
                <input id="appointmentDate" type="date" className="form-input" name="appointmentDate" onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">Start Time</label>
                    <div className="input-with-icon">
                      <i className="fi fi-rr-clock-three input-icon-right"></i>
                      <input id="startTime" type="time" className="form-input" name="startTime" onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="endTime">End Time</label>
                    <div className="input-with-icon">
                      <i className="fi fi-rr-clock-three input-icon-right"></i>
                      <input id="endTime" type="time" className="form-input" name="endTime" onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="appointmentType">Appointment Type</label>
                <select id="appointmentType" className="form-input" name="appointmentType" onChange={handleChange} aria-label="Select appointment type">
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reason">Reason for Visit</label>
                <textarea id="reason" className="form-input" name="reason" placeholder="Brief reason for the appointment..." rows={2} onChange={handleChange} />
              </div>

              <div className="form-actions-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <i className="fi fi-rr-check"></i>
                  <span>{loading ? "Checking Conflicts..." : "Confirm Booking"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-5">
          <div className="glass-panel policy-panel">
            <div className="section-header">
              <i className="fi fi-rr-shield-check section-icon-secondary"></i>
              <h3 className="section-title text-secondary">Booking Policy</h3>
            </div>
            <ul className="policy-list">
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>System automatically detects doctor time conflicts and prevents overlapping bookings.</span>
              </li>
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>Ensure a minimum 15-minute buffer between consultations for clinical cleaning.</span>
              </li>
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>Emergency bookings bypass routine slots and trigger high-priority queue alerts.</span>
              </li>
            </ul>
            
            <div className="card slot-card-placeholder">
              <i className="fi fi-rr-list stat-icon-muted"></i>
              <h4>Slot Availability</h4>
              <p>Full interactive availability grid coming in next update.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
