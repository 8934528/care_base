import { api } from "./api";

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
}

export interface DoctorAvailableDates {
  doctorId: number;
  doctorName: string;
  availableDates: string[];
}

export const getDoctors = async (todayOnly = false) => {
  const res = await api.get<Doctor[]>(`/staff/doctors?todayOnly=${todayOnly}`);
  return res.data;
};

export const getDoctorAvailableDates = async (doctorId: number) => {
  const res = await api.get<DoctorAvailableDates>(`/staff/doctors/${doctorId}/available-dates`);
  return res.data;
};
