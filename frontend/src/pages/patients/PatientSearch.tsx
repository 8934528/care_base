import React, { useState, useEffect, useCallback } from "react";
import { searchPatients } from "../../services/patientService";
import { addToQueue } from "../../services/queueService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Patient } from "../../types";
import {
  Card,
  Button,
  IconButton,
  PageHeader,
  LoadingSpinner,
  EmptyState
} from "../../components/common";

export default function PatientSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const loadPatients = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await searchPatients(query);
      setResults(Array.isArray(data) ? data : []);
    } catch {
      showToast("Unable to fetch patient records.", "danger");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPatients("");
  }, [loadPatients]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPatients(keyword);
  };

  const handleAddToQueue = async (patient: Patient) => {
    try {
      await addToQueue({
        patientId: patient.id,
        patientRef: patient.patientRef,
        priority: "Normal"
      });
      showToast(`Added ${patient.patientRef} to today's queue.`, "success");
      navigate("/queue");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast(axiosErr.response?.data?.message || "Failed to add to queue.", "danger");
    }
  };

  const canRegister = user?.role === "Admin" || user?.role === "Manager" || user?.role === "Clerk" || user?.role === "Nurse";

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Patient Directory"
        subtitle="Search and manage facility patient records and profiles"
        actions={
          canRegister ? (
            <Button
              variant="primary"
              icon="bi-person-plus"
              onClick={() => navigate("/patients/register")}
            >
              New patient
            </Button>
          ) : undefined
        }
      />

      <Card className="mb-4">
        <form onSubmit={handleSearch} className="row g-2 align-items-center">
          <div className="col-12 col-md-10">
            <div className="cb-search-input-group">
              <i className="bi bi-search cb-search-icon"></i>
              <input
                type="text"
                className="form-control cb-form-control"
                placeholder="Search by first name, last name, national ID, or patient reference..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  className="cb-search-clear"
                  onClick={() => {
                    setKeyword("");
                    loadPatients("");
                  }}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-2">
            <Button variant="secondary" type="submit" className="w-100" icon="bi-search">
              Search
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner message="Searching patient database..." />
        ) : results.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title="No patients found"
            message={keyword ? `No patient records match "${keyword}".` : "No patient records registered."}
            action={
              canRegister ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon="bi-person-plus"
                  onClick={() => navigate("/patients/register")}
                >
                  Register new patient
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="table cb-table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col">Patient Reference</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">National ID Number</th>
                  <th scope="col">Phone Contact</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <code className="cb-code-pill">{p.patientRef}</code>
                    </td>
                    <td className="fw-semibold">
                      {p.firstName} {p.lastName}
                    </td>
                    <td>{p.idNumber}</td>
                    <td>{p.phone || <span className="text-muted">N/A</span>}</td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <IconButton
                          icon="bi-eye"
                          label="View Profile"
                          tooltip="View patient profile"
                          onClick={() => navigate(`/patients/profile/${p.patientRef}`)}
                        />
                        <IconButton
                          icon="bi-list-check"
                          label="Add to Queue"
                          tooltip="Add patient to queue"
                          variant="primary"
                          onClick={() => handleAddToQueue(p)}
                        />
                        {(user?.role === "Doctor" || user?.role === "Admin") && (
                          <IconButton
                            icon="bi-journal-medical"
                            label="Medical Records"
                            tooltip="Clinical history"
                            onClick={() => navigate(`/records/${p.id}`)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
