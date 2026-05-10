import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/auth.service';
import { getTrips } from '../services/trip.service';
import { User, Trip } from '../types';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Profile() {
  const setStoreUser = useAuthStore((s) => s.setUser);
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    Promise.all([getProfile(), getTrips()])
      .then(([u, t]) => { setUser(u); setForm(u); setTrips(t); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    try {
      const updated = await updateProfile({
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, city: form.city, country: form.country,
        additionalInfo: form.additionalInfo,
      });
      setUser(updated);
      setStoreUser(updated);
      setEditing(false);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
  }

  const preplanned = trips.filter(t => t.status === 'UPCOMING');
  const previous = trips.filter(t => t.status === 'COMPLETED');
  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };

  if (loading) return <div className="p-6" style={{ color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>My Profile</h1>

      {/* Profile card */}
      <div className="rounded-2xl border p-6 mb-8" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0"
            style={{ background: 'var(--primary)' }}>
            {user?.photoUrl ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" /> : `${user?.firstName?.[0]}${user?.lastName?.[0]}`}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'firstName', label: 'First Name' },
                  { key: 'lastName', label: 'Last Name' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'city', label: 'City' },
                  { key: 'country', label: 'Country' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    <input value={(form as any)[key] || ''}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Additional Info</label>
                  <textarea value={form.additionalInfo || ''}
                    onChange={(e) => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={inputStyle} />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>@{user?.username}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {user?.phone && <span style={{ color: 'var(--text-muted)' }}>📞 {user.phone}</span>}
                  {user?.city && <span style={{ color: 'var(--text-muted)' }}>📍 {user.city}{user.country ? `, ${user.country}` : ''}</span>}
                </div>
                {user?.additionalInfo && (
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{user.additionalInfo}</p>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
                <button onClick={handleSave} className="p-2 rounded-lg" style={{ color: 'var(--success)' }}><Check size={18} /></button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><Pencil size={18} /></button>
            )}
          </div>
        </div>
      </div>

      {/* Preplanned trips */}
      {preplanned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Preplanned Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {preplanned.map((trip) => <TripMiniCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* Previous trips */}
      {previous.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Previous Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {previous.map((trip) => <TripMiniCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {trips.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">🗺️</p>
          <p>No trips yet. <Link to="/trips/create" style={{ color: 'var(--primary)' }}>Plan one!</Link></p>
        </div>
      )}
    </div>
  );
}

function TripMiniCard({ trip }: { trip: Trip }) {
  return (
    <div className="shrink-0 w-48 rounded-xl border p-4"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 flex items-center justify-center text-3xl"
        style={{ background: 'var(--surface-3)' }}>
        {trip.coverPhotoUrl ? <img src={trip.coverPhotoUrl} alt="" className="w-full h-full object-cover" /> : '✈️'}
      </div>
      <p className="font-medium text-sm truncate mb-1" style={{ color: 'var(--text)' }}>{trip.name}</p>
      {trip.place && <p className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>📍 {trip.place}</p>}
      <Link to={`/trips/${trip.id}/view`}
        className="block text-center py-1.5 rounded-lg text-xs font-medium"
        style={{ background: 'var(--primary)', color: 'white' }}>
        View
      </Link>
    </div>
  );
}
