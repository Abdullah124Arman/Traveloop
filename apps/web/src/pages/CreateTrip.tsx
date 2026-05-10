import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../services/trip.service';
import { uploadImage } from '../services/upload.service';
import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', place: '', startDate: '', endDate: '', totalBudget: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) return toast.error('Name and dates are required');
    setLoading(true);
    try {
      let coverPhotoUrl = undefined;
      if (file) {
        toast.success('Uploading image...');
        coverPhotoUrl = await uploadImage(file);
      }
      const trip = await createTrip({
        name: form.name, place: form.place || undefined,
        startDate: form.startDate, endDate: form.endDate,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : undefined,
        coverPhotoUrl,
      });
      toast.success('Trip created!');
      navigate(`/trips/${trip.id}/builder`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create trip');
    } finally { setLoading(false); }
  }

  const inputStyle = {
    background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Plan a new trip</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Enter the details to get started</p>

      <div className="rounded-2xl border p-8"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Cover Photo</label>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer hover:border-indigo-500 transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
              {file ? (
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  <ImagePlus size={24} className="mb-2" />
                  <span>Click to upload image</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && setFile(e.target.files[0])} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Trip Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="Summer Europe Adventure"
              className="w-full px-4 py-3 rounded-xl border text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Destination</label>
            <input value={form.place} onChange={set('place')} placeholder="Paris, France"
              className="w-full px-4 py-3 rounded-xl border text-sm" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Start Date *</label>
              <input type="date" value={form.startDate} onChange={set('startDate')}
                className="w-full px-4 py-3 rounded-xl border text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>End Date *</label>
              <input type="date" value={form.endDate} onChange={set('endDate')}
                className="w-full px-4 py-3 rounded-xl border text-sm" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Total Budget ($)</label>
            <input type="number" value={form.totalBudget} onChange={set('totalBudget')} placeholder="5000"
              className="w-full px-4 py-3 rounded-xl border text-sm" style={inputStyle} />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => navigate('/trips')}
              className="flex-1 py-3 rounded-xl font-medium text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: loading ? 'var(--border)' : 'var(--primary)' }}>
              {loading ? 'Creating...' : 'Save & Build Itinerary →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
