import { useEffect, useRef } from "react";

/* Hero backdrop: a small neural network drawn on canvas. Signals fire from the input layer and hop
   layer to layer along random edges; nodes flash when a signal lands and lean toward the cursor. */
const LAYERS = [4, 7, 9, 7, 3];
const RED = "232, 83, 58", CYAN = "0, 212, 255";

export default function NeuralField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, nodes = [], pulses = [], raf = 0, visible = true, last = 0;
    const mouse = { x: -1e4, y: -1e4 };

    const build = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = LAYERS.map((n, l) => Array.from({ length: n }, (_, i) => ({
        bx: w * (0.12 + 0.76 * l / (LAYERS.length - 1)),
        by: h * (0.5 + (i - (n - 1) / 2) * Math.min(0.1, 0.8 / n)),
        x: 0, y: 0, glow: 0, phase: Math.random() * Math.PI * 2,
      })));
    };

    const fire = () => {
      const from = nodes[0][Math.floor(Math.random() * nodes[0].length)];
      pulses.push({ layer: 0, from, to: pick(1), t: 0, color: Math.random() < 0.75 ? RED : CYAN });
    };
    const pick = l => nodes[l][Math.floor(Math.random() * nodes[l].length)];

    const frame = now => {
      const dt = Math.min(50, now - (last || now)); last = now;
      ctx.clearRect(0, 0, w, h);

      // positions: slow drift + a gentle pull toward the cursor
      for (const layer of nodes) for (const n of layer) {
        const drift = still ? 0 : Math.sin(now / 1400 + n.phase) * 6;
        const dx = mouse.x - n.bx, dy = mouse.y - n.by, d = Math.hypot(dx, dy), pull = Math.max(0, 1 - d / 220);
        n.x = n.bx + dx * pull * 0.18;
        n.y = n.by + drift + dy * pull * 0.18;
        n.near = pull;
        n.glow *= 0.94;
      }

      // edges
      ctx.lineWidth = 1;
      for (let l = 0; l < nodes.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) {
        const lit = Math.max(a.near, b.near);
        ctx.strokeStyle = `rgba(${RED}, ${0.07 + lit * 0.25})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // signals hop to a random node in the next layer until they reach the output
      if (!still) {
        if (Math.random() < dt / 260) fire();
        pulses = pulses.filter(p => {
          p.t += dt / 520;
          if (p.t >= 1) {
            p.to.glow = 1;
            if (p.layer + 2 >= nodes.length) return false;
            p.layer++; p.from = p.to; p.to = pick(p.layer + 1); p.t = 0;
          }
          const x = p.from.x + (p.to.x - p.from.x) * p.t, y = p.from.y + (p.to.y - p.from.y) * p.t;
          ctx.strokeStyle = `rgba(${p.color}, 0.55)`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(p.from.x, p.from.y); ctx.lineTo(x, y); ctx.stroke();
          ctx.fillStyle = `rgb(${p.color})`; ctx.shadowColor = `rgb(${p.color})`; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          return true;
        });
      }

      // nodes
      for (const layer of nodes) for (const n of layer) {
        const e = Math.max(n.glow, n.near);
        ctx.fillStyle = `rgba(${RED}, ${0.25 + e * 0.75})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 3.5 + e * 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${RED}, ${0.2 + e * 0.5})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, 9 + e * 6, 0, Math.PI * 2); ctx.stroke();
      }

      if (!still && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (still) start(); };
    const onLeave = () => { mouse.x = mouse.y = -1e4; };
    const onResize = () => { build(); start(); };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });

    build(); start(); io.observe(canvas);
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

  return <canvas ref={ref} className="hero-neural" aria-hidden="true" />;
}
