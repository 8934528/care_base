import { useEffect, useState, useCallback } from "react";
import { getQueue, callNext, completeQueue, skipQueue } from "../../services/queueService";
import { queueConnection } from "../../services/signalrService";
import { useToast } from "../../context/ToastContext";
import type { QueueItem } from "../../types";
import {
  Card,
  Button,
  IconButton,
  Badge,
  PageHeader,
  ConfirmModal,
  EmptyState,
  LoadingSpinner
} from "../../components/common";

export default function QueueManagement() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Active");

  // Confirm dialog state for skip / cancel
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    queueId: number;
    action: "skip" | "cancel";
    patientRef: string;
  }>({ isOpen: false, queueId: 0, action: "skip", patientRef: "" });

  const [actionLoading, setActionLoading] = useState(false);

  const loadQueue = useCallback(async () => {
    try {
      const data = await getQueue();
      setQueue(Array.isArray(data) ? data : []);
    } catch {
      showToast("Unable to load patient queue.", "danger");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadQueue();

    const startSignalR = async () => {
      try {
        if (queueConnection.state === "Disconnected") {
          await queueConnection.start();
        }

        queueConnection.on("ReceiveQueueUpdate", (updatedQueue: QueueItem[]) => {
          if (Array.isArray(updatedQueue)) {
            setQueue(updatedQueue);
          }
        });
      } catch {
        // Fallback polling
      }
    };

    startSignalR();

    return () => {
      queueConnection.off("ReceiveQueueUpdate");
    };
  }, [loadQueue]);

  const handleCallNext = async () => {
    try {
      const updated = await callNext();
      if (updated) {
        showToast(`Called queue item ${updated.queueNumber} (${updated.patientRef}).`, "info");
      }
      await loadQueue();
    } catch {
      showToast("No waiting patients available in queue.", "warning");
    }
  };

  const handleComplete = async (id: number, patientRef: string) => {
    try {
      await completeQueue(id);
      showToast(`Completed consultation for ${patientRef}.`, "success");
      await loadQueue();
    } catch {
      showToast("Failed to complete queue item.", "danger");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.queueId) return;
    setActionLoading(true);
    try {
      if (confirmDialog.action === "skip") {
        await skipQueue(confirmDialog.queueId);
        showToast(`Skipped patient ${confirmDialog.patientRef}.`, "info");
      }
      setConfirmDialog({ isOpen: false, queueId: 0, action: "skip", patientRef: "" });
      await loadQueue();
    } catch {
      showToast("Failed to perform queue action.", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (filterStatus === "Active") {
      return item.status === "Waiting" || item.status === "InProgress" || item.status === "InConsultation";
    }
    if (filterStatus === "All") return true;
    return item.status === filterStatus;
  });

  const waitingCount = queue.filter((q) => q.status === "Waiting").length;
  const inProgressCount = queue.filter((q) => q.status === "InProgress" || q.status === "InConsultation").length;
  const completedCount = queue.filter((q) => q.status === "Completed").length;

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Facility Queue Management"
        subtitle="Live consultation queue, triage status, and provider patient dispatch"
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline"
              icon="bi-arrow-clockwise"
              onClick={loadQueue}
              size="sm"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              icon="bi-megaphone"
              onClick={handleCallNext}
              disabled={waitingCount === 0}
            >
              Call Next Patient
            </Button>
          </div>
        }
      />

      {/* Queue Statistics Bar */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Waiting in Lobby</span>
                <h3 className="m-0 mt-1 text-warning">{waitingCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-muted">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">In Consultation</span>
                <h3 className="m-0 mt-1 text-primary">{inProgressCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-primary">
                <i className="bi bi-person-video"></i>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Completed Consultations</span>
                <h3 className="m-0 mt-1 text-success">{completedCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-success">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Filter Tab Buttons */}
      <div className="d-flex align-items-center gap-2 mb-3">
        {["Active", "Waiting", "InProgress", "Completed", "Skipped", "All"].map((st) => (
          <button
            key={st}
            type="button"
            className={`btn btn-sm ${filterStatus === st ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilterStatus(st)}
          >
            {st === "Active" ? "Active Patients" : st === "InProgress" ? "In Consultation" : st}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <Card>
        {loading ? (
          <LoadingSpinner message="Connecting to queue service..." />
        ) : filteredQueue.length === 0 ? (
          <EmptyState
            icon="bi-check-all"
            title="Queue is empty"
            message="No patients currently match the selected status filter."
          />
        ) : (
          <div className="table-responsive">
            <table className="table cb-table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col">Queue #</th>
                  <th scope="col">Patient Ref</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Assigned Clinician</th>
                  <th scope="col">Status</th>
                  <th scope="col">Check-in Time</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code className="cb-code-pill fw-bold">{item.queueNumber}</code>
                    </td>
                    <td className="fw-semibold">{item.patientRef}</td>
                    <td>
                      <Badge status={item.priority} />
                    </td>
                    <td>{item.assignedTo || "General Triage"}</td>
                    <td>
                      <Badge status={item.status} />
                    </td>
                    <td>
                      <span className="small text-muted">
                        {item.checkInTime
                          ? new Date(item.checkInTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "N/A"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        {item.status === "InProgress" && (
                          <Button
                            variant="success"
                            size="sm"
                            icon="bi-check-lg"
                            onClick={() => handleComplete(item.id, item.patientRef)}
                          >
                            Complete
                          </Button>
                        )}
                        {item.status === "Waiting" && (
                          <IconButton
                            icon="bi-skip-forward"
                            label="Skip Patient"
                            tooltip="Skip patient"
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                queueId: item.id,
                                action: "skip",
                                patientRef: item.patientRef
                              })
                            }
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, queueId: 0, action: "skip", patientRef: "" })}
        onConfirm={handleConfirmAction}
        title="Skip Patient"
        message={`Are you sure you want to skip ${confirmDialog.patientRef} in the queue?`}
        confirmText="Skip"
        variant="warning"
        loading={actionLoading}
      />
    </div>
  );
}
