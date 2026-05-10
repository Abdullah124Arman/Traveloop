import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvoice, updateInvoice, exportInvoice } from '../services/trip.service';
import { getTrip } from '../services/trip.service';
import { Invoice, InvoiceItem, Trip } from '../types';
import { Download, CheckCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([getInvoice(id), getTrip(id)])
      .then(([inv, t]) => {
        setInvoice(inv);
        setTrip(t);
        setItems(inv.items.length > 0 ? inv.items : []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function addItem() {
    setItems(prev => [...prev, { category: 'Hotel', description: '', quantity: 1, unitCost: 0, amount: 0, orderIndex: prev.length }]);
  }

  function removeItem(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }

  function updateItem(i: number, field: string, value: string | number) {
    setItems(prev => prev.map((item, idx) => {
      if (idx !== i) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        updated.amount = (Number(updated.quantity) || 1) * (Number(updated.unitCost) || 0);
      }
      return updated;
    }));
  }

  const subtotal = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateInvoice(id!, {
        subtotal,
        tax,
        grandTotal,
        items: items.map((item, i) => ({
          category: item.category || 'Other',
          description: item.description || '',
          quantity: Number(item.quantity) || 1,
          unitCost: Number(item.unitCost) || 0,
          amount: Number(item.amount) || 0,
          orderIndex: i,
        })),
      } as any);
      setInvoice(updated);
      toast.success('Invoice saved');
    } catch { toast.error('Failed to save invoice'); }
    finally { setSaving(false); }
  }

  async function handleMarkPaid() {
    try {
      const updated = await updateInvoice(id!, { paymentStatus: 'PAID' } as any);
      setInvoice(updated);
      toast.success('Marked as paid');
    } catch { toast.error('Failed to update status'); }
  }

  async function handleExport() {
    try {
      const blob = await exportInvoice(id!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice exported successfully');
    } catch { toast.error('Export failed'); }
  }

  if (loading) return <div className="p-6" style={{ color: 'var(--text-muted)' }}>Loading...</div>;

  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };
  const statusColor = invoice?.paymentStatus === 'PAID' ? 'var(--success)' : invoice?.paymentStatus === 'PARTIAL' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link to="/trips" className="text-sm mb-4 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
        ← Back to My Trips
      </Link>

      {/* Trip header */}
      {trip && (
        <div className="rounded-xl border p-5 mb-6 flex items-start gap-4"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-3xl"
            style={{ background: 'var(--surface-3)' }}>
            {trip.coverPhotoUrl ? <img src={trip.coverPhotoUrl} alt="" className="w-full h-full object-cover" /> : '✈️'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{trip.name}</h1>
            {trip.place && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>📍 {trip.place}</p>}
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: statusColor }}>
            {invoice?.paymentStatus}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: expense table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Expense Items</h2>
            <button onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
              style={{ background: 'var(--primary)' }}>
              <Plus size={14} /> Add Row
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-3)' }}>
                  {['#', 'Category', 'Description', 'Qty', 'Unit Cost', 'Amount', ''].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                      No items yet. Add a row above.
                    </td>
                  </tr>
                ) : items.map((item, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                    <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td className="px-1 py-1">
                      <input value={item.category || ''} onChange={(e) => updateItem(i, 'category', e.target.value)}
                        className="w-24 px-2 py-1 rounded border text-xs" style={inputStyle} placeholder="Hotel" />
                    </td>
                    <td className="px-1 py-1">
                      <input value={item.description || ''} onChange={(e) => updateItem(i, 'description', e.target.value)}
                        className="w-full px-2 py-1 rounded border text-xs" style={inputStyle} placeholder="Description..." />
                    </td>
                    <td className="px-1 py-1">
                      <input type="number" value={item.quantity || 1} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                        className="w-14 px-2 py-1 rounded border text-xs text-center" style={inputStyle} />
                    </td>
                    <td className="px-1 py-1">
                      <input type="number" value={item.unitCost || ''} onChange={(e) => updateItem(i, 'unitCost', Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded border text-xs" style={inputStyle} placeholder="0" />
                    </td>
                    <td className="px-3 py-2 text-xs font-medium" style={{ color: 'var(--success)' }}>
                      ${Number(item.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-2 py-2">
                      <button onClick={() => removeItem(i)} style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: saving ? 'var(--border)' : 'var(--primary)' }}>
            {saving ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>

        {/* Right: summary */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Budget Summary</h3>
            {trip?.totalBudget && (
              <div className="flex justify-between text-sm mb-3">
                <span style={{ color: 'var(--text-muted)' }}>Total Budget</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>${Number(trip.totalBudget).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ color: 'var(--text)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Tax (10%)</span>
              <span style={{ color: 'var(--text)' }}>${tax.toFixed(2)}</span>
            </div>
            <div className="h-px my-3" style={{ background: 'var(--border)' }} />
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: 'var(--text)' }}>Grand Total</span>
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleMarkPaid} disabled={invoice?.paymentStatus === 'PAID'}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2"
            style={{ background: invoice?.paymentStatus === 'PAID' ? '#22c55e' : 'var(--surface-3)', color: invoice?.paymentStatus === 'PAID' ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <CheckCircle size={16} />
            {invoice?.paymentStatus === 'PAID' ? 'Paid ✓' : 'Mark as Paid'}
          </button>

          <button onClick={handleExport}
            className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-3)' }}>
            <Download size={16} /> Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
