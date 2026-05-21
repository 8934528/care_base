import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { getReports, type ReportsData } from "../../services/reportsService";

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--error)', '#8884d8'];

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

  if (loading) {
    return <div className="animate-fade-in text-center p-12">Loading reports...</div>;
  }

  if (!data) {
    return <div className="animate-fade-in text-center p-12 text-secondary">Failed to load report data.</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-document-signed"></i> CareBase Reports</h1>
      </div>

      <div className="row metrics-row mt-8">
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Total Patients</span>
            <h2 className="stat-summary-value">{data.totalPatients}</h2>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Today's Appointments</span>
            <h2 className="stat-summary-value">{data.todayAppointments}</h2>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Queue (Active)</span>
            <h2 className="stat-summary-value">{data.currentQueue}</h2>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Completed Today</span>
            <h2 className="stat-summary-value">{data.completedToday}</h2>
          </div>
        </div>
      </div>

      <div className="row mt-8">
        <div className="col-6">
          <div className="card">
            <div className="section-header">
              <i className="fi fi-rr-stats section-icon"></i>
              <h3 className="section-title">Monthly Visit Statistics</h3>
            </div>
            <div className="chart-container h-200">
              {data.monthlyVisits.length === 0 ? (
                <div className="empty-state p-12">
                  <p className="text-secondary">No visit records yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyVisits}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
                    <Bar dataKey="totalVisits" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <div className="section-header">
              <i className="fi fi-rr-users section-icon"></i>
              <h3 className="section-title">Patient Demographics</h3>
            </div>
            <div className="chart-container h-200">
              {data.genderStats.length === 0 ? (
                <div className="empty-state p-12">
                  <p className="text-secondary">No patient data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.genderStats} dataKey="total" nameKey="gender" cx="50%" cy="50%" outerRadius={80}>
                      {data.genderStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-8">
        <div className="col-12">
          <div className="glass-panel">
            <div className="section-header">
              <i className="fi fi-rr-clipboards section-icon"></i>
              <h3 className="section-title">Top Diagnoses & Appointment Status</h3>
            </div>
            <div className="row">
              <div className="col-6">
                {data.diseaseTrends.length === 0 ? (
                  <p className="text-secondary p-4">No diagnosis data from medical records yet.</p>
                ) : (
                  <ul className="policy-list-compact">
                    {data.diseaseTrends.map((d, i) => (
                      <li key={i}>{d.disease}: <strong>{d.totalCases}</strong> cases</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-6">
                <div className="stats-grid">
                  {data.appointmentStats.map((s, i) => (
                    <div key={i} className="card stat-summary-card">
                      <span className="stat-summary-label">{s.status}</span>
                      <h2 className="stat-summary-value">{s.total}</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
