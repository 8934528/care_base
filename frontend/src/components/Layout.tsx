import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <button className="btn" onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            Logout
          </button>
        </header>
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
