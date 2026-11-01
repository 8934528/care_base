import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { getReports, type ReportsData } from "../../services/reportsService";
import { Card, PageHeader, LoadingSpinner, EmptyState } from "../../components/common";

const COLORS = ['#0f766e', '#0369a1', '#b45309', '#b91c1c', '#64748b'];

export default function Reports() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getReports();
        setData(result);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Generating operational reports..." />;
  if (!data) {
    return (
      <EmptyState
        icon="bi-graph-down"
        title="Failed to load reports"
        message="Unable to compile healthcare facility analytics."
      />
    );
  }

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Facility Operations & Analytics Reports"
        subtitle="Operational metrics, patient volumes, diagnostic trends, and appointment statistics"
      />

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="cb-stat-card">
            <span className="text-muted small">Total Patient Base</span>
            <h3 className="m-0 mt-1">{data.totalPatients}</h3>
            <span className="small text-muted">Active healthcare files</span>
          </Card>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="cb-stat-card">
            <span className="text-muted small">Today's Scheduled Appointments</span>
            <h3 className="m-0 mt-1 text-primary">{data.todayAppointments}</h3>
            <span className="small text-muted">Daily bookings</span>
          </Card>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="cb-stat-card">
            <span className="text-muted small">Current Waiting Queue</span>
            <h3 className="m-0 mt-1 text-warning">{data.currentQueue}</h3>
            <span className="small text-muted">Awaiting consultation</span>
          </Card>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="cb-stat-card">
            <span className="text-muted small">Completed Consultations Today</span>
            <h3 className="m-0 mt-1 text-success">{data.completedToday || 0}</h3>
            <span className="small text-muted">Facility throughput</span>
          </Card>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <Card title="Appointment Status Breakdown">
            {data.appointmentStats && data.appointmentStats.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.appointmentStats}
                      dataKey="total"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                    >
                      {data.appointmentStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No status distribution records available.</p>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Patient Demographics by Gender">
            {data.genderStats && data.genderStats.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={data.genderStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="gender" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No demographic data recorded.</p>
            )}
          </Card>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="Primary Diagnoses Treated (Top Conditions)">
            {data.diseaseTrends && data.diseaseTrends.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={data.diseaseTrends} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="disease" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="totalCases" fill="#0369a1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No diagnostic records reported.</p>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Monthly Patient Visit Volumes">
            {data.monthlyVisits && data.monthlyVisits.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={data.monthlyVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="totalVisits" fill="#b45309" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted m-0 py-3">No monthly trend data available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
