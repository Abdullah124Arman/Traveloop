import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, Map, Search, Users, User, LogOut, ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-full" style={{ background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--primary)' }}>T</div>
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Traveloop</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
              })}
            >
              <ShieldCheck size={18} />
              Admin
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
              style={{ background: 'var(--primary)' }}>
              {user?.photoUrl
                ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                : `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--danger)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Traveloop</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden flex border-t"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs"
              style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : 'var(--text-muted)' })}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
