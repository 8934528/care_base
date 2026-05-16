export interface User {
  token: string;
  role: string;
  fullName: string;
}

export interface Appointment {
  id: number;
  appointmentRef: string;
  patientId: string | number;
  startTime: string;
  endTime: string;
  appointmentType: string;
  status: string;
}

export interface MedicalRecord {
  id: number;
  visitReference: string;
  visitDate: string;
  assessment: string;
  plan: string;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  oxygenLevel?: string;
  prescription?: string;
  subjective: string;
  objective: string;
}

export interface QueueItem {
  id: number;
  queueNumber: string;
  patientRef: string;
  status: string;
  priority: string;
  patientId?: number;
}
