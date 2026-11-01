import { useEffect, useState, useCallback } from "react";
import { getAppointmentsByDate, updateAppointmentStatus } from "../../services/appointmentService";
import { addToQueue } from "../../services/queueService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import type { Appointment } from "../../types";
import {
  Card,
  Button,
  IconButton,
  Badge,
  PageHeader,
  EmptyState,
  LoadingSpinner
} from "../../components/common";

export default function DailyAppointments() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDate(date);
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      showToast("Unable to load appointments for selected date.", "danger");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [date, showToast]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      showToast(`Appointment status updated to ${status}.`, "success");
      await loadAppointments();
    } catch {
      showToast("Failed to update appointment status.", "danger");
    }
  };

  const handleCheckIn = async (apt: Appointment) => {
    try {
      await updateAppointmentStatus(apt.id, "CheckedIn");
      await addToQueue({
        patientId: Number(apt.patientId),
        patientRef: `PAT-${apt.patientId}`,
        priority: apt.priority || "Normal"
      });
      showToast(`Checked in appointment ${apt.appointmentRef} to queue.`, "success");
      await loadAppointments();
    } catch {
      showToast("Patient checked in.", "info");
      await loadAppointments();
    }
  };

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Daily Appointments"
        subtitle="Manage daily bookings, check-ins, and scheduled consultations"
        actions={
          <div className="d-flex align-items-center gap-2">
            <input
              type="date"
              className="form-control form-control-sm cb-form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Filter by appointment date"
            />
            <Button
              variant="primary"
              size="sm"
              icon="bi-plus-lg"
              onClick={() => navigate("/appointments")}
            >
              Book appointment
            </Button>
          </div>
        }
      />

      <Card>
        {loading ? (
          <LoadingSpinner message="Loading scheduled appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            icon="bi-calendar-x"
            title="No appointments scheduled"
            message={`No bookings found for ${new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}.`}
            action={
              <Button
                variant="primary"
                size="sm"
                icon="bi-calendar-plus"
                onClick={() => navigate("/appointments")}
              >
                Schedule appointment
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="table cb-table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Time</th>
                  <th scope="col">Patient ID</th>
                  <th scope="col">Appointment Type</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <code className="cb-code-pill fw-semibold">{apt.appointmentRef}</code>
                    </td>
                    <td className="fw-semibold">
                      {typeof apt.startTime === "string" ? apt.startTime.substring(0, 5) : apt.startTime} -{" "}
                      {typeof apt.endTime === "string" ? apt.endTime.substring(0, 5) : apt.endTime}
                    </td>
                    <td>Patient #{apt.patientId}</td>
                    <td>{apt.appointmentType}</td>
                    <td>
                      <Badge status={apt.priority} />
                    </td>
                    <td>
                      <Badge status={apt.status} />
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        {apt.status === "Scheduled" && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon="bi-box-arrow-in-right"
                            onClick={() => handleCheckIn(apt)}
                          >
                            Check-in
                          </Button>
                        )}
                        {apt.status === "CheckedIn" && (
                          <Button
                            variant="success"
                            size="sm"
                            icon="bi-check-lg"
                            onClick={() => handleStatusUpdate(apt.id, "Completed")}
                          >
                            Complete
                          </Button>
                        )}
                        {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                          <IconButton
                            icon="bi-x-circle"
                            label="Cancel Appointment"
                            tooltip="Cancel appointment"
                            variant="danger"
                            onClick={() => handleStatusUpdate(apt.id, "Cancelled")}
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
