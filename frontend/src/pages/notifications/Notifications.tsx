import { useEffect, useState } from "react";
import { getNotifications, type NotificationRecord } from "../../services/notificationService";
import { Card, Badge, PageHeader, LoadingSpinner, EmptyState } from "../../components/common";

export default function Notifications() {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sentCount = records.filter((r) => r.status === "Sent").length;
  const pendingCount = records.filter((r) => r.status === "Pending").length;
  const failedCount = records.filter((r) => r.status === "Failed").length;

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Patient Notifications & Messaging"
        subtitle="Automated appointment confirmations, schedule change notices, and reminders"
      />

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <span className="text-muted small">Delivered Notices</span>
            <h3 className="m-0 mt-1 text-success">{sentCount}</h3>
            <span className="small text-muted">Confirmed dispatches</span>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <span className="text-muted small">Pending Dispatch</span>
            <h3 className="m-0 mt-1 text-warning">{pendingCount}</h3>
            <span className="small text-muted">Queued in background service</span>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <span className="text-muted small">Failed Dispatches</span>
            <h3 className="m-0 mt-1 text-danger">{failedCount}</h3>
            <span className="small text-muted">Delivery failures</span>
          </Card>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <Card title="Communication Channels" className="mb-3">
            <div className="d-flex flex-column gap-2">
              <div className="p-3 border rounded d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold">
                    <i className="bi bi-chat-text me-2 text-primary"></i>
                    SMS Gateway
                  </div>
                  <span className="small text-muted">Appointment confirmations & 24hr reminders</span>
                </div>
                <Badge status="Active" variant="active" />
              </div>

              <div className="p-3 border rounded d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold">
                    <i className="bi bi-envelope me-2 text-secondary"></i>
                    Email Alerts
                  </div>
                  <span className="small text-muted">Administrative notifications & credential resets</span>
                </div>
                <Badge status="Active" variant="active" />
              </div>
            </div>
          </Card>

          <Card title="Automated Rules">
            <div className="d-flex flex-column gap-2 small">
              <div className="p-2 border rounded bg-light">
                <i className="bi bi-check-circle text-success me-2"></i>
                <strong>Instant SMS:</strong> Sent immediately upon appointment creation.
              </div>
              <div className="p-2 border rounded bg-light">
                <i className="bi bi-clock-history text-primary me-2"></i>
                <strong>24-Hour Reminder:</strong> Scheduled automated reminder for tomorrow&apos;s appointments.
              </div>
              <div className="p-2 border rounded bg-light">
                <i className="bi bi-shield-check text-muted me-2"></i>
                <strong>Security Alert:</strong> Employee status changes and credential resets logged.
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-7">
          <Card title="Dispatched Notifications Log" subtitle={`${records.length} records logged`}>
            {loading ? (
              <LoadingSpinner message="Loading notification log..." />
            ) : records.length === 0 ? (
              <EmptyState
                icon="bi-bell-slash"
                title="No notifications dispatched"
                message="No notifications have been triggered yet."
              />
            ) : (
              <div className="table-responsive">
                <table className="table cb-table align-middle m-0">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Type</th>
                      <th scope="col">Message Content</th>
                      <th scope="col">Status</th>
                      <th scope="col">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => (
                      <tr key={rec.id}>
                        <td>
                          <span className="fw-semibold small">{rec.recipient || "N/A"}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border small">
                            {rec.notificationType || rec.channel || "SMS"}
                          </span>
                        </td>
                        <td>
                          <span className="small text-muted" title={rec.message || ""}>
                            {rec.message
                              ? rec.message.length > 55
                                ? `${rec.message.substring(0, 55)}...`
                                : rec.message
                              : "No message content"}
                          </span>
                        </td>
                        <td>
                          <Badge status={rec.status} />
                        </td>
                        <td>
                          <span className="small text-muted">
                            {rec.sentAt || rec.createdAt
                              ? new Date(rec.sentAt || rec.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })
                              : "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
