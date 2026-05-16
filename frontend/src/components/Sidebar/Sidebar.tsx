import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ListOrdered, 
  FileText, 
  ClipboardList, 
  BarChart3,
  Bell
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Doctor", "Nurse", "Clerk"] },
  { name: "Patients", path: "/patients", icon: Users, roles: ["Admin", "Doctor", "Nurse", "Clerk"] },
  { name: "Appointments", path: "/appointments", icon: Calendar, roles: ["Admin", "Doctor", "Nurse", "Clerk"] },
  { name: "Queue", path: "/queue", icon: ListOrdered, roles: ["Admin", "Nurse", "Clerk"] },
  { name: "Medical Records", path: "/records", icon: FileText, roles: ["Admin", "Doctor"] },
  { name: "Clinical Notes", path: "/notes", icon: ClipboardList, roles: ["Doctor", "Nurse"] },
  { name: "Notifications", path: "/notifications", icon: Bell, roles: ["Admin", "Clerk"] },
  { name: "Reports", path: "/reports", icon: BarChart3, roles: ["Admin"] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user.role) || user.role === "Admin"
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="CareBase Logo" className="sidebar-logo" />
        <span>CAREBASE</span>
      </div>
      <nav className="nav-links">
        {filteredMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname.startsWith(item.path) ? "active" : ""}`}
          >
            <item.icon size={18} strokeWidth={1.5} className="nav-icon" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info-label">
          Logged in as:
        </div>
        <div className="user-info-name">
          {user.fullName}
        </div>
      </div>
    </div>
  );
}
