import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

// ---------------------------------------------------------------
// Opening: the whole world, one orbit, find Malaysia, then one
// smooth zoom down to Subang Airport. The zoom runs at an even pace
// in log scale, and the last part hands over to the hand-drawn map,
// which keeps zooming at the same rate, so there is no jump.
// ---------------------------------------------------------------

const SUBANG = [101.55, 3.13];
const KM_PER_UNIT = 0.025; // the hand-drawn map: about 25 km from Subang to Klang over ~1000 units
const HANDOFF = Math.log(12); // the last x12 of the zoom: globe fades into the map

const land = feature(world, world.objects.land);
const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
const malaysia = feature(world, world.objects.countries).features.find((f) => f.id === '458');
const graticule = geoGraticule10();
const sphere = { type: 'Sphere' };

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);
const turn = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export default function Intro({ engine, heroSpan, onDone }) {
  const rootRef = useRef(null);
  const r = { sphere: useRef(null), grat: useRef(null), land: useRef(null), borders: useRef(null), my: useRef(null), orbit: useRef(null), pin: useRef(null), label: useRef(null), plane: useRef(null) };
  const doneRef = useRef(null);

  useEffect(() => {
    let tl, raf, ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      tl?.kill();
      const e = engine.current;
      if (e.render) { e.spanMul = 1; e.render(e.L ?? 0, true); }
      onDone();
    };
    doneRef.current = finish;

    const start = () => {
      const e = engine.current;
      if (!e.render || !e.cur) { raf = requestAnimationFrame(start); return; }
      const vw = window.innerWidth, vh = window.innerHeight, cx = vw / 2, cy = vh / 2;
      const R0 = Math.min(vw, vh) * 0.27;
      const Rend = (6371 * (Math.min(vw, vh * 1.1) / (heroSpan * (e.zm ?? 1)))) / KM_PER_UNIT; // globe radius that matches the map's scale
      const lnK = Math.log(Rend / R0);
      const heroAngle = e.cur.angle;
      const sx = e.tx ?? cx, sy = e.ty ?? cy, pk = e.pk ?? 1; // where (and how big) the plane lands
      const proj = geoOrthographic().translate([cx, cy]).clipAngle(90).precision(0.4);
      const path = geoPath(proj);
      const myLen = () => r.my.current.getTotalLength?.() || 1;

      // orbit: a tilted ellipse around the globe
      const rx = R0 * 1.42, ry = R0 * 0.36, tilt = -0.32;
      r.orbit.current.setAttribute('cx', cx); r.orbit.current.setAttribute('cy', cy);
      r.orbit.current.setAttribute('rx', rx); r.orbit.current.setAttribute('ry', ry);
      r.orbit.current.setAttribute('transform', `rotate(${(tilt * 180) / Math.PI} ${cx} ${cy})`);
      const th0 = Math.PI * 0.62; // starts low at the front, ends there after one lap

      const st = { lon: SUBANG[0] - 210, lat: -16, orbit: 0, find: 0, home: 0, k: 0 };
      const ct = Math.cos(tilt), stl = Math.sin(tilt);

      const draw = () => {
        const R = R0 * Math.exp(st.k * lnK);
        const hh = ease(st.home);
        proj.scale(R).rotate([-st.lon, -st.lat]).translate([cx + (sx - cx) * hh, cy + (sy - cy) * hh]);
        r.sphere.current.setAttribute('d', path(sphere));
        r.grat.current.setAttribute('d', path(graticule));
        r.land.current.setAttribute('d', path(land));
        r.borders.current.setAttribute('d', path(borders));
        r.my.current.setAttribute('d', path(malaysia) || '');
        const root = rootRef.current;
        root.style.setProperty('--find', st.find.toFixed(3));
        root.style.setProperty('--zoom', st.k.toFixed(3));
        r.my.current.style.strokeDashoffset = ((1 - st.find) * myLen()).toFixed(1);
        r.my.current.style.strokeDasharray = myLen().toFixed(1);

        // Subang pin
        const vis = geoDistance(SUBANG, [st.lon, st.lat]) < Math.PI / 2 - 0.05;
        const pp = proj(SUBANG);
        r.pin.current.setAttribute('transform', `translate(${pp[0]} ${pp[1]})`);
        r.pin.current.style.opacity = vis ? (st.find * (1 - clamp(st.k * 4, 0, 1))).toFixed(3) : 0;
        r.label.current.style.transform = `translate(${pp[0]}px, ${pp[1]}px)`;
        r.label.current.style.opacity = vis ? (st.find * (1 - clamp(st.k * 3, 0, 1))).toFixed(3) : 0;

        // plane: around the orbit, then in to the centre (Subang), turning to face down the route
        const th = th0 + st.orbit * Math.PI * 2;
        const ex = Math.cos(th) * rx, ey = Math.sin(th) * ry;
        const ox = cx + ex * ct - ey * stl, oy = cy + ex * stl + ey * ct;
        const dx = -Math.sin(th) * rx, dy = Math.cos(th) * ry;
        const oa = Math.atan2(dx * stl + dy * ct, dx * ct - dy * stl);
        const h = ease(st.home);
        const x = ox + (sx - ox) * h, y = oy + (sy - oy) * h;
        const a = oa + turn(heroAngle - oa) * h;
        const behind = Math.sin(th) < 0 && st.home === 0;
        const sc = (0.8 + (pk - 0.8) * h) * (behind ? 0.82 : 1);
        r.plane.current.style.transform = `translate(${x}px, ${y}px) rotate(${(a * 180) / Math.PI}deg) scale(${sc.toFixed(3)})`;
        r.plane.current.style.zIndex = behind ? 1 : 4;
        r.plane.current.style.opacity = behind ? 0.45 : 1;

        // hand over to the map for the last stretch: the map zooms in at the same rate
        const rem = (1 - st.k) * lnK;
        const hand = clamp(1 - rem / HANDOFF, 0, 1);
        root.style.setProperty('--hand', hand.toFixed(3));
        if (hand > 0) { e.spanMul = Math.exp(rem); e.render(e.L ?? 0, true); }
      };

      tl = gsap.timeline({ onUpdate: draw, onComplete: finish });
      tl.to(st, { orbit: 1, duration: 3.6, ease: 'none' }, 0)                    // one full lap at an even speed
        .to(st, { lon: SUBANG[0], lat: SUBANG[1], duration: 3.6, ease: 'sine.inOut' }, 0) // the globe turns Malaysia to the front
        .to(st, { find: 1, duration: 0.9, ease: 'sine.out' }, 3.1)              // Malaysia outlines itself
        .to(st, { home: 1, duration: 1.5, ease: 'none' }, 3.9)                  // plane heads in to Subang
        .to(st, { k: 1, duration: 3.4, ease: 'sine.inOut' }, 4.0);              // one smooth zoom
      draw();
    };
    raf = requestAnimationFrame(start);

    const onKey = (ev) => { if (ev.key === 'Escape') finish(); };
    window.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(raf); tl?.kill(); window.removeEventListener('keydown', onKey); };
  }, [engine, heroSpan, onDone]);

  return (
    <div className="intro" ref={rootRef}>
      <div className="intro-world" aria-hidden="true">
        <svg className="globe">
          <path ref={r.sphere} className="g-sphere" />
          <path ref={r.grat} className="g-grat" />
          <path ref={r.land} className="g-land" />
          <path ref={r.borders} className="g-borders" />
          <path ref={r.my} className="g-my" />
          <ellipse ref={r.orbit} className="g-orbit" />
          <g ref={r.pin} className="g-pin"><circle r="5" /><circle r="13" className="g-ring" /></g>
        </svg>
        <span ref={r.label} className="intro-label">Malaysia · Subang</span>
      </div>
      <div className="plane intro-plane" ref={r.plane} aria-hidden="true">
        <svg viewBox="-24 -24 48 48">
          <path d="M-17 0 C-17 -2.5 -14 -2.6 -12 -2.6 H13 C17 -2.6 20 -1 21 0 C20 1 17 2.6 13 2.6 H-12 C-14 2.6 -17 2.5 -17 0 Z" />
          <path d="M2 -2.4 L-6 -17 H-2 L10 -2.4 M2 2.4 L-6 17 H-2 L10 2.4" />
          <path d="M-12 -2.4 L-17 -8 H-14.5 L-8 -2.4 M-12 2.4 L-17 8 H-14.5 L-8 2.4" />
        </svg>
      </div>
      <button className="pill ghost intro-skip" onClick={() => doneRef.current?.()}>Skip intro</button>
    </div>
  );
}
