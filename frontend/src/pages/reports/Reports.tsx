export default function Reports() {
  return (
    <div className="animate-fade-in">
      <h1>Clinical Reports</h1>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>System activity and patient statistics reports will be available here.</p>
      
      <div className="row" style={{ marginTop: '2rem' }}>
        <div className="col-6">
          <div className="card">
            <h3>Daily Visit Statistics</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border)', marginTop: '1rem' }}>
              Chart Placeholder
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <h3>Patient Demographics</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border)', marginTop: '1rem' }}>
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
