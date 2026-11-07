import { forwardRef } from 'react';

// Screen-space sky: sun (day), moon + stars (night) and drifting outline clouds.
// Everything is outline only. Positions are driven by the flight engine.

// cloud outlines (width ~120, height ~44)
const CLOUDS = [
  'M10 40 H110 C122 40 122 22 108 20 C108 8 92 2 82 10 C76 0 56 0 50 12 C38 6 24 14 28 24 C14 22 2 36 10 40 Z',
  'M8 38 H96 C108 38 108 22 96 22 C94 10 78 8 70 16 C62 6 44 8 42 20 C30 18 20 26 24 32 C14 30 4 34 8 38 Z',
  'M14 36 H118 C128 36 126 24 116 24 C116 14 104 10 96 16 C90 6 74 6 70 16 C60 10 48 16 50 26 C36 22 6 30 14 36 Z',
];

// depth: 0 = far (small, faint, slow), 1 = near (big, stronger, fast)
export const cloudSpecs = [
  { x: 0.62, y: 0.16, depth: 0.25, shape: 0, drift: 70 },
  { x: 0.88, y: 0.34, depth: 0.55, shape: 1, drift: 52 },
  { x: 0.70, y: 0.62, depth: 0.9, shape: 2, drift: 38 },
  { x: 0.95, y: 0.82, depth: 0.35, shape: 1, drift: 64 },
  { x: 0.55, y: 0.92, depth: 0.7, shape: 0, drift: 46, desk: true },
  { x: 0.80, y: 0.05, depth: 0.5, shape: 2, drift: 58, desk: true },
];

// deterministic "random" star field
const STARS = Array.from({ length: 34 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return { x: 380 + r(1) * 620, y: r(2) * 460, s: 2 + r(3) * 3.5, d: r(4) * 4 };
});

const Sky = forwardRef(function Sky(_, ref) {
  return (
    <>
    <div className="sky-bg" aria-hidden="true" />
    <div className="sky-layer" ref={ref} aria-hidden="true">

      {/* stars (night) */}
      <svg className="stars" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s, i) => (
          <path key={i} className="star" style={{ animationDelay: `${s.d}s` }}
            d={`M${s.x} ${s.y - s.s} V${s.y + s.s} M${s.x - s.s} ${s.y} H${s.x + s.s}`} />
        ))}
      </svg>

      {/* sun (day) / moon (night) */}
      <div className="sun" data-sky="sun">
        <svg viewBox="-40 -40 80 80">
          <circle r="14" />
          <g className="rays">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 27} y2={Math.sin(a) * 27} />;
            })}
          </g>
        </svg>
      </div>
      <div className="moon" data-sky="moon">
        <svg viewBox="-30 -30 60 60">
          <path d="M8 -18 A20 20 0 1 0 18 10 A15 15 0 1 1 8 -18 Z" />
          <circle cx="-6" cy="4" r="2.2" className="crater" /><circle cx="-1" cy="12" r="1.4" className="crater" />
        </svg>
      </div>

      {/* clouds */}
      {cloudSpecs.map((c, i) => (
        <div key={i} className={`cloud ${c.desk ? 'desk-only' : ''}`} data-cloud={i}
          style={{ '--drift': `${c.drift}s`, '--depth': c.depth }}>
          <svg viewBox="0 0 130 46" style={{ width: `${70 + c.depth * 110}px` }}>
            <path d={CLOUDS[c.shape]} />
            <path d="M30 32 H70" className="cloud-line" />
          </svg>
        </div>
      ))}
    </div>
    </>
  );
});

export default Sky;
