import { useEffect, useRef } from "react";

/* Hero background: rows of fine lines that swell around the cursor and send ripples outward as it moves. */
const ROWS = 34;       // horizontal lines
const STEP = 8;        // px between sampled points on each line
const SWELL = 70;      // max lift right under the cursor, px
const REACH = 220;     // cursor influence radius, px
const RIPPLE_SPEED = 380, RIPPLE_LIFE = 1.6; // px/s, seconds

export default function WaveField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), t = 0;
    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, in: 0 };
    const ripples = [];
    let lastDrop = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      const inside = mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h;
      // drop a ripple every ~60px of travel, so faster movement makes more waves
      if (inside && !still && Math.hypot(mouse.x - lastDrop.x, mouse.y - lastDrop.y) > 60) {
        ripples.push({ x: mouse.x, y: mouse.y, age: 0 });
        if (ripples.length > 14) ripples.shift();
        lastDrop = { x: mouse.x, y: mouse.y };
      }
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    const draw = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!still) t += dt;
      const inside = mouse.x > -9000;
      mouse.in += ((inside ? 1 : 0) - mouse.in) * 0.08;
      if (inside) {
        if (mouse.sx < -9000) { mouse.sx = mouse.x; mouse.sy = mouse.y; }
        mouse.sx += (mouse.x - mouse.sx) * 0.12; mouse.sy += (mouse.y - mouse.sy) * 0.12;
      }
      for (let i = ripples.length - 1; i >= 0; i--) if ((ripples[i].age += dt) > RIPPLE_LIFE) ripples.splice(i, 1);

      ctx.clearRect(0, 0, w, h);
      const gap = h / (ROWS + 1);
      for (let row = 1; row <= ROWS; row++) {
        const baseY = row * gap;
        let peak = 0;
        ctx.beginPath();
        for (let x = 0; x <= w + STEP; x += STEP) {
          // calm idle swell so the field is never completely flat
          let y = baseY + Math.sin(x * 0.006 + t * 0.8 + row * 0.35) * 3 + Math.sin(x * 0.013 - t * 0.5 + row) * 1.5;
          // cursor: a smooth hill that lifts the lines up
          const d = Math.hypot(x - mouse.sx, baseY - mouse.sy);
          if (d < REACH) {
            const f = (1 - d / REACH) ** 2 * mouse.in;
            y -= f * SWELL * (0.6 + 0.4 * Math.sin(t * 3 + d * 0.04));
            peak = Math.max(peak, f);
          }
          // ripples: a travelling ring that fades as it grows
          for (const rp of ripples) {
            const ring = rp.age * RIPPLE_SPEED, dd = Math.hypot(x - rp.x, baseY - rp.y) - ring;
            if (Math.abs(dd) < 60) {
              const f = Math.cos((dd / 60) * Math.PI / 2) * (1 - rp.age / RIPPLE_LIFE);
              y -= Math.sin(dd * 0.12) * 14 * f;
              peak = Math.max(peak, f * 0.7);
            }
          }
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        // lines near the action glow red; the rest stay a faint, cooler tone
        const a = 0.1 + peak * 0.55;
        ctx.strokeStyle = peak > 0.05 ? `rgba(232, 83, 58, ${a})` : `rgba(255, 255, 255, ${0.06 + (row % 4 === 0 ? 0.04 : 0)})`;
        ctx.lineWidth = peak > 0.05 ? 1.2 : 1;
        ctx.stroke();
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(draw); }
    });
    io.observe(canvas);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-wave" aria-hidden="true" />;
}
