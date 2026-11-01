import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setError(errObj.response?.data?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header text-center mb-4">
          <div className="auth-brand-icon mb-2">
            <i className="bi bi-hospital"></i>
          </div>
          <h1 className="auth-title h4 fw-bold mb-1">CareBase Facility Sign In</h1>
          <p className="auth-subtitle small text-muted">
            Healthcare Operations & Patient Management System
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
            <i className="bi bi-shield-exclamation me-2 fs-5"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor="login-email">
              Employee Email
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                id="login-email"
                type="email"
                className="form-control cb-form-control"
                placeholder="staff@carebase.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold" htmlFor="login-password">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-control cb-form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 cb-btn-primary py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-4 pt-3 border-top">
          <p className="small text-muted m-0">
            <i className="bi bi-shield-lock me-1"></i>
            Restricted access. Employee accounts are provisioned internally by facility administration.
          </p>
        </div>
      </div>
    </div>
  );
}
