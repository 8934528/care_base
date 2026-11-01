import { api } from './api';
import type { Employee, EmployeeDetail, Department, StaffAvailabilityItem } from '../types';

export interface EmployeesResponse {
  items: Employee[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  pendingCount: number;
  page: number;
  pageSize: number;
}

export interface CreateEmployeePayload {
  fullName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  departmentId?: number;
  roleId: number;
  professionalRegistration?: string;
  employmentStartDate?: string;
  temporaryPassword: string;
  shiftName?: string;
  workingDays?: number[];
}

export interface UpdateEmployeePayload {
  fullName: string;
  preferredName?: string;
  phone?: string;
  jobTitle?: string;
  departmentId?: number;
  roleId: number;
  professionalRegistration?: string;
  employmentStartDate?: string;
  employmentEndDate?: string;
}

export const getEmployees = async (params: {
  search?: string;
  departmentId?: number;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<EmployeesResponse> => {
  const res = await api.get('/employees', { params });
  return res.data;
};

export const getEmployeeById = async (id: number): Promise<EmployeeDetail> => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};

export const createEmployee = async (payload: CreateEmployeePayload): Promise<Employee> => {
  const res = await api.post('/employees', payload);
  return res.data;
};

export const updateEmployee = async (id: number, payload: UpdateEmployeePayload): Promise<Employee> => {
  const res = await api.put(`/employees/${id}`, payload);
  return res.data;
};

export const updateAccountStatus = async (id: number, status: string, reason?: string): Promise<void> => {
  await api.put(`/employees/${id}/status`, { status, reason });
};

export const resetEmployeePassword = async (id: number, newPassword: string): Promise<void> => {
  await api.post(`/employees/${id}/reset-password`, { newPassword });
};

export const getStaffAvailability = async (userId: number): Promise<StaffAvailabilityItem[]> => {
  const res = await api.get(`/employees/${userId}/availability`);
  return res.data;
};

export const updateStaffAvailability = async (
  userId: number,
  availabilities: StaffAvailabilityItem[]
): Promise<void> => {
  await api.put(`/employees/${userId}/availability`, availabilities);
};

export const getRoles = async (): Promise<{ id: number; roleName: string; description: string }[]> => {
  const res = await api.get('/employees/roles');
  return res.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const res = await api.get('/departments');
  return res.data;
};

export const createDepartment = async (payload: { name: string; code: string; description?: string }): Promise<Department> => {
  const res = await api.post('/departments', payload);
  return res.data;
};

export const getAuditLogs = async (params: {
  module?: string;
  action?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) => {
  const res = await api.get('/audit-logs', { params });
  return res.data;
};

