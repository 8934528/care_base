import { api } from "./api";

export const registerPatient = async (data: Record<string, unknown>) => {
  const res = await api.post("/patients", data);
  return res.data;
};

export const searchPatients = async (keyword: string) => {
  const res = await api.get(`/patients/search?keyword=${keyword}`);
  return res.data;
};

export const getPatientByRef = async (ref: string) => {
  const res = await api.get(`/patients/${ref}`);
  return res.data;
};
