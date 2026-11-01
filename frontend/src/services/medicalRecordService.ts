import { api } from "./api";
import type { MedicalRecord } from "../types";

export const createMedicalRecord = async (data: Record<string, unknown>): Promise<MedicalRecord> => {
  const res = await api.post("/records", data);
  return res.data;
};

export const getPatientHistory = async (patientId: number): Promise<MedicalRecord[]> => {
  const res = await api.get(`/records/patient/${patientId}`);
  return res.data;
};

export const getMedicalRecord = async (id: number): Promise<MedicalRecord> => {
  const res = await api.get(`/records/${id}`);
  return res.data;
};

export const amendMedicalRecord = async (
  id: number,
  record: Record<string, unknown>,
  reason: string
): Promise<MedicalRecord> => {
  const res = await api.put(`/records/${id}/amend`, { record, reason });
  return res.data;
};
