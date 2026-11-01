import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs } from '../../services/employeeService';
import type { AuditLogItem } from '../../types';
import {
  Card,
  Button,
  Badge,
  PageHeader,
  EmptyState,
  LoadingSpinner
} from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function AuditLogs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [module, setModule] = useState('All');
  const [action, setAction] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs({
        search: search || undefined,
        module: module !== 'All' ? module : undefined,
        action: action !== 'All' ? action : undefined,
        page,
        pageSize
      });
      setLogs(res.items);
      setTotalCount(res.totalCount);
    } catch {
      showToast('Unable to load audit logs.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, module, action, page, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable security trail of system access, medical records, and administrative changes"
      />

      <Card className="mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="cb-search-input-group">
              <i className="bi bi-search cb-search-icon"></i>
              <input
                type="text"
                className="form-control cb-form-control"
                placeholder="Search audit trail by user, details, or ID..."
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
              value={module}
              onChange={(e) => setModule(e.target.value)}
              aria-label="Filter by module"
            >
              <option value="All">All Modules</option>
              <option value="Auth">Auth & Security</option>
              <option value="Employees">Employee Management</option>
              <option value="Clinical">Clinical Records</option>
              <option value="Patients">Patients</option>
              <option value="Appointments">Appointments</option>
              <option value="Queue">Queue</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select cb-form-select"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              aria-label="Filter by action"
            >
              <option value="All">All Actions</option>
              <option value="Login">Login</option>
              <option value="LoginFailed">Failed Login</option>
              <option value="Logout">Logout</option>
              <option value="EmployeeCreated">Employee Created</option>
              <option value="EmployeeUpdated">Employee Updated</option>
              <option value="AccountStatusChanged">Status Changed</option>
              <option value="PasswordReset">Password Reset</option>
              <option value="MedicalRecordCreated">Record Created</option>
              <option value="MedicalRecordAmended">Record Amended</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner message="Retrieving audit records..." />
        ) : logs.length === 0 ? (
          <EmptyState
            icon="bi-shield-check"
            title="No audit entries"
            message="No system audit records match the current filters."
          />
        ) : (
          <div className="table-responsive">
            <table className="table cb-table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">User</th>
                  <th scope="col">Action</th>
                  <th scope="col">Module</th>
                  <th scope="col">Details</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="small text-muted">
                        {new Date(log.timestamp).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="fw-semibold text-dark">{log.userName || 'Anonymous'}</span>
                        {log.userRole && (
                          <div className="small text-muted">{log.userRole}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <code className="cb-code-pill">{log.action}</code>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{log.module}</span>
                    </td>
                    <td className="small text-muted">{log.details}</td>
                    <td>
                      <Badge
                        status={log.result}
                        variant={log.result === 'Success' ? 'active' : 'cancelled'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalCount > pageSize && (
          <div className="cb-pagination d-flex align-items-center justify-content-between p-3 border-top">
            <span className="small text-muted">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount} records
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
    </div>
  );
}

