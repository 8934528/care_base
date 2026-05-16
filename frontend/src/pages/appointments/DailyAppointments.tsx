import { useEffect, useState, useCallback } from "react";
import { getAppointmentsByDate, updateAppointmentStatus } from "../../services/appointmentService";
import { Appointment } from "../../types";

export default function DailyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const data = await getAppointmentsByDate(today);
      setAppointments(data);
    } catch (err: unknown) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadAppointments();
    }
    return () => { isMounted = false; };
  }, [loadAppointments]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (error: unknown) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-calendar"></i> Today's Appointments</h1>
      </div>

      <div className="glass-panel no-padding overflow-x">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Patient ID</th>
              <th>Time Slot</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Loading daily schedule...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">No appointments scheduled for today.</td></tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td className="font-bold text-primary">{a.appointmentRef}</td>
                  <td>#{a.patientId}</td>
                  <td>
                    <span className="font-semibold">
                      <i className="fi fi-rr-clock-three"></i> {a.startTime.substring(0, 5)} - {a.endTime.substring(0, 5)}
                    </span>
                  </td>
                  <td>{a.appointmentType}</td>
                  <td>
                    <span className={`status-badge status-${a.status?.toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {a.status === 'Scheduled' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(a.id, 'Confirmed')}>
                          <i className="fi fi-rr-check"></i> Confirm
                        </button>
                      )}
                      <button className="btn btn-error btn-sm" onClick={() => handleStatusUpdate(a.id, 'Cancelled')}>
                        <i className="fi fi-rr-cross"></i> Cancel
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
