import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Dashboard</Link>
    </div>
  );
}
