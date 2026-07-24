import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin';

interface Student {
  _id: string;
  nexoraeId: string;
  fullName: string;
  enrollmentNumber: string;
  email: string;
  contactNumber: string;
  isIEEE: boolean;
  ieeeId?: string;
  branch: string;
  collegeName: string;
  year: string;
  createdAt: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ieeeFilter, setIeeeFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    document.title = 'Students | NEXORAE 2.0 Admin';
    fetchStudents();
  }, [page, search, ieeeFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: LIMIT };
      if (search) params.search = search;
      if (ieeeFilter !== 'ALL') params.isIEEE = ieeeFilter === 'IEEE';
      const res = await adminApi.getStudents(params);
      const payload = res.data?.data || res.data;
      setStudents(payload?.students || (Array.isArray(payload) ? payload : []));
      setTotal(payload?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await adminApi.exportStudents();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexorae-students-${Date.now()}.csv`;
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
            <Link to="/admin" className="font-display font-bold text-sm tracking-[0.2em] uppercase">
              Nexorae <span className="text-glow text-xs">Admin</span>
            </Link>
            <Link to="/admin/payments" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Payments</Link>
            <Link to="/admin/students" className="text-[11px] uppercase tracking-[0.15em] text-white border-b border-glow pb-0.5">Students</Link>
            <Link to="/admin/events" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Events</Link>
            <Link to="/admin/registrations" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Registrations</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3 font-mono">Admin Panel</p>
            <h1 className="font-display text-4xl font-black tracking-[0.04em] uppercase">
              Student <span className="text-glow">Management</span>
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, NEXORAE ID, enrollment..."
            className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-glow transition-colors placeholder:text-dim"
          />
          <div className="flex gap-2">
            {['ALL', 'IEEE', 'NON-IEEE'].map(f => (
              <button
                key={f}
                onClick={() => { setIeeeFilter(f); setPage(1); }}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] rounded-full border transition-all ${ieeeFilter === f ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/20'}`}
                onMouseEnter={() => document.body.classList.add('cursor-hover')}
                onMouseLeave={() => document.body.classList.remove('cursor-hover')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="glass rounded-lg h-16 animate-pulse" />)}
          </div>
        ) : students.length === 0 ? (
          <div className="glass rounded-xl p-16 text-center">
            <p className="text-muted">No students found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {['NEXORAE ID', 'Name', 'Enrollment', 'Email', 'College', 'Branch', 'Year', 'IEEE', 'Registered'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-dim font-mono whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <motion.tr
                        key={s._id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-4 py-3 font-mono text-glow text-xs whitespace-nowrap">{s.nexoraeId}</td>
                        <td className="px-4 py-3 text-white whitespace-nowrap">{s.fullName}</td>
                        <td className="px-4 py-3 text-muted font-mono text-xs whitespace-nowrap">{s.enrollmentNumber}</td>
                        <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{s.email}</td>
                        <td className="px-4 py-3 text-muted text-xs whitespace-nowrap max-w-[150px] truncate">{s.collegeName}</td>
                        <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{s.branch}</td>
                        <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{s.year}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] rounded-full border ${s.isIEEE ? 'border-glow/30 text-glow' : 'border-white/10 text-dim'}`}>
                            {s.isIEEE ? 'IEEE' : 'Non'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-dim text-xs whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {total > LIMIT && (
              <div className="flex items-center justify-between">
                <p className="text-muted text-xs font-mono">Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-xs border border-white/10 text-muted hover:text-white hover:border-white/30 transition-all rounded-sm disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * LIMIT >= total}
                    className="px-4 py-2 text-xs border border-white/10 text-muted hover:text-white hover:border-white/30 transition-all rounded-sm disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
}
