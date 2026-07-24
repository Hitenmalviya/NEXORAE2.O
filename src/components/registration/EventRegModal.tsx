import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentsApi } from '@/api/students';
import { eventsApi } from '@/api/events';
import type { EventData } from '@/api/events';
import { paymentsApi } from '@/api/payments';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface EventRegModalProps {
  event: EventData;
  onClose: () => void;
}

export default function EventRegModal({ event, onClose }: EventRegModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { studentSession, setStudentSession, setStudentToken } = useAuth();
  
  const [nexoraeId, setNexoraeId] = useState(studentSession?.nexoraeId || '');
  const [email, setEmail] = useState(studentSession?.email || '');
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  const [paymentForm, setPaymentForm] = useState({
    upiId: '',
    utr: '',
    screenshot: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleVerifyIdentity = async () => {
    if (!nexoraeId || !email) {
      setError('Please enter your NEXORAE ID and registered email');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await studentsApi.verify({
        nexoraeId: nexoraeId.toUpperCase(),
        email: email.trim().toLowerCase(),
      });
      const { token, student } = response.data.data;
      setStudentToken(token);
      setStudentSession({
        nexoraeId: student.nexoraeId,
        fullName: student.fullName,
        email: student.email,
      });
      setStudentProfile(student);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'NEXORAE ID or email not found — Create one at /register');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsApi.registerForEvent(event._id, nexoraeId, email);
      setPaymentData(response.data);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    const selectedFile = paymentForm.screenshot;

    if (!paymentForm.upiId || !upiRegex.test(paymentForm.upiId.trim())) {
      setError('Please enter a valid UPI ID used for payment');
      return;
    }
    if (!paymentForm.utr || paymentForm.utr.trim().length < 8) {
      setError('Please enter a valid UTR / Transaction ID (min 8 chars)');
      return;
    }
    if (!selectedFile) {
      setError('Please upload a screenshot of your payment');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Screenshot must be 5 MB or smaller');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('paymentId', paymentData.payment.paymentId);
    formData.append('nexoraeId', studentProfile?.nexoraeId || '');
    formData.append('upiId', paymentForm.upiId.trim());
    formData.append('transactionId', paymentForm.utr.trim());
    formData.append('screenshot', selectedFile);

    try {
      await paymentsApi.submitProof(formData);
      setStep(5);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment proof');
    } finally {
      setLoading(false);
    }
  };

  const amountToPay = studentProfile?.isIEEE ? event.feeIEEE : event.feeNonIEEE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        className="relative z-10 w-full max-w-lg glass-strong rounded-2xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Verify Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider mb-2 text-center">Register For Event</h2>
                <p className="text-glow text-center text-sm font-bold tracking-widest mb-8">{event.name}</p>
                
                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-center">{error}</div>}
                
                <div className="grid gap-6 mb-8">
                  <div className="relative">
                    <input
                      type="text"
                      value={nexoraeId}
                      onChange={(e) => setNexoraeId(e.target.value.toUpperCase())}
                      className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-center text-xl text-white outline-none focus:border-glow font-mono uppercase tracking-widest peer placeholder-transparent"
                      placeholder="NEX-XXXXXX"
                      id="reg-nexoraeid"
                    />
                    <label htmlFor="reg-nexoraeid" className="absolute top-0 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-glow">
                      NEXORAE ID
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-center text-xl text-white outline-none focus:border-glow peer placeholder-transparent"
                      placeholder="email@example.com"
                      id="reg-email"
                    />
                    <label htmlFor="reg-email" className="absolute top-0 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-glow">
                      Registered Email
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={handleVerifyIdentity}
                  disabled={loading}
                  className="w-full py-4 text-xs uppercase tracking-[0.2em] bg-glow text-white hover:bg-glow-bright transition-colors rounded-sm disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Identity'}
                </button>
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted">Don't have an ID? <Link to="/register" className="text-glow hover:underline">Create one</Link></p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm Profile */}
            {step === 2 && studentProfile && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-xl font-bold uppercase tracking-wider mb-6 text-center">Verify Identity</h2>
                
                <div className="glass p-5 rounded-xl mb-6 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-muted uppercase">Student</span>
                    <span className="font-bold">{studentProfile.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-muted uppercase">ID</span>
                    <span className="font-mono text-glow">{studentProfile.nexoraeId}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-muted uppercase">College</span>
                    <span className="text-sm truncate max-w-[200px]">{studentProfile.collegeName}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-muted uppercase">Status</span>
                    {studentProfile.isIEEE ? 
                      <span className="text-xs px-2 py-1 bg-glow/20 text-glow border border-glow/30 rounded-full">IEEE Member</span> :
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/70 border border-white/20 rounded-full">Non-IEEE</span>
                    }
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-xs text-muted uppercase tracking-widest mb-2">Registration Fee</p>
                  <p className="text-4xl font-display font-bold text-white">₹{amountToPay}</p>
                </div>

                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-center">{error}</div>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-4 py-3 text-xs uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-colors rounded-sm">Back</button>
                  <button onClick={handleConfirmRegistration} disabled={loading} className="flex-1 py-3 text-xs uppercase tracking-widest bg-glow text-white hover:bg-glow-bright transition-colors rounded-sm disabled:opacity-50">
                    {loading ? 'Processing...' : 'Confirm & Pay'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && paymentData && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-xl font-bold uppercase tracking-wider mb-2 text-center">Complete Payment</h2>
                <p className="text-center text-sm text-muted mb-6">Amount to pay: <span className="text-white font-bold">₹{amountToPay}</span></p>

                <div className="flex flex-col items-center justify-center gap-6 mb-8">
                  <div className="p-4 bg-white rounded-xl">
                    <img src={paymentData.qrCodeDataUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted uppercase tracking-widest mb-3">Or pay via UPI App</p>
                    <a href={paymentData.upiIntentLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-xs uppercase tracking-widest border border-glow text-glow hover:bg-glow hover:text-white transition-colors rounded-sm">
                      Open UPI App
                    </a>
                  </div>
                </div>

                <button onClick={() => setStep(4)} className="w-full py-4 text-xs uppercase tracking-widest bg-white text-void hover:bg-white/90 font-bold transition-colors rounded-sm">
                  I have completed payment
                </button>
              </motion.div>
            )}

            {/* Step 4: Payment Proof */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider mb-2 text-center">VERIFY YOUR PAYMENT</h2>
                <p className="text-center text-sm text-muted mb-6">Submit your payment details to complete your event registration.</p>

                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-center">{error}</div>}

                <div className="grid gap-4 mb-6">
                  <div className="grid gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted">NEXORAE ID</label>
                    <input
                      type="text"
                      readOnly
                      value={studentProfile?.nexoraeId || ''}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted">Event</label>
                    <input
                      type="text"
                      readOnly
                      value={event.name}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted">Amount</label>
                    <input
                      type="text"
                      readOnly
                      value={`₹${amountToPay}`}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={paymentForm.upiId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                      className="w-full bg-void border border-white/10 rounded-sm p-3 text-sm focus:border-glow outline-none"
                      placeholder="yourname@okaxis"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-1">UTR / Transaction ID *</label>
                    <input
                      type="text"
                      value={paymentForm.utr}
                      onChange={(e) => setPaymentForm({ ...paymentForm, utr: e.target.value })}
                      className="w-full bg-void border border-white/10 rounded-sm p-3 text-sm focus:border-glow outline-none"
                      placeholder="12-digit number from your bank"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-1">Payment Screenshot *</label>
                    
                    {!paymentForm.screenshot ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 hover:border-glow/50 rounded-lg cursor-pointer bg-white/5 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="text-xs text-muted mb-1">Click to upload screenshot</p>
                          <p className="text-[10px] text-white/30">JPG, JPEG, PNG, WEBP · Max 5 MB</p>
                        </div>
                        <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            if (file.size > 5 * 1024 * 1024) {
                              setError('Screenshot must be 5 MB or smaller');
                              return;
                            }
                            setError(null);
                            setPaymentForm({ ...paymentForm, screenshot: file });
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }} />
                      </label>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-white/20">
                        <img src={previewUrl || URL.createObjectURL(paymentForm.screenshot)} alt="Proof" className="w-full h-32 object-cover opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center bg-void/50">
                          <span className="text-xs font-bold">{paymentForm.screenshot.name}</span>
                        </div>
                        <button onClick={() => {
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPaymentForm({ ...paymentForm, screenshot: null });
                          setPreviewUrl(null);
                        }} className="absolute top-2 right-2 p-1 bg-red-500 rounded text-white text-xs">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={handleSubmitProof} disabled={loading} className="w-full py-4 text-xs uppercase tracking-widest bg-glow text-white hover:bg-glow-bright transition-colors rounded-sm disabled:opacity-50">
                  {loading ? 'Uploading...' : 'Submit for Verification'}
                </button>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider mb-2">Payment Submitted</h2>
                <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest rounded-full mb-6">
                  Verification Pending
                </div>
                <p className="text-sm text-muted mb-8 max-w-[280px] mx-auto">
                  Your payment is currently being verified by our team. You'll receive a confirmation email once verified.
                </p>
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-colors rounded-sm">Close</button>
                  <Link to="/dashboard" onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-widest bg-glow text-white hover:bg-glow-bright transition-colors rounded-sm text-center flex items-center justify-center">
                    My Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
