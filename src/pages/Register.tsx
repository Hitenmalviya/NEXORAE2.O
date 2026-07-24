import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentsApi } from '@/api/students';
import { Link } from 'react-router-dom';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentNumber: '',
    email: '',
    contactNumber: '',
    collegeName: '',
    branch: '',
    year: '',
    isIEEE: false,
    ieeeId: '',
  });

  useEffect(() => {
    document.title = 'Create Identity | NEXORAE 2.0';
  }, []);

  const handleNextStep1 = () => {
    if (!formData.fullName || !formData.enrollmentNumber || !formData.email || formData.contactNumber.length !== 10) {
      setError('Please fill all fields correctly. Contact number must be 10 digits.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.collegeName || !formData.branch || !formData.year || (formData.isIEEE && !formData.ieeeId)) {
      setError('Please fill all required academic details.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await studentsApi.register({
        fullName: formData.fullName,
        enrollmentNumber: formData.enrollmentNumber,
        email: formData.email,
        contactNumber: formData.contactNumber,
        collegeName: formData.collegeName,
        branch: formData.branch,
        year: formData.year,
        isIEEE: formData.isIEEE,
        ieeeId: formData.isIEEE ? formData.ieeeId : undefined,
      });
      
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to create identity.');
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto">
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] text-muted mb-6 font-mono text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Identity Creation
        </motion.p>

        <motion.h1
          className="font-display text-4xl md:text-5xl font-black tracking-[0.04em] uppercase leading-[0.95] mb-6 text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Create <span className="text-glow">NEXORAE ID</span>
        </motion.h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-16">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-500 ${
                  step >= s
                    ? 'bg-glow text-white'
                    : 'border border-white/10 text-dim'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-12 h-px transition-colors duration-500 ${step > s ? 'bg-glow' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="glass rounded-xl p-4 mb-6 border-glow bg-glow/5 text-glow text-center text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-display text-xl font-bold tracking-wider mb-2">
                Personal Details
              </h2>
              <p className="text-muted text-sm mb-8">Establish your base identity.</p>

              <div className="glass rounded-xl p-8 space-y-6 mb-8">
                {(['fullName', 'enrollmentNumber', 'email', 'contactNumber'] as const).map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                      placeholder={field}
                      id={`reg-${field}`}
                    />
                    <label
                      htmlFor={`reg-${field}`}
                      className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                    >
                      {field === 'fullName' ? 'Full Name' : 
                       field === 'enrollmentNumber' ? 'Enrollment Number' :
                       field === 'contactNumber' ? 'Contact Number' : 'Email Address'}
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextStep1}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 border border-glow text-glow hover:bg-glow hover:text-white"
                onMouseEnter={() => document.body.classList.add('cursor-hover')}
                onMouseLeave={() => document.body.classList.remove('cursor-hover')}
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-display text-xl font-bold tracking-wider mb-2">
                Academic Details
              </h2>
              <p className="text-muted text-sm mb-8">Tell us about your institution.</p>

              <div className="glass rounded-xl p-8 space-y-6 mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                    placeholder="College Name"
                    id="reg-collegeName"
                  />
                  <label
                    htmlFor="reg-collegeName"
                    className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                  >
                    College Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                    placeholder="Branch / Department"
                    id="reg-branch"
                  />
                  <label
                    htmlFor="reg-branch"
                    className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                  >
                    Branch / Department
                  </label>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Current Year</p>
                  <div className="flex flex-wrap gap-2">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'].map(y => (
                      <button
                        key={y}
                        onClick={() => setFormData({ ...formData, year: y })}
                        className={`px-4 py-2 text-xs rounded-full border transition-all ${formData.year === y ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/30'}`}
                        onMouseEnter={() => document.body.classList.add('cursor-hover')}
                        onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">IEEE Membership</p>
                  <div className="flex gap-2">
                    {['YES', 'NO'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, isIEEE: opt === 'YES', ieeeId: opt === 'NO' ? '' : formData.ieeeId })}
                        className={`px-6 py-2 text-xs rounded-full border transition-all ${formData.isIEEE === (opt === 'YES') ? 'border-glow bg-glow/10 text-glow' : 'border-white/10 text-muted hover:border-white/30'}`}
                        onMouseEnter={() => document.body.classList.add('cursor-hover')}
                        onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {formData.isIEEE && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="relative overflow-hidden"
                    >
                      <input
                        type="text"
                        value={formData.ieeeId}
                        onChange={(e) => setFormData({ ...formData, ieeeId: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                        placeholder="IEEE Membership ID"
                        id="reg-ieeeId"
                      />
                      <label
                        htmlFor="reg-ieeeId"
                        className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                      >
                        IEEE Membership ID
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 text-xs uppercase tracking-[0.2em] border border-white/10 text-muted hover:text-white transition-all rounded-sm"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-4 text-xs uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all rounded-sm disabled:opacity-50"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  {loading ? 'Processing...' : 'Generate Identity'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <h2 className="font-display text-3xl font-bold tracking-wider mb-2 uppercase">
                Welcome to NEXORAE 2.0
              </h2>
              <p className="text-muted tracking-widest text-xs uppercase mb-12">
                Your identity has been created
              </p>
              
              <div className="relative inline-block mb-12">
                <div className="absolute inset-0 bg-glow/20 blur-xl rounded-full" />
                <div className="glass-strong border-glow p-8 rounded-xl relative z-10 flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Next Steps</span>
                  <p className="text-sm text-white/80 max-w-md">
                    Your NEXORAE ID has been securely sent to your registered email address.
                    Use that ID together with your email to access your dashboard and register for events.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/events"
                  className="px-8 py-4 text-xs uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all rounded-sm"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  Explore Events
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 text-xs uppercase tracking-[0.2em] border border-white/20 text-white hover:border-white/50 transition-all rounded-sm"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  View My Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
