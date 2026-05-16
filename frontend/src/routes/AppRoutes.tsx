import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Layout from '../components/Layout';
import PatientSearch from '../pages/patients/PatientSearch';
import PatientRegistration from '../pages/patients/PatientRegistration';
import MedicalRecords from '../pages/records/MedicalRecords';
import DoctorNurseNotes from '../pages/notes/DoctorNurseNotes';
import AppointmentScheduler from '../pages/appointments/AppointmentScheduler';
import DailyAppointments from '../pages/appointments/DailyAppointments';
import QueueManagement from '../pages/queue/QueueManagement';
import Reports from '../pages/reports/Reports';
import Notifications from '../pages/notifications/Notifications';
import NotFound from '../pages/notfound/NotFound';

const ProtectedRoute = ({ children, role }: { children: JSX.Element, role?: string }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role && user.role !== 'Admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Placeholder routes for other pages */}
        <Route path="/patients" element={
          <ProtectedRoute>
            <PatientSearch />
          </ProtectedRoute>
        } />
        <Route path="/patients/register" element={
          <ProtectedRoute>
            <PatientRegistration />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppointmentScheduler />
          </ProtectedRoute>
        } />
        <Route path="/appointments/daily" element={
          <ProtectedRoute>
            <DailyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/queue" element={
          <ProtectedRoute>
            <QueueManagement />
          </ProtectedRoute>
        } />
        <Route path="/records/:patientId" element={
          <ProtectedRoute role="Doctor">
            <MedicalRecords />
          </ProtectedRoute>
        } />
        <Route path="/notes/:patientId" element={
          <ProtectedRoute role="Nurse">
            <DoctorNurseNotes />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute role="Admin">
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
