import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Clerk",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background watermark logo */}
      <img src="/carebase.png" alt="" className="auth-bg-watermark" aria-hidden="true" />

      <div className="auth-card auth-card-wide animate-fade-in">
        {/* Card header */}
        <div className="auth-card-header">
          <img src="/carebase.png" alt="CareBase Logo" className="auth-logo" />
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Set up a new Care Base account</p>
        </div>

        {error && (
          <div className="error-box">
            <i className="fi fi-rr-shield-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          {/* Full Name + Email */}
          <div className="auth-two-col">
            <div className="form-group mt-3 mb-3">
              <label className="form-label" htmlFor="reg-fullName">Full Name</label>
              <div className="input-with-icon">
                <i className="fi fi-rr-user input-icon"></i>
                <input
                  id="reg-fullName"
                  type="text"
                  className="form-input has-icon"
                  placeholder="Name Surname"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group mt-3 mb-3">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div className="input-with-icon">
                <i className="fi fi-rr-envelope input-icon"></i>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input has-icon"
                  placeholder="email@carebase.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Password + Confirm Password — two columns */}
          <div className="auth-two-col">
            <div className="form-group mt-3 mb-3">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-with-icon">
                <i className="fi fi-rr-lock input-icon"></i>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input has-icon has-icon-right"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="form-group mt-3 mb-3">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-with-icon">
                <i className="fi fi-rr-lock input-icon"></i>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  className="form-input has-icon has-icon-right"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  <i className={`fi ${showConfirm ? "fi-rr-eye-crossed" : "fi-rr-eye"}`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Role — full width */}
          <div className="form-group mt-3 mb-3">
            <label className="form-label" htmlFor="reg-role">System Role</label>
            <div className="input-with-icon">
              <i className="fi fi-rr-id-badge input-icon"></i>
              <select
                id="reg-role"
                className="form-input has-icon"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                aria-label="Select system role"
              >
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Clerk">Clerk</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={loading}
          >
            <i className="fi fi-rr-user-add"></i>
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
