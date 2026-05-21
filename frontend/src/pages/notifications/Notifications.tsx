export default function Notifications() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-bell"></i> Notification Control Center</h1>
      </div>

      <div className="row mt-8">
        <div className="col-6">
          <div className="glass-panel mb-8">
            <div className="section-header">
              <i className="fi fi-rr-comment section-icon"></i>
              <h3 className="section-title">Communication Channels</h3>
            </div>
            
            <div className="card mb-4 border-l-secondary">
              <div className="flex-between align-center">
                <div>
                  <h4 className="m-0">Twilio SMS Integration</h4>
                  <p className="text-secondary text-sm mt-1">Active: Appointment Confirmations & Reminders</p>
                </div>
                <div className="status-badge bg-secondary">ONLINE</div>
              </div>
            </div>

            <div className="card mb-4 border-l-primary">
              <div className="flex-between align-center">
                <div>
                  <h4 className="m-0">WhatsApp Business API</h4>
                  <p className="text-secondary text-sm mt-1">Provisioned: Automated Clinical Notifications</p>
                </div>
                <div className="status-badge bg-primary">PROVISIONED</div>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <div className="section-header">
              <i className="fi fi-rr-workflow section-icon-warning"></i>
              <h3 className="section-title">Automated Workflows</h3>
            </div>
            
            <div className="stats-grid-2">
              <div className="card p-2">
                <h5 className="text-primary mb-2">Confirmations</h5>
                <p className="text-sm text-secondary">Sent immediately upon booking an appointment.</p>
              </div>
              <div className="card p-2">
                <h5 className="text-primary mb-2">24h Reminders</h5>
                <p className="text-sm text-secondary">Background service sends alerts for tomorrow's visits.</p>
              </div>
              <div className="card p-2">
                <h5 className="text-primary mb-2">Missed Visits</h5>
                <p className="text-sm text-secondary">Detection service notifies patients who failed to show.</p>
              </div>
              <div className="card p-2">
                <h5 className="text-primary mb-2">Queue Alerts</h5>
                <p className="text-sm text-secondary">Real-time SignalR notifications for waiting patients.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="glass-panel h-full bg-surface-faint">
            <div className="section-header">
              <i className="fi fi-rr-shield-check section-icon-secondary"></i>
              <h3 className="section-title text-secondary">Compliance Policy</h3>
            </div>
            <ul className="policy-list-compact">
              <li>No sensitive clinical data in SMS messages.</li>
              <li>Patient privacy preserved in all automated texts.</li>
              <li>Encrypted delivery channel via Twilio.</li>
              <li>Audit logs maintained for all communications.</li>
              <li>Opt-out capability for clinical marketing.</li>
            </ul>
            
            <div className="mt-12 text-center op-20">
              <i className="fi fi-rr-smartphone text-6xl"></i>
              <p className="text-xs tracking-widest font-bold mt-4">System Integrated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
