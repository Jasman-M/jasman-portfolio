import { Fragment } from "react";
import Image from "next/image";
import HeroCanvas from "@/components/HeroCanvas";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import ThemeToggle from "@/components/ThemeToggle";
import {
  about,
  caseComps,
  education,
  experience,
  profile,
  projects,
  skills,
} from "@/data/content";

const links = [
  { label: "Resume", href: profile.resume, external: true },
  { label: "LinkedIn", href: profile.linkedin, external: true },
  { label: "GitHub", href: profile.github, external: true },
  { label: "Email", href: `mailto:${profile.email}` },
];

function LinkRow({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? "linkRow linkRowCompact" : "linkRow"}>
      {links.map((l) => (
        <li key={l.label}>
          <Magnetic>
            <a
              href={l.href}
              className="textLink"
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          </Magnetic>
        </li>
      ))}
    </ul>
  );
}

function SectionHead({ n, label, title }: { n: string; label: string; title: string }) {
  return (
    <Reveal>
      <p className="sectionLabel">
        <span>
          {n} / {label}
        </span>
      </p>
      <h2 className="sectionTitle">{title}</h2>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <div className="topBar">
        <div className="shell topBarInner">
          <span className="mono topBarName">{profile.name}</span>
          <ThemeToggle />
        </div>
      </div>

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="hero">
          <div className="shell heroGrid">
            <div className="heroCopy">
              <p className="mono heroKicker">{profile.location} · Wilfrid Laurier University</p>
              <h1 className="heroName">{profile.name}</h1>
              <p className="heroLine">{profile.positioning}</p>
              <LinkRow />
            </div>
            <div className="heroArt">
              <HeroCanvas />
            </div>
          </div>
        </section>

        {/* ---------------- About ---------------- */}
        <section className="section" id="about">
          <div className="shell">
            <SectionHead n="01" label="About" title="About" />
            <Reveal delay={60}>
              <div className="prose">
                {about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Case competitions ---------------- */}
        <section className="section" id="case-competitions">
          <div className="shell">
            <SectionHead n="02" label="Case Competitions" title="Case Competitions" />
            <div className="compList">
              {caseComps.map((c, i) => (
                <Reveal as="article" key={c.id} delay={i * 70} className="compCard">
                  <div className="compHead">
                    <div>
                      <h3 className="compTitle">
                        {c.title} <span className="compTitleDim">| {c.subtitle}</span>
                      </h3>
                      <p className="mono compMeta">
                        {c.competition}
                        {c.org ? `, ${c.org}` : ""} · {c.date} · {c.place}
                      </p>
                    </div>
                    {c.placement && (
                      <p className="compAward">
                        <span className="compPlace">{c.placement}</span>
                        {c.prize && <span className="compPrize">{c.prize}</span>}
                      </p>
                    )}
                  </div>

                  <ul className="bullets">
                    {c.bullets.map((b) => (
                      <li key={b}>
                        <Rich text={b} />
                      </li>
                    ))}
                  </ul>

                  {c.images.length > 0 && (
                    <div className="shots" data-count={c.images.length}>
                      {c.images.map((img) => (
                        <figure className="shot" key={img.src}>
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 720px) 100vw, 33vw"
                            className="shotImg"
                          />
                        </figure>
                      ))}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="disclaimer">
                Projected/modeled figures from case competition analysis, not realized
                business outcomes.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Projects ---------------- */}
        <section className="section" id="projects">
          <div className="shell">
            <SectionHead n="03" label="Projects" title="Projects" />
            <div className="projectList">
              {projects.map((p, i) => (
                <Reveal key={p.name} delay={i * 70}>
                  <p className="projectLine">
                    <strong className="projectName">{p.name}</strong>
                    <span className="projectDash"> — </span>
                    <span className="projectBlurb">{p.blurb}</span>{" "}
                    {p.links.map((l, j) => (
                      <Fragment key={l.label}>
                        {j > 0 && <span className="projectSep"> · </span>}
                        <Magnetic>
                          <a
                            className="textLink projectLink"
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {l.label}
                          </a>
                        </Magnetic>
                      </Fragment>
                    ))}
                  </p>

                  {p.bullets.length > 0 && (
                    <ul className="bullets projectBullets">
                      {p.bullets.map((b) => (
                        <li key={b}>
                          <Rich text={b} />
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.video && (
                    <figure className="videoWrap">
                      <video
                        className="video"
                        controls
                        preload="metadata"
                        playsInline
                        {...(p.poster ? { poster: p.poster } : {})}
                      >
                        <source src={p.video} type="video/mp4" />
                        Your browser doesn&rsquo;t support embedded video.{" "}
                        <a href={p.video}>Download the {p.name} launch video</a>.
                      </video>
                      <figcaption className="mono videoCap">{p.name} — launch video</figcaption>
                    </figure>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Experience ---------------- */}
        <section className="section" id="experience">
          <div className="shell">
            <SectionHead n="04" label="Experience" title="Experience" />
            <ol className="expList">
              {experience.map((e, i) => (
                <Reveal as="li" key={`${e.role}-${e.org}`} delay={i * 70} className="expItem">
                  <div className="expHead">
                    <h3 className="expRole">
                      {e.role} <span className="expOrg">· {e.org}</span>
                    </h3>
                    <p className="mono expMeta">
                      {e.date} · {e.place}
                    </p>
                  </div>
                  <ul className="bullets">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Skills ---------------- */}
        <section className="section" id="skills">
          <div className="shell">
            <SectionHead n="05" label="Skills" title="Skills" />
            <div className="skillGrid">
              {skills.map((s, i) => (
                <Reveal key={s.group} delay={i * 70} className="skillCol">
                  <h3 className="mono skillGroup">{s.group}</h3>
                  <ul className="skillItems">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Education ---------------- */}
        <section className="section" id="education">
          <div className="shell">
            <SectionHead n="06" label="Education" title="Education" />
            <Reveal>
              <div className="eduCard">
                <div className="expHead">
                  <h3 className="expRole">{education.school}</h3>
                  <p className="mono expMeta">
                    {education.date} · {education.place}
                  </p>
                </div>
                <p className="eduDegree">{education.degree}</p>
                <dl className="eduMeta">
                  <div>
                    <dt className="mono">Relevant coursework</dt>
                    <dd>{education.coursework.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="mono">Activity</dt>
                    <dd>{education.activity}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="section footer" id="contact">
        <div className="shell">
          <Reveal>
            <p className="sectionLabel">
              <span>07 / Contact</span>
            </p>
            <h2 className="sectionTitle footerTitle">
              Open to fall 2026 internships in finance, fintech, and business analysis.
            </h2>
            <p className="footerMail">
              <Magnetic>
                <a className="textLink footerMailLink" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </Magnetic>
            </p>
            <LinkRow compact />
            <p className="mono footerNote">
              © {new Date().getFullYear()} {profile.name} · Built with Next.js and three.js
            </p>
          </Reveal>
        </div>
      </footer>
    </>
  );
}
