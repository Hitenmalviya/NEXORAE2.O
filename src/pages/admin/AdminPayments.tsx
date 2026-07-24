import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/admin';

interface Payment {
  _id: string;
  paymentId: string;
  nexoraeId: string;
  amount: number;
  payerUpiId?: string;
  transactionId?: string;
  screenshotUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
  student?: { fullName: string; isIEEE: boolean; email: string };
  eventId?: { name: string; slug: string };
}

const REJECTION_REASONS = [
  'Invalid UTR',
  'Screenshot does not match',
  'Incorrect amount',
  'Payment not received',
  'Duplicate transaction',
  'Other',
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    VERIFIED: 'bg-green-500/10 text-green-400 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] rounded-full border font-mono ${map[status] || 'text-muted border-white/10'}`}>
      {status}
    </span>
  );
}

function ScreenshotModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.25)); }} className="glass rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-glow">−</button>
        <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.25)); }} className="glass rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-glow">+</button>
        <a href={url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="glass rounded-full px-4 h-10 flex items-center text-[10px] uppercase tracking-widest text-muted hover:text-white">Full Size</a>
        <button onClick={onClose} className="glass rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-glow text-lg">×</button>
      </div>
      <motion.img
        src={url}
        alt="Payment Screenshot"
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
        onClick={e => e.stopPropagation()}
      />
      <p className="mt-4 text-[10px] text-dim uppercase tracking-widest">Click outside to close · ESC to close · No download</p>
    </motion.div>
  );
}

function RejectModal({ payment, onReject, onClose }: { payment: Payment; onReject: (note: string) => Promise<void>; onClose: () => void }) {
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    const note = selected === 'Other' ? custom : selected;
    if (!note) return;
    setLoading(true);
    await onReject(note);
    setLoading(false);
  };

  return (
    <motion.div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="glass-strong rounded-xl p-8 w-full max-w-md"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <h2 className="font-display text-xl font-bold tracking-wider uppercase mb-2">Reject Payment</h2>
        <p className="text-muted text-sm mb-6">Select a reason for rejection for <span className="text-white">{payment.student?.fullName || payment.nexoraeId}</span></p>

        <div className="flex flex-wrap gap-2 mb-6">
          {REJECTION_REASONS.map(r => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] rounded-full border transition-all ${selected === r ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/30'}`}
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {r}
            </button>
          ))}
        </div>

        {selected === 'Other' && (
          <input
            type="text"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Enter custom reason..."
            className="w-full bg-transparent border-b border-white/10 pb-2 mb-6 text-sm text-white outline-none focus:border-glow"
          />
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] border border-white/10 text-muted hover:text-white transition-all rounded-sm">Cancel</button>
          <button
            onClick={handleReject}
            disabled={loading || !selected || (selected === 'Other' && !custom)}
            className="flex-1 py-3 text-xs uppercase tracking-[0.15em] bg-glow text-white hover:bg-glow-bright transition-all rounded-sm disabled:opacity-40"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            {loading ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VerifyModal({ payment, onVerify, onClose }: { payment: Payment; onVerify: () => Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleVerify = async () => { setLoading(true); await onVerify(); setLoading(false); };

  return (
    <motion.div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="glass-strong rounded-xl p-8 w-full max-w-md"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <h2 className="font-display text-xl font-bold tracking-wider uppercase mb-2 text-green-400">Verify Payment</h2>
        <p className="text-muted text-sm mb-6">
          Confirm payment verification for <span className="text-white">{payment.student?.fullName || payment.nexoraeId}</span>?
        </p>
        <div className="glass rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-xs"><span className="text-muted">NEXORAE ID</span><span className="font-mono text-white">{payment.nexoraeId}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted">Event</span><span className="text-white">{payment.eventId?.name || '-'}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted">Amount</span><span className="text-green-400 font-mono">₹{payment.amount}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted">UTR</span><span className="font-mono text-white">{payment.transactionId || '-'}</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] border border-white/10 text-muted hover:text-white transition-all rounded-sm">Cancel</button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 py-3 text-xs uppercase tracking-[0.15em] bg-green-600 text-white hover:bg-green-500 transition-all rounded-sm disabled:opacity-40"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            {loading ? 'Verifying...' : 'Verify Payment'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<Payment | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Payment | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = 'Payment Verification | NEXORAE 2.0 Admin';
    fetchPayments();
  }, [statusFilter]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments({ status: statusFilter === 'ALL' ? undefined : statusFilter });
      const payload = res.data?.data || res.data;
      setPayments(payload?.payments || (Array.isArray(payload) ? payload : []));
    } catch {
      showToast('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyTarget) return;
    try {
      await adminApi.verifyPayment(verifyTarget._id);
      showToast('Payment verified successfully!', 'success');
      setVerifyTarget(null);
      fetchPayments();
    } catch {
      showToast('Failed to verify payment', 'error');
    }
  };

  const handleReject = async (note: string) => {
    if (!rejectTarget) return;
    try {
      await adminApi.rejectPayment(rejectTarget._id, note);
      showToast('Payment rejected.', 'success');
      setRejectTarget(null);
      fetchPayments();
    } catch {
      showToast('Failed to reject payment', 'error');
    }
  };

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-void/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display font-bold text-sm tracking-[0.2em] uppercase">
              Nexorae <span className="text-glow text-xs">Admin</span>
            </Link>
            <Link to="/admin/payments" className="text-[11px] uppercase tracking-[0.15em] text-white border-b border-glow pb-0.5">Payments</Link>
            <Link to="/admin/students" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white transition-colors">Students</Link>
            <Link to="/admin/events" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white transition-colors">Events</Link>
          </div>
        </div>
      </nav>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-20 right-6 z-[99999] glass rounded-lg px-6 py-3 text-sm ${toast.type === 'success' ? 'border-green-500/30 text-green-400' : 'border-glow text-glow'}`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {screenshotUrl && <ScreenshotModal url={screenshotUrl} onClose={() => setScreenshotUrl(null)} />}
      </AnimatePresence>

      {/* Verify Modal */}
      <AnimatePresence>
        {verifyTarget && <VerifyModal payment={verifyTarget} onVerify={handleVerify} onClose={() => setVerifyTarget(null)} />}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectTarget && <RejectModal payment={rejectTarget} onReject={handleReject} onClose={() => setRejectTarget(null)} />}
      </AnimatePresence>

      <main className="pt-24 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3 font-mono">Admin Panel</p>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-[0.04em] uppercase">
            Payment <span className="text-glow">Verification</span>
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full border transition-all ${statusFilter === s ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/20'}`}
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="glass rounded-xl p-16 text-center">
            <p className="text-3xl mb-4">✓</p>
            <p className="font-display text-xl uppercase tracking-wider text-muted">No {statusFilter.toLowerCase()} payments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(p => (
              <motion.div
                key={p._id}
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Student + Event info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-lg font-bold">
                        {p.student?.fullName || 'Unknown Student'}
                      </h3>
                      <StatusBadge status={p.status} />
                      {p.student?.isIEEE && (
                        <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] rounded-full border border-glow/30 text-glow">IEEE</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">NEXORAE ID</p>
                        <p className="font-mono text-white">{p.nexoraeId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">Event</p>
                        <p className="text-white">{p.eventId?.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">Amount</p>
                        <p className="font-mono text-glow">₹{p.amount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">Submitted</p>
                        <p className="text-muted">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      {p.payerUpiId && (
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">UPI ID</p>
                          <p className="font-mono text-white">{p.payerUpiId}</p>
                        </div>
                      )}
                      {p.transactionId && (
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-dim mb-1">UTR / TXN ID</p>
                          <p className="font-mono text-white">{p.transactionId}</p>
                        </div>
                      )}
                    </div>
                    {p.adminNote && (
                      <div className="mt-3 text-xs text-muted border-l-2 border-glow/30 pl-3">
                        <span className="text-glow">Note:</span> {p.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 md:items-end">
                    {p.screenshotUrl && (
                      <button
                        onClick={() => setScreenshotUrl(p.screenshotUrl!)}
                        className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] border border-white/20 text-muted hover:text-white hover:border-white/40 transition-all rounded-sm"
                        onMouseEnter={() => document.body.classList.add('cursor-hover')}
                        onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                      >
                        View Screenshot
                      </button>
                    )}
                    {p.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => setVerifyTarget(p)}
                          className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/40 transition-all rounded-sm"
                          onMouseEnter={() => document.body.classList.add('cursor-hover')}
                          onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                        >
                          Verify Payment
                        </button>
                        <button
                          onClick={() => setRejectTarget(p)}
                          className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] bg-glow/10 border border-glow/20 text-glow hover:bg-glow/20 transition-all rounded-sm"
                          onMouseEnter={() => document.body.classList.add('cursor-hover')}
                          onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                        >
                          Reject Payment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
