import { useEffect, useRef } from "react";

/* Hero background: soft bubbles that drift upward and get nudged aside by the cursor. */
const COUNT = 26;

export default function Bubbles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now();
    const mouse = { x: -9999, y: -9999 };
    let bubbles = [];

    const make = (y) => {
      const r = 6 + Math.random() ** 2 * 38;
      return { x: Math.random() * w, y: y ?? h + r, r, vy: 12 + Math.random() * 22, phase: Math.random() * 6.28, ox: 0, oy: 0, red: Math.random() < 0.35 };
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bubbles.length) bubbles = Array.from({ length: COUNT }, () => make(Math.random() * h));
    };

    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    const draw = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (!still) {
          b.y -= b.vy * dt;
          b.phase += dt;
          if (b.y < -b.r * 2) { bubbles[i] = make(); continue; }
        }
        // the cursor pushes nearby bubbles away; they ease back when it leaves
        const dx = b.x + b.ox - mouse.x, dy = b.y + b.oy - mouse.y, d = Math.hypot(dx, dy), reach = 120 + b.r;
        if (d < reach && d > 0) { const f = (1 - d / reach) * 40; b.ox += (dx / d) * f * dt * 6; b.oy += (dy / d) * f * dt * 6; }
        b.ox *= 0.95; b.oy *= 0.95;

        const x = b.x + b.ox + Math.sin(b.phase) * 8, y = b.y + b.oy, r = b.r;
        const tint = b.red ? "232, 83, 58" : "255, 255, 255";
        const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
        g.addColorStop(0, `rgba(${tint}, 0.10)`);
        g.addColorStop(0.8, `rgba(${tint}, 0.03)`);
        g.addColorStop(1, `rgba(${tint}, 0.12)`);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = `rgba(${tint}, 0.22)`; ctx.lineWidth = 1; ctx.stroke();
        // small shine
        ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)"; ctx.fill();
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

  return <canvas ref={ref} className="hero-bubbles" aria-hidden="true" />;
}
