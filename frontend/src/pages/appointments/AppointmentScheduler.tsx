import { useState, useEffect } from "react";
import { createAppointment } from "../../services/appointmentService";
import { searchPatients } from "../../services/patientService";
import { getDoctors, getDoctorAvailableDates } from "../../services/staffService";
import { useNavigate } from "react-router-dom";

interface PatientOption {
  id: number;
  patientRef: string;
  firstName: string;
  lastName: string;
}

interface DoctorOption {
  id: number;
  fullName: string;
}

const CLINIC_ONLY_TYPES = ["Medication Collection", "Nurse Checkup"];

export default function AppointmentScheduler() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [visitMode, setVisitMode] = useState<"doctor" | "clinic">("doctor");
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    startTime: "09:00",
    endTime: "09:30",
    appointmentType: "Routine Checkup",
    reason: "",
    priority: "Normal",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [patientList, doctorList] = await Promise.all([
          searchPatients(""),
          getDoctors(false)
        ]);
        setPatients(patientList);
        setDoctors(doctorList);
      } catch (err) {
        console.error("Failed to load scheduler data", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (visitMode !== "doctor" || !form.doctorId) {
      setAvailableDates([]);
      if (visitMode === "clinic") {
        setForm((prev) => ({
          ...prev,
          appointmentDate: new Date().toISOString().split("T")[0]
        }));
      }
      return;
    }

    const loadDates = async () => {
      try {
        const data = await getDoctorAvailableDates(Number(form.doctorId));
        setAvailableDates(data.availableDates);
        if (data.availableDates.length > 0) {
          setForm((prev) => ({
            ...prev,
            appointmentDate: data.availableDates[0]
          }));
        }
      } catch (err) {
        console.error("Failed to load doctor dates", err);
        setAvailableDates([]);
      }
    };
    loadDates();
  }, [form.doctorId, visitMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVisitModeChange = (mode: "doctor" | "clinic") => {
    setVisitMode(mode);
    if (mode === "clinic") {
      setForm((prev) => ({
        ...prev,
        doctorId: "",
        appointmentType: "Medication Collection",
        appointmentDate: new Date().toISOString().split("T")[0]
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        appointmentType: "Routine Checkup",
        appointmentDate: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createAppointment({
        patientId: Number(form.patientId),
        doctorId: visitMode === "doctor" && form.doctorId ? Number(form.doctorId) : null,
        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        endTime: form.endTime,
        appointmentType: form.appointmentType,
        reason: form.reason,
        priority: form.priority,
        notes: form.notes
      });
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
        <div className="col-6">
          <div className="glass-panel">
            <div className="section-header">
              <i className="fi fi-rr-calendar section-icon"></i>
              <h3 className="section-title">Booking Details</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Visit Type</label>
                <div className="action-buttons">
                  <button
                    type="button"
                    className={`btn btn-sm ${visitMode === "doctor" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handleVisitModeChange("doctor")}
                  >
                    Doctor Visit
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${visitMode === "clinic" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handleVisitModeChange("clinic")}
                  >
                    Clinic Visit (No Doctor)
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="patientId">Patient</label>
                <select
                  id="patientId"
                  className="form-input"
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.patientRef} — {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {visitMode === "doctor" ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="doctorId">Doctor</label>
                  <select
                    id="doctorId"
                    className="form-input"
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                  {doctors.length === 0 && (
                    <p className="text-secondary text-sm mt-2">No doctors found. Add doctor staff availability first.</p>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="appointmentTypeClinic">Clinic Service</label>
                  <select
                    id="appointmentTypeClinic"
                    className="form-input"
                    name="appointmentType"
                    value={form.appointmentType}
                    onChange={handleChange}
                    required
                  >
                    {CLINIC_ONLY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="appointmentDate">Appointment Date</label>
                {visitMode === "doctor" && availableDates.length > 0 ? (
                  <select
                    id="appointmentDate"
                    className="form-input"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    required
                  >
                    {availableDates.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="appointmentDate"
                    type="date"
                    className="form-input"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                )}
                {visitMode === "doctor" && form.doctorId && availableDates.length === 0 && (
                  <p className="text-secondary text-sm mt-2">This doctor has no scheduled days. Pick a date manually or choose another doctor.</p>
                )}
              </div>

              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">Start Time</label>
                    <input id="startTime" type="time" className="form-input" name="startTime" value={form.startTime} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="endTime">End Time</label>
                    <input id="endTime" type="time" className="form-input" name="endTime" value={form.endTime} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {visitMode === "doctor" && (
                <div className="form-group">
                  <label className="form-label" htmlFor="appointmentType">Appointment Type</label>
                  <select id="appointmentType" className="form-input" name="appointmentType" value={form.appointmentType} onChange={handleChange}>
                    <option value="Routine Checkup">Routine Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Specialist Consultation">Specialist Consultation</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="reason">Reason for Visit</label>
                <textarea id="reason" className="form-input" name="reason" placeholder="Brief reason for the appointment..." rows={2} value={form.reason} onChange={handleChange} />
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

        <div className="col-6">
          <div className="glass-panel policy-panel">
            <div className="section-header">
              <i className="fi fi-rr-shield-check section-icon-secondary"></i>
              <h3 className="section-title text-secondary">Booking Policy</h3>
            </div>
            <ul className="policy-list">
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>Doctor visits only book on days that doctor is scheduled (from staff availability).</span>
              </li>
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>Clinic visits (medication collection, nurse checkup) do not require a doctor.</span>
              </li>
              <li>
                <i className="fi fi-rr-exclamation policy-icon-warning"></i>
                <span>System prevents overlapping bookings for the same doctor and time slot.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
