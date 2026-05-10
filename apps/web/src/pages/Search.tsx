import { useEffect, useState } from 'react';
import { getSearch } from '../services/auth.service';
import type { City, Activity } from '../types';
import { Search as SearchIcon, MapPin, Clock, DollarSign } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const ACT_TYPE_COLOR: Record<string, string> = {
    SIGHTSEEING: '#6366f1', FOOD: '#f59e0b', ADVENTURE: '#ef4444', CULTURE: '#8b5cf6', WELLNESS: '#22c55e',
  };

  useEffect(() => {
    if (query.length >= 1) doSearch();
  }, [type]);

  useEffect(() => {
    if (searchParams.get('q')) {
      setQuery(searchParams.get('q')!);
      doSearch(searchParams.get('q')!);
    }
  }, []);

  async function doSearch(q = query) {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await getSearch(q, type || undefined);
      setCities(res.cities || []);
      setActivities(res.activities || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') doSearch();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Search</h1>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search cities or activities..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="px-4 py-3 rounded-xl border text-sm"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' }}>
          <option value="">All</option>
          <option value="city">Cities</option>
          <option value="activity">Activities</option>
        </select>
        <button onClick={() => doSearch()}
          className="px-5 py-3 rounded-xl font-medium text-sm text-white"
          style={{ background: 'var(--primary)' }}>
          Search
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />)}
        </div>
      )}

      {!loading && (cities.length > 0 || activities.length > 0) && (
        <div className="space-y-6">
          {cities.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Cities · {cities.length}</h2>
              <div className="space-y-2">
                {cities.map((city) => (
                  <div key={city.id} className="flex items-center gap-4 p-4 rounded-xl border"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                      style={{ background: 'var(--surface-3)' }}>
                      {city.imageUrl
                        ? <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">🌍</div>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text)' }}>{city.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={11} className="inline mr-1" />{city.country}
                        {city.region && ` · ${city.region}`}
                      </p>
                    </div>
                    {city.popularityScore && (
                      <span className="text-xs font-medium" style={{ color: 'var(--warning)' }}>
                        ⭐ {Number(city.popularityScore).toFixed(1)}
                      </span>
                    )}
                    {city.costIndex && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Cost {Number(city.costIndex).toFixed(0)}/10
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activities.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Activities · {activities.length}</h2>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl border"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                          style={{ background: ACT_TYPE_COLOR[activity.type] || '#6366f1' }}>
                          {activity.type}
                        </span>
                        {activity.city && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {activity.city.name}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{activity.name}</p>
                      {activity.description && (
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{activity.description}</p>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-xs shrink-0">
                      {activity.cost != null && (
                        <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                          <DollarSign size={11} />{Number(activity.cost).toFixed(0)}/person
                        </span>
                      )}
                      {activity.durationMinutes && (
                        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={11} />{activity.durationMinutes}m
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && query.length > 0 && cities.length === 0 && activities.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">🔍</p>
          <p>No results found for "{query}"</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">🌍</p>
          <p>Search for cities or activities to get started</p>
        </div>
      )}
    </div>
  );
}
