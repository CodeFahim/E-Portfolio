/* ==========================================================================
   terminal.js — the home page test runner.
   Runs a fake test suite about you, then accepts commands (type "help").
   Edit SUITE to change what the tests say.
   ========================================================================== */
(() => {
  "use strict";

  const body = document.getElementById("term-body");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-input");
  const rerun = document.getElementById("term-rerun");
  if (!body || !form || !input) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const SUITE = [
    { name: "builds full-stack web apps", ms: 14 },
    { name: "writes requirements before code", ms: 9 },
    { name: "tests what he ships", ms: 17 },
    { name: "publishes research (IEEE, 2026)", ms: 11 },
    { name: "starts an internship", pending: "Jan 2027" },
  ];

  let runId = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  const line = (html, cls = "") => {
    const el = document.createElement("div");
    el.className = `term-line ${cls}`.trim();
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  };

  async function typeInto(el, text, id) {
    if (reduced) { el.textContent = text; return; }
    for (const ch of text) {
      if (id !== runId) return;
      el.textContent += ch;
      await sleep(28 + Math.random() * 30);
    }
  }

  async function runSuite() {
    const id = ++runId;
    body.innerHTML = "";
    const cmd = line('<span class="t-pass">$</span> <span class="cmd"></span>');
    await typeInto(cmd.querySelector(".cmd"), "npm test fahim", id);
    await sleep(350);
    if (id !== runId) return;
    line('<span class="t-dim">&gt; jest --verbose fahim.spec.js</span>');
    await sleep(500);
    line("&nbsp;");
    line('<span class="t-badge">PASS</span> fahim.spec.js');
    line("Fahim", "indent-1");
    let passed = 0, pending = 0, total = 0;
    for (const t of SUITE) {
      await sleep(t.pending ? 650 : 380 + t.ms * 12);
      if (id !== runId) return;
      total++;
      if (t.pending) {
        pending++;
        line(`<span class="t-pending">○ ${esc(t.name)}</span> <span class="t-dim">(pending: ${esc(t.pending)})</span>`, "indent-2");
      } else {
        passed++;
        line(`<span class="term-row"><span><span class="t-pass">✓</span> ${esc(t.name)}</span><span class="ms">${t.ms} ms</span></span>`, "indent-2");
      }
    }
    await sleep(400);
    if (id !== runId) return;
    line("&nbsp;");
    line(`<span class="t-dim">Tests:</span> <span class="t-pass">${passed} passed</span>, <span class="t-pending">${pending} pending</span>, ${total} total`);
    line('<span class="t-dim">Type</span> help <span class="t-dim">to explore, or press Re-run.</span>');
  }

  /* ---------- commands ---------- */
  const COMMANDS = {
    help: () => [
      '<span class="t-accent">Commands</span>',
      "  projects   list my projects",
      "  open &lt;n&gt;     open project number n",
      "  skills     what I work with",
      "  research   my papers",
      "  about      who I am",
      "  contact    how to reach me",
      "  cv         download my CV",
      "  theme      switch light / dark",
      "  run        re-run the test suite",
      "  clear      clear the screen",
    ],
    projects: () => [
      ...PROJECTS.map((p, i) => `  <span class="t-accent">${i + 1}</span>  ${esc(p.title)} <span class="t-dim">· ${esc(p.status)}</span>`),
      '<span class="t-dim">Type</span> open 1 <span class="t-dim">to read one.</span>',
    ],
    open: (arg) => {
      const n = parseInt(arg, 10);
      const p = PROJECTS[n - 1] || PROJECTS.find((x) => x.id === arg);
      if (!p) return [`<span class="t-fail">No project "${esc(arg || "")}".</span> Try a number from 1 to ${PROJECTS.length}.`];
      setTimeout(() => (location.href = `project.html?id=${encodeURIComponent(p.id)}`), reduced ? 0 : 400);
      return [`<span class="t-dim">Opening ${esc(p.title)}…</span>`];
    },
    skills: () => SKILLS.map((g) => `  <span class="t-accent">${esc(g.group.padEnd(8))}</span>${g.items.map(esc).join(", ")}`),
    research: () => {
      const r = RESEARCH.filter((x) => !x.hidden && x.title);
      return r.length ? r.map((x) => `  <span class="t-pass">✓</span> ${esc(x.title)} <span class="t-dim">(${esc(x.venue)})</span>`) : ["  No papers listed yet."];
    },
    about: () => [
      `  ${esc(SITE.name)}`,
      `  ${esc(SITE.role)}, ${esc(SITE.university)}`,
      `  ${esc(SITE.location)}`,
      `  <span class="t-dim">More at</span> <a href="about.html">about.html</a>`,
    ],
    contact: () => [
      `  email     <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`,
      SITE.github && `  github    <a href="${esc(SITE.github)}" target="_blank" rel="noopener">${esc(SITE.github.replace(/^https?:\/\//, ""))}</a>`,
      SITE.linkedin && `  linkedin  <a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${esc(SITE.linkedin.replace(/^https?:\/\//, ""))}</a>`,
    ].filter(Boolean),
    cv: () => {
      if (!SITE.cv) return ['<span class="t-pending">CV not uploaded yet.</span> Email me and I will send it.'];
      const a = document.createElement("a");
      a.href = SITE.cv; a.download = "";
      document.body.appendChild(a); a.click(); a.remove();
      return ['<span class="t-dim">Downloading CV…</span>'];
    },
    theme: () => {
      const next = window.__currentTheme() === "dark" ? "light" : "dark";
      window.__setTheme(next);
      return [`<span class="t-dim">Theme set to ${next}.</span>`];
    },
    run: () => { runSuite(); return null; },
    clear: () => { body.innerHTML = ""; return null; },
    sudo: () => ['<span class="t-fail">Permission denied.</span> <span class="t-dim">Nice try. Hire me first.</span>'],
    hire: () => COMMANDS.contact(),
    ls: () => COMMANDS.help(),
  };

  const history = [];
  let hIndex = 0;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    runId++; // stop an animation that is still running
    history.push(raw);
    hIndex = history.length;
    line(`<span class="t-pass">$</span> ${esc(raw)}`);
    const [name, ...rest] = raw.toLowerCase().split(/\s+/);
    const fn = COMMANDS[name];
    const out = fn ? fn(rest.join(" ")) : [`<span class="t-fail">command not found: ${esc(name)}.</span> Type help to see what works.`];
    if (out) out.forEach((l) => line(l));
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || "";
    } else if (e.key === "Tab" && input.value) {
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(input.value.toLowerCase()));
      if (match) { e.preventDefault(); input.value = match; }
    }
  });

  body.addEventListener("click", (e) => {
    // desktop only: focusing on tap would pop the phone keyboard
    if (e.target.closest("a") || getSelection().toString() || !matchMedia("(pointer: fine)").matches) return;
    input.focus({ preventScroll: true });
  });
  rerun?.addEventListener("click", runSuite);

  runSuite();
})();
