import { useEffect, useState, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
import FastLane from './components/FastLane.jsx';

// The flight (map + GSAP) is loaded only when needed, so the fast lane stays light.
const FlightView = lazy(() => import('./flight/FlightView.jsx'));

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

// Theme: system preference by default, remembered once the user picks.
function useTheme() {
  const [theme, setTheme] = useState(() =>
    read('theme') || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  // set during render so a view transition captures the new theme
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme;
  const toggle = () => {
    const flip = () => flushSync(() => setTheme((t) => { const n = t === 'dark' ? 'light' : 'dark'; write('theme', n); return n; }));
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // soft cross-fade between day and night where the browser supports it
    if (document.startViewTransition && !reduced) document.startViewTransition(flip);
    else flip();
  };
  return [theme, toggle];
}

// Fast lane by default for reduced motion, data saver or weak devices.
function defaultMode() {
  const saved = read('mode');
  if (saved === 'fast' || saved === 'flight') return saved;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData;
  const weak = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;
  return reduced || saveData || weak ? 'fast' : 'flight';
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => { document.documentElement.classList.toggle('fast', mode === 'fast'); }, [mode]);

  const switchTo = (m) => {
    write('mode', m);
    // keep the visitor's place: carry the hash across
    setMode(m);
    requestAnimationFrame(() => {
      const id = location.hash.slice(1);
      if (m === 'fast' && id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    });
  };

  if (mode === 'fast') {
    return <FastLane theme={theme} onToggleTheme={toggleTheme} onTakeFlight={() => switchTo('flight')} />;
  }
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'var(--bg-1)' }} />}>
      <FlightView theme={theme} onToggleTheme={toggleTheme} onSkip={() => switchTo('fast')} />
    </Suspense>
  );
}
