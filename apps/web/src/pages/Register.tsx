import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { signup } from '../services/auth.service';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    email: '', username: '', password: '',
    firstName: '', lastName: '',
    phone: '', city: '', country: '', additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const authLogin = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.username || !form.password || !form.firstName || !form.lastName)
      return toast.error('Required fields missing');
    setLoading(true);
    try {
      const { token, user } = await signup(form);
      authLogin(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm";
  const inputStyle = { background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-3) 100%)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'var(--primary)' }}>
            <span className="text-2xl">✈️</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Create account</h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Start planning your next adventure</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>First Name *</label>
                <input value={form.firstName} onChange={set('firstName')} placeholder="John" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Last Name *</label>
                <input value={form.lastName} onChange={set('lastName')} placeholder="Doe" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="john@email.com" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone</label>
                <input value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Username *</label>
              <input value={form.username} onChange={set('username')} placeholder="john_doe" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password *</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" className={inputClass} style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>City</label>
                <input value={form.city} onChange={set('city')} placeholder="New York" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Country</label>
                <input value={form.country} onChange={set('country')} placeholder="USA" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Additional Info</label>
              <textarea value={form.additionalInfo} onChange={set('additionalInfo')} placeholder="Tell us about yourself..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white mt-2"
              style={{ background: loading ? 'var(--border)' : 'var(--primary)' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)' }} className="font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
