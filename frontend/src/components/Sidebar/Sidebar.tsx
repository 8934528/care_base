import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "bi-speedometer2", roles: ["Admin", "Manager", "Doctor", "Nurse", "Clerk"] },
  { name: "Patients", path: "/patients", icon: "bi-people", roles: ["Admin", "Manager", "Doctor", "Nurse", "Clerk"] },
  { name: "Appointments", path: "/appointments", icon: "bi-calendar3", roles: ["Admin", "Manager", "Doctor", "Nurse", "Clerk"] },
  { name: "Queue", path: "/queue", icon: "bi-list-ol", roles: ["Admin", "Manager", "Doctor", "Nurse", "Clerk"] },
  { name: "Medical Records", path: "/records", icon: "bi-journal-medical", roles: ["Admin", "Manager", "Doctor", "Nurse"] },
  { name: "Clinical Notes", path: "/notes", icon: "bi-clipboard2-pulse", roles: ["Doctor", "Nurse"] },
  { name: "Employees", path: "/employees", icon: "bi-person-badge", roles: ["Admin", "Manager"] },
  { name: "Audit Logs", path: "/audit-logs", icon: "bi-shield-check", roles: ["Admin", "Manager"] },
  { name: "Reports", path: "/reports", icon: "bi-graph-up", roles: ["Admin", "Manager", "Doctor"] },
  { name: "Notifications", path: "/notifications", icon: "bi-bell", roles: ["Admin", "Clerk"] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredMenu = menuItems.filter((item) =>
    user.role === "Admin" || item.roles.includes(user.role)
  );

  return (
    <aside className="cb-sidebar">
      <div className="cb-sidebar-header d-flex align-items-center">
        <div className="cb-sidebar-brand-icon me-2">
          <i className="bi bi-hospital"></i>
        </div>
        <div className="cb-sidebar-brand-text">
          <span className="fw-bold fs-5 tracking-tight">CareBase</span>
          <span className="cb-brand-tag">Health HMS</span>
        </div>
      </div>

      <nav className="cb-nav-links">
        {filteredMenu.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`cb-nav-item ${isActive ? "active" : ""}`}
            >
              <i className={`bi ${item.icon} cb-nav-icon`} aria-hidden="true"></i>
              <span className="cb-nav-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="cb-sidebar-footer">
        <div className="cb-user-summary d-flex align-items-center">
          <div className="cb-avatar cb-avatar-sm me-2">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="cb-user-text overflow-hidden">
            <div className="cb-user-name text-truncate">{user.fullName}</div>
            <div className="cb-user-role small text-muted text-truncate">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
