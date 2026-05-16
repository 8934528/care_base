import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { getDashboard } from "../../services/dashboardService";

interface DashboardData {
  dailyVisits: number;
  queueLoad: number;
  activeDoctors: number;
  completedConsultations: number;
  diseaseTrends: Array<{ disease: string; totalCases: number }>;
  genderStats: Array<{ gender: string; total: number }>;
  appointmentStats: Array<{ status: string; total: number }>;
}

export default function Dashboard() {
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

  if (loading || !data) {
    return <div className="animate-fade-in text-center p-4">Loading Clinical Analytics...</div>;
  }

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--error)', '#8884d8'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-stats"></i> Clinical Intelligence Dashboard</h1>
        <div className="operational-visibility">
          <i className="fi fi-rr-pulse"></i>
          <span>Real-time Operational Visibility</span>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="row metrics-row">
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Daily Visits</span>
            <div className="stat-content">
              <span className="stat-value">{data.dailyVisits}</span>
              <i className="fi fi-rr-users stat-icon-primary"></i>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Queue Load</span>
            <div className="stat-content">
              <span className="stat-value">{data.queueLoad}</span>
              <i className="fi fi-rr-list-check stat-icon-secondary"></i>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Active Doctors</span>
            <div className="stat-content">
              <span className="stat-value">{data.activeDoctors}</span>
              <i className="fi fi-rr-doctor stat-icon-warning"></i>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Completed Today</span>
            <div className="stat-content">
              <span className="stat-value">{data.completedConsultations}</span>
              <i className="fi fi-rr-check-circle stat-icon-success"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Disease Trends Chart */}
        <div className="col-7">
          <div className="glass-panel chart-panel">
            <h3 className="chart-title">
              <i className="fi fi-rr-clipboards"></i>
              Disease Trends (Top Diagnoses)
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.diseaseTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="disease" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0 }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="totalCases" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gender Stats Pie Chart */}
        <div className="col-5">
          <div className="glass-panel chart-panel">
            <h3 className="chart-title">
              <i className="fi fi-rr-users"></i>
              Gender Distribution
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.genderStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="gender"
                  >
                    {data.genderStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {data.genderStats.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-color" style={{ background: COLORS[index % COLORS.length] }}></div>
                    <span>{entry.gender}: {entry.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-8">
        {/* Appointment Status Chart */}
        <div className="col-12">
          <div className="glass-panel">
            <h3 className="chart-title">
              <i className="fi fi-rr-calendar"></i>
              Appointment Operational Overview
            </h3>
            <div className="stats-grid">
              {data.appointmentStats.map((stat, index) => (
                <div key={index} className="card stat-summary-card">
                  <span className="stat-summary-label">{stat.status}</span>
                  <h2 className="stat-summary-value">{stat.total}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
