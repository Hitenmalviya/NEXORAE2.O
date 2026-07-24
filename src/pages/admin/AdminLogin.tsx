import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { setAdminToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.login(username, password);
      const token = res.data?.data?.token || res.data?.token;
      if (token) {
        setAdminToken(token);
        navigate('/admin');
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(220,38,38,0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-display font-bold text-2xl tracking-[0.2em] uppercase mb-2">
            Nexorae <span className="text-glow">2.0</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-mono">
            Admin Access
          </p>
        </motion.div>

        <motion.div
          className="glass-strong rounded-xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-2xl font-bold tracking-wider uppercase mb-8 text-center">
            Restricted <span className="text-glow">Zone</span>
          </h1>

          {error && (
            <div className="glass rounded-lg p-4 mb-6 border-glow bg-glow/5 text-glow text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                placeholder="Username"
                id="admin-username"
                autoComplete="username"
              />
              <label
                htmlFor="admin-username"
                className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
              >
                Username
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors pr-10"
                placeholder="Password"
                id="admin-password"
                autoComplete="current-password"
              />
              <label
                htmlFor="admin-password"
                className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-muted hover:text-white transition-colors text-xs"
                onMouseEnter={() => document.body.classList.add('cursor-hover')}
                onMouseLeave={() => document.body.classList.remove('cursor-hover')}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all duration-300 rounded-sm disabled:opacity-50"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-dim mt-6 font-mono tracking-wider">
          Unauthorized access is prohibited.
        </p>
      </div>
    </motion.main>
  );
}
