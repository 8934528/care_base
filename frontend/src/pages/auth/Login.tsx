import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, ShieldAlert } from "lucide-react";

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
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', letterSpacing: '2px', fontWeight: '900', margin: 0 }}>CAREBASE</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Clinical Information System</p>
        </div>
        
        {error && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(var(--error-rgb), 0.1)', 
            color: 'var(--error)', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            borderLeft: '4px solid var(--error)'
          }}>
            <ShieldAlert size={18} strokeWidth={2} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} strokeWidth={1.5} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--border)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                placeholder="doctor@carebase.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} strokeWidth={1.5} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--border)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }} disabled={loading}>
            <LogIn size={18} strokeWidth={2} />
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
