import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard } from '../services/trip.service';
import { useAuthStore } from '../store/authStore';
import { Trip, City } from '../types';
import { format } from 'date-fns';
import { Plus, MapPin, Calendar } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  UPCOMING: '#6366f1', ONGOING: '#22c55e', COMPLETED: '#64748b',
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [topCities, setTopCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ recentTrips, topCities }) => { setRecentTrips(recentTrips); setTopCities(topCities); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero banner */}
      <div className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' }}>
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-medium mb-1">Good {getGreeting()},</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.firstName} {user?.lastName} 👋
          </h1>
          <p className="text-purple-200 mb-6">Where are you exploring next?</p>
          <button
            onClick={() => navigate('/trips/create')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white"
            style={{ color: 'var(--primary)' }}>
            <Plus size={16} />
            Plan a Trip
          </button>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-9xl select-none">✈️</div>
      </div>

      {/* Top Regional Selections */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Top Destinations</h2>
          <Link to="/search" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>View all</Link>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-40 h-32 rounded-xl shrink-0 animate-pulse" style={{ background: 'var(--surface-3)' }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topCities.map((city) => (
              <div key={city.id} onClick={() => navigate(`/search?q=${city.name}`)}
                className="relative w-44 h-36 rounded-xl shrink-0 overflow-hidden cursor-pointer group">
                {city.imageUrl
                  ? <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'var(--surface-3)' }}>🌍</div>}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-semibold text-sm">{city.name}</p>
                  <p className="text-white/70 text-xs">{city.country}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Recent Trips</h2>
          <Link to="/trips" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>All trips</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />
            ))}
          </div>
        ) : recentTrips.length === 0 ? (
          <div className="text-center py-12 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>No trips yet</p>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>Start planning your first adventure!</p>
            <Link to="/trips/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: 'var(--primary)' }}>
              <Plus size={14} /> Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTrips.slice(0, 3).map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}/view`}
                className="rounded-xl border p-5 hover:border-indigo-500 transition-colors group"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl overflow-hidden"
                    style={{ background: 'var(--surface-3)' }}>
                    {trip.coverPhotoUrl
                      ? <img src={trip.coverPhotoUrl} alt="" className="w-full h-full object-cover" />
                      : '✈️'}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full text-white"
                    style={{ background: STATUS_COLOR[trip.status] }}>
                    {trip.status}
                  </span>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-indigo-400 transition-colors"
                  style={{ color: 'var(--text)' }}>{trip.name}</h3>
                {trip.place && (
                  <p className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={12} />{trip.place}
                  </p>
                )}
                <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
