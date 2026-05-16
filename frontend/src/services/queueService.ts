import { api } from "./api";
import type { QueueItem } from "../types";

export const getQueue = async () => {
  const res = await api.get("/queue");
  return res.data;
};

export const addToQueue = async (data: Partial<QueueItem>) => {
  const res = await api.post("/queue/add", data);
  return res.data;
};

export const callNext = async () => {
  const res = await api.post("/queue/call-next");
  return res.data;
};

export const completeQueue = async (id: number) => {
  await api.post(`/queue/complete/${id}`);
};

export const skipQueue = async (id: number) => {
  await api.post(`/queue/skip/${id}`);
};
