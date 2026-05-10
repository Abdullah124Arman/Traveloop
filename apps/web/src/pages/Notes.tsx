import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote } from '../services/trip.service';
import type { TripNote } from '../types';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FILTERS = ['ALL', 'BY_DAY', 'BY_STOP'] as const;

export default function Notes() {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>('ALL');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', dayNumber: '' });
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!id) return;
    getNotes(id).then(setNotes).finally(() => setLoading(false));
  }, [id]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim()) return toast.error('Content required');
    try {
      const note = await createNote(id!, {
        title: form.title || undefined,
        content: form.content,
        dayNumber: form.dayNumber ? parseInt(form.dayNumber) : undefined,
      });
      setNotes(prev => [note, ...prev]);
      setForm({ title: '', content: '', dayNumber: '' });
      setAdding(false);
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
  }

  async function handleUpdate(noteId: string) {
    if (!editForm.content.trim()) return;
    try {
      const updated = await updateNote(noteId, { title: editForm.title, content: editForm.content });
      setNotes(prev => prev.map(n => n.id === noteId ? updated : n));
      setEditId(null);
      toast.success('Note updated');
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(noteId: string) {
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Note deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/trips/${id}/builder`} className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            ← Builder
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Trip Notes</h1>
        </div>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={15} /> Add Note
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[['ALL', 'All'], ['BY_DAY', 'By Day'], ['BY_STOP', 'By Stop']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterTab(val)}
            className="px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: filterTab === val ? 'var(--primary)' : 'var(--surface-3)',
              color: filterTab === val ? 'white' : 'var(--text-muted)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="rounded-xl border p-5 mb-6 flex flex-col gap-3"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--primary)' }}>
          <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title (optional)" className="px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
          <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Note content..." rows={3}
            className="px-3 py-2 rounded-lg border text-sm resize-none" style={inputStyle} />
          <div className="flex gap-3 items-center">
            <input type="number" value={form.dayNumber} onChange={(e) => setForm(f => ({ ...f, dayNumber: e.target.value }))}
              placeholder="Day # (optional)" className="w-36 px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
            <div className="flex-1" />
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: 'var(--primary)' }}>
              Save Note
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">📓</p>
          <p>No notes yet. Start journaling your trip!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="rounded-xl border p-5"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              {editId === note.id ? (
                <div className="flex flex-col gap-3">
                  <input value={editForm.title} onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Title" className="px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
                  <textarea value={editForm.content} onChange={(e) => setEditForm(f => ({ ...f, content: e.target.value }))}
                    rows={3} className="px-3 py-2 rounded-lg border text-sm resize-none" style={inputStyle} />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg"
                      style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
                    <button onClick={() => handleUpdate(note.id)} className="p-1.5 rounded-lg"
                      style={{ color: 'var(--success)' }}><Check size={16} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {note.title && <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{note.title}</h3>}
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{note.content}</p>
                      <div className="flex items-center gap-3 mt-3">
                        {note.dayNumber && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
                            Day {note.dayNumber}
                          </span>
                        )}
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button onClick={() => { setEditId(note.id); setEditForm({ title: note.title || '', content: note.content }); }}
                        className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(note.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
