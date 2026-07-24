import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin';

interface Registration {
  _id: string;
  registrationId?: string;
  nexoraeId: string;
  amount: number;
  paymentStatus: string;
  registrationStatus: string;
  createdAt: string;
  studentId?: { fullName: string; email: string; enrollmentNumber: string; isIEEE: boolean };
  eventId?: { name: string; slug: string };
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-500/10 text-green-400 border-green-500/20',
  PAYMENT_VERIFICATION_PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PAYMENT_REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  CANCELLED: 'bg-white/5 text-dim border-white/10',
};

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    document.title = 'Registrations | NEXORAE 2.0 Admin';
    fetchRegistrations();
  }, [page, statusFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      const res = await adminApi.getRegistrations(params);
      const payload = res.data?.data || res.data;
      setRegistrations(payload?.registrations || (Array.isArray(payload) ? payload : []));
      setTotal(payload?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await adminApi.exportRegistrations();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexorae-registrations-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed');
    }
  };

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-void/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display font-bold text-sm tracking-[0.2em] uppercase">Nexorae <span className="text-glow text-xs">Admin</span></Link>
            <Link to="/admin/payments" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Payments</Link>
            <Link to="/admin/students" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Students</Link>
            <Link to="/admin/events" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Events</Link>
            <Link to="/admin/registrations" className="text-[11px] uppercase tracking-[0.15em] text-white border-b border-glow pb-0.5">Registrations</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3 font-mono">Admin Panel</p>
            <h1 className="font-display text-4xl font-black tracking-[0.04em] uppercase">
              Event <span className="text-glow">Registrations</span>
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-muted text-sm font-mono">{total} total</span>
            <button
              onClick={handleExport}
              className="px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-white/20 text-muted hover:text-white hover:border-white/40 transition-all rounded-sm"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: 'All', value: '' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Pending Verification', value: 'PAYMENT_VERIFICATION_PENDING' },
            { label: 'Payment Rejected', value: 'PAYMENT_REJECTED' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] rounded-full border transition-all ${statusFilter === f.value ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/20'}`}
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="glass rounded-lg h-16 animate-pulse" />)}
          </div>
        ) : registrations.length === 0 ? (
          <div className="glass rounded-xl p-16 text-center">
            <p className="text-muted">No registrations found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {['Reg ID', 'Student', 'NEXORAE ID', 'Event', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-dim font-mono whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r, i) => (
                      <motion.tr
                        key={r._id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-4 py-3 font-mono text-glow text-xs whitespace-nowrap">{r.registrationId || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-white">{r.studentId?.fullName || '—'}</p>
                          <p className="text-[10px] text-dim">{r.studentId?.email}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{r.nexoraeId}</td>
                        <td className="px-4 py-3 text-white whitespace-nowrap">{r.eventId?.name || '—'}</td>
                        <td className="px-4 py-3 font-mono text-glow whitespace-nowrap">₹{r.amount}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] rounded-full border ${STATUS_COLORS[r.paymentStatus] || 'text-dim border-white/10'}`}>
                            {r.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] rounded-full border ${STATUS_COLORS[r.registrationStatus] || 'text-dim border-white/10'}`}>
                            {r.registrationStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-dim text-xs whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {total > LIMIT && (
              <div className="flex items-center justify-between">
                <p className="text-muted text-xs font-mono">Page {page} · {total} total</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 text-xs border border-white/10 text-muted hover:text-white hover:border-white/30 transition-all rounded-sm disabled:opacity-30">Previous</button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                    className="px-4 py-2 text-xs border border-white/10 text-muted hover:text-white hover:border-white/30 transition-all rounded-sm disabled:opacity-30">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
}
