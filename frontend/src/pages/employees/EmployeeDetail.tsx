import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getEmployeeById,
  updateEmployee,
  updateAccountStatus,
  resetEmployeePassword,
  updateStaffAvailability,
  getRoles,
  getDepartments,
  type UpdateEmployeePayload
} from '../../services/employeeService';
import type { EmployeeDetail as EmployeeDetailType, Department, StaffAvailabilityItem } from '../../types';
import {
  Card,
  Button,
  Badge,
  Modal,
  ConfirmModal,
  PageHeader,
  LoadingSpinner
} from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [employee, setEmployee] = useState<EmployeeDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<{ id: number; roleName: string; description: string }[]>([]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateEmployeePayload>({
    fullName: '',
    preferredName: '',
    phone: '',
    jobTitle: '',
    departmentId: undefined,
    roleId: 0,
    professionalRegistration: '',
    employmentStartDate: '',
    employmentEndDate: ''
  });

  // Availability Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<StaffAvailabilityItem[]>([]);

  // Security Action Modals
  const [confirmStatusModal, setConfirmStatusModal] = useState<{
    isOpen: boolean;
    targetStatus: string;
    reason: string;
  }>({ isOpen: false, targetStatus: '', reason: '' });

  const [resetPwModal, setResetPwModal] = useState<{
    isOpen: boolean;
    newPassword: string;
  }>({ isOpen: false, newPassword: '' });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getEmployeeById(Number(id));
      setEmployee(data);
      setEditForm({
        fullName: data.fullName,
        preferredName: data.preferredName || '',
        phone: data.phone || '',
        jobTitle: data.jobTitle || '',
        departmentId: data.departmentId,
        roleId: data.roleId,
        professionalRegistration: data.professionalRegistration || '',
        employmentStartDate: data.employmentStartDate ? data.employmentStartDate.split('T')[0] : '',
        employmentEndDate: data.employmentEndDate ? data.employmentEndDate.split('T')[0] : ''
      });
      setScheduleItems(data.availability || []);
    } catch {
      showToast('Unable to load employee profile.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [depts, rls] = await Promise.all([getDepartments(), getRoles()]);
        setDepartments(depts);
        setRoles(rls);
      } catch {
        // Fallback
      }
    };
    fetchMetadata();
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    setActionLoading(true);
    try {
      await updateEmployee(employee.id, editForm);
      showToast('Changes saved.', 'success');
      setIsEditModalOpen(false);
      fetchEmployeeData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Unable to save employee details.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChangeConfirm = async () => {
    if (!employee) return;
    setActionLoading(true);
    try {
      await updateAccountStatus(employee.id, confirmStatusModal.targetStatus, confirmStatusModal.reason);
      showToast(
        confirmStatusModal.targetStatus === 'Active' ? 'Account activated.' : 'Account status updated.',
        'success'
      );
      setConfirmStatusModal({ isOpen: false, targetStatus: '', reason: '' });
      fetchEmployeeData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to update account status.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !resetPwModal.newPassword) return;
    setActionLoading(true);
    try {
      await resetEmployeePassword(employee.id, resetPwModal.newPassword);
      showToast('Password reset.', 'success');
      setResetPwModal({ isOpen: false, newPassword: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to reset password.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!employee) return;
    setActionLoading(true);
    try {
      await updateStaffAvailability(employee.id, scheduleItems);
      showToast('Work schedule updated.', 'success');
      setIsScheduleModalOpen(false);
      fetchEmployeeData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to update schedule.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) return <LoadingSpinner message="Loading employee profile..." />;
  if (!employee) {
    return (
      <div className="cb-page text-center py-5">
        <h4>Employee not found</h4>
        <Button variant="outline" className="mt-3" onClick={() => navigate('/employees')}>
          Back to Employee List
        </Button>
      </div>
    );
  }

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title={employee.fullName}
        subtitle={`${employee.jobTitle || employee.roleName} • ${employee.departmentName || 'General Facility'}`}
        badge={<Badge status={employee.accountStatus} />}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" icon="bi-arrow-left" onClick={() => navigate('/employees')}>
              Back
            </Button>
            <Button variant="secondary" icon="bi-pencil" onClick={() => setIsEditModalOpen(true)}>
              Edit
            </Button>
            <Button
              variant="outline"
              icon="bi-key"
              onClick={() => setResetPwModal({ isOpen: true, newPassword: '' })}
            >
              Reset credentials
            </Button>
            {employee.isActive ? (
              <Button
                variant="danger"
                icon="bi-person-dash"
                onClick={() =>
                  setConfirmStatusModal({
                    isOpen: true,
                    targetStatus: 'Deactivated',
                    reason: ''
                  })
                }
              >
                Deactivate
              </Button>
            ) : (
              <Button
                variant="primary"
                icon="bi-person-check"
                onClick={() =>
                  setConfirmStatusModal({
                    isOpen: true,
                    targetStatus: 'Active',
                    reason: ''
                  })
                }
              >
                Activate
              </Button>
            )}
          </div>
        }
      />

      <div className="row g-3">
        {/* Left Column: Employment Info & Access */}
        <div className="col-12 col-lg-4">
          <Card title="Employee Profile" className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="cb-avatar cb-avatar-lg me-3">
                {employee.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="m-0">{employee.fullName}</h5>
                {employee.preferredName && (
                  <span className="small text-muted">({employee.preferredName})</span>
                )}
                <div className="small text-muted">{employee.email}</div>
              </div>
            </div>

            <div className="cb-profile-field-list">
              <div className="cb-profile-field">
                <span className="text-muted small">Employee ID</span>
                <code>{employee.employeeId || `EMP-${employee.id}`}</code>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Department</span>
                <span>{employee.departmentName || 'Unassigned'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Role</span>
                <span className="cb-role-tag">{employee.roleName}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Job Title</span>
                <span>{employee.jobTitle || 'Staff Member'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Phone</span>
                <span>{employee.phone || 'Not provided'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Professional Reg.</span>
                <span>{employee.professionalRegistration || 'N/A'}</span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Start Date</span>
                <span>
                  {employee.employmentStartDate
                    ? new Date(employee.employmentStartDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="cb-profile-field">
                <span className="text-muted small">Last Login</span>
                <span>
                  {employee.lastLogin
                    ? new Date(employee.lastLogin).toLocaleString()
                    : 'Never logged in'}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Permissions & Access">
            <p className="small text-muted mb-2">
              Capabilities granted by <strong>{employee.roleName}</strong>:
            </p>
            <div className="d-flex flex-wrap gap-1">
              {employee.permissions.map((perm) => (
                <span key={perm} className="cb-perm-badge">
                  {perm}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Schedule & Activity Log */}
        <div className="col-12 col-lg-8">
          {/* Availability Schedule */}
          <Card
            title="Work Schedule & Availability"
            subtitle="Working hours utilized during appointment booking and queue dispatch"
            actions={
              <Button
                variant="outline"
                size="sm"
                icon="bi-calendar-check"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                Manage schedule
              </Button>
            }
            className="mb-3"
          >
            {employee.availability.length === 0 ? (
              <p className="text-muted m-0 py-3">No work schedule configured. Add availability to enable appointment scheduling.</p>
            ) : (
              <div className="table-responsive">
                <table className="table cb-table align-middle m-0">
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Hours</th>
                      <th scope="col">Shift</th>
                      <th scope="col">Location / Room</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.availability.map((av) => (
                      <tr key={av.id || av.dayOfWeek}>
                        <td className="fw-semibold">{dayNames[av.dayOfWeek]}</td>
                        <td>
                          {av.startTime.substring(0, 5)} - {av.endTime.substring(0, 5)}
                        </td>
                        <td>{av.shiftName || 'Standard'}</td>
                        <td>{av.clinicLocation || 'General Clinic'}</td>
                        <td>
                          <Badge status={av.isAvailable ? 'Active' : 'Inactive'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Activity / Audit Log */}
          <Card title="Recent Activity & Audit Trail">
            {employee.recentActivity.length === 0 ? (
              <p className="text-muted m-0 py-3">No recorded activity for this employee yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table cb-table align-middle m-0">
                  <thead>
                    <tr>
                      <th scope="col">Action</th>
                      <th scope="col">Module</th>
                      <th scope="col">Details</th>
                      <th scope="col">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.recentActivity.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className="fw-semibold">{log.action}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{log.module}</span>
                        </td>
                        <td className="small text-muted">{log.details}</td>
                        <td className="small text-muted">
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee Information"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit} loading={actionLoading}>
              Save changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-name">Full Name *</label>
              <input
                id="edit-name"
                type="text"
                className="form-control cb-form-control"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-pref">Preferred Name</label>
              <input
                id="edit-pref"
                type="text"
                className="form-control cb-form-control"
                value={editForm.preferredName || ''}
                onChange={(e) => setEditForm({ ...editForm, preferredName: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-phone">Phone</label>
              <input
                id="edit-phone"
                type="tel"
                className="form-control cb-form-control"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-title">Job Title</label>
              <input
                id="edit-title"
                type="text"
                className="form-control cb-form-control"
                value={editForm.jobTitle || ''}
                onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-role">System Role *</label>
              <select
                id="edit-role"
                className="form-select cb-form-select"
                value={editForm.roleId}
                onChange={(e) => setEditForm({ ...editForm, roleId: Number(e.target.value) })}
                required
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-dept">Department</label>
              <select
                id="edit-dept"
                className="form-select cb-form-select"
                value={editForm.departmentId || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    departmentId: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              >
                <option value="">Unassigned</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="edit-reg">Professional Council Number</label>
              <input
                id="edit-reg"
                type="text"
                className="form-control cb-form-control"
                value={editForm.professionalRegistration || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, professionalRegistration: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Schedule Editor Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Manage Work Schedule"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsScheduleModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSchedule} loading={actionLoading}>
              Save schedule
            </Button>
          </>
        }
      >
        <p className="small text-muted mb-3">
          Configure active working days and hours for {employee.fullName}.
        </p>
        <div className="d-flex flex-column gap-2">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const existing = scheduleItems.find((s) => s.dayOfWeek === dayIdx);
            const isAssigned = !!existing && existing.isAvailable;
            return (
              <div
                key={dayIdx}
                className="d-flex align-items-center justify-content-between p-2 border rounded"
              >
                <span className="fw-semibold">{dayNames[dayIdx]}</span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${isAssigned ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      if (existing) {
                        setScheduleItems(
                          scheduleItems.map((s) =>
                            s.dayOfWeek === dayIdx ? { ...s, isAvailable: !s.isAvailable } : s
                          )
                        );
                      } else {
                        setScheduleItems([
                          ...scheduleItems,
                          {
                            dayOfWeek: dayIdx,
                            startTime: '08:00:00',
                            endTime: '17:00:00',
                            shiftName: 'Standard',
                            isAvailable: true
                          }
                        ]);
                      }
                    }}
                  >
                    {isAssigned ? 'Working' : 'Off'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Confirm Deactivation Modal */}
      <ConfirmModal
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ isOpen: false, targetStatus: '', reason: '' })}
        onConfirm={handleStatusChangeConfirm}
        title={confirmStatusModal.targetStatus === 'Active' ? 'Activate Account' : 'Deactivate Account'}
        message={
          confirmStatusModal.targetStatus === 'Active'
            ? `Restore active system access for ${employee.fullName}?`
            : `Deactivate ${employee.fullName}? System access will be revoked immediately.`
        }
        confirmText={confirmStatusModal.targetStatus === 'Active' ? 'Activate' : 'Deactivate'}
        variant={confirmStatusModal.targetStatus === 'Active' ? 'primary' : 'danger'}
        loading={actionLoading}
      />

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetPwModal.isOpen}
        onClose={() => setResetPwModal({ isOpen: false, newPassword: '' })}
        title="Reset Password"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetPwModal({ isOpen: false, newPassword: '' })} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResetPasswordSubmit} loading={actionLoading}>
              Reset password
            </Button>
          </>
        }
      >
        <form onSubmit={handleResetPasswordSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="detail-reset-pw">New Temporary Password</label>
            <input
              id="detail-reset-pw"
              type="password"
              className="form-control cb-form-control"
              placeholder="Min. 6 characters"
              value={resetPwModal.newPassword}
              onChange={(e) => setResetPwModal({ ...resetPwModal, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

