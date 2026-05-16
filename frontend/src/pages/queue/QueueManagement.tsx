import { useEffect, useState, useCallback } from "react";
import { getQueue, callNext, completeQueue, skipQueue } from "../../services/queueService";
import { queueConnection } from "../../services/signalrService";

interface QueueItem {
  id: number;
  queueNumber: string;
  patientRef: string;
  priority: string;
  status: string;
  assignedTo?: string;
}

export default function QueueManagement() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    try {
      const data = await getQueue();
      setQueue(data);
    } catch (err: unknown) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadQueue();
    };
    init();

    const startSignalR = async () => {
      try {
        if (queueConnection.state === "Disconnected") {
          await queueConnection.start();
          console.log("SignalR Connected");
        }

        queueConnection.on("ReceiveQueueUpdate", (updatedQueue: QueueItem[]) => {
          setQueue(updatedQueue);
        });
      } catch (err: unknown) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startSignalR();

    return () => {
      if (queueConnection.state === "Connected") {
        queueConnection.off("ReceiveQueueUpdate");
      }
    };
  }, [loadQueue]);

  const handleCallNext = async () => {
    try {
      await callNext();
    } catch (err) {
      console.error(err);
      alert("No patients in queue or error calling next");
    }
  };

  const handleAction = async (action: (id: number) => Promise<void>, id: number) => {
    try {
      await action(id);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1><i className="fi fi-rr-list-check"></i> Clinic Queue Management</h1>
          <div className="live-status">
            <i className="fi fi-rr-pulse live-pulse"></i>
            <p className="live-text">
              Live Real-time Sync Enabled
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleCallNext}>
          <i className="fi fi-rr-play"></i>
          <span>Call Next Patient</span>
        </button>
      </div>

      <div className="glass-panel no-padding overflow-x">
        <table className="data-table">
          <thead>
            <tr>
              <th>Queue #</th>
              <th>Patient Ref</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && queue.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-12">
                  <div className="loading-state">
                    <i className="fi fi-rr-refresh animate-spin loading-icon"></i>
                    <span>Loading live queue...</span>
                  </div>
                </td>
              </tr>
            ) : queue.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-12 text-secondary">
                  Queue is empty
                </td>
              </tr>
            ) : (
              queue.map((q) => (
                <tr key={q.id} className={q.status === 'InProgress' ? 'row-in-progress' : ''}>
                  <td className="font-bold">{q.queueNumber}</td>
                  <td>{q.patientRef}</td>
                  <td>
                    <span className={`status-badge priority-${q.priority?.toLowerCase()}`}>
                      {q.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`queue-status status-${q.status?.toLowerCase()}`}>
                      {q.status === 'InProgress' && <i className="fi fi-rr-pulse animate-pulse mr-2"></i>}
                      {q.status}
                    </span>
                  </td>
                  <td className="text-secondary">{q.assignedTo || '-'}</td>
                  <td>
                    {q.status !== 'Completed' && q.status !== 'Skipped' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAction(completeQueue, q.id)}
                        >
                          <i className="fi fi-rr-check"></i>
                          <span>Complete</span>
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAction(skipQueue, q.id)}
                        >
                          <i className="fi fi-rr-redo"></i>
                          <span>Skip</span>
                        </button>
                      </div>
                    )}
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
