import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="cb-empty-state text-center py-5">
      <i className="bi bi-compass text-muted fs-1 mb-3"></i>
      <h1 className="display-6 fw-bold">404</h1>
      <h2 className="h5 text-muted mb-3">Page Not Found</h2>
      <p className="small text-muted mb-4">
        The requested healthcare portal resource could not be found or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <i className="bi bi-house me-2"></i>
        Back to Dashboard
      </Link>
    </div>
  );
}
