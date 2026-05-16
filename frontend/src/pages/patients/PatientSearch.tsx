import { useState } from "react";
import { searchPatients } from "../../services/patientService";
import { addToQueue } from "../../services/queueService";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, ListOrdered, User } from "lucide-react";

export default function PatientSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await searchPatients(keyword);
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = async (patient: any) => {
    try {
      await addToQueue({
        patientId: patient.id,
        patientRef: patient.patientRef,
        priority: "Normal"
      });
      alert("Added to queue successfully");
      navigate("/queue");
    } catch (err) {
      alert("Failed to add to queue");
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Search Patients</h1>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate("/patients/register")}>
          <UserPlus size={18} strokeWidth={1.5} />
          New Patient
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} className="row">
          <div className="col-10">
            <div style={{ position: 'relative' }}>
              <Search 
                size={18} 
                strokeWidth={1.5} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
              />
              <input
                className="form-input"
                style={{ paddingLeft: '3rem' }}
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

      <div className="glass-panel" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Patient Ref</th>
              <th style={{ padding: '1rem' }}>Full Name</th>
              <th style={{ padding: '1rem' }}>ID Number</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <User size={48} strokeWidth={1} color="var(--border)" />
                    {loading ? "Searching..." : "Enter a keyword to search patients"}
                  </div>
                </td>
              </tr>
            ) : (
              results.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--primary)' }}>{p.patientRef}</td>
                  <td style={{ padding: '1rem' }}>{p.firstName} {p.lastName}</td>
                  <td style={{ padding: '1rem' }}>{p.idNumber}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      onClick={() => handleAddToQueue(p)}
                    >
                      <ListOrdered size={14} strokeWidth={2} />
                      Add to Queue
                    </button>
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
