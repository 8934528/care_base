export default function Reports() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-document-signed"></i> Clinical Reports</h1>
      </div>
      <p className="mt-4 text-secondary">System activity and patient statistics reports will be available here.</p>
      
      <div className="row mt-8">
        <div className="col-6">
          <div className="card">
            <div className="section-header">
               <i className="fi fi-rr-stats section-icon"></i>
               <h3 className="section-title">Daily Visit Statistics</h3>
            </div>
            <div className="empty-state p-12 h-200">
               <i className="fi fi-rr-chart-histogram empty-state-icon"></i>
               <p>Chart data processing...</p>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <div className="section-header">
               <i className="fi fi-rr-users section-icon"></i>
               <h3 className="section-title">Patient Demographics</h3>
            </div>
            <div className="empty-state p-12 h-200">
               <i className="fi fi-rr-chart-pie empty-state-icon"></i>
               <p>Chart data processing...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
