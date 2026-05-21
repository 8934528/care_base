import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPatientByRef } from "../../services/patientService";
import { addToQueue } from "../../services/queueService";
import { useAuth } from "../../context/AuthContext";

interface PatientDetails {
  id: number;
  patientRef: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
}

export default function PatientProfile() {
  const { patientRef } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!patientRef) return;
        const data = await getPatientByRef(patientRef);
        setPatient(data);
      } catch (err) {
        console.error("Failed to fetch patient", err);
        setError("Patient not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientRef]);

  const handleQueue = async () => {
    if (!patient) return;
    try {
      await addToQueue({
        patientId: patient.id,
        patientRef: patient.patientRef,
        priority: "Normal"
      });
      alert("Patient added to queue successfully.");
      navigate("/queue");
    } catch (err) {
      console.error(err);
      alert("Failed to add patient to queue.");
    }
  };

  if (loading) {
    return (
      <div className="flex-center-col animate-fade-in">
        <i className="fi fi-rr-refresh animate-spin loading-icon" style={{ fontSize: "3rem" }}></i>
        <h3 className="mt-4 text-secondary">Loading Patient Profile...</h3>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-center-col animate-fade-in">
        <i className="fi fi-rr-user-injured text-error" style={{ fontSize: "4rem" }}></i>
        <h2 className="mt-4 text-primary">Patient Not Found</h2>
        <p className="text-secondary">{error}</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/patients")}>
          Back to Patient Search
        </button>
      </div>
    );
  }

  // Calculate Age
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="animate-fade-in">
      <div className="page-header flex-between align-center">
        <div>
          <h1><i className="fi fi-rr-id-badge"></i> Patient Profile</h1>
          <p className="text-secondary mt-1">Viewing comprehensive details for {patient.patientRef}</p>
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleQueue}>
            <i className="fi fi-rr-list-check"></i>
            <span>Add to Queue</span>
          </button>
          {(user?.role === "Admin" || user?.role === "Doctor") && (
            <Link to={`/records/${patient.id}`} className="btn btn-secondary" style={{ backgroundColor: "var(--secondary)", color: "white" }}>
              <i className="fi fi-rr-file-medical"></i>
              <span>Medical Records</span>
            </Link>
          )}
          {(user?.role === "Admin" || user?.role === "Doctor" || user?.role === "Nurse") && (
            <Link to={`/notes/${patient.id}`} className="btn btn-ghost" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }}>
              <i className="fi fi-rr-comment-medical"></i>
              <span>CareBase Notes</span>
            </Link>
          )}
        </div>
      </div>

      <div className="row mt-8">
        <div className="col-6">
          <div className="glass-panel text-center mb-4">
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", margin: "0 auto 1.5rem" }}>
              <i className="fi fi-rr-user"></i>
            </div>
            <h2 className="mb-2">{patient.firstName} {patient.lastName}</h2>
            <div className="status-badge priority-normal mb-3" style={{ fontSize: "1rem", padding: "0.4rem 1rem" }}>
              {patient.patientRef}
            </div>
            <div className="text-secondary text-sm mb-4">
              <i className="fi fi-rr-id-badge"></i> ID: {patient.idNumber}
            </div>
            
            <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
            
            <div className="stats-grid-2 text-left">
              <div>
                <span className="text-xs text-secondary uppercase font-semibold">Age</span>
                <p className="font-bold">{age} yrs</p>
              </div>
              <div>
                <span className="text-xs text-secondary uppercase font-semibold">Gender</span>
                <p className="font-bold">{patient.gender}</p>
              </div>
              <div>
                <span className="text-xs text-secondary uppercase font-semibold">DOB</span>
                <p className="font-bold">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ backgroundColor: "rgba(239, 68, 68, 0.03)" }}>
            <div className="section-header-compact">
              <i className="fi fi-rr-siren section-icon-warning text-error"></i>
              <h3 className="section-title text-error" style={{ fontSize: "1rem" }}>Emergency Contact</h3>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-1">{patient.emergencyContactName}</p>
              <p className="text-secondary">
                <i className="fi fi-rr-phone-call mr-2"></i>
                {patient.emergencyContactPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card h-full">
            <div className="section-header">
              <i className="fi fi-rr-document section-icon"></i>
              <h3 className="section-title">General Information</h3>
            </div>
            
            <div className="row mt-6">
              <div className="col-6 mb-4">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="text-primary font-semibold">
                    <i className="fi fi-rr-envelope mr-2"></i>
                    {patient.email || "Not Provided"}
                  </div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="font-semibold">
                    <i className="fi fi-rr-phone-flip mr-2"></i>
                    {patient.phone || "Not Provided"}
                  </div>
                </div>
              </div>
              
              <div className="col-12 mb-4">
                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <div className="glass-panel no-padding p-4 mt-2">
                    <i className="fi fi-rr-map-marker-home mr-2 text-primary"></i>
                    {patient.address || "No address on file."}
                  </div>
                </div>
              </div>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "2rem 0" }} />

            <div className="section-header">
              <i className="fi fi-rr-heart-rate section-icon-secondary"></i>
              <h3 className="section-title text-secondary">Medical History</h3>
            </div>
            
            <div className="glass-panel no-padding p-4 mt-4" style={{ backgroundColor: "rgba(16, 185, 129, 0.05)", borderLeft: "4px solid var(--secondary)" }}>
              <p style={{ lineHeight: "1.6" }}>
                {patient.medicalHistory || "No significant medical history reported."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}