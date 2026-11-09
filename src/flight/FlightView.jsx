import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { person, resume, stops, landmarks, projects, transit } from '../content.js';
import { Download, Sun, Moon, Plane as PlaneIcon, ArrowDown, ArrowUp } from '../components/Icons.jsx';
import {
  HomePage, ProjectsPage, ProjectDetail, HackathonsPage, AchievementsPage, SkillsPage, AboutPage, ResumePage, ContactPage, railBus,
} from '../components/Sections.jsx';
import MapArt from './MapArt.jsx';
import Sky, { cloudSpecs } from './Sky.jsx';
import { curveThrough, samplePath, pointAt, lengthNear, lerp, clamp, smooth } from './geometry.js';
import './flight.css';

const Intro = lazy(() => import('./Intro.jsx'));
// the globe intro plays once per browser session, on a plain visit to the home page
function shouldIntro(initial) {
  if (prefersReducedEarly() || initial.project || initial.page !== 'hero' || location.hash) return false;
  try { return sessionStorage.getItem('introSeen') !== '1'; } catch { return true; }
}
const prefersReducedEarly = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------
// The flight, one page at a time.
// Scroll, swipe, arrow keys, the header or the dots move to a page:
// the page fades, the blur clears, the plane flies there (plane stays
// in the centre, the map moves under it), then the map blurs again and
// the new page appears on top.
// ---------------------------------------------------------------

const PAGES = stops.map((s) => s.id); // hero, projects, hackathons, achievements, skills, about, resume, contact
const byId = Object.fromEntries(stops.map((s) => [s.id, s]));
const lmById = Object.fromEntries(landmarks.map((l) => [l.id, l]));
const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const PAGE_VIEW = {
  hero: HomePage, projects: ProjectsPage, hackathons: HackathonsPage, achievements: AchievementsPage, skills: SkillsPage,
  about: AboutPage, resume: ResumePage, contact: ContactPage,
};

// Ordered route the plane follows: main stops with project landmarks and a pull-back point slotted in
function buildRoute() {
  const projectStops = projects.map((p) => lmById[p.landmark]).filter(Boolean);
  const main = (id) => ({ ...byId[id], kind: 'stop' });
  return [
    main('hero'), main('projects'),
    ...projectStops.map((l) => ({ ...l, kind: 'landmark' })),
    main('hackathons'), main('achievements'), main('skills'),
    { id: 'transit', kind: 'transit', ...transit },
    main('about'), main('resume'), main('contact'),
  ];
}

// "#about" -> { page: 'about' }, "#project-snapstock" -> { page: 'projects', project: 'snapstock' }
function fromHash(hash) {
  const h = (hash || '').replace('#', '');
  if (byId[h]) return { page: h, project: null };
  const p = projects.find((x) => `project-${x.id}` === h);
  return p ? { page: 'projects', project: p.id } : null;
}
const toHash = (t) => (t.project ? `project-${t.project}` : t.page);
const sameStop = (a, b) => a && b && a.page === b.page && (a.project || null) === (b.project || null);

// ---- Time of day: morning (Subang) -> golden hour (Sunway) -> sunset -> evening (Klang) ----
const SKY = {
  light: [
    { t: 0.00, top: '#f3f8fd', bottom: '#fdf8f5', cloud: '#a9d6ea', sun: '#f2c46d' },
    { t: 0.45, top: '#fff5e8', bottom: '#fcead3', cloud: '#e9c49a', sun: '#f0a35e' },
    { t: 0.72, top: '#fbe8dc', bottom: '#f6d9cb', cloud: '#e6b3a3', sun: '#e8846c' },
    { t: 1.00, top: '#efe6f6', bottom: '#f7e3e3', cloud: '#c7b2e0', sun: '#d97b7b' },
  ],
  dark: [
    { t: 0.00, top: '#0e1020', bottom: '#181b33', cloud: '#5f73b8', sun: '#e6ebff' },
    { t: 0.45, top: '#10112a', bottom: '#1d1a38', cloud: '#7466b0', sun: '#e6ebff' },
    { t: 1.00, top: '#120f24', bottom: '#2a1b30', cloud: '#a07a9c', sun: '#ffe2c8' },
  ],
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`;
function skyAt(theme, f) {
  const st = SKY[theme];
  let i = 0;
  while (i < st.length - 2 && f > st[i + 1].t) i++;
  const a = st[i], b = st[i + 1];
  const t = smooth(clamp((f - a.t) / (b.t - a.t), 0, 1));
  return { top: mix(a.top, b.top, t), bottom: mix(a.bottom, b.bottom, t), cloud: mix(a.cloud, b.cloud, t), sun: mix(a.sun, b.sun, t) };
}

export default function FlightView({ theme, onToggleTheme, onSkip }) {
  const route = useMemo(buildRoute, []);
  const routeD = useMemo(() => curveThrough(route.map((r) => r.map)), [route]);

  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const travelRef = useRef(null);
  const planeRef = useRef(null);
  const trailRef = useRef(null);
  const labelsRef = useRef(null);
  const skyRef = useRef(null);
  const stageRef = useRef(null);
  const announceRef = useRef(null);
  const engine = useRef({});

  const initial = useMemo(() => fromHash(location.hash) || { page: 'hero', project: null }, []);
  const [target, setTarget] = useState(initial); // where we're going (drives the header)
  const [shown, setShown] = useState(initial);   // what the card shows
  const [phase, setPhase] = useState('arrived'); // 'arrived' | 'flying'
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const ddBtnRef = useRef(null);
  const [intro, setIntro] = useState(() => shouldIntro(initial));
  const stateRef = useRef({ target, shown, phase, intro });
  stateRef.current = { target, shown, phase, intro };
  const endIntro = useCallback(() => {
    try { sessionStorage.setItem('introSeen', '1'); } catch {}
    setIntro(false);
  }, []);
  const firstFocus = useRef(true);

  // ---------- The map engine: plane position along the route drives everything ----------
  useEffect(() => {
    const e = engine.current;
    const root = rootRef.current;
    const sampled = samplePath(pathRef.current, 2);
    e.total = sampled.total;
    let prev = 0;
    const keys = route.map((r) => ({ id: r.id, kind: r.kind, camera: r.camera, L: (prev = lengthNear(sampled, r.map, prev)) }));
    e.Lof = Object.fromEntries(keys.map((k) => [k.id, k.L]));
    const travelPts = sampled.pts.filter((_, i) => i % 2 === 0).map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
    const travelStep = sampled.step * 2;
    const reduced = prefersReduced();

    // landmarks sketch themselves in as the plane approaches
    const lmEls = {};
    svgRef.current.querySelectorAll('.lm').forEach((g) => {
      lmEls[g.dataset.lm] = { el: g, drawn: reduced ? 1 : 0 };
      g.querySelectorAll('path, rect, circle, ellipse, line').forEach((n) => n.setAttribute('pathLength', '1'));
      g.style.setProperty('--d', reduced ? 1 : 0);
    });
    const pinEls = {};
    labelsRef.current.querySelectorAll('[data-lm]').forEach((pn) => { pinEls[pn.dataset.lm] = pn; });
    const sunEl = skyRef.current?.querySelector('[data-sky="sun"]');
    const moonEl = skyRef.current?.querySelector('[data-sky="moon"]');
    const cloudEls = [...(skyRef.current?.querySelectorAll('[data-cloud]') || [])];
    const trailLines = Array.from(trailRef.current.children);
    const tL = e.Lof.transit, aboutL = e.Lof.about;

    function spanAt(L) {
      let i = 0;
      while (i < keys.length - 2 && L > keys[i + 1].L) i++;
      const a = keys[i], b = keys[i + 1];
      const t = smooth(clamp((L - a.L) / (b.L - a.L || 1), 0, 1));
      return Math.exp(lerp(Math.log(a.camera), Math.log(b.camera), t));
    }

    e.spanMul = 1; // the intro zooms in from far away by shrinking this to 1
    // Where the plane sits on screen depends on the page:
    //   Home: off to the side (or low on phones), large, next to the words
    //   Projects: in the middle of the map strip along the bottom
    //   every other page: the middle of the screen, under the page card
    e.anchorFor = (page) => {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (page === 'projects') return { x: vw / 2, y: vh - e.strip / 2, k: 1, z: 1 };
      if (page === 'hero') {
        const wide = vw >= 900 && vw / vh >= 1.1;
        if (wide) return { x: vw * 0.72, y: vh * 0.56, k: 1.75, z: 1 };
        // phones and tablets: in the space under the words
        const tb = document.querySelector('.page-card.card-hero')?.getBoundingClientRect().bottom;
        const y = tb ? clamp((tb + vh - 64) / 2, vh * 0.6, vh * 0.86) : vh * 0.77;
        return { x: vw * 0.5, y, k: vw < 600 ? (vh < 720 ? 1.05 : 1.3) : 1.7, z: vw < 600 ? 0.9 : 0.72 }; // zoom in a little more so the airport fills the space
      }
      return { x: vw / 2, y: vh / 2, k: 1, z: 1 };
    };
    const layout = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const tall = vh > vw * 1.15;
      e.strip = Math.round(vw < 700 ? clamp(vh * 0.16, 96, 150) : tall ? clamp(vh * 0.4, 160, 520) : clamp(vh * 0.22, 140, 220));
      root.style.setProperty('--strip', `${e.strip}px`);
      const a = e.anchorFor(e.page);
      e.tx = a.x; e.ty = a.y; e.pk = a.k; e.zm = a.z;
    };
    e.page = initial.page;
    layout();
    // glide the plane's screen position to where the next page wants it (runs alongside the flight)
    e.toAnchor = (page, dur) => {
      e.page = page;
      const a = e.anchorFor(page);
      e.anchorTween?.kill();
      if (reduced || !dur) { e.tx = a.x; e.ty = a.y; e.pk = a.k; e.zm = a.z; if (!e.tween) render(e.L, true); return; }
      e.anchorTween = gsap.to(e, { tx: a.x, ty: a.y, pk: a.k, zm: a.z, duration: dur, ease: 'sine.inOut', onUpdate: () => { if (!e.tween) render(e.L, true); } });
    };
    let bank = 1, lastAngle = null;
    // ov: a point off the route (used by straight "skip" flights): { x, y, span, angle, Lb }
    function render(L, force, ov) {
      const vw = window.innerWidth, vh = window.innerHeight;
      const span = ov ? ov.span : spanAt(L) * e.spanMul * e.zm;
      const p = ov || pointAt(sampled, L);
      const s = span / Math.min(vw, vh * 1.1); // map units per screen pixel
      const tx = e.tx, ty = e.ty, pk = e.pk;   // the plane's spot on screen (see anchorFor)
      const vx = p.x - tx * s, vy = p.y - ty * s;
      svgRef.current.setAttribute('viewBox', `${vx} ${vy} ${vw * s} ${vh * s}`);
      svgRef.current.style.setProperty('--far', clamp((span - 480) / 300, 0, 1).toFixed(3));
      svgRef.current.style.setProperty('--near', clamp((820 - span) / 300, 0, 1).toFixed(3));
      svgRef.current.style.setProperty('--s', s.toFixed(4));

      // dotted path draws itself up to the plane
      const Lt = ov ? ov.Lb : L;
      const ti = Math.min(travelPts.length - 1, Math.floor(Lt / travelStep));
      const tEnd = ov ? pointAt(sampled, Lt) : null;
      travelRef.current.setAttribute('d', `M${travelPts.slice(0, ti + 1).join('L')}${tEnd ? `L${tEnd.x.toFixed(1)} ${tEnd.y.toFixed(1)}` : ''}L${p.x.toFixed(1)} ${p.y.toFixed(1)}`);

      // Klang warms up; the plane settles over the last stretch
      root.style.setProperty('--warm', clamp((L - tL) / (aboutL - tL), 0, 1).toFixed(3));
      const land = 1 - 0.18 * smooth(clamp((L - (e.total - 70)) / 70, 0, 1));

      if (lastAngle !== null && !force) {
        let d = p.angle - lastAngle;
        if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
        bank = lerp(bank, clamp(1 - Math.abs(d) * 14, 0.72, 1), 0.25);
      } else bank = 1;
      lastAngle = p.angle;
      planeRef.current.style.transform =
        `translate(${tx}px, ${ty}px) rotate(${(p.angle * 180) / Math.PI}deg) scale(${(land * pk).toFixed(3)}, ${(bank * land * pk).toFixed(3)})`;

      // short fading trail
      let prevPt = { x: tx, y: ty };
      trailLines.forEach((ln, k) => {
        const back = (k + 1) * 7 * s + 16 * s;
        const q = ov ? { x: p.x - Math.cos(p.angle) * back, y: p.y - Math.sin(p.angle) * back } : pointAt(sampled, Math.max(0, L - back));
        const qx = (q.x - vx) / s, qy = (q.y - vy) / s;
        ln.setAttribute('x1', k === 0 ? (tx + qx) / 2 : prevPt.x); ln.setAttribute('y1', k === 0 ? (ty + qy) / 2 : prevPt.y);
        ln.setAttribute('x2', qx); ln.setAttribute('y2', qy);
        prevPt = { x: qx, y: qy };
      });

      // map labels follow the map
      for (const el of labelsRef.current.children) {
        const sx = (+el.dataset.x - vx) / s, sy = (+el.dataset.y - vy) / s;
        const show = span >= +(el.dataset.min || 0) && span <= +(el.dataset.max || 1e9) && sx > -80 && sx < vw + 80 && sy > -40 && sy < vh + 40;
        el.style.transform = `translate(${sx}px, ${sy}px)`;
        el.classList.toggle('hidden', !show);
      }

      // landmarks sketch in; pins remember visits
      for (const k of keys) {
        const lm = lmEls[k.id];
        if (lm) {
          const d = clamp((L - (k.L - 170)) / 140, 0, 1);
          if (d > lm.drawn) { lm.drawn = d; lm.el.style.setProperty('--d', d.toFixed(3)); }
        }
        if (pinEls[k.id]) {
          pinEls[k.id].classList.toggle('visited', L >= k.L - 4);
          pinEls[k.id].classList.toggle('current', Math.abs(L - k.L) < 6);
        }
      }

      // sky by time of day; clouds drift past at different depths
      const f = L / e.total;
      const sk = skyAt(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', f);
      root.style.setProperty('--sky-top', sk.top);
      root.style.setProperty('--sky-bottom', sk.bottom);
      root.style.setProperty('--cloud', sk.cloud);
      root.style.setProperty('--sun', sk.sun);
      if (sunEl) {
        sunEl.style.transform = `translate(${lerp(0.88, 0.76, f) * vw}px, ${(0.13 + 0.26 * f * f) * vh}px) rotate(${f * 90}deg)`;
        sunEl.style.opacity = (1 - 0.55 * smooth(clamp((f - 0.7) / 0.3, 0, 1))).toFixed(3);
      }
      if (moonEl) moonEl.style.transform = `translate(${0.84 * vw}px, ${(0.15 + 0.06 * f) * vh}px)`;
      cloudEls.forEach((el, i) => {
        const c = cloudSpecs[i];
        const span2 = vh + 260;
        const py = reduced ? 0 : L * c.depth * 1.6;
        const cy = ((((c.y * span2 - py) % span2) + span2) % span2) - 130;
        el.style.transform = `translate(${(c.x - 0.35) * 1.5 * vw}px, ${cy.toFixed(1)}px)`;
      });
      e.L = L;
      e.cur = { x: p.x, y: p.y, span, angle: p.angle };
    }

    // does a flight from a to b pass over a stop or project on the way? (the pull-back point doesn't count)
    const skipsStops = (a, b) => {
      const lo = Math.min(a, b) + 4, hi = Math.max(a, b) - 4;
      return keys.some((k) => k.kind !== 'transit' && k.L > lo && k.L < hi);
    };
    const shortest = (a) => Math.atan2(Math.sin(a), Math.cos(a));

    e.render = render;
    e.fly = (to, onDone) => {
      const interrupted = !!e.tween;
      e.tween?.kill(); e.tween = null;
      const from = e.L ?? 0;
      if (reduced || (Math.abs(to - from) < 1 && !e.offRoute)) { e.offRoute = false; render(to, true); onDone?.(); return; }

      // Next stop along the route: follow the dotted path
      if (!interrupted && !e.offRoute && !skipsStops(from, to)) {
        const dur = clamp(1.3 + (Math.abs(to - from) / e.total) * 2.4, 1.3, 2.4);
        const o = { L: from };
        e.tween = gsap.to(o, { L: to, duration: dur, ease: 'sine.inOut', onUpdate: () => render(o.L), onComplete: () => { e.tween = null; onDone?.(); } });
        return;
      }

      // Skipping ahead (or redirected mid-flight): one calm straight line to the end point.
      // Fixed 1.5 to 2.5 s; the zoom eases out and back in along one smooth curve, never jumps.
      const c0 = e.cur, p1 = pointAt(sampled, to), span1 = spanAt(to) * (e.anchorFor(e.page).z ?? 1);
      const dx = p1.x - c0.x, dy = p1.y - c0.y, dist = Math.hypot(dx, dy);
      const line = dist > 1 ? Math.atan2(dy, dx) : p1.angle;
      const dur = clamp(1.5 + dist / 900, 1.5, 2.5);
      const ls0 = Math.log(c0.span), ls1 = Math.log(span1);
      const lsm = Math.log(Math.max(c0.span, span1, dist * 1.15)); // pull back a little on long hops so the map never races
      const turnIn = shortest(line - c0.angle), turnOut = shortest(p1.angle - line);
      const L0 = from;
      e.offRoute = true;
      const o = { t: 0 };
      e.tween = gsap.to(o, {
        t: 1, duration: dur, ease: 'sine.inOut',
        onUpdate: () => {
          const t = o.t, u = 1 - t;
          const ls = u * u * ls0 + 2 * u * t * lsm + t * t * ls1; // smooth curve in zoom space
          const a = c0.angle + turnIn * smooth(clamp(t / 0.22, 0, 1)) + turnOut * smooth(clamp((t - 0.78) / 0.22, 0, 1));
          const L = lerp(L0, to, t);
          render(L, false, { x: c0.x + dx * t, y: c0.y + dy * t, span: Math.exp(ls), angle: a, Lb: Math.min(L0, to) });
        },
        onComplete: () => { e.tween = null; e.offRoute = false; render(to, true); onDone?.(); },
      });
    };

    // start where the URL says
    const start = initial.project ? lmById[projects.find((p) => p.id === initial.project).landmark].id : initial.page;
    render(e.Lof[start], true);
    history.replaceState(null, '', initial.page === 'hero' && !initial.project ? location.pathname : `#${toHash(initial)}`);

    const onResize = () => { layout(); if (!e.tween) render(e.L, true, e.offRoute ? e.cur : undefined); };
    window.addEventListener('resize', onResize);
    const themeWatch = new MutationObserver(() => render(e.L, true));
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.documentElement.classList.add('fx-lock');
    return () => {
      e.tween?.kill();
      window.removeEventListener('resize', onResize);
      themeWatch.disconnect();
      document.documentElement.classList.remove('fx-lock');
    };
  }, [route, initial]);

  // ---------- Navigation ----------
  const goTo = useCallback((next, { push = true } = {}) => {
    const { shown: cur, phase: ph } = stateRef.current;
    const e = engine.current;
    setMenuOpen(false); setDdOpen(false);
    if (sameStop(next, cur) && ph === 'arrived') {
      const h = document.getElementById(next.project ? `p-${next.project}` : `${next.page}-title`);
      h?.focus({ preventScroll: true });
      return;
    }
    const stopId = next.project ? projects.find((p) => p.id === next.project).landmark : next.page;
    setTarget(next);
    setPhase('flying');
    if (push) history.pushState(null, '', next.page === 'hero' && !next.project ? location.pathname : `#${toHash(next)}`);
    // let the page fade out for a moment, then fly (no wait if we're already in the air)
    const wait = prefersReduced() || ph === 'flying' ? 0 : 180;
    clearTimeout(e.wait);
    e.wait = setTimeout(() => {
      e.toAnchor(next.page, 1.6);
      e.fly(e.Lof[stopId], () => { setShown(next); setPhase('arrived'); });
    }, wait);
  }, []);

  // after arriving: focus the heading and announce it
  useEffect(() => {
    if (phase !== 'arrived') return;
    const sc = stageRef.current?.querySelector('.page-card') || stageRef.current;
    if (sc) sc.scrollTop = 0;
    if (shown.page === 'hero') engine.current.toAnchor?.('hero', 0.5); // settle under the words once they're on screen
    if (firstFocus.current) { firstFocus.current = false; return; }
    const p = shown.project && projects.find((x) => x.id === shown.project);
    requestAnimationFrame(() => {
      document.getElementById(p ? `p-${p.id}` : `${shown.page}-title`)?.focus({ preventScroll: true });
    });
    if (announceRef.current) announceRef.current.textContent = `Arrived: ${p ? p.name : byId[shown.page].label}`;
  }, [phase, shown]);

  // step forward / back
  const step = useCallback((dir) => {
    const { target: t } = stateRef.current;
    if (t.project) {
      const i = projects.findIndex((p) => p.id === t.project);
      if (dir > 0) return goTo(i < projects.length - 1 ? { page: 'projects', project: projects[i + 1].id } : { page: 'hackathons', project: null });
      return goTo({ page: 'projects', project: null });
    }
    const i = PAGES.indexOf(t.page);
    const j = clamp(i + dir, 0, PAGES.length - 1);
    if (j !== i) goTo({ page: PAGES[j], project: null });
  }, [goTo]);

  // ---------- Input: links, scroll, swipe, keys, back button ----------
  useEffect(() => {
    const canScroll = (el, dir) => el && (dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2);
    const scrollBox = (t) => t.closest?.('dialog') ? null : (t.closest?.('.page-card') || t.closest?.('.stage'));
    const dialogOpen = () => !!document.querySelector('dialog[open]');

    const onClick = (ev) => {
      const a = ev.target.closest?.('a[href^="#"]');
      if (!a || stateRef.current.intro) return;
      const t = fromHash(a.getAttribute('href'));
      if (!t) return;
      ev.preventDefault();
      goTo(t);
    };

    // one scroll gesture = one page
    let acc = 0, lastWheel = 0, used = false;
    const onWheel = (ev) => {
      if (dialogOpen()) return;
      const now = performance.now();
      if (now - lastWheel > 220) { acc = 0; used = false; } // a new gesture
      lastWheel = now;
      const dir = Math.sign(ev.deltaY);
      // while flying (or in the intro), scrolling is ignored, and that whole gesture is used up,
      // so a long or hard scroll never stacks a second flight on arrival
      if (stateRef.current.phase !== 'arrived' || stateRef.current.intro) { used = true; acc = 0; return; }
      if (!dir || used) return;
      if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; // sideways: the rail scrolls itself
      if (canScroll(scrollBox(ev.target), dir)) { acc = 0; return; }
      acc += ev.deltaY;
      if (Math.abs(acc) > 60) { used = true; acc = 0; step(dir); }
    };

    let tStart = null;
    const onTouchStart = (ev) => {
      const t = ev.touches[0];
      const card = scrollBox(ev.target);
      tStart = { x: t.clientX, y: t.clientY, card, top: card?.scrollTop ?? 0 };
    };
    const onTouchEnd = (ev) => {
      if (!tStart || dialogOpen()) return;
      const t = ev.changedTouches[0];
      const dy = tStart.y - t.clientY, dx = tStart.x - t.clientX;
      const scrolled = tStart.card && Math.abs((tStart.card.scrollTop ?? 0) - tStart.top) > 2;
      const dir = Math.sign(dy);
      if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.3 && !scrolled && !canScroll(tStart.card, dir) && stateRef.current.phase === 'arrived' && !stateRef.current.intro) step(dir);
      tStart = null;
    };

    const onKey = (ev) => {
      if (dialogOpen() || ev.altKey || ev.ctrlKey || ev.metaKey || stateRef.current.intro) return;
      const tag = ev.target.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tag) || ev.target.isContentEditable) return;
      const card = stageRef.current?.querySelector('.page-card') || stageRef.current;
      let dir = 0;
      if (['ArrowDown', 'PageDown'].includes(ev.key) || (ev.key === ' ' && !/BUTTON|A/.test(tag))) dir = 1;
      if (['ArrowUp', 'PageUp'].includes(ev.key)) dir = -1;
      if (ev.key === 'Home') { ev.preventDefault(); return goTo({ page: 'hero', project: null }); }
      if (ev.key === 'End') { ev.preventDefault(); return goTo({ page: 'contact', project: null }); }
      // left / right: browse the tickets on this page (or the next / previous project)
      if ((ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') && stateRef.current.phase === 'arrived') {
        const side = ev.key === 'ArrowRight' ? 1 : -1;
        const sp = stateRef.current.shown.project;
        if (sp) {
          const i = projects.findIndex((p) => p.id === sp) + side;
          if (i >= 0 && i < projects.length) { ev.preventDefault(); goTo({ page: 'projects', project: projects[i].id }); }
          return;
        }
        if (railBus.current) { ev.preventDefault(); railBus.current(side); }
        return;
      }
      if (!dir) return;
      if (stateRef.current.phase === 'arrived' && canScroll(card, dir)) return; // let the page scroll first
      ev.preventDefault();
      if (ev.repeat && stateRef.current.phase !== 'arrived') return; // a held key doesn't stack flights
      step(dir); // a key press mid-flight smoothly redirects the plane
    };

    const onPop = () => { const t = fromHash(location.hash) || { page: 'hero', project: null }; goTo(t, { push: false }); };

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
    };
  }, [goTo, step]);

  // browsing the project tickets: the plane follows to each landmark (the page stays open)
  const browseTo = useCallback((pid) => {
    const s = stateRef.current;
    if (s.phase !== 'arrived' || s.shown.page !== 'projects' || s.shown.project) return;
    const e = engine.current;
    e.fly(e.Lof[projects.find((p) => p.id === pid).landmark]);
  }, []);

  // ---------- What the page shows ----------
  const shownProject = shown.project && projects.find((p) => p.id === shown.project);
  const pageIndex = PAGES.indexOf(target.page);
  const nextOf = (() => {
    if (target.project) {
      const i = projects.findIndex((p) => p.id === target.project);
      return i < projects.length - 1 ? projects[i + 1].name : byId.hackathons.label;
    }
    return pageIndex < PAGES.length - 1 ? byId[PAGES[pageIndex + 1]].label : null;
  })();

  const mode = shown.page === 'projects' ? 'strip' : shown.page === 'hero' ? 'hero' : 'card';
  let content;
  if (shownProject) {
    const i = projects.indexOf(shownProject);
    const nxt = projects[i + 1], prv = projects[i - 1];
    content = (
      <ProjectDetail p={shownProject}
        onBack={() => goTo({ page: 'projects', project: null })}
        onPrev={prv ? () => goTo({ page: 'projects', project: prv.id }) : undefined}
        onNext={() => goTo(nxt ? { page: 'projects', project: nxt.id } : { page: 'hackathons', project: null })}
        nextLabel={nxt ? `Next: ${nxt.name}` : 'Next: Hackathons'} />
    );
  } else {
    const View = PAGE_VIEW[shown.page];
    content = <View global onActive={shown.page === 'projects' ? browseTo : undefined}
      hint={shown.page === 'hero' ? 'Scroll, swipe or press ↓ to fly.' : undefined} />;
  }

  return (
    <div className={`fx${intro ? ' is-intro' : ''}`} ref={rootRef} data-phase={phase} data-page={shown.page} data-mode={mode}>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); stageRef.current?.querySelector('h1, h2')?.focus(); }}>Skip to content</a>
      <div ref={announceRef} className="sr-only" aria-live="polite" />

      <Sky ref={skyRef} />

      <div className="map-layer" aria-hidden="true">
        <svg ref={svgRef} className="map line-art" viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice">
          <MapArt />
          <path d={routeD} className="route route-ghost" />
          <path ref={travelRef} className="route route-dots" />
          <path ref={pathRef} d={routeD} stroke="none" />
        </svg>
      </div>

      <svg className="plane-layer line-art" aria-hidden="true">
        <g ref={trailRef} className="trail">
          {Array.from({ length: 10 }, (_, k) => <line key={k} style={{ opacity: 0.55 * (1 - k / 10) }} />)}
        </g>
      </svg>
      <div className="plane" ref={planeRef} aria-hidden="true">
        <svg viewBox="-24 -24 48 48">
          <path d="M-17 0 C-17 -2.5 -14 -2.6 -12 -2.6 H13 C17 -2.6 20 -1 21 0 C20 1 17 2.6 13 2.6 H-12 C-14 2.6 -17 2.5 -17 0 Z" />
          <path d="M2 -2.4 L-6 -17 H-2 L10 -2.4 M2 2.4 L-6 17 H-2 L10 2.4" />
          <path d="M-12 -2.4 L-17 -8 H-14.5 L-8 -2.4 M-12 2.4 L-17 8 H-14.5 L-8 2.4" />
        </svg>
      </div>

      <div className="labels-layer" ref={labelsRef} aria-hidden="true">
        <span className="map-label area" data-x="660" data-y="268" data-min="520">Subang Airport</span>
        <span className="map-label area" data-x="575" data-y="455" data-min="700">Sunway City</span>
        <span className="map-label area" data-x="300" data-y="1205">Klang</span>
        {landmarks.map((l) => (
          <span key={l.id} data-lm={l.id} className="map-label pin" data-x={l.map.x} data-y={l.map.y + 24} data-max="760">{l.label}</span>
        ))}
      </div>

      {intro && (
        <Suspense fallback={<div className="intro" />}>
          <Intro engine={engine} heroSpan={byId.hero.camera} onDone={endIntro} />
        </Suspense>
      )}

      {/* Home: a calm zone behind the words. Other pages: blur over the map. Projects: the strip edge. */}
      <div className="hero-clear" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
      <div className="strip-edge" aria-hidden="true" />

      <header className="fx-header">
        <nav className="fx-nav" aria-label="Pages">
          <a href="#hero" className="fl-logo" aria-label={`${person.name}, home`}><PlaneIcon width={20} height={20} /> <span className="logo-text">{person.shortName}</span></a>
          <ul className={`fx-links ${menuOpen ? 'open' : ''}`} id="fx-menu">
            {stops.map((s) => (
              <li key={s.id} className={s.id === 'projects' ? `has-dd ${ddOpen ? 'dd-open' : ''}` : undefined}
                {...(s.id === 'projects' ? {
                  onMouseEnter: () => setDdOpen(true),
                  onMouseLeave: () => setDdOpen(false),
                  onKeyDown: (ev) => { if (ev.key === 'Escape') { setDdOpen(false); ddBtnRef.current?.focus(); } },
                } : {})}>
                <a href={`#${s.id}`} aria-current={target.page === s.id ? 'page' : undefined} className={target.page === s.id ? 'active' : ''}>
                  {s.label}
                </a>
                {s.id === 'projects' && (
                  <>
                    <button ref={ddBtnRef} className="dd-toggle" aria-expanded={ddOpen} aria-controls="projects-dd" onClick={() => setDdOpen((o) => !o)}>
                      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
                      <span className="sr-only">Show each project</span>
                    </button>
                    <ul className="dd" id="projects-dd">
                      {projects.map((p) => (
                        <li key={p.id}>
                          <a href={`#project-${p.id}`}>
                            <span className="dd-code" aria-hidden="true">{lmById[p.landmark]?.code}</span>
                            <span className="dd-text"><b>{p.name}</b><small>{p.short}</small></span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
            <li className="menu-only">
              <button className="pill ghost sm" onClick={onToggleTheme}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            </li>
          </ul>
          <div className="fl-actions">
            <a className="icon-btn" href={resume.file} download={resume.downloadName} aria-label="Download resume (PDF)" title="Download resume">
              <Download width={18} height={18} />
            </a>
            <button className="icon-btn desk-only" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
            </button>
            <button className="pill ghost mode-btn" onClick={onSkip} title="Switch to the plain, fast version">
              <span className="long">Skip the flight</span><span className="short">Skip</span>
            </button>
            <a className="pill solid" href="#contact">Hire me</a>
            <button className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="fx-menu" onClick={() => setMenuOpen((o) => !o)}>
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span><span className="sr-only">Menu</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="stage" id="main" ref={stageRef}>
        {mode === 'strip'
          ? <div className={`stage-in stage-${shown.page}`} key={toHash(shown)}>{content}</div>
          : <div className={`page-card card-${shown.page}`} key={toHash(shown)}>{content}</div>}
      </main>

      {/* where am I: dots on the side, next/back at the bottom */}
      <nav className="dots" aria-label="Page dots">
        {stops.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={target.page === s.id ? 'on' : ''} aria-label={`${i + 1}. ${s.label}`} aria-current={target.page === s.id ? 'page' : undefined}>
            <span className="dot-tip" aria-hidden="true">{s.label}</span>
          </a>
        ))}
      </nav>
      <div className="stepper">
        <button className="icon-btn" onClick={() => step(-1)} disabled={pageIndex === 0 && !target.project} aria-label="Previous page"><ArrowUp width={18} height={18} /></button>
        <span className="step-count" aria-hidden="true">{pageIndex + 1} / {PAGES.length}</span>
        {nextOf && (
          <button className="pill ghost sm next-btn" onClick={() => step(1)}>
            Next: {nextOf} <ArrowDown width={16} height={16} />
          </button>
        )}
      </div>
    </div>
  );
}
