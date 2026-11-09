// Outline-only line icons. All use currentColor so they follow the theme.
const base = {
  className: 'line-art',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
};

export const Plane = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 13.5 21 6.5c.8-.3 1.3.7.6 1.2L13 14l-1.5 6-2-4.5-4-.8z" />
    <path d="M9.5 15.5 13 14" />
  </svg>
);
export const Download = (p) => (
  <svg {...base} {...p}><path d="M12 4v11M7 10.5 12 15.5 17 10.5M5 19.5h14" /></svg>
);
export const Doc = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3.5h7l4 4v13H7z" /><path d="M14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4" />
  </svg>
);
export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </svg>
);
export const Moon = (p) => (
  <svg {...base} {...p}><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" /></svg>
);
export const Mail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
);
export const Github = (p) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4 1.3-4-2-5.5-2.5M14.5 21v-3.2c0-1 .1-1.4-.5-2 2.6-.3 5.5-1.3 5.5-5.8a4.5 4.5 0 0 0-1.2-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.2 1.2a11 11 0 0 0-5.8 0C6 3.5 5 3.8 5 3.8a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 3.7 10c0 4.5 2.9 5.5 5.5 5.8-.6.6-.6 1.2-.5 2V21" />
  </svg>
);
export const Linkedin = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10v6.5M7.5 7.3v.2M11 16.5V10M11 13c0-1.8 1-3 2.6-3s2.4 1.1 2.4 3v3.5" />
  </svg>
);
export const External = (p) => (
  <svg {...base} {...p}><path d="M14 4.5h5.5V10M19 5 11 13M17 13.5V19H5V7h5.5" /></svg>
);

export const Passport = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M9 16.5h6M5.5 6h.01" />
  </svg>
);

export const Bowl = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 12h17a8.5 8.5 0 0 1-17 0zM9 20.5h6M8 8.5c0-1.5 1.5-1.5 1.5-3M12 8.5c0-1.5 1.5-1.5 1.5-3M16 8.5c0-1.5 1.5-1.5 1.5-3" />
  </svg>
);
export const Pin = (p) => (
  <svg {...base} {...p}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
export const Home = (p) => (
  <svg {...base} {...p}><path d="M4 11 12 4.5 20 11M6 9.5V20h12V9.5M10 20v-5.5h4V20" /></svg>
);
export const Folder = (p) => (
  <svg {...base} {...p}><path d="M3.5 6.5h6l2 2h9v10.5h-17z" /><path d="M3.5 10.5h17" /></svg>
);

export const Code = (p) => (
  <svg {...base} {...p}><path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14" /></svg>
);
export const Wrench = (p) => (
  <svg {...base} {...p}><path d="M14.5 4.5a4.5 4.5 0 0 0-4.3 5.8L4 16.5 7.5 20l6.2-6.2a4.5 4.5 0 0 0 5.8-4.3l-2.6 2.6-3-.4-.4-3z" /></svg>
);
export const People = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M15.5 6a3 3 0 0 1 0 5.5M17.5 14.8c1.6.6 2.6 2 3 4.2" /></svg>
);
export const Store = (p) => (
  <svg {...base} {...p}><path d="M4 9.5 5.5 4.5h13L20 9.5M4 9.5h16M4 9.5c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20" /></svg>
);
export const ArrowDown = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M6.5 13.5 12 19l5.5-5.5" /></svg>
);
export const ArrowUp = (p) => (
  <svg {...base} {...p}><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" /></svg>
);
export const ArrowLeft = (p) => (
  <svg {...base} {...p}><path d="M19 12H5M10.5 6.5 5 12l5.5 5.5" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" /></svg>
);
export const Flag = (p) => (
  <svg {...base} {...p}><path d="M5.5 21V4M5.5 4.5h11l-2 3.5 2 3.5h-11" /></svg>
);
export const Copy = (p) => (
  <svg {...base} {...p}><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></svg>
);

export const Server = (p) => (
  <svg {...base} {...p}><rect x="4" y="4.5" width="16" height="6" rx="1.5" /><rect x="4" y="13.5" width="16" height="6" rx="1.5" /><path d="M7.5 7.5h.01M7.5 16.5h.01M11 7.5h5M11 16.5h5" /></svg>
);
export const Database = (p) => (
  <svg {...base} {...p}><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></svg>
);

// Pick an icon by name (used by content.js entries)
export const iconByName = { code: Code, wrench: Wrench, people: People, store: Store, server: Server, database: Database };

// Passport stamp icons
const stampIcons = {
  trophy: <path d="M8 4.5h8v4a4 4 0 0 1-8 0zM8 6H5.5a2.5 2.5 0 0 0 2.6 3.4M16 6h2.5a2.5 2.5 0 0 1-2.6 3.4M12 12.5v3.5M9 19.5h6M10 16h4v3.5h-4z" />,
  medal: <><circle cx="12" cy="14.5" r="5" /><path d="M8.5 3.5l3.5 6 3.5-6M12 12.3l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z" /></>,
  certificate: <><rect x="3.5" y="4.5" width="17" height="12" rx="1.5" /><path d="M7 8.5h10M7 11.5h6" /><circle cx="16" cy="16.5" r="2.3" /><path d="m14.8 18.4-.6 2.6 1.8-1 1.8 1-.6-2.6" /></>,
  star: <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" />,
  flag: <path d="M5.5 21V4M5.5 4.5h11l-2 3.5 2 3.5h-11" />,
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19c3-4 6-7 10-9" />,
};
export const StampIcon = ({ name = 'star', ...p }) => <svg {...base} {...p}>{stampIcons[name] || stampIcons.star}</svg>;

// Simple line-art avatar used when no portrait is set
export const Avatar = (p) => (
  <svg {...base} viewBox="0 0 120 120" strokeWidth={1.6} {...p}>
    <circle cx="60" cy="46" r="20" />
    <path d="M40 42c4-12 26-16 40-4M26 104c4-20 18-30 34-30s30 10 34 30" />
    <path d="M52 50c2 2 6 2 8 0M68 50c2 2 6 2 8 0" transform="translate(-8 -4)" />
  </svg>
);
