export interface User {
  userId?: number;
  token: string;
  role: string;
  fullName: string;
  preferredName?: string;
  email?: string;
  employeeId?: string;
  departmentName?: string;
  permissions?: string[];
  mustChangePassword?: boolean;
}

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  departmentId?: number;
  departmentName?: string;
  roleId: number;
  roleName: string;
  professionalRegistration?: string;
  accountStatus: string;
  isActive: boolean;
  employmentStartDate?: string;
  employmentEndDate?: string;
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

export interface EmployeeDetail extends Employee {
  availability: StaffAvailabilityItem[];
  recentActivity: AuditLogItem[];
}

export interface StaffAvailabilityItem {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  shiftName: string;
  isAvailable: boolean;
  clinicLocation?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  employeeCount: number;
}

export interface AuditLogItem {
  id: number;
  userId?: number;
  userName?: string;
  userRole?: string;
  action: string;
  module: string;
  resourceId?: string;
  ipAddress?: string;
  details: string;
  result: string;
  timestamp: string;
}

export interface Patient {
  id: number;
  patientRef: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  gender: string;
  dateOfBirth?: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  createdAt: string;
}

export interface Appointment {
  id: number;
  appointmentRef: string;
  patientId: number;
  doctorId?: number | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  reason: string;
  priority: string;
  status: string;
  notes?: string;
}

export interface MedicalRecord {
  id: number;
  visitReference: string;
  patientId: number;
  doctorId: number;
  visitDate: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosisCode: string;
  prescription: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenLevel: string;
  weight: string;
  height: string;
  followUpDate?: string;
  status: string;
  amendedReason?: string;
  amendedAt?: string;
  amendmentHistory?: string;
  doctor?: {
    id: number;
    fullName: string;
  };
}

export interface QueueItem {
  id: number;
  queueNumber: string;
  patientId: number;
  patientRef: string;
  status: string;
  priority: string;
  assignedTo: string;
  checkInTime: string;
  calledTime?: string;
  completedTime?: string;
}

export interface DashboardData {
  dailyVisits: number;
  queueLoad: number;
  activeDoctors: number;
  completedConsultations: number;
  totalPatients: number;
  totalEmployees: number;
  activeEmployees: number;
  todayAppointments: number;
  pendingFollowUps: number;
  roleAppointments: {
    id: number;
    appointmentRef: string;
    patientId: number;
    patientName: string;
    startTime: string;
    endTime: string;
    appointmentType: string;
    priority: string;
    status: string;
    reason?: string;
  }[];
  roleQueueItems: {
    id: number;
    queueNumber: string;
    patientId: number;
    patientRef: string;
    priority: string;
    status: string;
    assignedTo: string;
    checkInTime: string;
  }[];
  recentSecurityEvents: AuditLogItem[];
  diseaseTrends: { disease: string; totalCases: number }[];
  genderStats: { gender: string; total: number }[];
  appointmentStats: { status: string; total: number }[];
}
