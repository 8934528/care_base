import { api } from "./api";
import type { Patient } from "../types";

export const registerPatient = async (data: Record<string, unknown>): Promise<Patient> => {
  const res = await api.post("/patients", data);
  return res.data;
};

export const searchPatients = async (keyword: string): Promise<Patient[]> => {
  const res = await api.get(`/patients/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};

export const getPatientByRef = async (ref: string): Promise<Patient> => {
  const res = await api.get(`/patients/ref/${encodeURIComponent(ref)}`);
  return res.data;
};

export const getPatientById = async (id: number): Promise<Patient> => {
  const res = await api.get(`/patients/${id}`);
  return res.data;
};
