import { useEffect, useState } from "react";
import { getQueue, callNext, completeQueue, skipQueue } from "../../services/queueService";
import { queueConnection } from "../../services/signalrService";
import { Activity, Play, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function QueueManagement() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const data = await getQueue();
      setQueue(data);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();

    const startSignalR = async () => {
      try {
        if (queueConnection.state === "Disconnected") {
          await queueConnection.start();
          console.log("SignalR Connected");
        }

        queueConnection.on("ReceiveQueueUpdate", (updatedQueue: any[]) => {
          setQueue(updatedQueue);
        });
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startSignalR();

    return () => {
      if (queueConnection.state === "Connected") {
        queueConnection.off("ReceiveQueueUpdate");
      }
    };
  }, []);

  const handleCallNext = async () => {
    try {
      await callNext();
    } catch (err) {
      alert("No patients in queue or error calling next");
    }
  };

  const handleAction = async (action: (id: number) => Promise<void>, id: number) => {
    try {
      await action(id);
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Clinic Queue Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Activity size={16} color="var(--secondary)" strokeWidth={2} />
            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: '600' }}>
              Live Real-time Sync Enabled
            </p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleCallNext}>
          <Play size={18} strokeWidth={1.5} />
          Call Next Patient
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Queue #</th>
              <th style={{ padding: '1rem' }}>Patient Ref</th>
              <th style={{ padding: '1rem' }}>Priority</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Assigned To</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && queue.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <RefreshCw size={32} className="animate-spin" color="var(--primary)" strokeWidth={1.5} />
                    Loading live queue...
                  </div>
                </td>
              </tr>
            ) : queue.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Queue is empty
                </td>
              </tr>
            ) : (
              queue.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid var(--border)', background: q.status === 'InProgress' ? 'rgba(var(--secondary-rgb), 0.05)' : 'transparent' }}>
                  <td style={{ padding: '1rem', fontWeight: '700' }}>{q.queueNumber}</td>
                  <td style={{ padding: '1rem' }}>{q.patientRef}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: q.priority === 'Emergency' ? 'var(--error)' : q.priority === 'Priority' ? 'var(--warning)' : 'var(--border)',
                      color: q.priority === 'Normal' ? 'var(--text-primary)' : 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {q.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: q.status === 'InProgress' ? 'var(--secondary)' : 'inherit',
                      fontWeight: q.status === 'InProgress' ? '700' : '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {q.status === 'InProgress' && <Activity size={14} className="animate-pulse" />}
                      {q.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{q.assignedTo || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {q.status !== 'Completed' && q.status !== 'Skipped' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => handleAction(completeQueue, q.id)}
                        >
                          <CheckCircle2 size={14} strokeWidth={2} />
                          Complete
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => handleAction(skipQueue, q.id)}
                        >
                          <XCircle size={14} strokeWidth={2} />
                          Skip
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
