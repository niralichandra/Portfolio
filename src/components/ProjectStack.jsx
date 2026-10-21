import { useRef, useState } from "react";
import { reduceMotion, tilt } from "../hooks/motion";

const FLIP_MS = 1100; // keep in sync with the deckOut / deckFlip animations in styles.css
const num = i => String(i + 1).padStart(2, "0");

/* A deck of project cards. Clicking the top card flips it over and sends it to the back;
   the panel beside it always describes whichever card is on top. */
export default function ProjectStack({ projects, logo }) {
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const [flipping, setFlipping] = useState(-1);
  const busy = useRef(false);
  const queued = useRef(false);
  const orderRef = useRef(order);
  orderRef.current = order;
  const top = order[0];
  const p = projects[top];

  const next = () => {
    if (projects.length < 2) return;
    if (reduceMotion) { setOrder(o => [...o.slice(1), o[0]]); return; }
    // A click mid-flip isn't lost — it runs as soon as this flip ends.
    if (busy.current) { queued.current = true; return; }
    busy.current = true;
    // Clear any leftover hover-tilt so the flip starts from flat.
    document.querySelector(".pcard.is-top .pcard-front")?.style.removeProperty("transform");
    setFlipping(orderRef.current[0]);
    // Halfway — while the card is out to the side — it tucks behind the deck and the others move up.
    setTimeout(() => setOrder(o => [...o.slice(1), o[0]]), FLIP_MS * 0.5);
    setTimeout(() => {
      setFlipping(-1);
      busy.current = false;
      if (queued.current) { queued.current = false; setTimeout(next, 30); }
    }, FLIP_MS);
  };

  return (
    <div className="pstack-wrap">
      {/* Any click anywhere on the stack — top card or the edges below — flips the top card. */}
      <div className="pstack" style={{ "--count": projects.length }} onClick={next}>
        {projects.map((proj, i) => {
          const pos = order.indexOf(i);
          return (
            <div
              key={i}
              className={"pcard" + (pos === 0 ? " is-top" : "") + (flipping === i ? " is-flipping" : "")}
              style={{ "--pos": pos, zIndex: projects.length - pos }}
            >
              <div className="pcard-flip">
                {/* Front */}
                <button className="pcard-face pcard-front"
                        tabIndex={pos === 0 ? 0 : -1} aria-label={`${proj.title} — show next project`} {...(pos === 0 ? tilt : {})}>
                  <div className="pcard-visual">
                    {proj.image ? <img src={proj.image} alt="" loading="lazy" /> : <div className="pcard-art"><span>{proj.title.replace(/[[\]]/g, "")[0]}</span></div>}
                    <div className="pcard-grid" />
                    <div className="pcard-light" />
                    <div className="pcard-num">{num(i)}</div>
                  </div>
                  <div className="pcard-body">
                    <div className="pcard-meta"><span>{proj.type}</span><span>{proj.year}</span></div>
                    <h3>{proj.title}</h3>
                    <p>{proj.desc}</p>
                    <div className="pcard-tags">{proj.stack.map(t => <span key={t}>{t}</span>)}</div>
                  </div>
                  <div className="pcard-hint">Click to flip <span>↻</span></div>
                </button>
                {/* Back (seen mid-flip) */}
                <div className="pcard-face pcard-back" aria-hidden="true">
                  <div className="pcard-grid" />
                  <span className="pcard-back-logo">{logo}</span>
                  <span className="pcard-back-sub">Next project →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details for the card on top; re-keyed so it animates in each time. */}
      <div className="pinfo" key={top} aria-live="polite">
        <div className="pinfo-count"><strong>{num(top)}</strong> / {String(projects.length).padStart(2, "0")}</div>
        <div className="pinfo-meta">{p.type} · {p.year}</div>
        <h3 className="pinfo-title">{p.title}</h3>
        <p className="pinfo-about">{p.about || p.desc}</p>
        {p.highlights?.length > 0 && <ul className="exp-desc pinfo-list">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>}
        <div className="chips">{p.stack.map(t => <span key={t}>{t}</span>)}</div>
        <div className="pinfo-actions">
          {p.live && <a className="btn-hire" href={p.live} target="_blank" rel="noopener" data-label={p.title}>Live demo <span className="btn-hire-arrow">↗</span></a>}
          {p.code && <a className="btn-cv" href={p.code} target="_blank" rel="noopener" data-label={p.title}>Source code</a>}
          <button className="pinfo-next" onClick={next} aria-label="Next project">Next <span>→</span></button>
        </div>
        <div className="pinfo-dots">{projects.map((_, i) => <i key={i} className={i === top ? "on" : ""} />)}</div>
      </div>
    </div>
  );
}
