import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  person, socials, resume, projects, moreProjects, achievements, skills, skillsAlso,
  about, contact, landmarks, flight, hackathons, hackathonsMore, certificatesPdf,
} from '../content.js';
import {
  Download, Doc, Mail, Github, Linkedin, External, StampIcon, Avatar, Plane as PlaneIcon,
  Passport as PassportIcon, Folder, Code, Wrench, Flag, ArrowLeft, ArrowRight, Copy, iconByName,
} from './Icons.jsx';

// One component per page. Both the flight (one page at a time) and the
// fast lane (all pages stacked) use these, so content is never duplicated.
// Copy is short on purpose: a title, one line, then icons or tags.

function Head({ id, eyebrow, title, lead, as: H = 'h2' }) {
  return (
    <header className="pg-head">
      <p className="eyebrow">{eyebrow}</p>
      <H id={`${id}-title`} tabIndex={-1}>{title}</H>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

const lmOf = (p) => landmarks.find((l) => l.id === p.landmark);

// ---------- Home ----------
export function HomePage({ hint }) {
  return (
    <div className="pg pg-hero">
      <p className="eyebrow"><PlaneIcon width={16} height={16} /> Gate 1 · Subang</p>
      <h1 id="hero-title" tabIndex={-1}>{person.headline}</h1>
      <ul className="role-chips" aria-label="Roles I'm applying for">
        {person.roles.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p className="lead">{person.tagline}</p>
      <div className="row">
        <a className="pill solid lg" href="#projects"><PlaneIcon width={18} height={18} /> Take off</a>
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

// ---------- Projects: Layout C (gate screen with a sideways row of tickets) ----------
// The rail on screen in the flight registers here, so the left / right keys can browse it.
export const railBus = { current: null };

function GateHead({ id, titleId, eyebrow, title, lead, side }) {
  return (
    <header className="gate-head">
      <div className="gate-titles">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId || `${id}-title`} tabIndex={-1}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {side && <div className="gate-side">{side}</div>}
    </header>
  );
}

// A row of tickets you browse sideways. `active` is the current ticket
// (on the Projects page the plane follows it to that project's landmark).
export function Rail({ label, items, render, onActive, global }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const programmatic = useRef(0);
  const n = items.length;

  const show = useCallback((i) => {
    const el = ref.current;
    const item = el?.children[i];
    if (!item) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const left = item.offsetLeft - el.offsetLeft - pad;
    const right = left + item.offsetWidth + pad * 2;
    let to = null;
    if (left < el.scrollLeft) to = left;
    else if (right > el.scrollLeft + el.clientWidth) to = right - el.clientWidth;
    if (to !== null) {
      programmatic.current = performance.now();
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({ left: to, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, []);

  const pick = useCallback((j) => {
    if (j === activeRef.current) return;
    activeRef.current = j; setActive(j); onActive?.(j);
  }, [onActive]);

  const go = useCallback((i) => {
    const j = Math.max(0, Math.min(n - 1, i));
    show(j); pick(j);
  }, [n, pick, show]);

  // a manual swipe or trackpad scroll: the first fully visible ticket becomes current
  useEffect(() => {
    const el = ref.current;
    let t;
    const settle = () => {
      if (performance.now() - programmatic.current < 700) return;
      const vis = [...el.children].map((k, i) => ({ i, l: k.offsetLeft - el.offsetLeft - el.scrollLeft, w: k.offsetWidth }))
        .filter((k) => k.l > -k.w * 0.4 && k.l + k.w * 0.6 < el.clientWidth);
      if (!vis.length || vis.some((v) => v.i === activeRef.current)) return;
      pick(vis[0].i);
    };
    const onScroll = () => { clearTimeout(t); t = setTimeout(settle, 140); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [pick]);

  useEffect(() => {
    if (!global) return;
    const api = (dir) => go(activeRef.current + dir);
    railBus.current = api;
    return () => { if (railBus.current === api) railBus.current = null; };
  }, [global, go]);

  const onKeyDown = (e) => {
    if (global) return; // the flight handles left / right for the whole page
    if (e.key === 'ArrowRight') { e.preventDefault(); go(activeRef.current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(activeRef.current - 1); }
  };

  return (
    <div className="rail-wrap" onKeyDown={onKeyDown}>
      <div className="rail-ctrl">
        <span className="rail-count">{active + 1} / {n}</span>
        <button className="icon-btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label={`Previous ${label}`}><ArrowLeft width={18} height={18} /></button>
        <button className="icon-btn" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label={`Next ${label}`}><ArrowRight width={18} height={18} /></button>
      </div>
      <ul className="rail" ref={ref} aria-label={`${label}s`} tabIndex={0}>
        {items.map((it, i) => (
          <li key={it.key ?? i} className={`rail-item ${i === active ? 'on' : ''}`} style={{ '--k': i }}
            onFocusCapture={() => pick(i)}>
            {render(it, i)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectsPage({ onActive, onOpen, global }) {
  const items = [...projects.map((p) => ({ key: p.id, p })), ...(moreProjects.length ? [{ key: 'more', more: true }] : [])];
  return (
    <div className="gate gate-projects">
      <GateHead id="projects" eyebrow="Gate 2 · Sunway City" title="Projects" lead="Browse, then open one to fly there." />
      <Rail label="project" items={items} global={global}
        onActive={onActive ? (i) => items[i].p && onActive(items[i].p.id) : undefined}
        render={({ p, more }) => more ? (
          <div className="tk tk-more">
            <span className="tk-band"><span>Also built</span></span>
            <span className="tk-body">
              {moreProjects.map((m) => (
                <span key={m.name} className="tk-more-item"><b className="tk-title">{m.name}</b><span className="tk-line">{m.tech}</span><span className="tk-line muted">{m.date}</span></span>
              ))}
            </span>
          </div>
        ) : (
          <a className="tk tk-project" href={`#project-${p.id}`}
            onClick={onOpen ? (e) => { e.preventDefault(); onOpen(p.id); } : undefined}>
            <span className="tk-band">
              <span><PlaneIcon width={14} height={14} /> {lmOf(p)?.code}</span>
              <span className="tk-date">{p.date}</span>
            </span>
            <span className="tk-body">
              <b className="tk-title">{p.name}</b>
              <span className="tk-line">{p.short}</span>
              <span className="tk-tags">{p.tags.map((t) => <i key={t}>{t}</i>)}</span>
              <span className="tk-go">Open <ArrowRight width={16} height={16} /></span>
            </span>
          </a>
        )} />
    </div>
  );
}

// ---------- One project: the boarding pass ----------
// The pass holds four short parts: Overview, Features, How I built it, Tech & links.
// Everything shows at once when it fits. If it doesn't, it splits into 2, 3 or 4
// steps with Back / Next (and on small screens the picture steps aside).
// Nothing ever scrolls inside the pass.
// Layouts, tried in order until nothing overflows:
//   0: picture + all four parts in two columns
//   1: picture + as many steps as needed (filled block by block, up to 5)
//   2: no picture + as many steps as needed
//   3: the same, with the overview split into sentences (very small screens)
const PASS_PLANS = [
  { img: true, cols: true },
  { img: true, auto: true, maxPages: 5 },
  { img: false, auto: true },
  { img: false, auto: true, split: true },
];
const PART_NAME = { ov: 'Overview', feat: 'Features', how: 'How I built it', tech: 'Tech & links' };

// The pass content as small blocks. A step never splits a block, and a heading
// always stays with the block after it.
function passBlocks(p, split) {
  const B = [];
  const add = (part, key, node, head) => B.push({ part, key, node, head });
  add('ov', 'ov-h', <h3 className="pw-label">What it is</h3>, true);
  if (split) (p.about.match(/[^.!?]+[.!?]+["”]?\s*/g) || [p.about]).forEach((t, j) => add('ov', `ov-p${j}`, <p className="pw-text">{t.trim()}</p>));
  else add('ov', 'ov-p', <p className="pw-text">{p.about}</p>);
  if (p.features?.length) {
    add('feat', 'feat-h', <h3 className="pw-label">What it does</h3>, true);
    p.features.forEach((f, j) => add('feat', `feat-${j}`, <ul className="pw-list"><li>{f}</li></ul>));
  }
  add('how', 'how-h', <h3 className="pw-label">How I built it</h3>, true);
  (p.built || []).forEach((f, j) => add('how', `how-${j}`, <ul className="pw-list"><li>{f}</li></ul>));
  if (p.ai) add('how', 'how-ai', <dl className="pass-lines"><div><dt><Code width={20} height={20} /> AI</dt><dd>{p.ai}</dd></div></dl>);
  if (p.fixed) add('how', 'how-fix', <dl className="pass-lines"><div><dt><Wrench width={20} height={20} /> Fixed</dt><dd>{p.fixed}</dd></div></dl>);
  add('tech', 'tech-h', <h3 className="pw-label">Tech</h3>, true);
  const tagRows = split ? Array.from({ length: Math.ceil(p.tech.length / 4) }, (_, j) => p.tech.slice(j * 4, j * 4 + 4)) : [p.tech];
  tagRows.forEach((row, j) => add('tech', `tech-t${j}`, <ul className="tags" aria-label={j ? 'Tech, continued' : 'Tech'}>{row.map((t) => <li key={t}>{t}</li>)}</ul>));
  add('tech', 'tech-m', <p className="pw-meta">{p.role} · {p.date}</p>);
  if (p.live || p.video || p.code) add('tech', 'tech-l', (
    <div className="pw-links">
      <div className="row">
        {p.live && <a className="pill solid" href={p.live} target="_blank" rel="noopener">Live demo <External width={15} height={15} /><span className="sr-only"> of {p.name} (opens in a new tab)</span></a>}
        {p.video && <a className="pill ghost" href={p.video} target="_blank" rel="noopener">Watch demo <External width={15} height={15} /><span className="sr-only"> video of {p.name} (opens in a new tab)</span></a>}
        {p.code && <a className="pill ghost" href={p.code} target="_blank" rel="noopener">Code<span className="sr-only"> for {p.name}</span></a>}
      </div>
      {p.live && p.liveNote && <p className="pw-note">{p.liveNote}</p>}
    </div>
  ));
  return B;
}

export function ProjectDetail({ p, onBack, onPrev, onNext, nextLabel }) {
  const i = projects.indexOf(p);
  const lm = lmOf(p);
  const mainRef = useRef(null);
  const pageRef = useRef(null);
  const measureRef = useRef(null);
  const [fit, setFit] = useState(0);
  const [step, setStep] = useState(0);
  const [shot, setShot] = useState(0);
  const [auto, setAuto] = useState(null); // pages of block indexes, once measured
  const plan = PASS_PLANS[fit];
  const blocks = passBlocks(p, plan.split);

  // fixed layouts: if it overflows, try the next layout
  useLayoutEffect(() => {
    if (plan.auto) return;
    const over = (el) => el && el.scrollHeight > el.clientHeight + 1;
    if (over(mainRef.current) || over(pageRef.current)) { setFit(fit + 1); setAuto(null); }
  });

  // auto layout: measure each block and fill steps one by one
  useLayoutEffect(() => {
    if (!plan.auto || auto) return;
    const box = pageRef.current, m = measureRef.current;
    if (!box || !m) return;
    const avail = box.clientHeight;
    const gap = parseFloat(getComputedStyle(m).rowGap) || 0;
    const hs = [...m.children].map((c) => c.offsetHeight);
    const pages = [];
    let cur = [], used = 0, tooBig = false;
    const push = () => { if (cur.length) pages.push(cur); cur = []; used = 0; };
    for (let j = 0; j < blocks.length; j++) {
      // a heading moves with the block after it, and has a little extra space above it
      const pair = blocks[j].head && j + 1 < blocks.length;
      const h = pair ? hs[j] + gap + hs[j + 1] : hs[j];
      let extra = cur.length ? gap + (blocks[j].head ? 12 : 0) : 0;
      if (used + extra + h > avail && cur.length) { push(); extra = 0; }
      if (h > avail) tooBig = true;
      cur.push(j); if (pair) cur.push(++j);
      used += extra + h;
    }
    push();
    if ((tooBig || (plan.maxPages && pages.length > plan.maxPages)) && fit < PASS_PLANS.length - 1) { setFit(fit + 1); return; }
    setAuto(pages);
    setStep((s) => Math.min(s, pages.length - 1));
  });

  useEffect(() => {
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => { setFit(0); setStep(0); setAuto(null); }, 150); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);

  const images = p.images || [];
  const partNodes = (part) => blocks.filter((b) => b.part === part);
  const renderPart = (part) => {
    const bs = partNodes(part);
    if (!bs.length) return null;
    return <section key={part} className="pw-part">{bs.map((b) => <div key={b.key} className="pw-block">{b.node}</div>)}</section>;
  };

  let body;
  if (plan.cols) {
    body = (
      <div className="pw-cols">
        <div className="pw-col1">{renderPart('ov')}{renderPart('feat')}</div>
        <div className="pw-col2">{renderPart('how')}{renderPart('tech')}</div>
      </div>
    );
  } else {
    const pages = plan.auto
      ? (auto || [[]]).map((idx) => idx.map((j) => blocks[j]))
      : plan.pages.map((pg) => blocks.filter((b) => pg.includes(b.part)));
    const k = Math.min(step, pages.length - 1);
    const label = (pg) => {
      const names = [...new Set(pg.map((b) => b.part))].map((x) => PART_NAME[x]);
      if (pg[0] && !pg[0].head && names.length) names[0] += ' (cont.)';
      return names.join(', ');
    };
    body = (
      <>
        <div className={`pw-page ${plan.auto ? 'flat' : ''}`} ref={pageRef} key={`${fit}-${k}-${auto ? 1 : 0}`}>
          {plan.auto
            ? (auto ? pages[k].map((b) => <div key={b.key} className={`pw-block ${b.head ? 'is-head' : ''}`}>{b.node}</div>)
              : <div className="pw-measure" ref={measureRef} aria-hidden="true">{blocks.map((b) => <div key={b.key} className={`pw-block ${b.head ? 'is-head' : ''}`}>{b.node}</div>)}</div>)
            : [...new Set(pages[k].map((b) => b.part))].map(renderPart)}
        </div>
        <div className="pw-steps">
          <span className="muted">{k + 1} / {pages.length}<span className="step-name"> · {label(pages[k])}</span></span>
          <div className="row">
            <button className="pill ghost" onClick={() => setStep(k - 1)} disabled={k === 0}><ArrowLeft width={16} height={16} /> Back</button>
            <button className="pill ghost" onClick={() => setStep(k + 1)} disabled={k === pages.length - 1}>Next <ArrowRight width={16} height={16} /></button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="gate gate-project">
      <GateHead id={p.id} titleId={`p-${p.id}`}
        eyebrow={<>Flight {flight.flightPrefix}{String(i + 1).padStart(2, '0')} · {lm?.code} {lm?.label}</>}
        title={p.name} lead={p.short}
        side={onBack && (
          <div className="row">
            <button className="pill ghost" onClick={onBack}><ArrowLeft width={16} height={16} /> All projects</button>
            {onPrev && <button className="icon-btn" onClick={onPrev} aria-label="Previous project"><ArrowLeft width={18} height={18} /></button>}
            {onNext && <button className="pill ghost" onClick={onNext}>{nextLabel} <ArrowRight width={16} height={16} /></button>}
          </div>
        )} />
      <article className={`pass-wide ${plan.img ? '' : 'no-img'}`} aria-label={`${p.name} boarding pass`}>
        {plan.img && (
          <div className="pw-media">
            {images.length
              ? <img className="pw-shot" src={images[shot % images.length].src} alt={images[shot % images.length].alt || ''} decoding="async" />
              : <div className="pw-shot pw-blank" aria-hidden="true"><PlaneIcon width={46} height={46} /><b>{lm?.code}</b><small>{lm?.label}</small></div>}
            {images.length > 1 && (
              <div className="pw-thumbs" role="group" aria-label="Screenshots">
                {images.map((im, j) => (
                  <button key={im.src} className={j === shot ? 'on' : ''} onClick={() => setShot(j)}
                    aria-label={`Screenshot ${j + 1} of ${images.length}`} aria-pressed={j === shot}>
                    <img src={im.src} alt="" decoding="async" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="pw-main" ref={mainRef}>{body}</div>
      </article>
    </div>
  );
}

// ---------- Hackathons: race-day tickets ----------
export function HackathonsPage() {
  return (
    <div className="pg pg-hackathons">
      <Head id="hackathons" eyebrow="Race day" title="Hackathons" lead="Short sprints, real teams, real pitches." />
      <ul className="hk-list">
        {hackathons.map((h, i) => (
          <li key={h.id} className={`hk ${h.upcoming ? 'upcoming' : ''}`} style={{ '--k': i }}>
            <div className="hk-band">
              <span className="hk-status"><Flag width={16} height={16} /> {h.status}</span>
              <span className="hk-date">{h.date}</span>
            </div>
            <div className="hk-body">
              <h3>{h.name}</h3>
              <p className="hk-host">{h.host}{h.role ? ` · ${h.role}` : ''}</p>
              {h.idea && <p className="hk-idea">Our idea: <b>{h.idea}</b></p>}
              <ul className="pw-list">{h.lines.map((l) => <li key={l}>{l}</li>)}</ul>
              {h.tags?.length > 0 && <ul className="tags" aria-label="Topics">{h.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
            </div>
          </li>
        ))}
        <li className="hk hk-more" style={{ '--k': hackathons.length }}>
          <PlaneIcon width={28} height={28} />
          <p>{hackathonsMore}</p>
        </li>
      </ul>
    </div>
  );
}

// ---------- Achievements: passport stamps ----------
const FRAMES = ['rounded', 'oval', 'ticket'];
const TILTS = [-5, 3, -2, 6, -4, 2, -6, 4];

function StampFrame({ shape }) {
  if (shape === 'oval') return (<><ellipse cx="50" cy="30" rx="48" ry="28" /><ellipse cx="50" cy="30" rx="44.5" ry="24.5" className="inner" /></>);
  if (shape === 'ticket') return (<><path d="M9 2 H91 L98 9 V51 L91 58 H9 L2 51 V9 Z" /><path d="M11 5 H89 L95 11 V49 L89 55 H11 L5 49 V11 Z" className="inner" /></>);
  return (<><rect x="2" y="2" width="96" height="56" rx="6" /><rect x="5" y="5" width="90" height="50" rx="4" className="inner" /></>);
}

export function Stamp({ a, i }) {
  const shape = a.shape || FRAMES[i % FRAMES.length];
  return (
    <div className={`stamp2 ${shape}`} style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--k': i }}>
      <svg className="stamp-frame" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><StampFrame shape={shape} /></svg>
      <div className="stamp-body">
        <StampIcon name={a.icon} width={28} height={28} className="stamp-ico" />
        <div className="stamp-text">
          <span className="stamp-title">{a.title}</span>
          <span className="stamp-event">{a.event}</span>
          {a.certs?.length > 0 && <span className="stamp-cert"><Doc width={14} height={14} /> {a.certs.length > 1 ? `${a.certs.length} certificates` : 'Certificate'}</span>}
        </div>
      </div>
    </div>
  );
}

// Click a stamp: the passport opens on that stamp, one stamp per page,
// with Back / Next. Each page shows the full title, event, detail and date
// at a readable size, so nothing needs scrolling.
export function AchievementsPage() {
  const dlg = useRef(null);
  const certDlg = useRef(null);
  const [at, setAt] = useState(0);
  const [cert, setCert] = useState(null); // { list, i }
  const n = achievements.length;
  const open = (i) => { setAt(i); dlg.current?.showModal?.(); };
  const close = () => dlg.current?.close();
  const turn = (d) => setAt((x) => Math.max(0, Math.min(n - 1, x + d)));
  const openCert = (list, i) => { setCert({ list, i }); certDlg.current?.showModal?.(); };
  const closeCert = () => certDlg.current?.close();
  const turnCert = (d) => setCert((c) => c && ({ ...c, i: Math.max(0, Math.min(c.list.length - 1, c.i + d)) }));
  const a = achievements[at];
  const c = cert && cert.list[cert.i];
  const certCount = achievements.reduce((t, x) => t + (x.certs?.length || 0), 0);
  return (
    <div className="pg pg-achievements">
      <Head id="achievements" eyebrow="Passport stamps" title="Stamps"
        lead={<>{n} so far, with {certCount} certificates. Tap one for details.{certificatesPdf && <> <a href={certificatesPdf} target="_blank" rel="noopener">All certificates (PDF)</a></>}</>} />
      <ul className="stamps2">
        {achievements.map((s, i) => (
          <li key={s.id}>
            <button className="stamp-btn" onClick={() => open(i)} aria-label={`${s.title}, ${s.event}. Open in passport`}>
              <Stamp a={s} i={i} />
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dlg} className="passport-dialog" aria-labelledby="passport-entry-title"
        onClick={(e) => { if (e.target === dlg.current) close(); }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); }}>
        <div className="passport-book">
          <div className="passport-page id-page">
            <p className="eyebrow">Passport</p>
            <p className="pp-name">{person.name}</p>
            <figure className="portrait sm">
              {about.portrait ? <img src={about.portrait} alt="" /> : <Avatar width={70} height={70} aria-hidden="true" />}
            </figure>
            <dl className="facts">
              <div><dt>Home</dt><dd>{person.hometown}</dd></div>
              <div><dt>Studying</dt><dd>{person.course}</dd></div>
            </dl>
            <p className="mrz" aria-hidden="true">{`P<SWY${person.name.toUpperCase().replace(/ /g, '<')}<<<<<<<<`}</p>
          </div>
          <div className="passport-page entry-page">
            <div className="entry-top">
              <p className="eyebrow">Stamp {at + 1} of {n}</p>
              <button className="icon-btn" onClick={close} aria-label="Close passport">✕</button>
            </div>
            <div className="entry-stamp" key={a.id}><Stamp a={a} i={at} /></div>
            <h3 id="passport-entry-title" className="entry-title">{a.title}</h3>
            <dl className="entry-lines">
              <div><dt>Where</dt><dd>{a.event}</dd></div>
              {a.detail && <div><dt>Details</dt><dd>{a.detail}</dd></div>}
              <div><dt>Date</dt><dd>{a.date}</dd></div>
            </dl>
            {a.certs?.length > 0 && (
              <div className="entry-certs">
                <p className="pw-label">{a.certs.length > 1 ? 'Certificates' : 'Certificate'}</p>
                <ul>
                  {a.certs.map((ct, j) => (
                    <li key={ct.src}>
                      <button onClick={() => openCert(a.certs, j)} aria-label={`View certificate: ${a.title}, ${ct.label}`}>
                        <img src={ct.src} alt="" loading="lazy" decoding="async" />
                        <span>{ct.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="entry-nav">
              <button className="pill ghost" onClick={() => turn(-1)} disabled={at === 0}><ArrowLeft width={16} height={16} /> Back</button>
              <span className="entry-dots" aria-hidden="true">{achievements.map((s, i) => <i key={s.id} className={i === at ? 'on' : ''} />)}</span>
              <button className="pill ghost" onClick={() => turn(1)} disabled={at === n - 1}>Next <ArrowRight width={16} height={16} /></button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog ref={certDlg} className="cert-dialog" aria-label="Certificate" onClose={() => setCert(null)}
        onClick={(e) => { if (e.target === certDlg.current) closeCert(); }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.stopPropagation(); turnCert(1); } if (e.key === 'ArrowLeft') { e.stopPropagation(); turnCert(-1); } }}>
        {c && (
          <>
            <div className="cert-bar">
              <strong>{a.title} · {c.label}</strong>
              <div className="row">
                {cert.list.length > 1 && <>
                  <button className="icon-btn" onClick={() => turnCert(-1)} disabled={cert.i === 0} aria-label="Previous certificate"><ArrowLeft width={18} height={18} /></button>
                  <span className="muted">{cert.i + 1} / {cert.list.length}</span>
                  <button className="icon-btn" onClick={() => turnCert(1)} disabled={cert.i === cert.list.length - 1} aria-label="Next certificate"><ArrowRight width={18} height={18} /></button>
                </>}
                <button className="icon-btn" onClick={closeCert} aria-label="Close certificate">✕</button>
              </div>
            </div>
            <img className="cert-img" key={c.src} src={c.src} alt={`${a.title} certificate, ${c.label}, awarded to ${person.name}`} />
          </>
        )}
      </dialog>
    </div>
  );
}

// ---------- Skills: one suitcase per group ----------
export function SkillsPage() {
  return (
    <div className="pg pg-skills">
      <Head id="skills" eyebrow="In my luggage" title="Skills" lead="Packed for AI Software Developer and IT Support roles." />
      <div className="cases">
        {skills.map((g, i) => {
          const Icon = iconByName[g.icon] || Code;
          return (
            <section key={g.group} className="case" style={{ '--k': i }} aria-labelledby={`case-${i}`}>
              <svg className="case-handle" viewBox="0 0 60 20" aria-hidden="true"><path d="M10 20 V9 Q10 2 18 2 H42 Q50 2 50 9 V20" /></svg>
              <div className="case-head">
                <Icon width={22} height={22} />
                <h3 id={`case-${i}`}>{g.group}</h3>
                <small>{g.note}</small>
              </div>
              <ul className="chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </section>
          );
        })}
      </div>
      {skillsAlso?.length > 0 && (
        <dl className="also-lines">
          {skillsAlso.map((l) => <div key={l.label}><dt>{l.label}</dt><dd>{l.text}</dd></div>)}
        </dl>
      )}
    </div>
  );
}

// ---------- About (Klang) ----------
export function AboutPage() {
  const [more, setMore] = useState(false);
  return (
    <div className="pg pg-about">
      <div className="about-top">
        <figure className="portrait-frame">
          <div className="portrait">
            {about.portrait
              ? <img src={about.portrait} alt={`Portrait of ${person.name}`} />
              : <Avatar width={110} height={110} role="img" aria-label={`Line-art avatar of ${person.name}`} />}
          </div>
        </figure>
        <Head id="about" eyebrow="About · Klang" title={about.title} />
      </div>
      <ul className="icon-lines">
        {about.lines.map((l) => {
          const Icon = iconByName[l.icon] || Code;
          return <li key={l.text}><Icon width={22} height={22} /><span>{l.text}</span></li>;
        })}
      </ul>
      <ul className="chips accent" aria-label="Interested in">{about.interests.map((t) => <li key={t}>{t}</li>)}</ul>
      <ul className="chips quiet" aria-label="Quick facts">{about.facts.map((t) => <li key={t}>{t}</li>)}</ul>
      <button className="link-btn" aria-expanded={more} aria-controls="about-more" onClick={() => setMore((m) => !m)}>
        {more ? 'Show less' : 'Read more'}
      </button>
      <div id="about-more" className="about-more" hidden={!more}>
        {about.story.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  );
}

// ---------- Resume: travel documents ----------
export function ResumePage() {
  const viewer = useRef(null);
  const [src, setSrc] = useState('');
  const openViewer = (e) => {
    const small = window.matchMedia?.('(max-width: 700px), (pointer: coarse)').matches;
    if (small || !viewer.current?.showModal) return; // phones: open in a new tab
    e.preventDefault();
    setSrc(`${resume.file}#view=FitH`);
    viewer.current.showModal();
  };
  const closeViewer = () => viewer.current?.close();
  return (
    <div className="pg pg-resume">
      <Head id="resume" eyebrow="Travel documents" title="Resume" lead={`Updated ${resume.lastUpdated}.`} />
      <div className="doc-card">
        <span className="folder-tab"><Folder width={16} height={16} /> {person.name}</span>
        <div className="doc-body">
          <Doc width={44} height={44} className="doc-icon" />
          <dl className="doc-facts">
            {resume.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
          </dl>
        </div>
        <div className="doc-actions">
          <a className="pill solid" href={resume.file} download={resume.downloadName}><Download width={18} height={18} /> Download PDF</a>
          <a className="pill ghost" href={resume.file} target="_blank" rel="noopener" onClick={openViewer}>View online <External width={16} height={16} /></a>
        </div>
        {resume.documents.length > 0 && (
          <ul className="doc-links">
            {resume.documents.map((d) => (
              <li key={d.file}><a href={d.file} target="_blank" rel="noopener"><Doc width={16} height={16} /> {d.label}</a></li>
            ))}
          </ul>
        )}
      </div>

      <dialog ref={viewer} className="pdf-dialog" aria-label="Resume viewer" onClose={() => setSrc('')}
        onClick={(e) => { if (e.target === viewer.current) closeViewer(); }}>
        <div className="pdf-bar">
          <strong>{resume.downloadName}</strong>
          <div className="row">
            <a className="pill ghost sm" href={resume.file} target="_blank" rel="noopener">Open in new tab</a>
            <a className="pill solid sm" href={resume.file} download={resume.downloadName}><Download width={16} height={16} /> Download</a>
            <button className="icon-btn" onClick={closeViewer} aria-label="Close resume viewer">✕</button>
          </div>
        </div>
        {src && <iframe className="pdf-frame" src={src} title={`${person.name} resume`} />}
      </dialog>
    </div>
  );
}

// ---------- Contact: final landing ----------
export function ContactPage() {
  const [writing, setWriting] = useState(false);
  return (
    <div className="pg pg-contact">
      <Head id="contact" eyebrow="Final landing" title={contact.title} lead={contact.line} />
      <ul className="contact-tiles">
        <li className="tile">
          <Mail width={22} height={22} />
          <a href={`mailto:${socials.email}`} className="tile-main">{socials.email}</a>
          <CopyButton text={socials.email} />
        </li>
        <li className="tile">
          <Linkedin width={22} height={22} />
          <a href={socials.linkedin} target="_blank" rel="noopener" className="tile-main">LinkedIn</a>
        </li>
        <li className="tile">
          <Github width={22} height={22} />
          <a href={socials.github} target="_blank" rel="noopener" className="tile-main">GitHub</a>
        </li>
      </ul>
      <div className="row">
        <button className="pill solid" aria-expanded={writing} aria-controls="contact-form-wrap" onClick={() => {
          setWriting((w) => !w);
          setTimeout(() => document.getElementById('cf-name')?.focus(), 50);
        }}>
          <PlaneIcon width={18} height={18} /> {writing ? 'Hide message form' : 'Write a message'}
        </button>
        <a className="pill ghost" href={resume.file} download={resume.downloadName}><Download width={18} height={18} /> Resume</a>
      </div>
      <div id="contact-form-wrap" hidden={!writing}><ContactForm /></div>
      <div className="final-pass">
        <span className="pass-kind">Boarding pass</span>
        <p className="closing">{contact.closingLine}</p>
        <div className="final-fields" aria-hidden="true">
          <span><small>From</small><b>KLG</b></span>
          <span><small>To</small><b>Your team</b></span>
          <span><small>Gate</small><b>Open</b></span>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* clipboard blocked: the address is still selectable */ }
  };
  return (
    <button type="button" className={`copy-btn ${done ? 'done' : ''}`} onClick={copy} aria-label="Copy email address">
      <Copy width={14} height={14} /> {done ? 'Copied' : 'Copy'}
      <span className="sr-only" role="status">{done ? 'Email copied' : ''}</span>
    </button>
  );
}

function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const errs = {};
    if (!data.name.trim()) errs.name = 'Add your name.';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Add a valid email.';
    if (data.message.trim().length < 10) errs.message = 'A few more words, please.';
    setErrors(errs);
    if (Object.keys(errs).length) { setTimeout(() => form.querySelector('[aria-invalid="true"]')?.focus(), 0); return; }
    if (!contact.formEndpoint) {
      const body = encodeURIComponent(`${data.message}\n\n${data.name} (${data.email})`);
      window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${body}`;
      setStatus('mail');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(contact.formEndpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) form.reset();
    } catch { setStatus('error'); }
  }
  return (
    <form id="contact-form" className="form" onSubmit={onSubmit} noValidate>
      <Field name="name" label="Name" error={errors.name} />
      <Field name="email" label="Email" type="email" error={errors.email} />
      <Field name="message" label="Message" textarea error={errors.message} />
      <button className="pill solid" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'}</button>
      <p role="status" aria-live="polite" className={`form-status ${status}`}>
        {status === 'sent' && 'Sent. Thank you!'}
        {status === 'mail' && <>Your email app should open. If not, email {socials.email}.</>}
        {status === 'error' && <>That didn't send. Email {socials.email} instead.</>}
      </p>
    </form>
  );
}

function Field({ name, label, type = 'text', textarea, error }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className="field">
      <span>{label}</span>
      <Tag id={`cf-${name}`} name={name} type={textarea ? undefined : type} rows={textarea ? 4 : undefined}
        aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} required />
      {error && <small id={`${name}-err`} className="err">{error}</small>}
    </label>
  );
}
