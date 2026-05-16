import { useEffect, useState } from "react";
import { getPatientHistory } from "../../services/medicalRecordService";

export default function PatientHistory({ patientId }: { patientId: number }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getPatientHistory(patientId);
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [patientId]);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Clinical History</h2>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No previous medical records found for this patient.</p>
        </div>
      ) : (
        history.map((record) => (
          <div className="glass-panel" key={record.id} style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--primary)' }}>{record.visitReference}</h4>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {new Date(record.visitDate).toLocaleDateString()}
              </span>
            </div>

            <div className="row">
              <div className="col-6">
                <p><strong>Assessment:</strong> {record.assessment}</p>
                <p style={{ marginTop: '0.5rem' }}><strong>Plan:</strong> {record.plan}</p>
              </div>
              <div className="col-6">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div className="card" style={{ padding: '0.5rem', background: 'var(--surface)' }}>BP: {record.bloodPressure || '-'}</div>
                  <div className="card" style={{ padding: '0.5rem', background: 'var(--surface)' }}>HR: {record.heartRate || '-'}</div>
                  <div className="card" style={{ padding: '0.5rem', background: 'var(--surface)' }}>Temp: {record.temperature || '-'}°C</div>
                  <div className="card" style={{ padding: '0.5rem', background: 'var(--surface)' }}>SpO2: {record.oxygenLevel || '-'}%</div>
                </div>
              </div>
            </div>
            
            {record.prescription && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(var(--secondary-rgb), 0.1)', border: '1px solid var(--secondary)' }}>
                <strong>Prescription:</strong> {record.prescription}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
