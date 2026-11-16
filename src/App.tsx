import React, { useEffect, useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';

// ─── Top-level Error Boundary ────────────────────────────────
// Catches any unhandled React render errors so the page never goes blank.
class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error('[AppErrorBoundary] Caught error:', err, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08090B',
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          gap: '1rem',
          padding: '2rem',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6C8CFF' }}>BK</div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1.4rem',
              background: 'rgba(108,140,255,0.12)',
              border: '1px solid rgba(108,140,255,0.3)',
              borderRadius: '8px',
              color: '#6C8CFF',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


// Page loader
function PageLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="page-loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#08090B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <motion.div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6C8CFF, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        BK
      </motion.div>
      <motion.div
        style={{
          width: 120,
          height: 1,
          background: 'rgba(108, 140, 255, 0.2)',
          borderRadius: 9999,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #6C8CFF, #A78BFA)',
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Ctrl/Cmd + K command palette
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <AppErrorBoundary>
      <AnimatePresence>
        {!loaded && <PageLoader onDone={() => setLoaded(true)} key="loader" />}
      </AnimatePresence>

      {loaded && (
        <>
          <ScrollProgress />
          <Navbar />

          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Journey />
            <Achievements />
            <Contact />
          </main>

          <Footer />

          <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

          {/* Ctrl+K hint tooltip (first visit) */}
          <CmdKHint />
        </>
      )}
    </AppErrorBoundary>
  );
}

// Brief tooltip hint showing users the command palette shortcut
function CmdKHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('cmd-hint-seen');
    if (!seen) {
      const timer = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem('cmd-hint-seen', '1');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'rgba(21, 24, 32, 0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 1500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
          aria-live="polite"
        >
          <span style={{ fontSize: '0.78rem', color: '#A0A4AE', fontFamily: "'Inter', sans-serif" }}>
            Press
          </span>
          <kbd style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            background: 'rgba(108,140,255,0.1)',
            color: '#6C8CFF',
            border: '1px solid rgba(108,140,255,0.2)',
            borderRadius: 4,
            padding: '0.15rem 0.4rem',
          }}>
            Ctrl + K
          </kbd>
          <span style={{ fontSize: '0.78rem', color: '#A0A4AE', fontFamily: "'Inter', sans-serif" }}>
            to open command palette
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
