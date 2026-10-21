import { useEffect, useRef, useState } from "react";
import { motionOK, reduceMotion, useReveal } from "../hooks/motion";

/* Wrapper that fades/slides in when scrolled into view.
   variant: "" = up, "l" = from left, "s" = scale. */
export function Reveal({ as: Tag = "div", variant = "", delay = 0, className = "", style, ...rest }) {
  const ref = useReveal();
  const cls = ["reveal" + (variant ? "-" + variant : ""), className].filter(Boolean).join(" ");
  return <Tag ref={ref} className={cls} style={delay ? { transitionDelay: `${delay}s`, ...style } : style} {...rest} />;
}

/* Dot follows the mouse exactly; ring trails behind with easing. */
export function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (!motionOK) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const move = e => {
      mx = e.clientX; my = e.clientY;
      dot.current.style.left = mx + "px"; dot.current.style.top = my + "px";
    };
    const loop = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", move);
    loop();
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  if (!motionOK) return null;
  return <><div id="cur-dot" ref={dot} /><div id="cur-ring" ref={ring} /></>;
}

export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const nav = document.getElementById("nav");
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
      nav?.classList.toggle("scrolled", scrollY > 40);
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => removeEventListener("scroll", update);
  }, []);
  return <div className="scroll-progress" ref={bar} aria-hidden="true" />;
}

/* Full-screen logo card that wipes upward on first load. */
export function PageIntro({ text }) {
  const [gone, setGone] = useState(reduceMotion);
  useEffect(() => { const t = setTimeout(() => setGone(true), 1300); return () => clearTimeout(t); }, []);
  if (gone) return null;
  return <div className="page-intro" aria-hidden="true"><span>{text}</span></div>;
}

/* Curtain that sweeps up over the page whenever a link is clicked,
   shows where you're going, then performs the navigation. */
let runTransition = (label, cb) => cb();
export const transitionTo = (label, cb) => runTransition(label, cb);

export function LinkTransition() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("Destination");

  useEffect(() => {
    const close = () => setTimeout(() => setActive(false), 180);
    runTransition = (text, cb) => {
      if (reduceMotion) { cb(); return; }
      setLabel(text || "Destination");
      setActive(true);
      setTimeout(() => { cb(); close(); }, 650);
    };

    const onClick = e => {
      const link = e.target.closest("a[href]");
      if (!link || e.defaultPrevented || link.dataset.transitionBypass === "true") return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const text = link.dataset.label || link.textContent.trim().replace(/\s+/g, " ").replace(/[↗→]/g, "").trim().slice(0, 52);

      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        runTransition(text, () => target.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }

      e.preventDefault();
      // Open the tab synchronously (inside the click) so pop-up blockers allow it.
      const tab = link.target === "_blank" ? window.open("", "_blank") : null;
      if (tab) tab.opener = null;
      runTransition(text, () => {
        if (link.hasAttribute("download")) {
          const clone = link.cloneNode(true);
          clone.dataset.transitionBypass = "true";
          clone.style.display = "none";
          document.body.appendChild(clone);
          clone.click();
          clone.remove();
        } else if (tab) tab.location.href = link.href;
        else location.href = link.href;
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={"link-transition" + (active ? " active" : "")} aria-hidden="true">
      <div className="transition-line" />
      <div className="transition-copy"><span>Opening</span><strong>{label}</strong></div>
    </div>
  );
}
