/*! Beam effect adapted from "Card Beam Animation" by BL/S® Studio
 *  https://codepen.io/blacklead-studio/pen/xbwaqxE — MIT License, Copyright (c) 2026 BL/S® Studio.
 *  Full licence text: card-beam-animation/LICENSE.txt */
import { useEffect, useRef } from "react";
import { reduceMotion } from "../hooks/motion";

const FILLER = [
  "const ship = (idea) => build(idea).then(test).then(deploy);",
  "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
  "const lerp = (a, b, t) => a + (b - a) * t;",
  "// clean code • tested • reliable",
  "git commit -m \"feat: make it delightful\"",
];

const CHAR_W = 6.6; // JetBrains Mono at 11px
const LINE_H = 13;
const BASE_SPEED = 120;
const CRUISE_SPEED = 50;
const FRICTION = 0.95;

/* Fills a card-sized block with flowing code made from that strength's own snippet. */
function makeCode(lines, cols, rows) {
  const lib = [...lines, ...FILLER];
  let flow = lines.join(" ");
  while (flow.length < cols * rows + cols) flow += " " + lib[Math.floor(Math.random() * lib.length)];
  flow = flow.replace(/\s+/g, " ");
  let out = "";
  for (let r = 0; r < rows; r++) out += flow.slice(r * cols, (r + 1) * cols).padEnd(cols) + (r < rows - 1 ? "\n" : "");
  return out;
}

/* Soft round sprite used for every particle. */
function sprite(size, stops) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const h = size / 2;
  const grad = g.createRadialGradient(h, h, 0, h, h, h);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.beginPath(); g.arc(h, h, h, 0, Math.PI * 2); g.fill();
  return c;
}

/* Slow drifting dust behind the cards. */
function createDust(canvas) {
  const ctx = canvas.getContext("2d");
  const dot = sprite(64, [[0.025, "#fff"], [0.1, "hsl(195, 70%, 40%)"], [0.25, "hsl(195, 70%, 7%)"], [1, "transparent"]]);
  const N = 400, SIZE = 15;
  let w = 0, h = 0, dpr = 1, ps = [];
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!ps.length) ps = Array.from({ length: N }, () => ({
      x: Math.random() * w * 2 - w / 2, y: Math.random() * h,
      v: Math.random() * 60 + 30, a: (Math.random() * 8 + 2) / 10,
    }));
  };
  const frame = t => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    const time = t * 0.001;
    ps.forEach((p, i) => {
      p.x += p.v * 0.016;
      if (p.x > w + 100) { p.x = -100; p.y = Math.random() * h; }
      p.y += Math.sin(time + i * 0.1) * 0.5;
      const tw = Math.floor(Math.random() * 10);
      if (tw === 1) p.a = Math.max(0, p.a - 0.05); else if (tw === 2) p.a = Math.min(1, p.a + 0.05);
      ctx.globalAlpha = p.a;
      ctx.drawImage(dot, p.x - SIZE / 2, p.y - SIZE / 2, SIZE, SIZE);
    });
  };
  return { resize, frame };
}

/* The glowing beam and the sparks it throws off; it flares while a card is crossing it. */
function createBeam(canvas) {
  const ctx = canvas.getContext("2d");
  const spark = sprite(16, [[0, "rgba(255,255,255,1)"], [0.3, "rgba(255,190,170,0.85)"], [0.7, "rgba(232,83,58,0.45)"], [1, "transparent"]]);
  const BAR = 3, BASE = { intensity: 0.8, max: 800, fade: 60 }, SCAN = { intensity: 1.8, max: 2500, fade: 35 };
  let w = 0, h = 0, dpr = 1, x = 0, ps = [], glow = 1;
  const cur = { ...BASE };
  const rf = (a, b) => Math.random() * (b - a) + a;
  const state = { scanning: false };

  const spawn = () => {
    const ratio = cur.intensity / BASE.intensity;
    const sp = 1 + (ratio - 1) * 1.2, sz = 1 + (ratio - 1) * 0.7;
    const a = rf(0.6, 1);
    return { x: x + rf(-BAR / 2, BAR / 2), y: rf(0, h), vx: rf(0.2, 1) * sp, vy: rf(-0.15, 0.15) * sp, r: rf(0.4, 1) * sz,
      a, a0: a, life: 1, t: 0, decay: rf(0.005, 0.025) * (2 - ratio * 0.5), ts: rf(0.02, 0.08) * sp, ta: rf(0.1, 0.25) };
  };
  const reset = p => Object.assign(p, spawn(), { vx: rf(0.2, 1), vy: rf(-0.15, 0.15) });

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight; x = w / 2;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!ps.length) ps = Array.from({ length: BASE.max }, spawn);
  };

  const bar = () => {
    ctx.globalCompositeOperation = "lighter";
    glow += ((state.scanning ? 3.5 : 1) - glow) * 0.05;
    const layer = (half, stops, alpha, radius) => {
      const g = ctx.createLinearGradient(x - half, 0, x + half, 0);
      stops.forEach(([o, c]) => g.addColorStop(o, c));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(x - half, 0, half * 2, h, radius); ctx.fill();
    };
    layer(BAR / 2, [[0, "rgba(255,255,255,0)"], [0.3, `rgba(255,255,255,${0.9 * glow})`], [0.5, `rgba(255,255,255,${glow})`], [0.7, `rgba(255,255,255,${0.9 * glow})`], [1, "rgba(255,255,255,0)"]], 1, 15);
    layer(BAR * 2, [[0, "rgba(232,83,58,0)"], [0.5, `rgba(255,180,160,${0.8 * glow})`], [1, "rgba(232,83,58,0)"]], state.scanning ? 1 : 0.8, 25);
    layer(BAR * 4, [[0, "rgba(232,83,58,0)"], [0.5, `rgba(232,83,58,${0.4 * glow})`], [1, "rgba(232,83,58,0)"]], state.scanning ? 0.8 : 0.6, 35);
    if (state.scanning) layer(BAR * 8, [[0, "rgba(232,83,58,0)"], [0.5, "rgba(232,83,58,0.2)"], [1, "rgba(232,83,58,0)"]], 0.6, 45);

    // Fade the top and bottom of the beam.
    const v = ctx.createLinearGradient(0, 0, 0, h);
    v.addColorStop(0, "rgba(255,255,255,0)");
    v.addColorStop(cur.fade / h, "#fff");
    v.addColorStop(1 - cur.fade / h, "#fff");
    v.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.globalAlpha = 1;
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  };

  const frame = () => {
    const target = state.scanning ? SCAN : BASE;
    for (const k in cur) cur[k] += (target[k] - cur[k]) * 0.05;
    const max = Math.floor(cur.max);

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    bar();

    ctx.globalCompositeOperation = "lighter";
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.t++;
      p.a = p.a0 * p.life + Math.sin(p.t * p.ts) * p.ta;
      p.life -= p.decay;
      if (p.x > w + 10 || p.life <= 0) reset(p);
      let fade = p.y < cur.fade ? p.y / cur.fade : p.y > h - cur.fade ? (h - p.y) / cur.fade : 1;
      ctx.globalAlpha = Math.max(0, p.a * Math.max(0, Math.min(1, fade)));
      ctx.drawImage(spark, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }

    // Spawn more sparks the brighter the beam gets.
    const ratio = cur.intensity / BASE.intensity;
    const add = n => { for (let i = 0; i < n && ps.length < max; i++) ps.push(spawn()); };
    if (Math.random() < cur.intensity) add(1);
    [[1.1, 1.0, 1.2], [1.3, 1.3, 1.4], [1.5, 1.5, 1.8], [2.0, 2.0, 2.0]].forEach(([th, off, k]) => {
      if (ratio > th && Math.random() < (ratio - off) * k) add(1);
    });
    if (ps.length > max + 200) ps.length -= Math.min(15, ps.length - max);
  };

  return { resize, frame, state };
}

function Card({ s, i }) {
  return (
    <div className="beam-card-wrap">
      <div className="beam-card beam-card-normal">
        <div className="beam-card-grid" />
        <div className="beam-card-light" />
        <div className="beam-card-top">
          <span className="beam-glyph">{s.glyph}</span>
          <span className="beam-index">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <div className="beam-tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
        </div>
      </div>
      <div className="beam-card beam-card-ascii"><pre className="beam-code" data-i={i} /></div>
    </div>
  );
}

export default function StrengthsBeam({ items }) {
  const stage = useRef(null), line = useRef(null), dustCv = useRef(null), beamCv = useRef(null);

  // Enough copies of the set to always cover the stage while it loops.
  const copies = 4;

  useEffect(() => {
    if (reduceMotion) return;
    const st = stage.current, ln = line.current;
    const dust = createDust(dustCv.current), beam = createBeam(beamCv.current);
    const wraps = [...ln.children];
    const codes = [...ln.querySelectorAll(".beam-code")];

    let pos = 0, vel = BASE_SPEED, dir = -1, dragging = false, lastX = 0, mouseVel = 0;
    let setWidth = 0, cols = 0, rows = 0, raf = 0, running = false, last = performance.now();

    const fillCodes = (chance = 1) => codes.forEach(el => {
      if (Math.random() < chance) el.textContent = makeCode(items[+el.dataset.i].code, cols, rows);
    });

    const measure = () => {
      const card = wraps[0];
      const cw = card.offsetWidth, ch = card.offsetHeight;
      const gap = parseFloat(getComputedStyle(ln).columnGap) || 48;
      setWidth = (cw + gap) * items.length;
      cols = Math.ceil(cw / CHAR_W);
      rows = Math.ceil(ch / LINE_H);
      dust.resize(); beam.resize();
      fillCodes();
    };

    // Each card is split at the beam: card on the right of it, code on the left.
    const clip = () => {
      const sr = st.getBoundingClientRect();
      const bx = sr.left + sr.width / 2, bl = bx - 4, br = bx + 4;
      let scanning = false;
      for (const wrap of wraps) {
        const r = wrap.getBoundingClientRect();
        const normal = wrap.firstChild, ascii = wrap.lastChild;
        if (r.left < br && r.right > bl) {
          scanning = true;
          const il = Math.max(bl - r.left, 0), ir = Math.min(br - r.left, r.width);
          normal.style.setProperty("--clip-right", `${(il / r.width) * 100}%`);
          ascii.style.setProperty("--clip-left", `${(ir / r.width) * 100}%`);
          if (!wrap.dataset.scanned && il > 0) {
            wrap.dataset.scanned = "1";
            const fx = document.createElement("div");
            fx.className = "beam-scan-effect";
            wrap.appendChild(fx);
            setTimeout(() => fx.remove(), 600);
          }
        } else {
          const p = r.right < bl ? "100%" : "0%";
          normal.style.setProperty("--clip-right", p);
          ascii.style.setProperty("--clip-left", p);
          delete wrap.dataset.scanned;
        }
      }
      beam.state.scanning = scanning;
    };

    const place = () => {
      // Seamless loop: keep the line within one set-width of the start.
      if (pos <= -setWidth) pos += setWidth;
      else if (pos > 0) pos -= setWidth;
      ln.style.transform = `translateX(${pos}px)`;
    };

    const tick = t => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!dragging) {
        if (vel > CRUISE_SPEED) vel *= FRICTION;
        else vel += (CRUISE_SPEED - vel) * 0.05; // pick back up smoothly
        pos += vel * dir * dt;
      }
      place();
      clip();
      dust.frame(t);
      beam.frame();
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // Drag / flick with mouse or touch (vertical page scroll still works on phones).
    const down = e => { dragging = true; lastX = e.clientX; mouseVel = 0; ln.setPointerCapture(e.pointerId); ln.classList.add("dragging"); };
    const move = e => {
      // Cursor light on whichever card is under the mouse.
      const wrap = e.target.closest?.(".beam-card-wrap");
      if (wrap) {
        const r = wrap.getBoundingClientRect();
        wrap.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        wrap.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      pos += dx; mouseVel = dx * 60; lastX = e.clientX;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      ln.classList.remove("dragging");
      if (Math.abs(mouseVel) > CRUISE_SPEED) { vel = Math.abs(mouseVel); dir = mouseVel > 0 ? 1 : -1; }
      else vel = BASE_SPEED;
    };
    ln.addEventListener("pointerdown", down);
    ln.addEventListener("pointermove", move);
    ln.addEventListener("pointerup", up);
    ln.addEventListener("pointercancel", up);

    measure();
    pos = -setWidth / 2;
    place(); clip();

    // Only animate while the section is on screen.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(st);
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    const shuffle = setInterval(() => running && fillCodes(0.15), 200);

    return () => {
      stop(); io.disconnect(); ro.disconnect(); clearInterval(shuffle);
      ln.removeEventListener("pointerdown", down);
      ln.removeEventListener("pointermove", move);
      ln.removeEventListener("pointerup", up);
      ln.removeEventListener("pointercancel", up);
    };
  }, [items]);

  if (reduceMotion) {
    return (
      <div className="beam-static">
        {items.map((s, i) => <Card key={i} s={s} i={i} />)}
      </div>
    );
  }

  return (
    <div className="beam-stage" ref={stage}>
      <canvas className="beam-dust" ref={dustCv} />
      <canvas className="beam-light" ref={beamCv} />
      <div className="beam-line" ref={line}>
        {Array.from({ length: copies }).flatMap((_, c) => items.map((s, i) => <Card key={`${c}-${i}`} s={s} i={i} />))}
      </div>
      <div className="beam-hint"><span>Drag to explore</span><span>Ideas in — code out</span></div>
    </div>
  );
}
