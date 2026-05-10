import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip, getBudget } from '../services/trip.service';
import { Trip, BudgetSummary } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, DollarSign, Pencil } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ItineraryView() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getTrip(id), getBudget(id)])
      .then(([t, b]) => { setTrip(t); setBudget(b); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6" style={{ color: 'var(--text-muted)' }}>Loading...</div>;
  if (!trip) return <div className="p-6" style={{ color: 'var(--text)' }}>Trip not found</div>;

  const breakdownData = budget
    ? Object.entries(budget.breakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link to="/trips" className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            ← My Trips
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{trip.name}</h1>
        </div>
        <Link to={`/trips/${id}/builder`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-3)' }}>
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: itinerary */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border p-5 mb-4"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap gap-4 text-sm">
              {trip.place && (
                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  {trip.place}
                </span>
              )}
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white`}
                style={{ background: trip.status === 'ONGOING' ? 'var(--success)' : trip.status === 'UPCOMING' ? 'var(--primary)' : '#64748b' }}>
                {trip.status}
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>
            Itinerary
          </h2>

          {(trip.stops || []).length === 0 ? (
            <div className="text-center py-10 rounded-xl border"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <p className="text-3xl mb-2">📍</p>
              <p style={{ color: 'var(--text-muted)' }}>No stops added yet</p>
              <Link to={`/trips/${id}/builder`} className="inline-block mt-3 text-sm font-medium"
                style={{ color: 'var(--primary)' }}>Add sections →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(trip.stops || []).map((stop, i) => (
                <div key={stop.id} className="rounded-xl border p-4"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: 'var(--primary)' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text)' }}>
                        {stop.description || `Section ${i + 1}`}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {format(new Date(stop.startDate), 'MMM d')} → {format(new Date(stop.endDate), 'MMM d, yyyy')}
                      </p>
                      {stop.city && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          📍 {stop.city.name}, {stop.city.country}
                        </p>
                      )}
                      {(stop.activities || []).length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {(stop.activities || []).map((sa) => (
                            <div key={sa.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg"
                              style={{ background: 'var(--surface-3)' }}>
                              <span style={{ color: 'var(--text)' }}>{sa.activity?.name || 'Activity'}</span>
                              {(sa.customCost ?? sa.activity?.cost) != null && (
                                <span style={{ color: 'var(--success)' }}>
                                  ${Number(sa.customCost ?? sa.activity?.cost).toLocaleString()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {stop.sectionBudget && (
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Budget</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                          ${Number(stop.sectionBudget).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Budget */}
        <div className="space-y-4">
          {budget && (
            <>
              <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <DollarSign size={16} style={{ color: 'var(--success)' }} /> Budget Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Total Budget</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>${budget.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Amount Spent</span>
                    <span className="font-semibold" style={{ color: 'var(--warning)' }}>${budget.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="h-px" style={{ background: 'var(--border)' }} />
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Remaining</span>
                    <span className="font-bold text-base" style={{ color: budget.remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      ${budget.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {budget.totalBudget > 0 && (
                  <div className="mt-4">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (budget.totalSpent / budget.totalBudget) * 100)}%`,
                          background: budget.totalSpent > budget.totalBudget ? 'var(--danger)' : 'var(--primary)',
                        }} />
                    </div>
                    <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
                      {Math.round((budget.totalSpent / budget.totalBudget) * 100)}% used
                    </p>
                  </div>
                )}
              </div>

              {breakdownData.length > 0 && (
                <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>By Category</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={breakdownData} dataKey="value" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                        {breakdownData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {breakdownData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                        </div>
                        <span style={{ color: 'var(--text)' }}>${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Link to={`/trips/${id}/invoice`}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-3)' }}>
                  View Invoice
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
