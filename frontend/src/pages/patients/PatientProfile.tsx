import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientByRef } from "../../services/patientService";
import { addToQueue } from "../../services/queueService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Patient } from "../../types";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  LoadingSpinner,
  EmptyState
} from "../../components/common";

export default function PatientProfile() {
  const { patientRef } = useParams<{ patientRef: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);

  const fetchPatient = useCallback(async () => {
    if (!patientRef) return;
    setLoading(true);
    try {
      const data = await getPatientByRef(patientRef);
      setPatient(data);
    } catch {
      showToast("Unable to load patient profile.", "danger");
    } finally {
      setLoading(false);
    }
  }, [patientRef, showToast]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleQueue = async () => {
    if (!patient) return;
    setQueueLoading(true);
    try {
      await addToQueue({
        patientId: patient.id,
        patientRef: patient.patientRef,
        priority: "Normal"
      });
      showToast(`Patient ${patient.patientRef} checked in to queue.`, "success");
      navigate("/queue");
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      showToast(errObj.response?.data?.message || "Patient could not be added to queue.", "danger");
    } finally {
      setQueueLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading patient profile..." />;
  if (!patient) {
    return (
      <EmptyState
        icon="bi-person-x"
        title="Patient not found"
        message={`No active patient record matches reference "${patientRef}".`}
        action={
          <Button variant="outline" onClick={() => navigate("/patients")}>
            Back to Patient Directory
          </Button>
        }
      />
    );
  }

  const birthDate = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;
  const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null;

  const canViewClinical = user?.role === "Doctor" || user?.role === "Nurse" || user?.role === "Admin" || user?.role === "Manager";

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        subtitle={`CareBase Patient Identifier: ${patient.patientRef}`}
        badge={<Badge status="Registered" variant="active" />}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" icon="bi-arrow-left" onClick={() => navigate("/patients")}>
              Back
            </Button>
            <Button
              variant="primary"
              icon="bi-list-check"
              onClick={handleQueue}
              loading={queueLoading}
            >
              Check-in to queue
            </Button>
            {canViewClinical && (
              <Button
                variant="outline"
                icon="bi-journal-medical"
                onClick={() => navigate(`/records/${patient.id}`)}
              >
                Clinical records
              </Button>
            )}
            {(user?.role === "Doctor" || user?.role === "Nurse") && (
              <Button
                variant="outline"
                icon="bi-clipboard2-pulse"
                onClick={() => navigate(`/notes/${patient.id}`)}
              >
                Clinical notes
              </Button>
            )}
          </div>
        }
      />

      <div className="row g-3">
        {/* Patient Identity & Demographics */}
        <div className="col-12 col-lg-4">
          <Card title="Demographics" className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="cb-avatar cb-avatar-lg me-3">
                {patient.firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="m-0">{patient.firstName} {patient.lastName}</h5>
                <code className="cb-code-pill mt-1 d-inline-block">{patient.patientRef}</code>
              </div>
            </div>

            <div className="cb-profile-field-list">
              <div className="cb-profile-field">
                <span className="text-muted small">National ID Number</span>
                <span className="fw-semibold">{patient.idNumber}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Gender</span>
                <span>{patient.gender}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Age</span>
                <span>{age !== null ? `${age} years` : 'Unspecified'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Date of Birth</span>
                <span>{birthDate ? birthDate.toLocaleDateString() : 'Unspecified'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Registered Since</span>
                <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card title="Emergency Contact" className="mb-3">
            <div className="cb-profile-field-list">
              <div className="cb-profile-field">
                <span className="text-muted small">Contact Person</span>
                <span className="fw-semibold">{patient.emergencyContactName || 'None listed'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Contact Phone</span>
                <span>{patient.emergencyContactPhone || 'None listed'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact & Medical History */}
        <div className="col-12 col-lg-8">
          <Card title="Contact & Residence Information" className="mb-3">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block mb-1">Phone Number</span>
                <div className="fw-semibold">
                  <i className="bi bi-telephone me-2 text-muted"></i>
                  {patient.phone || 'Not provided'}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block mb-1">Email Address</span>
                <div className="fw-semibold">
                  <i className="bi bi-envelope me-2 text-muted"></i>
                  {patient.email || 'Not provided'}
                </div>
              </div>
              <div className="col-12">
                <span className="text-muted small d-block mb-1">Residential Address</span>
                <div className="p-2 border rounded bg-light small">
                  <i className="bi bi-geo-alt me-2 text-muted"></i>
                  {patient.address || 'No residential address on record.'}
                </div>
              </div>
            </div>
          </Card>

          {/* Medical History */}
          <Card title="Medical Background & Allergies">
            {patient.medicalHistory ? (
              <div className="p-3 border rounded bg-light">
                <p className="m-0 small" style={{ whiteSpace: 'pre-line' }}>
                  {patient.medicalHistory}
                </p>
              </div>
            ) : (
              <p className="text-muted m-0 py-2 small">
                No past medical conditions, known allergies, or surgical histories documented.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
