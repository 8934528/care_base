import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createMedicalRecord,
  getPatientHistory,
  amendMedicalRecord
} from "../../services/medicalRecordService";
import { getPatientById } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { MedicalRecord, Patient } from "../../types";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  Modal,
  LoadingSpinner
} from "../../components/common";

export default function MedicalRecords() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    diagnosisCode: "",
    prescription: "",
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "36.8",
    oxygenLevel: "98",
    weight: "",
    height: "",
    followUpDate: ""
  });

  // Amendment modal state
  const [amendModal, setAmendModal] = useState<{
    isOpen: boolean;
    recordId: number;
    reason: string;
  }>({ isOpen: false, recordId: 0, reason: "" });

  const loadData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [pat, hist] = await Promise.all([
        getPatientById(Number(patientId)),
        getPatientHistory(Number(patientId))
      ]);
      setPatient(pat);
      setHistory(hist);
    } catch {
      showToast("Unable to load patient clinical history.", "danger");
    } finally {
      setLoading(false);
    }
  }, [patientId, showToast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjective || !form.assessment || !form.plan) {
      showToast("Please complete the Subjective, Assessment, and Plan fields.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientId: Number(patientId),
        doctorId: user?.userId || 0,
        ...form,
        followUpDate: form.followUpDate ? form.followUpDate : null
      };

      const result = await createMedicalRecord(payload);
      showToast(`Clinical consultation finalised (${result.visitReference}).`, "success");
      loadData();
      // Reset form
      setForm({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        diagnosisCode: "",
        prescription: "",
        bloodPressure: "120/80",
        heartRate: "72",
        temperature: "36.8",
        oxygenLevel: "98",
        weight: "",
        height: "",
        followUpDate: ""
      });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      showToast(errObj.response?.data?.message || "Failed to save medical record.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmendSubmit = async () => {
    if (!amendModal.reason) {
      showToast("A valid clinical justification is required for amendments.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientId: Number(patientId),
        doctorId: user?.userId || 0,
        ...form,
        followUpDate: form.followUpDate ? form.followUpDate : null
      };

      await amendMedicalRecord(amendModal.recordId, payload, amendModal.reason);
      showToast("Clinical record amended and audit trail updated.", "success");
      setAmendModal({ isOpen: false, recordId: 0, reason: "" });
      loadData();
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      showToast(errObj.response?.data?.message || "Failed to amend record.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const populateForAmendment = (rec: MedicalRecord) => {
    setForm({
      subjective: rec.subjective,
      objective: rec.objective,
      assessment: rec.assessment,
      plan: rec.plan,
      diagnosisCode: rec.diagnosisCode || "",
      prescription: rec.prescription || "",
      bloodPressure: rec.bloodPressure || "",
      heartRate: rec.heartRate || "",
      temperature: rec.temperature || "",
      oxygenLevel: rec.oxygenLevel || "",
      weight: rec.weight || "",
      height: rec.height || "",
      followUpDate: rec.followUpDate ? rec.followUpDate.split("T")[0] : ""
    });
    setAmendModal({ isOpen: true, recordId: rec.id, reason: "" });
  };

  if (loading) return <LoadingSpinner message="Loading clinical record system..." />;

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Clinical Consultation (SOAP)"
        subtitle={
          patient
            ? `Patient: ${patient.firstName} ${patient.lastName} (${patient.patientRef}) • ID: ${patient.idNumber}`
            : "Patient Clinical Consultation"
        }
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" icon="bi-arrow-left" onClick={() => navigate("/patients")}>
              Back
            </Button>
            {patient && (
              <Button
                variant="outline"
                icon="bi-person-badge"
                onClick={() => navigate(`/patients/profile/${patient.patientRef}`)}
              >
                Patient profile
              </Button>
            )}
          </div>
        }
      />

      <div className="row g-3">
        {/* Active SOAP Entry Form */}
        <div className="col-12 col-lg-7">
          <Card title="New Consultation Record" className="mb-3">
            <form onSubmit={handleSubmit}>
              {/* Vital Signs Row */}
              <div className="p-3 mb-3 border rounded bg-light">
                <span className="fw-semibold small d-block mb-2">Vital Signs Assessment</span>
                <div className="row g-2">
                  <div className="col-6 col-sm-3">
                    <label className="form-label small" htmlFor="bp">Blood Pressure</label>
                    <input
                      id="bp"
                      name="bloodPressure"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 120/80"
                      value={form.bloodPressure}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 col-sm-3">
                    <label className="form-label small" htmlFor="hr">Heart Rate (bpm)</label>
                    <input
                      id="hr"
                      name="heartRate"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 72"
                      value={form.heartRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 col-sm-3">
                    <label className="form-label small" htmlFor="temp">Temp (°C)</label>
                    <input
                      id="temp"
                      name="temperature"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 36.8"
                      value={form.temperature}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 col-sm-3">
                    <label className="form-label small" htmlFor="spo2">Oxygen (SpO2 %)</label>
                    <input
                      id="spo2"
                      name="oxygenLevel"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 98"
                      value={form.oxygenLevel}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 col-sm-6 mt-2">
                    <label className="form-label small" htmlFor="weight">Weight (kg)</label>
                    <input
                      id="weight"
                      name="weight"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 70"
                      value={form.weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 col-sm-6 mt-2">
                    <label className="form-label small" htmlFor="height">Height (cm)</label>
                    <input
                      id="height"
                      name="height"
                      type="text"
                      className="form-control form-control-sm cb-form-control"
                      placeholder="e.g. 175"
                      value={form.height}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* SOAP Textareas */}
              <div className="mb-3">
                <label className="form-label" htmlFor="subjective">Subjective (Chief Complaint & Symptoms) *</label>
                <textarea
                  id="subjective"
                  name="subjective"
                  rows={2}
                  className="form-control cb-form-control"
                  placeholder="Patient's report of symptoms, onset, and duration..."
                  value={form.subjective}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="objective">Objective (Physical Examination & Observations)</label>
                <textarea
                  id="objective"
                  name="objective"
                  rows={2}
                  className="form-control cb-form-control"
                  placeholder="Clinical findings, chest sounds, palpation, visual signs..."
                  value={form.objective}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-8">
                  <label className="form-label" htmlFor="assessment">Assessment (Diagnosis & Clinical Impression) *</label>
                  <textarea
                    id="assessment"
                    name="assessment"
                    rows={2}
                    className="form-control cb-form-control"
                    placeholder="Diagnosis or clinical impression..."
                    value={form.assessment}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="diagnosisCode">ICD-10 / Code</label>
                  <input
                    id="diagnosisCode"
                    name="diagnosisCode"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="e.g. I10"
                    value={form.diagnosisCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="plan">Plan (Intervention, Advice & Management) *</label>
                <textarea
                  id="plan"
                  name="plan"
                  rows={2}
                  className="form-control cb-form-control"
                  placeholder="Patient management plan, tests ordered, lifestyle advice..."
                  value={form.plan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-8">
                  <label className="form-label" htmlFor="prescription">Prescription & Dosage</label>
                  <input
                    id="prescription"
                    name="prescription"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="e.g. Amoxicillin 500mg TDS x 5/7"
                    value={form.prescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="followUpDate">Follow-up Date</label>
                  <input
                    id="followUpDate"
                    name="followUpDate"
                    type="date"
                    className="form-control cb-form-control"
                    value={form.followUpDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2">
                <Button variant="primary" type="submit" loading={submitting} icon="bi-check2-circle">
                  Finalise Consultation
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Prior Consultation History Panel */}
        <div className="col-12 col-lg-5">
          <Card title="Past Clinical Records" subtitle={`${history.length} documented visits`}>
            {history.length === 0 ? (
              <p className="text-muted m-0 py-3">No previous clinical records for this patient.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {history.map((rec) => (
                  <div key={rec.id} className="p-3 border rounded bg-white">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <code className="cb-code-pill">{rec.visitReference}</code>
                        <span className="small text-muted">
                          {new Date(rec.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <Badge status={rec.status || "Finalised"} />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="bi-pencil-square"
                          onClick={() => populateForAmendment(rec)}
                        >
                          Amend
                        </Button>
                      </div>
                    </div>

                    <div className="small mb-1">
                      <strong>Assessment:</strong> {rec.assessment}
                    </div>
                    <div className="small text-muted mb-2">
                      <strong>Plan:</strong> {rec.plan}
                    </div>

                    <div className="d-flex flex-wrap gap-2 small text-muted p-2 rounded bg-light mb-2">
                      <span>BP: {rec.bloodPressure || "-"}</span>
                      <span>HR: {rec.heartRate || "-"} bpm</span>
                      <span>Temp: {rec.temperature || "-"}°C</span>
                      <span>SpO2: {rec.oxygenLevel || "-"}%</span>
                    </div>

                    {rec.prescription && (
                      <div className="small text-dark p-2 rounded border bg-light">
                        <i className="bi bi-capsule me-1 text-primary"></i>
                        <strong>Rx:</strong> {rec.prescription}
                      </div>
                    )}

                    {rec.amendedReason && (
                      <div className="small text-danger mt-2 border-top pt-1">
                        <i className="bi bi-info-circle me-1"></i>
                        <em>Amended: {rec.amendedReason}</em>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Record Amendment Justification Modal */}
      <Modal
        isOpen={amendModal.isOpen}
        onClose={() => setAmendModal({ isOpen: false, recordId: 0, reason: "" })}
        title="Amend Medical Record"
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setAmendModal({ isOpen: false, recordId: 0, reason: "" })}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleAmendSubmit} loading={submitting}>
              Save amendment
            </Button>
          </>
        }
      >
        <p className="small text-muted mb-3">
          Healthcare regulatory standards require an explicit clinical reason whenever a finalized medical record is amended. The previous record will be preserved in the audit history.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="amend-reason">Clinical Justification Reason *</label>
          <textarea
            id="amend-reason"
            rows={3}
            className="form-control cb-form-control"
            placeholder="e.g. Corrected dosage; updated vital readings per laboratory report..."
            value={amendModal.reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAmendModal({ ...amendModal, reason: e.target.value })}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
