import { useState } from "react";
import { createMedicalRecord } from "../../services/medicalRecordService";
import { useParams, useNavigate } from "react-router-dom";

export default function MedicalRecords() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: patientId || "",
    doctorId: "1", // Should be from auth context
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    diagnosisCode: "",
    prescription: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
    weight: "",
    height: "",
    followUpDate: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createMedicalRecord(form);
      alert(`Visit Saved: ${result.visitReference}`);
      navigate(`/patients`);
    } catch {
      alert("Failed to save medical record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>SOAP Clinical Consultation</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-8">
            <div className="glass-panel">
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>SOAP Notes</h3>
              
              <div className="form-group">
                <label className="form-label">Subjective (Symptoms & Complaints)</label>
                <textarea
                  className="form-input"
                  name="subjective"
                  placeholder="Patient's subjective description of symptoms..."
                  rows={3}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Objective (Clinical Observations)</label>
                <textarea
                  className="form-input"
                  name="objective"
                  placeholder="Doctor's objective observations..."
                  rows={3}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assessment (Diagnosis)</label>
                <textarea
                  className="form-input"
                  name="assessment"
                  placeholder="Diagnosis and clinical assessment..."
                  rows={3}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Plan (Treatment & Prescription)</label>
                <textarea
                  className="form-input"
                  name="plan"
                  placeholder="Treatment plan, follow-up, and prescription..."
                  rows={3}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="glass-panel" style={{ height: '100%' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Vitals & Measurements</h3>
              
              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">BP (mmHg)</label>
                    <input className="form-input" name="bloodPressure" placeholder="120/80" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">HR (bpm)</label>
                    <input className="form-input" name="heartRate" placeholder="72" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Temp (°C)</label>
                    <input className="form-input" name="temperature" placeholder="36.5" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">SpO2 (%)</label>
                    <input className="form-input" name="oxygenLevel" placeholder="98" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6" style={{ paddingLeft: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input className="form-input" name="weight" placeholder="70" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6" style={{ paddingRight: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input className="form-input" name="height" placeholder="175" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis Code (ICD-10)</label>
                <input className="form-input" name="diagnosisCode" placeholder="e.g. J00" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Follow-up Date</label>
                <input type="date" className="form-input" name="followUpDate" onChange={handleChange} />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Consultation"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
