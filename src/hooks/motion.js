import { useEffect, useRef, useState } from "react";

const mq = q => typeof window !== "undefined" && window.matchMedia(q).matches;
export const reduceMotion = mq("(prefers-reduced-motion: reduce)");
export const finePointer = mq("(pointer: fine)");
export const motionOK = !reduceMotion && finePointer;

/* One shared observer: adds .visible once an element is 10% on screen. */
let revealObserver;
const getRevealObserver = () =>
  (revealObserver ??= new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
    }),
    { threshold: 0.1 },
  ));

export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) { el.classList.add("visible"); return; }
    const io = getRevealObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

/* Magnetic pull towards the cursor; springs back on leave. */
export const magnetic = motionOK
  ? {
      onMouseEnter: e => { e.currentTarget.style.transition = "none"; },
      onMouseMove: e => {
        const el = e.currentTarget, r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      },
      onMouseLeave: e => {
        const el = e.currentTarget;
        el.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
        el.style.transform = "";
      },
    }
  : {};

/* 3D tilt (±2.5°) plus a spotlight that follows the cursor via --mx / --my. */
export const tilt = motionOK
  ? {
      onPointerMove: e => {
        const el = e.currentTarget, r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease-out, border-color 0.4s";
        el.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-4px)`;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      },
      onPointerLeave: e => {
        const el = e.currentTarget;
        el.style.transition = "transform 0.5s var(--ease), box-shadow 0.4s, border-color 0.4s";
        el.style.transform = "";
      },
    }
  : {};

/* Text scramble: letters resolve left to right, one every 3 ticks of 30ms. */
const SCRAMBLE = "<>/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function useScramble(text) {
  const [out, setOut] = useState(text);
  const timer = useRef();
  useEffect(() => () => clearInterval(timer.current), []);
  const run = () => {
    if (reduceMotion) return;
    let i = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setOut(text.split("").map((c, k) => (k < i ? text[k] : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join(""));
      if (i >= text.length) { clearInterval(timer.current); setOut(text); }
      i += 1 / 3;
    }, 30);
  };
  return [out, run];
}

/* Typewriter that cycles through words. */
export function useTypewriter(words) {
  const [text, setText] = useState(reduceMotion ? words[0] : "");
  useEffect(() => {
    if (reduceMotion) return;
    let w = 0, c = 0, del = false, t;
    const tick = () => {
      const word = words[w];
      setText(word.slice(0, c));
      if (!del && c === word.length) { del = true; t = setTimeout(tick, 1800); return; }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      t = setTimeout(tick, del ? 40 : 85);
    };
    t = setTimeout(tick, 1400); // start once the intro has cleared
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return new Intl.DateTimeFormat("en-IN", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
}
