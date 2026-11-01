import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from "recharts";
import { getDashboard } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";
import type { DashboardData } from "../../types";
import { Card, Button, Badge, PageHeader, LoadingSpinner, EmptyState } from "../../components/common";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        const result = await getDashboard();
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <LoadingSpinner message="Loading operational dashboard..." />;
  if (!data) {
    return (
      <EmptyState
        icon="bi-cloud-slash"
        title="Unable to load dashboard"
        message="Please check facility service connectivity."
      />
    );
  }

  const role = user?.role || "Admin";
  const CHART_COLORS = ['#0f766e', '#0369a1', '#b45309', '#b91c1c', '#64748b'];

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title={`${role} Dashboard`}
        subtitle={`Welcome back, ${user?.fullName}. Operational overview for ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
        actions={
          role === "Admin" || role === "Manager" ? (
            <div className="d-flex gap-2">
              <Button variant="outline" icon="bi-person-badge" onClick={() => navigate('/employees')}>
                Manage employees
              </Button>
              <Button variant="outline" icon="bi-shield-check" onClick={() => navigate('/audit-logs')}>
                Audit trail
              </Button>
            </div>
          ) : role === "Doctor" ? (
            <Button variant="primary" icon="bi-calendar3" onClick={() => navigate('/appointments')}>
              My appointments
            </Button>
          ) : (
            <Button variant="primary" icon="bi-person-plus" onClick={() => navigate('/patients/register')}>
              Register patient
            </Button>
          )
        }
      />

      {/* Primary KPI Row */}
      <div className="row g-3 mb-4">
        {role === "Admin" || role === "Manager" ? (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Total Employees</span>
                <h3 className="m-0 mt-1">{data.totalEmployees}</h3>
                <span className="small text-success">{data.activeEmployees} active accounts</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Registered Patients</span>
                <h3 className="m-0 mt-1">{data.totalPatients}</h3>
                <span className="small text-muted">Facility records</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Today's Visits</span>
                <h3 className="m-0 mt-1 text-primary">{data.dailyVisits}</h3>
                <span className="small text-muted">{data.todayAppointments} scheduled</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Active Queue</span>
                <h3 className="m-0 mt-1 text-warning">{data.queueLoad}</h3>
                <span className="small text-muted">{data.completedConsultations} completed today</span>
              </Card>
            </div>
          </>
        ) : role === "Doctor" ? (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Today's Appointments</span>
                <h3 className="m-0 mt-1 text-primary">{data.roleAppointments?.length || 0}</h3>
                <span className="small text-muted">Assigned consultations</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Waiting in Queue</span>
                <h3 className="m-0 mt-1 text-warning">{data.queueLoad}</h3>
                <span className="small text-muted">Facility waiting room</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Pending Follow-ups</span>
                <h3 className="m-0 mt-1">{data.pendingFollowUps}</h3>
                <span className="small text-muted">Next 7 days</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Completed Today</span>
                <h3 className="m-0 mt-1 text-success">{data.completedConsultations}</h3>
                <span className="small text-muted">Finalised records</span>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Waiting in Queue</span>
                <h3 className="m-0 mt-1 text-warning">{data.queueLoad}</h3>
                <span className="small text-muted">Current triage volume</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Today's Appointments</span>
                <h3 className="m-0 mt-1">{data.todayAppointments}</h3>
                <span className="small text-muted">Booked for today</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">Consultations Completed</span>
                <h3 className="m-0 mt-1 text-success">{data.completedConsultations}</h3>
                <span className="small text-muted">Processed today</span>
              </Card>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <Card className="cb-stat-card">
                <span className="text-muted small">On-Duty Doctors</span>
                <h3 className="m-0 mt-1 text-primary">{data.activeDoctors}</h3>
                <span className="small text-muted">Available clinicians</span>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Role-Specific Workflows & Operational Panels */}
      {role === "Doctor" ? (
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-7">
            <Card
              title="Today's Assigned Appointments"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
                  View all
                </Button>
              }
            >
              {!data.roleAppointments || data.roleAppointments.length === 0 ? (
                <p className="text-muted m-0 py-3">No appointments scheduled for you today.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table cb-table align-middle m-0">
                    <thead>
                      <tr>
                        <th scope="col">Time</th>
                        <th scope="col">Patient</th>
                        <th scope="col">Type</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.roleAppointments.map((apt) => (
                        <tr key={apt.id}>
                          <td className="fw-semibold">
                            {typeof apt.startTime === 'string' ? apt.startTime.substring(0, 5) : apt.startTime}
                          </td>
                          <td>{apt.patientName}</td>
                          <td>{apt.appointmentType}</td>
                          <td>
                            <Badge status={apt.priority} />
                          </td>
                          <td>
                            <Badge status={apt.status} />
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/records/${apt.patientId}`)}
                            >
                              Clinical record
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="col-12 col-lg-5">
            <Card
              title="Current Waiting Room Queue"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/queue')}>
                  Open queue
                </Button>
              }
            >
              {!data.roleQueueItems || data.roleQueueItems.length === 0 ? (
                <p className="text-muted m-0 py-3">Queue is currently clear.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {data.roleQueueItems.slice(0, 5).map((q) => (
                    <div
                      key={q.id}
                      className="d-flex align-items-center justify-content-between p-2 border rounded"
                    >
                      <div>
                        <code className="cb-code-pill me-2">{q.queueNumber}</code>
                        <span className="fw-semibold">{q.patientRef}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge status={q.priority} />
                        <Badge status={q.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : role === "Nurse" || role === "Clerk" ? (
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-7">
            <Card
              title="Live Patient Queue"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/queue')}>
                  Full queue
                </Button>
              }
            >
              {!data.roleQueueItems || data.roleQueueItems.length === 0 ? (
                <p className="text-muted m-0 py-3">No patients waiting in queue.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table cb-table align-middle m-0">
                    <thead>
                      <tr>
                        <th scope="col">Queue #</th>
                        <th scope="col">Patient Ref</th>
                        <th scope="col">Assigned Clinician</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.roleQueueItems.map((q) => (
                        <tr key={q.id}>
                          <td>
                            <code className="cb-code-pill">{q.queueNumber}</code>
                          </td>
                          <td className="fw-semibold">{q.patientRef}</td>
                          <td>{q.assignedTo}</td>
                          <td>
                            <Badge status={q.priority} />
                          </td>
                          <td>
                            <Badge status={q.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="col-12 col-lg-5">
            <Card
              title="Today's Appointments"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/appointments/daily')}>
                  Check-in list
                </Button>
              }
            >
              {!data.roleAppointments || data.roleAppointments.length === 0 ? (
                <p className="text-muted m-0 py-3">No appointments scheduled for today.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {data.roleAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="d-flex align-items-center justify-content-between p-2 border rounded"
                    >
                      <div>
                        <span className="fw-semibold me-2">{apt.patientName}</span>
                        <span className="small text-muted">{typeof apt.startTime === 'string' ? apt.startTime.substring(0, 5) : apt.startTime}</span>
                      </div>
                      <Badge status={apt.status} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Administrator / Healthcare Manager Activity Panel */
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-7">
            <Card
              title="Recent Security & Access Events"
              subtitle="Real-time facility audit log"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/audit-logs')}>
                  View all logs
                </Button>
              }
            >
              {!data.recentSecurityEvents || data.recentSecurityEvents.length === 0 ? (
                <p className="text-muted m-0 py-3">No recent security events.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table cb-table align-middle m-0">
                    <thead>
                      <tr>
                        <th scope="col">Timestamp</th>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                        <th scope="col">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentSecurityEvents.map((evt) => (
                        <tr key={evt.id}>
                          <td className="small text-muted">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="fw-semibold">{evt.userName || 'System'}</td>
                          <td>
                            <code className="cb-code-pill">{evt.action}</code>
                          </td>
                          <td>
                            <Badge status={evt.result} variant={evt.result === 'Success' ? 'active' : 'cancelled'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="col-12 col-lg-5">
            <Card title="Appointment Status Distribution">
              {data.appointmentStats && data.appointmentStats.length > 0 ? (
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data.appointmentStats}
                        dataKey="total"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                      >
                        {data.appointmentStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted m-0 py-3">No appointment statistics recorded yet.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Aggregate Trends Row */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Card title="Clinical Diagnostic Diagnoses (Top 5)">
            {data.diseaseTrends && data.diseaseTrends.length > 0 ? (
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <BarChart data={data.diseaseTrends} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="disease" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="totalCases" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No diagnostic trends reported yet.</p>
            )}
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card title="Patient Demographics by Gender">
            {data.genderStats && data.genderStats.length > 0 ? (
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <BarChart data={data.genderStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="gender" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No demographic data available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
