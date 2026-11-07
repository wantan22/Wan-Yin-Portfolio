// ============================================================
//  content.js  -  the ONLY file you need to edit for content.
//  Both the flight version and the fast lane read from here.
//  Keep copy short: one idea per line, tags instead of sentences.
// ============================================================

export const person = {
  name: 'Teo Wan Yin',
  shortName: 'Wan Yin',
  headline: 'I build practical web apps and fix what breaks.',
  roles: ['Software Engineer Intern', 'IT Support Intern'],
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
  file: 'resume.pdf', // Software Engineer Intern version. Replace public/resume.pdf to update.
  downloadName: 'Teo-Wan-Yin-Resume.pdf',
  lastUpdated: 'November 2026',
  facts: [
    { label: 'Studying', value: 'B.Sc. (Hons) IT, Sunway University' },
    { label: 'CGPA', value: "3.73 · Dean's List x4" },
    { label: 'Working', value: 'Shopee store operator, part-time' },
  ],
  documents: [
    { label: 'Certificates', file: 'certificates.pdf' },
  ],
};

// ---- Projects (newest first) -------------------------------
// landmark: the Sunway landmark the plane flies to (see `landmarks`)
// short:   one line for the departures board
// tags:    2 to 3 tags for the board (all of `tech` shows on the boarding pass)
// built:   one line, what it does
// fixed:   one line, a problem you troubleshot (leave out if none)
export const projects = [
  {
    id: 'snapstock',
    landmark: 'sunway-pyramid',
    name: 'SnapStock',
    short: 'Stock and photo app for my Shopee store',
    tags: ['React', 'Supabase', 'PWA'],
    tech: ['React', 'Vite', 'Supabase', 'PostgreSQL', 'PWA', 'Netlify'],
    role: 'Solo · self-taught React',
    built: 'Bilingual app with login, shared database and cloud photos.',
    fixed: 'Slow photo uploads. Now sends 3 at a time.',
    demo: '',
    code: '',
    image: 'img/snapstock.webp',
    imageAlt: 'SnapStock home screen with Add product, Overcharged shipping and Database buttons',
    date: 'Oct 2026',
  },
  {
    id: 'sme-network',
    landmark: 'brt-walkway',
    name: 'SME Network',
    short: '4-VLAN small-business network on real Cisco gear',
    tags: ['Cisco', 'VLANs', 'DHCP'],
    tech: ['Cisco Packet Tracer', 'VLANs', 'DHCP', 'EtherChannel', 'STP', 'SSH'],
    role: 'Team of 5',
    built: 'Router-on-a-stick, DHCP, EtherChannel, STP, port security and SSH.',
    fixed: 'PC with no IP. VLAN 99 had no DHCP pool.',
    demo: '',
    code: '',
    date: 'Aug 2026',
  },
  {
    id: 'codex-hackathon',
    landmark: 'sunway-medical',
    name: 'AI Clinic Queue',
    short: 'Virtual queue to cut clinic waiting times',
    tags: ['AI', 'Hackathon'],
    tech: ['AI', 'Product pitch'],
    role: 'Codex Community Hackathon KL',
    built: 'Estimated turn times and AI remedy tips while you wait.',
    result: 'Pitched in a 150-person selection round.',
    demo: '',
    code: '',
    date: 'Jun 2026',
  },
  {
    id: 'futureworks',
    landmark: 'sunway-university',
    name: 'FutureWorks',
    short: 'Jobs and free skills training for UN SDG 8',
    tags: ['PHP', 'MySQL'],
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'Apache'],
    role: 'University coursework',
    built: 'Job search, one-click apply, skill paths, points and an admin dashboard.',
    fixed: 'Empty filter results. Job titles now match the filters.',
    demo: 'https://youtu.be/bJi_8LqCaCM',
    demoLabel: 'Watch demo',
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
    built: 'Menus, reviews, contact form, slide-out menu and sign-up demo.',
    fixed: 'Uneven headers across pages. Fixed with border-box sizing.',
    demo: 'https://youtu.be/0H3J4IJAZCc',
    demoLabel: 'Watch demo',
    code: '',
    image: 'img/desert-club.webp',
    imageAlt: 'Desert Club homepage with the café logo and Menu and Sign Up buttons',
    date: 'May 2025',
  },
];

// Smaller projects, shown as one line under the board
export const moreProjects = [
  { name: 'Pokémon battle game', tech: 'Python · OOP', date: 'May 2025' },
];

// ---- Achievements (passport stamps) -------------------------
// title + event show on the stamp; detail shows inside the passport view
// icon: trophy | medal | certificate | star | flag | leaf
export const achievements = [
  { id: 'deans-list', title: "Dean's List x4", event: 'Sunway University', detail: 'Apr 2025, Sep 2025, Feb 2026 and May 2026 semesters', icon: 'trophy', date: '2025 to 26' },
  { id: 'cgpa', title: 'CGPA 3.73', event: 'B.Sc. (Hons) IT', detail: 'Out of 4.0', icon: 'star', date: '2026' },
  { id: 'ccna', title: 'CCNA', event: 'Introduction to Networks', detail: 'Cisco Networking Academy, verified badge', icon: 'certificate', date: 'Mar 2026' },
  { id: 'kiro', title: 'Up next', event: 'STC x Kiro Mini Hackathon', detail: '15 November 2026', icon: 'flag', date: 'Nov 2026' },
  { id: 'codex', title: 'Pitched', event: 'Codex Hackathon KL', detail: 'OpenAI Build Week, 150-person round', icon: 'flag', date: 'Jun 2026' },
  { id: 'planetary', title: 'Group Leader', event: 'Planetary Health project', detail: 'Recycling-for-barter plan, RM580 budget, pitched to Desa Mentari leaders', icon: 'leaf', date: '2026' },
  { id: 'peer-mentor', title: 'Peer Mentor', event: 'MUFY programme', detail: "Raised a Year 1 ICT student's result from D to B", icon: 'medal', date: '2024' },
  { id: 'cca', title: 'President', event: 'Photoshop club', detail: 'Led 20 members with weekly sessions, Nobel International School', icon: 'star', date: '2023' },
];

// ---- Skills (three suitcases: build, fix, work) -------------
export const skills = [
  { group: 'Build', note: 'Web apps', icon: 'code',
    items: ['HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'PHP', 'MySQL', 'Supabase', 'ASP.NET', 'ASP.NET MVC', 'Python'] },
  { group: 'Fix', note: 'Troubleshooting & systems', icon: 'wrench',
    items: ['Debugging', 'Cisco networking', 'VLANs', 'DHCP', 'STP', 'EtherChannel', 'Port security', 'SSH', 'TCP/IP', 'Customer issue resolution'] },
  { group: 'Work', note: 'How I work', icon: 'people',
    items: ['Problem solving', 'Attention to detail', 'Communication', 'Teamwork', 'Leadership', 'Deadlines'] },
];
export const skillsAlso = 'Also: Microsoft Office, Adobe Photoshop, WordPress (learning)';

// ---- About (Klang) ------------------------------------------
export const about = {
  title: 'Teo Wan Yin',
  // three short lines, each with an icon: code | store | people
  lines: [
    { icon: 'code', text: 'IT student who builds web apps and troubleshoots what breaks.' },
    { icon: 'store', text: 'Ran a Shopee store: listings, customer issues, disputes, returns.' },
    { icon: 'people', text: 'Leads group projects and keeps work on schedule.' },
  ],
  interests: ['Software Engineering', 'Web Development', 'IT Support'],
  facts: ['Klang, Selangor', 'Grad Jan 2028', 'English · 中文 · Malay'],
  // full story, shown behind "Read more"
  story: [
    'I am an Information Technology student with hands-on experience in web development and a strong interest in software engineering and IT support. I have experience building websites from scratch using HTML and CSS, alongside skills in Python, PHP, React, TypeScript, and JavaScript to develop dynamic and functional applications. Through my projects, I have strengthened my problem-solving abilities, attention to detail, and understanding of responsive interface design and backend development.',
    'Beyond software development, I gained practical e-commerce operations experience managing a Shopee store, including product uploads, customer inquiries, dispute resolution, and returns. This experience enhanced my ability to work with digital platforms, troubleshoot issues, communicate effectively, and manage tasks within deadlines.',
    'I have also taken on leadership roles in group projects, coordinating tasks, supporting team members, and ensuring work is completed on schedule. These experiences have strengthened my teamwork, organizational, and communication skills.',
    'I am eager to learn new technologies, expand my technical knowledge, and take on new challenges. I am particularly interested in opportunities in Software Engineering, Web Development, and IT Support, where I can apply my existing skills, develop new capabilities, and contribute to practical solutions while gaining valuable industry experience.',
  ],
  portrait: 'portrait.webp',
};

// ---- Contact -----------------------------------------------
export const contact = {
  title: "Let's build something together.",
  line: 'Open to Software Engineer and IT Support internships.',
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
  { id: 'achievements', label: 'Achievements', subtitle: 'Passport stamps', zone: 'sunway', progress: 0.58, map: { x: 500, y: 820 }, camera: 440 },
  { id: 'skills', label: 'Skills', subtitle: 'In my luggage', zone: 'sunway', progress: 0.68, map: { x: 470, y: 900 }, camera: 480 },
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
  title: 'Teo Wan Yin | IT Student & Web Developer',
  description:
    'Portfolio of Teo Wan Yin, IT student at Sunway University (CGPA 3.73, Dean\'s List): web apps in PHP, MySQL and React, Cisco networking, and a resume to download.',
  url: 'https://TODO.vercel.app', // TODO
};
