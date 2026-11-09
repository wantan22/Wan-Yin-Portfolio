# Teo Wan Yin · Flight Portfolio

A scroll-driven portfolio told as one flight: take off at **Subang**, zoom into **Sunway City** (projects, hackathons, achievements, skills), then fly home to **Klang** (about, resume, contact). A plain **fast lane** version shows the same content without animation.

Built with React 18, Vite 5, GSAP (ScrollTrigger + ScrollToPlugin) and inline SVG line art.

---

## 1. Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production files in /dist
npm run preview   # serve /dist locally to check the build
```

Needs Node 18 or newer.

---

## 2. Edit your content (one file)

Everything lives in **`src/content.js`**. Both the flight and the fast lane read from it, so you edit once. Search for `TODO` to find placeholders.

| What | Where in `content.js` |
|---|---|
| Name, headline, course, hometown | `person` |
| Email, GitHub, LinkedIn | `socials` |
| Projects (newest first) | `projects`: `about`, `features`, `built`, `ai`, `fixed`, `tech`, links (`live`, `video`, `code`) and `images` (screenshots in `public/img`). Each one points at a Sunway `landmark` |
| Smaller projects list | `moreProjects` |
| Hackathons | `hackathons` (newest first) and `hackathonsMore` (the "more coming" line) |
| Awards and certificates | `achievements` (`icon`: trophy, medal, certificate, star, flag; `certs`: certificate images in `public/img/certs`), `certificatesPdf` |
| Skills | `skills` (one suitcase per group: Frontend, Backend, Database, Soft skills) and `skillsAlso` (short lines underneath) |
| Klang story, quick facts, local touches, photo | `about` |
| Contact form service, closing line | `contact` |
| Resume file, summary, extra documents | `resume` |
| Stops, map positions, zoom | `stops`, `landmarks`, `transit` |
| Boarding-pass codes | `landmarks[].code`, `flight` |
| Site title and description | `site` (also update `index.html`, see section 5) |

**Adding a project:** add an item to `projects` and point `landmark` at one of the `landmarks`. To add a new place on the map, add a landmark (id, code, label, map x/y, camera) and, optionally, a drawing for it in `src/flight/MapArt.jsx` with `className="lm" data-lm="<landmark id>"` so it sketches itself in.

**Photos:** the portrait is `public/portrait.webp`; project screenshots live in `public/img/`. Swap the files (same names) or point `about.portrait` / `projects[].image` at new ones.

---

## 3. Replace the resume

1. Save your CV as **`public/resume.pdf`** (keep this exact name).
2. In `src/content.js`, update **`resume.lastUpdated`** (for example `'December 2026'`).
3. Optional: change **`resume.downloadName`**, the file name recruiters get when they download.
4. Optional extra documents (for example a transcript): put the PDF in `/public` and list it in `resume.documents`, for example `{ label: 'Academic transcript', file: 'transcript.pdf' }`.

**Adding a certificate:** save a picture of it (JPG, PNG or WebP) in `public/img/certs/`, then add it to that achievement's `certs` list in `content.js`, for example `{ src: 'img/certs/new-cert.webp', label: 'Nov 2026' }`. It shows when someone opens that stamp. If you keep a combined PDF, replace `public/certificates.pdf` too.

The download button is always a plain link to `/resume.pdf`, so it works even if the animation or the viewer fails. The deploy configs tell browsers not to cache the PDF for long, so a new upload shows up straight away.

---

## 4. Contact form

1. Create a free form at **formspree.io** and copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. Paste it into **`contact.formEndpoint`** in `content.js`.

Until then, "Send message" opens the visitor's email app with the message filled in, and the plain email link and a Copy button are always shown.

---

## 5. Deploy

### Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com: **Add New Project**, pick the repo. It reads `vercel.json` (build `npm run build`, output `dist`).
3. Deploy. Your site is live at `https://<project>.vercel.app`.

### Netlify
1. Push to GitHub, then **Add new site, Import an existing project** on netlify.com.
2. It reads `netlify.toml` (build `npm run build`, publish `dist`).

### After the first deploy
- The **canonical** link in `index.html` and `site.url` in `content.js` are set to `https://wan-yin-portfolio.vercel.app`. If your Vercel address is different, change both.
- Check the share preview at opengraph.xyz (uses `public/og-image.jpg`).

Both configs cache the built assets for a year (their file names change on every build) and keep `resume.pdf` fresh.

---

## 6. How it works (for future edits)

- **Opening:** the first visit in a browser session starts on a line-art globe. The plane makes one lap, Malaysia outlines itself, then one smooth zoom lands at Subang. "Skip intro" (or Esc) jumps straight in. It never plays with reduced motion or on a deep link. Code: `src/flight/Intro.jsx` (globe data from `world-atlas`, drawn with `d3-geo`).
- **Three page styles:**
  - **Home:** the words sit in a calm zone on the left (top on phones) and the Subang Airport art and a large plane fill the rest of the screen.
  - **Projects (Layout C):** headline on top, projects as tickets in a sideways row, the map as a sharp strip along the bottom. Browsing the tickets (← →, arrow buttons, swipe) flies the plane to each project's landmark. Opening one shows its boarding pass.
  - **Every other page:** a card on the blurred map, plane in the centre.
- **Up / down = fly to the next page** (scroll, swipe, ↑ ↓, the header, or the Next button). One gesture = one page, extra scrolling during a flight is ignored.
- **Skipping ahead is calm:** if a flight would pass over other stops (for example Projects to Stamps), the plane flies one straight line there in 1.5 to 2.5 s with a gentle ease, and the zoom follows one smooth curve. A key press or header click mid-flight redirects it smoothly.
- **No scrolling inside details:** a project's boarding pass shows everything at once when it fits (two columns on desktop). On smaller screens it splits into 2 or 3 short steps with Back / Next. Stamps open the passport on that stamp, one stamp per page with Back / Next.
- **Deep links:** `/#projects`, `/#about`, `/#project-snapstock` and so on open at that page. Back and Forward fly between pages.
- **Fast lane:** loads automatically for visitors with reduced motion, data saver or a very weak device. It uses the same gate components, stacked. "Skip the flight" and "Take the flight" switch modes, and the choice is remembered.

### Main files
| File | Purpose |
|---|---|
| `src/content.js` | All content and stops |
| `src/App.jsx` | Theme, mode switch (flight or fast lane) |
| `src/components/Sections.jsx` | Gate screens shared by both modes: the sideways `Rail`, tickets, boarding pass, passport, story and form sheets |
| `src/components/FastLane.jsx` | The plain page |
| `src/flight/FlightView.jsx` | Flight layout and the page-by-page engine; time-of-day colours in `SKY` |
| `src/flight/Intro.jsx` | The globe opening |
| `src/flight/MapArt.jsx` | The outline map drawing |
| `src/flight/Sky.jsx` | Sun, moon, stars and clouds (`cloudSpecs`) |
| `src/flight/geometry.js` | Curve and path helpers |
| `src/styles/tokens.css` | Colour variables for light and dark |
| `src/styles/fastlane.css` | Shared component styles and micro-interactions |
| `src/flight/flight.css` | Flight-only styles and animations |

---

## 7. Illustration assets

Everything is hand-written inline SVG, outline only (no image files except the share image), so it recolours with the theme and stays sharp when zooming.

| Asset | File | Notes / how to customise |
|---|---|---|
| Subang Airport (runway, terminal, tower) | `MapArt.jsx` | Rotated group near the top |
| Highways, Klang River, coastline, hills | `MapArt.jsx` | Region group, always visible |
| Sunway University, Pyramid, BRT line, Lagoon + volcano, Medical Centre | `MapArt.jsx` | `lm` groups; sketch in as the plane approaches |
| Passport control booth, baggage carousel | `MapArt.jsx` | `lm` groups for Achievements and Skills |
| Klang palace dome, clock tower, Kota bridge, shophouses, home | `MapArt.jsx` | `lm` groups for About, Resume, Contact |
| Night city lights (runway, windows, lamps) | `MapArt.jsx` | `.ma-lights`, dark mode only |
| Plane (top-down outline) | `FlightView.jsx` | Inside `.plane` |
| Sun, crescent moon, stars, 3 cloud shapes | `Sky.jsx` | Clouds: edit `CLOUDS` and `cloudSpecs` |
| Stamp frames (rounded, oval, ticket) | `Sections.jsx` | `StampFrame` |
| Suitcase, handle, luggage tag, string | `Sections.jsx` | `SkillList` |
| Boarding-pass barcode | `Sections.jsx` | Line list in `BoardingPass` and the final pass |
| Line icons (plane, download, document, folder, sun, moon, mail, GitHub, LinkedIn, passport, bowl, pin, home, stamp icons) | `Icons.jsx` | 24px outline icons |
| Line-art avatar | `Icons.jsx` | Shown until `about.portrait` is set |
| Favicon | `public/favicon.svg` | |
| Share image (1200 x 630) | `public/og-image.jpg` | Replace with your own if you like |

**Photos and screenshots:** `public/portrait.webp`, `public/img/snapstock.webp`, `public/img/desert-club.webp` (a Chinese SnapStock screenshot, `snapstock-zh.webp`, is included but unused).

**Tip:** the two resume PDFs are about 4 MB each because they embed the Segoe UI Emoji font (for the 📞 ✉ 📍 icons). Exporting from Word without those emoji makes them about 150 KB.

---

## 8. What was simplified, and why

- **The map is stylised, not geographic.** Places are roughly where locals expect (Subang north, Sunway middle, Klang south-west) but distances are squeezed so the trip fits the scroll.
- **Landmarks are simple outlines** (a few lines each) to keep the line art clean and the page fast.
- **The travelled path is redrawn as a growing line** instead of an SVG mask. The mask looked the same but cost about a third of the frame budget on phones.
- **Map labels and the progress rail are mouse/touch shortcuts only.** Keyboard and screen-reader users get the same destinations from the header, so the tab order stays short.
- **On phones the resume opens in a new tab** rather than an in-page viewer, because embedded PDFs are unreliable on mobile browsers.
- **The fast lane is the default for reduced motion, data saver or very weak devices** rather than a slimmed-down animation.
- **Fonts load without blocking the first paint** (page shows in system fonts for a moment, then swaps).

---

## 9. Quality checks done (Stage 7)

- **Accessibility:** axe-core audit (WCAG 2.1 AA + best practice) on both modes in light and dark: **0 issues**. Lighthouse accessibility **100**.
- **Contrast:** accent colours darkened to pass AA (indigo `#4f5bd5`, Klang terracotta `#ad5442`).
- **Keyboard:** skip link, then header in order, visible focus rings, Enter flies and focuses the heading, Escape closes menus and dialogs.
- **Reduced motion:** loads the fast lane; if the flight is chosen anyway, everything is shown with instant jumps.
- **Mobile:** no sideways scrolling at 320, 360, 390, 768, 1024, 1440 and 1920 px wide.
- **Lighthouse (mobile):** Performance 91 to 94, Best practices 100, SEO 100, first paint about 0.8 s, page weight about 150 KB.
