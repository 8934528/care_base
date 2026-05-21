import { api } from "./api";
import type { Appointment } from "../types";

export interface CreateAppointmentPayload {
  patientId: number;
  doctorId?: number | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  reason: string;
  priority: string;
  notes?: string;
}

export const createAppointment = async (data: CreateAppointmentPayload) => {
  const res = await api.post("/appointments", {
    ...data,
    startTime: data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
    endTime: data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime,
    doctorId: data.doctorId ?? null,
  });
  return res.data;
};

export const getAppointmentsByDate = async (date: string) => {
  const res = await api.get(`/appointments/date/${date}`);
  return res.data;
};

export const getDoctorAppointments = async (doctorId: number) => {
  const res = await api.get(`/appointments/doctor/${doctorId}`);
  return res.data;
};

export const updateAppointmentStatus = async (id: number, status: string) => {
  await api.put(`/appointments/${id}/status?status=${status}`);
};
