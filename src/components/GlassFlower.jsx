import { useEffect, useRef } from "react";

/* Hero centrepiece: a glossy, translucent 3D flower — two rings of glass petals, a pearl core with a sparkle
   and a thin orbit ring. It spins slowly, tilts toward the cursor and opens up as the cursor gets close.
   Drawn on a 2D canvas with a small hand-rolled 3D projection. */
const HUE = 9;          // petal hue — 9 is the site's red; try 268 for violet
const SPARKLE = "#7df3ff";
const LAYERS = [        // count, length, width, start radius, tilt toward viewer (rad), angle offset
  { n: 8, len: 1.0, wid: 0.36, r0: 0.08, tilt: 0.22, off: 0 },
  { n: 7, len: 0.72, wid: 0.34, r0: 0.06, tilt: 0.62, off: Math.PI / 7 },
];
const SAMPLES = 30;     // points around each petal outline

const rot = (p, ax, a) => {
  const c = Math.cos(a), s = Math.sin(a), [x, y, z] = p;
  if (ax === "x") return [x, y * c - z * s, y * s + z * c];
  if (ax === "y") return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
};

export default function GlassFlower() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), t = 0, spin = 0;
    const target = { yaw: -0.25, pitch: 0.4, near: 0 }, cur = { yaw: -0.25, pitch: 0.4, near: 0 };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      target.yaw = -0.25 + Math.max(-1, Math.min(1, dx)) * 0.55;
      target.pitch = 0.4 + Math.max(-1, Math.min(1, dy)) * 0.45;
      target.near = Math.max(0, 1 - Math.hypot(dx, dy) / 1.4);
    };
    const onLeave = () => { target.yaw = -0.25; target.pitch = 0.4; target.near = 0; };

    const draw = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!still) { t += dt; spin += dt * (0.12 + cur.near * 0.35); }
      for (const k of ["yaw", "pitch", "near"]) cur[k] += (target[k] - cur[k]) * 0.06;

      const cx = w / 2, cy = h / 2, scale = Math.min(w, h) * 0.44, f = 3.2;
      const view = p => rot(rot(p, "x", cur.pitch), "y", cur.yaw);
      const proj = ([x, y, z]) => { const k = f / (f - z); return [cx + x * k * scale, cy - y * k * scale]; };
      const bloom = 1 + cur.near * 0.35 + (still ? 0 : Math.sin(t * 0.9) * 0.06);
      const light = [-0.4, 0.6, 0.7];

      ctx.clearRect(0, 0, w, h);

      // soft glow behind the flower
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.3);
      glow.addColorStop(0, `hsla(${HUE}, 80%, 55%, ${0.22 + cur.near * 0.12})`);
      glow.addColorStop(1, `hsla(${HUE}, 80%, 30%, 0)`);
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

      const items = [];

      // petals
      for (const L of LAYERS) {
        for (let i = 0; i < L.n; i++) {
          const a = (i / L.n) * Math.PI * 2 + L.off + spin * (L === LAYERS[0] ? 1 : -0.6);
          const tilt = L.tilt * bloom;
          const toWorld = (u, v) => {
            // u along the petal, v across it; petals cup toward the viewer and curl a little at the tip
            const rr = u * Math.cos(tilt), z = u * Math.sin(tilt) + u * u * 0.18;
            return view(rot([rr, v, z], "z", a));
          };
          const pts = [];
          for (let s = 0; s < SAMPLES; s++) {
            const th = (s / SAMPLES) * Math.PI * 2;
            const u = L.r0 + (L.len / 2) * (1 - Math.cos(th));
            const v = (L.wid / 2) * Math.sin(th) * (0.75 + 0.25 * Math.sin(th / 2)); // slightly fuller near the tip
            pts.push(toWorld(u, v));
          }
          const base = toWorld(L.r0, 0), tip = toWorld(L.r0 + L.len, 0), side = toWorld(L.r0 + L.len / 2, L.wid / 2);
          // normal from two in-plane directions → how much this petal faces the light
          const d1 = tip.map((c, k) => c - base[k]), d2 = side.map((c, k) => c - base[k]);
          let n = [d1[1] * d2[2] - d1[2] * d2[1], d1[2] * d2[0] - d1[0] * d2[2], d1[0] * d2[1] - d1[1] * d2[0]];
          const nl = Math.hypot(...n) || 1; n = n.map(c => c / nl);
          const lit = Math.abs(n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
          const z = pts.reduce((s, p) => s + p[2], 0) / pts.length;
          items.push({ z, kind: "petal", pts, base, tip, lit, inner: L !== LAYERS[0] });
        }
      }

      // pearl core, nudged toward the viewer so it sits in front of the petal bases
      const core = view([0, 0, 0.22]);
      items.push({ z: core[2], kind: "core", c: core });

      // orbit ring around the core, split so its back half passes behind the pearl
      const ring = [];
      for (let s = 0; s <= 64; s++) {
        const th = (s / 64) * Math.PI * 2;
        ring.push(view(rot(rot([Math.cos(th) * 0.42, Math.sin(th) * 0.42, 0], "x", 1.25), "z", 0.35 + spin * 0.4).map((c, k) => c + [0, 0, 0.22][k])));
      }
      items.push({ z: core[2] - 0.01, kind: "ring", pts: ring, back: true });
      items.push({ z: core[2] + 0.01, kind: "ring", pts: ring, back: false });

      items.sort((a, b) => a.z - b.z);

      for (const it of items) {
        if (it.kind === "petal") {
          const [bx, by] = proj(it.base), [tx, ty] = proj(it.tip);
          const L = 34 + it.lit * 34 + (it.inner ? 6 : 0);
          const g = ctx.createLinearGradient(bx, by, tx, ty);
          g.addColorStop(0, `hsla(${HUE}, 75%, ${L - 14}%, 0.9)`);
          g.addColorStop(0.55, `hsla(${HUE}, 80%, ${L}%, 0.62)`);
          g.addColorStop(1, `hsla(${HUE}, 90%, ${Math.min(92, L + 26)}%, 0.5)`);
          ctx.beginPath();
          it.pts.forEach((p, k) => { const [x, y] = proj(p); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
          ctx.closePath();
          ctx.fillStyle = g; ctx.fill();
          // glassy rim + vein
          ctx.strokeStyle = `rgba(255, 240, 235, ${0.35 + it.lit * 0.35})`; ctx.lineWidth = 1.3; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty);
          ctx.strokeStyle = "rgba(255, 245, 240, 0.28)"; ctx.lineWidth = 1; ctx.stroke();
        } else if (it.kind === "ring") {
          ctx.beginPath();
          let pen = false;
          for (const p of it.pts) {
            const behind = p[2] < it.z + (it.back ? 0.01 : -0.01);
            if (behind === it.back) { const [x, y] = proj(p); pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; } else pen = false;
          }
          ctx.strokeStyle = `hsla(${HUE}, 90%, 85%, 0.7)`; ctx.lineWidth = 2; ctx.stroke();
        } else {
          const [x, y] = proj(it.c), r = scale * 0.17;
          const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
          g.addColorStop(0, "rgba(255, 250, 248, 0.98)");
          g.addColorStop(0.35, `hsla(${HUE}, 85%, 78%, 0.95)`);
          g.addColorStop(1, `hsla(${HUE}, 70%, 38%, 0.95)`);
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
          ctx.strokeStyle = "rgba(255, 245, 240, 0.5)"; ctx.lineWidth = 1; ctx.stroke();
          // four-point sparkle
          const sr = r * (0.55 + 0.1 * Math.sin(t * 2.4)), sa = t * 0.6;
          ctx.save(); ctx.translate(x, y); ctx.rotate(sa);
          ctx.shadowColor = SPARKLE; ctx.shadowBlur = 14;
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const rr = k % 2 ? sr * 0.16 : sr, an = (k / 8) * Math.PI * 2;
            k ? ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : ctx.moveTo(rr, 0);
          }
          ctx.closePath(); ctx.fillStyle = SPARKLE; ctx.fill();
          ctx.restore();
        }
      }
      if (visible && !still) raf = requestAnimationFrame(draw);
    };

    const kick = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(draw); };
    resize();
    const ro = new ResizeObserver(() => { resize(); kick(); }); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); else cancelAnimationFrame(raf); });
    io.observe(canvas);
    // with reduced motion the flower only redraws when the cursor tilts it
    const onMoveStill = e => { onMove(e); if (still) { for (let i = 0; i < 20; i++) for (const k of ["yaw", "pitch", "near"]) cur[k] += (target[k] - cur[k]) * 0.06; kick(); } };
    addEventListener("pointermove", onMoveStill, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMoveStill);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-flower" aria-hidden="true" />;
}
