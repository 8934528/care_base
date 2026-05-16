import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

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
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background watermark logo */}
      <img src="/carebase.png" alt="" className="auth-bg-watermark" aria-hidden="true" />

      <div className="auth-card animate-fade-in">
        {/* Card header */}
        <div className="auth-card-header">
          <img src="/carebase.png" alt="CareBase Logo" className="auth-logo" />
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your Care Base account</p>
        </div>

        {error && (
          <div className="error-box">
            <i className="fi fi-rr-shield-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group mt-3 mb-3">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <i className="fi fi-rr-envelope input-icon"></i>
              <input
                id="login-email"
                type="email"
                className="form-input has-icon"
                placeholder="email@carebase.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mt-3 mb-3">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <i className="fi fi-rr-lock input-icon"></i>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input has-icon has-icon-right"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fi ${showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={loading}
          >
            <i className="fi fi-rr-sign-in-alt"></i>
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
