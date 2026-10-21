import { useEffect, useState } from "react";
import { magnetic, useScramble } from "../hooks/motion";

export const SECTIONS = [
  ["strengths", "Strengths"], ["experience", "Experience"], ["projects", "Projects"], ["education", "Education"],
  ["skills", "Skills"], ["achievements", "Achievements"], ["profiles", "Profiles"],
  ["leadership", "Leadership"], ["timeline", "Timeline"],
];

export default function Nav({ data, onSearch }) {
  const [logo, scramble] = useScramble(data.logo);
  const [active, setActive] = useState("");

  // Highlight the section whose top has passed 150px above the viewport top.
  useEffect(() => {
    const onScroll = () => {
      let current = "";
      SECTIONS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && scrollY > el.offsetTop - 150 && scrollY <= el.offsetTop - 150 + el.offsetHeight) current = id;
      });
      setActive(current);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav">
      <a href="#top" className="nav-logo magnetic" data-label={data.name} {...magnetic}
         onMouseEnter={e => { magnetic.onMouseEnter?.(e); scramble(); }}>{logo}</a>
      <div className="nav-links">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>{label}</a>
        ))}
      </div>
      <div className="nav-actions">
        <a className="nav-cv" href={data.cv} target="_blank" rel="noopener" data-label="Curriculum Vitae">View CV</a>
        <button className="nav-search magnetic" onClick={onSearch} aria-label="Open command menu" {...magnetic}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="nav-kbd">Ctrl K</span>
        </button>
      </div>
    </nav>
  );
}
