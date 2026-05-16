import { useEffect, useState } from "react";
import { getPatientHistory } from "../../services/medicalRecordService";
import type { MedicalRecord } from "../../types";

export default function PatientHistory({ patientId }: { patientId: number }) {
  const [history, setHistory] = useState<MedicalRecord[]>([]);
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
      <h2 className="mb-8">Clinical History</h2>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <div className="glass-panel text-center-padded">
          <p className="text-secondary">No previous medical records found for this patient.</p>
        </div>
      ) : (
        history.map((record) => (
          <div className="glass-panel history-item" key={record.id}>
            <div className="history-header">
              <h4 className="text-primary mb-0">{record.visitReference}</h4>
              <span className="text-sm font-bold text-secondary">
                {new Date(record.visitDate).toLocaleDateString()}
              </span>
            </div>

            <div className="row">
              <div className="col-6">
                <p><strong>Assessment:</strong> {record.assessment}</p>
                <p className="mt-4"><strong>Plan:</strong> {record.plan}</p>
              </div>
              <div className="col-6">
                <div className="history-grid">
                  <div className="card p-4">BP: {record.bloodPressure || '-'}</div>
                  <div className="card p-4">HR: {record.heartRate || '-'}</div>
                  <div className="card p-4">Temp: {record.temperature || '-'}°C</div>
                  <div className="card p-4">SpO2: {record.oxygenLevel || '-'}%</div>
                </div>
              </div>
            </div>
            
            {record.prescription && (
              <div className="prescription-box">
                <strong>Prescription:</strong> {record.prescription}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
