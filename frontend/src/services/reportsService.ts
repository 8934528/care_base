import { api } from "./api";

export interface ReportsData {
  totalPatients: number;
  todayAppointments: number;
  currentQueue: number;
  completedToday: number;
  diseaseTrends: Array<{ disease: string; totalCases: number }>;
  genderStats: Array<{ gender: string; total: number }>;
  appointmentStats: Array<{ status: string; total: number }>;
  monthlyVisits: Array<{ month: string; totalVisits: number }>;
}

export const getReports = async () => {
  const res = await api.get<ReportsData>("/reports");
  return res.data;
};
