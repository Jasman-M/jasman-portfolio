import Image from "next/image";
import Magnetic from "@/components/Magnetic";
import RandomWalks from "@/components/RandomWalks";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import VideoCard from "@/components/VideoCard";
import {
  about,
  caseComps,
  casePhotos,
  contact,
  education,
  experience,
  ironman,
  profile,
  projects,
  skills,
} from "@/data/content";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const pad = (n: number) => String(n).padStart(2, "0");
const [firstName, lastName] = profile.name.split(" ");

/* ---------------- Icons (stroke, currentColor) ---------------- */

function Icon({ children, size = 14 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ArrowUpRight = () => (
  <Icon>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Icon>
);

const ArrowUp = () => (
  <Icon>
    <path d="M12 19V5" />
    <path d="M6 11l6-6 6 6" />
  </Icon>
);

const socials = [
  {
    label: "LinkedIn",
    href: profile.linkedin,
    icon: (
      <Icon size={20}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </Icon>
    ),
  },
  {
    label: "GitHub",
    href: profile.github,
    icon: (
      <Icon size={20}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </Icon>
    ),
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: (
      <Icon size={20}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 6l-10 7L2 6" />
      </Icon>
    ),
  },
];

function Label({ children }: { children: string }) {
  return (
    <p className="label">
      <span aria-hidden="true">{"// "}</span>
      {children}
    </p>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="tag">
      <span className="tagDot" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function Home() {
  const rows = [
    ...experience.map((e) => ({ title: e.role, org: e.org, place: e.place, date: e.date })),
    {
      title: education.degreeShort,
      org: education.school,
      place: education.place,
      date: education.date,
    },
  ];

  return (
    <>
      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="hero" id="top">
          <Image
            className="heroPortrait"
            src={profile.headshot}
            alt={`Portrait of ${profile.name}.`}
            width={1356}
            height={1195}
            sizes="(max-width: 640px) 170vw, 1100px"
            loading="eager"
            fetchPriority="high"
          />

          <nav className="heroNav" aria-label="Primary">
            <a href="#top" className="heroBrand">
              © {profile.name}
              <span className="heroBrandPlace"> — {profile.location}</span>
            </a>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </nav>

          <h1 className="heroName">
            <span>{firstName}</span> <span>{lastName}</span>
          </h1>

          <p className="heroStudies">
            {profile.studies[0]}
            <br />
            {profile.studies[1]}
          </p>

          <ul className="heroSocial" aria-label="Social links">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? external : {})}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- About ---------------- */}
        <section className="intro" id="about">
          <div className="introGhost" aria-hidden="true">
            {profile.name}
          </div>
          <div className="shell shellNarrow introInner">
            <Reveal>
              <Label>About me</Label>
              <h2 className="introTitle">
                {about.lead} <span className="accent">{about.accent}</span>
              </h2>
            </Reveal>
            <div className="introGrid">
              <Reveal>
                <p className="mono dim small">(The full distance)</p>
                <dl className="ironman">
                  {ironman.map((l) => (
                    <div key={l.leg}>
                      <dt>{l.leg}</dt>
                      <dd>
                        {l.value}
                        <span className="ironmanUnit"> {l.unit}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal className="introCopy" delay={80}>
                <p>{about.body}</p>
                <ul className="chips" aria-label="Hobbies">
                  {about.hobbies.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <Magnetic>
                  <a className="pill" href="#contact">
                    Say hello
                  </a>
                </Magnetic>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- Latest work ---------------- */}
        <section className="work" id="work">
          <div className="shell">
            <Reveal className="centerHead">
              <Tag>Projects</Tag>
              <h2 className="h2">Latest Work</h2>
            </Reveal>

            <div className="workGrid">
              {projects.map((p, i) => (
                <Reveal as="article" key={p.name} delay={i * 80} className="workCard">
                  <div className={p.video ? "workMedia workMediaVideo" : "workMedia"}>
                    {p.video && p.poster ? (
                      <VideoCard
                        src={p.video}
                        poster={p.poster}
                        title={p.name}
                        kind={p.kind}
                        meta={p.meta}
                      />
                    ) : (
                      <>
                        <RandomWalks />
                        <span className="mono mediaLabel mediaLabelLeft">({p.kind})</span>
                        <span className="mono mediaLabel mediaLabelRight">{p.meta}</span>
                      </>
                    )}
                  </div>
                  <div className="workHead">
                    <h3 className="workTitle">{p.name}</h3>
                    <div className="workLinks">
                      {p.links.map((l) => (
                        <a key={l.label} href={l.href} {...external}>
                          {l.label} <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  </div>
                  <p className="workText">
                    {p.blurb} {p.highlight && <Rich text={p.highlight} />}
                  </p>
                </Reveal>
              ))}
            </div>

            <p className="more">
              <span className="dim">Check out more</span>
              <a href={profile.github} {...external}>
                <span className="moreRule" aria-hidden="true" />
                View GitHub
              </a>
            </p>
          </div>
        </section>

        {/* ---------------- Case competitions ---------------- */}
        <section className="section" id="cases">
          <div className="shell">
            <Reveal className="splitHead">
              <div>
                <Label>Case competitions</Label>
                <h2 className="h2">Recognition</h2>
              </div>
              <p className="caption">
                Projected/modeled figures from case competition analysis, not realized
                business outcomes.
              </p>
            </Reveal>

            <Reveal className="photoStrip">
              {casePhotos.map((img) => (
                <figure className="photo" key={img.src}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 720px) 80vw, 33vw"
                    className="photoImg"
                  />
                </figure>
              ))}
            </Reveal>

            <Reveal>
              <table className="caseTable">
                <thead>
                  <tr>
                    <th scope="col">Case</th>
                    <th scope="col">Competition</th>
                    <th scope="col">Result</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="caseNo">
                      No.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {caseComps.map((c, i) => (
                    <tr key={c.id}>
                      <th scope="row" className="caseName">
                        <span className="caseTitle">{c.title}</span>
                        <span className="caseSub">{c.subtitle}</span>
                      </th>
                      <td className="caseComp">{c.competition}</td>
                      <td className="caseResult">
                        {c.placement ? (
                          <>
                            <span className={c.placement.startsWith("1st") ? "accent" : undefined}>
                              {c.placement}
                            </span>
                            {c.prize && ` · ${c.prize.replace(/ Prize$/, "")}`}
                          </>
                        ) : (
                          c.headline
                        )}
                      </td>
                      <td className="caseDate">{c.date}</td>
                      <td className="caseNo mono">{pad(i + 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Skills ---------------- */}
        <section className="section" id="skills">
          <div className="shell">
            <Reveal>
              <Label>Skills</Label>
            </Reveal>
            <div className="skills">
              {skills.map((s, i) => (
                <Reveal key={s.group} className="skill">
                  <div className="skillNum" aria-hidden="true">
                    {pad(i + 1)}
                  </div>
                  <div>
                    <h3 className="skillTitle">{s.group}</h3>
                    <ol className="skillList">
                      {s.items.map((it, j) => (
                        <li key={it}>
                          <span>{it}</span>
                          <span className="mono dim" aria-hidden="true">
                            {pad(j + 1)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Experience ---------------- */}
        <section className="section sectionLast" id="experience">
          <div className="shell">
            <Reveal>
              <Label>Experience &amp; education</Label>
            </Reveal>
            <ol className="expRows">
              {rows.map((r, i) => (
                <Reveal as="li" key={`${r.title}-${r.org}`} delay={i * 50} className="expRow">
                  <span className="expTitle">{r.title}</span>
                  <span className="expOrg">{r.org}</span>
                  <span className="expPlace">{r.place}</span>
                  <span className="expDate mono">{r.date}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Contact ---------------- */}
        <section className="cta" id="contact">
          <Reveal className="ctaInner">
            <span className="tag tagLight">
              <span className="tagDot" aria-hidden="true" />
              Contact
            </span>
            <h2 className="ctaTitle">{contact.title}</h2>
            <p className="ctaBody">{contact.body}</p>
            <Magnetic>
              <a className="pillInk" href={`mailto:${profile.email}`}>
                Email me <ArrowUpRight />
              </a>
            </Magnetic>
          </Reveal>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="shell">
          <div className="footerTop">
            <nav className="footerNav" aria-label="Footer">
              <a href="#top" className="footerNavHome">
                Home
              </a>
              <a href="#about">About</a>
              <a href="#work">Work</a>
              <a href="#cases">Case comps</a>
              <a href="#experience">Experience</a>
            </nav>
            <a className="footerMail" href={`mailto:${profile.email}`}>
              {profile.email.toLowerCase()}
            </a>
          </div>
          <div className="footerBottom">
            <span className="dim">
              © {new Date().getFullYear()} {profile.name} · {profile.location}
            </span>
            <div className="footerLinks">
              <a href={profile.linkedin} {...external}>
                LinkedIn <ArrowUpRight />
              </a>
              <a href={profile.github} {...external}>
                GitHub <ArrowUpRight />
              </a>
              <a href={profile.resume} {...external}>
                Resume <ArrowUpRight />
              </a>
              <a href="#top" className="dim">
                Back to top <ArrowUp />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
