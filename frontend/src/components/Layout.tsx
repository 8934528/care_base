import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { ConfirmModal } from "./common";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cb-shell">
      <Sidebar />
      <div className="cb-main">
        <header className="cb-topbar d-flex align-items-center justify-content-between px-3 px-md-4">
          <div className="d-flex align-items-center">
            <span className="cb-topbar-facility text-muted small fw-medium">
              <i className="bi bi-geo-alt me-1"></i>
              CareBase Facility Operations
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user && (
              <div className="cb-topbar-badge d-none d-md-flex align-items-center gap-2">
                <span className="badge bg-light text-dark border">
                  {user.role}
                </span>
                {user.departmentName && (
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">
                    {user.departmentName}
                  </span>
                )}
              </div>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger cb-btn-sm d-flex align-items-center"
              onClick={() => setLogoutModalOpen(true)}
              aria-label="Sign out of CareBase"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="cb-content container-fluid px-3 px-md-4 py-3">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to end your current CareBase session?"
        confirmText="Sign Out"
        variant="danger"
      />
    </div>
  );
}
