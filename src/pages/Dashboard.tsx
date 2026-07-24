import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentsApi } from '@/api/students';
import { paymentsApi } from '@/api/payments';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { studentSession, setStudentSession, setStudentToken, clearStudentSession } = useAuth();
  
  const [nexoraeIdInput, setNexoraeIdInput] = useState('');
  const [emailInput, setEmailInput] = useState(studentSession?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  
  const [resubmittingFor, setResubmittingFor] = useState<string | null>(null);
  const [resubmitForm, setResubmitForm] = useState({ upiId: '', utr: '', screenshot: null as File | null });
  const [resubmitLoading, setResubmitLoading] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | NEXORAE 2.0';
    const token = sessionStorage.getItem('nexorae-student-token');
    if (studentSession?.email && token) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await studentsApi.getMe();
      setProfile(profileRes.data.data.student);
      setRegistrations(profileRes.data.data.registrations);
      
      // Keep session in sync
      setStudentSession({
        nexoraeId: profileRes.data.data.student.nexoraeId,
        fullName: profileRes.data.data.student.fullName,
        email: profileRes.data.data.student.email,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to load dashboard. Please verify your identity.');
      setProfile(null);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nexoraeIdInput || !emailInput) {
      setError('NEXORAE ID and registered email are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.verify({
        nexoraeId: nexoraeIdInput.toUpperCase(),
        email: emailInput.trim().toLowerCase(),
      });

      const { token, student, registrations: fetchedRegistrations } = response.data.data;
      setStudentToken(token);
      setStudentSession({
        nexoraeId: student.nexoraeId,
        fullName: student.fullName,
        email: student.email,
      });
      setProfile(student);
      setRegistrations(fetchedRegistrations);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid identity details');
      setProfile(null);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async (paymentId: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!resubmitForm.upiId || !upiRegex.test(resubmitForm.upiId.trim())) {
      alert('Please enter a valid UPI ID.');
      return;
    }
    if (!resubmitForm.utr || resubmitForm.utr.trim().length < 8 || !resubmitForm.screenshot) {
      alert('Please provide valid UTR and screenshot.');
      return;
    }
    if (resubmitForm.screenshot.size > 5 * 1024 * 1024) {
      alert('Screenshot must be 5 MB or smaller.');
      return;
    }
    setResubmitLoading(true);
    try {
      const formData = new FormData();
      if (resubmitForm.upiId) formData.append('upiId', resubmitForm.upiId);
      formData.append('upiId', resubmitForm.upiId.trim());
      formData.append('transactionId', resubmitForm.utr.trim());
      formData.append('screenshot', resubmitForm.screenshot);
      
      await paymentsApi.resubmitProof(paymentId, formData);
      alert('Payment proof resubmitted successfully.');
      setResubmittingFor(null);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to resubmit');
    } finally {
      setResubmitLoading(false);
    }
  };

  return (
    <motion.main
      className="min-h-screen pt-24 md:pt-32 pb-24 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] text-muted mb-6 font-mono text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          My Nexorae
        </motion.p>
        
        <motion.h1
          className="font-display text-4xl md:text-5xl font-black tracking-[0.04em] uppercase leading-[0.95] mb-12 text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Command <span className="text-glow">Center</span>
        </motion.h1>

        {!profile && (
          <div className="max-w-md mx-auto glass rounded-xl p-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-wider mb-6 text-center">Access Identity</h2>
            <form onSubmit={handleAccess} className="space-y-6">
              <div className="grid gap-6">
                <div className="relative">
                  <input
                    type="text"
                    value={nexoraeIdInput}
                    onChange={(e) => setNexoraeIdInput(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-xl text-center font-mono uppercase tracking-widest text-white outline-none focus:border-glow peer placeholder-transparent"
                    placeholder="NEX-XXXXXX"
                    id="dash-nexoraeid"
                  />
                  <label htmlFor="dash-nexoraeid" className="absolute top-0 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-glow">
                    NEXORAE ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-xl text-center text-white outline-none focus:border-glow peer placeholder-transparent"
                    placeholder="email@example.com"
                    id="dash-email"
                  />
                  <label htmlFor="dash-email" className="absolute top-0 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-glow">
                    Registered Email
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !nexoraeIdInput || !emailInput}
                className="w-full py-4 text-xs uppercase tracking-widest border border-glow text-glow hover:bg-glow hover:text-white transition-all rounded-sm disabled:opacity-50"
              >
                {loading ? 'Accessing...' : 'Verify & Access Dashboard'}
              </button>
            </form>
            <div className="mt-6 text-center border-t border-white/10 pt-6">
              <p className="text-xs text-muted mb-3">No identity found?</p>
              <Link to="/register" className="text-xs uppercase tracking-widest text-glow hover:underline">
                Create Identity
              </Link>
            </div>
          </div>
        )}

        {profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="md:col-span-1">
                <div className="glass rounded-xl p-6 h-full border border-white/10">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">Identity</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-dim">Name</p>
                      <p className="font-bold">{profile.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-dim">NEXORAE ID</p>
                      <p className="font-mono text-glow tracking-widest">{profile.nexoraeId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-dim">College</p>
                      <p className="text-sm truncate">{profile.collegeName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-dim">Status</p>
                      <div className="mt-1">
                        {profile.isIEEE ? 
                          <span className="inline-block text-xs px-2 py-1 bg-glow/20 text-glow border border-glow/30 rounded-full">IEEE Member</span> :
                          <span className="inline-block text-xs px-2 py-1 bg-white/10 text-white/70 border border-white/20 rounded-full">Non-IEEE</span>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { clearStudentSession(); setProfile(null); setNexoraeIdInput(''); setEmailInput(''); }} 
                    className="w-full mt-8 py-2 text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/50 transition-colors rounded-sm text-muted hover:text-white"
                  >
                    Clear Session
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">My Events</h2>
                
                {registrations.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center border border-white/10 flex flex-col items-center justify-center h-48">
                    <p className="text-muted text-sm mb-4">No events registered yet.</p>
                    <Link to="/events" className="px-6 py-3 text-xs uppercase tracking-widest border border-glow text-glow hover:bg-glow hover:text-white transition-colors rounded-sm">
                      Explore Events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div key={reg._id} className="glass rounded-xl p-5 border border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{reg.eventId.icon}</span>
                            <div>
                              <h3 className="font-display font-bold tracking-wider">{reg.eventId.name}</h3>
                              <p className="text-[10px] uppercase tracking-widest text-muted">{reg.eventId.slug}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <span className="text-sm font-bold">₹{reg.amount}</span>
                            <span className="text-[10px] text-muted">{new Date(reg.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                          <div>
                            {reg.registrationStatus === 'CONFIRMED' && (
                              <span className="inline-block px-3 py-1 bg-green-500/15 border border-green-500/30 text-green-500 text-[10px] uppercase tracking-widest rounded-full">
                                Confirmed
                              </span>
                            )}
                            {reg.registrationStatus === 'PAYMENT_VERIFICATION_PENDING' && (
                              <span className="inline-block px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest rounded-full">
                                Verification Pending
                              </span>
                            )}
                            {reg.registrationStatus === 'PAYMENT_REJECTED' && (
                              <span className="inline-block px-3 py-1 bg-red-500/15 border border-red-500/30 text-glow text-[10px] uppercase tracking-widest rounded-full">
                                Payment Rejected
                              </span>
                            )}
                          </div>
                          
                          {reg.registrationId && (
                            <div className="text-[10px] font-mono tracking-widest text-muted border border-white/10 px-2 py-1 rounded">
                              {reg.registrationId}
                            </div>
                          )}
                        </div>

                        {reg.registrationStatus === 'PAYMENT_REJECTED' && (
                          <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-glow mb-3"><span className="font-bold">Reason:</span> {reg.paymentId?.adminNote || 'Invalid payment proof'}</p>
                            
                            {resubmittingFor !== reg.paymentId?.paymentId ? (
                              <button onClick={() => setResubmittingFor(reg.paymentId?.paymentId || null)} className="px-4 py-2 text-[10px] uppercase tracking-widest bg-glow/20 border border-glow hover:bg-glow transition-colors rounded-sm text-white">
                                Resubmit Payment Proof
                              </button>
                            ) : (
                              <div className="mt-4 space-y-4 pt-4 border-t border-red-500/20">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-1">New UTR / Transaction ID</label>
                                  <input
                                    type="text"
                                    value={resubmitForm.utr}
                                    onChange={(e) => setResubmitForm({...resubmitForm, utr: e.target.value})}
                                    className="w-full bg-void border border-white/10 rounded-sm p-2 text-xs focus:border-glow outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-1">New Screenshot</label>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="text-xs"
                                    onChange={(e) => {
                                      if (e.target.files) setResubmitForm({...resubmitForm, screenshot: e.target.files[0]});
                                    }} 
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleResubmit(reg.paymentId!.paymentId)} disabled={resubmitLoading} className="px-4 py-2 text-[10px] uppercase tracking-widest bg-glow hover:bg-glow-bright transition-colors rounded-sm text-white disabled:opacity-50">
                                    {resubmitLoading ? 'Submitting...' : 'Submit'}
                                  </button>
                                  <button onClick={() => setResubmittingFor(null)} className="px-4 py-2 text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-colors rounded-sm text-white">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
