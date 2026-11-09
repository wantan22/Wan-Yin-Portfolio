// ============================================================
//  content.js  -  the ONLY file you need to edit for content.
//  Both the flight version and the fast lane read from here.
// ============================================================

export const person = {
  name: 'Teo Wan Yin',
  shortName: 'Wan Yin',
  headline: 'I build practical AI-assisted web apps and fix what breaks.',
  roles: ['AI Software Developer Intern', 'IT Support Intern'],
  // one short line under the roles
  tagline: 'I build it, fix it, and keep it running.',
  course: 'B.Sc. (Hons) Information Technology',
  university: 'Sunway University',
  graduationYear: 'Jan 2028',
  location: 'Sunway City, Selangor',
  hometown: 'Klang, Selangor',
};

export const socials = {
  email: '17054.wanyin@gmail.com',
  github: 'https://github.com/wantan22',
  linkedin: 'https://www.linkedin.com/in/wanyin0922',
};

// ---- Resume (travel documents) -----------------------------
export const resume = {
  file: 'resume.pdf', // AI Software Development version. Replace public/resume.pdf to update.
  downloadName: 'Teo-Wan-Yin-Resume.pdf',
  lastUpdated: 'November 2026',
  facts: [
    { label: 'Focus', value: 'AI software development & IT support' },
    { label: 'Studying', value: 'B.Sc. (Hons) IT, Sunway University' },
    { label: 'CGPA', value: "3.73 · Dean's List x4" },
    { label: 'Working', value: 'Shopee store operator, part-time' },
  ],
  documents: [], // extra PDFs to list under the resume (certificates now live in Achievements)
};

// ---- Projects (newest first) -------------------------------
// landmark: the Sunway landmark the plane flies to (see `landmarks`)
// short:    one line for the ticket
// tags:     2 to 3 tags for the ticket (all of `tech` shows on the boarding pass)
// about:    what it is and who it's for (1 to 2 sentences)
// features: what it does (short bullets)
// built:    how it was built (short bullets)
// ai:       how AI was used (leave out if none)
// fixed:    a problem you troubleshot (leave out if none)
// live / video / code: links (leave empty if none)
// images:   screenshots in public/img (the first one shows first)
export const projects = [
  {
    id: 'jampod',
    landmark: 'sunway-pyramid',
    name: 'JamPod',
    short: 'Virtual band practice room in the browser',
    tags: ['React', 'TypeScript', 'WebSocket'],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Web Audio API', 'MediaRecorder', 'Node.js', 'WebSocket (ws)', 'PostgreSQL (Supabase)', 'Render'],
    role: 'Solo · built with Claude Code',
    about: 'A practice room in the browser where bands of up to 4 jam together live from different devices. Made for small hobby bands who want to practise without paying for, or booking, a real studio.',
    features: [
      'Band Room: a shared stage, chord teleprompter, whiteboard, and jam or talk modes.',
      'Song Studio: record, mix and share song layers, even when the band isn’t online together.',
      'Companion mic: talk through a phone, so plugged-in instruments stay plugged in.',
      'Chord detection from an MP3 or the mic, plus YouTube backing tracks.',
      'Light and dark mode, and RGB stage lights to match the mood.',
    ],
    built: [
      'Realtime: a custom Node.js WebSocket relay keeps every bandmate’s stage in sync.',
      'Audio: Web Audio API for filters, EQ, reverb and analysis; MediaRecorder for recording.',
      'Backend: Node.js server for accounts, band rooms and uploads, with scrypt hashing, HttpOnly cookies and Supabase Postgres.',
    ],
    ai: 'Built with Claude Code, which wrote and tested the code and guided the Supabase and Render setup. I reviewed, tested and deployed it. The app itself calls no AI: chord detection is signal processing in the browser.',
    live: 'https://jampod-20fz.onrender.com/',
    liveNote: 'Free hosting, so the first load can take up to a minute.',
    video: 'https://youtu.be/GnNOLyR1Qjg',
    code: '',
    images: [
      { src: 'img/jampod-1.webp', alt: 'JamPod Band Room: a drawn stage with drums, keys and a guitarist, a session goals board, LED colour sliders and the session feed' },
      { src: 'img/jampod-2.webp', alt: 'JamPod Song Studio: song sections on a timeline and recorded drum, keys and bass layers with EQ knobs' },
      { src: 'img/jampod-3.webp', alt: 'JamPod Arrangement board: colour-coded song sections such as Intro, Verse, Chorus and Guitar Solo' },
      { src: 'img/jampod-4.webp', alt: 'JamPod Music Vault: song versions, a shared library and setlist folders' },
    ],
    date: 'Nov 2026',
  },
  {
    id: 'snapstock',
    landmark: 'brt-walkway',
    name: 'SnapStock',
    short: 'Stock and photo app for my Shopee store',
    tags: ['React', 'Supabase', 'PWA'],
    tech: ['React', 'Vite', 'Supabase', 'PostgreSQL', 'PWA', 'Netlify'],
    role: 'Solo · self-taught React',
    about: 'A mobile-first app I built to run my Shopee store and teach myself React. The team photographs products, logs stock and measurements, and reports overcharged shipping, all in one shared database.',
    features: [
      'Add products with colour, variants, stock, notes and up to 30 photos.',
      'Measurements as numbers (cm, mm, in, g) or as photos next to a ruler.',
      'Search the database and tick items off once they’re on Shopee.',
      'Overcharged-shipping reports with up to 100 photos and a note.',
      'English and 中文, light and dark themes, installs to the home screen.',
    ],
    built: [
      'React + Vite front end; Supabase for login, the Postgres database and photo storage.',
      'Sign-up needs an invite code, so only the team can register.',
      'Photos are resized in the browser before upload to save storage and data.',
    ],
    fixed: 'Photo uploads were slow. The app now sends 3 images at a time on submit.',
    live: 'https://snapstock-team.netlify.app/',
    video: '',
    code: '',
    images: [{ src: 'img/snapstock.webp', alt: 'SnapStock home screen with Add product, Overcharged shipping and Database buttons' }],
    date: 'Oct 2026',
  },
  {
    id: 'sme-network',
    landmark: 'sunway-medical',
    name: 'SME Network',
    short: '4-VLAN small-business network on real Cisco gear',
    tags: ['Cisco', 'VLANs', 'DHCP'],
    tech: ['Cisco Packet Tracer', 'VLANs', 'DHCP', 'EtherChannel', 'STP', 'Port security', 'SSH'],
    role: 'Team of 5',
    about: 'A network for a small business, designed in Cisco Packet Tracer and then built on real Cisco switches and routers in the lab.',
    features: [
      '4 VLANs that keep each department’s traffic separate.',
      'Router-on-a-stick so the VLANs can still talk to each other.',
      'DHCP, so every PC gets an IP address automatically.',
      'LACP EtherChannel and STP for a faster, loop-free link between switches.',
      'Port security and SSH to lock down the devices.',
    ],
    built: [
      'Planned and tested the design in Cisco Packet Tracer.',
      'Set up the same design on physical Cisco gear in the lab.',
      'Checked every part with show commands.',
    ],
    fixed: 'A PC got no IP address. VLAN 99 had no DHCP pool.',
    live: '',
    video: '',
    code: '',
    date: 'Aug 2026',
  },
  {
    id: 'futureworks',
    landmark: 'sunway-university',
    name: 'FutureWorks',
    short: 'Jobs and free skills training for UN SDG 8',
    tags: ['PHP', 'MySQL'],
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'Apache'],
    role: 'University coursework',
    about: 'A job and skills platform for UN SDG 8 (Decent Work and Economic Growth). It connects job seekers in Malaysia with jobs and free learning paths.',
    features: [
      'Filter jobs by category and location, then apply in one click.',
      'Skill paths with lessons, videos and practice tasks, linked to matching jobs.',
      'Reward points: +10 for signing up, +5 for each application.',
      'Admin dashboard to manage users, jobs, learning paths and applicants.',
    ],
    built: [
      'PHP and MySQL with plain HTML and CSS, no framework.',
      'Hashed passwords, user and admin roles, and a 30-minute session timeout.',
      'Prepared statements for most queries; seeded with 25+ jobs.',
    ],
    fixed: 'Job filters showed no results. Job titles now match the filter options.',
    live: '',
    video: 'https://youtu.be/bJi_8LqCaCM',
    code: '',
    date: 'Mar 2026',
  },
  {
    id: 'desert-club',
    landmark: 'sunway-lagoon',
    name: 'Desert Club',
    short: '7-page café website, my first uni project',
    tags: ['HTML', 'CSS', 'JavaScript'],
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    role: 'Group project',
    about: 'A 7-page website for a made-up café, “Quiet Morning, Bold Coffee”. My first university project, built in a group for Web Fundamentals.',
    features: [
      'Home page with menu shortcuts and customer reviews.',
      'Coffee, drinks and food menus with photos and prices.',
      'Contact form with a success message.',
      'Sign-up and login demo with validation messages.',
    ],
    built: [
      'Plain HTML, CSS and JavaScript, with no build step or server.',
      'Slide-out menu and popup written in vanilla JavaScript.',
      'Responsive layout, tested across browsers and screen sizes.',
    ],
    fixed: 'Header sizes differed between pages. Fixed with border-box sizing.',
    live: '',
    video: 'https://youtu.be/0H3J4IJAZCc',
    code: '',
    images: [{ src: 'img/desert-club.webp', alt: 'Desert Club homepage with the café logo and Menu and Sign Up buttons' }],
    date: 'May 2025',
  },
];

// Smaller projects, shown on the last ticket
export const moreProjects = [
  { name: 'Pokémon battle game', tech: 'Python · OOP', date: 'May 2025' },
];

// ---- Hackathons (newest first) ------------------------------
// status: a short label on the card, e.g. Pitched, Finalist, Up next
export const hackathons = [
  {
    id: 'kiro',
    name: 'STC x Kiro Mini Hackathon 2026',
    host: 'Sunway Tech Club',
    date: '15 Nov 2026',
    status: 'Up next',
    upcoming: true,
    lines: ['A one-day hackathon at Sunway.', 'What I build will be added here after the event.'],
    tags: [],
  },
  {
    id: 'codex',
    name: 'Codex Community Hackathon KL 2026',
    host: 'OpenAI Build Week',
    date: 'Jun 2026',
    status: 'Pitched',
    role: 'Team participant',
    idea: 'AI Clinic Queue',
    lines: [
      'A virtual-queue app to cut clinic waiting times.',
      'Estimated turn times, plus AI remedy tips while you wait.',
      'Pitched in a 150-participant selection round.',
    ],
    tags: ['AI', 'Healthcare', 'Product pitch'],
  },
];
export const hackathonsMore = 'More hackathons coming in. Stay tuned.';

// ---- Achievements (passport stamps) -------------------------
// title + event show on the stamp; detail shows inside the passport view
// icon: trophy | medal | certificate | star | flag | leaf
// certs: certificate images in public/img/certs (shown when the stamp is opened)
export const achievements = [
  { id: 'deans-list', title: "Dean's List x4", event: 'Sunway University', detail: 'Faculty of Engineering and Technology, for the Apr 2025, Sep 2025, Feb 2026 and May 2026 semesters', icon: 'trophy', date: '2025 to 26',
    certs: [
      { src: 'img/certs/deans-apr-2025.webp', label: 'Apr 2025' },
      { src: 'img/certs/deans-sep-2025.webp', label: 'Sep 2025' },
      { src: 'img/certs/deans-feb-2026.webp', label: 'Feb 2026' },
      { src: 'img/certs/deans-may-2026.webp', label: 'May 2026' },
    ] },
  { id: 'ccna', title: 'CCNA', event: 'Introduction to Networks', detail: 'Cisco Networking Academy, verified badge. Ethernet, IPv4/IPv6, subnetting and switch and router setup, with hands-on labs.', icon: 'certificate', date: 'Mar 2026',
    certs: [{ src: 'img/certs/ccna.webp', label: 'CCNA' }] },
  { id: 'peer-mentor', title: 'Peer Mentor', event: 'MUFY programme', detail: "Raised a Year 1 ICT student's result from D to B", icon: 'medal', date: '2024',
    certs: [{ src: 'img/certs/peer-mentor.webp', label: 'Peer Mentor' }] },
];
export const certificatesPdf = 'certificates.pdf'; // all certificates in one file

// ---- Skills (one suitcase per group) ------------------------
// icon: code | server | database | people
export const skills = [
  { group: 'Frontend', note: 'What people see', icon: 'code',
    items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Tailwind CSS', 'HTML & CSS'] },
  { group: 'Backend', note: 'Servers & logic', icon: 'server',
    items: ['Node.js', 'WebSocket', 'PHP', 'ASP.NET', 'ASP.NET MVC', 'Session-based auth', 'Python (basic)'] },
  { group: 'Database', note: 'Storing data', icon: 'database',
    items: ['PostgreSQL', 'Supabase', 'MySQL', 'phpMyAdmin'] },
  { group: 'Soft skills', note: 'How I work', icon: 'people',
    items: ['Problem Solving', 'Attention to Detail', 'Communication', 'Teamwork', 'Willingness to Learn', 'Task & Deadline Management', 'Responsibility', 'Adaptability'] },
];
// short lines under the suitcases
export const skillsAlso = [
  { label: 'AI & tools', text: 'Claude Code, ChatGPT, Gemini, GitHub, Render, Netlify, Vercel' },
  { label: 'IT & networking', text: 'Cisco Packet Tracer, VLANs, DHCP, STP, SSH, TCP/IP, troubleshooting' },
  { label: 'Also', text: 'Microsoft Office, Adobe Photoshop' },
];

// ---- About (Klang) ------------------------------------------
export const about = {
  title: 'Teo Wan Yin',
  // three short lines, each with an icon: code | store | people
  lines: [
    { icon: 'code', text: 'IT student who builds web apps with AI tools like Claude Code, and fixes what breaks.' },
    { icon: 'store', text: 'Runs a Shopee store: listings, customer issues, disputes, returns.' },
    { icon: 'people', text: 'Leads group projects and keeps work on schedule.' },
  ],
  interests: ['AI Software Development', 'Web Development', 'IT Support'],
  facts: ['Klang, Selangor', 'Grad Jan 2028', 'English · 中文 · Malay'],
  // full story, shown behind "Read more"
  story: [
    'I am an Information Technology student who builds practical web apps for real problems. I work with React, TypeScript, Node.js and PostgreSQL, and I use AI-assisted development with Claude Code to plan, write and test code faster. I still review, test and deploy everything myself, so I understand what I ship.',
    'Beyond software, I run a Shopee store: product listings, customer questions, disputes and returns. It taught me to troubleshoot under pressure, communicate clearly and manage tasks within deadlines, and it gave me the idea for SnapStock.',
    'I have also led group projects, coordinating tasks, supporting teammates and making sure work is finished on time.',
    'I am eager to keep learning, especially how AI can make software more useful. I am looking for opportunities in AI Software Development, Web Development and IT Support, where I can apply my skills and contribute to practical solutions.',
  ],
  portrait: 'portrait.webp',
};

// ---- Contact -----------------------------------------------
export const contact = {
  title: "Let's build something together.",
  line: 'Open to AI Software Developer and IT Support internships.',
  closingLine: 'Next destination: your team.',
  // Formspree: create a form at formspree.io and paste its endpoint here.
  formEndpoint: '', // empty = "Send" opens the visitor's email app
};

// ---- Stops: the single source of truth for navigation -------
// progress: rough place on the trip (0 to 1). The flight measures the real
//           positions from the page layout, so this is only a guide.
// map: x, y in the map's SVG coordinate space (0..1000, 0..1600).
//      The flight path is drawn through these points in order.
// camera: how much of the map is visible when the plane is here
//         (smaller = more zoomed in)
// zone: which part of the story it belongs to
export const stops = [
  { id: 'hero', label: 'Home', subtitle: 'Subang Airport', zone: 'subang', progress: 0.0, map: { x: 560, y: 212 }, camera: 640 },
  { id: 'projects', label: 'Projects', subtitle: 'Sunway City', zone: 'sunway', progress: 0.14, map: { x: 560, y: 480 }, camera: 560 },
  { id: 'hackathons', label: 'Hackathons', subtitle: 'Race day', zone: 'sunway', progress: 0.56, map: { x: 640, y: 790 }, camera: 440 },
  { id: 'achievements', label: 'Achievements', subtitle: 'Passport stamps', zone: 'sunway', progress: 0.62, map: { x: 500, y: 820 }, camera: 440 },
  { id: 'skills', label: 'Skills', subtitle: 'In my luggage', zone: 'sunway', progress: 0.7, map: { x: 470, y: 900 }, camera: 480 },
  { id: 'about', label: 'About', subtitle: 'Klang, home', zone: 'klang', progress: 0.8, map: { x: 180, y: 1300 }, camera: 640 },
  { id: 'resume', label: 'Resume', subtitle: 'Travel documents', zone: 'klang', progress: 0.9, map: { x: 160, y: 1400 }, camera: 560 },
  { id: 'contact', label: 'Contact', subtitle: 'Final landing', zone: 'klang', progress: 1.0, map: { x: 140, y: 1500 }, camera: 520 },
];

// Project landmarks inside Sunway (sub-stops of "projects")
// code: 3-letter 'airport code' printed on the boarding pass
export const landmarks = [
  // listed top-to-bottom on the map, in the same order as the projects (newest first)
  { id: 'sunway-pyramid', code: 'PYR', label: 'Sunway Pyramid', progress: 0.2, map: { x: 520, y: 540 }, camera: 380 },
  { id: 'brt-walkway', code: 'BRT', label: 'BRT Sunway Line', progress: 0.28, map: { x: 640, y: 600 }, camera: 380 },
  { id: 'sunway-medical', code: 'SMC', label: 'Sunway Medical Centre', progress: 0.36, map: { x: 580, y: 665 }, camera: 400 },
  { id: 'sunway-university', code: 'SWU', label: 'Sunway University', progress: 0.44, map: { x: 650, y: 735 }, camera: 380 },
  { id: 'sunway-lagoon', code: 'LGN', label: 'Sunway Lagoon', progress: 0.52, map: { x: 480, y: 690 }, camera: 380 },
];

// A pull-back point between Sunway and Klang (no section, camera only)
export const transit = { map: { x: 380, y: 1110 }, camera: 1250 };

// Boarding-pass details
export const flight = { origin: 'SZB', originName: 'Subang', flightPrefix: 'WY' };

export const site = {
  title: 'Teo Wan Yin | AI Software Developer & IT Student',
  description:
    'Portfolio of Teo Wan Yin, IT student at Sunway University (CGPA 3.73, Dean\'s List): AI-assisted web apps in React, TypeScript and Node.js, hackathons, certificates and a resume to download.',
  url: 'https://wan-yin-portfolio.vercel.app',
};
