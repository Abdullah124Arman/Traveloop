import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login } from '../services/auth.service';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const authLogin = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('All fields required');
    setLoading(true);
    try {
      const { token, user } = await login(form.username, form.password);
      authLogin(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-3) 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'var(--primary)' }}>
            <span className="text-2xl">✈️</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Sign in to your Traveloop account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl border text-sm transition-colors"
                style={{
                  background: 'var(--surface-3)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{
                  background: 'var(--surface-3)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: loading ? 'var(--border)' : 'var(--primary)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)' }} className="font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
