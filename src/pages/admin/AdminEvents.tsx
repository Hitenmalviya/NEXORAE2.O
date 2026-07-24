import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/admin';

interface EventItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  prize: string;
  feeIEEE: number;
  feeNonIEEE: number;
  maxParticipants: number;
  currentRegistrations: number;
  isActive: boolean;
  icon: string;
  date?: string;
  venue?: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<EventItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: 'tech', difficulty: 'medium',
    prize: '', icon: '⚡', feeIEEE: 150, feeNonIEEE: 250,
    maxParticipants: 100, date: '', time: '', venue: 'GCET, Vallabh Vidyanagar',
    teamMin: 1, teamMax: 2,
  });

  useEffect(() => {
    document.title = 'Events | NEXORAE 2.0 Admin';
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getEvents();
      const list = res.data?.data || res.data;
      setEvents(Array.isArray(list) ? list : []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleToggle = async (id: string, isActive: boolean) => {
    await adminApi.updateEvent(id, { isActive: !isActive });
    setEvents(prev => prev.map(e => e._id === id ? { ...e, isActive: !isActive } : e));
    showToast(`Event ${isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await adminApi.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      showToast('Event deleted');
    } catch (e: unknown) {
      const err = e as Error;
      showToast(err.message || 'Delete failed');
    }
  };

  const handleCreate = async () => {
    try {
      await adminApi.createEvent({
        ...form,
        team: { min: form.teamMin, max: form.teamMax },
      });
      setShowCreate(false);
      setForm({ name: '', description: '', category: 'tech', difficulty: 'medium', prize: '', icon: '⚡', feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100, date: '', time: '', venue: 'GCET, Vallabh Vidyanagar', teamMin: 1, teamMax: 2 });
      fetchEvents();
      showToast('Event created successfully!');
    } catch (e: unknown) {
      const err = e as Error;
      showToast(err.message || 'Create failed');
    }
  };

  const inputClass = "w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-glow transition-colors";

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-void/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display font-bold text-sm tracking-[0.2em] uppercase">Nexorae <span className="text-glow text-xs">Admin</span></Link>
            <Link to="/admin/payments" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Payments</Link>
            <Link to="/admin/students" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Students</Link>
            <Link to="/admin/events" className="text-[11px] uppercase tracking-[0.15em] text-white border-b border-glow pb-0.5">Events</Link>
            <Link to="/admin/registrations" className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-white">Registrations</Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {toast && (
          <motion.div className="fixed top-20 right-6 z-[99999] glass rounded-lg px-6 py-3 text-sm text-green-400 border-green-500/20"
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3 font-mono">Admin Panel</p>
            <h1 className="font-display text-4xl font-black tracking-[0.04em] uppercase">Event <span className="text-glow">Management</span></h1>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all rounded-sm"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            + Create Event
          </button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              className="glass rounded-xl p-8 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2 className="font-display text-xl uppercase tracking-wider mb-6">Create New Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input className={inputClass} placeholder="Event Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className={inputClass} placeholder="Prize (e.g. ₹10,000)" value={form.prize} onChange={e => setForm(f => ({ ...f, prize: e.target.value }))} />
                <input className={inputClass} placeholder="Icon emoji" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
                <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="tech">Tech</option>
                  <option value="design">Design</option>
                  <option value="fun">Fun</option>
                </select>
                <select className={inputClass} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input className={inputClass} placeholder="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                <input className={inputClass} placeholder="Venue" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
                <input className={inputClass} type="number" placeholder="Max Participants" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: +e.target.value }))} />
                <input className={inputClass} type="number" placeholder="IEEE Fee" value={form.feeIEEE} onChange={e => setForm(f => ({ ...f, feeIEEE: +e.target.value }))} />
                <input className={inputClass} type="number" placeholder="Non-IEEE Fee" value={form.feeNonIEEE} onChange={e => setForm(f => ({ ...f, feeNonIEEE: +e.target.value }))} />
              </div>
              <textarea className={`${inputClass} mb-4 min-h-[80px] resize-none`} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <button onClick={handleCreate} className="px-6 py-3 text-xs uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all rounded-sm">Create Event</button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-xl h-48 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(e => (
              <motion.div key={e._id} className={`glass rounded-xl p-6 ${!e.isActive ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{e.icon}</span>
                      <h3 className="font-display font-bold tracking-wider">{e.name}</h3>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.15em] text-muted">{e.category} · {e.difficulty}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full border ${e.isActive ? 'border-green-500/20 text-green-400' : 'border-white/10 text-dim'}`}>
                    {e.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">Capacity</span>
                    <span className="font-mono">{e.currentRegistrations}/{e.maxParticipants}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div
                      className="h-full rounded-full bg-glow"
                      style={{ width: `${Math.min(100, (e.currentRegistrations / e.maxParticipants) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted mb-4">
                  <span>IEEE: <span className="text-glow">₹{e.feeIEEE}</span></span>
                  <span>Non-IEEE: <span className="text-white">₹{e.feeNonIEEE}</span></span>
                  <span className="text-glow">{e.prize}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(e._id, e.isActive)}
                    className="flex-1 py-1.5 text-[9px] uppercase tracking-[0.15em] border border-white/10 text-muted hover:border-white/30 hover:text-white transition-all rounded-sm"
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    {e.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border border-glow/20 text-glow hover:bg-glow/10 transition-all rounded-sm"
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
