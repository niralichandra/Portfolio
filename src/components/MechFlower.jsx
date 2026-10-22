import { useEffect, useRef } from "react";

/* Hero backdrop: a 3D mechanical flower (three.js, loaded lazily). Two rings of brushed-metal petals with a
   glowing technical wireframe bloom open toward the viewer around a steel gear hub; the whole flower tilts
   toward the cursor and opens wider as it gets close. */
const RED = 0xe8533a, CYAN = 0x00d4ff;

export default function MechFlower() {
  const ref = useRef(null);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    Promise.all([import("three"), import("three/examples/jsm/environments/RoomEnvironment.js")]).then(([THREE, { RoomEnvironment }]) => {
      if (cancelled) return;
      const canvas = ref.current;
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 7.5);

      scene.add(new THREE.AmbientLight(0xffffff, 0.15));
      const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2, 3, 5); scene.add(key);
      const redLight = new THREE.PointLight(RED, 30, 12); redLight.position.set(-3, 1.5, 2.5); scene.add(redLight);
      const cyanLight = new THREE.PointLight(CYAN, 20, 12); cyanLight.position.set(3, -2, 2); scene.add(cyanLight);

      const disposables = [];
      const keep = x => (disposables.push(x), x);

      const flower = new THREE.Group();
      scene.add(flower);

      // a petal is a flattened ellipsoid whose base sits on the pivot, plus a wireframe skin and a midrib
      const petalGeo = keep(new THREE.SphereGeometry(1, 32, 16));
      const ribGeo = keep(new THREE.CylinderGeometry(0.012, 0.012, 1, 6));
      const tipGeo = keep(new THREE.SphereGeometry(0.035, 12, 8));
      const makeRing = ({ count, length, width, color, offset }) => {
        const metal = keep(new THREE.MeshStandardMaterial({ color: 0x1c1c1f, metalness: 0.9, roughness: 0.32, emissive: color, emissiveIntensity: 0.06 }));
        const wire = keep(new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 }));
        const glow = keep(new THREE.MeshBasicMaterial({ color }));
        const ring = new THREE.Group();
        const hinges = [];
        for (let i = 0; i < count; i++) {
          const spoke = new THREE.Group();
          spoke.rotation.z = (i / count) * Math.PI * 2 + offset;
          const hinge = new THREE.Group();
          const body = new THREE.Group();
          body.position.y = length / 2 + 0.28;
          const shell = new THREE.Mesh(petalGeo, metal); shell.scale.set(width, length / 2, 0.05);
          const skin = new THREE.Mesh(petalGeo, wire); skin.scale.set(width * 1.01, length / 2 * 1.01, 0.055);
          const rib = new THREE.Mesh(ribGeo, glow); rib.scale.y = length; rib.position.z = 0.052;
          const tip = new THREE.Mesh(tipGeo, glow); tip.position.y = length / 2;
          body.add(shell, skin, rib, tip);
          hinge.add(body); spoke.add(hinge); ring.add(spoke);
          hinges.push(hinge);
        }
        flower.add(ring);
        return { ring, hinges };
      };
      const outer = makeRing({ count: 8, length: 1.7, width: 0.3, color: RED, offset: 0 });
      const inner = makeRing({ count: 8, length: 0.95, width: 0.19, color: CYAN, offset: Math.PI / 8 });
      inner.ring.position.z = 0.12;

      // gear hub: extruded toothed disc with a bore, bolts and a glowing core
      const shape = new THREE.Shape();
      const teeth = 18, r = 0.3, d = 0.07;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2, s = (Math.PI * 2) / teeth;
        const pts = [[a, r], [a + s * 0.15, r + d], [a + s * 0.5, r + d], [a + s * 0.65, r]];
        pts.forEach(([ang, rad], j) => (i === 0 && j === 0 ? shape.moveTo : shape.lineTo).call(shape, Math.cos(ang) * rad, Math.sin(ang) * rad));
      }
      const bore = new THREE.Path(); bore.absarc(0, 0, 0.13, 0, Math.PI * 2, true); shape.holes.push(bore);
      const steel = keep(new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 1, roughness: 0.25 }));
      const gearGeo = keep(new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 }));
      gearGeo.center();
      const gear = new THREE.Mesh(gearGeo, steel); gear.position.z = 0.2;
      const gearEdges = new THREE.LineSegments(keep(new THREE.EdgesGeometry(gearGeo, 30)), keep(new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.6 })));
      gear.add(gearEdges);
      flower.add(gear);

      const bolts = new THREE.Group(); bolts.position.z = 0.29;
      const boltGeo = keep(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 10));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, steel); bolt.rotation.x = Math.PI / 2; bolt.position.set(Math.cos(a) * 0.21, Math.sin(a) * 0.21, 0);
        bolts.add(bolt);
      }
      flower.add(bolts);

      const coreMat = keep(new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 2.2, roughness: 0.4 }));
      const core = new THREE.Mesh(keep(new THREE.SphereGeometry(0.1, 24, 16)), coreMat); core.position.z = 0.3;
      flower.add(core);

      // technical rings: a ticked dial and a dashed orbit
      const dial = new THREE.Group();
      const tickMat = keep(new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.45 }));
      const tickLong = keep(new THREE.BoxGeometry(0.012, 0.14, 0.012)), tickShort = keep(new THREE.BoxGeometry(0.008, 0.06, 0.008));
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2, long = i % 6 === 0;
        const t = new THREE.Mesh(long ? tickLong : tickShort, tickMat);
        t.position.set(Math.cos(a) * 2.35, Math.sin(a) * 2.35, 0); t.rotation.z = a - Math.PI / 2;
        dial.add(t);
      }
      const orbit = new THREE.Mesh(keep(new THREE.TorusGeometry(2.2, 0.004, 6, 160)), keep(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.3 })));
      dial.add(orbit);
      flower.add(dial);

      // ── loop ──
      const mouse = { x: 0, y: 0, active: false };
      let near = 0, spin = 0, last = 0, raf = 0, visible = true;

      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w < h ? 44 : 32; // phones are portrait; zoom out so the flower still fits
        camera.updateProjectionMatrix();
      };

      const frame = now => {
        const dt = Math.min(50, now - (last || now)); last = now;
        const dist = mouse.active ? Math.hypot(mouse.x, mouse.y) : 2;
        near += (Math.max(0, 1 - dist / 1.4) - near) * Math.min(1, dt / 300);
        if (!still) spin += dt * (0.00012 + near * 0.0005);
        const breathe = still ? 0.6 : 0.5 + 0.5 * Math.sin(now / 2200);
        const bloom = Math.min(1, 0.3 + breathe * 0.45 + near * 0.5);

        outer.ring.rotation.z = spin;
        inner.ring.rotation.z = -spin * 1.4;
        outer.hinges.forEach(h => (h.rotation.x = 0.15 + bloom * 0.75));
        inner.hinges.forEach(h => (h.rotation.x = 0.35 + bloom * 0.6));
        gear.rotation.z = spin * 2.2;
        bolts.rotation.z = spin * 2.2;
        dial.rotation.z = -spin * 0.5;
        coreMat.emissiveIntensity = 1.8 + near * 2.5 + (still ? 0 : Math.sin(now / 400) * 0.3);

        // tilt toward the cursor, with a slow idle sway
        const tx = (mouse.active ? -mouse.y * 0.35 : 0) + (still ? 0 : Math.sin(now / 3100) * 0.08) - 0.25;
        const ty = (mouse.active ? mouse.x * 0.45 : 0) + (still ? 0 : Math.cos(now / 2700) * 0.1);
        flower.rotation.x += (tx - flower.rotation.x) * Math.min(1, dt / 250);
        flower.rotation.y += (ty - flower.rotation.y) * Math.min(1, dt / 250);

        renderer.render(scene, camera);
        if (!still && visible) raf = requestAnimationFrame(frame);
      };

      const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
      const onMove = e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        mouse.active = true;
        if (still) start();
      };
      const onLeave = () => { mouse.active = false; };
      const ro = new ResizeObserver(() => { resize(); start(); });
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });

      resize(); start(); ro.observe(canvas); io.observe(canvas);
      addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        disposables.forEach(x => x.dispose());
        scene.environment.dispose(); pmrem.dispose(); renderer.dispose();
      };
    });

    return () => { cancelled = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="hero-flower" aria-hidden="true" />;
}
