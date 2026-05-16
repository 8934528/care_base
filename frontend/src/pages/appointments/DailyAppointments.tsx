import { useEffect, useState } from "react";
import { getAppointmentsByDate, updateAppointmentStatus } from "../../services/appointmentService";

export default function DailyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const data = await getAppointmentsByDate(today);
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      loadAppointments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Today's Appointments</h1>

      <div className="glass-panel" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Ref</th>
              <th style={{ padding: '1rem' }}>Patient ID</th>
              <th style={{ padding: '1rem' }}>Time Slot</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading daily schedule...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No appointments scheduled for today.</td></tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{a.appointmentRef}</td>
                  <td style={{ padding: '1rem' }}>#{a.patientId}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: '600' }}>{a.startTime.substring(0, 5)} - {a.endTime.substring(0, 5)}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{a.appointmentType}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: a.status === 'Confirmed' ? 'var(--secondary)' : a.status === 'Scheduled' ? 'var(--surface)' : 'var(--border)',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {a.status === 'Scheduled' && (
                        <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }} onClick={() => handleStatusUpdate(a.id, 'Confirmed')}>
                          Confirm
                        </button>
                      )}
                      <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'var(--error)' }} onClick={() => handleStatusUpdate(a.id, 'Cancelled')}>
                        Cancel
                      </button>
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
