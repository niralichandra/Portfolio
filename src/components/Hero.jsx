import { useState } from "react";
import { magnetic, useClock, useTypewriter } from "../hooks/motion";
import WaveField from "./WaveField";
import GlassFlower from "./GlassFlower";

export default function Hero({ data }) {
  const role = useTypewriter(data.roles);
  const time = useClock(data.timezone);
  const [photoOK, setPhotoOK] = useState(true);

  return (
    <header className={"hero" + (photoOK ? "" : " no-photo")} id="top">
      {photoOK ? <img className="hero-photo" src={data.photo} alt={data.name} onError={() => setPhotoOK(false)} /> : <><WaveField /><GlassFlower /></>}
      <div className="hero-vignette" />
      <div className="scanline" />
      <div className="shape shape-ring1" />
      <div className="shape shape-ring2" />
      <div className="shape shape-dot" />

      <div className="hero-left">
        <div className="hero-availability"><span className="live-dot" />{data.availability}</div>
        <div className="hero-tag">{data.tag}</div>
        <h1 className="hero-hi">Hi, I'm <em>{data.name}</em></h1>
        <p className="hero-role">{role}<span className="typewriter-cur">|</span></p>
        <div className="hero-btns">
          <a href="#contact" className="btn-hire magnetic" data-label="Let's talk" {...magnetic}>
            Hire Me <span className="btn-hire-arrow">→</span>
          </a>
          <a href={data.cv} className="btn-cv magnetic" target="_blank" rel="noopener" data-label="Curriculum Vitae" {...magnetic}>Download CV</a>
        </div>
      </div>

      <div className="hero-social">
        {data.socials.map(s => (
          <a key={s.label} className="social-link" href={s.url} target="_blank" rel="noopener">{s.label}</a>
        ))}
      </div>

      <aside className="hero-right">
        <div className="expert-tag">{data.location}</div>
        <h2>{data.pitch}</h2>
        <div className="glow-line" />
        <div className="live-stats">
          <div className="live-stat"><div className="live-label">Local time</div><div className="live-value">{time}</div></div>
          <div className="live-stat"><div className="live-label">{data.heroStat.label}</div><div className="live-value">{data.heroStat.value}</div></div>
        </div>
      </aside>

      <a href="#strengths" className="scroll-cue" aria-label="Scroll down" data-label="What I'm Good At"><span /></a>
    </header>
  );
}
