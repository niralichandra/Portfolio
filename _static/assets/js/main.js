(function () {
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const chips = items => items && items.length ? `<div class="chips">${items.map(i => `<span>${esc(i)}</span>`).join("")}</div>` : "";

  const SECTIONS = [
    ["experience", "Experience"], ["projects", "Projects"], ["education", "Education"],
    ["skills", "Skills"], ["achievements", "Achievements"], ["profiles", "Profiles"],
    ["leadership", "Leadership"], ["timeline", "Timeline"],
  ];

  /* ── RENDER ─────────────────────────────────────────── */
  $("#navLogo").textContent = D.logo;
  $("#navLinks").innerHTML = SECTIONS.map(([id, l]) => `<a href="#${id}">${l}</a>`).join("");
  $("#navCv").href = $("#heroCv").href = D.cv;
  $("#heroAvail").textContent = D.availability;
  $("#heroTag").textContent = D.tag;
  $("#heroName").textContent = D.name;
  $("#heroLocation").textContent = D.location;
  $("#heroPitch").textContent = D.pitch;
  $("#heroStatLabel").textContent = D.heroStat.label;
  $("#heroStatValue").textContent = D.heroStat.value;
  $("#heroSocial").innerHTML = D.socials.map(s => `<a class="social-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
  $("#contactLead").textContent = D.contactLead;
  $("#contactLinks").innerHTML = D.socials.map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(s.label)}</span><span>↗</span></a>`).join("");
  $("#footTagline").textContent = D.tagline;
  $("#footCopy").textContent = `© ${new Date().getFullYear()} ${D.name}. All rights reserved.`;

  // Photo, with a monogram fallback if the file is missing.
  const photo = $("#heroPhoto");
  photo.src = D.photo;
  photo.alt = D.name;
  photo.onerror = () => { photo.remove(); $(".hero").classList.add("no-photo"); $(".hero").dataset.initial = D.name[0]; };

  const expCard = e => `
    <article class="exp-card reveal">
      <div class="exp-meta"><span>${esc(e.period)}</span><span>${esc(e.place)}</span></div>
      <div class="exp-body">
        <h3>${esc(e.role)}</h3>
        <div class="exp-org">${esc(e.org)}</div>
        <ul>${e.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        ${chips(e.stack)}
      </div>
    </article>`;
  $("#expList").innerHTML = D.experience.map(expCard).join("");
  $("#eduList").innerHTML = D.education.map(expCard).join("");

  $("#projGrid").innerHTML = D.projects.map((p, i) => `
    <article class="proj-card reveal${p.featured ? " featured" : ""}">
      <div class="proj-num">${String(i + 1).padStart(2, "0")}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      ${chips(p.stack)}
      <div class="proj-links">
        ${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Live ↗</a>` : ""}
        ${p.code ? `<a href="${esc(p.code)}" target="_blank" rel="noopener">Code ↗</a>` : ""}
      </div>
    </article>`).join("");

  $("#skillGrid").innerHTML = D.skills.map(g => `
    <div class="skill-group reveal"><h4>${esc(g.group)}</h4>${chips(g.items)}</div>`).join("");

  const infoCard = c => `
    <article class="info-card reveal">
      <div class="info-meta">${esc(c.meta)}</div>
      <h3>${esc(c.title)}</h3>
      ${c.desc ? `<p>${esc(c.desc)}</p>` : ""}
      ${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener">Verify credential ↗</a>` : ""}
    </article>`;
  $("#achGrid").innerHTML = D.achievements.map(infoCard).join("");
  $("#certGrid").innerHTML = D.certifications.map(infoCard).join("");
  $("#leadGrid").innerHTML = D.leadership.map(infoCard).join("");

  $("#tlList").innerHTML = D.timeline.map(t => `
    <li class="reveal"><span class="tl-year">${esc(t.year)}</span><div><h4>${esc(t.title)}</h4><p>${esc(t.desc)}</p></div></li>`).join("");
  $("#testiGrid").innerHTML = D.testimonials.map(t => `
    <figure class="info-card testi reveal"><blockquote>“${esc(t.quote)}”</blockquote>
    <figcaption><strong>${esc(t.who)}</strong><span>${esc(t.meta)}</span></figcaption></figure>`).join("");

  /* ── TYPED ROLE ─────────────────────────────────────── */
  (function typer() {
    const el = $("#heroRole");
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = D.roles[r];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1800); }
      if (del && c === 0) { del = false; r = (r + 1) % D.roles.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 80);
    })();
  })();

  /* ── CLOCKS ─────────────────────────────────────────── */
  const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: D.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tz = D.timezone === "Asia/Kolkata" ? "IST" : D.timezone;
  const tickClock = () => {
    const t = fmt.format(new Date());
    $("#heroClock").textContent = t;
    $("#footClock").textContent = `${t} ${tz}`;
  };
  tickClock(); setInterval(tickClock, 1000);

  /* ── CURSOR ─────────────────────────────────────────── */
  const dot = $("#cur-dot"), ring = $("#cur-ring");
  if (matchMedia("(pointer: fine)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
    (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(loop); })();
    // Magnetic hover
    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const b = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.25}px, ${(e.clientY - b.top - b.height / 2) * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  } else { dot.remove(); ring.remove(); }

  /* ── SCROLL: nav, progress, active link ─────────────── */
  const nav = $("#nav"), prog = $("#scrollProgress");
  const onScroll = () => {
    const h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 40);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const linkFor = id => $(`#navLinks a[href="#${id}"]`);
  const sio = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { $$("#navLinks a").forEach(a => a.classList.remove("active")); linkFor(en.target.id)?.classList.add("active"); }
  }), { rootMargin: "-45% 0px -50% 0px" });
  SECTIONS.forEach(([id]) => sio.observe(document.getElementById(id)));

  /* ── REVEAL ─────────────────────────────────────────── */
  const rio = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; rio.observe(el); });

  /* ── TABS ───────────────────────────────────────────── */
  $$("[data-tabs]").forEach(group => {
    const section = group.closest("section");
    $$(".tab", group).forEach(btn => btn.addEventListener("click", () => {
      $$(".tab", group).forEach(b => b.classList.toggle("active", b === btn));
      $$(".tab-panel", section).forEach(p => p.classList.toggle("active", p.dataset.panel === btn.dataset.tab));
      $$(".tab-panel.active .reveal", section).forEach(el => el.classList.add("in"));
    }));
  });

  /* ── THEME ──────────────────────────────────────────── */
  const setTheme = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t); } catch (e) {} };
  const toggleTheme = () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  $("#themeToggle").addEventListener("click", toggleTheme);

  /* ── CONTACT FORM (opens the visitor's mail app) ────── */
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = `[${f.get("type")}] from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`;
    location.href = `mailto:${D.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ── COMMAND PALETTE ────────────────────────────────── */
  const pal = $("#palette"), pin = $("#paletteInput"), plist = $("#paletteList");
  const go = id => () => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  const commands = [
    ...SECTIONS.map(([id, l]) => ({ label: `Go to ${l}`, hint: "Section", run: go(id) })),
    { label: "Contact me", hint: "Section", run: go("contact") },
    { label: "Open CV", hint: "Action", run: () => open(D.cv, "_blank") },
    { label: "Copy email", hint: "Action", run: () => navigator.clipboard?.writeText(D.email) },
    { label: "Toggle light / dark theme", hint: "Action", run: toggleTheme },
    ...D.socials.map(s => ({ label: `Open ${s.label}`, hint: "Link", run: () => open(s.url, "_blank") })),
  ];
  let sel = 0, shown = commands;
  const draw = () => {
    const q = pin.value.toLowerCase().trim();
    shown = commands.filter(c => c.label.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    plist.innerHTML = shown.length
      ? shown.map((c, i) => `<li class="${i === sel ? "sel" : ""}" data-i="${i}"><span>${esc(c.label)}</span><small>${c.hint}</small></li>`).join("")
      : `<li class="empty">No results</li>`;
  };
  const openPal = () => { pal.hidden = false; pin.value = ""; sel = 0; draw(); pin.focus(); };
  const closePal = () => { pal.hidden = true; };
  const runSel = () => { const c = shown[sel]; closePal(); c && c.run(); };
  $("#openPalette").addEventListener("click", openPal);
  pal.addEventListener("click", e => { if (e.target === pal) closePal(); });
  plist.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) { sel = +li.dataset.i; runSel(); } });
  pin.addEventListener("input", () => { sel = 0; draw(); });
  addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPal() : closePal(); return; }
    if (pal.hidden) return;
    if (e.key === "Escape") closePal();
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; draw(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; draw(); }
    else if (e.key === "Enter") runSel();
  });

  /* ── GITHUB LIVE STATS ──────────────────────────────── */
  (async function github() {
    const status = $("#ghStatus");
    if (!D.github) { status.textContent = "Add your username in data.js"; $("#ghCard").classList.add("muted-card"); return; }
    $("#ghHandle").textContent = "@" + D.github;
    $("#ghHandle").href = "https://github.com/" + D.github;
    try {
      const [u, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${D.github}`).then(r => { if (!r.ok) throw 0; return r.json(); }),
        fetch(`https://api.github.com/users/${D.github}/repos?per_page=100&sort=pushed`).then(r => { if (!r.ok) throw 0; return r.json(); }),
      ]);
      const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const last = repos[0] ? new Date(repos[0].pushed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
      $("#ghStats").innerHTML = [["Public repos", u.public_repos], ["Followers", u.followers], ["Stars earned", stars], ["Last push", last]]
        .map(([l, v]) => `<div class="live-stat"><div class="live-label">${l}</div><div class="live-value">${v}</div></div>`).join("");
      $("#ghRepos").innerHTML = repos.filter(r => !r.fork).slice(0, 4).map(r => `
        <a class="repo" href="${r.html_url}" target="_blank" rel="noopener">
          <strong>${esc(r.name)}</strong><span>${esc(r.description || "No description")}</span>
          <small>${esc(r.language || "")} ★ ${r.stargazers_count}</small></a>`).join("");
      const langs = {};
      repos.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
      const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const total = top.reduce((s, [, n]) => s + n, 0);
      const hues = ["var(--red)", "var(--cyan)", "#f5c542", "#39d353", "#a78bfa"];
      $("#ghLangBar").innerHTML = top.map(([, n], i) => `<span style="flex:${n};background:${hues[i]}"></span>`).join("");
      $("#ghLangLegend").innerHTML = top.map(([l, n], i) => `<span><i style="background:${hues[i]}"></i>${esc(l)} ${Math.round(n / total * 100)}%</span>`).join("");
      status.innerHTML = `<span class="live-dot"></span> Live`;
    } catch (e) {
      status.textContent = "Couldn't reach GitHub right now";
    }
  })();
})();
