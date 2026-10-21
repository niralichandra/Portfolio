import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Effects";
import { reduceMotion, tilt } from "../hooks/motion";

/* Counts from 0 to `to` (ease-out) once the element scrolls into view. */
function CountUp({ to, delay = 0 }) {
  const [n, setN] = useState(reduceMotion ? to : 0);
  const ref = useRef(null);
  useEffect(() => {
    if (reduceMotion) return;
    let raf, t0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const step = t => {
        t0 ??= t + delay;
        const p = Math.min(1, Math.max(0, (t - t0) / 1600));
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, delay]);
  return <span ref={ref}>{n}</span>;
}

export default function Snapshot({ stats, now }) {
  return (
    <div className="snap">
      <div className="snap-stats">
        {stats.map((s, i) => (
          <Reveal key={s.label} variant="s" className="snap-stat card-3d" delay={i * 0.08} {...tilt}>
            <div className="snap-value"><CountUp to={s.value} delay={i * 120} /><em>{s.suffix}</em></div>
            <div className="snap-label">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <Reveal className="snap-now card-3d" delay={0.3} {...tilt}>
        <div className="snap-now-head"><span className="live-dot" /> Right now</div>
        <dl>
          {now.map(r => (
            <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
