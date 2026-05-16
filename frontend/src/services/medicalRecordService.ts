import { api } from "./api";

export const createMedicalRecord = async (data: any) => {
  const res = await api.post("/medical-records", data);
  return res.data;
};

export const getPatientHistory = async (patientId: number) => {
  const res = await api.get(`/medical-records/patient/${patientId}`);
  return res.data;
};

export const getMedicalRecord = async (id: number) => {
  const res = await api.get(`/medical-records/${id}`);
  return res.data;
};
