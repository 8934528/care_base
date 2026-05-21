import { api } from "./api";

export interface NotificationRecord {
  id: number;
  patientId: number;
  appointmentId?: number;
  notificationType?: string;
  channel?: string;
  recipient?: string;
  message?: string;
  status: string;
  sentAt?: string;
  createdAt: string;
  patient?: { firstName: string; lastName: string; patientRef: string };
}

export const getNotifications = async () => {
  const res = await api.get<NotificationRecord[]>("/notifications");
  return res.data;
};
