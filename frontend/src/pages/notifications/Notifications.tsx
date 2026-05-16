import { MessageSquare, Bell, Smartphone, ShieldCheck } from "lucide-react";

export default function Notifications() {
  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Notification Control Center</h1>

      <div className="row">
        <div className="col-8">
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} strokeWidth={1.5} color="var(--primary)" />
              Communication Channels
            </h3>
            
            <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Twilio SMS Integration</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Active: Appointment Confirmations & Reminders</p>
                </div>
                <div className="status-badge" style={{ background: 'var(--secondary)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>ONLINE</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>WhatsApp Business API</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Provisioned: Automated Clinical Notifications</p>
                </div>
                <div className="status-badge" style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>PROVISIONED</div>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} strokeWidth={1.5} color="var(--warning)" />
              Automated Workflows
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '1rem' }}>
                <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Confirmations</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sent immediately upon booking an appointment.</p>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>24h Reminders</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Background service sends alerts for tomorrow's visits.</p>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Missed Visits</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Detection service notifies patients who failed to show.</p>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Queue Alerts</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Real-time SignalR notifications for waiting patients.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="glass-panel" style={{ height: '100%', background: 'rgba(var(--secondary-rgb), 0.05)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} strokeWidth={1.5} color="var(--secondary)" />
              Compliance Policy
            </h3>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
              <li>No sensitive clinical data in SMS messages.</li>
              <li>Patient privacy preserved in all automated texts.</li>
              <li>Encrypted delivery channel via Twilio.</li>
              <li>Audit logs maintained for all communications.</li>
              <li>Opt-out capability for clinical marketing.</li>
            </ul>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Smartphone size={64} color="var(--border)" strokeWidth={1} style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>System Integrated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
