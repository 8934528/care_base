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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createMedicalRecord(form);
      alert(`Visit Saved: ${result.visitReference}`);
      navigate(`/patients`);
    } catch (err: unknown) {
      alert("Failed to save medical record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>SOAP Clinical Consultation</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="row">
          <div className="col-8">
            <div className="glass-panel">
              <div className="section-header">
                <i className="fi fi-rr-document-signed section-icon"></i>
                <h3 className="section-title">SOAP Notes</h3>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="subjective">Subjective (Symptoms & Complaints)</label>
                <textarea
                  id="subjective"
                  className="form-input"
                  name="subjective"
                  placeholder="Patient's subjective description of symptoms..."
                  rows={3}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="objective">Objective (Clinical Observations)</label>
                <textarea
                  id="objective"
                  className="form-input"
                  name="objective"
                  placeholder="Doctor's objective observations..."
                  rows={3}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="assessment">Assessment (Diagnosis)</label>
                <textarea
                  id="assessment"
                  className="form-input"
                  name="assessment"
                  placeholder="Diagnosis and clinical assessment..."
                  rows={3}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plan">Plan (Treatment & Prescription)</label>
                <textarea
                  id="plan"
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
            <div className="glass-panel h-full">
              <div className="section-header">
                <i className="fi fi-rr-heart-rate section-icon-secondary"></i>
                <h3 className="section-title text-secondary">Vitals & Measurements</h3>
              </div>
              
              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bloodPressure">BP (mmHg)</label>
                    <input id="bloodPressure" className="form-input" name="bloodPressure" placeholder="120/80" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="heartRate">HR (bpm)</label>
                    <input id="heartRate" className="form-input" name="heartRate" placeholder="72" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="temperature">Temp (°C)</label>
                    <input id="temperature" className="form-input" name="temperature" placeholder="36.5" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="oxygenLevel">SpO2 (%)</label>
                    <input id="oxygenLevel" className="form-input" name="oxygenLevel" placeholder="98" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6 no-padding-left">
                  <div className="form-group">
                    <label className="form-label" htmlFor="weight">Weight (kg)</label>
                    <input id="weight" className="form-input" name="weight" placeholder="70" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6 no-padding-right">
                  <div className="form-group">
                    <label className="form-label" htmlFor="height">Height (cm)</label>
                    <input id="height" className="form-input" name="height" placeholder="175" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="diagnosisCode">Diagnosis Code (ICD-10)</label>
                <input id="diagnosisCode" className="form-input" name="diagnosisCode" placeholder="e.g. J00" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="followUpDate">Follow-up Date</label>
                <input id="followUpDate" type="date" className="form-input" name="followUpDate" onChange={handleChange} aria-label="Follow-up date" />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-4"
                disabled={loading}
              >
                <i className="fi fi-rr-disk"></i>
                <span>{loading ? "Saving..." : "Complete Consultation"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
