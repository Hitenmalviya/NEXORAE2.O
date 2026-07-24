import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin';

interface DashboardStats {
  totalStudents: number;
  totalRegistrations: number;
  totalRevenue: number;
  paymentsByStatus: { _id: string; count: number }[];
  registrationsByStatus: { _id: string; count: number }[];
  ieeeStats: { _id: boolean; count: number }[];
}

function StatCard({ label, value, accent = false, pulse = false }: { label: string; value: string | number; accent?: boolean; pulse?: boolean }) {
  return (
    <motion.div
      className={`glass rounded-xl p-6 relative overflow-hidden ${accent ? 'border border-glow/30' : ''}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {pulse && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glow opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-glow"></span>
        </span>
      )}
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-3">{label}</p>
      <p className={`font-display text-3xl font-bold ${accent ? 'text-glow' : 'text-white'}`}>{value}</p>
    </motion.div>
  );
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Registrations', href: '/admin/registrations' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Dashboard | NEXORAE 2.0';
    adminApi.getDashboardStats()
      .then(res => setStats(res.data?.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('nexorae-admin-token');
    navigate('/admin/login');
  };

  const getPendingCount = () => {
    if (!stats || !Array.isArray(stats.paymentsByStatus)) return 0;
    return stats.paymentsByStatus.find(p => p._id === 'PENDING')?.count || 0;
  };

  const getVerifiedCount = () => {
    if (!stats || !Array.isArray(stats.paymentsByStatus)) return 0;
    return stats.paymentsByStatus.find(p => p._id === 'VERIFIED')?.count || 0;
  };

  const formatRevenue = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-void/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="font-display font-bold text-sm tracking-[0.2em] uppercase">
              Nexorae <span className="text-glow text-xs">Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white transition-colors relative"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  {item.label}
                  {item.label === 'Payments' && getPendingCount() > 0 && (
                    <span className="ml-1 text-[9px] bg-glow text-white px-1.5 py-0.5 rounded-full">{getPendingCount()}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={logout}
            className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-glow transition-colors border border-white/10 hover:border-glow/30 px-4 py-2 rounded-sm"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-6 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3 font-mono">Control Panel</p>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-[0.04em] uppercase">
            Admin <span className="text-glow">Dashboard</span>
          </h1>
        </motion.div>

        {/* Pending alert */}
        {!loading && getPendingCount() > 0 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-glow rounded-xl p-4 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-glow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-glow"></span>
              </span>
              <p className="text-sm text-glow font-mono">
                <span className="font-bold">{getPendingCount()}</span> payment{getPendingCount() > 1 ? 's' : ''} awaiting verification
              </p>
            </div>
            <Link
              to="/admin/payments"
              className="text-[10px] uppercase tracking-[0.2em] text-glow border border-glow/30 px-4 py-2 rounded-sm hover:bg-glow hover:text-white transition-all"
            >
              Review Now
            </Link>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-6 animate-pulse">
                <div className="h-3 bg-white/5 rounded mb-4 w-2/3" />
                <div className="h-8 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard label="Total Students" value={stats.totalStudents} />
              <StatCard label="Total Registrations" value={stats.totalRegistrations} />
              <StatCard label="Total Revenue" value={formatRevenue(stats.totalRevenue)} accent />
              <StatCard label="Pending Payments" value={getPendingCount()} accent={getPendingCount() > 0} pulse={getPendingCount() > 0} />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass rounded-xl p-6">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-6">Payment Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Verified', status: 'VERIFIED', color: '#22c55e' },
                    { label: 'Pending', status: 'PENDING', color: '#f59e0b' },
                    { label: 'Rejected', status: 'REJECTED', color: '#dc2626' },
                  ].map(({ label, status, color }) => {
                    const paymentsList = stats.paymentsByStatus || [];
                    const count = paymentsList.find(p => p._id === status)?.count || 0;
                    const total = paymentsList.reduce((a, b) => a + b.count, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">{label}</span>
                          <span style={{ color }}>{count}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-6">IEEE Membership</h3>
                <div className="space-y-3">
                  {(stats.ieeeStats || []).map(s => (
                    <div key={String(s._id)} className="flex justify-between items-center">
                      <span className="text-sm text-muted">{s._id ? 'IEEE Member' : 'Non-Member'}</span>
                      <span className={`font-mono text-lg ${s._id ? 'text-glow' : 'text-white/50'}`}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  {NAV_ITEMS.filter(n => n.href !== '/admin').map(item => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between p-3 glass rounded-lg hover:border-glow/20 transition-all group"
                      onMouseEnter={() => document.body.classList.add('cursor-hover')}
                      onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                    >
                      <span className="text-xs uppercase tracking-[0.15em] text-muted group-hover:text-white transition-colors">{item.label}</span>
                      <span className="text-muted group-hover:text-glow transition-colors">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats summary */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-1">Confirmed Registrations</p>
                  <p className="text-2xl font-display font-bold text-white">{getVerifiedCount()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono mb-1">Average Revenue/Student</p>
                  <p className="text-2xl font-display font-bold text-white">
                    {stats.totalStudents > 0 ? formatRevenue(Math.round(stats.totalRevenue / stats.totalStudents)) : '₹0'}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-muted">Failed to load dashboard stats.</p>
          </div>
        )}
      </main>
    </motion.div>
  );
}
