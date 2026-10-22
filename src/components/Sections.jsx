import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Effects";
import { magnetic, tilt } from "../hooks/motion";
import StrengthsBeam from "./StrengthsBeam";
import GenText from "./GenText";
import Snapshot from "./Snapshot";
import ProjectStack from "./ProjectStack";
import { brand } from "../icons";

const Chips = ({ items }) =>
  items?.length ? <div className="chips">{items.map(i => <span key={i}>{i}</span>)}</div> : null;

function Head({ n, tag, children }) {
  return (
    <>
      <Reveal className="s-tag">{n} — {tag}</Reveal>
      <Reveal as="h2" className="s-title">{children}</Reveal>
    </>
  );
}

function Section({ id, className, children }) {
  return <section id={id} className={className}><div className="section-inner">{children}</div></section>;
}

/* ── ABOUT ── */
export function About({ data }) {
  const { lead, body, facts, cta } = data.about;
  return (
    <Section id="about" className="about">
      <Head n="01" tag="About">I'm <em>{data.name}</em>.</Head>
      <div className="about-main">
        <Reveal as="p" className="about-lead" delay={0.1}>{lead}</Reveal>
        <Reveal as="p" className="about-body" delay={0.2}>{body}</Reveal>
        <Reveal as="dl" className="about-facts" delay={0.3}>
          {facts.map(f => (
            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
          ))}
        </Reveal>
        <Reveal delay={0.4}>
          <a className="btn-hire magnetic about-cta" href={cta.href} {...magnetic}>{cta.label} <span className="btn-hire-arrow">→</span></a>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── STRENGTHS (card beam) ── */
export function Strengths({ data }) {
  return (
    <section id="strengths" className="strengths">
      <div className="section-inner">
        <Head n="02" tag="Strengths">What I'm <em>Good At</em></Head>
      </div>
      <Reveal variant="s"><StrengthsBeam items={data.strengths} /></Reveal>
      <div className="section-inner strengths-bottom">
        <GenText prompt={data.strengthsIntro.prompt} answer={data.strengthsIntro.answer} name={data.name} />
        <Snapshot stats={data.snapshot.stats} now={data.snapshot.now} />
      </div>
    </section>
  );
}

/* ── EXPERIENCE / EDUCATION ── */
function ExpCard({ e, i }) {
  return (
    <Reveal as="article" className="exp-card card-3d" delay={i * 0.1} {...tilt}>
      <div className="exp-num">{String(i + 1).padStart(2, "0")}</div>
      <div className="exp-period">{e.period}</div>
      <h3 className="exp-role">{e.role}</h3>
      <div className="exp-org">{e.org} <span>· {e.place}</span></div>
      <ul className="exp-desc">{e.points.map(p => <li key={p}>{p}</li>)}</ul>
      <Chips items={e.stack} />
    </Reveal>
  );
}

/* Vertical timeline: a rail fills as you scroll, each role shows a summary and slides open on hover (tap on touch). */
export function Experience({ data }) {
  const list = useRef(null);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    const el = list.current;
    const onScroll = () => {
      const line = innerHeight * 0.6; // the point on screen the rail "fills" to
      const r = el.getBoundingClientRect();
      el.style.setProperty("--p", Math.min(1, Math.max(0, (line - r.top) / r.height)));
      el.querySelectorAll(".xp-item").forEach(li => li.classList.toggle("passed", li.getBoundingClientRect().top + 40 < line));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section id="experience">
      <Head n="03" tag="Experience">Where I've <em>Worked</em></Head>
      <div className="xp" ref={list}>
        <div className="xp-rail" aria-hidden="true"><div className="xp-fill" /></div>
        <ol className="xp-list">
        {data.experience.map((e, i) => (
          <Reveal as="li" variant="l" key={i} delay={i * 0.12} tabIndex={0}
                  className="xp-item" data-open={open === i}
                  onClick={() => setOpen(o => (o === i ? -1 : i))}>
            <span className="xp-dot" />
            <div className="xp-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="xp-main">
              <div className="xp-top">
                <h3 className="xp-role">{e.role}</h3>
                <span className="xp-period">{e.period}</span>
              </div>
              <div className="xp-org">{e.org} <span>· {e.place}</span></div>
              <p className="xp-summary">{e.summary}</p>
              <div className="xp-more">
                <div>
                  <ul className="exp-desc">{e.points.map(p => <li key={p}>{p}</li>)}</ul>
                  <Chips items={e.stack} />
                </div>
              </div>
            </div>
            <span className="xp-arrow" aria-hidden="true">↓</span>
          </Reveal>
        ))}
        </ol>
      </div>
    </Section>
  );
}

export function Education({ data }) {
  return (
    <Section id="education">
      <Head n="05" tag="Academics">My <em>Education</em></Head>
      <div className="exp-grid">{data.education.map((e, i) => <ExpCard key={i} e={e} i={i} />)}</div>
    </Section>
  );
}

/* ── PROJECTS ── */
export function Projects({ data }) {
  return (
    <Section id="projects">
      <Head n="04" tag="Projects">Things I've <em>Built</em></Head>
      <Reveal><ProjectStack projects={data.projects} logo={data.logo} /></Reveal>
    </Section>
  );
}

/* ── SKILLS ── */
/* Endless logo marquee: every skill in its brand colour. The list is rendered twice so the track loops seamlessly; hover pauses it. */
export function Skills({ data }) {
  const items = data.skills.flatMap(g => g.items);
  return (
    <section id="skills" className="skills">
      <div className="section-inner">
        <Head n="06" tag="Arsenal">Technical <em>Skills</em></Head>
      </div>
      <Reveal className="skill-marquee">
        <ul className="skill-track">
          {[...items, ...items].map((name, i) => {
            const { path, color } = brand(name);
            return (
              <li key={i} className="skill-item" style={{ color }} aria-hidden={i >= items.length || undefined}>
                {path && <svg viewBox="0 0 24 24" aria-hidden="true"><path d={path} fill="currentColor" /></svg>}
                <span>{name}</span>
                <span className="skill-star" aria-hidden="true">✶</span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

/* ── JOURNEY ── */
export function Journey({ data }) {
  const timeline = (
    <ol className="timeline">
      {data.timeline.map((t, i) => (
        <Reveal as="li" variant="l" key={i} delay={i * 0.08}>
          <span className="tl-year">{t.year}</span>
          <div><h4>{t.title}</h4><p>{t.desc}</p></div>
        </Reveal>
      ))}
    </ol>
  );
  return (
    <Section id="timeline">
      <Head n="07" tag="Journey">The <em>Story</em> So Far</Head>
      {timeline}
    </Section>
  );
}

/* ── CONTACT ── */
export function Contact({ data }) {
  const submit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = `[${f.get("type")}] from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`;
    location.href = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <Section id="contact" className="contact">
      <Reveal className="s-tag">10 — Contact</Reveal>
      <Reveal as="h2" className="contact-title">Let's Build <em>Something</em></Reveal>
      <div className="contact-grid">
        <Reveal variant="l">
          <p className="contact-lead">{data.contactLead}</p>
          <div className="contact-links">
            {data.socials.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener"><span>{s.label}</span><span>↗</span></a>
            ))}
          </div>
          <blockquote className="quote">“Talk is cheap. Show me the code.”<cite>— Linus Torvalds</cite></blockquote>
        </Reveal>
        <Reveal as="form" className="contact-form" onSubmit={submit} delay={0.15}>
          <label>Name<input name="name" required placeholder="Your name" /></label>
          <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
          <label>Type
            <select name="type">
              <option>Job / Role Opportunity</option>
              <option>Full-time Internship</option>
              <option>Part-time / Freelance</option>
              <option>Research Collaboration</option>
              <option>Open Source</option>
              <option>Just saying hi</option>
            </select>
          </label>
          <label>Message<textarea name="message" rows="5" required placeholder="Tell me a little about it…" /></label>
          <button className="btn-hire magnetic" type="submit" {...magnetic}>Let's Chat <span className="btn-hire-arrow">→</span></button>
        </Reveal>
      </div>
    </Section>
  );
}
