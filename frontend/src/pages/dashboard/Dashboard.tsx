import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { getDashboard } from "../../services/dashboardService";
import { Users, Calendar, ListOrdered, CheckCircle2, History, ClipboardList, Activity } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading || !data) {
    return <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>Loading Clinical Analytics...</div>;
  }

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--error)', '#8884d8'];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Clinical Intelligence Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
          <Activity size={16} />
          <span>Real-time Operational Visibility</span>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Daily Visits</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="stat-value">{data.dailyVisits}</span>
              <Users size={24} color="var(--primary)" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Queue Load</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="stat-value">{data.queueLoad}</span>
              <ListOrdered size={24} color="var(--secondary)" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Active Doctors</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="stat-value">{data.activeDoctors}</span>
              <Activity size={24} color="var(--warning)" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card stat-card">
            <span className="stat-title">Completed Today</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="stat-value">{data.completedConsultations}</span>
              <CheckCircle2 size={24} color="var(--secondary)" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Disease Trends Chart */}
        <div className="col-7">
          <div className="glass-panel" style={{ height: '450px' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={20} strokeWidth={1.5} />
              Disease Trends (Top Diagnoses)
            </h3>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.diseaseTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="disease" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0 }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="totalCases" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gender Stats Pie Chart */}
        <div className="col-5">
          <div className="glass-panel" style={{ height: '450px' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} strokeWidth={1.5} />
              Gender Distribution
            </h3>
            <div style={{ width: '100%', height: '350px' }}>
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
                    {data.genderStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                {data.genderStats.map((entry: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '12px', height: '12px', background: COLORS[index % COLORS.length] }}></div>
                    <span>{entry.gender}: {entry.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: '2rem' }}>
        {/* Appointment Status Chart */}
        <div className="col-12">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} strokeWidth={1.5} />
              Appointment Operational Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {data.appointmentStats.map((stat: any, index: number) => (
                <div key={index} className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(var(--secondary-rgb), 0.03)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.status}</span>
                  <h2 style={{ margin: '0.5rem 0 0 0', color: 'var(--primary)' }}>{stat.total}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
