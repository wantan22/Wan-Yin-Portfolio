// Outline-only map of Subang (north), Sunway City (middle) and Klang (south-west).
// Coordinates: x 0..1000, y 0..1600. Every shape is fill="none".
// Groups:
//   .ma-region  : always visible, wide view (highways, river, airport, Klang)
//   .ma-far     : low detail that fades OUT as the camera zooms in
//   .ma-sunway  : fine Sunway detail that fades IN as the camera zooms in
//   .lm         : a project landmark; it sketches itself in as the plane approaches

const trees = (pts, r = 5) => pts.map(([x, y], i) => (
  <g key={i}><circle cx={x} cy={y} r={r} /><path d={`M${x} ${y + r}v4`} /></g>
));

export default function MapArt() {
  return (
    <>
      {/* ---------- Region ---------- */}
      <g className="ma-region">
        {/* coastline + Straits of Malacca waves */}
        <g className="ma-sky" strokeDasharray="1 7">
          <path d="M40 820 C 10 1000 60 1180 20 1340 S 30 1520 0 1600" />
        </g>
        <g className="ma-sky ma-thin">
          <path d="M-60 980 q 10 -6 20 0 t 20 0" /><path d="M-40 1180 q 10 -6 20 0 t 20 0" />
          <path d="M-70 1460 q 10 -6 20 0 t 20 0" />
        </g>

        {/* Federal Highway (Klang -> Subang/Sunway -> KL) */}
        <path className="ma-map" d="M60 1210 C 280 980 470 560 1060 360" />
        <path className="ma-map ma-thin" d="M76 1226 C 296 994 486 574 1066 376" strokeDasharray="10 8" />
        {/* KESAS-style southern highway */}
        <path className="ma-map ma-thin" d="M80 1380 C 330 1300 560 1180 1060 1080" />
        {/* LDP towards Sunway from the north */}
        <path className="ma-map ma-thin" d="M760 -40 C 720 200 690 360 660 520" />

        {/* Klang River */}
        <path className="ma-sky" d="M-40 1450 C 120 1400 170 1360 260 1350 S 420 1320 520 1360 S 760 1330 1060 1260" />

        {/* Hills, top right */}
        <g className="ma-faint">
          <path d="M820 40 q 60 -40 120 0" /><path d="M840 60 q 40 -26 80 0" /><path d="M900 160 q 50 -30 100 0" />
        </g>

        {/* ---- Subang Airport ---- */}
        <g className="ma-map" transform="rotate(-23 660 170)">
          <rect x="480" y="150" width="360" height="34" rx="17" />
          <path className="ma-thin" d="M500 167 H820" strokeDasharray="14 10" />
          <path className="ma-thin" d="M520 210 H800" />
          <path className="ma-thin" d="M560 184 v26 M700 184 v26 M780 184 v26" />
          {/* terminal */}
          <path d="M600 240 h140 v26 h-140 z M620 240 v-12 h100 v12" />
          {/* control tower */}
          <path d="M760 266 v-56 M752 210 h16 l-3 -12 h-10 z" />
          <path className="ma-thin" d="M754 222 h12 M754 236 h12" />
          {/* hangar, apron, taxiway and windsock */}
          <path d="M470 236 h84 v32 h-84 z M470 236 q42 -26 84 0" />
          <path className="ma-thin" d="M490 268 v-18 h44 v18" />
          <path className="ma-thin" d="M600 266 v14 h140 v-14" strokeDasharray="6 6" />
          <path className="ma-thin" d="M840 184 q10 40 -20 80" />
          <path d="M860 230 v-40 M860 192 l24 5 v9 l-24 5" />
        </g>

        {/* Sunway, far view: a few simple blocks */}
        <g className="ma-far ma-map">
          <rect x="560" y="500" width="70" height="40" rx="3" />
          <path d="M500 600 l26 -40 l26 40 z" />
          <ellipse cx="480" cy="690" rx="36" ry="22" className="ma-green" />
          <rect x="575" y="720" width="30" height="60" rx="3" />
          <path d="M610 600 L 680 700" strokeDasharray="6 6" />
        </g>

        {/* ---- Klang (each part sketches in when the plane lands there) ---- */}
        <g className="ma-map ma-klang lm" data-lm="about">
          {/* Istana Alam Shah style dome */}
          <path d="M150 1325 h80 v-30 h-80 z M160 1295 v-10 h60 v10 M175 1285 c0 -26 30 -26 30 0 M190 1259 v-8" />
          <path className="ma-thin" d="M164 1325 v-20 M180 1325 v-20 M200 1325 v-20 M216 1325 v-20" />
          {/* clock tower */}
          <path d="M260 1290 v-60 h20 v60 M256 1230 h28 l-14 -18 z" />
          <circle cx="270" cy="1250" r="6" className="ma-thin" />
          {/* Kota bridge over the river */}
          <path d="M220 1356 q 40 -30 80 0 M226 1350 v12 M294 1350 v12" />
        </g>
        <g className="ma-map ma-klang lm" data-lm="resume">
          {/* shophouse row */}
          <path d="M80 1420 h150 v-40 h-150 z" />
          <path className="ma-thin" d="M110 1420 v-40 M140 1420 v-40 M170 1420 v-40 M200 1420 v-40" />
          <path className="ma-thin" d="M86 1420 v-14 a 9 9 0 0 1 18 0 v14 M116 1420 v-14 a 9 9 0 0 1 18 0 v14 M146 1420 v-14 a 9 9 0 0 1 18 0 v14 M176 1420 v-14 a 9 9 0 0 1 18 0 v14 M206 1420 v-14 a 9 9 0 0 1 18 0 v14" />
        </g>
        <g className="ma-map ma-klang lm" data-lm="contact">
          {/* home, with a little garden gate and a heart-shaped window */}
          <path d="M112 1530 v-34 l28 -22 l28 22 v34 z M132 1530 v-16 h16 v16" />
          <path className="ma-thin" d="M140 1490 c-3 -4 -8 0 0 6 c8 -6 3 -10 0 -6" />
          <path className="ma-thin" d="M90 1530 h18 M90 1530 v-10 M99 1530 v-10 M172 1530 h20 M182 1530 v-10 M192 1530 v-10" />
        </g>
        <g className="ma-green">
          {trees([[300, 1300], [318, 1312], [70, 1480], [190, 1505], [205, 1520], [250, 1450]], 6)}
        </g>
      </g>

      {/* ---------- City lights: only shown at night (dark mode) ---------- */}
      <g className="ma-lights">
        {/* runway edge lights */}
        <g transform="rotate(-23 660 170)">
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={500 + i * 28} cy="146" r="1.6" />)}
          {Array.from({ length: 12 }, (_, i) => <circle key={`b${i}`} cx={500 + i * 28} cy="188" r="1.6" />)}
        </g>
        {/* Sunway windows */}
        {[[628, 743], [646, 743], [668, 743], [575, 657], [585, 671], [575, 685], [512, 552], [528, 552], [641, 597]].map(([x, y], i) => (
          <circle key={`s${i}`} cx={x} cy={y} r="1.8" />
        ))}
        {/* Klang windows and street lamps */}
        {[[172, 1316], [190, 1316], [208, 1316], [270, 1270], [95, 1400], [125, 1400], [155, 1400], [185, 1400], [215, 1400], [140, 1504]].map(([x, y], i) => (
          <circle key={`k${i}`} cx={x} cy={y} r="1.8" />
        ))}
      </g>

      {/* ---------- Sunway detail (zoom in) ---------- */}
      <g className="ma-sunway">
        {/* ring road */}
        <path className="ma-map ma-thin" d="M470 470 H700 Q730 470 730 500 V780 Q730 810 700 810 H450 Q420 810 420 780 V500 Q420 470 450 470" />
        <path className="ma-faint" d="M420 620 H730 M560 470 V810" strokeDasharray="3 6" />

        {/* Sunway University (600,520) */}
        <g className="ma-map lm" data-lm="sunway-university" transform="translate(50 215)">
          <path d="M565 540 v-30 h70 v30 z M560 510 l40 -16 l40 16" />
          <path className="ma-thin" d="M575 540 v-22 M590 540 v-22 M610 540 v-22 M625 540 v-22" />
          <path className="ma-thin" d="M645 540 v-24 h22 v24 z" />
        </g>

        {/* Sunway Pyramid (520,580) */}
        <g className="ma-map lm" data-lm="sunway-pyramid" transform="translate(0 -40)">
          <path d="M490 600 L520 556 L550 600 Z" />
          <path className="ma-thin" d="M500 586 H540 M508 574 H532" />
          <path d="M470 600 H570" />
        </g>

        {/* BRT Sunway Line (640,640) */}
        <g className="ma-map lm" data-lm="brt-walkway" transform="translate(0 -40)">
          <path d="M600 590 C 630 615 650 650 700 690" />
          <path className="ma-thin" d="M605 600 v10 M625 614 v10 M645 632 v10 M665 654 v10 M685 674 v10" />
          <rect x="628" y="630" width="26" height="14" rx="3" />
        </g>

        {/* Sunway Lagoon (480,690) */}
        <g className="lm" data-lm="sunway-lagoon">
        <g className="ma-green">
          <path d="M440 690 C 440 660 500 655 520 675 C 540 695 510 725 475 720 C 450 716 440 705 440 690 Z" />
          <path className="ma-thin" d="M458 688 q 6 -4 12 0 t 12 0 M478 702 q 6 -4 12 0 t 12 0" />
        </g>
        <g className="ma-map">
          {/* volcano */}
          <path d="M430 660 L446 630 h10 L472 660" /><path className="ma-thin" d="M448 630 q4 -8 0 -14 M454 630 q4 -10 8 -12" />
        </g>
        </g>

        {/* Sunway Medical Centre (590,750) */}
        <g className="ma-map lm" data-lm="sunway-medical" transform="translate(-10 -85)">
          <path d="M575 785 V720 H605 V785" />
          <path className="ma-thin" d="M581 735 h18 M581 748 h18 M581 761 h18 M581 774 h18" />
          <path d="M586 712 h8 v-6 h-8 z M590 702 v14" className="ma-thin" />
          <path d="M560 785 H620" />
        </g>

        {/* Passport control (achievements stop, 500,820) */}
        <g className="lm" data-lm="achievements">
          <g className="ma-map">
            <path d="M484 830 V808 H516 V830 M480 808 H520 M486 808 L490 798 H510 L514 808" />
            <path className="ma-thin" d="M492 830 V818 H508 V830" />
          </g>
          <g className="ma-stamp">
            <circle cx="530" cy="812" r="9" /><circle cx="530" cy="812" r="6" className="ma-thin" />
          </g>
        </g>

        {/* Baggage carousel + suitcase (skills stop, 470,900) */}
        <g className="lm" data-lm="skills">
          <g className="ma-map">
            <path className="ma-thin" d="M430 920 Q470 936 510 920" />
            <path className="ma-thin" d="M430 926 Q470 942 510 926" strokeDasharray="2 4" />
          </g>
          <g className="ma-path-faint">
            <rect x="456" y="892" width="28" height="20" rx="3" />
            <path d="M464 892 v-5 h12 v5 M462 902 h16" className="ma-thin" />
            <path d="M484 896 l8 -6 h6 v6 h-6 z" className="ma-thin" />
          </g>
        </g>

        {/* Trees around the lake and campus */}
        <g className="ma-green ma-thin">
          {trees([[520, 640], [534, 648], [430, 740], [446, 750], [662, 520], [676, 530], [705, 790], [470, 780]], 5)}
        </g>
      </g>
    </>
  );
}
