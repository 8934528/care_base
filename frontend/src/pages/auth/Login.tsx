import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="login-page">
      <div className="glass-panel animate-fade-in login-container">
        <div className="login-header">
          <img src="/carebase.png" alt="CareBase Logo" className="login-logo" />
          <p className="login-subtitle">Clinical Information System</p>
        </div>
        
        {error && (
          <div className="error-box">
            <i className="fi fi-rr-shield-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <i className="fi fi-rr-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                className="form-input has-icon"
                placeholder="doctor@carebase.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fi fi-rr-lock input-icon"></i>
              <input
                id="password"
                type="password"
                className="form-input has-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block login-btn" disabled={loading}>
            <i className="fi fi-rr-sign-in-alt"></i>
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
