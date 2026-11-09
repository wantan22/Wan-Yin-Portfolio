import { useEffect, useState } from 'react';
import { person, resume, stops, projects } from '../content.js';
import { Plane, Download, Sun, Moon } from './Icons.jsx';
import {
  HomePage, ProjectsPage, ProjectDetail, HackathonsPage, AchievementsPage, SkillsPage, AboutPage, ResumePage, ContactPage,
} from './Sections.jsx';

// The plain, scannable version: the same pages, stacked, with lots of room.
export default function FastLane({ theme, onToggleTheme, onTakeFlight }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const nav = stops.filter((s) => s.id !== 'hero');
  const open = projects.find((p) => p.id === openId);

  // a link like #project-snapstock opens that project
  useEffect(() => {
    const fromHash = () => {
      const p = projects.find((x) => `#project-${x.id}` === location.hash);
      if (p) { setOpenId(p.id); requestAnimationFrame(() => document.getElementById('fl-detail')?.scrollIntoView({ block: 'start' })); }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const toggle = (id) => {
    setOpenId((cur) => (cur === id ? null : id));
    requestAnimationFrame(() => document.getElementById('fl-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  return (
    <div className="fl">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="fl-header">
        <nav className="fl-nav" aria-label="Main">
          <a href="#hero" className="fl-logo" aria-label={`${person.name}, back to top`}><Plane width={20} height={20} /> <span className="logo-text">{person.shortName}</span></a>
          <ul className={`fl-links ${menuOpen ? 'open' : ''}`} id="fl-menu">
            {nav.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} onClick={() => setMenuOpen(false)}>{s.label}</a></li>
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
            <button className="pill ghost mode-btn" onClick={onTakeFlight} title="Switch to the animated flight">
              <Plane width={16} height={16} /><span className="long">Take the flight</span><span className="short">Fly</span>
            </button>
            <a className="pill solid" href="#contact">Hire me</a>
            <button className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="fl-menu" onClick={() => setMenuOpen((o) => !o)}>
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span><span className="sr-only">Menu</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="main">
        <section id="hero" className="fl-section fl-hero" aria-labelledby="hero-title"><HomePage /></section>
        <section id="projects" className="fl-section" aria-labelledby="projects-title">
          <ProjectsPage onOpen={toggle} />
          <div id="fl-detail" className="fl-detail">
            {open && <ProjectDetail p={open} compact onBack={() => setOpenId(null)} />}
          </div>
        </section>
        <section id="hackathons" className="fl-section" aria-labelledby="hackathons-title"><HackathonsPage /></section>
        <section id="achievements" className="fl-section" aria-labelledby="achievements-title"><AchievementsPage /></section>
        <section id="skills" className="fl-section" aria-labelledby="skills-title"><SkillsPage /></section>
        <section id="about" className="fl-section warm" aria-labelledby="about-title"><AboutPage /></section>
        <section id="resume" className="fl-section warm" aria-labelledby="resume-title"><ResumePage /></section>
        <section id="contact" className="fl-section warm" aria-labelledby="contact-title"><ContactPage /></section>
      </main>
      <footer className="fl-footer"><p>© {new Date().getFullYear()} {person.name} · Subang → Sunway → Klang</p></footer>
    </div>
  );
}
