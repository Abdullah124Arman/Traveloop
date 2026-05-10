import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem
} from '../services/trip.service';
import type { ChecklistItem } from '../types';
import { Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['ESSENTIALS', 'CLOTHING', 'ELECTRONICS', 'MISC'] as const;
const CAT_LABEL: Record<string, string> = {
  ESSENTIALS: '🛂 Essentials', CLOTHING: '👕 Clothing', ELECTRONICS: '🔌 Electronics', MISC: '📦 Misc',
};

export default function Checklist() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState<string>('ESSENTIALS');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChecklist(id).then(setItems).finally(() => setLoading(false));
  }, [id]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const item = await addChecklistItem(id!, { name: newItem, category: newCat });
      setItems(prev => [...prev, item]);
      setNewItem('');
      setAdding(false);
      toast.success('Item added');
    } catch { toast.error('Failed to add item'); }
  }

  async function handleToggle(item: ChecklistItem) {
    try {
      const updated = await updateChecklistItem(item.id, { isPacked: !item.isPacked });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(itemId: string) {
    try {
      await deleteChecklistItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch { toast.error('Failed to delete'); }
  }

  async function handleReset() {
    const packed = items.filter(i => i.isPacked);
    await Promise.all(packed.map(i => updateChecklistItem(i.id, { isPacked: false })));
    setItems(prev => prev.map(i => ({ ...i, isPacked: false })));
    toast.success('Checklist reset');
  }

  const packed = items.filter(i => i.isPacked).length;
  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/trips/${id}/builder`} className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            ← Builder
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Packing Checklist</h1>
        </div>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Progress */}
      <div className="rounded-xl border p-4 mb-6" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--text-muted)' }}>Packed</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>{packed} / {items.length}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
          <div className="h-full rounded-full transition-all" style={{
            width: items.length > 0 ? `${(packed / items.length) * 100}%` : '0%',
            background: 'var(--success)',
          }} />
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="rounded-xl border p-4 mb-6 flex gap-3"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--primary)' }}>
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
            placeholder="Item name..." className="flex-1 px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>Add</button>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">🎒</p>
          <p>No items yet. Add something to pack!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
                  {CAT_LABEL[cat]} · {catItems.filter(i => i.isPacked).length}/{catItems.length}
                </h2>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <div key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
                      style={{
                        background: 'var(--surface-2)',
                        borderColor: item.isPacked ? 'var(--success)' : 'var(--border)',
                        opacity: item.isPacked ? 0.7 : 1,
                      }}>
                      <button onClick={() => handleToggle(item)}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all"
                        style={{
                          background: item.isPacked ? 'var(--success)' : 'transparent',
                          borderColor: item.isPacked ? 'var(--success)' : 'var(--border)',
                        }}>
                        {item.isPacked && <Check size={12} className="text-white" />}
                      </button>
                      <span className="flex-1 text-sm" style={{
                        color: 'var(--text)',
                        textDecoration: item.isPacked ? 'line-through' : 'none',
                      }}>{item.name}</span>
                      <button onClick={() => handleDelete(item.id)} className="p-1" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex gap-3 mt-8">
          <button onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}
