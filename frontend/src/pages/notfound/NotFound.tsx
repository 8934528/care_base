import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex-center-col">
      <h1 className="text-huge text-primary">404</h1>
      <h2>Page Not Found</h2>
      <p className="mt-4 text-secondary">The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary mt-8">Back to Dashboard</Link>
    </div>
  );
}
