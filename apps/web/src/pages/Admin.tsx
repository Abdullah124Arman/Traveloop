import { useEffect, useState } from 'react';
import { getAdminStats } from '../services/auth.service';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

export default function Admin() {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6" style={{ color: 'var(--text-muted)' }}>Loading admin stats...</div>;
  if (!stats) return null;

  const statusData = stats.tripsByStatus.map((s: any) => ({ name: s.status, value: s._count.status }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Admin Panel</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'var(--primary)' },
          { label: 'Total Trips', value: stats.totalTrips, icon: '✈️', color: 'var(--success)' },
          { label: 'Community Posts', value: stats.totalPosts, icon: '💬', color: 'var(--warning)' },
          { label: 'Cities', value: stats.citiesCount, icon: '🌍', color: '#8b5cf6' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-xl border p-5"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{icon}</span>
              <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Trips by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Trip Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}>
                {statusData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusData.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent trips table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Recent Trips</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--surface-3)' }}>
              {['Trip Name', 'User', 'Status', 'Place', 'Created'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentTrips.map((trip: any) => (
              <tr key={trip.id} className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{trip.name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                  {trip.user.firstName} {trip.user.lastName}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ background: trip.status === 'ONGOING' ? 'var(--success)' : trip.status === 'UPCOMING' ? 'var(--primary)' : '#64748b' }}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{trip.place || '—'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(trip.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
