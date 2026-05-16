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
      {/* Background watermark logo */}
      <img src="/carebase.png" alt="" className="auth-bg-watermark" aria-hidden="true" />
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <button className="btn btn-ghost" onClick={handleLogout}>
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
