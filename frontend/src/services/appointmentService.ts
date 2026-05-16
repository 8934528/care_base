import { api } from "./api";
import { Appointment } from "../types";

export const createAppointment = async (data: Partial<Appointment>) => {
  const res = await api.post("/appointments", data);
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
