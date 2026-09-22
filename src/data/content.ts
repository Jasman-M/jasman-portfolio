/**
 * Single source of truth for every piece of copy on the page.
 * Resume wording is reproduced as written. `**...**` marks a quantitative
 * figure that should render bold — see <Rich /> in components/Rich.tsx.
 */

export const profile = {
  name: "Jasman Mander",
  description:
    "Financial Mathematics & Business student at Wilfrid Laurier University, based in Toronto.",
  /** Hero tagline, one entry per line. */
  studies: ["Financial Mathematics", "& Business, Laurier"],
  location: "Toronto, ON",
  email: "Jasmander789@gmail.com",
  linkedin: "https://www.linkedin.com/in/Jasman-M",
  github: "https://github.com/Jasman-M",
  resume: "/resume/J_Mander_Business_Resume.pdf",
  headshot: "/images/portrait-cutout.png",
};

export const about = {
  lead: "Off the clock,",
  accent: "I like to keep moving.",
  body: "Based in Toronto, ON. Right now that mostly means endurance training — I’m working toward an Ironman. I also played soccer and volleyball, and when I’m not moving, I’m probably playing Clash of Clans.",
  hobbies: ["Endurance training", "Soccer", "Volleyball", "Clash of Clans"],
  photo: {
    src: "/images/before-a-run.jpg",
    alt: "Jasman Mander and a friend holding race bibs 067 and 009 in a parking lot before a run.",
    caption: "Bib 067, before a run",
  },
};

export const contact = {
  title: "Got an Idea? Let’s Talk.",
  body: "Always up for a conversation — case competitions, projects or a good run.",
};

export type CaseComp = {
  id: string;
  title: string;
  subtitle: string;
  placement: string | null;
  prize: string | null;
  /** Shown in the results table when there's no placement to report. */
  headline?: string;
  competition: string;
  org: string | null;
  date: string;
  place: string;
  bullets: string[];
  images: { src: string; alt: string }[];
};

export const caseComps: CaseComp[] = [
  {
    id: "techhawk",
    title: "TechHawk",
    subtitle: "Supply Chain & HQ Strategy",
    placement: "2nd Place",
    prize: "$300 Prize",
    competition: "LEC × LSCA Supply Chain Case Competition",
    org: null,
    date: "Feb 2026",
    place: "Waterloo, ON",
    bullets: [
      "Developed a tariff mitigation and FX hedging strategy for a Canadian e-waste startup within a **$75,000** budget",
      "Modeled a carbon reduction plan estimating **90%** lower emissions and identified key market opportunities",
    ],
    images: [
      {
        src: "/images/techhawk-2.jpg",
        alt: "Jasman Mander and his three teammates holding LSCA × LEC certificates in front of a Laurier banner.",
      },
      {
        src: "/images/techhawk-1.jpg",
        alt: "The TechHawk team presenting on stage, with the slide ‘Vancouver, BC: The Support TechHawk Needs’ projected behind them.",
      },
      {
        src: "/images/techhawk-3.jpg",
        alt: "Group photo of all LSCA × LEC Supply Chain Case Competition participants on stage.",
      },
    ],
  },
  {
    id: "canada-basketball",
    title: "Canada Basketball",
    subtitle: "Digital Fan Engagement Campaign",
    placement: "1st Place",
    prize: "$500 Prize",
    competition: "LazCup Marketing Case Competition",
    org: "Laurier Marketing Association",
    date: "Jan 2026",
    place: "Waterloo, ON",
    bullets: [
      "Developed a go-to-market strategy to grow active membership on Canada Basketball’s UNIFY+ platform",
      "Led feasibility analysis modeling user acquisition scenarios projecting a **70%** registration-to-conversion",
    ],
    images: [
      {
        src: "/images/lazcup-1.jpg",
        alt: "The LazCup 2026 award ceremony at the Laurier Marketing Association, teams on stage holding certificates.",
      },
    ],
  },
  {
    id: "sun-life",
    title: "Sun Life Financial",
    subtitle: "Life Insurance Market Entry Strategy",
    placement: null,
    prize: null,
    headline: "$47.7M modelled pilot profit",
    competition: "LazCup Marketing Case Competition",
    org: "Laurier Marketing Association",
    date: "Jan 2026",
    place: "Waterloo, ON",
    bullets: [
      "Built a financial model estimating **$47.7M** projected pilot profit across a **30,000**-household scenario",
      "Designed a go-to-market strategy modeling profit-per-prospect improvement from **$900** to **$1,791**",
    ],
    images: [],
  },
];

/** The three photos in the case competition strip, in display order. */
export const casePhotos = [caseComps[0].images[0], caseComps[1].images[0], caseComps[0].images[1]];

export type Project = {
  name: string;
  /** Card labels: the kind of work (bottom-left) and a detail (bottom-right). */
  kind: string;
  meta: string;
  blurb: string;
  /** Optional closing sentence; `**...**` renders bold. */
  highlight: string | null;
  links: { label: string; href: string }[];
  video: string | null;
  poster: string | null;
};

export const projects: Project[] = [
  {
    name: "Gambler’s Ruin",
    kind: "Research report",
    meta: "Monte Carlo · Bootstrap",
    blurb:
      "The simple random walk with two absorbing barriers — exact results derived three independent ways, then pointed at S&P 500 returns since 1990.",
    highlight: "Bootstrapping real returns raised modelled ruin from **5%** to **40%**.",
    links: [
      { label: "Report (PDF)", href: "/reports/gamblers-ruin.pdf" },
      { label: "GitHub", href: "https://github.com/Jasman-M/Gamblers-Ruin-Report" },
    ],
    video: null,
    poster: null,
  },
  {
    name: "ARIA",
    kind: "Launch video",
    meta: "0:38",
    blurb:
      "An insurance underwriting copilot for life & health, home & property, and commercial & business lines: structured risk intake, tier recommendation, and a generated underwriting worksheet.",
    highlight: null,
    links: [{ label: "GitHub", href: "https://github.com/Jasman-M/ARIA" }],
    video: "/video/aria-launch.mp4",
    poster: "/images/aria-poster.png",
  },
];

export const experience = [
  {
    role: "Economics Research Assistant",
    org: "Laurier Economics Club",
    date: "Apr 2026 — Present",
    place: "Waterloo, ON",
    bullets: [
      "Researching macroeconomic policy and fiscal impacts on Canadian markets for the LEC Flagship Report",
      "Publishing structured written analysis for a university-wide audience",
    ],
  },
  {
    role: "Mathematics Tutor",
    org: "Tutorax",
    date: "Apr 2026 — Sept 2026",
    place: "Remote",
    bullets: [
      "Delivering university-level math instruction",
      "Diagnosing knowledge gaps",
      "Building targeted lesson plans",
      "Maintaining client relationships through progress tracking",
    ],
  },
  {
    role: "Lifeguard & Swim Instructor",
    org: "City of Brampton",
    date: "Jan 2025 — Present",
    place: "Ontario",
    bullets: [
      "Supervising concurrent aquatic sessions with real-time risk assessment and compliance protocols",
      "Delivering structured swim instruction across certification levels",
    ],
  },
];

export const skills = [
  {
    group: "Financial",
    items: [
      "Financial modelling",
      "Variance analysis",
      "Revenue projections",
      "Market research",
    ],
  },
  {
    group: "Business",
    items: [
      "Strategic planning",
      "Go-to-market strategy",
      "Competitive analysis",
      "Risk mitigation",
    ],
  },
  {
    group: "Tools / Technical",
    items: [
      "Microsoft Excel (PivotTables, financial models)",
      "PowerPoint",
      "Python (pandas, numpy)",
      "Git/GitHub",
    ],
  },
];

export const education = {
  school: "Wilfrid Laurier University",
  degree: "Financial Mathematics & Bachelor of Business Administration",
  degreeShort: "Financial Mathematics & BBA",
  date: "Sept 2025 — Present",
  place: "Waterloo, ON",
  coursework: ["Financial Accounting", "Data Analytics", "Financial Mathematics"],
  activity: "Association of Indian Students (AIS) — Events Planning Executive",
};
