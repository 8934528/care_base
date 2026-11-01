import React, { useState, useEffect } from "react";
import { createAppointment } from "../../services/appointmentService";
import { searchPatients } from "../../services/patientService";
import { getDoctors, getDoctorAvailableDates } from "../../services/staffService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Card, Button, PageHeader } from "../../components/common";

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
  const { showToast } = useToast();

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
      } catch {
        showToast("Unable to load scheduler data.", "danger");
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (visitMode !== "doctor" || !form.doctorId) {
      return;
    }

    let isMounted = true;
    const loadDates = async () => {
      try {
        const data = await getDoctorAvailableDates(Number(form.doctorId));
        if (!isMounted) return;
        setAvailableDates(data.availableDates);
        if (data.availableDates.length > 0) {
          setForm((prev) => ({
            ...prev,
            appointmentDate: data.availableDates[0]
          }));
        }
      } catch {
        if (isMounted) setAvailableDates([]);
      }
    };
    loadDates();

    return () => {
      isMounted = false;
    };
  }, [form.doctorId, visitMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "doctorId" && !value) {
      setAvailableDates([]);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisitModeChange = (mode: "doctor" | "clinic") => {
    setVisitMode(mode);
    setAvailableDates([]);
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
    if (!form.patientId) {
      showToast("Please select a patient.", "warning");
      return;
    }
    if (!form.appointmentDate) {
      showToast("Please select an appointment date.", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await createAppointment({
        patientId: Number(form.patientId),
        doctorId: visitMode === "doctor" && form.doctorId ? Number(form.doctorId) : null,
        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        endTime: form.endTime,
        appointmentType: form.appointmentType,
        reason: form.reason || "Consultation",
        priority: form.priority,
        notes: form.notes
      });
      showToast(`Appointment booked (${result.appointmentRef}).`, "success");
      navigate("/appointments/daily");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || "Appointment conflict detected or doctor unavailable.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Schedule Appointment"
        subtitle="Book patient consultations with verified clinician availability and conflict checks"
        actions={
          <Button variant="outline" icon="bi-calendar-week" onClick={() => navigate("/appointments/daily")}>
            Daily appointments
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <Card title="Appointment Type & Clinician" className="mb-3">
              <div className="mb-3">
                <label className="form-label d-block">Consultation Mode</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${visitMode === "doctor" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => handleVisitModeChange("doctor")}
                  >
                    <i className="bi bi-person-video me-1"></i> Doctor Consultation
                  </button>
                  <button
                    type="button"
                    className={`btn ${visitMode === "clinic" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => handleVisitModeChange("clinic")}
                  >
                    <i className="bi bi-hospital me-1"></i> Clinic / Nurse Visit
                  </button>
                </div>
              </div>

              {visitMode === "doctor" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="doctorId">Assigned Doctor *</label>
                    <select
                      id="doctorId"
                      name="doctorId"
                      className="form-select cb-form-select"
                      value={form.doctorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Doctor</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="appointmentDate">Available Date *</label>
                    {availableDates.length > 0 ? (
                      <select
                        id="appointmentDate"
                        name="appointmentDate"
                        className="form-select cb-form-select"
                        value={form.appointmentDate}
                        onChange={handleChange}
                        required
                      >
                        {availableDates.map((d) => (
                          <option key={d} value={d}>
                            {new Date(d).toLocaleDateString(undefined, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="date"
                        className="form-control cb-form-control"
                        value={form.appointmentDate}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  <label className="form-label" htmlFor="clinicDate">Visit Date *</label>
                  <input
                    id="clinicDate"
                    name="appointmentDate"
                    type="date"
                    className="form-control cb-form-control"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label" htmlFor="startTime">Start Time</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    className="form-control cb-form-control"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" htmlFor="endTime">End Time</label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    className="form-control cb-form-control"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 col-lg-6">
            <Card title="Patient & Reason for Visit" className="mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="patientId">Patient Record *</label>
                <select
                  id="patientId"
                  name="patientId"
                  className="form-select cb-form-select"
                  value={form.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientRef})
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label" htmlFor="appointmentType">Appointment Type</label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    className="form-select cb-form-select"
                    value={form.appointmentType}
                    onChange={handleChange}
                  >
                    {visitMode === "clinic" ? (
                      CLINIC_ONLY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))
                    ) : (
                      <>
                        <option value="Routine Checkup">Routine Checkup</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Urgent Consultation">Urgent Consultation</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label" htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select cb-form-select"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Priority">Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="reason">Clinical Reason for Visit</label>
                <input
                  id="reason"
                  name="reason"
                  type="text"
                  className="form-control cb-form-control"
                  placeholder="e.g. Hypertension review, persistent cough"
                  value={form.reason}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="notes">Administrative Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  className="form-control cb-form-control"
                  placeholder="Special instructions or accommodations..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </Card>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="ghost" type="button" onClick={() => navigate("/appointments/daily")}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading} icon="bi-calendar-check">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
