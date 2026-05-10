import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrips, deleteTrip } from '../services/trip.service';
import type { Trip } from '../types';
import { format } from 'date-fns';
import { Plus, MapPin, Calendar, Trash2, Eye, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'] as const;
const STATUS_COLOR: Record<string, string> = {
  UPCOMING: '#6366f1', ONGOING: '#22c55e', COMPLETED: '#64748b',
};

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success('Trip deleted');
    } catch { toast.error('Failed to delete trip'); }
  }

  const filtered = filter === 'ALL' ? trips : trips.filter((t) => t.status === filter);
  const grouped = {
    ONGOING: trips.filter((t) => t.status === 'ONGOING'),
    UPCOMING: trips.filter((t) => t.status === 'UPCOMING'),
    COMPLETED: trips.filter((t) => t.status === 'COMPLETED'),
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>My Trips</h1>
        <button onClick={() => navigate('/trips/create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-all"
            style={{
              background: filter === s ? 'var(--primary)' : 'var(--surface-3)',
              color: filter === s ? 'white' : 'var(--text-muted)',
            }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <p className="text-5xl mb-3">🗺️</p>
          <p className="font-medium mb-4" style={{ color: 'var(--text)' }}>No trips found</p>
          <button onClick={() => navigate('/trips/create')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            Plan a Trip
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {(['ONGOING', 'UPCOMING', 'COMPLETED'] as const).map((status) => {
            const group = filter === 'ALL' ? grouped[status] : (filter === status ? filtered : []);
            if (group.length === 0) return null;
            return (
              <div key={status}>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLOR[status] }} />
                  {status} · {group.length}
                </h2>
                <div className="space-y-3">
                  {group.map((trip) => (
                    <div key={trip.id}
                      className="flex items-center justify-between p-4 rounded-xl border hover:border-indigo-500 transition-colors"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                          style={{ background: 'var(--surface-3)' }}>
                          {trip.coverPhotoUrl
                            ? <img src={trip.coverPhotoUrl} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xl">✈️</div>}
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{trip.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            {trip.place && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                <MapPin size={11} />{trip.place}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <Calendar size={11} />
                              {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/trips/${trip.id}/view`}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/trips/${trip.id}/builder`}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="Edit">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDelete(trip.id, trip.name)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--danger)' }}
                          title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
