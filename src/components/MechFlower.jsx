import { useEffect, useRef } from "react";

/* Hero backdrop: a blueprint-style mechanical flower on canvas. Two rings of wireframe petals bloom and
   counter-rotate around a geared hub with a degree scale; the flower opens wider as the cursor gets close. */
const RED = "232, 83, 58", CYAN = "0, 212, 255";
const TAU = Math.PI * 2;

export default function MechFlower() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = 0, spin = 0, near = 0;
    const mouse = { x: -1e4, y: -1e4 };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const line = (alpha, color = RED, width = 1) => { ctx.strokeStyle = `rgba(${color}, ${alpha})`; ctx.lineWidth = width; };
    const circle = (r, dash = []) => { ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); };

    // one wireframe petal pointing along +x: outline, midrib and cross-ribs
    const petal = (r0, len, spread, alpha, color) => {
      const cx = len * 0.55, cy = len * spread;
      line(alpha, color);
      ctx.beginPath();
      ctx.moveTo(r0, 0);
      ctx.quadraticCurveTo(cx, -cy, len, 0);
      ctx.quadraticCurveTo(cx, cy, r0, 0);
      ctx.stroke();
      line(alpha * 0.6, color);
      ctx.beginPath(); ctx.moveTo(r0, 0); ctx.lineTo(len, 0); ctx.stroke();
      for (const t of [0.3, 0.5, 0.7]) {
        // point on the curve at t, mirrored for the other side
        const x = (1 - t) ** 2 * r0 + 2 * (1 - t) * t * cx + t * t * len, y = 2 * (1 - t) * t * cy;
        ctx.beginPath(); ctx.moveTo(x, -y); ctx.lineTo(x, y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${color}, ${alpha + 0.2})`;
      ctx.beginPath(); ctx.arc(len, 0, 2, 0, TAU); ctx.fill();
    };

    const gear = (r, teeth, depth) => {
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * TAU, s = TAU / teeth;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + s * 0.15) * (r + depth), Math.sin(a + s * 0.15) * (r + depth));
        ctx.lineTo(Math.cos(a + s * 0.5) * (r + depth), Math.sin(a + s * 0.5) * (r + depth));
        ctx.lineTo(Math.cos(a + s * 0.65) * r, Math.sin(a + s * 0.65) * r);
      }
      ctx.closePath(); ctx.stroke();
    };

    const frame = now => {
      const dt = Math.min(50, now - (last || now)); last = now;
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;

      // cursor proximity eases in and out so the bloom never snaps
      const target = Math.max(0, 1 - Math.hypot(mouse.x - cx, mouse.y - cy) / (R * 1.6));
      near += (target - near) * Math.min(1, dt / 300);
      if (!still) spin += dt * (0.00012 + near * 0.0005);
      const breathe = still ? 0.6 : 0.5 + 0.5 * Math.sin(now / 2200);
      const bloom = Math.min(1, 0.35 + breathe * 0.45 + near * 0.5);

      ctx.clearRect(0, 0, w, h);
      ctx.save(); ctx.translate(cx, cy);

      // blueprint frame: crosshair, orbit rings and corner labels
      line(0.12, CYAN); ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.moveTo(-R * 1.1, 0); ctx.lineTo(R * 1.1, 0); ctx.moveTo(0, -R * 1.1); ctx.lineTo(0, R * 1.1); ctx.stroke();
      ctx.setLineDash([]);
      line(0.1); circle(R, [1, 5]); circle(R * 0.62, [6, 8]);
      ctx.font = "10px 'JetBrains Mono', monospace"; ctx.fillStyle = `rgba(${CYAN}, 0.45)`;
      ctx.fillText(`R ${Math.round(R)}`, R * 0.72, -R * 0.74);
      ctx.fillText(`θ ${String(Math.round(((spin * 180) / Math.PI) % 360)).padStart(3, "0")}°`, -R * 0.98, R * 0.8);
      ctx.fillText(`BLOOM ${bloom.toFixed(2)}`, R * 0.62, R * 0.86);

      // degree scale ring
      ctx.save(); ctx.rotate(-spin * 0.5);
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * TAU, long = i % 6 === 0, r1 = R * 0.9, r2 = r1 + (long ? 10 : 4);
        line(long ? 0.35 : 0.15);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke();
      }
      ctx.restore();

      // outer petals
      ctx.save(); ctx.rotate(spin);
      for (let i = 0; i < 8; i++) {
        ctx.save(); ctx.rotate((i / 8) * TAU);
        petal(R * 0.16, R * (0.62 + 0.24 * bloom), 0.12 + 0.2 * bloom, 0.45 + near * 0.3, RED);
        ctx.restore();
      }
      ctx.restore();

      // inner petals, offset and counter-rotating
      ctx.save(); ctx.rotate(-spin * 1.4 + TAU / 16);
      for (let i = 0; i < 8; i++) {
        ctx.save(); ctx.rotate((i / 8) * TAU);
        petal(R * 0.12, R * (0.34 + 0.12 * bloom), 0.16 + 0.18 * bloom, 0.35 + near * 0.3, CYAN);
        ctx.restore();
      }
      ctx.restore();

      // geared hub
      ctx.save(); ctx.rotate(spin * 2.2);
      line(0.6); gear(R * 0.13, 18, 5);
      ctx.restore();
      line(0.5); circle(R * 0.085);
      line(0.3, CYAN); circle(R * 0.05);
      ctx.save(); ctx.rotate(-spin * 3);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        ctx.fillStyle = `rgba(${RED}, 0.7)`;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.068, Math.sin(a) * R * 0.068, 1.6, 0, TAU); ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = `rgb(${RED})`; ctx.shadowColor = `rgb(${RED})`; ctx.shadowBlur = 16 + near * 20;
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      if (!still && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (still) start(); };
    const onLeave = () => { mouse.x = mouse.y = -1e4; };
    const onResize = () => { resize(); start(); };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });

    resize(); start(); io.observe(canvas);
    addEventListener("resize", onResize);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-flower" aria-hidden="true" />;
}
