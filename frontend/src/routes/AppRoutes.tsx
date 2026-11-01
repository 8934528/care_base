import type { ReactNode, ReactElement } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Layout from '../components/Layout';
import PatientSearch from '../pages/patients/PatientSearch';
import PatientRegistration from '../pages/patients/PatientRegistration';
import PatientProfile from '../pages/patients/PatientProfile';
import MedicalRecords from '../pages/records/MedicalRecords';
import DoctorNurseNotes from '../pages/notes/DoctorNurseNotes';
import AppointmentScheduler from '../pages/appointments/AppointmentScheduler';
import DailyAppointments from '../pages/appointments/DailyAppointments';
import QueueManagement from '../pages/queue/QueueManagement';
import Reports from '../pages/reports/Reports';
import Notifications from '../pages/notifications/Notifications';
import NotFound from '../pages/notfound/NotFound';
import EmployeeList from '../pages/employees/EmployeeList';
import EmployeeDetail from '../pages/employees/EmployeeDetail';
import AuditLogs from '../pages/audit/AuditLogs';

interface ProtectedRouteProps {
  children?: ReactNode;
  role?: string;
  roles?: string[];
}

const ProtectedRoute = ({
  children,
  role,
  roles
}: ProtectedRouteProps): ReactElement | null => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Admin') {
    if (role && user.role !== role) {
      return (
        <div className="cb-empty-state text-center py-5">
          <i className="bi bi-shield-lock text-danger fs-1 mb-3"></i>
          <h3>Access Restricted</h3>
          <p className="text-muted">You do not have administrative permission to view this resource.</p>
          <Link to="/dashboard" className="btn btn-primary mt-3">
            Back to Dashboard
          </Link>
        </div>
      );
    }
    if (roles && !roles.includes(user.role)) {
      return (
        <div className="cb-empty-state text-center py-5">
          <i className="bi bi-shield-lock text-danger fs-1 mb-3"></i>
          <h3>Access Restricted</h3>
          <p className="text-muted">You do not have permission to view this resource.</p>
          <Link to="/dashboard" className="btn btn-primary mt-3">
            Back to Dashboard
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/register"
          element={
            <ProtectedRoute roles={["Admin", "Manager", "Clerk", "Nurse"]}>
              <PatientRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/profile/:patientRef"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentScheduler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/daily"
          element={
            <ProtectedRoute>
              <DailyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <QueueManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records/:patientId"
          element={
            <ProtectedRoute roles={["Admin", "Manager", "Doctor", "Nurse"]}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={<Navigate to="/patients" replace />}
        />
        <Route
          path="/notes/:patientId"
          element={
            <ProtectedRoute roles={["Doctor", "Nurse"]}>
              <DoctorNurseNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={<Navigate to="/patients" replace />}
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <EmployeeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["Admin", "Manager", "Doctor"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["Admin", "Clerk"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
