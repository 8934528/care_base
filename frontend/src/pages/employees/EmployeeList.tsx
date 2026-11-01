import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getEmployees,
  createEmployee,
  updateAccountStatus,
  resetEmployeePassword,
  getRoles,
  getDepartments,
  type CreateEmployeePayload
} from '../../services/employeeService';
import type { Employee, Department } from '../../types';
import {
  Card,
  Button,
  IconButton,
  Badge,
  Modal,
  ConfirmModal,
  PageHeader,
  EmptyState,
  LoadingSpinner
} from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function EmployeeList() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<{ id: number; roleName: string; description: string }[]>([]);

  // Add Employee Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [newEmployee, setNewEmployee] = useState<CreateEmployeePayload>({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
    jobTitle: '',
    departmentId: undefined,
    roleId: 0,
    professionalRegistration: '',
    temporaryPassword: '',
    shiftName: 'Standard',
    workingDays: [1, 2, 3, 4, 5]
  });

  // Action Modals State
  const [confirmStatusModal, setConfirmStatusModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    targetStatus: string;
  }>({ isOpen: false, employee: null, targetStatus: '' });

  const [resetPwModal, setResetPwModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    newPassword: string;
  }>({ isOpen: false, employee: null, newPassword: '' });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search: search || undefined,
        departmentId: departmentId || undefined,
        role: role !== 'All' ? role : undefined,
        status: status !== 'All' ? status : undefined,
        page,
        pageSize
      });
      setEmployees(res.items);
      setTotalCount(res.totalCount);
      setActiveCount(res.activeCount);
      setInactiveCount(res.inactiveCount);
    } catch {
      showToast('Unable to load employee directory.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, departmentId, role, status, page, showToast]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [depts, rls] = await Promise.all([getDepartments(), getRoles()]);
        setDepartments(depts);
        setRoles(rls);
        if (rls.length > 0 && newEmployee.roleId === 0) {
          setNewEmployee((prev) => ({ ...prev, roleId: rls[0].id }));
        }
      } catch {
        // Fallback
      }
    };
    fetchMetadata();
  }, [newEmployee.roleId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.fullName || !newEmployee.email || !newEmployee.temporaryPassword) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }
    setCreateSubmitting(true);
    try {
      await createEmployee(newEmployee);
      showToast('Employee created.', 'success');
      setIsAddModalOpen(false);
      setNewEmployee({
        fullName: '',
        preferredName: '',
        email: '',
        phone: '',
        jobTitle: '',
        departmentId: departments[0]?.id,
        roleId: roles[0]?.id || 1,
        professionalRegistration: '',
        temporaryPassword: '',
        shiftName: 'Standard',
        workingDays: [1, 2, 3, 4, 5]
      });
      fetchEmployees();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Unable to save employee.', 'danger');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleStatusChangeConfirm = async () => {
    if (!confirmStatusModal.employee) return;
    setActionLoading(true);
    try {
      await updateAccountStatus(confirmStatusModal.employee.id, confirmStatusModal.targetStatus);
      showToast(
        confirmStatusModal.targetStatus === 'Active'
          ? 'Account activated.'
          : 'Account deactivated.',
        'success'
      );
      setConfirmStatusModal({ isOpen: false, employee: null, targetStatus: '' });
      fetchEmployees();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to update account status.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwModal.employee || !resetPwModal.newPassword) return;
    setActionLoading(true);
    try {
      await resetEmployeePassword(resetPwModal.employee.id, resetPwModal.newPassword);
      showToast('Password reset.', 'success');
      setResetPwModal({ isOpen: false, employee: null, newPassword: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to reset password.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleWorkingDay = (day: number) => {
    const current = newEmployee.workingDays || [];
    if (current.includes(day)) {
      setNewEmployee({ ...newEmployee, workingDays: current.filter((d) => d !== day) });
    } else {
      setNewEmployee({ ...newEmployee, workingDays: [...current, day].sort() });
    }
  };

  const daysOfWeek = [
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
    { id: 0, label: 'Sun' }
  ];

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Employee Management"
        subtitle="Healthcare staff accounts, access credentials, and facility scheduling"
        actions={
          <Button
            variant="primary"
            icon="bi-person-plus"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add employee
          </Button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Total Employees</span>
                <h3 className="m-0 mt-1">{totalCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-primary">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Active Accounts</span>
                <h3 className="m-0 mt-1 text-success">{activeCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-success">
                <i className="bi bi-person-check"></i>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="cb-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Inactive / Deactivated</span>
                <h3 className="m-0 mt-1 text-secondary">{inactiveCount}</h3>
              </div>
              <div className="cb-stat-icon cb-stat-icon-muted">
                <i className="bi bi-person-x"></i>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Directory Filter Bar */}
      <Card className="mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <div className="cb-search-input-group">
              <i className="bi bi-search cb-search-icon"></i>
              <input
                type="text"
                className="form-control cb-form-control"
                placeholder="Search by name, ID, or job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="cb-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select cb-form-select"
              value={departmentId || ''}
              onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select cb-form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="All">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2">
            <select
              className="form-select cb-form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by account status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Employee Table */}
      <Card>
        {loading ? (
          <LoadingSpinner message="Loading employee directory..." />
        ) : employees.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title="No employees found"
            message="No staff members match the selected filters or criteria."
            action={
              <Button
                variant="primary"
                size="sm"
                icon="bi-person-plus"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add employee
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="table cb-table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Employee ID</th>
                  <th scope="col">Department</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last Login</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="cb-avatar me-2">
                          {emp.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{emp.fullName}</div>
                          <div className="small text-muted">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="cb-code-pill">{emp.employeeId || `EMP-${emp.id}`}</code>
                    </td>
                    <td>{emp.departmentName || <span className="text-muted">Unassigned</span>}</td>
                    <td>
                      <span className="cb-role-tag">{emp.roleName}</span>
                    </td>
                    <td>
                      <Badge status={emp.accountStatus} />
                    </td>
                    <td>
                      <span className="small text-muted">
                        {emp.lastLogin
                          ? new Date(emp.lastLogin).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <IconButton
                          icon="bi-person-lines-fill"
                          label="View Profile"
                          tooltip="View employee profile"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        />
                        <IconButton
                          icon="bi-key"
                          label="Reset Password"
                          tooltip="Reset employee password"
                          onClick={() =>
                            setResetPwModal({
                              isOpen: true,
                              employee: emp,
                              newPassword: ''
                            })
                          }
                        />
                        {emp.isActive ? (
                          <IconButton
                            icon="bi-person-dash"
                            label="Deactivate Account"
                            tooltip="Deactivate account"
                            variant="danger"
                            onClick={() =>
                              setConfirmStatusModal({
                                isOpen: true,
                                employee: emp,
                                targetStatus: 'Deactivated'
                              })
                            }
                          />
                        ) : (
                          <IconButton
                            icon="bi-person-check"
                            label="Activate Account"
                            tooltip="Activate account"
                            variant="primary"
                            onClick={() =>
                              setConfirmStatusModal({
                                isOpen: true,
                                employee: emp,
                                targetStatus: 'Active'
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="cb-pagination d-flex align-items-center justify-content-between p-3 border-top">
            <span className="small text-muted">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount} employees
            </span>
            <div className="d-flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page * pageSize >= totalCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Employee"
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
              disabled={createSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSubmit}
              loading={createSubmitting}
            >
              Save employee
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="cb-form">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-fullname">Full Name *</label>
              <input
                id="emp-fullname"
                type="text"
                className="form-control cb-form-control"
                placeholder="e.g. Dr. Lerato Ndlovu"
                value={newEmployee.fullName}
                onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-preferredname">Preferred Name</label>
              <input
                id="emp-preferredname"
                type="text"
                className="form-control cb-form-control"
                placeholder="e.g. Lerato"
                value={newEmployee.preferredName || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, preferredName: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-email">Email Address *</label>
              <input
                id="emp-email"
                type="email"
                className="form-control cb-form-control"
                placeholder="staff@carebase.com"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-phone">Contact Phone</label>
              <input
                id="emp-phone"
                type="tel"
                className="form-control cb-form-control"
                placeholder="+27 82 000 0000"
                value={newEmployee.phone || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="emp-role">System Role *</label>
              <select
                id="emp-role"
                className="form-select cb-form-select"
                value={newEmployee.roleId}
                onChange={(e) => setNewEmployee({ ...newEmployee, roleId: Number(e.target.value) })}
                required
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roleName} - {r.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="emp-dept">Department</label>
              <select
                id="emp-dept"
                className="form-select cb-form-select"
                value={newEmployee.departmentId || ''}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    departmentId: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="emp-jobtitle">Job Title</label>
              <input
                id="emp-jobtitle"
                type="text"
                className="form-control cb-form-control"
                placeholder="e.g. Senior Medical Officer"
                value={newEmployee.jobTitle || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-reg">Professional Council Number</label>
              <input
                id="emp-reg"
                type="text"
                className="form-control cb-form-control"
                placeholder="e.g. MP 0123456 (HPCSA / SANC)"
                value={newEmployee.professionalRegistration || ''}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, professionalRegistration: e.target.value })
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="emp-temppw">Temporary Initial Password *</label>
              <input
                id="emp-temppw"
                type="password"
                className="form-control cb-form-control"
                placeholder="Temporary onboarding credential"
                value={newEmployee.temporaryPassword}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, temporaryPassword: e.target.value })
                }
                required
              />
              <span className="small text-muted">Employee will be prompted to change on first login.</span>
            </div>

            {/* Schedule & Working Days */}
            <div className="col-12">
              <label className="form-label d-block">Scheduled Working Days</label>
              <div className="d-flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isChecked = (newEmployee.workingDays || []).includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      className={`btn btn-sm cb-day-toggle ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleWorkingDay(day.id)}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivation / Activation Modal */}
      <ConfirmModal
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ isOpen: false, employee: null, targetStatus: '' })}
        onConfirm={handleStatusChangeConfirm}
        title={
          confirmStatusModal.targetStatus === 'Active'
            ? 'Activate Account'
            : 'Deactivate Account'
        }
        message={
          confirmStatusModal.targetStatus === 'Active'
            ? `Are you sure you want to restore active system access for ${confirmStatusModal.employee?.fullName}?`
            : `Are you sure you want to deactivate ${confirmStatusModal.employee?.fullName}? Active sessions will be revoked and login blocked.`
        }
        confirmText={
          confirmStatusModal.targetStatus === 'Active' ? 'Activate' : 'Deactivate'
        }
        variant={confirmStatusModal.targetStatus === 'Active' ? 'primary' : 'danger'}
        loading={actionLoading}
      />

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetPwModal.isOpen}
        onClose={() => setResetPwModal({ isOpen: false, employee: null, newPassword: '' })}
        title="Reset Credentials"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setResetPwModal({ isOpen: false, employee: null, newPassword: '' })}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleResetPasswordSubmit}
              loading={actionLoading}
            >
              Reset password
            </Button>
          </>
        }
      >
        <form onSubmit={handleResetPasswordSubmit}>
          <p className="small text-muted mb-3">
            Assign a new temporary password for <strong>{resetPwModal.employee?.fullName}</strong>.
          </p>
          <div className="mb-3">
            <label className="form-label" htmlFor="reset-new-pw">New Password</label>
            <input
              id="reset-new-pw"
              type="password"
              className="form-control cb-form-control"
              placeholder="Min. 6 characters"
              value={resetPwModal.newPassword}
              onChange={(e) =>
                setResetPwModal({ ...resetPwModal, newPassword: e.target.value })
              }
              required
              minLength={6}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

