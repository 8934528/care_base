import { useState } from "react";
import { searchPatients } from "../../services/patientService";
import { addToQueue } from "../../services/queueService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Patient {
  id: number;
  patientRef: string;
  firstName: string;
  lastName: string;
  idNumber: string;
}

export default function PatientSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await searchPatients(keyword);
      setResults(data);
    } catch (err: unknown) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = async (patient: Patient) => {
    try {
      await addToQueue({
        patientId: patient.id,
        patientRef: patient.patientRef,
        priority: "Normal"
      });
      alert("Added to queue successfully");
      navigate("/queue");
    } catch (err: unknown) {
      alert("Failed to add to queue");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-search"></i> Search Patients</h1>
        <button className="btn btn-primary" onClick={() => navigate("/patients/register")}>
          <i className="fi fi-rr-user-add"></i>
          <span>New Patient</span>
        </button>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSearch} className="row align-center">
          <div className="col-10">
            <div className="input-with-icon">
              <i className="fi fi-rr-search input-icon"></i>
              <input
                className="form-input has-icon"
                placeholder="Search by name, ID, or reference"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-2">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel no-padding overflow-x">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient Ref</th>
              <th>Full Name</th>
              <th>ID Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-12">
                  <div className="empty-state">
                    <i className="fi fi-rr-user empty-state-icon"></i>
                    <p>{loading ? "Searching..." : "Enter a keyword to search patients"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              results.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-semibold text-primary">{p.patientRef}</td>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.idNumber}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleAddToQueue(p)}
                      >
                        <i className="fi fi-rr-list-check"></i>
                        <span>Queue</span>
                      </button>
                      {(user?.role === "Admin" || user?.role === "Doctor") && (
                        <Link to={`/records/${p.id}`} className="btn btn-secondary btn-sm" style={{ backgroundColor: "var(--secondary)", color: "white" }}>
                          <i className="fi fi-rr-file-medical"></i>
                          <span>Records</span>
                        </Link>
                      )}
                      {(user?.role === "Admin" || user?.role === "Doctor" || user?.role === "Nurse") && (
                        <Link to={`/notes/${p.id}`} className="btn btn-ghost btn-sm">
                          <i className="fi fi-rr-comment-medical"></i>
                          <span>Notes</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
