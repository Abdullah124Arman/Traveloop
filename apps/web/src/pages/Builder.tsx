import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip } from '../services/trip.service';
import { createStop, deleteStop } from '../services/trip.service';
import { Trip, Stop } from '../types';
import { format } from 'date-fns';
import { Plus, Trash2, MapPin, DollarSign, Calendar, FileText, CheckSquare, BookOpen, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingStop, setAddingStop] = useState(false);
  const [stopForm, setStopForm] = useState({ description: '', startDate: '', endDate: '', sectionBudget: '' });

  useEffect(() => {
    if (!id) return;
    getTrip(id).then(setTrip).finally(() => setLoading(false));
  }, [id]);

  async function handleAddStop(e: React.FormEvent) {
    e.preventDefault();
    if (!stopForm.startDate || !stopForm.endDate) return toast.error('Dates required');
    try {
      const stop = await createStop(id!, {
        description: stopForm.description || undefined,
        startDate: stopForm.startDate,
        endDate: stopForm.endDate,
        sectionBudget: stopForm.sectionBudget ? Number(stopForm.sectionBudget) : undefined,
      });
      setTrip(prev => prev ? { ...prev, stops: [...(prev.stops || []), stop] } : prev);
      setStopForm({ description: '', startDate: '', endDate: '', sectionBudget: '' });
      setAddingStop(false);
      toast.success('Stop added');
    } catch { toast.error('Failed to add stop'); }
  }

  async function handleDeleteStop(stopId: string) {
    try {
      await deleteStop(stopId);
      setTrip(prev => prev ? { ...prev, stops: prev.stops?.filter(s => s.id !== stopId) } : prev);
      toast.success('Stop removed');
    } catch { toast.error('Failed to remove stop'); }
  }

  if (loading) return <div className="p-6 animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading...</div>;
  if (!trip) return <div className="p-6" style={{ color: 'var(--text)' }}>Trip not found</div>;

  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link to="/trips" className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            ← My Trips
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{trip.name}</h1>
          {trip.place && (
            <p className="flex items-center gap-1 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={14} />{trip.place}
            </p>
          )}
        </div>
        {/* Quick nav */}
        <div className="flex gap-2 flex-wrap justify-end">
          {[
            { to: `/trips/${id}/view`, icon: FileText, label: 'View' },
            { to: `/trips/${id}/checklist`, icon: CheckSquare, label: 'Checklist' },
            { to: `/trips/${id}/notes`, icon: BookOpen, label: 'Notes' },
            { to: `/trips/${id}/invoice`, icon: Receipt, label: 'Invoice' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-3)' }}>
              <Icon size={13} />{label}
            </Link>
          ))}
        </div>
      </div>

      {/* Trip meta */}
      <div className="rounded-xl border p-4 mb-6 flex flex-wrap gap-6"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--text-muted)' }}>
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        {trip.totalBudget && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign size={16} style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Budget: ${Number(trip.totalBudget).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>
          Itinerary Sections ({trip.stops?.length ?? 0})
        </h2>

        {(trip.stops || []).length === 0 && !addingStop ? (
          <div className="text-center py-12 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <p className="text-4xl mb-2">📍</p>
            <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>No sections yet</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add stops to build your itinerary</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(trip.stops || []).map((stop, i) => (
              <StopCard key={stop.id} stop={stop} index={i} onDelete={handleDeleteStop} />
            ))}
          </div>
        )}
      </div>

      {/* Add stop form */}
      {addingStop ? (
        <div className="rounded-xl border p-5 mb-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--primary)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>New Section</h3>
          <form onSubmit={handleAddStop} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <input value={stopForm.description}
                onChange={(e) => setStopForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Hotel check-in, city tour..."
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Start Date *</label>
                <input type="date" value={stopForm.startDate}
                  onChange={(e) => setStopForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>End Date *</label>
                <input type="date" value={stopForm.endDate}
                  onChange={(e) => setStopForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Section Budget ($)</label>
              <input type="number" value={stopForm.sectionBudget}
                onChange={(e) => setStopForm(f => ({ ...f, sectionBudget: e.target.value }))}
                placeholder="1200"
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setAddingStop(false)}
                className="flex-1 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--primary)' }}>
                Add Section
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => setAddingStop(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <Plus size={16} /> Add another Section
        </button>
      )}
    </div>
  );
}

function StopCard({ stop, index, onDelete }: { stop: Stop; index: number; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'var(--primary)' }}>
            {index + 1}
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text)' }}>
              {stop.description || `Section ${index + 1}`}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {format(new Date(stop.startDate), 'MMM d')} → {format(new Date(stop.endDate), 'MMM d, yyyy')}
            </p>
            {stop.sectionBudget && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>
                Budget: ${Number(stop.sectionBudget).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <button onClick={() => onDelete(stop.id)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--danger)' }}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
