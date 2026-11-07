// Small geometry helpers for the flight path.

// Smooth curve through points (Catmull-Rom converted to cubic Bezier).
export function curveThrough(points, tension = 1) {
  if (points.length < 2) return '';
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x} ${p2.y}`;
  }
  return d;
}

// Sample an SVG path at even length steps for fast lookups.
export function samplePath(pathEl, step = 2) {
  const total = pathEl.getTotalLength();
  const pts = [];
  for (let l = 0; l <= total; l += step) {
    const p = pathEl.getPointAtLength(l);
    pts.push({ x: p.x, y: p.y, l });
  }
  return { total, pts, step };
}

// Point and heading (radians) at a given length.
export function pointAt(sampled, l) {
  const { pts, step } = sampled;
  const i = Math.max(0, Math.min(pts.length - 2, Math.floor(l / step)));
  const a = pts[i], b = pts[i + 1];
  const t = Math.max(0, Math.min(1, (l - a.l) / step));
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  // heading from a slightly wider window, so the plane turns smoothly
  const j0 = Math.max(0, i - 3), j1 = Math.min(pts.length - 1, i + 4);
  const angle = Math.atan2(pts[j1].y - pts[j0].y, pts[j1].x - pts[j0].x);
  return { x, y, angle };
}

// Path length closest to a point, searching forward from `fromL`.
export function lengthNear(sampled, target, fromL = 0) {
  let best = fromL, bestD = Infinity;
  for (const p of sampled.pts) {
    if (p.l < fromL) continue;
    const d = (p.x - target.x) ** 2 + (p.y - target.y) ** 2;
    if (d < bestD) { bestD = d; best = p.l; }
  }
  return best;
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const smooth = (t) => t * t * (3 - 2 * t);
