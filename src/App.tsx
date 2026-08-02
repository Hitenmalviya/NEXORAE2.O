import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/ui/Preloader';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// Lazy load all pages
const Home = lazy(() => import('@/pages/Home'));
const Events = lazy(() => import('@/pages/Events'));
const Timeline = lazy(() => import('@/pages/Timeline'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminStudents = lazy(() => import('@/pages/admin/AdminStudents'));
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'));
const AdminRegistrations = lazy(() => import('@/pages/admin/AdminRegistrations'));
const AdminGuard = lazy(() => import('@/components/admin/AdminGuard'));

// Film grain overlay
function FilmGrain() {
  return (
    <div
      className="film-grain"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
      aria-hidden="true"
    />
  );
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border border-glow/30 rounded-full animate-spin" style={{
          borderTopColor: '#dc2626',
        }} />
        <span className="text-[10px] uppercase tracking-[0.3em] text-dim font-mono">Loading</span>
      </div>
    </div>
  );
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/register" element={<Navigate to="/events" replace />} />
          <Route path="/dashboard" element={<Navigate to="/events" replace />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/payments" element={<AdminGuard><AdminPayments /></AdminGuard>} />
          <Route path="/admin/students" element={<AdminGuard><AdminStudents /></AdminGuard>} />
          <Route path="/admin/events" element={<AdminGuard><AdminEvents /></AdminGuard>} />
          <Route path="/admin/registrations" element={<AdminGuard><AdminRegistrations /></AdminGuard>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </AnimatePresence>
    </>
  );
}

// Inner component
function AppInner() {
  // Check if preloader was already shown this session
  const [preloaderComplete, setPreloaderComplete] = useState(() => {
    return sessionStorage.getItem('nexorae-preloaded') === '1';
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('nexorae-preloaded', '1');
    setPreloaderComplete(true);
  };

  return (
    <>
      {/* Skip navigation for accessibility */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[99999] px-4 py-2 bg-glow text-white text-xs uppercase tracking-widest -translate-y-20 focus:translate-y-0 transition-transform duration-300 rounded-sm"
      >
        Skip to content
      </a>

      {/* Preloader */}
      {!preloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Film grain overlay */}
      <FilmGrain />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content">
        <AnimatedRoutes />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
