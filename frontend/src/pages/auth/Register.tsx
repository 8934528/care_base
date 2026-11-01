import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card text-center p-4">
        <div className="auth-brand-icon mb-3">
          <i className="bi bi-shield-lock text-primary fs-1"></i>
        </div>
        <h2 className="h4 fw-bold mb-2">Internal Provisioning Only</h2>
        <p className="text-muted small mb-4">
          Public self-registration is closed in accordance with healthcare facility security standards.
          All staff accounts, roles, and departmental permissions must be provisioned internally by an authorized employee manager.
        </p>
        <Link to="/login" className="btn btn-primary w-100">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Facility Sign In
        </Link>
      </div>
    </div>
  );
}
